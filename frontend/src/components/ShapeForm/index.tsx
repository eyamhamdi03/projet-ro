import { useState } from 'react';

interface ShapeFormProps {
  onAdd: (shape: { width: number; height: number; quantity: number }) => void;
}

export default function ShapeForm({ onAdd }: ShapeFormProps) {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ width, height, quantity });
    setWidth(10);
    setHeight(10);
    setQuantity(1);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} placeholder="Width" required />
      <input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} placeholder="Height" required />
      <input type="number" value={quantity} onChange={(e) => setQuantity(+e.target.value)} placeholder="Quantity" required />
      <button type="submit">Add Shape</button>
    </form>
  );
}
