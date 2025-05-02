from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import resources_router, demands_router, solve_router

app = FastAPI()

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
