"use client";

import { EChart } from "@/components/charts/echart";
import { processColor } from "@/lib/chart-colors";
import type { ChartOption } from "@/types/echarts";
import type { SparklineProps } from "./sparkline.props";

export function Sparkline({ data, process }: SparklineProps) {
  const color = processColor(process);

  const option: ChartOption = {
    animation: false,
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: "category", show: false, data: data.map((_, idx) => idx) },
    yAxis: { type: "value", show: false },
    series: [
      {
        data,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 4,
        lineStyle: { width: 2, color },
        itemStyle: { color },
        areaStyle: { opacity: 0.15, color },
      },
    ],
  };

  return <EChart option={option} height={30} />;
}
