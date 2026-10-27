"use client";

import { Icon } from "@/views/common/icon";

export function HandoverPanel() {
  return (
    <div
      className="
      bg-slate-100
      text-slate-900
      rounded-md
      p-2
      flex
      flex-col
      items-center
      justify-between
      space-y-1
      h-full
      "
    >
      <div
        className="
        text-center
        font-bold
        text-xs
        "
      >
        Handover to
        <br />
        Production
        <br />
        (Material Delivery)
      </div>

      <Icon
        name="building"
        size={42}
        className="text-slate-700"
      />

      <div className="text-center">

        <div className="font-bold">
          Ready for Delivery
        </div>

        <div className="text-xs mt-1">
          35 pallets
        </div>

      </div>

      <Icon
        name="arrow-down"
        size={28}
        className="text-slate-500"
      />

      <Icon
        name="factory"
        size={42}
        className="text-slate-700"
      />

      <div className="text-center">

        <div className="font-bold">
          To Production
        </div>

        <div className="text-xs text-slate-600">
          (Hand over point)
        </div>

      </div>

    </div>
  );
}