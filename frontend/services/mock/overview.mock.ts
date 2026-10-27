import type { OverviewSnapshot } from "@/models/types/overview";

/** Today at hh:mm, as an ISO string. */
const today = (hours: number, minutes: number): string => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const createOverviewMock = (): OverviewSnapshot => ({
  supply: { current: 192, total: 200, deltaPct: 2 },
  staging: { current: 78, total: 100, deltaPct: 2 },
  warehouse: { current: 6800, total: 10000, deltaPct: 2 },
  inbound: {
    process: "inbound",
    value: 42,
    target: 60,
    deltaPct: -15,
    trend: [37, 39, 38, 43, 40, 45, 42, 47, 44, 49, 46, 50, 52, 48, 51, 54, 53, 58],
  },
  picking: {
    process: "picking",
    value: 28,
    target: 30,
    deltaPct: 12,
    trend: [18, 19, 18, 20, 21, 20, 22, 21, 23, 22, 24, 23, 25, 24, 26, 27, 26, 29],
  },
  throughput: [
    { process: "inbound", label: "Inbound", actual: 400, target: 450 },
    { process: "putaway", label: "Put-away", actual: 380, target: 420 },
    { process: "picking", label: "Picking / Kitting", actual: 400, target: 430 },
    { process: "delivery", label: "Material Delivery", actual: 350, target: 400 },
  ],
  alerts: [
    {
      id: "alert-picking-queue",
      kind: "picking-queue-high",
      severity: "critical",
      title: "Picking / Kitting Queue High",
      facts: { zone: "Zone I", queueTasks: 12, leadTimeMin: 28 },
      raisedAt: today(14, 25),
    },
    {
      id: "alert-staging-capacity",
      kind: "staging-capacity-high",
      severity: "critical",
      title: "Staging Capacity High",
      facts: { area: "Staging 3", used: 18, slots: 20, occupancyPct: 90 },
      raisedAt: today(14, 18),
    },
    {
      id: "alert-zone-storage",
      kind: "zone-storage-high",
      severity: "critical",
      title: "Zone E Storage High",
      facts: { zone: "Zone E", used: 9000, capacity: 10000, occupancyPct: 90 },
      raisedAt: today(13, 50),
    },
    {
      id: "alert-inbound-delay",
      kind: "inbound-delay",
      severity: "info",
      title: "Inbound Delay",
      facts: { dock: "Dock 2", waitingMin: 45, trucks: 2 },
      raisedAt: today(13, 40),
    },
    {
      id: "alert-vehicle-offline",
      kind: "vehicle-offline",
      severity: "warning",
      title: "AGV-03 Offline",
      facts: { vehicle: "AGV-03", reason: "Battery low", zone: "Zone F" },
      raisedAt: today(13, 32),
    },
    {
      id: "alert-material-delay",
      kind: "material-delivery-delay",
      severity: "critical",
      title: "Material Delivery Delay",
      facts: {
        overdueRequests: 8,
        totalRequests: 200,
        product: "VCT Housing",
        etaAt: "15:10",
      },
      raisedAt: today(13, 25),
    },
  ],
  updatedAt: today(14, 30),
});
