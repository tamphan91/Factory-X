import { ReceivingPanel } from "./receiving-panel";
import { PutawayPanel } from "./putaway-panel";
import { StoragePanel } from "./storage-panel";
import { PickingPanel } from "./picking-panel";
import { StagingPanel } from "./staging-panel";
import { HandoverPanel } from "./handover-panel";
import { ArrowRight } from "lucide-react";
import {
  Forklift,
  Archive,
} from "lucide-react";

function AgvIcon() {
  return (
    <div className="relative w-7 h-5">
      <div
        className="
          absolute
          left-1
          right-1
          top-1
          h-3
          rounded-sm
          border-2
          border-blue-400
        "
      />

      <div
        className="
          absolute
          left-0
          right-0
          bottom-1
          border-b-2
          border-blue-400
        "
      />

      <div
        className="
          absolute
          left-1
          bottom-0
          w-1.5
          h-1.5
          rounded-full
          bg-blue-400
        "
      />

      <div
        className="
          absolute
          right-1
          bottom-0
          w-1.5
          h-1.5
          rounded-full
          bg-blue-400
        "
      />
    </div>
  );
}

function WarehouseFlow() {
  return (
    <div className="relative col-span-9 h-14 mt-0">

      {/* Forklift bên trái */}
      <div
        className="
          absolute
          left-[21%]
          top-2
          flex
          items-center
          text-yellow-400
          z-10
        "
      >
        <Forklift size={26} strokeWidth={2.5} />
      </div>

      {/* Line đi xuống từ Storage */}
      <div
        className="
          absolute
          left-[24%]
          top-0
          h-6
          border-l-2
          border-dashed
          border-blue-400
        "
      />

      {/* Blue flow */}
      <div
        className="
          absolute
          left-[24%]
          right-[73%]
          top-6
          border-t-2
          border-dashed
          border-blue-400
        "
      />

      <div
        className="
          absolute
          left-[27.5%]
          top-3
          text-blue-400
        "
      ><AgvIcon /></div>

      <div
        className="
          absolute
          left-[30%]
          right-[31.5%]
          top-6
          border-t-2
          border-dashed
          border-blue-400
        "
      />

      {/* Blue arrow head */}
      <div
        className="
          absolute
          left-[69%]
          top-[19px]
          w-0
          h-0
          border-t-[5px]
          border-b-[5px]
          border-l-[8px]
          border-t-transparent
          border-b-transparent
          border-l-blue-400
        "
      />

      {/* Delayed red flow */}
      <div
        className="
          absolute
          left-[70%]
          right-[17.5%]
          top-6
          border-t-2
          border-dashed
          border-red-500
        "
      />

      {/* Red arrow */}
      <div
        className="
          absolute
          right-[16.5%]
          top-[19px]
          w-0
          h-0
          border-t-[5px]
          border-b-[5px]
          border-l-[8px]
          border-t-transparent
          border-b-transparent
          border-l-red-500
        "
      />

      {/* AGV / AMR */}
      <div
        className="
          absolute
          right-[13.5%]
          top-3
          text-blue-400
        "
      >
        <AgvIcon />
      </div>
    </div>
  );
}

function WarehouseLegend() {
  return (
    <div
      className="
        col-span-9
        flex
        items-center
        gap-7
        border-t
        border-blue-900
        pt-3
        pb-2
        text-[11px]
        text-slate-200
      "
    >
      {/* Forklift */}
      <div className="flex items-center gap-2">
        <Forklift
          size={26}
          className="text-yellow-400"
        />
        <span>Forklift (FL)</span>
      </div>

      {/* AGV */}
      <div className="flex items-center gap-2">
        <AgvIcon />
        <span>AGV / AMR</span>
      </div>

      {/* Task In Progress */}
      <div className="flex items-center gap-2">
        <div className="w-8 border-t-2 border-dashed border-blue-400" />
        <span>Task in Progress</span>
      </div>

      {/* Queued */}
      <div className="flex items-center gap-2">
        <div className="w-8 border-t-2 border-dashed border-white" />
        <span>Queued</span>
      </div>

      {/* Delayed */}
      <div className="flex items-center gap-2">
        <div className="w-8 border-t-2 border-dashed border-red-500" />
        <span>Delayed</span>
      </div>

      {/* Zone Boundary */}
      <div className="flex items-center gap-2">
        <div
          className="
            w-7
            h-3
            rounded-sm
            border
            border-slate-300
          "
        />
        <span>Zone Boundary</span>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div
      className="
        absolute
        -right-[20px]
        top-1/2
        -translate-y-1/2
        z-20
        flex
        items-center
        justify-center
        text-blue-400
      "
    >
      <ArrowRight
        size={20}
        strokeWidth={5}
      />
    </div>
  );
}

export function WarehouseLayoutMap() {
    return (
        <div
            className="
                bg-[#0d2c6e]
                p-4
                text-white
                space-y-2
            "
            >
            <div className="flex justify-between">
                <h2 className="font-bold text-xl">
                Warehouse Layout & Realtime
                </h2>
            </div>

            {/* Horizontal scroll */}
            <div className="w-full overflow-x-auto">
                <div
                className="
                    grid
                    grid-cols-9
                    gap-x-5
                    gap-y-0
                    min-w-[1200px]
                    border
                    border-gray-800
                    p-1
                    bg-[#102e63]
                    [background-image:linear-gradient(rgba(100,160,220,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(100,160,220,0.08)_1px,transparent_1px)]
                    [background-size:22px_22px]
                "
                >
                {/* Receiving */}
                <div className="col-span-1 relative">
                    <ReceivingPanel />
                    <FlowArrow />
                </div>

                {/* Put-away */}
                <div className="col-span-1 relative">
                    <PutawayPanel />
                    <FlowArrow />
                </div>

                {/* Storage */}
                <div className="col-span-3 relative">
                    <StoragePanel />
                    <FlowArrow />
                </div>

                {/* Picking */}
                <div className="col-span-2 relative">
                    <PickingPanel />
                    <FlowArrow />
                </div>

                {/* Staging */}
                <div className="col-span-1 relative">
                    <StagingPanel />
                    <FlowArrow />
                </div>

                {/* Handover */}
                <div className="col-span-1 relative">
                    <HandoverPanel />
                </div>

                {/* Bottom warehouse flow */}
                <WarehouseFlow />

                </div>
            </div>
                {/* Legend */}
                <WarehouseLegend />
            </div>
    );
}