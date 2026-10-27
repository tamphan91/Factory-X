# Demand & Lead Time tab – task plan

Branch: `feature/demand-leadtime-tab`, based on `refactor/migrate-shared-components`. Design sources: [FE-design.md](../FE-design.md) §2.1–2.5 and §3, `.claude/rules/`, the Overview docs ([FE_LeadTimeKpiCard.md](../FE_LeadTimeKpiCard.md) for the lead-time model). There is no component doc for this tab; P6-T03 adds the status rows.
All paths are relative to `frontend/`. The commit message of each task starts with its ID, e.g. `P1-T03: add demand types`.

## Scope
- **In scope:** the Demand & Lead Time tab: product demand panel (sort, rows, total), demand & capacity forecast chart (7/14 days), lead-time trend chart (range select), in the MVC layout. Mock data only (the repository returns mock data, as for Overview). The tab also moves every `lucide-react` import into one `Icon` registry (see Phase 2).
- **Out of scope:** Simulation tab (stays "Coming Soon"), global time range (`filtersStore`, A1), TanStack Query, HTTP repository, moving the hard-coded hex in the shell, a `Legend` component (both charts use the ECharts legend).
- **Done means:** `tsc --noEmit`, `eslint` and `vitest run` pass for the touched files; every function in `models/domain/` has a Vitest test; `next build` passes after P6-T02.

## Phase 1 – Tokens, data models, props contracts

### 1.1 Chart tokens
Capacity lines get their own tokens and not the `critical`/`good` tones, because they identify a series and do not judge a value.

| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P1-T01 | Tokens: `--fx-capacity-warehouse`, `--fx-capacity-staging`, `--fx-forecast-shade` | – | app/globals.css | – | 1 | tokens present; `next build` compiles CSS | todo |
| P1-T02 | `capacityColor(kind)` and `forecastShadeColor()` (resolved strings for ECharts, with SSR fallback) | tokens (P1-T01), existing `lib/chart-colors.ts` | lib/chart-colors.ts | P1-T01 | 2 | tsc, eslint pass | todo |

### 1.2 Data models reused from other tabs
The rule is one fact in one place. The controller loads the Overview repository and the demand repository together, and the view-model builders take `(overview, demand)`. The demand mock holds none of the numbers below, so a change in the Overview mock changes this tab too.

| Shared fact | Overview source | Used for | When the Overview mock changes |
|---|---|---|---|
| Receiving lead time, actual points | `OverviewSnapshot.inbound.trend` | "Receiving" line, actual part (range "today") | the line follows |
| Picking / Kitting lead time, actual points | `OverviewSnapshot.picking.trend` | "Picking / Kitting" line, actual part (range "today") | the line follows |
| Warehouse capacity | `OverviewSnapshot.warehouse.total` (pallet locations) | forecast chart, warehouse capacity line | the line follows |
| Staging capacity | `OverviewSnapshot.staging.total` (slots) | forecast chart, staging capacity line | the line follows |
| Process identity | `ProcessKey`, `PROCESS_COLOR`, `processColor` | the 4 lead-time lines; "Staging" uses the `delivery` key for its colour (purple), its label comes from the series | same colours as Overview |
| Tone and format rules | `deltaTone`, `formatDelta`, `formatNumber`, `DeltaIndicator` | demand total "+10%": a rise in requests is `bad` (red) via `deltaTone(deltaPct, "down")`, the same rule Overview uses for load metrics | – |
| Patterns | `overviewRepo`, `useOverviewController`, `overview.vm.ts`, `buildThroughputOption` | repo, controller, builders, option builders | – |

How the two chart facts are joined:
- **Lead time.** For "today", the Receiving and Picking series in the demand data hold only their forecast tail. `resolveLeadTimeSeries` (P1-T07) fills their actual part from the Overview trend (`inbound` → Receiving, `picking` → Picking / Kitting). The Overview trend has 18 half-hour points from 08:00, so the actual part ends at 16:30 and the forecast shading starts there. Picking therefore reads about 18–29 min.
- **Capacity.** The Overview totals are stocks (locations, slots) and the chart shows pallets per day, so `dailyCapacity = total × turnsPerDay` (P1-T10). `WAREHOUSE_TURNS_PER_DAY = 0.095` gives 950 and `STAGING_TURNS_PER_DAY = 8.5` gives 850. These two factors are named constants in `models/domain/capacity.ts`, chosen to keep the chart on a 0–1,200 axis; replace them with the plant's real turnover when known. The lines are flat across the horizon.

| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P1-T07 | `LEAD_TIME_SLOTS` (08:00–22:00, 30 min), `timeLabels`, `resolveLeadTimeSeries(range, series, overview)` (fills Receiving/Picking actual from `OverviewSnapshot` for "today", continues the forecast from the last actual), `forecastStartIndex` | `LeadTimeSeries` (P1-T03), `OverviewSnapshot` (existing) | models/domain/lead-time.ts, lead-time.test.ts | P1-T03 | 2 | tests: the Overview trend reaches the series; changing `inbound.trend` changes the result; other ranges untouched; missing actual gives empty points, no throw | todo |
| P1-T10 | `WAREHOUSE_TURNS_PER_DAY`, `STAGING_TURNS_PER_DAY`, `dailyCapacity(total, turnsPerDay)`, `capacityLines(overview, dayCount)` → `{ warehouse: number[]; staging: number[] }` | `OverviewSnapshot` (existing) | models/domain/capacity.ts, capacity.test.ts | – | 1 | tests: 10,000 → 950 and 100 → 850; changing `warehouse.total` changes the line; length equals `dayCount` | todo |

### 1.3 New data models, specific to this tab
Each data set has its own entity file and domain file. None of them imports `OverviewSnapshot`.

| Data set | Content | Notes |
|---|---|---|
| Product demand | `ProductDemand` (name, requests, icon, optional `priority`), group label, `deltaPct` | Its own data, not the Overview supply total (200 on-time requests). The total is computed from the rows, never stored. Signal-bar colour comes from `priority` (`high` red, `mid` yellow, none blue), because the screenshot colours do not follow the value (O2 Sensor 42 is red, VIC 48 is blue). Text "High priority" goes into `aria-label` and `title`, so colour is not the only signal. |
| Demand forecast | `ForecastDay` (`demand` pallets per day, no capacity), `startDate`, `actualDays` | Overview has no daily demand forecast. Range 7 or 14 days is a slice of 14. |
| Lead-time series | `LeadTimeSeries` per process (`actual?`, `forecast`), ranges today / yesterday / week | Put-away and Staging have no Overview source. Receiving and Picking actual points come from Overview (1.2). Yesterday and week are mock data, because Overview has no history. |

| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P1-T03 | Entities, one file per data set, plus the composed snapshot | `ProcessKey` (existing) | models/types/product-demand.ts (`ProductIconName`, `ProductPriority`, `ProductDemand`, `ProductDemandSnapshot`), models/types/demand-forecast.ts (`ForecastDay`, `DemandForecast`), models/types/lead-time.ts (`LeadTimeRange`, `LeadTimeSeries`), models/types/demand.ts (`DemandSnapshot` composes the three) | – | 1 | tsc passes; product demand imports nothing from `OverviewSnapshot` | todo |
| P1-T04 | `ceilToStep(max, step)` generic axis helper (800 → 1,200 with step 400; empty input safe) | – | models/domain/axis.ts, axis.test.ts | – | 1 | tests pass | todo |
| P1-T05 | `DemandSort`, `sortProducts` (order / desc / asc / name), `totalRequests`, `signalLevel` (1–4 vs the largest value), `productTone` (`high` → critical, `mid` → warning, none → neutral) | `ProductDemand` (P1-T03), `Tone` (existing) | models/domain/product-demand.ts, product-demand.test.ts | P1-T03 | 2 | tests: total 330 for the prototype list, sort modes, level clamp 1–4, no mutation of input | todo |
| P1-T06 | `sliceForecast(forecast, days)`, `dayLabels(startIso, count)` ("10/27"), `forecastAxisMax(demand, capacities)` (uses `ceilToStep`) | `DemandForecast` (P1-T03), `ceilToStep` (P1-T04) | models/domain/forecast.ts, forecast.test.ts | P1-T03, P1-T04 | 2 | tests: 7 and 14 days, month rollover labels, axis max 1,200 for 650 demand and 950 capacity | todo |

### 1.4 Props contracts
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P1-T08 | Common props: `SignalBarsProps` (`level`, `tone`, `label`), `IconProps` (`name: IconName` = `ProductIconName` or a UI icon name, `size?`) | `Tone` (existing), `ProductIconName` (P1-T03) | views/common/signal-bars.props.ts, views/common/icon.props.ts | P1-T03 | 2 | tsc passes | todo |
| P1-T09 | Feature props: `ProductDemandRowProps`, `DemandTotalProps`, `ProductDemandPanelProps` (sort select, rows, total), `DemandForecastChartProps` (demand, warehouse and staging capacity series of equal length), `LeadTimeTrendChartProps` (labels, series, forecast index), `DemandVM`, `DemandActions`, `DemandPageProps` | `ProductIconName` (P1-T03), `Tone`, `ProcessKey`, `FilterOption` (existing) | views/features/demand/*.props.ts (one per component) | P1-T03 | 2 | tsc passes; passing `onSortChange` to the row fails type-check | todo |

## Phase 2 – Common building blocks
Each component gets `<name>.tsx` and `<name>.props.ts` in `views/common/`; tone → style through one `cva` `tone` variant; no hex values.

**One place for icons and SVGs:** every SVG asset and every third-party icon (`lucide-react`) is imported only in `views/common/icon.tsx`; features use `<Icon name="…" />`. P2-T06 moves the 5 existing feature files that import `lucide-react` directly (alert-item, dock-card, handover-panel, putaway-panel, resource-status-card) and P2-T07 adds a lint rule so it stays true. The generated shadcn files in `views/common/ui/` already sit in `views/common` and stay as they are.

| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P2-T01 | `SignalBars` (4 bars, `level` lit, `tone` colour, `aria-label`) | `SignalBarsProps` (P1-T08), tone tokens (existing) | views/common/signal-bars.tsx | P1-T08 | 1 | tsc, eslint pass; unlit bars neutral grey from a token | todo |
| P2-T02 | `Icon` registry, the only file that holds SVG assets and third-party icons: the 6 product icons (valve, solenoid, sensor, gear, housing, egr) as inline SVG ported from prototype lines 377–382 (`stroke="currentColor"`, 24×24), plus the `lucide-react` icons the existing features use (AlertCircle, AlertTriangle, Info, Truck, ArrowRight, ArrowDown, Boxes, Building2, Factory, Package, Warehouse) | `IconProps` (P1-T08) | views/common/icon.tsx | P1-T08 | 1 | tsc, eslint pass; one component, `name` → SVG or lucide component | todo |
| P2-T03 | `buildForecastRegion({ fromIndex, toIndex })`: shaded area, dashed divider and "Forecast" label as ECharts config, shared by both charts | `forecastShadeColor` (P1-T02), `toneColor` (existing) | views/common/charts/build-forecast-region.ts | P1-T02 | 1 | tsc, eslint pass | todo |
| P2-T04 | `buildForecastOption` (demand bars, warehouse and staging capacity as dashed step lines, y-axis "Pallets", forecast region) | props (P1-T09), `capacityColor` (P1-T02), `processColor`, region (P2-T03) | views/common/charts/build-forecast-option.ts | P1-T02, P1-T09, P2-T03 | 2 | tsc, eslint pass | todo |
| P2-T05 | `buildLeadTimeOption` (4 process lines, solid actual, dotted forecast tail, y-axis "Lead Time (min)", forecast region, legend of the 4 names) | props (P1-T09), `processColor`, region (P2-T03) | views/common/charts/build-lead-time-option.ts | P1-T02, P1-T09, P2-T03 | 2 | tsc, eslint pass | todo |
| P2-T06 | Replace direct `lucide-react` imports with `<Icon>` in the 5 existing feature files | `Icon` (P2-T02) | views/features/overview/alert-item.tsx, views/features/warehouse/{dock-card, handover-panel, putaway-panel, resource-status-card}.tsx | P2-T02 | 2 | tsc, eslint, build pass; Overview and Warehouse look the same; no `lucide-react` import outside `views/common/` | todo |
| P2-T07 | ESLint `no-restricted-imports` for `lucide-react` outside `views/common/` (shared file, own task) | P2-T06 | eslint.config.mjs | P2-T06 | 3 | eslint passes; importing lucide in a feature file fails | todo |

## Phase 3 – Shared composite components
None needed. `PanelCard`, `FilterSelect`, `DeltaIndicator` and `EChart` already cover the panels.

## Phase 4 – Specialised components (`views/features/demand/`)
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P4-T01 | `ProductDemandRow` (icon, name, requests, `SignalBars`, `title` text) | props (P1-T09), `Icon` (P2-T02), `SignalBars` (P2-T01) | product-demand-row.tsx | P1-T09, P2-T01, P2-T02 | 1 | tsc, eslint pass | todo |
| P4-T02 | `DemandTotal` (label, total, `DeltaIndicator` with "(vs. yesterday)") | props (P1-T09), `DeltaIndicator` (existing) | demand-total.tsx | P1-T09 | 1 | tsc, eslint pass | todo |
| P4-T04 | `DemandForecastChart` (`PanelCard`, range `FilterSelect`, `EChart`) | props (P1-T09), `buildForecastOption` (P2-T04) | demand-forecast-chart.tsx | P1-T09, P2-T04 | 1 | tsc, eslint pass | todo |
| P4-T05 | `LeadTimeTrendChart` (`PanelCard`, range `FilterSelect`, `EChart`) | props (P1-T09), `buildLeadTimeOption` (P2-T05) | lead-time-trend-chart.tsx | P1-T09, P2-T05 | 1 | tsc, eslint pass | todo |
| P4-T03 | `ProductDemandPanel` (`PanelCard`, sort `FilterSelect`, group subheader, rows, `DemandTotal`, empty state) | props (P1-T09), rows (P4-T01), total (P4-T02) | product-demand-panel.tsx | P4-T01, P4-T02 | 2 | tsc, eslint pass | todo |
| P4-T06 | `DemandPage` grid (panel left, two charts stacked right) | panel (P4-T03), charts (P4-T04, P4-T05), `DemandPageProps` (P1-T09) | demand-page.tsx | P4-T03, P4-T04, P4-T05 | 3 | tsc, eslint pass | todo |

## Phase 5 – Store, services, controller
The forecast range and the lead-time range are local selects kept in `uiStore`, as in the screenshot. Switching them to the header's global time range is a later task.

| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P5-T01 | Extend `uiStore`: `demandSort`, `forecastRange` ("7" \| "14"), `leadTimeRange`, with setters | `DemandSort` (P1-T05), `LeadTimeRange` (P1-T03) | models/stores/ui-store.ts | P1-T03, P1-T05 | 1 | tsc, eslint pass; existing keys unchanged | todo |
| P5-T02 | Mock `DemandSnapshot`: 12 products (prototype list), +10% delta, 14 forecast days (demand only), lead-time series for 3 ranges; "today" Receiving and Picking hold forecast tails only | `DemandSnapshot` (P1-T03) | services/mock/demand.mock.ts | P1-T03 | 1 | tsc passes; no Overview number copied (no capacity values, no Receiving or Picking actual); products sum to 330 | todo |
| P5-T03 | `demandRepo` interface + mock implementation, same shape as `overviewRepo` | mock (P5-T02) | services/repositories/demand.repo.ts | P5-T02 | 2 | tsc, eslint pass | todo |
| P5-T04 | View-model builders: `buildProductDemandVM`, `buildForecastVM(overview, demand, days)`, `buildLeadTimeTrendVM(overview, demand, range)` | domain (P1-T05, P1-T06, P1-T07, P1-T10), props (P1-T09), `OverviewSnapshot` (existing), mock (P5-T02, tests only) | controllers/demand.vm.ts, demand.vm.test.ts | P1-T05, P1-T06, P1-T07, P1-T09, P1-T10, P5-T02 | 2 | tests: total 330 and tone `bad` for "+10%"; sorted rows; 7 vs 14 days; **changing the Overview snapshot changes the Receiving/Picking line and the two capacity lines** | todo |
| P5-T05 | `useDemandController()` → `{ status, vm, actions }`; loads `overviewRepo` and `demandRepo` together, reads and writes `uiStore` | repos (P5-T03, existing `overviewRepo`), store (P5-T01), builders (P5-T04), `DemandVM` (P1-T09) | controllers/demand.controller.ts | P5-T01, P5-T03, P5-T04 | 3 | tsc, eslint pass; error state when either repo fails | todo |

## Phase 6 – Page wiring, docs
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P6-T01 | Client container: calls the controller, renders `DemandPage`, loading and error text like `OverviewSection` | controller (P5-T05), page (P4-T06) | app/dashboard/demand-section.tsx | P4-T06, P5-T05 | 1 | tsc, eslint pass | todo |
| P6-T02 | Wire the tab: add `demand: ReactNode` to the tabs props, replace its "Coming Soon", pass `<DemandSection />` from the page (shared files, one task) | container (P6-T01) | views/features/shell/dashboard-tabs.props.ts, dashboard-tabs.tsx, app/dashboard/page.tsx | P6-T01 | 2 | `next build` passes; Simulation tab still "Coming Soon"; shell imports no feature folder | todo |
| P6-T03 | Update docs: Status rows for the Demand components, `SignalBars`, `Icon`, chart builders in FE-design.md §2.1/§2.2; this file marked done | P6-T02 | docs/FE-design.md | P6-T02 | 3 | statuses match the code | todo |

## Execution plan
Sequential: one task per commit, in wave order within each phase, starting a task only after its dependencies are `done`. Waves show what could run in parallel (no shared Output files within a wave).

| Phase | Wave 1 | Wave 2 | Wave 3 |
|---|---|---|---|
| P1 | T01, T03, T04, T10 | T02, T05, T06, T07, T08, T09 | |
| P2 | T01, T02, T03 | T04, T05, T06 | T07 |
| P3 | – | | |
| P4 | T01, T02, T04, T05 | T03 | T06 |
| P5 | T01, T02 | T03, T04 | T05 |
| P6 | T01 | T02 | T03 |

Cross-phase order: P4-T04 and P4-T05 need P2 wave 2 (T04, T05). P4-T01 needs P2 wave 1. P5-T04 needs P1 wave 2 and P5-T02. P6-T01 needs P4-T06 and P5-T05.

After each phase: run `tsc --noEmit`, `eslint`, `vitest run`, and report the result. Run `next build` after P6-T02.
