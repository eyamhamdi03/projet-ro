"use client";

import { useEffect, useState } from "react";

type Product = {
  name: string;
  unitProfit: number;
  unitCost: number;
  minProduction: number;
  maxProduction: number;
};

const MOCK_PRODUCTS: Product[] = [
  {
    name: "Produit A",
    unitProfit: 50,
    unitCost: 20,
    minProduction: 10,
    maxProduction: 100,
  },
  {
    name: "Produit B",
    unitProfit: 30,
    unitCost: 15,
    minProduction: 5,
    maxProduction: 80,
  },
];

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Simulate a delayed fetch
    const timeout = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
    }, 500); // simulate loading delay

    return () => clearTimeout(timeout);
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={index} className="hover:bg-color-dark border-b">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.unitProfit}</td>
                <td className="px-3 py-2">{product.unitCost}</td>
                <td className="px-3 py-2">{product.minProduction}</td>
                <td className="px-3 py-2">{product.maxProduction}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-3 py-4 text-center" colSpan={5}>
                Chargement des produits...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
