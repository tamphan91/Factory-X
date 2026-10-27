export type AlertSeverity = "critical" | "warning" | "info";

export type AlertKind =
  | "picking-queue-high"
  | "staging-capacity-high"
  | "zone-storage-high"
  | "inbound-delay"
  | "vehicle-offline"
  | "material-delivery-delay";

/** Facts are numbers and names, never finished sentences. */
export type AlertFacts = {
  "picking-queue-high": { zone: string; queueTasks: number; leadTimeMin: number };
  "staging-capacity-high": { area: string; used: number; slots: number; occupancyPct: number };
  "zone-storage-high": { zone: string; used: number; capacity: number; occupancyPct: number };
  "inbound-delay": { dock: string; waitingMin: number; trucks?: number };
  "vehicle-offline": { vehicle: string; reason: string; zone?: string };
  "material-delivery-delay": {
    overdueRequests: number;
    totalRequests: number;
    product?: string;
    etaAt?: string;
  };
};

export type AlertItem<K extends AlertKind = AlertKind> = {
  [P in K]: {
    id: string;
    kind: P;
    severity: AlertSeverity;
    title: string;
    facts: AlertFacts[P];
    subjectIds?: string[];
    /** ISO time. */
    raisedAt: string;
  };
}[K];

export type Alert = {
  /** Sorted by severity, then newest first. */
  items: AlertItem[];
  counts: Record<AlertSeverity, number>;
  total: number;
  updatedAt: string;
};
