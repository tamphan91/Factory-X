import { describe, expect, it } from "vitest";
import { LEAD_TIME_SLOT_COUNT, timeLabels } from "./lead-time";

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
