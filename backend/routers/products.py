# backend/routers/products.py

from fastapi import APIRouter, HTTPException
from typing import List
from backend.database import product_collection
from backend.models import Product

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=List[Product])
async def get_products():
    try:
        # Exclure _id sinon Pydantic va râler
        cursor = product_collection.find({}, {"_id": 0})
        products = [doc async for doc in cursor]
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from bson import ObjectId

@router.post("/")
async def add_product(product: Product):
    try:
        product_dict = product.dict()
        result = await product_collection.insert_one(product_dict)

        # Prépare la réponse sans l'_id
        product_dict["_id"] = str(result.inserted_id)  # si tu veux l'afficher en string, sinon enlève cette ligne
        return {"message": "Product added successfully", "product": product_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding product: {str(e)}")
from fastapi import status

@router.delete("/{name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(name: str):
    try:
        result = await product_collection.delete_one({"name": name})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail=f"Produit '{name}' non trouvé")
        return
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression du produit : {str(e)}")
