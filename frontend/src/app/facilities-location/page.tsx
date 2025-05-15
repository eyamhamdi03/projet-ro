'use client';
import { useState } from 'react';
import ShapeForm from '@/components/ShapeForm';
import CuttingPlan from '@/components/CuttingPlan';

export default function CuttingPage() {
  const [solution, setSolution] = useState([]);

  const handleAddShape = async (shape: { width: number; height: number; quantity: number }) => {
    await addShape(shape);
  };

  const handleSolve = async () => {
    const res = await solveCutting();
    setSolution(res.solution); // Assuming your API returns the solution in `res.solution`
  };

  return (
    <div className="p-4">
      <h1>2D Cutting Optimizer</h1>
      <ShapeForm onAdd={handleAddShape} />
      <button onClick={handleSolve} className="mt-4 bg-blue-500 text-white p-2">Solve</button>
      <div className="mt-4">
        <CuttingPlan shapes={solution} sheetWidth={100} sheetHeight={100} />
      </div>
    </div>
  );
}

async function addShape(shape: { width: number; height: number; quantity: number }) {
  const res = await fetch('http://localhost:8000/shape/add_shape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shape),
  });
  return res.json();
}

async function solveCutting() {
  const res = await fetch('http://localhost:8000/solve/solve_cutting_problem', {
    method: 'POST',
  });
  return res.json();
}
