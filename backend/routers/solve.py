import asyncio
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import Dict, List
from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
from backend.models import AllocationInput, OptimizationResponse, Product, ProductionRequest, Shape
from backend.routers.shapes import add_shape, get_shapes
from backend.solver import  solve_allocation, solve_cutting_problem, solve_optimization
from backend.database import shapes_collection,history_collection,product_collection

router = APIRouter(prefix="/solve", tags=["Solver"])
executor = ThreadPoolExecutor(max_workers=1)

@router.post("/")
async def solve(input_data: AllocationInput):
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(executor, solve_allocation, input_data)
    return result





@router.post("/solveProduction", response_model=OptimizationResponse)
async def solve_production_problem(payload: ProductionRequest = Body(...)):
    try:
        products = payload.products
        deadline = payload.deadline

        # Appelle ta fonction d'optimisation
        result: OptimizationResponse = solve_optimization(products, deadline)

        # Sauvegarde dans history_collection
        await history_collection.insert_one({
            "input": [p.dict() for p in products],
            "result": result.dict(),
            "deadline": deadline.isoformat(),
            "created_at": datetime.utcnow()
        })

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/history/latest", response_model=OptimizationResponse)
async def get_latest_optimization_result():
    latest_entry = await history_collection.find_one(sort=[("_id", -1)])
    if not latest_entry:
        raise HTTPException(status_code=404, detail="No history found")
    return latest_entry["result"]
