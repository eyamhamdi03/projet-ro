from pydantic import BaseModel
from typing import List, Optional
import gurobipy as gp
from gurobipy import GRB
from backend.database import demand_collection ,resource_collection
async def fetch_all_demands():
    demands = await demand_collection.find().to_list(1000)
    return demands

async def fetch_all_resources():
    resources = await resource_collection.find().to_list(1000)
    return resources

def parse_time(time_str: str) -> int:
    """Convertit 'HH:MM' en minutes depuis minuit pour le tri"""
    hh, mm = map(int, time_str.split(':'))
    return hh * 60 + mm


async def solve_allocation(time_slots: List[str]):
    try:
        # Fetch demands and resources from the database
        demands = await fetch_all_demands()
        resources = await fetch_all_resources()

        # Check if time_slots is empty
        if not time_slots:
            return {"error": "Time slots list cannot be empty"}

        # Check for valid time format
        try:
            [parse_time(slot) for slot in time_slots]
        except ValueError as e:
            return {"error": f"Invalid time format: {str(e)}"}

        model = gp.Model("resource_allocation")
        model.setParam("OutputFlag", 0)

        D = demands
        R = resources
        H = list(range(len(time_slots)))

        # Validate demands
        for d in D:
            if d["earliest_start"] not in time_slots:
                return {"error": f"Demand {d['name']}: earliest_start {d['earliest_start']} not in time_slots"}
            if d["duration"] <= 0:
                return {"error": f"Demand {d['name']}: duration must be positive"}

        d_ids = [str(d["_id"]) for d in D]
        r_ids = [str(r["_id"]) for r in R]


        x = model.addVars(d_ids, r_ids, H, vtype=GRB.BINARY, name="x")

        # Contrainte 1 : chaque demande allouée au plus une fois
        for d in D:
            model.addConstr(
                gp.quicksum(
                    x[str(d["_id"]), str(r["_id"]), h]
                    for r in R
                    for h in H
                    if h + d["duration"] <= len(time_slots)
                ) <= 1
            )

        # Contrainte 2 : validité des allocations
        for d in D:
            earliest_idx = time_slots.index(d["earliest_start"])
            for r in R:
                for h in H:
                    invalid = (
                        h < earliest_idx or
                        h + d["duration"] > len(time_slots) or
                        r["capacity"] < d["required_capacity"] or
                        any(ir in str(r["_id"]) for ir in d["incompatible_resources"])
                    )
                    if invalid:
                        model.addConstr(x[str(d["_id"]), str(r["_id"]), h] == 0)

        # Contrainte 3 : respect des créneaux disponibles
        for r in R:
            available_set = set(r["available_slots"])
            for d in D:
                for h in H:
                    if h + d["duration"] > len(time_slots):
                        model.addConstr(x[str(d["_id"]), str(r["_id"]), h] == 0)
                    else:
                        needed = time_slots[h:h + d["duration"]]
                        if not all(t in available_set for t in needed):
                            model.addConstr(x[str(d["_id"]), str(r["_id"]), h] == 0)

        # Contrainte 4 : non-chevauchement sur une même ressource
        for r in R:
            for h in H:
                model.addConstr(
                    gp.quicksum(
                        x[str(d["_id"]), str(r["_id"]), h2]
                        for d in D
                        for h2 in range(
                            max(0, h - d["duration"] + 1),
                            min(h + 1, len(time_slots) - d["duration"] + 1)
                        )
                        if h in range(h2, h2 + d["duration"])
                    ) <= 1
                )

        # Objectif : maximiser le profit
        model.setObjective(
            gp.quicksum(x[str(d["_id"]), str(r["_id"]), h] * d["profit"] for d in D for r in R for h in H),
            GRB.MAXIMIZE
        )

        model.optimize()

        if model.status != GRB.OPTIMAL:
            return {"error": f"No optimal solution found. Status: {model.status}"}

        # Résultats
        allocations = []
        for d in D:
            for r in R:
                for h in H:
                    if h + d["duration"] <= len(time_slots) and x[str(d["_id"]),str( r["_id"]), h].X > 0.5:
                        allocations.append({
                            "demand": d["name"],
                            "resource": r["name"],
                            "start": time_slots[h],
                            "end": time_slots[min(h + d["duration"], len(time_slots) - 1)],
                            "profit": d["profit"]
                        })

        return {
            "time_slots": time_slots,
            "allocations": allocations,
            "total_profit": sum(a["profit"] for a in allocations),
            "utilization": len(allocations) / len(D) if D else 0
        }

    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}
