"use client";

import { ZoneCard } from "./zone-card";

export function StoragePanel() {
  return (
    <div
      className="
      border
      border-emerald-500
      rounded-md
      p-2
      h-full
      "
    >
      <div
        className="
        bg-cyan-700/30
        rounded
        text-center
        py-2
        mb-3
        font-bold
        "
      >
        Raw Material Warehouse / Storage
      </div>

      <div className="grid grid-cols-3 gap-3">

        <ZoneCard
          name="Zone A"
          occupancy={72}
          color="#22c55e"
          className="py-6"
        />

        <ZoneCard
          name="Zone B"
          occupancy={85}
          color="#ef4444"
          vehicle="FL-07"
          className="py-6"
          alert
        />

        <ZoneCard
          name="Zone C"
          occupancy={60}
          color="#22c55e"
          className="py-6"
        />

        <ZoneCard
          name="Zone D"
          occupancy={45}
          color="#22c55e"
          className="py-6"
        />

        <ZoneCard
          name="Zone E"
          occupancy={90}
          color="#ef4444"
          vehicle="FL-04"
          className="py-6"
          alert
        />

        <ZoneCard
          name="Zone F"
          occupancy={68}
          color="#facc15"
          className="py-6"
          vehicle="AGV-03"
        />

      </div>
    </div>
  );
}