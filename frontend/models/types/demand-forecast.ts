export type ForecastDay = {
  /** Material demand in pallets for the day. */
  demand: number;
};

export type DemandForecast = {
  /** ISO date of the first day. */
  startDate: string;
  /** Days from the start that are actual; the rest is forecast. */
  actualDays: number;
  days: ForecastDay[];
};
