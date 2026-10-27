"use client";

interface ZoneCardProps {
  name: string;
  occupancy: number;
  slots?: string;
  color: string;
  vehicle?: string;
  alert?: boolean;
}

export function ZoneCard({
  name,
  occupancy,
  color,
  vehicle,
  alert,
}: ZoneCardProps) {
  return (
    <div
      className="
      relative
      bg-[#071f57]
      border
      border-slate-500
      rounded-md
      text-xs
      p-3
      space-y-1
      "
    >
      {alert && (
        <div
          className="
          absolute
          -top-2
          -right-2
          w-5
          h-5
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