from typing import List, Optional
from pydantic import BaseModel

# Définition des modèles de données
class Resource(BaseModel):
    id: str
    name: str
    capacity: int
    available_slots: List[str]  # Exemple: ["08:00", "09:00", "10:00"]


class Demand(BaseModel):
    id: str
    name: str
    required_capacity: int
    duration: int  # nombre d'unités de temps
    earliest_start: str  # exemple: "09:00"
    profit: float
    incompatible_resources: Optional[List[str]] = []

class AllocationInput(BaseModel):
    demands: List[Demand]
    resources: List[Resource]
    time_slots: List[str]  # Exemple: ["08:00", "09:00", ..., "17:00"]