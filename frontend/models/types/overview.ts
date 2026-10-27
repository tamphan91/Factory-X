import type { ProcessKey } from "@/models/domain/process";
import type { Tone } from "@/models/domain/tone";
import type { AlertItem } from "./alert";
import type { ThroughputItem } from "./throughput";

/** Secondary number with its label, for example 8 Overdue. */
export type CurrentNotice = { value: number; label: string; tone: Tone };

/** Facts behind a ring card. The percent is computed from these, never stored. */
export type GaugeSnapshot = {
  current: number;
  total: number;
  /** Change versus yesterday, in percent. */
  deltaPct?: number;
};

export type LeadTimeSnapshot = {
  process: ProcessKey;
  value: number;
  target: number;
  deltaPct?: number;
  trend: number[];
};

export type OverviewSnapshot = {
  supply: GaugeSnapshot;
  staging: GaugeSnapshot;
  warehouse: GaugeSnapshot;
  inbound: LeadTimeSnapshot;
  picking: LeadTimeSnapshot;
  throughput: ThroughputItem[];
  alerts: AlertItem[];
  updatedAt: string;
};
