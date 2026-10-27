import { DemandForecastChart } from "./demand-forecast-chart";
import type { DemandPageProps } from "./demand-page.props";
import { LeadTimeTrendChart } from "./lead-time-trend-chart";
import { ProductDemandPanel } from "./product-demand-panel";

export function DemandPage({ vm, actions }: DemandPageProps) {
  return (
    <div className="grid grid-cols-1 gap-2 xl:grid-cols-12">
      <div className="xl:col-span-5">
        <ProductDemandPanel {...vm.products} onSortChange={actions.onSortChange} />
      </div>
      <div className="space-y-2 xl:col-span-7">
        <DemandForecastChart
          {...vm.forecast}
          onRangeChange={actions.onForecastRangeChange}
        />
        <LeadTimeTrendChart
          {...vm.leadTime}
          onRangeChange={actions.onLeadTimeRangeChange}
        />
      </div>
    </div>
  );
}
