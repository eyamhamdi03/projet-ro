import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Demand } from "@/types/Demand";

export default function DemandForm({
  onDemandsChange,
}: {
  onDemandsChange: (d: Demand[]) => void;
}) {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [demandInput, setDemandInput] = useState<Omit<Demand, "id">>({
    name: "",
    required_capacity: 1,
    duration: 1,
    earliest_start: "08:00",
    profit: 0,
    incompatible_resources: [],
  });

  const handleAddDemand = async () => {
    if (demandInput.name) {
      try {
        const response = await fetch("http://localhost:8000/demands/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(demandInput),
        });

        if (!response.ok) throw new Error("Failed to create demand");

        const newDemand: Demand = await response.json();
        const newDemands = [...demands, newDemand];
        setDemands(newDemands);
        onDemandsChange(newDemands);

        setDemandInput({
          name: "",
          required_capacity: 1,
          duration: 1,
          earliest_start: "08:00",
          profit: 0,
          incompatible_resources: [],
        });
      } catch (error) {
        console.error("Error creating demand:", error);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Add Demand</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="Name"
            value={demandInput.name}
            onChange={(e) =>
              setDemandInput({ ...demandInput, name: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Required Capacity</label>
          <Input
            type="number"
            placeholder="Required Capacity"
            value={demandInput.required_capacity}
            onChange={(e) =>
              setDemandInput({
                ...demandInput,
                required_capacity: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Duration</label>
          <Input
            type="number"
            placeholder="Duration"
            value={demandInput.duration}
            onChange={(e) =>
              setDemandInput({
                ...demandInput,
                duration: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Earliest Start</label>
          <Input
            placeholder="08:00"
            value={demandInput.earliest_start}
            onChange={(e) =>
              setDemandInput({
                ...demandInput,
                earliest_start: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Profit</label>
          <Input
            type="number"
            placeholder="Profit"
            value={demandInput.profit}
            onChange={(e) =>
              setDemandInput({
                ...demandInput,
                profit: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Incompatible Resources</label>
          <Input
            placeholder="Comma-separated IDs"
            value={demandInput.incompatible_resources.join(",")}
            onChange={(e) =>
              setDemandInput({
                ...demandInput,
                incompatible_resources: e.target.value.split(","),
              })
            }
          />
        </div>
      </div>
      <Button className="mt-4" onClick={handleAddDemand}>
        Add Demand
      </Button>
    </div>
  );
}
