import { describe, expect, it } from "vitest";
import {
  STAGING_TURNS_PER_DAY,
  WAREHOUSE_TURNS_PER_DAY,
  dailyCapacity,
} from "./capacity";

describe("dailyCapacity", () => {
  it("turns the Overview totals into pallets per day", () => {
    expect(dailyCapacity(10000, WAREHOUSE_TURNS_PER_DAY)).toBe(950);
    expect(dailyCapacity(100, STAGING_TURNS_PER_DAY)).toBe(850);
  });

  it("is 0 without a total", () => {
    expect(dailyCapacity(0, WAREHOUSE_TURNS_PER_DAY)).toBe(0);
  });
});
