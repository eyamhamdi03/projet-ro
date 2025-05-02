import { useEffect, useState } from "react";
import { Resource } from "@/types/ressource";
import { Trash2 } from "lucide-react";

export default function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);

  const fetchResources = async () => {
    try {
      const res = await fetch("http://localhost:8000/resources/");
      const data = await res.json();
      setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const deleteResource = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/resources/${id}`, {
        method: "DELETE",
      });
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  useEffect(() => {
    fetchResources();

    const intervalId = setInterval(fetchResources, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold">Current Resources</h3>
      <ul className="list-disc space-y-1 pl-6">
        {resources.map((r) => (
          <li key={r.id} className="flex items-center justify-between">
            <span>
              {r.name} (Capacity: {r.capacity})
            </span>
            <button onClick={() => deleteResource(r.id)}>
              <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
