import { thresholdRule } from "./tone";

// Decided values; replace with the plant's real limits when available.
export const SUPPLY_ONTIME_RULE = thresholdRule({
  direction: "higherIsBetter",
  goodAt: 98,
  warningAt: 90,
});

// One occupancy rule for zones, staging and warehouse: good < 75 %, warning 75-89 %, critical >= 90 %.
export const OCCUPANCY_RULE = thresholdRule({
  direction: "lowerIsBetter",
  goodAt: 75,
  warningAt: 90,
});
export const STAGING_RULE = OCCUPANCY_RULE;
export const WAREHOUSE_RULE = OCCUPANCY_RULE;

// Overdue requests: good = 0, warning 1-3, critical >= 4.
export const OVERDUE_RULE = thresholdRule({
  direction: "lowerIsBetter",
  goodAt: 1,
  warningAt: 4,
});
