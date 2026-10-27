import { describe, expect, it } from "vitest";
import { formatDelta, formatNumber, percentOf } from "./kpi";

describe("percentOf", () => {
  it("rounds to a whole percent", () => {
    expect(percentOf(192, 200)).toBe(96);
    expect(percentOf(78, 100)).toBe(78);
    expect(percentOf(6800, 10000)).toBe(68);
    expect(percentOf(1, 3)).toBe(33);
  });

  it("is NaN without a total", () => {
    expect(percentOf(5, 0)).toBeNaN();
  });
});

describe("formatDelta", () => {
  it("signs the number", () => {
    expect(formatDelta(2)).toBe("+2%");
    expect(formatDelta(-15)).toBe("-15%");
    expect(formatDelta(0)).toBe("0%");
  });

  it("shows a dash when missing", () => {
    expect(formatDelta(undefined)).toBe("–");
    expect(formatDelta(Number.NaN)).toBe("–");
  });
});

describe("formatNumber", () => {
  it("groups thousands", () => {
    expect(formatNumber(10000)).toBe("10,000");
    expect(formatNumber(42)).toBe("42");
  });
});
