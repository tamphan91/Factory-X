import { WarehouseLayoutMap } from "@/components/warehouse/warehouse-layout-map";
import { ResourceStatusCard } from "@/components/warehouse/resource-status-card";
import { ZonePerformanceTable } from "@/components/warehouse/zone-performance-table";
import { TopQueueChart } from "@/components/warehouse/top-queue-chart";

export function WarehouseOperationsPage() {
  return (
    <div className="p-4 space-y-4">

      <WarehouseLayoutMap />

      <div className="grid grid-cols-12 gap-4">

        <div className="col-span-3">
          <ResourceStatusCard />
        </div>

        <div className="col-span-5">
          <ZonePerformanceTable />
        </div>

        <div className="col-span-4">
          <TopQueueChart />
        </div>

      </div>

    </div>
  );
}