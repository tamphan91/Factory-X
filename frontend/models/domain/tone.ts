export type Tone =
  | "good"
  | "info"
  | "warning"
  | "critical"
  | "bad"
  | "late"
  | "unavailable"
  | "neutral";

export type ToneRule = (value: number) => Tone;

type ThresholdOptions = {
  direction: "higherIsBetter" | "lowerIsBetter";
  /** higherIsBetter: good when v >= goodAt. lowerIsBetter: good when v < goodAt. */
  goodAt: number;
  /** higherIsBetter: warning when v >= warningAt. lowerIsBetter: warning when v < warningAt. Otherwise critical. */
  warningAt: number;
};

export const thresholdRule =
  ({ direction, goodAt, warningAt }: ThresholdOptions): ToneRule =>
  (v) => {
    if (Number.isNaN(v)) {
      return "unavailable";
    }
    if (direction === "higherIsBetter") {
      return v >= goodAt ? "good" : v >= warningAt ? "warning" : "critical";
    }
    return v < goodAt ? "good" : v < warningAt ? "warning" : "critical";
  };

/** Tone of a change versus the previous period. `goodDirection` says which way is an improvement. */
export const deltaTone = (
  deltaPct: number | undefined,
  goodDirection: "up" | "down",
): Tone => {
  if (deltaPct === undefined || Number.isNaN(deltaPct)) {
    return "unavailable";
  }
  if (deltaPct === 0) {
    return "neutral";
  }
  const isUp = deltaPct > 0;
  return isUp === (goodDirection === "up") ? "good" : "bad";
};

/** Tone of a value against its target. "max": the target is an upper limit. "min": a lower limit. */
export const targetTone = (
  value: number,
  target: number,
  limit: "max" | "min",
): Tone => {
  if (Number.isNaN(value) || Number.isNaN(target)) {
    return "unavailable";
  }
  const met = limit === "max" ? value <= target : value >= target;
  return met ? "good" : "bad";
};
