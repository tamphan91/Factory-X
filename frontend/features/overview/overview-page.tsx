import { AlertsPanel } from "@/components/overview/alerts-panel";
import { ThroughputChart } from "@/components/overview/throughput-chart";
import { SupplyRateCard } from "@/components/overview/supply-rate-card";
import { InboundLeadtimeCard } from "@/components/overview/inbound-leadtime-card";
import { PickingLeadtimeCard } from "@/components/overview/picking-leadtime-card";
import { StagingCard } from "@/components/overview/staging-card";
import { WarehouseCard } from "@/components/overview/warehouse-card";
import { ThroughputSummaryCard } from "@/components/overview/throughput-summary-card";

export function OverviewPage() {
  return (
    <div className="space-y-2">

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">

        <div>
          <SupplyRateCard />
        </div>

        <div>
          <InboundLeadtimeCard />
        </div>

        <div>
          <PickingLeadtimeCard />
        </div>

        <div>
          <StagingCard />
        </div>

        <div>
          <WarehouseCard />
        </div>

        <div>
          <ThroughputSummaryCard />
        </div>

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">

        <div className="xl:col-span-5">
          <AlertsPanel />
        </div>

        <div className="xl:col-span-7">
          <ThroughputChart />
        </div>

      </div>

    </div>
  );
}