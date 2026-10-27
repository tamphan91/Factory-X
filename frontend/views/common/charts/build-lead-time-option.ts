import { processColor } from "@/lib/chart-colors";
import type { EChartsOption, LineSeriesOption } from "echarts";
import type { LeadTimeChartData } from "@/views/features/demand/lead-time-trend-chart.props";
import { buildForecastRegion } from "./build-forecast-region";

const AXIS_MIN_MAX = 120;
const AXIS_STEP = 20;
/** One label every two hours: the data has a point every half hour. */
const LABEL_INTERVAL = 3;
const SYMBOL_SIZE = 5;

export const buildLeadTimeOption = ({
  labels,
  lines,
  forecastStart,
}: LeadTimeChartData): EChartsOption => {
  const region = buildForecastRegion({
    fromIndex: forecastStart,
    toIndex: labels.length - 1,
  });

  const series: LineSeriesOption[] = lines.flatMap((line, index) => {
    const color = processColor(line.process);
    return [
      {
        name: line.label,
        type: "line",
        symbolSize: SYMBOL_SIZE,
        lineStyle: { width: 2, color },
        itemStyle: { color },
        data: line.actual,
        // The region is drawn once, on the first line.
        ...(index === 0 ? region : {}),
      },
      {
        name: `${line.label} (forecast)`,
        type: "line",
        symbolSize: SYMBOL_SIZE,
        lineStyle: { width: 2, type: "dotted", color },
        itemStyle: { color },
        data: line.forecast,
      },
    ];
  });

  return {
    tooltip: { trigger: "axis" },
    legend: { top: 0, data: lines.map((line) => line.label) },
    grid: { top: 56, left: 56, right: 20, bottom: 32 },
    xAxis: {
      type: "category",
      data: labels,
      boundaryGap: false,
      axisLabel: { interval: LABEL_INTERVAL },
    },
    yAxis: {
      type: "value",
      name: "Lead Time (min)",
      nameLocation: "middle",
      nameGap: 42,
      min: 0,
      max: (value: { max: number }) =>
        Math.max(AXIS_MIN_MAX, Math.ceil(value.max / AXIS_STEP) * AXIS_STEP),
      interval: AXIS_STEP,
    },
    series,
  };
};
