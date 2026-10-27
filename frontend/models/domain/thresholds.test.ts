import { describe, expect, it } from "vitest";
import {
  OCCUPANCY_RULE,
  OVERDUE_RULE,
  STAGING_RULE,
  SUPPLY_ONTIME_RULE,
  WAREHOUSE_RULE,
} from "./thresholds";

describe("thresholds", () => {
  it("grades the supply on-time rate", () => {
    expect(SUPPLY_ONTIME_RULE(96)).toBe("warning");
    expect(SUPPLY_ONTIME_RULE(99)).toBe("good");
    expect(SUPPLY_ONTIME_RULE(80)).toBe("critical");
  });

  it("grades occupancy the same for staging and warehouse", () => {
    expect(STAGING_RULE(78)).toBe("warning");
    expect(WAREHOUSE_RULE(68)).toBe("good");
    expect(OCCUPANCY_RULE(90)).toBe("critical");
    expect(STAGING_RULE).toBe(OCCUPANCY_RULE);
    expect(WAREHOUSE_RULE).toBe(OCCUPANCY_RULE);
  });

  it("grades overdue requests", () => {
    expect(OVERDUE_RULE(0)).toBe("good");
    expect(OVERDUE_RULE(2)).toBe("warning");
    expect(OVERDUE_RULE(8)).toBe("critical");
  });
});
