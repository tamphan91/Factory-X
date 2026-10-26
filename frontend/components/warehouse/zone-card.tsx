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
      p-3
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
          text-xs
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

      <div className="text-center mt-2 text-xl font-bold">
        {occupancy}%
      </div>

      <div className="mt-3 h-3 bg-slate-600 rounded">
        <div
          className="h-3 rounded"
          style={{
            width: `${occupancy}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {vehicle && (
        <div className="mt-3 text-center">
          <span
            className="
            bg-blue-600
            text-xs
            px-2
            py-1
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