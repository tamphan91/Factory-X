# ThroughputCard – Throughput (horizontal) and Throughput by Process (vertical)

Design notes for the two Overview cards that show the **same throughput data** in two forms. Part of [FE-design.md](FE-design.md) (§2.2 Overview, §2.3.1). Same approach as [FE_LeadTimeKpiCard.md](FE_LeadTimeKpiCard.md): one shared parent component, two presentations.

## 1. What the cards show

| | Throughput (horizontal) | Throughput by Process (vertical) |
|---|---|---|
| Placement | KPI row, 1 of 6 small cards | main area, large card |
| Header | "Throughput" + "(Today)" on the left, "(pallets)" on the right | "Throughput by Process" on the left, dropdown on the right |
| Body | one horizontal bar per process: label, coloured bar on a grey track, value at the right | one column per process, value above the column, y-axis "Pallets" (0–400) |
| Data | **actual only**, for the selected period (Today) | **actual and target** |
| Dropdown | none | Actual / Actual vs Target |
| Values | Inbound 400, Put-away 380, Picking / Kitting 400, Material Delivery 350 | same four actual numbers |

The horizontal card is a summary of what happened in the period, so it needs no target and no dropdown. The vertical card is the analysis view: it can compare actual with target, so it has the dropdown.

## 2. Current implementation

| Piece | Code | Notes |
|---|---|---|
| Horizontal card | `ThroughputSummaryCard`, `components/overview/throughput-summary-card.tsx` | on `KpiCardShell` (150 px); data and `percent` (88, 83, 88, 76) hard-coded; bars drawn inline with `<div>` |
| Vertical card | `ThroughputChart`, `components/overview/throughput-chart.tsx` | on `Card` (480 px); data hard-coded inside the ECharts option; `barWidth: 140`; the `Select` has no state; options "Actual" / "Target" |
| Colours | each file has its own hex list | blue differs: `#3b82f6` vs `#3478f6` |
| Chart base | `EChart`, `components/charts/echart.tsx` | reusable, no change needed |

Problems: two copies of the data, two copies of the colours, two different parent cards, hand-typed bar percentages, and a dropdown that does nothing and has no target series behind it.

## 3. Target design

One component, **`ThroughputCard`**, on the common parent card (`PanelCard`, FE-design.md §2.1). It takes an `orientation` and returns the matching card. `ThroughputSummaryCard` and `ThroughputChart` are deleted.

```
ThroughputCard(props)                       ← one entry function
 ├─ orientation="horizontal" → ThroughputHorizontalCard
 │     PanelCard · title + period + unit · ProgressBar per process (actual only)
 └─ orientation="vertical"   → ThroughputVerticalCard
       PanelCard · title + mode FilterSelect · EChart columns (actual, optional target)
```

Location: `views/features/overview/throughput-card.tsx` and `throughput-card.props.ts`, with the two cards as sibling files private to it. `ThroughputItem` is a domain entity in `models/types/throughput.ts`; the controller builds the view-model items and `axisMax` (§5).

### 3.1 Props

```ts
// domain/process.ts
export type ProcessKey = "inbound" | "putaway" | "picking" | "delivery";

// models/types/throughput.ts
export type ThroughputItem = {
  process: ProcessKey;     // decides the colour
  label: string;           // "Picking / Kitting"
  actual: number;          // pallets
  target?: number;         // pallets; used by the vertical card only
};

// views/features/overview/throughput-card.props.ts
export type ThroughputItemVM = ThroughputItem & { barPercent: number };   // computed in the controller

type ThroughputCardBase = {
  items: ThroughputItemVM[]; // the SAME array for both cards
  unit?: string;             // default "pallets"
};

export type ThroughputCardProps =
  | (ThroughputCardBase & {
      orientation: "horizontal";
      periodLabel?: string;                         // "Today"
    })
  | (ThroughputCardBase & {
      orientation: "vertical";
      mode: "actual" | "target";                    // dropdown: Actual | Actual vs Target
      axisMax: number;                              // computed in the controller
      onModeChange: (m: "actual" | "target") => void;
    });
```

The shared data prop (`items`) is identical. The control props differ only because the controls differ: the horizontal card has no dropdown, so it has no `mode`; the vertical card has one, so it does. The union type makes it impossible to pass `mode` to the horizontal card.

### 3.2 Entry function

```tsx
export function ThroughputCard(props: ThroughputCardProps) {
  return props.orientation === "horizontal"
    ? <ThroughputHorizontalCard {...props} />
    : <ThroughputVerticalCard {...props} />;
}
```

### 3.3 Page usage

```tsx
const { throughput, throughputMode, setThroughputMode } = useOverviewController();

// KPI row
<ThroughputCard orientation="horizontal" items={throughput} periodLabel="Today" />

// main area
<ThroughputCard orientation="vertical" items={throughput}
                mode={throughputMode} onModeChange={setThroughputMode} />
```

### 3.4 Differences handled inside each card

| Aspect | Horizontal | Vertical |
|---|---|---|
| Card height | compact, matches the other KPI cards (~150 px) | large (~480 px, chart ~390 px) |
| Title | "Throughput" | "Throughput by Process" |
| Header extras | period label "(Today)" and unit "(pallets)" | mode dropdown; unit as y-axis title |
| Target data | never drawn | grouped columns when `mode="target"` |
| Colour of bars | process colour | process colour (actual); neutral light grey (target) |

## 4. Colour rules

* Process colours are **identity colours**: inbound = blue, put-away = green, picking = orange, delivery = purple. They say which process, not good or bad.
* They are defined once as `--fx-process-*` tokens (FE-design.md §2.4) and read through `PROCESS_COLOR[item.process]` in `models/domain/process.ts`. Neither card contains a hex value.
* Both cards use the **same** colour for the same process. This also removes the `#3b82f6` / `#3478f6` mismatch.
* Target values use a neutral light grey, never a process colour.
* Bars and columns are never tone-coloured (no red or green by value). Value labels use normal ink.
* For ECharts, `processColor(key)` in `lib/chart-colors.ts` returns the resolved CSS-variable value, because ECharts needs a real colour string. `PROCESS_COLOR` stays as `var(--…)` strings for CSS.

## 5. Calculated values (no hard-coded numbers)

Business logic lives in `models/domain/throughput.ts`, tested without React. The **controller** calls it and passes the results as props (`barPercent` on each item, `axisMax` on the vertical card); the cards do not compute them.

```ts
// models/domain/throughput.ts – scales are named constants, kept with the other config
export const BAR_HEADROOM = 1.12;    // horizontal card: same scale as the prototype
export const AXIS_HEADROOM = 1.18;   // vertical card
const EMPTY_AXIS_MAX = 10;           // all values 0: avoids a 0–0 axis

// bar width in the horizontal card. Actual only.
export const barPercent = (value: number, items: ThroughputItem[]): number => {
  const max = Math.max(...items.map((item) => item.actual)) * BAR_HEADROOM;
  return max ? Math.min(100, (value / max) * 100) : 0;
};

// y-axis max in the vertical card; includes target when it is drawn
export const axisMax = (items: ThroughputItem[], withTarget: boolean): number => {
  const max = Math.max(...items.flatMap((item) => [item.actual, withTarget ? item.target ?? 0 : 0]));
  return max ? max * AXIS_HEADROOM : EMPTY_AXIS_MAX;
};
```

These replace the hand-typed `percent` field in the horizontal card and the fixed y-axis in the vertical one.

## 6. Reused components

| Component | Role | Change needed |
|---|---|---|
| `PanelCard` (planned) | common parent card, header slot | create; until then `Card` + the header row copied from the current cards |
| `FilterSelect` (planned) | mode dropdown (vertical card only) | create; until then the existing `Select` |
| `ProgressBar` (planned) | one bar per process in the horizontal card | create; takes `percent`, `appearance` (`{ process }` here), `height` |
| `EChart` | renders the vertical chart | none |
| `buildThroughputOption({ items, mode, axisMax })` | builds the ECharts option, new, in `views/common/charts/`; colours via `processColor` | create; keeps option code out of the card |

## 7. Data flow (target)

```
overview repository (throughput per process, today's actual; target for the chart)
   → mapper → domain → useOverviewController
   → ThroughputItem[]  (+ throughputMode from uiStore)
   → <ThroughputCard orientation="horizontal" />  and  <ThroughputCard orientation="vertical" />
```

* The Time Range filter changes the query, so both cards update together. The horizontal card's period label follows the filter ("Today", "Yesterday", "Last 7 days").
* `mode` is UI state in `uiStore` (action A3, FE-design.md §3.1). Changing it does not refetch; it only changes what the vertical card draws. It never affects the horizontal card.
* If target values are missing, the dropdown offers only "Actual".

## 8. Edge cases

| Case | Behaviour |
|---|---|
| `items` empty or `null` | body shows "No data" (`EmptyState`); no bars, no axes |
| All values 0 | bars at 0 %, chart y-axis 0–10 (no divide by zero) |
| `target` missing on some items | those items show actual only |
| Value over the scale | `barPercent` caps at 100 % |
| `mode="target"` on the horizontal card | not allowed by the types; ignored if it happens at runtime |
| Unknown `process` key | falls back to the neutral colour and logs once in development |

## 9. Change list

1. Add `models/domain/process.ts` (`ProcessKey`, `PROCESS_COLOR`), the `--fx-process-*` tokens in `app/globals.css`, and `lib/chart-colors.ts` (`processColor`).
2. Add `models/domain/throughput.ts` (`barPercent`, `axisMax`) and `models/types/throughput.ts`.
3. Add `views/features/overview/throughput-card.tsx` and `throughput-card.props.ts` with `ThroughputHorizontalCard` and `ThroughputVerticalCard`, and `buildThroughputOption` in `views/common/charts/`.
4. In `overview-page.tsx`, render `ThroughputCard` twice (`orientation="horizontal"` and `"vertical"`) with one shared `items` array.
5. Wire the vertical card's dropdown (`mode` / `onModeChange`) and change its second option from "Target" to "Actual vs Target".
6. Delete `throughput-summary-card.tsx` and `throughput-chart.tsx`.
7. Update the Status column in FE-design.md §2.2 when done.

## 10. Acceptance checks

* Both cards come from one `ThroughputCard`; no copied data or colours remain.
* Both cards draw from the same `items` array and show identical actual numbers.
* The same process has the same colour in both cards; no hex values in the components.
* The horizontal card shows actual only and has no dropdown; the vertical card has the dropdown and can show target.
* Bar widths are calculated, not typed in.
* `EChart` is unchanged.
