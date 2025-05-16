"use client";

import { useEffect, useState } from "react";

type Product = {
  name: string;
  unit_profit: number;
  unit_cost: number;
  min_production: number;
  max_production: number;
};

type Props = {
  refreshKey?: number; // 👈 used to trigger refresh
};

export default function ProductTable({ refreshKey }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/products");
      if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer le produit "${name}" ?`)) return;

    try {
      const response = await fetch(`http://localhost:8000/products/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Erreur suppression produit: ${response.statusText}`);

      setProducts((prev) => prev.filter((p) => p.name !== name));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du produit");
    }
  };

  // 🔁 Fetch products on mount and whenever `refreshKey` changes
  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  return (
    <div className="mt-10 w-full overflow-x-auto rounded-md border p-4">
      <h2 className="mb-4 text-lg font-semibold">Liste des Produits</h2>
      <table className="w-full text-left text-sm">
        <thead className="border-b font-medium">
          <tr>
            <th className="px-3 py-2">Nom</th>
            <th className="px-3 py-2">Profit unitaire</th>
            <th className="px-3 py-2">Coût unitaire</th>
            <th className="px-3 py-2">Min Production</th>
            <th className="px-3 py-2">Max Production</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.name} className="hover:bg-gray-200 border-b">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.unit_profit}</td>
                <td className="px-3 py-2">{product.unit_cost}</td>
                <td className="px-3 py-2">{product.min_production}</td>
                <td className="px-3 py-2">{product.max_production}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleDelete(product.name)}
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-3 py-4 text-center" colSpan={6}>
                Chargement des produits...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
