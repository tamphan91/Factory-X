import type { Tone } from "@/models/domain/tone";

export interface DemandTotalProps {
  /** "Total Material Requests" */
  label: string;
  /** Computed from the rows in the controller. */
  total: number;
  /** Text such as "+10%"; tone from deltaTone, computed in the controller. */
  delta: { text: string; tone: Tone };
  /** "(vs. yesterday)" */
  caption: string;
}
