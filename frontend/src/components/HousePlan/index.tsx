"use client";

import { useEffect, useState } from "react";
import { Resource } from "@/types/ressource";

export default function HousePlan() {
  const [resources, setResources] = useState<Resource[]>([]);
  const viewBoxSize = 400;

  const fetchResources = async () => {
    try {
      const res = await fetch("http://localhost:8000/resources/");
      const data = await res.json();
      setResources(data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
  };

  useEffect(() => {
    fetchResources();
    const interval = setInterval(() => {
      fetchResources();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const numRooms = resources.length;

  if (numRooms === 0) {
    return (
      <div className="h-full w-full rounded-lg border bg-gray-50 p-4">
        <h2 className="mb-2 text-lg font-semibold">House Plan</h2>
        <p className="text-sm text-gray-500">
          No rooms yet. Add resources to see them here.
        </p>
      </div>
    );
  }

  const gridSize = Math.ceil(Math.sqrt(numRooms));
  const cellSize = viewBoxSize / gridSize;

  return (
    <div className="h-full w-full rounded-lg p-4">
      <h2 className="mb-2 text-center text-lg font-semibold">House Plan</h2>
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="h-[400px] w-full"
      >
        <rect
          x={0}
          y={0}
          width={viewBoxSize}
          height={viewBoxSize}
          fill="#f1f5f9"
          stroke="#ccc"
          strokeWidth="2"
        />

        {resources.map((res, index) => {
          const col = index % gridSize;
          const row = Math.floor(index / gridSize);
          const x = col * cellSize;
          const y = row * cellSize;

          return (
            <g key={res.id}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill="#cbd5e1"
                stroke="#475569"
                strokeWidth="1"
              />
              <text
                x={x + cellSize / 2}
                y={y + cellSize / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#0f172a"
                fontSize={Math.min(14, cellSize / 4)}
              >
                {res.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
