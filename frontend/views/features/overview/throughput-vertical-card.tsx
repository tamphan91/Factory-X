"use client";

import { EChart } from "@/components/charts/echart";
import { buildThroughputOption } from "@/views/common/charts/build-throughput-option";
import { FilterSelect } from "@/views/common/filter-select";
import type { FilterOption } from "@/views/common/filter-select.props";
import { PanelCard } from "@/views/common/panel-card";
import type {
  ThroughputMode,
  ThroughputVerticalCardProps,
} from "./throughput-card.props";

const MODE_OPTIONS: FilterOption<ThroughputMode>[] = [
  { value: "actual", label: "Actual" },
  { value: "target", label: "Actual vs Target" },
];

export function ThroughputVerticalCard({
  items,
  unit = "pallets",
  mode,
  axisMax,
  onModeChange,
}: ThroughputVerticalCardProps) {
  return (
    <PanelCard
      title="Throughput by Process"
      className="h-[480px]"
      actions={
        <FilterSelect
          label="Throughput mode"
          options={MODE_OPTIONS}
          value={mode}
          onChange={onModeChange}
          widthClass="w-[160px]"
        />
      }
    >
      <EChart
        option={buildThroughputOption({ items, mode, axisMax, unit })}
        height={390}
      />
    </PanelCard>
  );
}
