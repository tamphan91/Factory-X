"use client";

import { Truck } from "lucide-react";
import type { DockCardProps } from "./dock-card.props";

export function DockCard({
  dock,
  status,
  time,
}: DockCardProps) {
  return (
    <div
      className="
      bg-[#173a82]
      rounded-md
      px-3
      py-4
      "
    >
      <div className="flex gap-3">

        <Truck
          size={28}
          className="text-slate-200"
        />

        <div>

          <div
            className="
            font-semibold
            text-white
            "
          >
            {dock}
          </div>

          <div
            className="
            flex
            items-center
            gap-1
            text-xs
            mt-1
            "
          >
            <span
              className={`
              w-2
              h-2
              rounded-full
              ${
                status === "Arrived"
                  ? "bg-green-400"
                  : "bg-yellow-400"
              }
            `}
            />

            <span
              className={
                status === "Arrived"
                  ? "text-green-300"
                  : "text-yellow-300"
              }
            >
              {status}
            </span>
          </div>

          <div
            className="
            text-xs
            text-slate-300
            mt-1
            "
          >
            {time}
          </div>

        </div>

      </div>
    </div>
  );
}