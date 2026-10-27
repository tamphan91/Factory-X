// Assumed turnover that turns a stock (locations, slots) into pallets per day.
// Chosen to keep the forecast chart on a 0-1,200 axis; replace with the plant's real figures.
export const WAREHOUSE_TURNS_PER_DAY = 0.095;
export const STAGING_TURNS_PER_DAY = 8.5;

/** Pallets per day that a stock of `total` can handle. */
export const dailyCapacity = (total: number, turnsPerDay: number): number =>
  Math.round(total * turnsPerDay);
