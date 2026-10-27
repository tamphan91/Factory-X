import type { GaugeKpiBaseProps } from "@/views/common/gauge-kpi-card.props";

export type SupplyRateCardProps = Omit<GaugeKpiBaseProps, "title" | "currentOverview">;
