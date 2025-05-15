from typing import List
from fastapi import APIRouter
from backend.database import shapes_collection
from backend.models import Shape

router = APIRouter(prefix="/shape", tags=["Shape"])

@router.post("/add_shape")
async def add_shape(shape: Shape):
    shape_data = shape.dict()
    shapes_collection.insert_one(shape_data)
    return {"message": "Shape added successfully"}



@router.get("/shapes")
async def get_shapes():
    shapes_cursor = shapes_collection.find({}, {"_id": 0})
    shapes = [doc async for doc in shapes_cursor]
    return shapes
