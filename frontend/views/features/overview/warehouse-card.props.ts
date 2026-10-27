import type { GaugeKpiBaseProps } from "@/views/common/gauge-kpi-card.props";

export type WarehouseCardProps = Omit<GaugeKpiBaseProps, "title" | "currentOverview">;
