import type { DemandForecast } from "./demand-forecast";
import type { LeadTimeRange, LeadTimeSeries } from "./lead-time";
import type { ProductDemandSnapshot } from "./product-demand";

export type DemandSnapshot = {
  productDemand: ProductDemandSnapshot;
  forecast: DemandForecast;
  leadTime: Record<LeadTimeRange, LeadTimeSeries[]>;
  updatedAt: string;
};
