import DemandForm from "@/components/DemandForm";
import ResourceForm from "@/components/ResourceForm";
import DemandList from "@/components/DemandList";
import ResourceList from "@/components/ResourceList";
import { Button } from "@/components/ui/button";

export default function AllocationForm() {
  const handleSubmit = async () => {
    const demandsRes = await fetch("http://localhost:8000/demands/");
    const demands = await demandsRes.json();

    const resourcesRes = await fetch("http://localhost:8000/resources/");
    const resources = await resourcesRes.json();

    const response = await fetch("http://localhost:8000/solve/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demands, resources }),
    });

    const result = await response.json();
    console.log("Solving result:", result);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <DemandForm onDemandsChange={() => {}} />
      <ResourceForm onResourcesChange={() => {}} />

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
