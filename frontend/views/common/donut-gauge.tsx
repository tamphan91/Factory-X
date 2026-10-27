"use client";

import { EChart } from "@/views/common/echart";
import { processColor, toneColor } from "@/lib/chart-colors";
import type { EChartsOption } from "echarts";
import type { DonutGaugeProps } from "./donut-gauge.props";

export function DonutGauge({ percent, appearance, height = 110 }: DonutGaugeProps) {
  const color =
    "tone" in appearance
      ? toneColor(appearance.tone)
      : processColor(appearance.process);

  const option: EChartsOption = {
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        progress: { show: true, width: 14, itemStyle: { color } },
        axisLine: { lineStyle: { width: 14 } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, 0],
          fontSize: 16,
          formatter: Number.isNaN(percent) ? "–" : "{value}%",
        },
        data: [{ value: Number.isNaN(percent) ? 0 : percent }],
      },
    ],
  };

  return <EChart option={option} height={height} />;
}
