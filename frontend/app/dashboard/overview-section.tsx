"use client";

import { useOverviewController } from "@/controllers/overview.controller";
import { OverviewPage } from "@/views/features/overview/overview-page";

export function OverviewSection() {
  const { status, vm, actions } = useOverviewController();

  if (status === "ready") {
    return <OverviewPage vm={vm} actions={actions} />;
  }

  return (
    <div role="status" className="py-8 text-center text-sm text-white">
      {status === "error" ? "Could not load the overview." : "Loading overview…"}
    </div>
  );
}
