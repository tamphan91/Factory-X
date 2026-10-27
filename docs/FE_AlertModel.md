# Alert model – one data source for the Alerts panel and the KPI notices

Design notes for the shared **Alert** data model (`Alert` and `AlertItem`). It is the single source for the Active Alerts panel and for the `currentNotice` number on the KPI cards. Part of [FE-design.md](FE-design.md) (§2.2 Overview, §2.5, §4 Model). Used by [FE_GaugeKpiCard.md](FE_GaugeKpiCard.md).

## 1. Problem

In the Overview page, two cards show the **same fact**: 8 material requests are overdue.

| Card | What it shows | Where the "8" comes from today |
|---|---|---|
| Material Supply On-time Rate | `8` Overdue (red), under 192 / 200 | typed in `SupplyRateCard` |
| Active Alerts, "Material Delivery Delay" | the same overdue requests | typed in `AlertsPanel` (`"Required: 8 kits"`) |

The unit is **requests**: 8 of the 200 material requests are overdue (200 − 192). The alert text "8 kits" should read "8 requests".

Because the number is typed twice, a change in one place does not reach the other, and the two cards can show different severity. Today the overdue number is red but the alert has the blue Info icon.

**Goal:** both cards draw the alert from the **same data**. When the data changes, both update.

## 2. Current implementation

| Piece | Code | Notes |
|---|---|---|
| Alerts list | `AlertsPanel`, `components/overview/alerts-panel.tsx` | hard-coded array `{ level, title, detail, time }`; `detail` is a finished text string |
| Alert row | inline in the `AlertsPanel` map (no `AlertItem` component) | icon follows `level`, but every row uses the same red background and border |
| Alert filter | `Select` with All / Critical / Warning | not wired; no Info option |
| Overdue notice | `SupplyRateCard`, `components/overview/supply-rate-card.tsx` | `8` and `text-red-500` typed in |
| Count | "Active Alerts (6)" typed in | not computed from the list |

## 3. Model

Types live in `models/types/alert.ts`. Business rules live in `models/domain/alert.ts`.

```ts
// severity maps one-to-one to the tones in FE-design.md §2.5
export type AlertSeverity = "critical" | "warning" | "info";

export type AlertKind =
  | "picking-queue-high"
  | "staging-capacity-high"
  | "zone-storage-high"
  | "inbound-delay"
  | "vehicle-offline"
  | "material-delivery-delay";

// facts are numbers and names, never finished sentences
export type AlertFacts = {
  "picking-queue-high":      { zone: string; queueTasks: number; leadTimeMin: number };
  "staging-capacity-high":   { area: string; used: number; slots: number; occupancyPct: number };
  "zone-storage-high":       { zone: string; used: number; capacity: number; occupancyPct: number };
  "inbound-delay":           { dock: string; waitingMin: number; trucks?: number };
  "vehicle-offline":         { vehicle: string; reason: string; zone?: string };
  "material-delivery-delay": { overdueRequests: number; totalRequests: number; product?: string; etaAt?: string };
};

export type AlertItem<K extends AlertKind = AlertKind> = {
  id: string;
  kind: K;
  severity: AlertSeverity;
  title: string;                // "Material Delivery Delay"
  facts: AlertFacts[K];         // typed by kind
  subjectIds?: string[];        // ids of the entities involved (zones, docks, vehicles, requests)
  raisedAt: string;             // ISO time; the view shows "14:25"
};

// the model that every consumer reads
export type Alert = {
  items: AlertItem[];           // sorted by severity, then newest first
  counts: Record<AlertSeverity, number>;
  total: number;                // = items.length, "Active Alerts (6)"
  updatedAt: string;
};
```

### 3.1 The six alerts of the prototype as model data

| `kind` | Severity | Facts (example data) | Detail line built by the formatter |
|---|---|---|---|
| `picking-queue-high` | critical | zone `Zone I`, queueTasks 12, leadTimeMin 28 | Zone I \| Queue: 12 tasks \| Lead time: 28 min |
| `staging-capacity-high` | **critical** | area `Staging 3`, used 18, slots 20, occupancyPct 90 | Staging 3 \| Occupancy: 90% \| 18 / 20 slots |
| `zone-storage-high` | **critical** | zone `Zone E`, used 9,000, capacity 10,000, occupancyPct 90 | Zone E \| Occupancy: 90% \| 9,000 / 10,000 |
| `inbound-delay` | info | dock `Dock 2`, waitingMin 45, trucks 2 | Dock 2 \| Waiting: 45 min \| 2 trucks |
| `vehicle-offline` | **warning** | vehicle `AGV-03`, reason `Battery low`, zone `Zone F` | Battery low \| Currently at Zone F |
| `material-delivery-delay` | **critical** | overdueRequests 8, totalRequests 200, product `VCT Housing`, etaAt 15:10 | Overdue requests: 8 of 200 \| VCT Housing \| ETA 15:10 |

Changes against the screenshot, all from the shared rules (FE-design.md §2.5, decided thresholds):
* `staging-capacity-high` and `zone-storage-high` are **critical**: 90 % occupancy is critical under `OCCUPANCY_RULE` (good < 75 %, warning 75–89 %, critical ≥ 90 %).
* `vehicle-offline` is **warning**, the same as the resource status for an offline AGV.
* `material-delivery-delay` is **critical**, not Info. Its severity comes from the same rule as the red overdue number (`OVERDUE_RULE`, 8 overdue is critical).
* The `material-delivery-delay` detail now says "requests", not "kits".

### 3.2 Formatting is separate from data

`formatAlertDetail(item: AlertItem): string` in `models/domain/alert.ts` builds the detail line from `facts` with a `switch (item.kind)`. The `switch` ends with `default: return assertNever(item)`, where `assertNever(x: never): never` throws an `Error`. A new kind is added in three places only: the `AlertKind` union, `AlertFacts`, and the formatter. TypeScript reports the missing case at compile time, and the `default` covers bad data at runtime.

## 4. One source, many consumers

```
OverviewSnapshot (one fetch)
   materialRequests / KPI data, zone and staging data, queues, docks, vehicles
        │
        ▼
   alerts: Alert          ← from the backend, or raised by domain/alert.ts rules (mock mode)
        │
        ├──► AlertsPanel          (all items, filtered)
        ├──► SupplyRateCard       (currentNotice ← AlertItem "material-delivery-delay", built in the controller)
        └──► other consumers      (§6)
```

* **One query.** `useOverviewSnapshot` fetches once. `useOverviewController` derives every view-model from that result (TanStack Query `select`). Both cards render the same snapshot and refresh together.
* **One selector per consumer**, in `models/domain/alert.ts`:

```ts
selectAlerts(alert: Alert, filter: AlertSeverity | "all"): AlertItem[]
selectAlertByKind<K extends AlertKind>(alert: Alert, kind: K): AlertItem<K> | undefined
```

* **Raising alerts.** The backend may send alerts. When it does not (mock mode, demo), `deriveAlerts(snapshot, rules)` creates them from the snapshot using the thresholds in `domain/thresholds.ts`. In both cases the cards read an `Alert`. They never know which path produced it.
* **No second copy of the number.** `overdueRequests` exists only inside the `material-delivery-delay` item. The KPI selector that computes `delivered`, `total` and `overdue` is the same function `deriveAlerts` calls, so the card statistics (192 / 200) and the alert (8 overdue) cannot disagree.

## 5. `currentNotice` reads from an `AlertItem`

On the KPI card, `currentNotice` is the secondary number with its label ("8 Overdue"; see FE_GaugeKpiCard.md §3.1). For the supply card it comes straight from the alert item:

```ts
// models/domain/alert.ts – one options object instead of three loose parameters
type NoticeOptions<K extends AlertKind> = {
  item: AlertItem<K> | undefined;
  pick: (facts: AlertFacts[K]) => number;
  label: string;
};

export const noticeFromAlert = <K extends AlertKind>({ item, pick, label }: NoticeOptions<K>): CurrentNotice =>
  item
    ? { value: pick(item.facts), label, tone: severityTone(item.severity) }
    : { value: 0, label, tone: "good" };          // no alert means nothing overdue

const severityTone = (s: AlertSeverity): Tone =>
  s === "critical" ? "critical" : s === "warning" ? "warning" : "info";
```

```ts
// controllers/overview.vm.ts (FE_GaugeKpiCard.md §3.4) – the view never calls domain functions
const currentNotice = noticeFromAlert({
  item: selectAlertByKind(alerts, "material-delivery-delay"),
  pick: (facts) => facts.overdueRequests,
  label: "Overdue",
});
```

* The notice value is `facts.overdueRequests`, the notice colour is the alert's severity. A critical alert gives a red number; no alert gives "0 Overdue" in the good tone.
* The controller builds `currentNotice` and passes it to `SupplyRateCard` as part of its props. The card receives no `AlertItem` and no loose `overdue` number.
* The alert panel row and the card notice show the same value and the same tone, by construction.

## 6. Applying the model to the other alerts

Every alert is an `AlertItem` with typed facts. Where a card shows the same fact, it reads it from the item, not from its own number.

| Alert (`kind`) | Consumers | What each consumer reads |
|---|---|---|
| `material-delivery-delay` | Active Alerts row; Supply card notice | `facts.overdueRequests` → "8 Overdue"; severity → notice tone and row style |
| `staging-capacity-high` | Active Alerts row; Staging tile alert dot and Zone Performance row (Warehouse tab) | `facts.area`, `occupancyPct`; the tile and table status use the same `occupancyPct` and `STAGING_RULE` |
| `zone-storage-high` | Active Alerts row; Zone tile alert dot and Zone Performance row; Warehouse layout | `facts.zone`, `occupancyPct`; same tone rule as the zone |
| `picking-queue-high` | Active Alerts row; Queue by Zone chart highlight; Zone Performance row | `facts.zone`, `queueTasks`, `leadTimeMin` |
| `inbound-delay` | Active Alerts row; Receiving dock status dot (Warehouse tab) | `facts.dock`, `waitingMin` |
| `vehicle-offline` | Active Alerts row; vehicle chip "offline" state, Resource Status | `facts.vehicle`, `reason` |

KPI cards **without** an alert source stay as they are. The Staging and Warehouse cards' "Available" notices come from capacity data (slots − used, capacity − used), not from an alert. The same `noticeFromAlert` mechanism applies as soon as an alert exists for them. For example, `zone-storage-high` could later feed a notice on the Warehouse Occupancy card.

## 7. Severity, tone and presentation

| Severity | Tone (FE-design.md §2.5) | Icon | Row style |
|---|---|---|---|
| `critical` | `critical` (red) | `!` in red circle | red background tint, red left border |
| `warning` | `warning` (yellow) | warning triangle | yellow tint, yellow left border |
| `info` | `info` (blue) | `i` in blue circle | blue tint, blue left border |

* The current panel gives every row the red tint and border. The row style must follow the severity.
* `AlertItem` row (a real component, extracted from the map): props `{ severity, title, detail, time }`, all display-ready. The formatter, the clock format and the tone mapping run in the controller, not in the view.
* Severity comes from the alert (backend, or the rules in `domain/thresholds.ts`). Thresholds are configuration; example values in FE_GaugeKpiCard.md §3.2. The red overdue number and the alert row both use `OVERDUE_RULE`.
* Sorting: severity first (critical, warning, info), then newest first.
* Header count `Active Alerts (n)` is `alert.total`. With a filter, it still shows the total; the filtered list is shown below.
* Filter: All / Critical / Warning / **Info**, wired to `alertFilter` in `uiStore` (action A3, FE-design.md §3.1). Changing it does not refetch.

### 7.1 View props

```ts
type AlertItemVM = { id: string; severity: AlertSeverity; title: string; detail: string; time: string };

type AlertsPanelProps = {
  items: AlertItemVM[];
  total: number;
  filter: AlertSeverity | "all";
  onFilterChange: (f: AlertSeverity | "all") => void;
  onViewAll: () => void;           // sets the filter to "all" (A5)
};
```

## 8. Edge cases

| Case | Behaviour |
|---|---|
| No material alert | `noticeFromAlert` returns "0 Overdue" in the good tone |
| Alert for an unknown `kind` | skipped by the mapper; logged once in development |
| Alerts missing or the request fails | panel shows `ErrorState`; the KPI notices show "–" (tone `unavailable`) |
| `overdueRequests` greater than `totalRequests` | mapper rejects the item; logged |
| Alerts older than the allowed age | whole panel marked unavailable (FE-design.md §2.5, stale data) |
| Filter has no matches | `EmptyState`: "No alerts at this level" |

## 9. Change list

1. Add `models/types/alert.ts` (`AlertSeverity`, `AlertKind`, `AlertFacts`, `AlertItem`, `Alert`).
2. Add `models/domain/alert.ts`: `formatAlertDetail`, `selectAlerts`, `selectAlertByKind`, `noticeFromAlert`, `deriveAlerts`.
3. Add the alert fields to the overview repository and mapper; add the mock data from §3.1.
4. Extract `AlertItem` as a component in `views/features/overview/`; make `AlertsPanel` take `AlertsPanelProps` (in `alerts-panel.props.ts`); style rows by severity; wire the filter and add Info.
5. Call `noticeFromAlert` in the controller builder and pass `currentNotice` to `SupplyRateCard` (FE_GaugeKpiCard.md §3.4).
6. Drive both cards from `useOverviewController` using one `useOverviewSnapshot` query.
7. Update the Status column in FE-design.md §2.2 when done.

## 10. Acceptance checks

* The overdue count appears in one place in the data (`facts.overdueRequests`); both cards read it.
* Changing that value changes both the alert row and the supply card notice in one render.
* The alert row and the card notice have the same severity and tone.
* Every alert row shows its own severity colour and icon; none is red by default.
* The alert count is computed from the items.
* The detail lines are produced by `formatAlertDetail` from facts, not typed strings.
* The Staging and Warehouse "Available" notices still work without an alert.
