import type { Tone } from "@/models/domain/tone";

export interface SignalBarsProps {
  /** Lit bars, 1 to 4; computed by `signalLevel`. */
  level: number;
  /** Colour of the lit bars; computed by `productTone`. */
  tone: Tone;
  /** Text for screen readers and the tooltip, such as "High priority". */
  label: string;
}
