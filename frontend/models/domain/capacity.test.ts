import { describe, expect, it } from "vitest";
import { createOverviewMock } from "@/services/mock/overview.mock";
import {
  STAGING_TURNS_PER_DAY,
  WAREHOUSE_TURNS_PER_DAY,
  capacityLines,
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

describe("capacityLines", () => {
  it("draws one flat line per area for every day", () => {
    const lines = capacityLines(createOverviewMock(), 7);
    expect(lines.warehouse).toEqual(Array(7).fill(950));
    expect(lines.staging).toEqual(Array(7).fill(850));
  });

  it("follows the Overview totals", () => {
    const overview = createOverviewMock();
    overview.warehouse.total = 20000;
    overview.staging.total = 50;
    const lines = capacityLines(overview, 2);
    expect(lines.warehouse).toEqual([1900, 1900]);
    expect(lines.staging).toEqual([425, 425]);
  });
});
