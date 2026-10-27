import type { GaugeKpiBaseProps } from "@/views/common/gauge-kpi-card.props";

export type StagingCardProps = Omit<GaugeKpiBaseProps, "title" | "currentOverview">;
