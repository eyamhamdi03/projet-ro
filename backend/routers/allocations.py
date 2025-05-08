# backend/routes/allocations.py
from fastapi import APIRouter
from backend.solver import solve_allocation
from backend.database import allocation_collection
from backend.models import AllocationResult
from typing import List

router = APIRouter()

router = APIRouter(prefix="/solve", tags=["solve"])
from backend.models import SolveRequest


@router.post("/", response_model=AllocationResult)
async def post_solve(data: SolveRequest):
    return await solve_allocation(data.time_slots)


@router.get("/allocations", response_model=List[AllocationResult])
async def get_allocations():
    docs = await allocation_collection.find().sort("timestamp", -1).to_list(100)
    return docs
