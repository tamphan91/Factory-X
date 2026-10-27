import { GaugeKpiCard } from "@/views/common/gauge-kpi-card";
import type { StagingCardProps } from "./staging-card.props";

export function StagingCard(props: StagingCardProps) {
  return (
    <GaugeKpiCard
      title="Staging Occupancy"
      currentOverview="Used Slots"
      {...props}
    />
  );
}
