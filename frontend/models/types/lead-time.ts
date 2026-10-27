import type { ProcessKey } from "@/models/domain/process";

export type LeadTimeRange = "today" | "yesterday" | "week";

/** Minutes per half-hour slot, starting at the first slot of the day. */
export type LeadTimeSeries = {
  /** Decides the colour. */
  process: ProcessKey;
  /** "Receiving" | "Put-away" | "Picking / Kitting" | "Staging" */
  label: string;
  /** Left out when another snapshot owns the actual points (Overview for today). */
  actual?: number[];
  /** Slots after the last actual point. */
  forecast: number[];
};
