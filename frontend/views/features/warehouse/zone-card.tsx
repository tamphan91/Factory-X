"use client";

import type { ZoneCardProps } from "./zone-card.props";

export function ZoneCard({
  name,
  occupancy,
  color,
  vehicle,
  alert,
  className = 'p-2'
}: ZoneCardProps) {
  return (
    <div
      className={`
      relative
      bg-[#071f57]
      border
      border-slate-500
      rounded-md
      text-xs
      space-y-1
      ${className ?? ''}`}
    >
      {alert && (
        <div
          className="
          absolute
          -top-2
          -right-2
          w-4
          h-4
          rounded-full
          bg-red-500
          text-white
          flex
          items-center
          justify-center
          font-bold
          "
        >
          !
        </div>
      )}

      <div className="text-center font-bold">
        {name}
      </div>

      <div className="text-center font-bold">
        {occupancy}%
      </div>

      <div className="h-2 bg-slate-600 rounded">
        <div
          className="h-2 rounded"
          style={{
            width: `${occupancy}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {vehicle && (
        <div className="text-center">
          <span
            className="
            bg-blue-600
            rounded
            "
          >
            {vehicle}
          </span>
        </div>
      )}
    </div>
  );
}