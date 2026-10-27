import {
  filterAlerts,
  formatAlertDetail,
  formatAlertTime,
  noticeFromAlert,
  selectAlertByKind,
} from "@/models/domain/alert";
import { formatDelta, percentOf } from "@/models/domain/kpi";
import {
  STAGING_RULE,
  SUPPLY_ONTIME_RULE,
  WAREHOUSE_RULE,
} from "@/models/domain/thresholds";
import { axisMax, barPercent } from "@/models/domain/throughput";
import { deltaTone, targetTone, type ToneRule } from "@/models/domain/tone";
import type { AlertItem, AlertSeverity } from "@/models/types/alert";
import type {
  CurrentNotice,
  GaugeSnapshot,
  LeadTimeSnapshot,
  OverviewSnapshot,
} from "@/models/types/overview";
import type { ThroughputItem } from "@/models/types/throughput";
import type { GaugeKpiBaseProps } from "@/views/common/gauge-kpi-card.props";
import type { LeadTimeKpiCardProps } from "@/views/common/lead-time-kpi-card.props";
import type { AlertsPanelProps } from "@/views/features/overview/alerts-panel.props";
import type { StagingCardProps } from "@/views/features/overview/staging-card.props";
import type { SupplyRateCardProps } from "@/views/features/overview/supply-rate-card.props";
import type {
  ThroughputItemVM,
  ThroughputMode,
} from "@/views/features/overview/throughput-card.props";
import type { WarehouseCardProps } from "@/views/features/overview/warehouse-card.props";

type GaugeVMOptions = {
  snapshot: GaugeSnapshot;
  ringRule: ToneRule;
  /** Whether a rising value is an improvement. Occupancy rising is not. */
  goodDirection: "up" | "down";
  currentNotice: CurrentNotice;
};

type GaugeVM = Omit<GaugeKpiBaseProps, "title" | "currentOverview">;

const buildGaugeVM = ({
  snapshot,
  ringRule,
  goodDirection,
  currentNotice,
}: GaugeVMOptions): GaugeVM => {
  const percent = percentOf(snapshot.current, snapshot.total);
  return {
    currentStats: { current: snapshot.current, total: snapshot.total },
    currentNotice,
    percent,
    ringTone: ringRule(percent),
    delta: {
      text: formatDelta(snapshot.deltaPct),
      tone: deltaTone(snapshot.deltaPct, goodDirection),
    },
  };
};

/** "Available" notice for capacity cards. It reads no alert, so the tone is neutral. */
const availableNotice = ({ current, total }: GaugeSnapshot): CurrentNotice => ({
  value: Math.max(0, total - current),
  label: "Available",
  tone: "neutral",
});

export const buildSupplyRateVM = (
  snapshot: OverviewSnapshot,
): SupplyRateCardProps => {
  const overdue = noticeFromAlert({
    item: selectAlertByKind(snapshot.alerts, "material-delivery-delay"),
    pick: (facts) => facts.overdueRequests,
    label: "Overdue",
  });
  return buildGaugeVM({
    snapshot: snapshot.supply,
    ringRule: SUPPLY_ONTIME_RULE,
    goodDirection: "up",
    currentNotice: overdue,
  });
};

export const buildStagingVM = (snapshot: OverviewSnapshot): StagingCardProps =>
  buildGaugeVM({
    snapshot: snapshot.staging,
    ringRule: STAGING_RULE,
    goodDirection: "down",
    currentNotice: availableNotice(snapshot.staging),
  });

export const buildWarehouseVM = (
  snapshot: OverviewSnapshot,
): WarehouseCardProps =>
  buildGaugeVM({
    snapshot: snapshot.warehouse,
    ringRule: WAREHOUSE_RULE,
    goodDirection: "down",
    currentNotice: availableNotice(snapshot.warehouse),
  });

export const buildLeadTimeVM = (
  title: string,
  snapshot: LeadTimeSnapshot,
): LeadTimeKpiCardProps => ({
  title,
  value: snapshot.value,
  valueTone: targetTone(snapshot.value, snapshot.target, "max"),
  target: snapshot.target,
  delta: {
    text: formatDelta(snapshot.deltaPct),
    tone: deltaTone(snapshot.deltaPct, "down"),
  },
  trend: snapshot.trend,
  process: snapshot.process,
});

export const buildThroughputItemsVM = (
  items: ThroughputItem[],
): ThroughputItemVM[] =>
  items.map((item) => ({ ...item, barPercent: barPercent(item.actual, items) }));

export const buildThroughputAxisMax = (
  items: ThroughputItem[],
  mode: ThroughputMode,
): number => axisMax(items, mode === "target");

type AlertsVM = Pick<AlertsPanelProps, "items" | "total">;

export const buildAlertsVM = (
  alerts: AlertItem[],
  filter: AlertSeverity | "all",
): AlertsVM => ({
  total: alerts.length,
  items: filterAlerts(alerts, filter).map((alert) => ({
    id: alert.id,
    severity: alert.severity,
    title: alert.title,
    detail: formatAlertDetail(alert),
    time: formatAlertTime(alert.raisedAt),
  })),
});
