import { WarehouseLayoutMap } from "./warehouse-layout-map";
import { ResourceStatusCard } from "@/components/warehouse/resource-status-card";
import { ZonePerformanceTable } from "@/components/warehouse/zone-performance-table";
import { TopQueueChart } from "@/components/warehouse/top-queue-chart";

export function WarehouseOperationsPage() {
  return (
    <div className="space-y-2">

      <WarehouseLayoutMap />

     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-2">

        <div className="xl:col-span-3">
            <ResourceStatusCard />
        </div>

        <div className="xl:col-span-5">
            <ZonePerformanceTable />
        </div>

        <div className="xl:col-span-4">
            <TopQueueChart />
        </div>

        </div>

    </div>
  );
}