"use client";

import { useState } from "react";
import AllocationForm from "@/components/AllocationForm";
import Breadcrumb from "@/components/Common/Breadcrumb";
import HousePlan from "@/components/HousePlan";
import { Resource } from "@/types/ressource";

export default function RoomAllocationPage() {
  const [resources, setResources] = useState<Resource[]>([]);

  return (
    <>
      <Breadcrumb pageName="Room Allocation" description="" />
      <main className="mx-auto grid grid-cols-1 gap-12 p-6 md:grid-cols-2">
        <AllocationForm />
        <HousePlan />
      </main>
    </>
  );
}
