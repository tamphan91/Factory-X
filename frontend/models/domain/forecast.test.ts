import { describe, expect, it } from "vitest";
import type { DemandForecast } from "@/models/types/demand-forecast";
import { dayLabels, sliceForecast } from "./forecast";

const forecast: DemandForecast = {
  startDate: "2026-10-27",
  actualDays: 3,
  days: [560, 520, 545, 600, 575, 590, 550, 610].map((demand) => ({ demand })),
};

describe("sliceForecast", () => {
  it("keeps the first days", () => {
    const sliced = sliceForecast(forecast, 7);
    expect(sliced.days).toHaveLength(7);
    expect(sliced.days[6].demand).toBe(550);
  });

  it("caps the actual days at the shown days", () => {
    expect(sliceForecast(forecast, 2).actualDays).toBe(2);
    expect(sliceForecast(forecast, 7).actualDays).toBe(3);
  });

  it("does not change its input", () => {
    sliceForecast(forecast, 2);
    expect(forecast.days).toHaveLength(8);
  });
});

describe("dayLabels", () => {
  it("labels consecutive days as month/day", () => {
    expect(dayLabels("2026-10-27", 3)).toEqual(["10/27", "10/28", "10/29"]);
  });

  it("rolls over the month and the year", () => {
    expect(dayLabels("2026-10-30", 4)).toEqual(["10/30", "10/31", "11/1", "11/2"]);
    expect(dayLabels("2026-12-31", 2)).toEqual(["12/31", "1/1"]);
  });

  it("is empty for no days", () => {
    expect(dayLabels("2026-10-27", 0)).toEqual([]);
  });
});
