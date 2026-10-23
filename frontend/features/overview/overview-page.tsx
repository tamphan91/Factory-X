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

      <div className="grid grid-cols-12 gap-2">

        <div className="col-span-4">
          <SupplyRateCard />
        </div>

        <div className="col-span-4">
          <InboundLeadtimeCard />
        </div>

        <div className="col-span-4">
          <PickingLeadtimeCard />
        </div>

        <div className="col-span-4">
          <StagingCard />
        </div>

        <div className="col-span-4">
          <WarehouseCard />
        </div>

        <div className="col-span-4">
          <ThroughputSummaryCard />
        </div>

      </div>

      {/* Main Content */}

      <div className="grid grid-cols-12 gap-2">

        <div className="col-span-5">
          <AlertsPanel />
        </div>

        <div className="col-span-7">
          <ThroughputChart />
        </div>

      </div>

    </div>
  );
}