from fastapi import APIRouter, HTTPException
from backend.models import Resource
from backend.database import resource_collection
from bson import ObjectId

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.post("/")
async def create_resource(resource: Resource):
    result = await resource_collection.insert_one(resource.dict())
    created_resource = await resource_collection.find_one({"_id": result.inserted_id})
    created_resource["id"] = str(created_resource["_id"])
    del created_resource["_id"]
    return created_resource

@router.get("/")
async def get_resources():
    resources = await resource_collection.find().to_list(length=100)
    for resource in resources:
        resource["id"] = str(resource["_id"])
        del resource["_id"]
    return resources

@router.get("/{resource_id}")
async def get_resource(resource_id: str):
    resource = await resource_collection.find_one({"_id": ObjectId(resource_id)})
    if resource:
        resource["id"] = str(resource["_id"])
        del resource["_id"]
        return resource
    raise HTTPException(status_code=404, detail="Resource not found")

@router.delete("/{resource_id}")
async def delete_resource(resource_id: str):
    result = await resource_collection.delete_one({"_id": ObjectId(resource_id)})
    if result.deleted_count == 1:
        return {"message": "Resource deleted successfully"}
    raise HTTPException(status_code=404, detail="Resource not found")
