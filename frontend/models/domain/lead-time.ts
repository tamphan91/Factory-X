import type { ProcessKey } from "@/models/domain/process";
import type {
  LeadTimeLine,
  LeadTimeRange,
  LeadTimeSeries,
} from "@/models/types/lead-time";
import type { OverviewSnapshot } from "@/models/types/overview";

const FIRST_SLOT_MINUTES = 8 * 60;
const SLOT_MINUTES = 30;
/** 08:00 to 22:00 inclusive. */
export const LEAD_TIME_SLOT_COUNT = 29;

const pad = (value: number): string => String(value).padStart(2, "0");

/** "08:00", "08:30", ... "22:00". */
export const timeLabels = (): string[] =>
  Array.from({ length: LEAD_TIME_SLOT_COUNT }, (_, slot) => {
    const minutes = FIRST_SLOT_MINUTES + slot * SLOT_MINUTES;
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  });

/** Overview owns the actual points of these two processes for today. */
const overviewActual = (
  process: ProcessKey,
  overview: OverviewSnapshot,
): number[] => {
  switch (process) {
    case "inbound":
      return overview.inbound.trend;
    case "picking":
      return overview.picking.trend;
    default:
      return [];
  }
};

const slots = (values: (number | null)[]): (number | null)[] =>
  Array.from({ length: LEAD_TIME_SLOT_COUNT }, (_, slot) => values[slot] ?? null);

const toLine = (series: LeadTimeSeries, actualPoints: number[]): LeadTimeLine => {
  const actual = actualPoints.slice(0, LEAD_TIME_SLOT_COUNT);
  const lastActual = actual.length > 0 ? actual[actual.length - 1] : null;
  const forecast = [
    ...Array<number | null>(Math.max(0, actual.length - 1)).fill(null),
    ...(lastActual === null ? [] : [lastActual]),
    ...series.forecast,
  ];
  return {
    process: series.process,
    label: series.label,
    actualCount: actual.length,
    actual: slots(actual),
    forecast: slots(forecast),
  };
};

/**
 * One chart line per series. For today, Receiving and Picking take their actual
 * points from the Overview snapshot; every other range and process uses its own.
 * The forecast segment starts at the last actual point so the line stays connected.
 */
export const resolveLeadTimeSeries = (
  range: LeadTimeRange,
  series: LeadTimeSeries[],
  overview: OverviewSnapshot,
): LeadTimeLine[] =>
  series.map((item) => {
    const fromOverview = range === "today" ? overviewActual(item.process, overview) : [];
    return toLine(item, item.actual ?? fromOverview);
  });
