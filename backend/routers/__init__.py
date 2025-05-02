# backend/routers/__init__.py

from .resources import router as resources_router
from .demands import router as demands_router
from .solve import router as solve_router

__all__ = ["resources_router", "demands_router", "solve_router"]
