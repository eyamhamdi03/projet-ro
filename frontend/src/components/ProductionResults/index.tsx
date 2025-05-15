"use client";

import { motion } from "framer-motion";
import React, { useEffect } from "react";

type Result = {
  name: string;
  quantity: number;
  maxProduction: number;  // camelCase
  unitProfit: number;     // camelCase
};

type Props = {
  results: Result[];
  totalProfit: number;
};

export default function ProductionResults({ results, totalProfit }: Props) {
  useEffect(() => {
    console.log("== Résultats reçus ==");
    console.log(JSON.stringify(results, null, 2));

    results.forEach((p, i) => {
      console.log(`→ Produit ${i}:`);
      console.log("  name:", p.name);
      console.log("  quantity:", p.quantity, typeof p.quantity);
      console.log("  maxProduction:", p.maxProduction, typeof p.maxProduction);
      console.log("  unitProfit:", p.unitProfit, typeof p.unitProfit);
    });

    console.log("== Profit total ==", totalProfit);
  }, [results, totalProfit]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Résultats</h1>

      <div className="rounded-md border p-6 shadow-sm">
        <div className="space-y-4">
          {results.map((product, index) => {
            const percent =
              product.maxProduction && product.maxProduction > 0
                ? Math.min(100, (product.quantity / product.maxProduction) * 100)
                : 0;

            const quantity = Number(product.quantity);
            const unitProfit = Number(product.unitProfit);
            const profit = quantity * unitProfit;

            console.log(`[Render] ${product.name}: ${quantity} * ${unitProfit} = ${profit}`);

            return (
              <div key={index}>
                <div className="mb-1 flex justify-between">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {product.quantity} / {product.maxProduction} unités
                  </span>
                </div>

                <div className="relative h-4 w-full rounded bg-gray-200">
                  <motion.div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      borderRadius: "0.375rem",
                      backgroundColor: "#16a34a",
                      width: `${percent}%`,
                      minWidth: percent > 0 ? "4px" : "0",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>

                <div className="mt-1 text-right text-sm font-semibold text-green-700">
                  +€{profit.toFixed(2)}
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
