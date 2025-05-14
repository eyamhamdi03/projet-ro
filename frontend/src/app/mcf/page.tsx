"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import MCFTab from "@/components/McfTab";

export default function ProductionPage() {
  return (
    <>
      <Breadcrumb pageName="Minimum Cost Flow Solver" description="" />
      <main className="mx-auto w-full max-w-7xl p-6">
        <MCFTab />
      </main>
    </>
  );
}
