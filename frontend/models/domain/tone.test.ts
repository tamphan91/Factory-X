import { describe, expect, it } from "vitest";
import { deltaTone, targetTone, thresholdRule } from "./tone";

describe("thresholdRule", () => {
  const higher = thresholdRule({ direction: "higherIsBetter", goodAt: 98, warningAt: 90 });
  const lower = thresholdRule({ direction: "lowerIsBetter", goodAt: 75, warningAt: 90 });

  it("grades higherIsBetter values", () => {
    expect(higher(98)).toBe("good");
    expect(higher(96)).toBe("warning");
    expect(higher(90)).toBe("warning");
    expect(higher(89)).toBe("critical");
  });

  it("grades lowerIsBetter values", () => {
    expect(lower(74)).toBe("good");
    expect(lower(75)).toBe("warning");
    expect(lower(89)).toBe("warning");
    expect(lower(90)).toBe("critical");
  });

  it("returns unavailable for NaN", () => {
    expect(higher(Number.NaN)).toBe("unavailable");
    expect(lower(Number.NaN)).toBe("unavailable");
  });
});

describe("deltaTone", () => {
  it("is good when the change goes in the good direction", () => {
    expect(deltaTone(-15, "down")).toBe("good");
    expect(deltaTone(5, "up")).toBe("good");
  });

  it("is bad when the change goes the other way", () => {
    expect(deltaTone(12, "down")).toBe("bad");
    expect(deltaTone(-5, "up")).toBe("bad");
  });

  it("is neutral at zero and unavailable without data", () => {
    expect(deltaTone(0, "down")).toBe("neutral");
    expect(deltaTone(undefined, "down")).toBe("unavailable");
    expect(deltaTone(Number.NaN, "up")).toBe("unavailable");
  });
});

describe("targetTone", () => {
  it("checks an upper limit", () => {
    expect(targetTone(42, 60, "max")).toBe("good");
    expect(targetTone(60, 60, "max")).toBe("good");
    expect(targetTone(61, 60, "max")).toBe("bad");
  });

  it("checks a lower limit", () => {
    expect(targetTone(90, 80, "min")).toBe("good");
    expect(targetTone(70, 80, "min")).toBe("bad");
  });

  it("returns unavailable for NaN", () => {
    expect(targetTone(Number.NaN, 60, "max")).toBe("unavailable");
  });
});
