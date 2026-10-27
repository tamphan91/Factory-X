# Shared components migration – task plan

Branch: `refactor/migrate-shared-components`, based on `origin/main` (which already contains the Overview refactor, PR #3). Design sources: [FE-design.md](../FE-design.md) §1.3, §2.1, §2.2, §5 and `.claude/rules/frontend-architecture.md`.
All paths are relative to `frontend/`. The commit message of each task starts with its ID.

## Goal
Finish the migration so shared code lives in `views/` and the legacy `components/` folders for `ui`, `charts` and `tabs` go away. This also changes the Warehouse tab, because its components import `ui/*` and `EChart`. It is moved to its own branch and PR for that reason.

## Scope and decisions
- **In scope:** `components/charts/echart.tsx`, `components/ui/*` (8 files), `components/tabs/dashboard-tabs.tsx`, every import of them (Overview, Warehouse, header, page), `components.json` aliases, and the Status rows in the docs.
- **Out of scope:** `components/header`, `components/footer` and `components/warehouse/*` keep their folders. Only their import lines change. Their own migration to `views/features/shell/` and `views/features/warehouse/` is a later task.
- **Pure moves:** files are moved with `git mv` so history follows. No visual or behavioural change, except where a task says so.
- **Import updates belong to the move that breaks them.** A commit that moves a file also updates every importer, including the Warehouse files, so each commit compiles. The Warehouse import edits are therefore listed as outputs of P1-T01 and P1-T02 and not as a separate task.
- **`DashboardTabs` gets content through props** (`overview`, `warehouse` as `ReactNode`). A shell view must not import from `app/` or from another page's feature folder. `app/dashboard/page.tsx` composes the tabs and the page contents.
- **Hex colours in `dashboard-tabs.tsx`** (`bg-[#081c4b]`) stay as they are. Moving them to tokens is a separate task.
- **Done means:** `tsc --noEmit`, `vitest run` and `next build` pass. `eslint` shows no new problems (2 errors and 2 warnings exist on main).

## Phase 1 – Move shared building blocks
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P1-T01 | Move `EChart` to `views/common/echart.tsx` and add `echart.props.ts` (`EChartProps`); update every importer | components/charts/echart.tsx | views/common/echart.tsx, views/common/echart.props.ts; imports edited in views/common/donut-gauge.tsx, views/common/sparkline.tsx, views/features/overview/throughput-vertical-card.tsx, components/warehouse/top-queue-chart.tsx; components/charts/ removed | – | 1 | tsc, eslint, build pass; `components/charts` does not exist; no `@/components/charts` import left | done |
| P1-T02 | Move `components/ui/*` to `views/common/ui/` and point the shadcn aliases at the new path; update every importer | components/ui/*.tsx (8 files) | views/common/ui/*.tsx; components.json (`ui`, `components` aliases); imports edited in views/common (filter-select, kpi-card-shell, panel-card), views/features/overview/alerts-panel.tsx, components/header/dashboard-header.tsx, components/tabs/dashboard-tabs.tsx, components/warehouse/{resource-status-card, top-queue-chart, zone-performance-table}.tsx; components/ui/ removed | – | 1 | tsc, eslint, build pass; `components/ui` does not exist; no `@/components/ui` import left; components.json has no `components/ui` | done |

## Phase 2 – Shell
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P2-T01 | Move `DashboardTabs` to `views/features/shell/dashboard-tabs.tsx` with `dashboard-tabs.props.ts`; the page passes the Overview and Warehouse content in | components/tabs/dashboard-tabs.tsx, `Tabs` (P1-T02), `OverviewSection`, `WarehouseOperationsPage` | views/features/shell/dashboard-tabs.tsx, .props.ts; app/dashboard/page.tsx edited; components/tabs/ removed | P1-T02 | 1 | tsc, eslint, build pass; no `app/` or `features/` import inside the shell view; tabs look and switch the same | done |
| P2-T02 | Move `WarehouseOperationsPage` to `views/features/warehouse/warehouse-operations-page.tsx`; update the page import. It takes no props, so it gets no `.props.ts`. Its imports of `components/warehouse/*` stay until those components move | features/ware-house/warehouse-operations-page.tsx | views/features/warehouse/warehouse-operations-page.tsx; app/dashboard/page.tsx edited; features/ware-house/ removed | P2-T01 | 1 | tsc, eslint, build pass; `features/` does not exist; Warehouse tab renders the same | done |

## Phase 3 – Docs
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P3-T01 | Update docs: Status rows for `EChart`, shadcn primitives and `DashboardTabs`; layout notes in `.claude/rules` and `FE-design.md` §5 that no longer match | P1-T01, P1-T02, P2-T01 | docs/FE-design.md, .claude/rules/frontend-architecture.md | P1-T01, P1-T02, P2-T01 | 1 | statuses match the code; this file marked done | done |

## Phase 4 – Remove the remaining legacy folders
Pure moves again. Components that take no props get no `.props.ts` (as in P2-T02). Components that declare a props interface get it extracted to `<name>.props.ts`. Each commit also updates its importers, so it compiles on its own. Warehouse and header markup, classes and hex colours are not changed.

| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P4-T01 | Delete `types/`: `ChartOption` is only an alias of `EChartsOption`, so importers use `EChartsOption` from `echarts`; `types/dashboard.ts` is empty | types/echarts.d.ts, types/dashboard.ts | imports edited in views/common/donut-gauge.tsx, views/common/sparkline.tsx, views/common/charts/build-throughput-option.ts, components/warehouse/top-queue-chart.tsx; types/ removed | P1-T01 | 1 | tsc, eslint, build pass; no `@/types` import left; `types/` does not exist | done |
| P4-T02 | Move the header to `views/features/shell/` (`dashboard-header.tsx`, `logout-button.tsx`); update the page import | components/header/* | views/features/shell/dashboard-header.tsx, logout-button.tsx; app/dashboard/page.tsx edited; components/header/ removed | P4-T01 | 1 | tsc, eslint, build pass; header renders and the logout button imports resolve | done |
| P4-T03 | Move the footer to `views/features/shell/dashboard-footer.tsx`; update the page import | components/footer/dashboard-footer.tsx | views/features/shell/dashboard-footer.tsx; app/dashboard/page.tsx edited; components/footer/ removed | P4-T02 | 2 | tsc, eslint, build pass | done |
| P4-T04 | Move the layout map and its parts to `views/features/warehouse/`: `warehouse-layout-map`, the six stage panels, `dock-card`, `zone-card`; extract `dock-card.props.ts` and `zone-card.props.ts`; update the page import | components/warehouse/{warehouse-layout-map, receiving-panel, putaway-panel, storage-panel, picking-panel, staging-panel, handover-panel, dock-card, zone-card}.tsx | the same files in views/features/warehouse/, dock-card.props.ts, zone-card.props.ts; views/features/warehouse/warehouse-operations-page.tsx edited | P2-T02 | 1 | tsc, eslint, build pass; relative imports between the moved files still resolve | done |
| P4-T05 | Move the remaining Warehouse cards: `resource-status-card`, `zone-performance-table`, `top-queue-chart`; the page imports them by relative path | components/warehouse/{resource-status-card, zone-performance-table, top-queue-chart}.tsx | the same files in views/features/warehouse/; warehouse-operations-page.tsx edited; components/warehouse/ removed | P4-T01, P4-T04 | 2 | tsc, eslint, build pass; `components/` is empty | done |
| P4-T06 | Remove the empty `components/` folder and update the docs and rules that still point at the old folders | P4-T02, P4-T03, P4-T05 | docs/FE-design.md (Status rows, §5), .claude/rules/frontend-architecture.md; components/ removed | P4-T02, P4-T03, P4-T05 | 3 | `components/`, `features/` and `types/` do not exist; no `@/components`, `@/features` or `@/types` import left; statuses match the code | done |

Verification after the last task, since this phase touches every Warehouse and shell file: `tsc --noEmit`, `eslint` (no new problems), `vitest run`, `next build`, and a smoke test of the built app (`next start`, `/login` returns 200). `/dashboard` needs a login, so the page is checked by the build and by the compile-time import check.

## Execution plan
Sequential, one commit per task. `P1-T01` and `P1-T02` touch different files, but both edit `components/warehouse/top-queue-chart.tsx` (`EChart` and `Card` imports), so they run one after the other.

| Phase | Wave 1 |
|---|---|
| P1 | T01, then T02 |
| P2 | T01, then T02 |
| P3 | T01 |
| P4 | T01, T02, T04 (run one after another: T02 and T04 both edit the page imports) |

Phase 4 runs T01 → T02 → T03 → T04 → T05 → T06; T03 needs T02 and T05 needs T04, and the single order avoids merge conflicts in `app/dashboard/page.tsx`.

After each task: `tsc --noEmit`, `vitest run`, and `next build` once at the end of each phase.
