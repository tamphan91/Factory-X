"use client";

import { ZoneCard } from "./zone-card";

export function PickingPanel() {
  return (
    <div
      className="
      border
      border-yellow-500
      rounded-md
      p-2
      h-full
      "
    >
      <div
        className="
        bg-slate-600/40
        rounded
        text-center
        py-2
        mb-3
        font-bold
        "
      >
        Picking / Kitting Area
      </div>

      <div className="grid grid-cols-2 gap-3">

        <ZoneCard
          name="Zone G"
          occupancy={80}
          color="#facc15"
          vehicle="AGV-01"
          className="py-6"
        />

        <ZoneCard
          name="Zone H"
          occupancy={65}
          color="#22c55e"
          className="py-6"
        />

        <div className="col-span-2 w-[calc(50%-6px)] justify-self-center">

        <ZoneCard
          name="Zone I"
          occupancy={50}
          color="#22c55e"
          vehicle="AGV-06"
          className="py-6"
        />

      </div>

      </div>

      

    </div>
  );
}