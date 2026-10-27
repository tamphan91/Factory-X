import { describe, expect, it } from "vitest";
import type { ThroughputItem } from "@/models/types/throughput";
import { AXIS_HEADROOM, BAR_HEADROOM, axisMax, barPercent } from "./throughput";

const items: ThroughputItem[] = [
  { process: "inbound", label: "Inbound", actual: 400, target: 450 },
  { process: "putaway", label: "Put-away", actual: 380 },
];

describe("barPercent", () => {
  it("scales against the largest actual with headroom", () => {
    expect(barPercent(400, items)).toBeCloseTo(100 / BAR_HEADROOM);
    expect(barPercent(200, items)).toBeCloseTo((200 / (400 * BAR_HEADROOM)) * 100);
  });

  it("is 0 for empty or all-zero input", () => {
    expect(barPercent(0, [])).toBe(0);
    expect(barPercent(5, [{ ...items[0], actual: 0 }])).toBe(0);
  });
});

describe("axisMax", () => {
  it("uses actual values only without target", () => {
    expect(axisMax(items, false)).toBeCloseTo(400 * AXIS_HEADROOM);
  });

  it("includes targets when drawn", () => {
    expect(axisMax(items, true)).toBeCloseTo(450 * AXIS_HEADROOM);
  });

  it("falls back for empty or all-zero input", () => {
    expect(axisMax([], false)).toBe(10);
    expect(axisMax([{ ...items[0], actual: 0, target: 0 }], true)).toBe(10);
  });
});
