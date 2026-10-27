import { capacityColor, toneColor } from "@/lib/chart-colors";
import type { EChartsOption } from "echarts";
import type { ForecastChartData } from "@/views/features/demand/demand-forecast-chart.props";
import { buildForecastRegion } from "./build-forecast-region";

const DEMAND_NAME = "Material Demand (pallets)";
const WAREHOUSE_NAME = "Warehouse Capacity";
const STAGING_NAME = "Staging Capacity";

export const buildForecastOption = ({
  labels,
  demand,
  warehouseCapacity,
  stagingCapacity,
  axisMax,
  axisInterval,
  actualDays,
}: ForecastChartData): EChartsOption => {
  const hasForecast = actualDays < labels.length;
  const region = hasForecast
    ? buildForecastRegion({ fromIndex: actualDays, toIndex: labels.length - 1 })
    : {};

  return {
    tooltip: { trigger: "axis" },
    legend: { top: 0, data: [DEMAND_NAME, WAREHOUSE_NAME, STAGING_NAME] },
    grid: { top: 56, left: 56, right: 20, bottom: 32 },
    xAxis: { type: "category", data: labels },
    yAxis: {
      type: "value",
      name: "Pallets",
      nameLocation: "middle",
      nameGap: 42,
      min: 0,
      max: axisMax,
      interval: axisInterval,
      axisLabel: { formatter: (value: number) => value.toLocaleString("en-US") },
    },
    series: [
      {
        name: DEMAND_NAME,
        type: "bar",
        barWidth: "45%",
        itemStyle: { color: toneColor("neutral") },
        data: demand,
        ...region,
      },
      {
        name: WAREHOUSE_NAME,
        type: "line",
        step: "end",
        symbol: "none",
        lineStyle: { type: "dashed", width: 2, color: capacityColor("warehouse") },
        itemStyle: { color: capacityColor("warehouse") },
        data: warehouseCapacity,
      },
      {
        name: STAGING_NAME,
        type: "line",
        step: "end",
        symbol: "none",
        lineStyle: { type: "dashed", width: 2, color: capacityColor("staging") },
        itemStyle: { color: capacityColor("staging") },
        data: stagingCapacity,
      },
    ],
  };
};
