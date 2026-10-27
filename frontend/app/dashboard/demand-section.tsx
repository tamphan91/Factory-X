"use client";

import { useDemandController } from "@/controllers/demand.controller";
import { DemandPage } from "@/views/features/demand/demand-page";

export function DemandSection() {
  const { status, vm, actions } = useDemandController();

  if (status === "ready") {
    return <DemandPage vm={vm} actions={actions} />;
  }

  return (
    <div role="status" className="py-8 text-center text-sm text-white">
      {status === "error" ? "Could not load demand and lead time." : "Loading demand and lead time…"}
    </div>
  );
}
