import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.models import AllocationInput
from backend.solver import solve_allocation  

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

executor = ThreadPoolExecutor(max_workers=1)

@app.post("/solve")
async def solve(input_data: AllocationInput):
    try:
        loop = asyncio.get_running_loop()
        # Exécution du solveur dans un thread séparé
        result = await loop.run_in_executor(executor, solve_allocation, input_data)
        return result
    except Exception as e:
        return {"error": str(e)}
 
