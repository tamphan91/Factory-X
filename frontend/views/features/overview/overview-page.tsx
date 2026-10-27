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
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <SupplyRateCard {...vm.supply} />
        </div>
        <div>
          <LeadTimeKpiCard {...vm.inbound} />
        </div>
        <div>
          <LeadTimeKpiCard {...vm.picking} />
        </div>
        <div>
          <StagingCard {...vm.staging} />
        </div>
        <div>
          <WarehouseCard {...vm.warehouse} />
        </div>
        <div>
          <ThroughputCard
            orientation="horizontal"
            items={vm.throughput.items}
            periodLabel="Today"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <AlertsPanel
            {...vm.alerts}
            onFilterChange={actions.onAlertFilterChange}
            onViewAll={actions.onViewAllAlerts}
          />
        </div>
        <div className="xl:col-span-7">
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
