"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Result = {
  name: string;
  quantity: number;
  max_production: number;
  unit_profit: number;
};

type Props = {
  results: Result[];
  totalProfit: number;
};

export default function ProductionResults({ results, totalProfit }: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Résultats</h1>

      <div className="mt- rounded-md border p-6 shadow-sm">
        <div className="space-y-4">
         {results.map((product, index) => {
  const percent =
    product.max_production && product.max_production > 0
      ? Math.min(100, (product.quantity / product.max_production) * 100)
      : 0;

  return (
    <div key={index}>
      <div className="mb-1 flex justify-between">
        <span className="font-medium">{product.name}</span>
        <span className="text-muted-foreground text-sm">
          {product.quantity} / {product.max_production} unités
        </span>
      </div>

      <div className="relative h-4 w-full rounded bg-gray-200">
       <motion.div
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    borderRadius: "0.375rem", // arrondi pour matching tailwind rounded
    backgroundColor: "green",
    width: `${percent}%`,
    minWidth: percent > 0 ? "4px" : "0",
  }}
  initial={{ width: 0 }}
  animate={{ width: `${percent}%` }}
  transition={{ duration: 1.2, ease: "easeOut" }}
/>

      </div>

      <div className="mt-1 text-right text-sm font-semibold text-green-700">
        +€{(product.quantity * product.unit_profit).toFixed(2)}
      </div>
    </div>
  );
  
})}

        </div>

        <div className="mt-8 border-t pt-4 text-xl font-bold text-green-700">
          💰 Profit total : €{totalProfit.toFixed(2)}
        </div>
      </div>
    </div>
  );
}