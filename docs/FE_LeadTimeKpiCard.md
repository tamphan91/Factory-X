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
 ├─ delta block                   (right)  ← colour from delta rule
 └─ Sparkline(data, color)        (bottom) ← colour from process
      └─ EChart(option)
```

Location: `components/overview/lead-time-kpi-card.tsx` (a generic KPI card, so it may move to `components/common/` when a second feature needs it).

### 3.1 Props

```ts
interface LeadTimeKpiCardProps {
  title: string;        // "Inbound Lead Time" | "Picking / Kitting Lead Time"
  value: number;        // 42
  unit?: string;        // default "min"
  target: number;       // 60  (shown as "Target ≤ 60 min")
  delta: string;        // "-15%"
  upIsGood?: boolean;   // default false: for lead time, down is good
  trend: number[];      // any numeric array, drawn by Sparkline
  color: string;        // process colour for the trend line
}
```

The props are display-ready, following the view-model rule in FE-design.md §2.3. The card makes no requests and holds no state.

### 3.2 Usage

```tsx
<LeadTimeKpiCard title="Inbound Lead Time"
  value={42} target={60} delta="-15%" trend={inboundTrend}
  color={PROCESS_COLOR.inbound} />

<LeadTimeKpiCard title="Picking / Kitting Lead Time"
  value={28} target={30} delta="+12%" trend={pickingTrend}
  color={PROCESS_COLOR.picking} />
```

`PROCESS_COLOR` is the shared process-colour map (FE-design.md §2.3.1). Until it exists, pass the hex values the cards use now. Do not change the colours yet.

## 4. Colour rules

The card has two independent colours, each with one rule:

| Element | Colour source | Meaning |
|---|---|---|
| Trend line and fill | `color` prop = **process colour only** (inbound = blue, picking = orange) | which process this is |
| Delta text and arrow ("-15%", "+12%") | `deltaTone(delta, upIsGood)` from `domain/tone.ts` | good or bad versus yesterday (green or red) |

Rules:
* The line colour **never** changes with the data. It is always the process colour, whatever the value or delta.
* The delta number is the **only** status colour on the card. It must come from `deltaTone`, not from an inline class such as `text-green-500`.
* Consequence: the picking card has an orange line and a red "↑ +12%" at the same time. The line says "picking"; the delta says "worse than yesterday".

```ts
// domain/tone.ts (FE-design.md §2.5)
export const deltaTone = (delta: string, upIsGood: boolean): Tone => {
  const n = parseFloat(delta);
  return !n ? "neutral" : (n > 0) === upIsGood ? "good" : "bad";
};
// in the card: const tone = deltaTone(delta, upIsGood);  → "good" | "bad" | "neutral"
```

`good`, `bad` and `neutral` map to the success, danger and neutral tokens (green, red, grey).

## 5. Reused components

| Component | Role in the card | Change needed |
|---|---|---|
| `KpiCardShell` | common parent card | none now; later add an optional `title` prop |
| `Sparkline` | trend line from any `number[]` | none |
| `EChart` | renders the ECharts options | none |
| `DeltaIndicator` (planned) | delta block; takes the tone from `deltaTone` | until it exists, the delta markup stays inside `LeadTimeKpiCard` but still uses `deltaTone` |

## 6. Data flow (target)

`useOverviewController` builds the values, the card only displays them:

```
overview repository (inbound & picking lead time, delta, 18-point trend)
   → mapper → domain → useOverviewController → { inbound, picking } view-models
   → <LeadTimeKpiCard {...inbound} color={PROCESS_COLOR.inbound} />
   → <LeadTimeKpiCard {...picking} color={PROCESS_COLOR.picking} />
```

The Time Range filter changes the query, so the value, delta and trend update together. Until the service layer exists, `overview-page.tsx` passes the hard-coded values.

## 7. Edge cases

| Case | Behaviour |
|---|---|
| `trend` empty or `null` | `Sparkline` shows no line; the card shows "No data" |
| `value` over `target` | value text uses the `bad` tone |
| Delta missing | delta block hidden |
| Delta `"0%"` | neutral colour, no arrow |

## 8. Change list

1. Add `components/overview/lead-time-kpi-card.tsx` with the props above.
2. In `features/overview/overview-page.tsx`, render `LeadTimeKpiCard` twice in place of `InboundLeadtimeCard` and `PickingLeadtimeCard`.
3. Delete `inbound-leadtime-card.tsx` and `picking-leadtime-card.tsx`.
4. Update the Status column in FE-design.md §2.2 when done.

## 9. Acceptance checks

* The card looks the same as today for both processes (value, target, delta, line).
* Inbound line is blue, picking line is light orange; delta colours follow the delta rule.
* Both cards come from one component; no copied markup remains.
* `Sparkline` and `EChart` are unchanged and accept any numeric array.
