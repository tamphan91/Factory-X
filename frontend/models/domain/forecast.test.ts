import { describe, expect, it } from "vitest";
import type { DemandForecast } from "@/models/types/demand-forecast";
import { sliceForecast } from "./forecast";

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
