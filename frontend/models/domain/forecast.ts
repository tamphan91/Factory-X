import type { DemandForecast } from "@/models/types/demand-forecast";

/** The first `days` days; actual days never exceed the shown days. */
export const sliceForecast = (
  forecast: DemandForecast,
  days: number,
): DemandForecast => ({
  ...forecast,
  actualDays: Math.min(forecast.actualDays, days),
  days: forecast.days.slice(0, days),
});
