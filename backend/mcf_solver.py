from gurobipy import Model, GRB, quicksum
from backend.models import MCFRequest

def solve_min_cost_flow(data: MCFRequest):
    nodes = data.nodes
    edges = data.edges
    b_values = data.b_values

    model = Model("min_cost_flow")
    model.setParam("OutputFlag", 0)  # Suppress Gurobi output

    flow_vars = {}
    for i, edge in enumerate(edges):
        flow_vars[i] = model.addVar(lb=0, ub=edge.capacity, obj=edge.cost, vtype=GRB.CONTINUOUS)

    # Flow conservation constraints
    for idx, node in enumerate(nodes):
        model.addConstr(
            quicksum(flow_vars[i] for i, edge in enumerate(edges) if edge.from_node == node) -
            quicksum(flow_vars[i] for i, edge in enumerate(edges) if edge.to_node == node)
            == b_values[idx]
        )

    model.optimize()

    if model.Status == GRB.OPTIMAL:
        result = {
            "status": "success",
            "total_cost": round(model.ObjVal, 2),
            "flows": []
        }

        for i, edge in enumerate(edges):
            flow = flow_vars[i].X
            result["flows"].append({
                "from": edge.from_node,
                "to": edge.to_node,
                "flow": round(flow, 2),
                "capacity": edge.capacity,
                "cost": edge.cost,
                "flow_cost": round(flow * edge.cost, 2)
            })

        return result
    else:
        return {"status": "failed", "message": f"Gurobi status code: {model.Status}"}
