import { describe, expect, it } from "vitest";
import { ceilToStep } from "./axis";

describe("ceilToStep", () => {
  it("rounds up to the next step", () => {
    expect(ceilToStep(950, 400)).toBe(1200);
    expect(ceilToStep(1, 400)).toBe(400);
  });

  it("keeps a value that already sits on a step", () => {
    expect(ceilToStep(800, 400)).toBe(800);
  });

  it("returns one step for zero or negative data", () => {
    expect(ceilToStep(0, 400)).toBe(400);
    expect(ceilToStep(-5, 400)).toBe(400);
  });
});
