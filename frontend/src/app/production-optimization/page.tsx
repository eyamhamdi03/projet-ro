"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductionFormComponent from "@/components/ProductionForm";
import ProductsList from "@/components/ProductsList";
import ProductionResults from "@/components/ProductionResults";

interface Result {
  name: string;
  quantity: number;
  maxProduction: number;
  unitProfit: number;
}

export default function ProductionPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [productsKey, setProductsKey] = useState<number>(0); // trigger re-render for products

  const fetchResults = async () => {
    try {
      const response = await fetch("http://localhost:8000/solve/history/latest");
      if (!response.ok) throw new Error("Failed to fetch results");
      const data = await response.json();

      const transformedResults: Result[] = data.results.map((product: any) => ({
        name: product.name,
        quantity: product.quantity,
        maxProduction: product.max_production,
        unitProfit: product.unit_profit,
      }));

      setResults(transformedResults);
      setTotalProfit(data.total_profit);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const refreshAll = async () => {
    await fetchResults();
    setProductsKey((prev) => prev + 1); // trigger re-fetch in child via key
  };

  return (
    <>
      <Breadcrumb pageName="Optimisation de la production" description="" />
      <main className="mx-auto w-full max-w-7xl p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <ProductionFormComponent onSolve={refreshAll} />
<ProductsList refreshKey={productsKey} />
          </div>

          <div className="gap-6">
            <ProductionResults results={results} totalProfit={totalProfit} />
          </div>
        </div>
      </main>
    </>
  );
}
