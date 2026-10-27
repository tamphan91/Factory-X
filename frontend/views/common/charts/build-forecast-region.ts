import { forecastShadeColor, toneColor } from "@/lib/chart-colors";
import type { MarkAreaComponentOption } from "echarts";

type ForecastRegionInput = {
  /** First category index inside the region; the area starts at the left edge of its band. */
  fromIndex: number;
  /** Last category index inside the region; the area ends at the right edge of its band. */
  toIndex: number;
};

type ForecastRegion = {
  markArea: MarkAreaComponentOption;
};

const EDGE_LINE_WIDTH = 1.2;

/** Shaded forecast area with a dashed outline and a "Forecast" label. Spread it into one series of a chart. */
export const buildForecastRegion = ({
  fromIndex,
  toIndex,
}: ForecastRegionInput): ForecastRegion => {
  const edgeColor = toneColor("unavailable");

  return {
    markArea: {
      silent: true,
      itemStyle: {
        color: forecastShadeColor(),
        borderColor: edgeColor,
        borderType: "dashed",
        borderWidth: EDGE_LINE_WIDTH,
      },
      label: { show: true, position: "top", formatter: "Forecast", color: edgeColor },
      data: [[{ xAxis: fromIndex }, { xAxis: toIndex }]],
    },
  };
};
