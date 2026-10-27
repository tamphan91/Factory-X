import type { ProcessKey } from "@/models/domain/process";
import type { Tone } from "@/models/domain/tone";

export interface DonutGaugeProps {
  /** 0-100, computed in the controller. NaN draws an empty ring. */
  percent: number;
  /** A status tone, or a process identity colour. */
  appearance: { tone: Tone } | { process: ProcessKey };
  /** Chart height in px. Default 110. */
  height?: number;
}
