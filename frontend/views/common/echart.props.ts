import type { EChartsOption } from "echarts";

export interface EChartProps {
  option: EChartsOption;
  /** Default 300. */
  height?: number | string;
}
