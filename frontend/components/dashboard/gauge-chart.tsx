"use client";

import { EChart } from "@/components/charts/echart";
import { ChartOption } from "@/types/echarts";

interface GaugeChartProps {
  value: number;
  color: string;
}

export function GaugeChart({
  value,
  color,
}: GaugeChartProps) {
  const option: ChartOption = {
    series: [
      {
        type: "gauge",

        startAngle: 90,
        endAngle: -270,

        progress: {
          show: true,
          width: 14,
          itemStyle: {
            color,
          },
        },

        axisLine: {
          lineStyle: {
            width: 14,
          },
        },

        pointer: {
          show: false,
        },

        axisTick: {
          show: false,
        },

        splitLine: {
          show: false,
        },

        axisLabel: {
          show: false,
        },

        detail: {
          valueAnimation: true,
          offsetCenter: [0, 0],
          fontSize: 16,
          formatter: "{value}%",
        },

        data: [
          {
            value,
          },
        ],
      },
    ],
  };

  return (
    <EChart
      option={option}
      height={110}
    />
  );
}
