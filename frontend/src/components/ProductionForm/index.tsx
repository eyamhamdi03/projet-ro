"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Product = {
  name: string;
  unitProfit: number;
  unitCost: number;
  minProduction: number;
  maxProduction: number;
};

export default function ProductionFormComponent() {
  const [products, setProducts] = useState<Product[]>([
    {
      name: "",
      unitProfit: 0,
      unitCost: 0,
      minProduction: 0,
      maxProduction: 100,
    },
  ]);

  const handleChange = <K extends keyof Product>(
    index: number,
    field: K,
    value: Product[K],
  ) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        name: "",
        unitProfit: 0,
        unitCost: 0,
        minProduction: 0,
        maxProduction: 100,
      },
    ]);
  };

  const handleSubmit = async () => {
    const res = await fetch("http://127.0.0.1:8000/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    });

    const result = await res.json();
    console.log("Résultat:", result);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Produits</h1>

      {products.map((product, index) => (
        <div key={index} className="space-y-3 rounded-md border p-4">
          <div>
            <label className="mb-1 block font-medium">Nom du produit</label>
            <Input
              type="text"
              value={product.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Profit unitaire</label>
            <Input
              type="number"
              value={product.unitProfit}
              onChange={(e) =>
                handleChange(index, "unitProfit", parseFloat(e.target.value))
              }
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Coût unitaire</label>
            <Input
              type="number"
              value={product.unitCost}
              onChange={(e) =>
                handleChange(index, "unitCost", parseFloat(e.target.value))
              }
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Production minimale
            </label>
            <Input
              type="number"
              value={product.minProduction}
              onChange={(e) =>
                handleChange(index, "minProduction", parseInt(e.target.value))
              }
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Production maximale
            </label>
            <Input
              type="number"
              value={product.maxProduction}
              onChange={(e) =>
                handleChange(index, "maxProduction", parseInt(e.target.value))
              }
            />
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <Button onClick={addProduct}>+ Ajouter un produit</Button>
        <Button onClick={handleSubmit}>Résoudre</Button>
      </div>
    </div>
  );
}
