"use client";

import dynamic from "next/dynamic";
import type { EChartProps } from "./echart.props";

const ReactECharts = dynamic(
  () => import("echarts-for-react"),
  {
    ssr: false,
  }
);

export function EChart({
  option,
  height = 300,
}: EChartProps) {
  return (
    <ReactECharts
      option={option}
      notMerge
      lazyUpdate
      style={{
        width: "100%",
        height,
      }}
    />
  );
}