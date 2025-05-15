interface PlacedShape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CuttingPlanProps {
  shapes: PlacedShape[];
  sheetWidth: number;
  sheetHeight: number;
}

export default function CuttingPlan({ shapes, sheetWidth, sheetHeight }: CuttingPlanProps) {
  return (
    <svg width={sheetWidth} height={sheetHeight} style={{ border: '1px solid black' }}>
      {shapes.map((shape) => (
        <rect
          key={shape.id}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          fill="skyblue"
          stroke="black"
        />
      ))}
    </svg>
  );
}
