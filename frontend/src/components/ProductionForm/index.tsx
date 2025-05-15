"use client";

import { useState, useEffect } from "react";

type ProductFormData = {
  name: string;
  unit_profit: number;
  unit_cost: number;
  min_production: number;
  max_production: number;
  max_per_day: number; // ajouté
};

type Product = {
  name: string;
  quantity: number;
  max_production: number;
  unit_profit: number;
  unit_cost: number;
  min_production: number;
  max_per_day: number; // ajouté
};

export default function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    unit_profit: 0,
    unit_cost: 0,
    min_production: 0,
    max_production: 0,
    max_per_day: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [deadline, setDeadline] = useState<string>(""); // pour stocker la deadline

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/products/");
        if (!res.ok) throw new Error(`Erreur fetch produits: ${res.statusText}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Erreur récupération produits:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "name" ? value : Number(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("FastAPI error details:", data);
        throw new Error(`Error adding product: ${response.statusText}`);
      }

      setProducts((prev) => [
        ...prev,
        {
          name: data.name || formData.name,
          quantity: 0,
          max_production: data.max_production || formData.max_production,
          unit_profit: data.unit_profit || formData.unit_profit,
          unit_cost: data.unit_cost || formData.unit_cost,
          min_production: data.min_production || formData.min_production,
          max_per_day: data.max_per_day || formData.max_per_day,
        },
      ]);

      setFormData({
        name: "",
        unit_profit: 0,
        unit_cost: 0,
        min_production: 0,
        max_production: 0,
        max_per_day: 0,
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleSolve = async () => {
    try {
      if (!deadline) {
        alert("Veuillez saisir une date limite (deadline)");
        return;
      }

      const validatedProducts = products.map((p) => {
        if (p.min_production === undefined || p.max_per_day === undefined) {
          throw new Error(`Product ${p.name} missing min_production or max_per_day`);
        }
        return {
          name: p.name,
          unit_profit: p.unit_profit,
          unit_cost: p.unit_cost,
          min_production: p.min_production,
          max_production: p.max_production,
          max_per_day: p.max_per_day,
        };
      });

      const payload = {
        products: validatedProducts,
        deadline: new Date(deadline).toISOString(), // format ISO 8601 attendu par FastAPI
      };

      console.log("Payload envoyé:", payload);

      const response = await fetch("http://localhost:8000/solve/solveProduction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erreur lors de la résolution");
      }

      const result = await response.json();
      console.log("Résultat:", result);

      // Met à jour le profit total, par exemple
      setTotalProfit(result.total_profit || 0);
    } catch (error) {
      console.error("Error in handleSolve:", error);
      alert(`Erreur : ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Formulaire de Production</h1>

      <div className="mt-6 rounded-md border p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-lg font-medium">Nom du produit</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 rounded-md border border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-lg font-medium">Profit unitaire (€)</label>
              <input
                type="number"
                name="unit_profit"
                value={formData.unit_profit}
                onChange={handleInputChange}
                className="w-full p-2 rounded-md border border-gray-300 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">Coût unitaire (€)</label>
              <input
                type="number"
                name="unit_cost"
                value={formData.unit_cost}
                onChange={handleInputChange}
                className="w-full p-2 rounded-md border border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-lg font-medium">Production min.</label>
              <input
                type="number"
                name="min_production"
                value={formData.min_production}
                onChange={handleInputChange}
                className="w-full p-2 rounded-md border border-gray-300 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">Production max.</label>
              <input
                type="number"
                name="max_production"
                value={formData.max_production}
                onChange={handleInputChange}
                className="w-full p-2 rounded-md border border-gray-300 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">Max production par jour</label>
              <input
                type="number"
                name="max_per_day"
                value={formData.max_per_day}
                onChange={handleInputChange}
                className="w-full p-2 rounded-md border border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            >
              Ajouter produit
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6">
        <label className="text-lg font-medium">Deadline</label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300 shadow-sm"
          required
        />
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleSolve}
          className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
        >
          Résoudre
        </button>
      </div>

      {totalProfit > 0 && (
        <div className="mt-4 text-lg font-semibold">
          Profit total: {totalProfit} €
        </div>
      )}
    </div>
  );
}
