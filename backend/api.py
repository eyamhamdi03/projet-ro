from typing import Any, Dict, List
from django.db import router
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.routers import products, resources_router, demands_router, solve_router,allocations

from backend.routers.shapes import router as shape_router



app = FastAPI()



latest_result: Dict[str, Any] = {}


app.include_router(allocations.router)
app.include_router(resources_router)
app.include_router(demands_router)
app.include_router(solve_router)
app.include_router(shape_router)
app.include_router(products.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ou ["*"] pour tout autoriser temporairement
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

