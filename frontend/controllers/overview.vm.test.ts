import { describe, expect, it } from "vitest";
import { createOverviewMock } from "@/services/mock/overview.mock";
import {
  buildAlertsVM,
  buildLeadTimeVM,
  buildStagingVM,
  buildSupplyRateVM,
  buildThroughputAxisMax,
  buildThroughputItemsVM,
  buildWarehouseVM,
} from "./overview.vm";

const snapshot = createOverviewMock();

describe("gauge builders", () => {
  it("computes the supply percent, tone and overdue notice from the data", () => {
    const vm = buildSupplyRateVM(snapshot);
    expect(vm.percent).toBe(96);
    expect(vm.ringTone).toBe("warning");
    expect(vm.currentNotice).toEqual({ value: 8, label: "Overdue", tone: "critical" });
    expect(vm.delta).toEqual({ text: "+2%", tone: "good" });
  });

  it("shows no overdue when the alert is missing", () => {
    const vm = buildSupplyRateVM({ ...snapshot, alerts: [] });
    expect(vm.currentNotice).toEqual({ value: 0, label: "Overdue", tone: "good" });
  });

  it("treats rising occupancy as bad", () => {
    expect(buildStagingVM(snapshot).delta?.tone).toBe("bad");
    expect(buildWarehouseVM(snapshot).delta?.tone).toBe("bad");
  });

  it("computes occupancy tones and available counts", () => {
    const staging = buildStagingVM(snapshot);
    expect(staging.ringTone).toBe("warning");
    expect(staging.currentNotice.value).toBe(22);
    const warehouse = buildWarehouseVM(snapshot);
    expect(warehouse.ringTone).toBe("good");
    expect(warehouse.currentNotice.value).toBe(3200);
  });
});

describe("buildLeadTimeVM", () => {
  it("sets value and delta tones", () => {
    const inbound = buildLeadTimeVM("Inbound Lead Time", snapshot.inbound);
    expect(inbound.valueTone).toBe("good");
    expect(inbound.delta).toEqual({ text: "-15%", tone: "good" });
    const picking = buildLeadTimeVM("Picking / Kitting Lead Time", snapshot.picking);
    expect(picking.valueTone).toBe("good");
    expect(picking.delta).toEqual({ text: "+12%", tone: "bad" });
  });
});

describe("throughput builders", () => {
  it("computes bar widths from the data", () => {
    const items = buildThroughputItemsVM(snapshot.throughput);
    expect(items).toHaveLength(4);
    expect(items[0].barPercent).toBeGreaterThan(items[3].barPercent);
    expect(items[0].barPercent).toBeLessThanOrEqual(100);
  });

  it("raises the axis maximum when targets are shown", () => {
    const actual = buildThroughputAxisMax(snapshot.throughput, "actual");
    const withTarget = buildThroughputAxisMax(snapshot.throughput, "target");
    expect(withTarget).toBeGreaterThan(actual);
  });
});

describe("buildAlertsVM", () => {
  it("keeps the total whatever the filter", () => {
    const all = buildAlertsVM(snapshot.alerts, "all");
    const warning = buildAlertsVM(snapshot.alerts, "warning");
    expect(all.total).toBe(6);
    expect(warning.total).toBe(6);
    expect(warning.items).toHaveLength(1);
    expect(warning.items[0].detail).toBe("Battery low | Currently at Zone F");
  });
});
