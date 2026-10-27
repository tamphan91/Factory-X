/** Smallest multiple of `step` that is at least `max`. One step for empty or zero data, so an axis never spans 0 to 0. */
export const ceilToStep = (max: number, step: number): number =>
  max > 0 ? Math.ceil(max / step) * step : step;
