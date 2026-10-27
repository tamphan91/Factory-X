import type { EChartsOption } from "echarts";

export const FACTORY_THEME: Partial<EChartsOption> = {
  textStyle: {
    fontFamily: "Inter",
  },

  grid: {
    left: 40,
    right: 20,
    bottom: 40,
    top: 40,
  },

  tooltip: {
    trigger: "item",
  },
};