import { ceilToStep } from "@/models/domain/axis";
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

/** "10/27" for the `count` days from an ISO date (yyyy-mm-dd). */
export const dayLabels = (startIso: string, count: number): string[] => {
  const [year, month, day] = startIso.split("-").map(Number);
  return Array.from({ length: count }, (_, offset) => {
    const date = new Date(year, month - 1, day + offset);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
};

/** Y-axis ticks of the forecast chart are 400 pallets apart, as in the prototype. */
export const FORECAST_AXIS_STEP = 400;

/** Y-axis maximum that fits the demand bars and the capacity lines. */
export const forecastAxisMax = (
  demand: number[],
  capacities: number[],
): number => ceilToStep(Math.max(0, ...demand, ...capacities), FORECAST_AXIS_STEP);
