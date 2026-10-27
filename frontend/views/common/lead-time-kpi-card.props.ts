import type { ProcessKey } from "@/models/domain/process";
import type { Tone } from "@/models/domain/tone";

export interface LeadTimeKpiCardProps {
  /** "Inbound Lead Time" | "Picking / Kitting Lead Time" */
  title: string;
  value: number;
  /** targetTone(value, target, "max"), computed in the controller. */
  valueTone: Tone;
  /** Default "min". */
  unit?: string;
  /** Shown as "Target ≤ 60 min". */
  target: number;
  /** Text such as "-15%"; tone from deltaTone, computed in the controller. */
  delta?: { text: string; tone: Tone };
  trend: number[];
  /** Decides the trend-line colour. */
  process: ProcessKey;
}
