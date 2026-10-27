import type { LeadTimeKpiCardProps } from "@/views/common/lead-time-kpi-card.props";
import type { AlertsPanelProps } from "./alerts-panel.props";
import type { StagingCardProps } from "./staging-card.props";
import type { SupplyRateCardProps } from "./supply-rate-card.props";
import type {
  ThroughputItemVM,
  ThroughputMode,
} from "./throughput-card.props";
import type { WarehouseCardProps } from "./warehouse-card.props";

/** Display-ready data for the whole page; built in controllers/overview.vm.ts. */
export interface OverviewVM {
  supply: SupplyRateCardProps;
  inbound: LeadTimeKpiCardProps;
  picking: LeadTimeKpiCardProps;
  staging: StagingCardProps;
  warehouse: WarehouseCardProps;
  throughput: {
    items: ThroughputItemVM[];
    mode: ThroughputMode;
    axisMax: number;
  };
  alerts: Pick<AlertsPanelProps, "items" | "total" | "filter">;
}

export interface OverviewActions {
  onThroughputModeChange: (mode: ThroughputMode) => void;
  onAlertFilterChange: AlertsPanelProps["onFilterChange"];
  onViewAllAlerts: () => void;
}

export interface OverviewPageProps {
  vm: OverviewVM;
  actions: OverviewActions;
}
