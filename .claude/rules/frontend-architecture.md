---
paths:
  - "frontend/**"
---

# Frontend architecture (from docs/FE-design.md)

## Layers
Imports go one way: `app → views, controllers`; `controllers → models, services, view props types`; `views → views/common, props files, models/domain/tone`; `models` imports nothing above it and never imports services; `services` never import stores. Data flows View → Control → (Model, Service); imports do not.

| Layer | Folder | Does | Never does |
|---|---|---|---|
| View | `views/common/`, `views/features/<page>/` | Takes display-ready props (view-models, never DTOs), emits events | fetch, read stores, compute KPIs, percents, tones or thresholds, import `controllers/` |
| Control | `controllers/` | `useXxxController()` returns `{ vm, status, actions }`; `*.vm.ts` builds the view-models by calling `models/domain/` | JSX, domain formulas |
| Model | `models/types`, `models/domain`, `models/stores` | Pure rules, Zustand slices | React UI, HTTP |
| Service | `services/` | URLs, DTOs, mappers (DTO → domain), repositories that return domain objects (mock and http behind one interface, chosen by `NEXT_PUBLIC_DATA_SOURCE`) | UI state |

## State
- Server data: TanStack Query. Query keys include the time range.
- Shared UI state and local filters (alert level, throughput mode): Zustand.
- Ephemeral UI state (dialog open, hover): `useState`, kept in the controller hook.

## Files
- Shared components go in `views/common/`. Page-specific components go in `views/features/<page>/`.
- Each component has `<name>.tsx` and `<name>.props.ts` in the same folder. Exception: `views/common/ui/` (shadcn, generated).
- Props types live only in `.props.ts`. `*.vm.ts` holds builder functions and imports those types. Domain entities live in `models/types/`.
- ECharts option builders go in `views/common/charts/`.
- Mark `"use client"` only at feature boundaries. Pages stay Server Components.
- The "current" columns in the docs describe the old `components/`, `features/` and `types/` folders. `ui/*`, `EChart` and `DashboardTabs` have already moved to `views/`; `components/header`, `components/footer`, `components/warehouse` and `features/ware-house` are still waiting to move. Put new code in the layout above.

## Styling
- Define colours as tokens in `app/globals.css`. Never write a hex colour in a component or an ECharts option. In ECharts use `toneColor` or `processColor` from `lib/chart-colors.ts`.
- Decide a value's `Tone` in `models/domain/`. The controller puts it in the view-model. The component maps it to a style through one `cva` `tone` variant. This applies to status components (delta, gauge ring, zone tile, alert, table cell).
- Identity-coloured components (sparkline, throughput bars and columns) take a `ProcessKey` and never a `Tone`. `ProgressBar` and `DonutGauge` take `appearance: { tone } | { process }`.
- Never use colour as the only signal. Add an icon or text.
- Use one component with a `variant` or `orientation` prop instead of near-duplicate components.
- Keep thresholds only in `models/domain/thresholds.ts`.

## Data
- One fact lives in one place. A number shown on two cards comes from one source, and a percent is computed from its stats, never passed in.

## Docs
- When a task changes a component, update its Status column in FE-design.md §2.2.
