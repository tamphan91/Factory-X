# Overview tab refactor – task plan

Branch: `refactor/overview-tab`. Design sources: [FE-design.md](../FE-design.md) §2.1–2.5, [FE_GaugeKpiCard.md](../FE_GaugeKpiCard.md), [FE_LeadTimeKpiCard.md](../FE_LeadTimeKpiCard.md), [FE_ThroughputCard.md](../FE_ThroughputCard.md), [FE_AlertModel.md](../FE_AlertModel.md).
All paths are relative to `frontend/`. The commit message of each task starts with its ID, e.g. `P1-T02: add Tone and threshold rules`.

## Scope and decisions
- **In scope:** the 8 Overview components (3 gauge cards, 2 lead-time cards, 2 throughput cards, alerts panel) and the page that composes them, moved to the MVC layout (`views/`, `controllers/`, `models/`, `services/`).
- **Out of scope (later tasks):** TanStack Query and an HTTP repository (the repository returns mock data only), route segments (`/overview`), header/tabs/footer, the Warehouse tab.
- **Stays where it is:** `components/ui/*` (shadcn, also used by the Warehouse tab) and `components/charts/echart.tsx` (also used by `components/warehouse/top-queue-chart.tsx`). Moving them touches another tab; propose it as a separate task after this refactor.
- **New dependencies** (both on the approved list, FE-design.md §4): `vitest`, `zustand`. `@testing-library/*` and `jsdom` are not needed because only pure functions are tested.
- **Visible changes** that come from the design docs: alert rows follow their severity colour (today all are red); staging, zone and material-delivery alerts become `critical`, AGV offline `warning` (FE_AlertModel.md §3.1); the "Target" option is renamed "Actual vs Target"; the inbound process gets one blue (`#2f7cf6` replaces `#3b82f6` / `#3478f6`).
- **Layering note:** `CurrentNotice` is declared in `models/types/overview.ts`, not in `gauge-kpi-card.props.ts` as the doc shows, because `models/` must not import `views/`. The props file re-exports it.
- **Done means:** `tsc --noEmit`, `eslint` and `vitest run` pass for the touched files. Every function in `models/domain/` has a Vitest test.
- **node_modules is not installed** in `frontend/`; P0-T01 runs `npm install` first.

## Phase 0 – Tooling
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P0-T01 | Add `vitest` and `zustand`, a `test` script and an `@/` alias for tests | – | package.json, package-lock.json, vitest.config.ts | – | 1 | `npm test` runs with 0 tests, `tsc` passes | todo |

## Phase 1 – Tokens, types, props contracts, domain
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P1-T01 | Dashboard colour tokens: tone (`--fx-success`, `--fx-caution`, `--fx-danger`, `--fx-info`, `--fx-slate`, `--fx-ink`, `--fx-primary`) and `--fx-process-*`, mapped in `@theme inline` | – | app/globals.css | P0-T01 | 1 | tokens present; CSS compiles in `next build` | todo |
| P1-T02 | `Tone` type, `thresholdRule`, `deltaTone`, `targetTone` | – | models/domain/tone.ts, tone.test.ts | P0-T01 | 1 | tests cover each direction; NaN → `unavailable` | todo |
| P1-T03 | `ProcessKey` and `PROCESS_COLOR` (CSS variables) | – | models/domain/process.ts | P0-T01 | 1 | tsc passes | todo |
| P1-T04 | `toneColor` / `processColor` (resolved colour string for ECharts) | `Tone` (P1-T02), `ProcessKey` (P1-T03), tokens (P1-T01) | lib/chart-colors.ts | P1-T01, P1-T02, P1-T03 | 2 | tsc, eslint pass | todo |
| P1-T05 | `SUPPLY_ONTIME_RULE`, `OCCUPANCY_RULE`, `STAGING_RULE`, `WAREHOUSE_RULE`, `OVERDUE_RULE` | `thresholdRule` (P1-T02) | models/domain/thresholds.ts, thresholds.test.ts | P1-T02 | 2 | doc examples hold: 96 % → warning, 68 % → good, 8 overdue → critical | todo |
| P1-T06 | Alert entity types | – | models/types/alert.ts | P0-T01 | 1 | tsc passes | todo |
| P1-T07 | `ThroughputItem` entity | `ProcessKey` (P1-T03) | models/types/throughput.ts | P1-T03 | 2 | tsc passes | todo |
| P1-T08 | Overview snapshot types: `CurrentNotice`, `GaugeSnapshot`, `LeadTimeSnapshot`, `OverviewSnapshot` | `AlertItem` (P1-T06), `ThroughputItem` (P1-T07), `ProcessKey` (P1-T03), `Tone` (P1-T02) | models/types/overview.ts | P1-T02, P1-T03, P1-T06, P1-T07 | 3 | tsc passes | todo |
| P1-T09 | `percentOf`, `formatDelta`, `formatNumber` | – | models/domain/kpi.ts, kpi.test.ts | P0-T01 | 1 | 192/200 → 96; zero total is safe; tests pass | todo |
| P1-T10 | `barPercent`, `axisMax`, headroom constants | `ThroughputItem` (P1-T07) | models/domain/throughput.ts, throughput.test.ts | P0-T01, P1-T07 | 3 | empty and all-zero input tested | todo |
| P1-T11 | `formatAlertDetail` (with `assertNever`), `sortAlerts`, `countAlerts`, `filterAlerts`, `selectAlertByKind`, `noticeFromAlert` | alert types (P1-T06), `CurrentNotice` (P1-T08), `Tone` (P1-T02) | models/domain/alert.ts, alert.test.ts | P1-T02, P1-T06, P1-T08 | 4 | six detail lines match FE_AlertModel.md §3.1; no alert → `0 Overdue`, tone `good` | todo |
| P1-T12 | `GaugeKpiBaseProps` contract | `Tone` (P1-T02), `CurrentNotice` (P1-T08) | views/common/gauge-kpi-card.props.ts | P1-T02, P1-T08 | 4 | tsc passes | todo |
| P1-T13 | `LeadTimeKpiCardProps` contract | `Tone` (P1-T02), `ProcessKey` (P1-T03) | views/common/lead-time-kpi-card.props.ts | P1-T02, P1-T03 | 2 | tsc passes | todo |
| P1-T14 | `ThroughputCardProps` union (`orientation`) and `ThroughputItemVM` | `ThroughputItem` (P1-T07) | views/features/overview/throughput-card.props.ts | P1-T07 | 3 | passing `mode` to the horizontal card fails type-check | todo |
| P1-T15 | `AlertItemProps` contract | `AlertSeverity` (P1-T06) | views/features/overview/alert-item.props.ts | P1-T06 | 2 | tsc passes | todo |
| P1-T16 | `AlertsPanelProps` contract | `AlertItemProps` (P1-T15), `AlertSeverity` (P1-T06) | views/features/overview/alerts-panel.props.ts | P1-T06, P1-T15 | 3 | tsc passes | todo |

## Phase 2 – Common primitives and building blocks
Each task creates `<name>.tsx` and `<name>.props.ts` in `views/common/`. Tone → style goes through one `cva` `tone` variant. No hex values.

| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P2-T01 | `DeltaIndicator` (arrow + text + caption, `tone`) | `Tone` (P1-T02), tokens (P1-T01) | views/common/delta-indicator.tsx, .props.ts | P1-T01, P1-T02 | 1 | tsc, eslint pass; arrow shown as well as colour | todo |
| P2-T02 | `ProgressBar` (`appearance: {tone} \| {process}`) | `Tone`, `ProcessKey`, tokens | views/common/progress-bar.tsx, .props.ts | P1-T01, P1-T02, P1-T03 | 1 | tsc, eslint pass | todo |
| P2-T03 | `KpiCardShell` with optional `title` (moved from `components/dashboard/`) | – | views/common/kpi-card-shell.tsx, .props.ts | P0-T01 | 1 | tsc, eslint pass | todo |
| P2-T04 | `PanelCard` (title, subtitle, actions, children) | – | views/common/panel-card.tsx, .props.ts | P0-T01 | 1 | tsc, eslint pass | todo |
| P2-T05 | `FilterSelect` (labelled, controlled `Select`) | `components/ui/select` | views/common/filter-select.tsx, .props.ts | P0-T01 | 1 | tsc, eslint pass | todo |
| P2-T06 | `DonutGauge` (`percent`, `appearance`), replaces `GaugeChart` | `toneColor`, `processColor` (P1-T04) | views/common/donut-gauge.tsx, .props.ts | P1-T04 | 1 | tsc, eslint pass | todo |
| P2-T07 | `Sparkline` takes `process: ProcessKey` instead of `color` | `processColor` (P1-T04) | views/common/sparkline.tsx, .props.ts | P1-T04 | 1 | tsc, eslint pass | todo |
| P2-T08 | `buildThroughputOption` (columns, optional target series, `axisMax`) | `ThroughputItemVM` (P1-T14), `processColor` (P1-T04) | views/common/charts/build-throughput-option.ts | P1-T04, P1-T14 | 1 | tsc, eslint pass | todo |

## Phase 3 – Shared composite components
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P3-T01 | `GaugeKpiCard` | `GaugeKpiBaseProps` (P1-T12), `KpiCardShell` (P2-T03), `DonutGauge` (P2-T06), `DeltaIndicator` (P2-T01) | views/common/gauge-kpi-card.tsx | P1-T12, P2-T01, P2-T03, P2-T06 | 1 | tsc, eslint pass | todo |
| P3-T02 | `LeadTimeKpiCard` | `LeadTimeKpiCardProps` (P1-T13), `KpiCardShell` (P2-T03), `Sparkline` (P2-T07), `DeltaIndicator` (P2-T01) | views/common/lead-time-kpi-card.tsx | P1-T13, P2-T01, P2-T03, P2-T07 | 1 | tsc, eslint pass; "No data" for empty trend | todo |

## Phase 4 – Specialised components (`views/features/overview/`)
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P4-T01 | `SupplyRateCard` wrapper | `GaugeKpiCard` (P3-T01) | supply-rate-card.tsx, .props.ts | P3-T01 | 1 | tsc, eslint pass | todo |
| P4-T02 | `StagingCard` wrapper | `GaugeKpiCard` (P3-T01) | staging-card.tsx, .props.ts | P3-T01 | 1 | tsc, eslint pass | todo |
| P4-T03 | `WarehouseCard` wrapper | `GaugeKpiCard` (P3-T01) | warehouse-card.tsx, .props.ts | P3-T01 | 1 | tsc, eslint pass | todo |
| P4-T04 | `ThroughputHorizontalCard` | props (P1-T14), `KpiCardShell` (P2-T03), `ProgressBar` (P2-T02) | throughput-horizontal-card.tsx | P1-T14, P2-T02, P2-T03 | 1 | tsc, eslint pass | todo |
| P4-T05 | `ThroughputVerticalCard` | props (P1-T14), `PanelCard` (P2-T04), `FilterSelect` (P2-T05), `buildThroughputOption` (P2-T08) | throughput-vertical-card.tsx | P1-T14, P2-T04, P2-T05, P2-T08 | 1 | tsc, eslint pass | todo |
| P4-T06 | `ThroughputCard` entry function | both cards (P4-T04, P4-T05) | throughput-card.tsx | P4-T04, P4-T05 | 2 | tsc, eslint pass | todo |
| P4-T07 | `AlertItem` row styled by severity | `AlertItemProps` (P1-T15), tokens (P1-T01) | alert-item.tsx | P1-T01, P1-T15 | 1 | tsc, eslint pass; icon differs per severity | todo |
| P4-T08 | `AlertsPanel` (header count, filter, list, empty state) | `AlertsPanelProps` (P1-T16), `AlertItem` (P4-T07), `PanelCard` (P2-T04), `FilterSelect` (P2-T05) | alerts-panel.tsx | P1-T16, P2-T04, P2-T05, P4-T07 | 2 | tsc, eslint pass | todo |

## Phase 5 – Store, services, controller
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P5-T01 | `uiStore` (Zustand): `alertFilter`, `throughputMode` | `AlertSeverity` (P1-T06) | models/stores/ui-store.ts | P0-T01, P1-T06 | 1 | tsc, eslint pass | todo |
| P5-T02 | Mock `OverviewSnapshot` (today's numbers + the six alerts of FE_AlertModel.md §3.1) | `OverviewSnapshot` (P1-T08) | services/mock/overview.mock.ts | P1-T08 | 1 | tsc passes; every number exists once | todo |
| P5-T03 | `overviewRepo` interface + mock implementation | mock (P5-T02) | services/repositories/overview.repo.ts | P5-T02 | 2 | tsc, eslint pass | todo |
| P5-T04 | View-model builders: gauge ×3, lead-time ×2, throughput, alerts | domain (P1-T02/05/09/10/11), props (P1-T12–T16, P4-T01–T03), snapshot (P1-T08) | controllers/overview.vm.ts, overview.vm.test.ts | P1-T05, P1-T09, P1-T10, P1-T11, P1-T12, P1-T13, P1-T14, P1-T16, P4-T01, P4-T02, P4-T03 | 1 | builder tests: supply 96 % / warning, overdue 8 / critical, bar widths computed | todo |
| P5-T05 | `useOverviewController()` → `{ vm, actions }` | repo (P5-T03), store (P5-T01), builders (P5-T04) | controllers/overview.controller.ts | P5-T01, P5-T03, P5-T04 | 3 | tsc, eslint pass | todo |

## Phase 6 – Page wiring and cleanup
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P6-T01 | `OverviewPage` grid composition taking `vm` + `actions` props | Phase 3–4 components, vm types (P5-T04) | views/features/overview/overview-page.tsx, .props.ts | P3-T02, P4-T01–T08, P5-T04 | 1 | tsc, eslint pass | todo |
| P6-T02 | Client container that calls the controller and renders `OverviewPage` | controller (P5-T05), page (P6-T01) | app/dashboard/overview-section.tsx | P5-T05, P6-T01 | 2 | tsc, eslint pass | todo |
| P6-T03 | `DashboardTabs` renders the container instead of the old page | container (P6-T02) | components/tabs/dashboard-tabs.tsx | P6-T02 | 3 | `next build` passes; Overview renders with the same layout | todo |
| P6-T04 | Delete replaced files: `components/overview/*`, `features/overview/*`, `components/dashboard/*`, `components/charts/sparkline.tsx` | – | deletions | P6-T03 | 4 | no remaining imports; tsc, eslint, build pass | todo |
| P6-T05 | Update the Status column of FE-design.md §2.1/§2.2 | – | docs/FE-design.md | P6-T04 | 5 | statuses match the code | todo |

## Execution plan
Sequential: one task per commit, in wave order within each phase, starting a task only after its dependencies are `done`. Waves show what could run in parallel.

| Phase | Wave 1 | Wave 2 | Wave 3 | Wave 4 | Wave 5 |
|---|---|---|---|---|---|
| P0 | T01 | | | | |
| P1 | T01, T02, T03, T06, T09 | T04, T05, T07, T13, T15 | T08, T10, T14, T16 | T11, T12 | |
| P2 | T01–T08 | | | | |
| P3 | T01, T02 | | | | |
| P4 | T01–T05, T07 | T06, T08 | | | |
| P5 | T01, T02 | T03 | T05 | | |
| P5 (cont.) | T04 runs after P4 wave 1 (it needs the wrapper props types); T05 after T04 | | | | |
| P6 | T01 | T02 | T03 | T04 | T05 |

After each phase: run `tsc --noEmit`, `eslint`, `vitest run`, and report the result.
