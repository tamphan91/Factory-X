"use client";

import { Icon } from "@/views/common/icon";
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
    px-1
    py-3
  "
>
  <div className="flex gap-2">

    {/* Fixed icon width */}
    <div className="w-6 shrink-0 flex items-center">
      <Icon
        name="truck"
        size={26}
        className="text-slate-200"
      />
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0 justify-center text-[10px]">

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
          mt-1
        "
      >
        <span
          className={`
            w-2
            h-2
            shrink-0
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