# GaugeKpiCard – Material Supply On-time Rate, Staging Occupancy, Warehouse Occupancy

Design notes for the three Overview KPI cards that show a **ring (gauge) with a percentage**. Part of [FE-design.md](FE-design.md) (§2.2 Overview, §2.5 data-driven styles). Sibling of [FE_LeadTimeKpiCard.md](FE_LeadTimeKpiCard.md) (cards with a trend line); both families share `KpiCardShell` and the delta block. The notice number of the supply card is read from an alert item: see [FE_AlertModel.md](FE_AlertModel.md).

## 1. What the cards show

| Part (common name) | Material Supply On-time Rate | Staging Occupancy | Warehouse Occupancy |
|---|---|---|---|
| Title | Material Supply On-time Rate | Staging Occupancy | Warehouse Occupancy |
| Ring + % | 96 % | 78 % | 68 % |
| **current stats** | 192 / 200 | 78 / 100 | 6,800 / 10,000 |
| **current overview** | Delivered on time | Used Slots | Pallet Locations |
| **current notice** | 8 Overdue (red) | 22 Available | 3,200 Available |
| Delta vs. yesterday | ↑ +2 % | ↑ +2 % | ↑ +2 % |
| Ring colour in the screenshot | green | yellow | green |

The three cards have identical structure. They differ in title, data, and in the **rule** that turns a number into a colour: a 68 % warehouse is healthy, 78 % staging deserves a warning, and 96 % on-time delivery may already be a warning, because for on-time rate higher is better and the bar is higher.

## 2. Current implementation

| Piece | Code | Notes |
|---|---|---|
| Three cards | `SupplyRateCard`, `StagingCard`, `WarehouseCard` in `components/overview/` | same JSX copied three times; all numbers, labels and colours hard-coded |
| Ring | `GaugeChart`, `components/dashboard/gauge-chart.tsx` | ECharts gauge; props `value`, `color`; one fixed height (110) |
| Frame | `KpiCardShell`, `components/dashboard/kpi-card-shell.tsx` | fixed height 150 px, `children` only |
| Ring colour | hex string typed in each card (`#29b35f`, `#f1b500`, `#27ae60`) | the colour is chosen by hand, not computed from the value |
| Overdue colour | `text-red-500` typed in `SupplyRateCard` | other notices have no colour |
| Delta | inline, `text-green-500` and "↑ +2%" typed in all three | staging and warehouse occupancy going **up** is shown green |

Problems: one layout copied three times; colours chosen by hand instead of derived from the data; no shared place for the thresholds; the delta colour ignores the metric (occupancy rising is normally worse).

## 3. Target design

One shared card, **`GaugeKpiCard`**, on `KpiCardShell`. The three specialised cards become thin wrappers that supply a title, their data, labels and tone rules.

```
KpiCardShell                                       (common parent card)
 └─ title                                          ← specialised
 └─ GaugeKpiCard body
      ├─ GaugeChart(percent, appearance)           ← same chart, colour from the ring tone
      ├─ currentStats      "192 / 200"             ← specialised data
      ├─ currentOverview   "Delivered on time"     ← specialised label
      ├─ currentNotice     "8 Overdue"             ← number coloured by its own tone
      └─ DeltaIndicator(text, tone)                ← tone from deltaTone, computed in the controller
```

Locations: `views/common/gauge-kpi-card.tsx` and `gauge-kpi-card.props.ts` (shared card and its props), with `supply-rate-card.tsx`, `staging-card.tsx`, `warehouse-card.tsx` (each with a `.props.ts`) in `views/features/overview/` as the specialised wrappers. The view-model builders are in `controllers/overview.vm.ts`.

### 3.1 Common names for the shared content

| Name in code | Meaning | Examples |
|---|---|---|
| `currentStats` | the main numeric pair, `current / total` | 192 / 200, 78 / 100, 6,800 / 10,000 |
| `currentOverview` | text label that describes `currentStats` | Delivered on time, Used Slots, Pallet Locations |
| `currentNotice` | secondary number plus label, coloured by tone. When the number is an alert (8 Overdue) it is read from the matching `AlertItem` (see [FE_AlertModel.md](FE_AlertModel.md) §5); capacity numbers (Available) come from capacity data | 8 Overdue, 22 Available, 3,200 Available |

The ring percentage is **calculated** from `currentStats` by `percentOf(current, total)` in the controller, never typed in: 192 / 200 = 96 %, 78 / 100 = 78 %, 6,800 / 10,000 = 68 %. The view receives `percent` as a prop and does not compute it. This removes a number that could disagree with the stats.

### 3.2 The abstract tone rule

All three cards use the same function type. Each card has its own thresholds, and the **controller** applies them (`controllers/overview.vm.ts`, §3.4).

```ts
// domain/tone.ts (FE-design.md §2.5)
export type ToneRule = (value: number) => Tone;

type ThresholdOptions = {
  direction: "higherIsBetter" | "lowerIsBetter";
  goodAt: number;      // higherIsBetter: good when v >= goodAt;  lowerIsBetter: good when v < goodAt
  warningAt: number;   // higherIsBetter: warning when v >= warningAt;  lowerIsBetter: warning when v < warningAt; else "critical"
};

export const thresholdRule = ({ direction, goodAt, warningAt }: ThresholdOptions): ToneRule =>
  (v) => {
    if (Number.isNaN(v)) {
      return "unavailable";
    }
    if (direction === "higherIsBetter") {
      return v >= goodAt ? "good" : v >= warningAt ? "warning" : "critical";
    }
    return v < goodAt ? "good" : v < warningAt ? "warning" : "critical";
  };
```

`thresholdRule` is the single abstract function. The specialised cards only provide numbers, kept in `domain/thresholds.ts` so they can later come from configuration or the backend:

```ts
// domain/thresholds.ts – decided values (replace with the plant's real limits when available)
export const SUPPLY_ONTIME_RULE = thresholdRule({ direction: "higherIsBetter", goodAt: 98, warningAt: 90 });
// one occupancy rule for zones, staging and warehouse: good < 75 %, warning 75–89 %, critical >= 90 %
export const OCCUPANCY_RULE     = thresholdRule({ direction: "lowerIsBetter",  goodAt: 75, warningAt: 90 });
export const STAGING_RULE       = OCCUPANCY_RULE;
export const WAREHOUSE_RULE     = OCCUPANCY_RULE;
// overdue requests: good = 0, warning 1–3, critical >= 4
export const OVERDUE_RULE       = thresholdRule({ direction: "lowerIsBetter",  goodAt: 1,  warningAt: 4  });
```

With these values: supply 96 % → `warning` (yellow), staging 78 % → `warning`, warehouse 68 % → `good`, 8 overdue → `critical` (red). Staging, warehouse and every zone share one occupancy rule (`OCCUPANCY_RULE`), so a card, a zone tile and an alert never disagree about the same percentage. The same `Tone` → colour mapping from FE-design.md §2.4 and §2.5 applies, so green, yellow and red come from tokens and no component contains a hex value.

The same rule type serves any other metric (zone occupancy, queue length), so zone status and these cards cannot drift apart.

### 3.3 Props: common base plus specialised cards

Views take **display-ready** props. The controller computes the percent and every tone; the view only lays them out (FE-design.md §2.5).

```ts
// views/common/gauge-kpi-card.props.ts
export interface GaugeKpiBaseProps {
  title: string;
  currentStats: { current: number; total: number };          // "192 / 200"
  currentOverview: string;                                   // "Delivered on time"
  currentNotice: CurrentNotice;                              // "8" "Overdue"
  percent: number;                                           // percentOf(currentStats), computed in the controller
  ringTone: Tone;                                            // the card's ToneRule applied to percent, in the controller
  delta?: { text: string; tone: Tone };                      // "+2%"; tone from deltaTone in the controller
}

// value + label + tone; built by noticeFromAlert() from an AlertItem, or from capacity data (tone "neutral")
export type CurrentNotice = { value: number; label: string; tone: Tone };

// views/features/overview/*-card.props.ts – a wrapper takes the base minus the words it holds itself
export type SupplyRateCardProps = Omit<GaugeKpiBaseProps, "title" | "currentOverview">;
export type StagingCardProps = Omit<GaugeKpiBaseProps, "title" | "currentOverview">;
export interface WarehouseCardProps extends Omit<GaugeKpiBaseProps, "title" | "currentOverview"> {
  subtitle?: string;                                          // e.g. "(Raw Material)"
}
```

Guidance:

* **Shared card = `GaugeKpiBaseProps`.** The three wrappers all render `GaugeKpiCard`.
* **Wrappers hold only presentation words:** title and labels. They hold no tone rule and no threshold. The pages and controllers stay free of words like "Delivered on time".
* **Rules live in the controller.** `SUPPLY_ONTIME_RULE`, `OCCUPANCY_RULE` and `OVERDUE_RULE` (`models/domain/thresholds.ts`) are applied in `controllers/overview.vm.ts`.
* **When a wrapper needs more** (an `onClick`, a subtitle), extend the base with `extends`, or use `Pick` / `Omit`. Do not re-declare fields.
* **Avoid passing the base through unchanged.** A wrapper that adds neither title nor label adds no value; use `GaugeKpiCard` directly.

### 3.4 Specialised cards and their view-model builders

```tsx
// views/features/overview/supply-rate-card.tsx
export function SupplyRateCard(props: SupplyRateCardProps) {
  return (
    <GaugeKpiCard
      title="Material Supply On-time Rate"
      currentOverview="Delivered on time"
      {...props}
    />
  );
}
// StagingCard: title "Staging Occupancy", currentOverview "Used Slots"
// WarehouseCard: title "Warehouse Occupancy", currentOverview "Pallet Locations"
```

```ts
// controllers/overview.vm.ts – the rules run here, not in the view
const buildDelta = (deltaPct: number, goodDirection: GoodDirection) => ({
  text: formatDelta(deltaPct),
  tone: deltaTone(deltaPct, goodDirection),
});

export const buildSupplyRateVM = ({ supply, alerts }: OverviewSnapshot): SupplyRateCardProps => {
  const percent = percentOf(supply.delivered, supply.total);
  return {
    currentStats: { current: supply.delivered, total: supply.total },
    percent,
    ringTone: SUPPLY_ONTIME_RULE(percent),
    currentNotice: noticeFromAlert({
      item: selectAlertByKind(alerts, "material-delivery-delay"),   // value and tone from the AlertItem
      pick: (facts) => facts.overdueRequests,
      label: "Overdue",
    }),
    delta: buildDelta(supply.deltaPct, "up"),
  };
};

export const buildStagingVM = ({ staging }: OverviewSnapshot): StagingCardProps => {
  const percent = percentOf(staging.used, staging.slots);
  return {
    currentStats: { current: staging.used, total: staging.slots },
    percent,
    ringTone: STAGING_RULE(percent),
    currentNotice: { value: staging.slots - staging.used, label: "Available", tone: "neutral" },   // no rule yet
    delta: buildDelta(staging.deltaPct, "down"),
  };
};
// buildWarehouseVM is the same with WAREHOUSE_RULE, used / capacity and "Available" = capacity - used.
```

Each wrapper decides the title and labels. The controller decides the data, the percent and the tones. The shared card decides the layout and how tones look.

### 3.5 Inside `GaugeKpiCard`

```tsx
// no domain imports except the Tone type: it only maps what it receives
<GaugeChart percent={percent} appearance={{ tone: ringTone }} />
<span className={noticeVariants({ tone: currentNotice.tone })}>{currentNotice.value}</span>
{delta && <DeltaIndicator text={delta.text} tone={delta.tone} />}
```

* `GaugeChart` receives `percent` and `appearance`, and looks up the colour with `toneColor(tone)` (`lib/chart-colors.ts`). It no longer receives a hex string.
* The notice number is coloured by `currentNotice.tone`; its label stays in normal text.
* The delta block is the shared `DeltaIndicator`.

## 4. Colour rules (summary)

| Element | Colour source |
|---|---|
| Ring and its percentage | `ringTone` from the card's rule, applied in the controller: green good, yellow warning, red critical |
| Notice number ("8", "22", "3,200") | `currentNotice.tone`, set in the controller from the alert severity or a rule; otherwise `neutral` ink |
| Delta ("+2%") | `delta.tone` from `deltaTone(deltaPct, goodDirection)`, set in the controller |
| Stats, overview and title | normal ink, never tone-coloured |

## 5. Behaviour changes (decided)

* **Supply rate 96 %** is green today. With the decided thresholds (good ≥ 98 %, warning ≥ 90 %) it becomes yellow. Replace the limits with the plant's real targets when available.
* **Occupancy delta "↑ +2%"** is green today. With `goodDirection: "down"`, a rising occupancy is red (decided). Nothing else moves if this changes later; edit `goodDirection` in the builder.
* **"Available" notices** have no rule yet and stay black, as in the screenshot (`tone: "neutral"`). Add a rule in the builder (for example higher is better) when thresholds are known.

## 6. Reused components

| Component | Role | Change needed |
|---|---|---|
| `KpiCardShell` | common parent card | none now; later an optional `title` prop |
| `GaugeChart` (`DonutGauge`) | the ring | change props from `value`, `color` to `percent`, `appearance`; optional `thick` |
| `DeltaIndicator` (planned) | delta block, shared with the lead-time cards | create; takes `text` and `tone` |
| `thresholdRule`, `deltaTone`, `percentOf` | domain functions, called by the controller | create in `models/domain/tone.ts`, `models/domain/kpi.ts` |

## 7. Data flow (target)

```
overview repository (supply, staging, warehouse numbers, delta)
   → mapper → domain → useOverviewController
   → { supply, staging, warehouse } view-models (plain numbers)
   → <SupplyRateCard {...supply} /> <StagingCard {...staging} /> <WarehouseCard {...warehouse} />
```

The view-models already carry `percent` and the tones (§3.4). The overdue notice reads the `AlertItem` of kind `material-delivery-delay` inside the builder: `noticeFromAlert` takes `overdueRequests` and the severity from it. The Alerts panel reads the same item, so both change together ([FE_AlertModel.md](FE_AlertModel.md) §4). Titles and labels belong to the specialised cards; thresholds belong to `models/domain/thresholds.ts`. The Time Range filter changes the query, so every card updates together.

## 8. Edge cases

| Case | Behaviour |
|---|---|
| `total` is 0 or missing | `percentOf` returns `NaN`; tone `unavailable`; ring empty and grey, stats show "–" |
| `current` greater than `total` | percent capped at 100 for the ring; text shows the real numbers |
| `delta` missing | delta block hidden |
| No `toneRule` on the notice | neutral ink |
| Large numbers | formatted with thousands separators (6,800 / 10,000) |

## 9. Change list

1. Add `thresholdRule`, `ToneRule` to `models/domain/tone.ts`; add `percentOf` to `models/domain/kpi.ts`; add the four rules to `models/domain/thresholds.ts`.
2. Change `GaugeChart` props to `percent` and `appearance`; resolve the colour with `toneColor`.
3. Add `views/common/gauge-kpi-card.tsx` and `gauge-kpi-card.props.ts` with `GaugeKpiBaseProps`.
4. Rewrite `SupplyRateCard`, `StagingCard`, `WarehouseCard` as thin wrappers (§3.4) in `views/features/overview/`.
5. Add the builders to `controllers/overview.vm.ts` and pass the result from `overview-page.tsx` (hard-coded data until the service layer exists).
6. Update the Status column in FE-design.md §2.2 when done.

## 10. Acceptance checks

* One layout and one chart for all three cards; no copied JSX remains.
* The ring colour changes when the number crosses a threshold, with no hex value in any card.
* Each card uses its own thresholds through the same `thresholdRule` function.
* `currentStats`, `currentOverview` and `currentNotice` are the same fields on all three cards.
* The overdue number is red; "Available" numbers stay neutral until rules exist.
* The overdue number and its colour come from the `material-delivery-delay` `AlertItem`, the same item the Alerts panel row uses.
* The delta colour comes from `deltaTone`, and `goodDirection` is set per card in the controller builder.
* The card imports no rule: `percent`, `ringTone`, `currentNotice.tone` and `delta.tone` all arrive as props.
