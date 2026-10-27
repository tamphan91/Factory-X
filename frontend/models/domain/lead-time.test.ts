import { describe, expect, it } from "vitest";
import type { LeadTimeSeries } from "@/models/types/lead-time";
import { createOverviewMock } from "@/services/mock/overview.mock";
import {
  LEAD_TIME_SLOT_COUNT,
  forecastStartIndex,
  resolveLeadTimeSeries,
  timeLabels,
} from "./lead-time";

describe("timeLabels", () => {
  it("has one label per half hour from 08:00 to 22:00", () => {
    const labels = timeLabels();
    expect(labels).toHaveLength(LEAD_TIME_SLOT_COUNT);
    expect(labels[0]).toBe("08:00");
    expect(labels[1]).toBe("08:30");
    expect(labels[4]).toBe("10:00");
    expect(labels[LEAD_TIME_SLOT_COUNT - 1]).toBe("22:00");
  });
});

const receiving: LeadTimeSeries = {
  process: "inbound",
  label: "Receiving",
  forecast: [60, 61],
};
const putaway: LeadTimeSeries = {
  process: "putaway",
  label: "Put-away",
  actual: [20, 22],
  forecast: [30],
};

describe("resolveLeadTimeSeries", () => {
  it("takes Receiving actual points from the Overview trend for today", () => {
    const overview = createOverviewMock();
    const [line] = resolveLeadTimeSeries("today", [receiving], overview);
    expect(line.actualCount).toBe(overview.inbound.trend.length);
    expect(line.actual.slice(0, line.actualCount)).toEqual(overview.inbound.trend);
  });

  it("follows a change in the Overview trend", () => {
    const overview = createOverviewMock();
    overview.inbound.trend = [10, 11, 12];
    const [line] = resolveLeadTimeSeries("today", [receiving], overview);
    expect(line.actual.slice(0, 4)).toEqual([10, 11, 12, null]);
  });

  it("starts the forecast at the last actual point", () => {
    const overview = createOverviewMock();
    overview.inbound.trend = [10, 11, 12];
    const [line] = resolveLeadTimeSeries("today", [receiving], overview);
    expect(line.forecast.slice(0, 5)).toEqual([null, null, 12, 60, 61]);
  });

  it("keeps the own actual points of a process Overview does not own", () => {
    const [line] = resolveLeadTimeSeries("today", [putaway], createOverviewMock());
    expect(line.actual.slice(0, 3)).toEqual([20, 22, null]);
    expect(line.forecast.slice(0, 3)).toEqual([null, 22, 30]);
  });

  it("ignores the Overview for other ranges", () => {
    const [line] = resolveLeadTimeSeries("week", [receiving], createOverviewMock());
    expect(line.actualCount).toBe(0);
  });

  it("starts the forecast at the first slot without actual points", () => {
    const [line] = resolveLeadTimeSeries("week", [receiving], createOverviewMock());
    expect(line.forecast.slice(0, 3)).toEqual([60, 61, null]);
  });

  it("fills every slot of the day and cuts extra points", () => {
    const long: LeadTimeSeries = {
      ...putaway,
      actual: Array(40).fill(20),
      forecast: [],
    };
    const [line] = resolveLeadTimeSeries("today", [long], createOverviewMock());
    expect(line.actual).toHaveLength(LEAD_TIME_SLOT_COUNT);
    expect(line.actualCount).toBe(LEAD_TIME_SLOT_COUNT);
  });
});

describe("forecastStartIndex", () => {
  it("is the last actual slot of the longest line", () => {
    const overview = createOverviewMock();
    const lines = resolveLeadTimeSeries("today", [receiving, putaway], overview);
    expect(forecastStartIndex(lines)).toBe(overview.inbound.trend.length - 1);
  });

  it("is 0 without actual points", () => {
    const lines = resolveLeadTimeSeries("week", [receiving], createOverviewMock());
    expect(forecastStartIndex(lines)).toBe(0);
    expect(forecastStartIndex([])).toBe(0);
  });
});
