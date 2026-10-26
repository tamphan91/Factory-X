import { Card } from "@/components/ui/card";
import { ZoneCard } from "./zone-card";
import { ReceivingPanel } from "./receiving-panel";
import { PutawayPanel } from "./putaway-panel";
import { StoragePanel } from "./storage-panel";
import { PickingPanel } from "./picking-panel";
import { StagingPanel } from "./staging-panel";
import { HandoverPanel } from "./handover-panel";

export function WarehouseLayoutMap() {
    return (
        <Card
            className="
      bg-[#0d2c6e]
      p-4
      text-white
      "
        >

            <div className="flex justify-between">

                <h2 className="font-bold text-xl">
                    Warehouse Layout & Realtime
                </h2>

            </div>

            <div className="grid grid-cols-9 gap-4">

                {/* Receiving */}
                <div className="col-span-1">
                    <ReceivingPanel />
                </div>

                {/* Put-away */}
                <div className="col-span-1">
                    <PutawayPanel />
                </div>

                {/* Storage */}
                <div className="col-span-3">
                    <StoragePanel />
                </div>

                {/* Picking */}
                <div className="col-span-2">
                    <PickingPanel />
                </div>

                {/* Staging */}
                <div className="col-span-1">
                    <StagingPanel />
                </div>

                {/* Handover */}
                <div className="col-span-1">
                    <HandoverPanel />
                </div>

            </div>

        </Card>
    );
}