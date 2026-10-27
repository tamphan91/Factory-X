"use client";

import {
  Factory,
  ArrowDown,
  Building2,
} from "lucide-react";

export function HandoverPanel() {
  return (
    <div
      className="
      bg-slate-100
      text-slate-900
      rounded-md
      p-4
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

      <Building2
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

      <ArrowDown
        size={28}
        className="text-slate-500"
      />

      <Factory
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