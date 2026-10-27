"use client";

import { ZoneCard } from "./zone-card";

export function StagingPanel() {
  return (
    <div
      className="
      border
      border-violet-500
      rounded-md
      p-2
      h-full
      "
    >
      <div
        className="
        bg-violet-500/20
        rounded
        py-2
        text-center
        font-bold
        mb-2
        "
      >
        Material Staging
      </div>

      <div className="space-y-2">

        <ZoneCard
          name="Staging 1"
          occupancy={75}
          color="#eab308"
          vehicle="AGV-02"
        />

        <ZoneCard
          name="Staging 2"
          occupancy={60}
          color="#22c55e"
        />

        <ZoneCard
          name="Staging 3"
          occupancy={90}
          color="#ef4444"
          vehicle="AGV-05"
          alert
        />

      </div>

    </div>
  );
}
