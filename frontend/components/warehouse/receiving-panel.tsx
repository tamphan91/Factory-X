"use client";

import { DockCard } from "./dock-card";

export function ReceivingPanel() {
  return (
    <div
      className="
      border
      border-slate-500
      rounded-md
      p-2
      h-full
      "
    >
      <div
        className="
        bg-[#24488f]
        rounded
        py-2
        text-center
        font-bold
        mb-3
        "
      >
        Receiving
      </div>

      <div className="space-y-3">

        <DockCard
          dock="Dock 1"
          status="Arrived"
          time="14:05"
        />

        <DockCard
          dock="Dock 2"
          status="Unloading"
          time="14:15"
        />

        <DockCard
          dock="Dock 3"
          status="Arrived"
          time="14:20"
        />

      </div>
    </div>
  );
}