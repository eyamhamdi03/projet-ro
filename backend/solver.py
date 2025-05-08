from pydantic import BaseModel
from typing import List
import gurobipy as gp
from gurobipy import GRB
from backend.database import demand_collection, resource_collection, allocation_collection
from datetime import datetime, timedelta
from backend.models import AllocationResult, AllocationEntry


def parse_time(time_str: str) -> int:
    """Convertit HH:MM en minutes"""
    hh, mm = map(int, time_str.split(':'))
    return hh * 60 + mm


def expand_time_range(range_str: str) -> List[str]:
    """Transforme une plage horaire '08:00-10:00' en ['08:00', '09:00']"""
    start_str, end_str = range_str.split("-")
    start = datetime.strptime(start_str, "%H:%M")
    end = datetime.strptime(end_str, "%H:%M")

    slots = []
    while start + timedelta(hours=1) <= end:
        slots.append(start.strftime("%H:%M"))
        start += timedelta(hours=1)
    return slots


async def fetch_all_demands():
    return await demand_collection.find().to_list(1000)


async def fetch_all_resources():
    return await resource_collection.find().to_list(1000)


async def solve_allocation(time_slots: List[str]):
    try:
        demands = await fetch_all_demands()
        resources = await fetch_all_resources()

        for r in resources:
            expanded = []
            for s in r["available_slots"]:
                if "-" in s:
                    expanded.extend(expand_time_range(s))
                else:
                    expanded.append(s)
            r["available_slots"] = expanded

        model = gp.Model("resource_allocation")
        model.setParam("OutputFlag", 0)

        D = demands
        R = resources
        H = list(range(len(time_slots)))

        d_ids = [str(d["_id"]) for d in D]
        r_ids = [str(r["_id"]) for r in R]
        x = model.addVars(d_ids, r_ids, H, vtype=GRB.BINARY, name="x")

        for d in D:
            model.addConstr(
                gp.quicksum(
                    x[str(d["_id"]), str(r["_id"]), h]
                    for r in R
                    for h in H
                    if h + d["duration"] <= len(time_slots)
                ) <= 1
            )

        for d in D:
            earliest_idx = time_slots.index(d["earliest_start"])
            for r in R:
                for h in H:
                    if (
                        h < earliest_idx or
                        h + d["duration"] > len(time_slots) or
                        r["capacity"] < d["required_capacity"] or
                        str(r["_id"]) in d.get("incompatible_resources", [])
                    ):
                        model.addConstr(x[str(d["_id"]), str(r["_id"]), h] == 0)

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

        model.setObjective(
            gp.quicksum(x[str(d["_id"]), str(r["_id"]), h] * d["profit"]
                        for d in D for r in R for h in H),
            GRB.MAXIMIZE
        )

        model.optimize()

        if model.status != GRB.OPTIMAL:
            return {"error": "No optimal solution"}

        allocations = []
        for d in D:
            for r in R:
                for h in H:
                    if h + d["duration"] <= len(time_slots) and x[str(d["_id"]), str(r["_id"]), h].X > 0.5:
                        allocations.append(AllocationEntry(
                            demand=d["name"],
                            resource=r["name"],
                            start=time_slots[h],
                            end=time_slots[h + d["duration"]],
                            profit=d["profit"]
                        ))

        result = AllocationResult(
            timestamp=datetime.utcnow(),
            time_slots=time_slots,
            allocations=allocations,
            total_profit=sum(a.profit for a in allocations),
            utilization=len(allocations) / len(D) if D else 0
        )

        # Sauvegarde dans Mongo
        await allocation_collection.insert_one(result.dict(by_alias=True))
        return result.dict()

    except Exception as e:
        return {"error": str(e)}