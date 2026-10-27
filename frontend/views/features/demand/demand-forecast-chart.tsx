"use client";

import { buildForecastOption } from "@/views/common/charts/build-forecast-option";
import { EChart } from "@/views/common/echart";
import { FilterSelect } from "@/views/common/filter-select";
import { PanelCard } from "@/views/common/panel-card";
import type { DemandForecastChartProps } from "./demand-forecast-chart.props";

const CHART_HEIGHT = 300;

export function DemandForecastChart({
  range,
  rangeOptions,
  onRangeChange,
  ...data
}: DemandForecastChartProps) {
  return (
    <PanelCard
      title="Demand & Capacity Forecast"
      actions={
        <FilterSelect
          label="Forecast range"
          options={rangeOptions}
          value={range}
          onChange={onRangeChange}
          widthClass="w-[150px]"
        />
      }
    >
      <EChart option={buildForecastOption(data)} height={CHART_HEIGHT} />
    </PanelCard>
  );
}
