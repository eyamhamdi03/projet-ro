from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.routers import resources_router, demands_router, solve_router
from backend.solver import solve_allocation

app = FastAPI()

@app.post("/solve")
async def solve(request: List[str]):
    result = await solve_allocation(request)
    return result

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resources_router)
app.include_router(demands_router)
app.include_router(solve_router)
