from fastapi import APIRouter
from backend.models import MCFRequest
from backend.mcf_solver import solve_min_cost_flow

router = APIRouter()

@router.post("/solve_mcf")
def solve_mcf_route(data: MCFRequest):
    return solve_min_cost_flow(data)
