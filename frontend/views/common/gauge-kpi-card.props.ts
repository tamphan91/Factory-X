import type { Tone } from "@/models/domain/tone";
import type { CurrentNotice } from "@/models/types/overview";

export type { CurrentNotice };

/** Display-ready: percent and tones are computed in the controller. */
export interface GaugeKpiBaseProps {
  title: string;
  /** "192 / 200" */
  currentStats: { current: number; total: number };
  /** "Delivered on time" */
  currentOverview: string;
  currentNotice: CurrentNotice;
  /** percentOf(currentStats), computed in the controller. */
  percent: number;
  /** The tone rule of the card applied to percent. */
  ringTone: Tone;
  /** Text such as "+2%"; tone from deltaTone. */
  delta?: { text: string; tone: Tone };
}
