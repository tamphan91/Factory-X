import type { ProcessKey } from "@/models/domain/process";
import type { Tone } from "@/models/domain/tone";

export interface ProgressBarProps {
  /** 0-100, computed in the controller. */
  percent: number;
  /** A status tone, or a process identity colour. */
  appearance: { tone: Tone } | { process: ProcessKey };
  /** Tailwind height class. Default "h-3". */
  heightClass?: string;
  /** Accessible name of the bar. */
  label?: string;
}
