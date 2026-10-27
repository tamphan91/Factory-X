"use client";

import { Card } from "@/views/common/ui/card";
import { EChart } from "@/views/common/echart";
import { ChartOption } from "@/types/echarts";

export function TopQueueChart() {
  const option: ChartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },

    legend: {
      top: 5,
      right: 10,
      textStyle: {
        color: "#334155",
      },
    },

    grid: {
      left: 80,
      right: 20,
      top: 50,
      bottom: 10,
      containLabel: true,
    },

    xAxis: {
      type: "value",
      show: false,
    },

    yAxis: {
      type: "category",

      data: [
        "Zone G",
        "Zone E",
        "Zone B",
        "Staging",
        "Zone H",
      ],
    },

    series: [
      {
        name: "Waiting",

        type: "bar",

        stack: "total",

        label: {
          show: true,
          color: "#fff",
        },

        itemStyle: {
          color: "#3478f6",
        },

        data: [8, 6, 5, 3, 4],
      },

      {
        name: "In Progress",

        type: "bar",

        stack: "total",

        label: {
          show: true,
          color: "#fff",
        },

        itemStyle: {
          color: "#8b5cf6",
        },

        data: [12, 10, 7, 6, 4],
      },

      {
        name: "Remaining",

        type: "bar",

        stack: "total",

        silent: true,

        itemStyle: {
          color: "#e2e8f0",
        },

        data: [5, 5, 8, 11, 12],
      },
    ],
  };

  return (
    <Card className="p-4 h-full">

      <div className="flex justify-between mb-4">

        <h3 className="font-bold text-lg">
          Top 5 Queue by Zone
        </h3>

        <select className="border rounded px-2 py-1 text-sm">
          <option>Top 5</option>
        </select>

      </div>

      <EChart
        option={option}
        height={320}
      />

    </Card>
  );
}