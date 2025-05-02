from typing import List, Optional
from pydantic import BaseModel, Field

class Resource(BaseModel):
    name: str
    capacity: int
    available_slots: List[str]  # Example: ["08:00", "09:00", "10:00"]

    class Config:
        # This ensures that the `id` field is excluded when sending data for insertion
        orm_mode = True


class Demand(BaseModel):
    name: str
    required_capacity: int
    duration: int  # number of time units
    earliest_start: str  # example: "09:00"
    profit: float
    incompatible_resources: Optional[List[str]] = []

    class Config:
        orm_mode = True


class AllocationInput(BaseModel):
    demands: List[Demand]
    resources: List[Resource]
    time_slots: List[str]  # Example: ["08:00", "09:00", ..., "17:00"]
