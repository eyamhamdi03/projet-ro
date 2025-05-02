from fastapi import APIRouter, HTTPException
from backend.models import Demand
from backend.database import demand_collection
from bson import ObjectId

router = APIRouter(prefix="/demands", tags=["Demands"])

@router.post("/")
async def create_demand(demand: Demand):
    result = await demand_collection.insert_one(demand.dict())
    created_demand = await demand_collection.find_one({"_id": result.inserted_id})
    created_demand["id"] = str(created_demand["_id"])
    del created_demand["_id"]
    return created_demand

@router.get("/")
async def get_demands():
    demands = await demand_collection.find().to_list(length=100)
    for demand in demands:
        demand["id"] = str(demand["_id"])
        del demand["_id"]
    return demands

@router.get("/{demand_id}")
async def get_demand(demand_id: str):
    demand = await demand_collection.find_one({"_id": ObjectId(demand_id)})
    if demand:
        demand["id"] = str(demand["_id"])
        del demand["_id"]
        return demand
    raise HTTPException(status_code=404, detail="Demand not found")

@router.delete("/{demand_id}")
async def delete_demand(demand_id: str):
    result = await demand_collection.delete_one({"_id": ObjectId(demand_id)})
    if result.deleted_count == 1:
        return {"message": "Demand deleted successfully"}
    raise HTTPException(status_code=404, detail="Demand not found")
