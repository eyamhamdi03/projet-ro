"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductionFormComponent from "@/components/ProductionForm";
import ProductsList from "@/components/ProductsList";
import ProductionResults from "@/components/ProductionResults";

interface Result {
  name: string;
  quantity: number;
  max_production: number;
  unit_profit: number;
}

export default function ProductionPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);

  const fetchResults = async () => {
    try {
      const response = await fetch("http://localhost:8000/solve/history/latest"); // ← changer selon ta route backend
      if (!response.ok) {
        throw new Error(`Error fetching optimization results: ${response.statusText}`);
      }
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

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Optimisation de la production" description="" />
      <main className="mx-auto w-full max-w-7xl p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <ProductionFormComponent />
            <ProductsList />
          </div>

          {/* Right Column */}
          <div className="gap-6">
            <ProductionResults results={results} totalProfit={totalProfit} />
          </div>
        </div>
      </main>
    </>
  );
}
