import DemandForm from "@/components/DemandForm";
import ResourceForm from "@/components/ResourceForm";
import DemandList from "@/components/DemandList";
import ResourceList from "@/components/ResourceList";
import { Button } from "@/components/ui/button";

export default function AllocationForm() {
  const handleSubmit = async () => {
    try {
      const demandsRes = await fetch("http://localhost:8000/demands/");
      const demands = await demandsRes.json();

      const resourcesRes = await fetch("http://localhost:8000/resources/");
      const resources = await resourcesRes.json();

      const response = await fetch("http://localhost:8000/solve/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          time_slots: [
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
          ], // or whatever range you want
        }),
      });

      const result = await response.json();
      console.log("Solving result:", result);
      // Tu peux ici déclencher une notification ou rediriger si nécessaire
    } catch (error) {
      console.error("Failed to solve allocation:", error);
    }
  };

  return (
    <div className="mx-auto space-y-8">
      <ResourceForm onResourcesChange={() => {}} />
      <DemandForm onDemandsChange={() => {}} />
      <div className="space-y-4 border-t pt-4">
        <DemandList />
        <ResourceList />
      </div>

      <Button className="bg-primary" onClick={handleSubmit}>
        Solve (Submit)
      </Button>
    </div>
  );
}
