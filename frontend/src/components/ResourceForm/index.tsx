import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Resource } from "@/types/ressource";

export default function ResourceForm({
  onResourcesChange,
}: {
  onResourcesChange: (r: Resource[]) => void;
}) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceInput, setResourceInput] = useState<Omit<Resource, "id">>({
    name: "",
    capacity: 1,
    available_slots: [],
  });

  const handleAddResource = async () => {
    if (resourceInput.name) {
      try {
        const response = await fetch("http://localhost:8000/resources/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resourceInput),
        });

        if (!response.ok) throw new Error("Failed to create resource");

        const newResource: Resource = await response.json();
        const newResources = [...resources, newResource];
        setResources(newResources);
        onResourcesChange(newResources);

        setResourceInput({ name: "", capacity: 1, available_slots: [] });
      } catch (error) {
        console.error("Error creating resource:", error);
      }
    }
  };

  return (
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
  );
}
