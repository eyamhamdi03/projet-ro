"use client";

import { useEffect, useState } from "react";
import { Resource } from "@/types/ressource";

type Demand = {
  id: string;
  name: string;
};

type Allocation = {
  demand: string;
  resource: string;
  start: string;
  end: string;
  profit: number;
  utilization: number;
};

export default function HousePlan() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [utilization, setUtilization] = useState<number>(0);
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

  const fetchAllocations = async () => {
    try {
      const res = await fetch("http://localhost:8000/solve/allocations");
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0 && data[0].allocations) {
        setAllocations(data[0].allocations);
        if (data[0].total_profit) {
          setTotalProfit(data[0].total_profit);
        }
        if (data[0].utilization) {
          setUtilization(data[0].utilization * 100); // Convert to percentage
        }
      } else {
        console.warn("No allocations found in response.");
      }
    } catch (error) {
      console.error("Failed to fetch allocations:", error);
    }
  };

  useEffect(() => {
    fetchResources();
    fetchAllocations();

    const interval = setInterval(() => {
      fetchResources();
      fetchAllocations();
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
    <div className="flex h-full w-full flex-col gap-4">
      <div className="rounded-lg p-4 shadow-sm">
        <h2 className="mb-2 text-center text-lg font-semibold">House Plan</h2>
        <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="h-[400px] w-full">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          </defs>

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
                  rx={8}
                  ry={8}
                  className="transition-all duration-300 "
                />
                <text
                  x={x + cellSize / 2}
                  y={y + 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#0f172a"
                  fontSize={Math.min(14, cellSize / 4)}
                  fontWeight="600"
                >
                  {res.name}
                </text>

                {allocations
                  .filter((alloc) => alloc.resource === res.name)
                  .map((alloc, i) => {
                    const textY = y + 40 + i * 34;

                    return (
                      <g key={i}>
                        <rect
                          x={x + 8}
                          y={textY - 14}
                          width={cellSize - 16}
                          height={32}
                          rx={6}
                          ry={6}
                          fill="white"
                          opacity={0.9}
                          stroke="#94a3b8"
                          strokeWidth="0.5"
                          filter="url(#shadow)"
                          className="transition-all duration-300 "
                        />
                        <text
                          x={x + cellSize / 2}
                          y={textY}
                          textAnchor="middle"
                          fill="#0f172a"
                          fontSize={Math.min(10, cellSize / 7)}
                          fontWeight="500"
                        >
                          {alloc.demand}
                        </text>
                        <text
                          x={x + cellSize / 2}
                          y={textY + 12}
                          textAnchor="middle"
                          fill="#03C04A"
                          fontSize={Math.min(9, cellSize / 8)}
                        >
                          {alloc.start}-{alloc.end}
                        </text>
                      </g>
                    );
                  })}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Profit</h3>
          <p className="text-2xl font-bold text-green-600">
            ${totalProfit.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Resource Utilization</h3>
          <div className="flex items-center">
            <div className="mr-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${utilization}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {utilization.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}