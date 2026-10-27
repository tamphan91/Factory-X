import type { Tone } from "@/models/domain/tone";
import type {
  Alert,
  AlertItem,
  AlertKind,
  AlertSeverity,
} from "@/models/types/alert";
import type { CurrentNotice } from "@/models/types/overview";
import { formatNumber } from "./kpi";

const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

const assertNever = (x: never): never => {
  throw new Error(`Unhandled alert kind: ${JSON.stringify(x)}`);
};

/** Builds the detail line from the facts. A new kind must be added here or tsc fails. */
export const formatAlertDetail = (item: AlertItem): string => {
  switch (item.kind) {
    case "picking-queue-high": {
      const { zone, queueTasks, leadTimeMin } = item.facts;
      return `${zone} | Queue: ${queueTasks} tasks | Lead time: ${leadTimeMin} min`;
    }
    case "staging-capacity-high": {
      const { area, occupancyPct, used, slots } = item.facts;
      return `${area} | Occupancy: ${occupancyPct}% | ${used} / ${slots} slots`;
    }
    case "zone-storage-high": {
      const { zone, occupancyPct, used, capacity } = item.facts;
      return `${zone} | Occupancy: ${occupancyPct}% | ${formatNumber(used)} / ${formatNumber(capacity)}`;
    }
    case "inbound-delay": {
      const { dock, waitingMin, trucks } = item.facts;
      const base = `${dock} | Waiting: ${waitingMin} min`;
      return trucks === undefined ? base : `${base} | ${trucks} trucks`;
    }
    case "vehicle-offline": {
      const { reason, zone } = item.facts;
      return zone ? `${reason} | Currently at ${zone}` : reason;
    }
    case "material-delivery-delay": {
      const { overdueRequests, totalRequests, product, etaAt } = item.facts;
      return [
        `Overdue requests: ${overdueRequests} of ${totalRequests}`,
        product,
        etaAt ? `ETA ${etaAt}` : undefined,
      ]
        .filter(Boolean)
        .join(" | ");
    }
    default:
      return assertNever(item);
  }
};

/** "14:25" from an ISO time, in the time zone of the viewer. */
export const formatAlertTime = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "–";
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** Severity first (critical, warning, info), then newest first. */
export const sortAlerts = (items: AlertItem[]): AlertItem[] =>
  [...items].sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      Date.parse(b.raisedAt) - Date.parse(a.raisedAt),
  );

export const deriveAlert = (items: AlertItem[], updatedAt: string): Alert => {
  const counts: Record<AlertSeverity, number> = { critical: 0, warning: 0, info: 0 };
  for (const item of items) {
    counts[item.severity] += 1;
  }
  return { items: sortAlerts(items), counts, total: items.length, updatedAt };
};

export const filterAlerts = (
  items: AlertItem[],
  filter: AlertSeverity | "all",
): AlertItem[] =>
  filter === "all" ? items : items.filter((item) => item.severity === filter);

export const selectAlertByKind = <K extends AlertKind>(
  items: AlertItem[],
  kind: K,
): AlertItem<K> | undefined =>
  items.find((item) => item.kind === kind) as AlertItem<K> | undefined;

export const severityTone = (severity: AlertSeverity): Tone =>
  severity === "critical" ? "critical" : severity === "warning" ? "warning" : "info";

type NoticeOptions<K extends AlertKind> = {
  item: AlertItem<K> | undefined;
  pick: (facts: AlertItem<K>["facts"]) => number;
  label: string;
};

/** The notice value and tone come from the alert; no alert means nothing to report. */
export const noticeFromAlert = <K extends AlertKind>({
  item,
  pick,
  label,
}: NoticeOptions<K>): CurrentNotice =>
  item
    ? { value: pick(item.facts), label, tone: severityTone(item.severity) }
    : { value: 0, label, tone: "good" };
