from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_URL)
db = client["ro-project"]
resource_collection = db["ressource"]
demand_collection = db["demand"]
allocation_collection = db["allocation"]
shapes_collection = db["shapes"]
product_collection = db["products"]
history_collection = db["history"]

