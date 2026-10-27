# LeadTimeKpiCard – Inbound Lead Time and Picking / Kitting Lead Time

Design notes for the two Overview KPI cards that show a lead time for **one process** with a trend line. Part of [FE-design.md](FE-design.md) (§2.2 Overview).

## 1. What the cards show

| Part | Inbound Lead Time | Picking / Kitting Lead Time |
|---|---|---|
| Title | Inbound Lead Time | Picking / Kitting Lead Time |
| Value | 42 min | 28 min |
| Target | ≤ 60 min | ≤ 30 min |
| Delta vs. yesterday | ↓ -15 % (good) | ↑ +12 % (bad) |
| Trend line | 18 points, process colour: inbound (blue) | 18 points, process colour: picking (light orange) |

Both cards have identical structure. Only the data and the process colour differ.

## 2. Current implementation

| Piece | Code | Notes |
|---|---|---|
| Inbound card | `InboundLeadtimeCard`, `components/overview/inbound-leadtime-card.tsx` | hard-coded text, delta colour and data |
| Picking card | `PickingLeadtimeCard`, `components/overview/picking-leadtime-card.tsx` | copy of the file above with different values |
| Frame | `KpiCardShell`, `components/dashboard/kpi-card-shell.tsx` | fixed height 150 px, `children` only |
| Trend line | `Sparkline`, `components/charts/sparkline.tsx` | props `data: number[]`, `color: string`; fixed height 30 |
| Chart base | `EChart`, `components/charts/echart.tsx` | SSR-safe ECharts wrapper, `option` + `height` |

Problem: the card markup (title, value, target, delta block) is duplicated in two files. `Sparkline` and `EChart` are already reusable and need no change.

## 3. Target design

One shared card, **`LeadTimeKpiCard`**, used twice. The inbound and picking card files are deleted.

```
KpiCardShell                      (common parent card)
 ├─ title
 ├─ value + target                (left)
 ├─ delta block                   (right)  ← tone from the delta rule (computed in the controller)
 └─ Sparkline(data, process)      (bottom) ← colour from process
      └─ EChart(option)
```

Location: `views/common/lead-time-kpi-card.tsx` and `lead-time-kpi-card.props.ts`. The view-model builder is in `controllers/overview.vm.ts`.

### 3.1 Props

```ts
// views/common/lead-time-kpi-card.props.ts
interface LeadTimeKpiCardProps {
  title: string;                         // "Inbound Lead Time" | "Picking / Kitting Lead Time"
  value: number;                         // 42
  valueTone: Tone;                       // targetTone(value, target, "max"), from the controller
  unit?: string;                         // default "min"
  target: number;                        // 60  (shown as "Target ≤ 60 min")
  delta?: { text: string; tone: Tone };  // "-15%"; tone from deltaTone(deltaPct, "down")
  trend: number[];                       // any numeric array, drawn by Sparkline
  process: ProcessKey;                   // decides the trend-line colour
}
```

The props are display-ready, following the view-model rule in FE-design.md §2.3. The card makes no requests, holds no state and computes no tone.

### 3.2 Usage

```ts
// controllers/overview.vm.ts
const buildLeadTimeVM = ({ value, target, deltaPct, trend, process }: LeadTimeSnapshot) => ({
  value,
  valueTone: targetTone(value, target, "max"),
  target,
  delta: { text: formatDelta(deltaPct), tone: deltaTone(deltaPct, "down") },
  trend,
  process,
});
```

```tsx
<LeadTimeKpiCard title="Inbound Lead Time" {...inbound} />    // process: "inbound"
<LeadTimeKpiCard title="Picking / Kitting Lead Time" {...picking} />   // process: "picking"
```

The process colour comes from `PROCESS_COLOR` (FE-design.md §2.3.1). Create the `--fx-process-*` tokens first (FE-design.md §5, item 7); no hex value is passed to the card. Keep the colours the cards use now when defining the tokens.

## 4. Colour rules

The card has two independent colours, each with one rule:

| Element | Colour source | Meaning |
|---|---|---|
| Trend line and fill | `process` prop = **process colour only** (inbound = blue, picking = orange) | which process this is |
| Delta text and arrow ("-15%", "+12%") | `delta.tone` from `deltaTone(deltaPct, goodDirection)` in `models/domain/tone.ts`, called by the controller | good or bad versus yesterday (green or red) |

Rules:
* The line colour **never** changes with the data. It is always the process colour, whatever the value or delta.
* The delta number and the value (when over target) are the **only** status colours on the card. They come from `deltaTone` and `targetTone`, computed in the controller, not from an inline class such as `text-green-500`.
* Consequence: the picking card has an orange line and a red "↑ +12%" at the same time. The line says "picking"; the delta says "worse than yesterday".

`deltaTone(deltaPct, goodDirection)` is defined in FE-design.md §2.5 (`models/domain/tone.ts`). It takes a number, not the display string, and returns `unavailable` for a missing or NaN delta. `good`, `bad`, `neutral` and `unavailable` map to the success, danger, ink and slate tokens.

## 5. Reused components

| Component | Role in the card | Change needed |
|---|---|---|
| `KpiCardShell` | common parent card | none now; later add an optional `title` prop |
| `Sparkline` | trend line from any `number[]` | none |
| `EChart` | renders the ECharts options | none |
| `DeltaIndicator` (planned) | delta block; takes `text` and `tone` | until it exists, the delta markup stays inside `LeadTimeKpiCard` and still takes its tone from the props |

## 6. Data flow (target)

`useOverviewController` builds the values, the card only displays them:

```
overview repository (inbound & picking lead time, delta, 18-point trend)
   → mapper → domain → useOverviewController → { inbound, picking } view-models
   → <LeadTimeKpiCard {...inbound} />   (process: "inbound")
   → <LeadTimeKpiCard {...picking} />   (process: "picking")
```

The Time Range filter changes the query, so the value, delta and trend update together. Until the service layer exists, `overview-page.tsx` passes the hard-coded values.

## 7. Edge cases

| Case | Behaviour |
|---|---|
| `trend` empty or `null` | `Sparkline` shows no line; the card shows "No data" |
| `value` over `target` | `valueTone` is `bad` (set by the controller) |
| Delta missing or NaN | delta block hidden, tone `unavailable` |
| Delta `0` | neutral colour, no arrow |

## 8. Change list

1. Add `views/common/lead-time-kpi-card.tsx` and `lead-time-kpi-card.props.ts` with the props above, and the builder in `controllers/overview.vm.ts`.
2. In `overview-page.tsx`, render `LeadTimeKpiCard` twice in place of `InboundLeadtimeCard` and `PickingLeadtimeCard`.
3. Delete `inbound-leadtime-card.tsx` and `picking-leadtime-card.tsx`.
4. Update the Status column in FE-design.md §2.2 when done.

## 9. Acceptance checks

* The card looks the same as today for both processes (value, target, delta, line).
* Inbound line is blue, picking line is light orange; delta colours follow the delta rule.
* Both cards come from one component; no copied markup remains.
* `Sparkline` and `EChart` are unchanged and accept any numeric array.
