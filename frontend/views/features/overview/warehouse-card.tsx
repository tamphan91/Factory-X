import { GaugeKpiCard } from "@/views/common/gauge-kpi-card";
import type { WarehouseCardProps } from "./warehouse-card.props";

export function WarehouseCard(props: WarehouseCardProps) {
  return (
    <GaugeKpiCard
      title="Warehouse Occupancy"
      currentOverview="Pallet Locations"
      {...props}
    />
  );
}
