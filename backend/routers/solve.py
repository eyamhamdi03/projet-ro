import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter
from backend.models import AllocationInput
from backend.solver import solve_allocation

router = APIRouter(prefix="/solve", tags=["Solver"])
executor = ThreadPoolExecutor(max_workers=1)

@router.post("/")
async def solve(input_data: AllocationInput):
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(executor, solve_allocation, input_data)
    return result
