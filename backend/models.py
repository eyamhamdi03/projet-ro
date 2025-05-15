from datetime import datetime
from typing import List, Optional, Tuple
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

class AllocationEntry(BaseModel):
    demand: str
    resource: str
    start: str
    end: str
    profit: float
class AllocationResult(BaseModel):
    timestamp: datetime
    time_slots: List[str]
    allocations: List[AllocationEntry]
    total_profit: float
    utilization: float

    class Config:
        orm_mode = True
class SolveRequest(BaseModel):
    time_slots: List[str]
class Shape(BaseModel):
    width: int
    height: int
    quantity: int



from pydantic import BaseModel, Field
from typing import List

class Product(BaseModel):
    name: str
    unit_profit: float
    unit_cost: float
    min_production: int
    max_production: int
    max_per_day: int  # nouvelle contrainte par jour

class ProductionRequest(BaseModel):
    products: List[Product]
    deadline: datetime

class ProductionResult(BaseModel):
    name: str
    quantity: int
    unit_profit: float
    max_production: int

class OptimizationResponse(BaseModel):
    results: List[ProductionResult]
    total_profit: float
