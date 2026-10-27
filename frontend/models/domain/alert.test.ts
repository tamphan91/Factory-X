import { describe, expect, it } from "vitest";
import type { AlertItem } from "@/models/types/alert";
import {
  deriveAlert,
  filterAlerts,
  formatAlertDetail,
  formatAlertTime,
  noticeFromAlert,
  selectAlertByKind,
  sortAlerts,
} from "./alert";

const at = (hh: number, mm: number) => new Date(2026, 9, 27, hh, mm).toISOString();

const picking: AlertItem = {
  id: "a1",
  kind: "picking-queue-high",
  severity: "critical",
  title: "Picking / Kitting Queue High",
  facts: { zone: "Zone I", queueTasks: 12, leadTimeMin: 28 },
  raisedAt: at(14, 25),
};
const staging: AlertItem = {
  id: "a2",
  kind: "staging-capacity-high",
  severity: "critical",
  title: "Staging Capacity High",
  facts: { area: "Staging 3", used: 18, slots: 20, occupancyPct: 90 },
  raisedAt: at(14, 18),
};
const zone: AlertItem = {
  id: "a3",
  kind: "zone-storage-high",
  severity: "critical",
  title: "Zone E Storage High",
  facts: { zone: "Zone E", used: 9000, capacity: 10000, occupancyPct: 90 },
  raisedAt: at(13, 50),
};
const inbound: AlertItem = {
  id: "a4",
  kind: "inbound-delay",
  severity: "info",
  title: "Inbound Delay",
  facts: { dock: "Dock 2", waitingMin: 45, trucks: 2 },
  raisedAt: at(13, 40),
};
const agv: AlertItem = {
  id: "a5",
  kind: "vehicle-offline",
  severity: "warning",
  title: "AGV-03 Offline",
  facts: { vehicle: "AGV-03", reason: "Battery low", zone: "Zone F" },
  raisedAt: at(13, 32),
};
const material: AlertItem = {
  id: "a6",
  kind: "material-delivery-delay",
  severity: "critical",
  title: "Material Delivery Delay",
  facts: { overdueRequests: 8, totalRequests: 200, product: "VCT Housing", etaAt: "15:10" },
  raisedAt: at(13, 25),
};

describe("formatAlertDetail", () => {
  it("builds each detail line from the facts", () => {
    expect(formatAlertDetail(picking)).toBe("Zone I | Queue: 12 tasks | Lead time: 28 min");
    expect(formatAlertDetail(staging)).toBe("Staging 3 | Occupancy: 90% | 18 / 20 slots");
    expect(formatAlertDetail(zone)).toBe("Zone E | Occupancy: 90% | 9,000 / 10,000");
    expect(formatAlertDetail(inbound)).toBe("Dock 2 | Waiting: 45 min | 2 trucks");
    expect(formatAlertDetail(agv)).toBe("Battery low | Currently at Zone F");
    expect(formatAlertDetail(material)).toBe(
      "Overdue requests: 8 of 200 | VCT Housing | ETA 15:10",
    );
  });

  it("leaves out optional facts", () => {
    const bare: AlertItem = { ...inbound, facts: { dock: "Dock 1", waitingMin: 5 } } as AlertItem;
    expect(formatAlertDetail(bare)).toBe("Dock 1 | Waiting: 5 min");
  });

  it("throws on an unknown kind", () => {
    expect(() => formatAlertDetail({ kind: "nope" } as unknown as AlertItem)).toThrow();
  });
});

describe("formatAlertTime", () => {
  it("shows hours and minutes", () => {
    expect(formatAlertTime(at(14, 5))).toBe("14:05");
  });

  it("shows a dash for a bad date", () => {
    expect(formatAlertTime("nope")).toBe("–");
  });
});

describe("sortAlerts and deriveAlert", () => {
  const all = [inbound, agv, material, zone, staging, picking];

  it("sorts by severity then newest first", () => {
    expect(sortAlerts(all).map((a) => a.id)).toEqual(["a1", "a2", "a3", "a6", "a5", "a4"]);
  });

  it("does not mutate the input", () => {
    const copy = [...all];
    sortAlerts(all);
    expect(all).toEqual(copy);
  });

  it("counts from the items", () => {
    const alert = deriveAlert(all, "now");
    expect(alert.total).toBe(6);
    expect(alert.counts).toEqual({ critical: 4, warning: 1, info: 1 });
  });
});

describe("filterAlerts", () => {
  const all = [picking, agv, inbound];

  it("returns everything for all", () => {
    expect(filterAlerts(all, "all")).toHaveLength(3);
  });

  it("filters by severity", () => {
    expect(filterAlerts(all, "warning")).toEqual([agv]);
    expect(filterAlerts(all, "info")).toEqual([inbound]);
  });
});

describe("selectAlertByKind and noticeFromAlert", () => {
  it("finds an alert by kind", () => {
    expect(selectAlertByKind([picking, material], "material-delivery-delay")).toBe(material);
    expect(selectAlertByKind([picking], "material-delivery-delay")).toBeUndefined();
  });

  it("reads the notice from the alert", () => {
    const notice = noticeFromAlert({
      item: selectAlertByKind([material], "material-delivery-delay"),
      pick: (facts) => facts.overdueRequests,
      label: "Overdue",
    });
    expect(notice).toEqual({ value: 8, label: "Overdue", tone: "critical" });
  });

  it("reports zero in the good tone without an alert", () => {
    const notice = noticeFromAlert({
      item: selectAlertByKind([picking], "material-delivery-delay"),
      pick: (facts) => facts.overdueRequests,
      label: "Overdue",
    });
    expect(notice).toEqual({ value: 0, label: "Overdue", tone: "good" });
  });
});
