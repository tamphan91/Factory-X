import { forecastShadeColor, toneColor } from "@/lib/chart-colors";
import type { MarkAreaComponentOption, MarkLineComponentOption } from "echarts";

type ForecastRegionInput = {
  /** Category-axis coordinate where the forecast starts; a .5 puts the edge between two categories. */
  fromIndex: number;
  /** Category-axis coordinate where it ends. */
  toIndex: number;
};

type ForecastRegion = {
  markArea: MarkAreaComponentOption;
  markLine: MarkLineComponentOption;
};

/** Shaded forecast area with a dashed edge and a "Forecast" label. Spread it into one series of a chart. */
export const buildForecastRegion = ({
  fromIndex,
  toIndex,
}: ForecastRegionInput): ForecastRegion => {
  const edgeColor = toneColor("unavailable");

  return {
    markArea: {
      silent: true,
      itemStyle: { color: forecastShadeColor() },
      label: { show: true, position: "top", formatter: "Forecast", color: edgeColor },
      data: [[{ xAxis: fromIndex }, { xAxis: toIndex }]],
    },
    markLine: {
      silent: true,
      symbol: "none",
      label: { show: false },
      lineStyle: { color: edgeColor, type: "dashed", width: 1.2 },
      data: [{ xAxis: fromIndex }],
    },
  };
};
