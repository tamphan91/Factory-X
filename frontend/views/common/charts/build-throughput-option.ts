import { processColor, targetColor } from "@/lib/chart-colors";
import type { EChartsOption } from "echarts";
import type {
  ThroughputItemVM,
  ThroughputMode,
} from "@/views/features/overview/throughput-card.props";

type BuildThroughputOptionInput = {
  items: ThroughputItemVM[];
  mode: ThroughputMode;
  axisMax: number;
  unit: string;
};

export const buildThroughputOption = ({
  items,
  mode,
  axisMax,
  unit,
}: BuildThroughputOptionInput): EChartsOption => {
  const showTarget = mode === "target";

  return {
    tooltip: { trigger: "item" },
    legend: showTarget ? { top: 0, data: ["Actual", "Target"] } : undefined,
    grid: { top: 40, left: 50, right: 20, bottom: 40 },
    xAxis: { type: "category", data: items.map((item) => item.label) },
    yAxis: {
      type: "value",
      name: unit.charAt(0).toUpperCase() + unit.slice(1),
      max: axisMax,
    },
    series: [
      {
        name: "Actual",
        type: "bar",
        barMaxWidth: showTarget ? 60 : 140,
        label: { show: true, position: "top" },
        data: items.map((item) => ({
          value: item.actual,
          itemStyle: { color: processColor(item.process) },
        })),
      },
      ...(showTarget
        ? [
            {
              name: "Target",
              type: "bar" as const,
              barMaxWidth: 60,
              label: { show: true, position: "top" as const },
              itemStyle: { color: targetColor() },
              data: items.map((item) => item.target ?? 0),
            },
          ]
        : []),
    ],
  };
};
