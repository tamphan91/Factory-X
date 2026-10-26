# FactoryX – Warehouse Control Tower: Frontend Design

> Scope: the Next.js web app that replaces the static prototype `tmp/FactoryX_AI-Powered Logistics Control Tower_Dashboard.html`.
> Stack (already in `frontend/`): Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui (base-ui), ECharts, lucide-react, @xyflow/react.

---

## 1. Introduction

This design is based on the prototype `tmp/FactoryX_AI-Powered Logistics Control Tower_Dashboard.html` (4 pages: Overview, Warehouse Operations, Demand & Lead Time, Simulation & Recommendation).

### 1.1 Chosen architecture

![Architecture diagram](img/architecture.svg)

*Text version of the same diagram:*

**Feature-sliced, 4-layer architecture (MVC/MVVM hybrid) with one-way dependencies.**

```
 ┌──────────────────────────────────────────────────────────────┐
 │ VIEW        components/, features/*/views                     │  React components. Render props/state only.
 │             (dumb, no fetch, no business rules)               │  Emit intents: onSort(), onRefresh()...
 └──────────────▲───────────────────────────────┬───────────────┘
        view-model (typed props)          user events (intents)
 ┌──────────────┴───────────────────────────────▼───────────────┐
 │ CONTROL     features/*/use-*.ts, controllers/                 │  Custom hooks = controllers.
 │             (thin orchestration)                              │  Map UI events → store updates / queries /
 │                                                               │  mutations. Hold no domain rules.
 └──────────────▲───────────────────────────────┬───────────────┘
              reads                           calls
 ┌──────────────┴──────────────┐   ┌────────────▼───────────────┐
 │ MODEL                        │   │ SERVICE (data access)      │
 │ domain/ : types, pure        │   │ services/ : api client,    │
 │   business logic (selectors, │   │   repositories, DTO→domain │
 │   status rules, formatters)  │   │   mappers, WebSocket       │
 │ stores/ : UI + session state │   │ Only layer that knows URLs │
 │   (Zustand)                  │   │ / HTTP / JSON shapes       │
 └──────────────────────────────┘   └────────────────────────────┘
```

**Dependency rule:** `View → Control → (Model, Service)`. Model never imports React components or services. Service never imports the model's stores. A View never calls `fetch`.

**Why this one** (vs. plain "components + fetch in useEffect", or Redux-everything):

1. **Testability** – business rules (`zoneStatus`, on-time rate, sort/filter) are pure functions in `domain/`; test without React or network.
2. **Swap-ability** – the prototype ships demo data; `services/` has a `mock` and a `http` implementation behind one interface (`DashboardRepository`), switched by env var. Views do not change when the real backend lands.
3. **Server state ≠ UI state** – TanStack Query owns fetched data (cache, polling, refetch); Zustand owns UI state (time range, view mode, tab order, sort). Mixing them is the main source of bugs in the prototype's global `S`.
4. **Fits Next.js App Router** – pages are Server Components that only compose Client features; `"use client"` stays at feature boundaries.
5. **Parallel work** – the team can build views against typed mock view-models while services are being wired.

### 1.2 Responsibilities per layer

| Layer | Owns | Must NOT |
|---|---|---|
| **View** | JSX, Tailwind classes, ECharts option building from view-model, a11y | fetch, compute KPIs, read stores directly (except via a controller hook) |
| **Control** | `useXxxController()` hooks: subscribe to stores/queries, expose `{ vm, actions }`; debounce, optimistic updates, error toasts | contain domain formulas, JSX |
| **Model** | `types/` (domain entities), `domain/` (pure rules), `stores/` (Zustand slices) | import React UI, call HTTP |
| **Service** | `apiClient`, repositories, DTO mappers, WebSocket client, auth token handling | hold UI state, know about components |

### 1.3 Target folder layout

```
frontend/
├─ app/                          # Next.js routes (thin; compose features)
│  ├─ (auth)/login/page.tsx
│  ├─ (dashboard)/layout.tsx     # header + tab bar + footer, providers
│  ├─ (dashboard)/overview/page.tsx
│  ├─ (dashboard)/warehouse/page.tsx
│  ├─ (dashboard)/demand/page.tsx
│  ├─ (dashboard)/simulation/page.tsx
│  └─ globals.css                # design tokens (see §2.4)
├─ components/
│  ├─ ui/                        # shadcn primitives (existing)
│  ├─ common/                    # shared building blocks (§2.1)
│  └─ charts/                    # echart wrapper, theme
├─ features/                     # one folder per dashboard page
│  ├─ overview/   { views/, overview.controller.ts, overview.vm.ts }
│  ├─ warehouse/
│  ├─ demand/
│  ├─ simulation/
│  └─ shell/                     # header, tabs, auth controls
├─ domain/                       # Model: pure business logic
│  ├─ kpi.ts  zone.ts  alert.ts  forecast.ts  simulation.ts  format.ts
├─ types/                        # Model: entity + DTO types
├─ stores/                       # Model: Zustand (ui, filters, tabs, session)
├─ services/                     # Service layer
│  ├─ http/apiClient.ts  ws/realtime.ts
│  ├─ repositories/  { dashboard, warehouse, demand, simulation, auth }.repo.ts
│  ├─ mappers/       # DTO → domain
│  └─ mock/          # seeded demo data (port of BASE_DATA/getData)
├─ hooks/                        # generic hooks (useInterval, useEventSource)
└─ lib/                          # utils, constants
```

### 1.4 Data flow (one example)

![Data flow diagram](img/data-flow.svg)

User changes **Time Range** → `TimeRangeSelect` (View) calls `onChange("yesterday")` → `useShellController().setTimeRange` (Control) updates `filtersStore` (Model) → all feature queries include `timeRange` in their key → TanStack Query refetches via `dashboardRepo.getOverview(timeRange)` (Service) → mapper converts DTO → domain → controller derives the view-model with `domain/kpi.ts` → View re-renders.

---

## 2. View

Rules for every component: props-in / events-out, no data fetching, typed view-model props, Tailwind classes only through the shared tokens/variants in §2.4, no inline hex colours.

### 2.1 Common Components (`components/common/`, `components/ui/`)

#### Primitives (shadcn, `components/ui/`)

| Component | Purpose | Prototype origin | Status |
|---|---|---|---|
| `Button` (variants: default, ghost, link) | `.run`, `.vall` "View All ›" | `.run`, `.vall` | Implemented as `Button` (`components/ui/button.tsx`) |
| `Card` (+ `CardHeader/Title/Content`) | white/dark panels | `.card`, `.dark` | Implemented as `Card` (`components/ui/card.tsx`) |
| `Select` | all `select.dd` dropdowns | `select.dd` | Implemented as `Select` (`components/ui/select.tsx`) |
| `Tabs` | page navigation | `.nav` | Implemented as `Tabs` (`components/ui/tabs.tsx`) |
| `Table` | zone table | `table.zt` | Implemented as `Table` (`components/ui/table.tsx`) |
| `Badge` | demo tag, status, vehicle chips | `.demo`, `.vchip` | Implemented as `Badge` (`components/ui/badge.tsx`) |
| `Dialog` / `Sheet` | alert details, recommendation details | `#rec-more`, `#alert-viewall` | Implemented as `Dialog`, `Sheet` (`components/ui/dialog.tsx`, `sheet.tsx`) |
| `SegmentedControl` (on top of `ToggleGroup`) | Zone/Vehicle view, By Type/By Zone | `.seg` | Not implemented |
| `RadioGroup` | scenario picker | `.radio` | Not implemented |
| `Tooltip` | row hover details | `title=` | Not implemented |
| `Skeleton`, `Sonner` (toast) | loading / error feedback | – | Not implemented |
| `DropdownMenu`, `Avatar` | user menu (logout) | – | Not implemented |
| `Input`, `Label`, `Form` | login form | – | Not implemented |

#### Shared building blocks (`components/common/`)

| Component | Props (summary) | Used by | Status |
|---|---|---|---|
| `PanelCard` | `title`, `subtitle?`, `actions?`, `tone: "light"\|"dark"`, `children` – replaces repeated `.card`/`.dark` + `.hrow` header | every panel | Not implemented – each panel repeats `Card` + classes (e.g. `AlertsPanel`, `ThroughputChart`) |
| `PanelHeader` | `title`, `subtitle`, `actions` slot | PanelCard | Not implemented – header row is inlined in each panel |
| `FilterSelect` | `label?`, `options`, `value`, `onChange` – labelled `Select` with the prototype's `dd` look | all dropdowns | Not implemented – `Select` is inlined in `DashboardHeader`, `AlertsPanel`, `ThroughputChart` |
| `StatusDot` | `status: "ok"\|"warn"\|"critical"\|"info"` | docks, table status, legends | Not implemented – header uses a "●" text character |
| `DeltaIndicator` | `value: string`, `upIsGood: boolean`, `caption?` – ↑/↓ coloured | KPI cards, resources, totals | Not implemented – delta markup is duplicated inside each KPI card |
| `ProgressBar` | `percent`, `tone`, `height` – `.track/.fill` | throughput, resources | Not implemented – inlined in `ThroughputSummaryCard` |
| `DonutGauge` | `percent`, `tone`, `thick?` – `gauge-chart` | KPI cards | Partial as `GaugeChart` (`components/dashboard/gauge-chart.tsx`) – props `value`, `color` only; no `thick`, no tone |
| `Sparkline` | `data[]`, `tone` | KPI cards | Implemented as `Sparkline` (`components/charts/sparkline.tsx`) – takes `color` instead of `tone` |
| `KpiCardShell` | `title`, `children` | KPI cards | Partial as `KpiCardShell` (`components/dashboard/kpi-card-shell.tsx`) – fixed height, `children` only, no `title` prop |
| `Icon` registry | `name` → lucide / custom SVG (forklift, agv, pallet, valve, solenoid, sensor, gear, housing, egr, building, factory, truck) | layout, resources, demand list | Not implemented – `lucide-react` icons used directly (only in `AlertsPanel`) |
| `Legend` | `items: {color, label, dashed?}[]` | layout, queue, simulation | Not implemented |
| `EmptyState` | message | alerts, tables | Not implemented |
| `ErrorState` + `RetryButton` | error + `onRetry` | every data panel | Not implemented |
| `LoadingState` | skeleton per panel | every data panel | Not implemented |
| `DemoDataBadge` | shows "Simulation / Demo Data" when repository = mock | header | Not implemented – demo text is only in `DashboardFooter` |
| `LastUpdated` | timestamp + relative age | header | Not implemented – date is hard-coded in `DashboardHeader` |
| `SignalBars` | `level 1-4`, `tone` | demand list | Not implemented |
| `EChart` | wrapper over echarts-for-react with shared theme, resize, `option` prop | all charts | Partial as `EChart` (`components/charts/echart.tsx`) – SSR-safe wrapper with `option`, `height`; shared theme `FACTORY_THEME` (`lib/echar-theme.ts`) exists but is not applied |

### 2.2 Specialized Components (`features/*/views/`)

#### Shell (`features/shell/`)

| Component | Notes | Status |
|---|---|---|
| `DashboardHeader` | composes brand, title, `ScopeBadge`, `TimeRangeSelect`, `ViewModeToggle`, `LiveIndicator`, `UserMenu` | Partial as `DashboardHeader` (`components/header/dashboard-header.tsx`) – title, Time Range select, Live text; no logo, scope, view mode or user menu; values not wired |
| `BrandLogo` | logo image (from `public/`) | Partial – "FactoryX" text `<h1>` inside `DashboardHeader`; no logo image |
| `ScopeBadge` | "In-plant Warehouse Logistics" flow text | Not implemented |
| `TimeRangeSelect` | Today / Yesterday / Last 7 days → `filtersStore` | Partial – inline `Select` in `DashboardHeader` (uncontrolled, not connected to any state) |
| `ViewModeToggle` | Zone View / Vehicle View | Not implemented |
| `LiveIndicator` | pulsing dot, "Live (5 min refresh)", clock, manual refresh button, pause toggle | Partial – static "Live (5 min refresh)" text and hard-coded timestamp in `DashboardHeader`; no refresh or pause |
| `UserMenu` | avatar, name, Logout | Not implemented |
| `DashboardTabs` | **reorderable** tab bar (drag), see §3.4 | Partial as `DashboardTabs` (`components/tabs/dashboard-tabs.tsx`) – 4 tabs; only Overview has content, others show "Coming Soon"; not draggable, no routes |
| `SortableTab` | one draggable tab trigger + drag handle | Not implemented |
| `ExternalLinkTab` | "Solution Simulation ↗" | Not implemented |
| `DashboardFooter` | | Implemented as `DashboardFooter` (`components/footer/dashboard-footer.tsx`) |
| `LoginForm` | email/password, error message | Not implemented |

#### Overview (`features/overview/`)

| Component | Notes | Status |
|---|---|---|
| `OverviewPage` | grid composition | Implemented as `OverviewPage` (`features/overview/overview-page.tsx`) – composes cards from `components/overview/`; static data |
| `SupplyRateCard` | donut + delivered/overdue + delta | Partial as `SupplyRateCard` (`components/overview/supply-rate-card.tsx`) – layout done; values hard-coded, no props |
| `InboundLeadtimeCard` / `PickingLeadtimeCard` | built from a generic `LeadTimeKpiCard` (value, target, delta, sparkline) – **refactor to one component** | Partial as `InboundLeadtimeCard`, `PickingLeadtimeCard` (`components/overview/`) – two separate copies with hard-coded data; generic `LeadTimeKpiCard` not created |
| `StagingCard` / `WarehouseCard` | built from a generic `OccupancyKpiCard` – **refactor to one component** | Partial as `StagingCard`, `WarehouseCard` (`components/overview/`) – two separate copies with hard-coded data; generic `OccupancyKpiCard` not created |
| `ThroughputSummaryCard` | progress bars per process | Partial as `ThroughputSummaryCard` (`components/overview/throughput-summary-card.tsx`) – hard-coded data, inline bars |
| `AlertsPanel` | filter select + View All | Partial as `AlertsPanel` (`components/overview/alerts-panel.tsx`) – hard-coded list; filter not wired, no Info option, no View All |
| `AlertItem` | icon by severity, title, detail, time | Partial – rendered inline in the `AlertsPanel` map; every row uses the red style regardless of severity |
| `ThroughputChart` | Actual / Actual vs Plan toggle | Partial as `ThroughputChart` (`components/overview/throughput-chart.tsx`) – static bars; mode select not wired, no Plan series |

#### Warehouse Operations (`features/warehouse/`)

| Component | Notes | Status |
|---|---|---|
| `WarehouseLayoutPanel` | dark panel: title + view toggle + scroll area + legend. Consider @xyflow/react vs CSS grid; CSS grid is enough for v1 | Not implemented |
| `LayoutStage` | generic stage box (`tone`: receiving/storage/picking/staging/handover) | Not implemented |
| `ReceivingStage` + `DockCard` | docks with status dot | Not implemented |
| `PutawayWaitingStage` | queue count + avg minutes | Not implemented |
| `StorageStage`, `PickingStage`, `StagingStage` | grids of `ZoneTile` | Not implemented |
| `ZoneTile` | name, %, `ProgressBar`, alert badge, `VehicleChip`s (vehicle view) | Not implemented |
| `VehicleChip` | FL / AGV, offline state | Not implemented |
| `HandoverStage` | ready pallets + to-production | Not implemented |
| `FlowArrow` | between stages | Not implemented |
| `VehicleLane` | dashed lane with in-progress / delayed segments | Not implemented |
| `ResourceStatusPanel` | `SegmentedControl` + `ResourceRow[]` | Not implemented |
| `ResourceRow` | icon, used/total, bar, %, delta | Not implemented |
| `ZonePerformanceTable` | sortable columns, area filter | Not implemented |
| `SortableHeaderCell` | `th` with asc/desc indicator, keyboard accessible | Not implemented |
| `QueueByZoneChart` | stacked horizontal bars (Waiting / In-progress), Top N select | Not implemented |

#### Demand & Lead Time (`features/demand/`)

| Component | Notes | Status |
|---|---|---|
| `ProductDemandPanel` | sort select, list, total | Not implemented |
| `ProductDemandRow` | product icon, name, count, `SignalBars` | Not implemented |
| `DemandTotal` | total + delta | Not implemented |
| `DemandForecastChart` | bars + capacity step lines + forecast shading; range 7/14 | Not implemented |
| `LeadTimeTrendChart` | 4 process lines, dotted forecast segment; range select | Not implemented |

#### Simulation & Recommendation (`features/simulation/`)

| Component | Notes | Status |
|---|---|---|
| `ScenarioPanel` | `RadioGroup` of 6 scenarios + Run button | Not implemented |
| `ScenarioComparisonTable` | Base vs selected, green/red by better/worse | Not implemented |
| `SimulationResultGrid` | 4 metric bar charts, dims non-selected | Not implemented |
| `SimulationMetricChart` | one chart, reusable | Not implemented |
| `RecommendationPanel` | sort select + details toggle | Not implemented |
| `RecommendationItem` | rank badge, title, sub, detail, metrics | Not implemented |
| `ImpactMetric` | value + label green pill | Not implemented |

### 2.3 View-model contract

Every specialized component receives a **view-model** (display-ready values: formatted strings, tone enums, percentages), never raw DTOs. View-models are built in `features/*/*.vm.ts` by calling `domain/` functions. Example:

```ts
// features/overview/overview.vm.ts
export type SupplyRateVM = { percent: number; tone: Tone; delivered: string; overdue: number; delta: DeltaVM };
```

### 2.4 Shared styles (applied site-wide, once)

All visual constants live in **`app/globals.css`** as CSS variables mapped into Tailwind 4 via `@theme inline` (the project already does this for shadcn). No component uses a raw hex value; the existing `bg-[#081c4b]` / `text-white` repeated in `dashboard-tabs.tsx` should move to tokens.

```css
/* app/globals.css — dashboard tokens (values taken from the prototype) */
:root {
  /* surfaces */
  --fx-bg:            #071533;   /* page */
  --fx-bg-glow:       #143272;
  --fx-panel-dark:    #0d2658;
  --fx-panel-dark-2:  #14336f;
  --fx-panel-border:  #2b4c8c;
  --fx-card:          #ffffff;
  --fx-ink:           #16213d;
  --fx-muted:         #69748f;
  --fx-text-on-dark:  #e8eefc;
  --fx-text-soft:     #c6d3f2;
  --fx-grid:          #eef1f6;
  /* semantic */
  --fx-primary:  #2f7cf6;
  --fx-success:  #1fb46b;
  --fx-warning:  #f59a23;
  --fx-caution:  #f2c200;
  --fx-danger:   #e5413e;
  --fx-info:     #2f7cf6;
  --fx-purple:   #8b5cf6;
  --fx-teal:     #14b8a6;
  --fx-slate:    #7b8db3;
  /* shape & type */
  --fx-radius-card: 6px;
  --fx-font: "Barlow Semi Condensed", "Roboto Condensed", "Arial Narrow", "Segoe UI", Arial, sans-serif;
}
@theme inline {
  --color-fx-bg: var(--fx-bg);
  --color-fx-panel: var(--fx-panel-dark);
  --color-fx-border: var(--fx-panel-border);
  --color-fx-ink: var(--fx-ink);
  --color-fx-muted: var(--fx-muted);
  --color-fx-primary: var(--fx-primary);
  --color-fx-success: var(--fx-success);
  --color-fx-warning: var(--fx-warning);
  --color-fx-danger: var(--fx-danger);
  --font-sans: var(--fx-font);
}
body { background: radial-gradient(1400px 700px at 50% -15%, var(--fx-bg-glow) 0, var(--fx-bg) 62%); color: var(--fx-text-on-dark); }
@media (prefers-reduced-motion: reduce) { .fx-pulse { animation: none; } }
```

| Concern | Where | Rule |
|---|---|---|
| Font | `app/layout.tsx` via `next/font/google` (Barlow Semi Condensed 400–700) | replaces the `<link>` in the prototype |
| Colour tokens | `globals.css` (above) | status → colour mapping lives in **one** place: `domain/tone.ts` (`Tone` → CSS var class) |
| Chart theme | `lib/echar-theme.ts` (existing) reads the same tokens; one palette for all charts | |
| Component variants | `class-variance-authority` in each common component (`tone`, `size`) | no ad-hoc class strings in features |
| Layout | `PageGrid` helper = 12-col grid with `gap-2`; page max-width 1920 px, padding `px-3` | |
| Responsive | breakpoints from prototype: ≤1500 px KPI row → 3 cols; ≤900 px single column | |
| Dark/light | Header, tabs, layout panel = dark tone; cards = light tone via `PanelCard tone` | |
| A11y | focus ring `2px solid var(--fx-primary)`, `aria-sort` on sortable headers, `prefers-reduced-motion` | |
| Data-driven styling | see §2.5 | components receive a `Tone`, never a colour |

### 2.5 Data-driven styles (style changes in response to data)

Some styles must change when the data changes: an alarm, a warning, a late deadline, missing data, a target not met, or any value with a negative meaning. This is **not** done inside components. The flow is always:

```
data (Model) ──► rule (domain/tone.ts, thresholds.ts) ──► Tone ──► component variant ──► CSS token
```

1. **Rules decide the tone.** Pure functions in `domain/` take data and return a `Tone`. They contain every threshold and "is up good?" decision, and are unit tested.
2. **Controllers attach the tone to the view-model** (`{ value, delta, tone }`), so Views never compare numbers.
3. **Components map tone to style** through one `cva` variant (`tone`) and the tokens in §2.4. No component contains a hex colour or an `if (value > …)`.

#### Tone set

| Tone | Meaning | Token | Typical use |
|---|---|---|---|
| `good` | on target / healthy | `--fx-success` | on-time, below-target lead time, normal zone |
| `info` | informational, no action | `--fx-info` | Info alerts, offline notice |
| `warning` | approaching a limit | `--fx-caution` / `--fx-warning` | occupancy 75–89 %, queue growing |
| `critical` | alarm, action needed | `--fx-danger` | occupancy ≥ 90 %, critical alert, offline resource |
| `bad` | negative result (not an alarm) | `--fx-danger` | metric moved the wrong way, target missed |
| `late` | deadline passed / at risk | `--fx-danger` + clock icon | overdue requests, delayed delivery, delayed vehicle lane |
| `unavailable` | no data, stale data, source down | `--fx-slate` | "–" value, greyed card |
| `neutral` | no judgement | `--fx-primary` / ink | plain figures, forecast |

`bad`, `late` and `critical` share the red token but differ in **non-colour cues** (see below), so colour is never the only signal.

#### Rules (all in `domain/`, thresholds in `domain/thresholds.ts`)

| Situation | Rule function | Example from the prototype |
|---|---|---|
| Alarm / warning from occupancy and queue time | `zoneTone(occupancy, leadMin)`, `zoneStatus(...)` | occupancy ≥ 90 % → `critical`; ≥ 80 % or lead time ≥ 25 min → `warning`; else `good` |
| Layout tile bar colour | `layoutTone(occupancy, leadMin)` | ≥ 85 % red, ≥ 75 % or ≥ 25 min yellow, else green; alert dot on ≥ 85 % |
| Negative change vs. yesterday | `deltaTone(delta, upIsGood)` | lead time ↑ → `bad`, throughput ↑ → `good` |
| Target not met | `targetTone(value, target, direction)` | picking 28 min vs. target ≤ 30 min → `good`; 32 min → `bad` |
| Late deadline | `deadlineTone(dueAt, now, doneAt?)` | overdue count > 0 → `late`; due within the warning window → `warning` |
| Alert severity | `alertTone(severity)` | `critical` / `warning` / `info` → matching tone and icon |
| Table cell highlight | `cellTone(column, value)` | queue ≥ 8 or lead time ≥ 28 min → `bad` |
| Missing or stale data | `dataTone(value, fetchedAt, maxAge)` | `null`, error or older than 2 × refresh interval → `unavailable` |
| Resource problem | `resourceTone(resource)` | AGV offline / battery low → `critical` |

```ts
// domain/tone.ts
export type Tone = "good" | "info" | "warning" | "critical" | "bad" | "late" | "unavailable" | "neutral";

export const deltaTone = (delta: string, upIsGood: boolean): Tone => {
  const n = parseFloat(delta);
  return !n ? "neutral" : (n > 0) === upIsGood ? "good" : "bad";
};

export const targetTone = (v: number | null, target: number, dir: "max" | "min"): Tone =>
  v == null ? "unavailable" : (dir === "max" ? v <= target : v >= target) ? "good" : "bad";
```

When several rules apply to the same element, take the **most severe** tone: `critical` > `late` > `bad` > `warning` > `info` > `good` > `neutral`; `unavailable` overrides all, because a judgement on missing data is not trustworthy. A helper `worstTone(...tones)` in `domain/tone.ts` does this.

#### How components apply a tone

| Element | Change when tone changes |
|---|---|
| `DeltaIndicator`, KPI value | text colour and arrow; `unavailable` shows "–" and hides the delta |
| `Sparkline`, `DonutGauge`, `ProgressBar` | line / fill colour from `tone`; `unavailable` shows a dashed grey line or empty ring |
| `ZoneTile`, `ResourceRow` | bar colour, border and alert dot (`critical`, `late`) |
| Table cell | background tint and bold text (`bad`, `critical`) |
| `AlertItem` | left border, icon circle and background by severity |
| `PanelCard` | optional tone stripe; `unavailable` greys the panel and shows "Data unavailable" with a Retry button (`ErrorState`) |

Components take a `tone` prop and map it with a single `cva` variant per component; the same `Tone` → class map is reused by ECharts builders through a `toneColor(tone)` helper that reads the CSS tokens (ECharts needs real colour values, not class names).

#### Rules for accessibility and behaviour

* **Colour is never the only cue.** `critical` shows a `!` icon, `late` a clock icon, `bad` an arrow or "▲/▼" with text, `unavailable` shows "–" and the words "No data". Add `aria-label` / `title` text such as "Critical: occupancy 90 %".
* **Alarms may animate** (pulse on the alert dot), but must respect `prefers-reduced-motion`.
* **Tone changes with data, not with time of render.** The same input always gives the same tone, so the view is predictable and testable.
* **Thresholds are configuration**, not component code, in `domain/thresholds.ts`, so they can later come from the backend (per plant or per process) without touching any View.
* **Stale data:** the last good values stay visible but are marked `unavailable` once older than the allowed age, with `LastUpdated` showing the age.

---

## 3. Control

Controllers are custom hooks in `features/*/` (and `features/shell/`). Views call **actions**; actions are the only way UI events change state or trigger requests. They are defined once in the shell/global controller when shared, and in the feature controller when local.

### 3.1 Action catalogue

| # | Action | Trigger (View event) | What the controller does | State touched |
|---|---|---|---|---|
| A1 | `setTimeRange(range)` | `TimeRangeSelect.onChange` | write to `filtersStore`; all queries re-key and refetch | `filtersStore.timeRange` |
| A2 | `setViewMode(mode)` | `ViewModeToggle` click (header **and** layout panel share it) | write to store; layout re-renders (no refetch) | `filtersStore.viewMode` |
| A3 | `setLocalFilter(key, value)` | local select/segment change (alert level, throughput mode, area, queue top-N, demand sort, forecast range, lead range, rec sort, resource group) | write to the feature's slice of `uiStore`; derive VM with domain selector | `uiStore.<feature>.<key>` |
| A4 | `toggleSort(column)` | click / Enter / Space on sortable header | cycles asc → desc; sorted with `domain/sort.ts` | `uiStore.zoneTable.sort` |
| A5 | `selectItem(id)` / `openDetails(id)` | click alert, "View All ›", "View Details ›" | open `Dialog`/`Sheet` or toggle inline detail | `uiStore.detail` |
| A6 | `runSimulation(scenarioId)` | Run Simulation click | `useMutation` → `simulationRepo.run`; disable button while pending; toast on error; store result | mutation + `simulationStore.selected` |
| A7 | `refresh()` | Refresh button, tab re-focus, auto-timer | `queryClient.invalidateQueries` for the active page; update `LastUpdated` | query cache |
| A8 | `toggleAutoRefresh()` | Live indicator pause/resume | start/stop the interval (default 5 min) | `uiStore.autoRefresh` |
| A9 | `reorderTabs(from, to)` | drag-and-drop on tabs | see §3.4 | `layoutStore.tabOrder` |
| A10 | `selectTab(id)` | click tab / route change | `router.push`; no full reload | URL |
| A11 | `login(credentials)` | LoginForm submit | `authRepo.login` → store session → redirect | `sessionStore` |
| A12 | `logout()` | UserMenu → Logout | `authRepo.logout`, clear stores + query cache, redirect `/login` | `sessionStore`, cache |
| A13 | `openExternal(url)` | "Solution Simulation ↗" | `window.open(url, "_blank", "noopener")` | – |

Naming: hooks `useShellController`, `useOverviewController`, `useWarehouseController`, `useDemandController`, `useSimulationController`, `useAuthController`. Each returns `{ vm, status, actions }`:

```ts
const { vm, status, actions } = useWarehouseController();
// status: "loading" | "error" | "ready"; actions.toggleSort, actions.setViewMode, actions.refresh ...
```

### 3.2 Refresh data (A7, A8)

* **Server state:** TanStack Query, `staleTime: 60s`, `refetchInterval: 5 min` (from `REFRESH_MS` constant) only while `autoRefresh` is on and the tab is visible (`refetchIntervalInBackground: false`).
* **Manual refresh:** invalidates only queries of the active page (key prefix `["overview", …]`), shows a spinner on the Refresh button and updates `LastUpdated` from `dataUpdatedAt`.
* **Real-time alerts (optional, later):** `services/ws/realtime.ts` (existing `hooks/useWebSocket.ts` becomes a thin adapter) pushes alert/queue events and patches the query cache with `queryClient.setQueryData`; falls back to polling when the socket is closed.
* **Errors:** keep showing last good data, display a non-blocking `ErrorState` banner with Retry; 401 triggers `logout()`.

### 3.3 Click events (A3, A4, A5, A6)

* Handlers are created in the controller with `useCallback`, passed down as `on*` props – Views never touch stores.
* Use **one generic handler** for all local dropdowns: `actions.setLocalFilter("alertLevel", v)`, so the 8 select handlers in the prototype collapse into one pattern.
* Toggles that only change presentation (view mode, alert level, sort) are **client-only** (no network). Toggles that change the query (time range, forecast range, lead range) change the query key.
* Destructive or expensive clicks (`Run Simulation`) are guarded: disabled while pending, de-duplicated by mutation key.

### 3.4 Drag to reorganize tabs (A9)

* Library: **`@dnd-kit/core` + `@dnd-kit/sortable`** (keyboard accessible; works with React 19). Horizontal list strategy, pointer sensor with 6 px activation distance (so a click still selects the tab) plus keyboard sensor (Space to lift, arrows to move).
* `DashboardTabs` renders `SortableContext items={tabOrder}`; each `SortableTab` uses `useSortable(id)`.
* Controller:

```ts
reorderTabs(activeId, overId) {
  if (activeId === overId) return;
  layoutStore.setTabOrder(arrayMove(order, order.indexOf(activeId), order.indexOf(overId)));
}
```

* `layoutStore.tabOrder` is persisted (Zustand `persist` → `localStorage`, key `fx.tabOrder.v1`; later synced to the user profile via `userPrefsRepo`). Unknown/missing ids are reconciled against the static tab registry on load (`domain/tabs.ts`), so adding a new page never breaks a saved order.
* The "Solution Simulation ↗" external link is pinned at the end and is **not** draggable.
* Reordering changes only the order of tab triggers; the active tab and route stay the same.

### 3.5 Login / Log out (A11, A12)

* **Session:** server-issued **httpOnly cookie** (preferred over `localStorage` tokens). The browser never reads the token; `apiClient` uses `credentials: "include"`.
* **Route protection:** `proxy`/middleware (check `AGENTS.md` – Next.js 16 conventions differ, read `node_modules/next/dist/docs/` before writing) redirects unauthenticated requests for `(dashboard)/*` to `/login?next=…`.
* **Login flow:** `LoginForm` → `actions.login` → `authRepo.login()` → on success store `user` (name, role) in `sessionStore`, `router.replace(next ?? "/overview")`; on failure show inline error, no toast spam.
* **Logout flow:** `UserMenu` → `actions.logout` → `authRepo.logout()` (even if it fails) → clear `sessionStore`, `queryClient.clear()`, reset UI stores except `tabOrder` preference → `router.replace("/login")`.
* **Expiry:** `apiClient` interceptor maps `401` to a single `onUnauthorized` callback registered by the shell controller (idempotent) so parallel failing queries trigger one logout.
* **Roles (future):** `domain/permissions.ts` exposes `can(user, "run-simulation")`; Views hide actions via a `<Can>` wrapper – the check is *not* done inside components.

### 3.6 Keyboard & accessibility actions

Sortable header: Enter/Space = `toggleSort`; tabs: arrow keys + drag via keyboard sensor; dialogs: Esc closes; Refresh: `R` shortcut (optional).

---

## 4. Model & Service (reference, for completeness)

**Domain types** (`types/`): `Kpi`, `ThroughputStep`, `Alert{severity}`, `Zone{area, occupancy, queue, avgLeadMin}`, `StagingArea`, `Dock`, `Vehicle{kind, zone, offline}`, `ResourceGroup`, `ProductDemand`, `Forecast`, `LeadTimeSeries`, `Scenario`, `SimulationResult`, `Recommendation`, `TimeRange`, `ViewMode`.

**Pure business rules** (`domain/`, ported from the prototype and unit tested):

| Function | From prototype |
|---|---|
| `onTimeRate(delivered, total)` | `renderKpis` |
| `zoneStatus(occupancy, leadMin)` → Normal/Warning/Critical | `zoneStatus` |
| `zoneTone(occupancy, leadMin)` | `layoutColor` |
| `topQueues(queues, n)` | `renderQueue` |
| `sortProducts(list, mode)` | `renderDemand` |
| `isBetter(metric, base, value)` | `renderSim` |
| `sortRecommendations(list, mode)` | `renderRecs` |
| `deltaTone(delta, upIsGood)` | `deltaSpan` |

**Repositories** (`services/repositories/`): `getOverview(range)`, `getAlerts(range, level?)`, `getWarehouseSnapshot(range)`, `getDemand(range)`, `getForecast(days)`, `getLeadTimeTrend(range)`, `getScenarios()`, `runSimulation(id)`, `getRecommendations()`, `login`, `logout`, `getMe`, `getUserPrefs`/`saveUserPrefs`. Each returns **domain** objects (mapped from DTOs). `services/mock/` ports `BASE_DATA` and `getData()` so the UI works before the backend exists; selected by `NEXT_PUBLIC_DATA_SOURCE=mock|http`.

**State split:**

| State | Tool | Examples |
|---|---|---|
| Server state | TanStack Query | all dashboard data, simulation result |
| UI/global state | Zustand (`filtersStore`, `uiStore`, `layoutStore`, `sessionStore`) | time range, view mode, sort, tab order, user |
| Ephemeral component state | `useState` | dialog open, hover |

**New dependencies to add:** `@tanstack/react-query`, `zustand`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `sonner` (toasts), `vitest` + `@testing-library/react` (tests).

---

## 5. Migration notes from the current `frontend/`

1. Move shared header filters and tab logic out of `components/header` and `components/tabs` into `features/shell/` and drive them from stores.
2. Replace `lib/mock-data.ts` with `services/mock/` behind a repository; remove direct imports of mock data in cards.
3. Merge the near-duplicate cards (`inbound-leadtime-card` / `picking-leadtime-card`, `staging-card` / `warehouse-card`) into generic `LeadTimeKpiCard` and `OccupancyKpiCard`.
4. Replace hard-coded colours (`#081c4b`, etc.) with the tokens in §2.4.
5. Convert the single-page tab view to route segments (`/overview`, `/warehouse`, …) so URLs are shareable, matching the prototype's hash routes.
6. The prototype uses Plotly; the project uses ECharts – port chart options once into `components/charts` builders (`buildThroughputOption`, `buildForecastOption`, …) that take a view-model.
