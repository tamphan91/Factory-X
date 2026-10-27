import { GaugeKpiCard } from "@/views/common/gauge-kpi-card";
import type { SupplyRateCardProps } from "./supply-rate-card.props";

export function SupplyRateCard(props: SupplyRateCardProps) {
  return (
    <GaugeKpiCard
      title="Material Supply On-time Rate"
      currentOverview="Delivered on time"
      {...props}
    />
  );
}
