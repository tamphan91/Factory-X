"use client";

import { buildLeadTimeOption } from "@/views/common/charts/build-lead-time-option";
import { EChart } from "@/views/common/echart";
import { FilterSelect } from "@/views/common/filter-select";
import { PanelCard } from "@/views/common/panel-card";
import type { LeadTimeTrendChartProps } from "./lead-time-trend-chart.props";

const CHART_HEIGHT = 300;

export function LeadTimeTrendChart({
  range,
  rangeOptions,
  onRangeChange,
  ...data
}: LeadTimeTrendChartProps) {
  return (
    <PanelCard
      title="Lead Time Trend by Process"
      actions={
        <FilterSelect
          label="Lead time range"
          options={rangeOptions}
          value={range}
          onChange={onRangeChange}
          widthClass="w-[150px]"
        />
      }
    >
      <EChart option={buildLeadTimeOption(data)} height={CHART_HEIGHT} />
    </PanelCard>
  );
}
