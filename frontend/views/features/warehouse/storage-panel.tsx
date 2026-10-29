"use client";

import { ZoneCard } from "./zone-card";

export function getUtilizationColor(percent: number): string {
  if (percent === 100) return "bg-red-500";
  if (percent >= 81) return "bg-orange-500";
  if (percent >= 61) return "bg-orange-400";
  if (percent >= 41) return "bg-yellow-300";
  if (percent >= 21) return "bg-green-300";

  return "bg-emerald-400";
}

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

      <div className="grid grid-cols-6 gap-3">

        <ZoneCard
          isUtilization={true}
          name="Zone A"
          occupancy={72}
          color={getUtilizationColor(72)}
          className={`py-2 ${getUtilizationColor(72)}`}
        />

        <ZoneCard
          isUtilization={true}
          name="Zone B"
          occupancy={85}
          color={getUtilizationColor(85)}
          vehicle="FL-07"
          className={`py-2 ${getUtilizationColor(85)}`}
          alert
        />

        <ZoneCard
          isUtilization={true}
          name="Zone C"
          occupancy={60}
          color={getUtilizationColor(60)}
          className={`py-2 ${getUtilizationColor(60)}`}
        />

        <ZoneCard
          isUtilization={true}
          name="Zone D"
          occupancy={45}
          color={getUtilizationColor(45)}
          className={`py-2 ${getUtilizationColor(45)}`}
        />

        <ZoneCard
          isUtilization={true}
          name="Zone E"
          occupancy={90}
          color={getUtilizationColor(90)}
          vehicle="FL-04"
          className={`py-2 ${getUtilizationColor(90)}`}
          alert
        />

        <ZoneCard
          isUtilization={true}
          name="Zone F"
          occupancy={68}
          color={getUtilizationColor(68)}
          className={`py-2 ${getUtilizationColor(68)}`}
          vehicle="AGV-03"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone A"
          occupancy={72}
          color={getUtilizationColor(72)}
          className={`py-2 ${getUtilizationColor(72)}`}
        />

        <ZoneCard
          isUtilization={true}
          name="Zone B"
          occupancy={85}
          color="#ef4444"
          vehicle="FL-07"
          className="py-2"
          alert
        />

        <ZoneCard
          isUtilization={true}
          name="Zone C"
          occupancy={60}
          color="#22c55e"
          className="py-2"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone D"
          occupancy={45}
          color="#22c55e"
          className="py-2"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone E"
          occupancy={90}
          color="#ef4444"
          vehicle="FL-04"
          className="py-2"
          alert
        />

        <ZoneCard
          isUtilization={true}
          name="Zone F"
          occupancy={68}
          color="#facc15"
          className="py-2"
          vehicle="AGV-03"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone A"
          occupancy={72}
          color="#22c55e"
          className="py-2"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone B"
          occupancy={85}
          color="#ef4444"
          vehicle="FL-07"
          className="py-2"
          alert
        />

        <ZoneCard
          isUtilization={true}
          name="Zone C"
          occupancy={60}
          color="#22c55e"
          className="py-2"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone D"
          occupancy={45}
          color="#22c55e"
          className="py-2"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone E"
          occupancy={90}
          color="#ef4444"
          vehicle="FL-04"
          className="py-2"
          alert
        />

        <ZoneCard
          isUtilization={true}
          name="Zone F"
          occupancy={68}
          color="#facc15"
          className="py-2"
          vehicle="AGV-03"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone A"
          occupancy={72}
          color="#22c55e"
          className="py-2"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone B"
          occupancy={85}
          color="#ef4444"
          vehicle="FL-07"
          className="py-2"
          alert
        />

        <ZoneCard
          isUtilization={true}
          name="Zone C"
          occupancy={60}
          color="#22c55e"
          className="py-2"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone D"
          occupancy={45}
          color="#22c55e"
          className="py-2"
        />

        <ZoneCard
          isUtilization={true}
          name="Zone E"
          occupancy={90}
          color="#ef4444"
          vehicle="FL-04"
          className="py-2"
          alert
        />

        <ZoneCard
          isUtilization={true}
          name="Zone F"
          occupancy={68}
          color="#facc15"
          className="py-2"
          vehicle="AGV-03"
        />

      </div>
    </div>
  );
}