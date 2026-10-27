import type { ThroughputItem } from "@/models/types/throughput";

/** Horizontal card: bar scale headroom, same as the prototype. */
export const BAR_HEADROOM = 1.12;
/** Vertical card: y-axis headroom. */
export const AXIS_HEADROOM = 1.18;
/** All values 0: avoids a 0-0 axis. */
const EMPTY_AXIS_MAX = 10;

/** Bar width in percent for the horizontal card. Actual values only. */
export const barPercent = (value: number, items: ThroughputItem[]): number => {
  const max = Math.max(0, ...items.map((item) => item.actual)) * BAR_HEADROOM;
  return max ? Math.min(100, (value / max) * 100) : 0;
};

/** Y-axis maximum for the vertical card; includes targets when they are drawn. */
export const axisMax = (items: ThroughputItem[], withTarget: boolean): number => {
  const max = Math.max(
    0,
    ...items.flatMap((item) => [item.actual, withTarget ? (item.target ?? 0) : 0]),
  );
  return max ? max * AXIS_HEADROOM : EMPTY_AXIS_MAX;
};
