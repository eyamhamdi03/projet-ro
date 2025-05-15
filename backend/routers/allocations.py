# backend/routes/allocations.py
from datetime import datetime
from fastapi import APIRouter
from backend.solver import solve_allocation
from backend.database import allocation_collection
from backend.models import AllocationResult
from typing import List


router = APIRouter(prefix="/solve", tags=["solve"])
from backend.models import SolveRequest


@router.post("/", response_model=AllocationResult)
async def post_solve(data: SolveRequest):
    return await solve_allocation(data.time_slots)


import pprint

@router.get("/allocations", response_model=List[AllocationResult])
async def get_allocations():
    docs = await allocation_collection.find().sort("timestamp", -1).to_list(100)

    cleaned_docs = []
    for doc in docs:
        doc.pop("_id", None)

        # Convert datetime to string
        if isinstance(doc.get("timestamp"), datetime):
            doc["timestamp"] = doc["timestamp"].isoformat()

        cleaned_docs.append(doc)

    return cleaned_docs

