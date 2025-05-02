import { useEffect, useState } from "react";
import { Demand } from "@/types/Demand";
import { Trash2 } from "lucide-react";

export default function DemandList() {
  const [demands, setDemands] = useState<Demand[]>([]);

  // Function to fetch demands from the database
  const fetchDemands = async () => {
    try {
      const res = await fetch("http://localhost:8000/demands/");
      const data = await res.json();
      setDemands(data);
    } catch (error) {
      console.error("Error fetching demands:", error);
    }
  };

  const deleteDemand = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/demands/${id}`, { method: "DELETE" });
      fetchDemands();
    } catch (error) {
      console.error("Error deleting demand:", error);
    }
  };

  useEffect(() => {
    fetchDemands();

    const intervalId = setInterval(fetchDemands, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold">Current Demands</h3>
      <ul className="list-disc space-y-1 pl-6">
        {demands.map((d) => (
          <li key={d.id} className="flex items-center justify-between">
            <span>
              {d.name} (Start: {d.earliest_start})
            </span>
            <button onClick={() => deleteDemand(d.id)}>
              <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
