"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductionFormComponent from "@/components/ProductionForm";
import ProductTable from "@/components/ProductsList";
import ProductionResults from "@/components/ProductionResults";

// Mock test:
const mockResults = [
  {
    name: "Produit A",
    quantity: 80,
    maxProduction: 100,
    unitProfit: 5,
  },
  {
    name: "Produit B",
    quantity: 50,
    maxProduction: 100,
    unitProfit: 3,
  },
];

export default function ProductionPage() {
  return (
    <>
      <Breadcrumb pageName="Optimisation de la production" description="" />
      <main className="mx-auto w-full max-w-7xl p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <ProductionFormComponent />
            <ProductTable />
          </div>

          {/* Right Column */}
          <div className="gap-6">
            <ProductionResults results={mockResults} totalProfit={550} />
          </div>
        </div>
      </main>
    </>
  );
}
