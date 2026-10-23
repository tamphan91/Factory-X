"use client";

import dynamic from "next/dynamic";
import type { EChartsOption } from "echarts";

const ReactECharts = dynamic(
  () => import("echarts-for-react"),
  {
    ssr: false,
  }
);

interface EChartProps {
  option: EChartsOption;
  height?: number | string;
}

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