import { LeadTimeKpiCard } from "@/views/common/lead-time-kpi-card";
import { AlertsPanel } from "./alerts-panel";
import type { OverviewPageProps } from "./overview-page.props";
import { StagingCard } from "./staging-card";
import { SupplyRateCard } from "./supply-rate-card";
import { ThroughputCard } from "./throughput-card";
import { WarehouseCard } from "./warehouse-card";

export function OverviewPage({ vm, actions }: OverviewPageProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <SupplyRateCard {...vm.supply} />
        </div>
        <div className="col-span-4">
          <LeadTimeKpiCard {...vm.inbound} />
        </div>
        <div className="col-span-4">
          <LeadTimeKpiCard {...vm.picking} />
        </div>
        <div className="col-span-4">
          <StagingCard {...vm.staging} />
        </div>
        <div className="col-span-4">
          <WarehouseCard {...vm.warehouse} />
        </div>
        <div className="col-span-4">
          <ThroughputCard
            orientation="horizontal"
            items={vm.throughput.items}
            periodLabel="Today"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-5">
          <AlertsPanel
            {...vm.alerts}
            onFilterChange={actions.onAlertFilterChange}
            onViewAll={actions.onViewAllAlerts}
          />
        </div>
        <div className="col-span-7">
          <ThroughputCard
            orientation="vertical"
            items={vm.throughput.items}
            mode={vm.throughput.mode}
            axisMax={vm.throughput.axisMax}
            onModeChange={actions.onThroughputModeChange}
          />
        </div>
      </div>
    </div>
  );
}
