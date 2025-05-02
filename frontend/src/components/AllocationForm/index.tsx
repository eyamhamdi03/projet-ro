import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Demand } from "@/types/Demand";
import { Resource } from "@/types/ressource";

export default function AllocationForm({
  onResourcesChange,
}: {
  onResourcesChange: (r: Resource[]) => void;
}) {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const [demandInput, setDemandInput] = useState<Omit<Demand, "id">>({
    name: "",
    required_capacity: 1,
    duration: 1,
    earliest_start: "08:00",
    profit: 0,
    incompatible_resources: [],
  });

  const [resourceInput, setResourceInput] = useState<Omit<Resource, "id">>({
    name: "",
    capacity: 1,
    available_slots: [],
  });

  const handleAddDemand = () => {
    if (demandInput.name) {
      const newDemand: Demand = {
        ...demandInput,
        id: "",
      };
      setDemands([...demands, newDemand]);
      setDemandInput({
        ...demandInput,
        name: "",
        profit: 0,
      });
    }
  };

  const handleAddResource = () => {
    if (resourceInput.name) {
      const newResource: Resource = {
        ...resourceInput,
        id: "",
      };
      const newResources = [...resources, newResource];
      setResources(newResources);
      onResourcesChange(newResources);
      setResourceInput({
        ...resourceInput,
        name: "",
        available_slots: [],
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Send demands to the backend
      const demandResponse = await fetch("http://localhost:8000/demands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(demands),
      });

      if (!demandResponse.ok) throw new Error("Failed to submit demands");

      // Send resources to the backend
      const resourceResponse = await fetch("http://localhost:8000/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resources),
      });

      if (!resourceResponse.ok) throw new Error("Failed to submit resources");

      // Handle successful submission
      console.log("Data submitted successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-8">
      {/* Demand Form */}
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
            <label className="text-sm font-medium">
              Incompatible Resources
            </label>
            <Input
              placeholder="Comma-separated IDs"
              value={demandInput.incompatible_resources?.join(",") || ""}
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

      {/* Resource Form */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Add Resource</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Name"
              value={resourceInput.name}
              onChange={(e) =>
                setResourceInput({ ...resourceInput, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Capacity</label>
            <Input
              type="number"
              placeholder="Capacity"
              value={resourceInput.capacity}
              onChange={(e) =>
                setResourceInput({
                  ...resourceInput,
                  capacity: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium">Available Slots</label>
            <Input
              placeholder="e.g. 08:00-10:00,10:30-12:00"
              value={resourceInput.available_slots.join(",")}
              onChange={(e) =>
                setResourceInput({
                  ...resourceInput,
                  available_slots: e.target.value.split(","),
                })
              }
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleAddResource}>
          Add Resource
        </Button>
      </div>

      {/* Current Demands and Resources */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold">Current Demands</h3>
        <ul className="list-disc pl-5 text-sm">
          {demands.map((d, i) => (
            <li key={i}>
              {d.name} (Start: {d.earliest_start})
            </li>
          ))}
        </ul>

        <h3 className="mt-4 text-lg font-semibold">Current Resources</h3>
        <ul className="list-disc pl-5 text-sm">
          {resources.map((r, i) => (
            <li key={i}>
              {r.name} (Capacity: {r.capacity})
            </li>
          ))}
        </ul>
      </div>

      {/* Submit Button */}
      <Button className="bg-primary" onClick={handleSubmit}>
        Solve (Submit)
      </Button>
    </div>
  );
}
