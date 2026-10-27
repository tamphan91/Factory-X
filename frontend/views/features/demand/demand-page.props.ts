import type { DemandForecastChartProps } from "./demand-forecast-chart.props";
import type { LeadTimeTrendChartProps } from "./lead-time-trend-chart.props";
import type { ProductDemandPanelProps } from "./product-demand-panel.props";

/** Display-ready data for the whole page; built in controllers/demand.vm.ts. */
export interface DemandVM {
  products: Omit<ProductDemandPanelProps, "onSortChange">;
  forecast: Omit<DemandForecastChartProps, "onRangeChange">;
  leadTime: Omit<LeadTimeTrendChartProps, "onRangeChange">;
}

export interface DemandActions {
  onSortChange: ProductDemandPanelProps["onSortChange"];
  onForecastRangeChange: DemandForecastChartProps["onRangeChange"];
  onLeadTimeRangeChange: LeadTimeTrendChartProps["onRangeChange"];
}

export interface DemandPageProps {
  vm: DemandVM;
  actions: DemandActions;
}
