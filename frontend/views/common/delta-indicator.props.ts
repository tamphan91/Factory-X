import type { Tone } from "@/models/domain/tone";

export interface DeltaIndicatorProps {
  /** Formatted change such as "+2%" or "-15%". The sign picks the arrow. */
  text: string;
  tone: Tone;
  /** "(vs. yesterday)" */
  caption?: string;
}
