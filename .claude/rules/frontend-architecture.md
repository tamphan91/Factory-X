---
paths:
  - "frontend/**"
---

# Frontend architecture (from docs/FE-design.md)

## Layers
Dependencies go one way: `View → Control → (Model, Service)`. `app` may import `views` and `controllers`. `models` imports nothing above it.

| Layer | Folder | Does | Never does |
|---|---|---|---|
| View | `views/common/`, `views/features/<page>/` | Takes props, emits events | fetch, read stores, compute KPIs or thresholds, import `controllers/` |
| Control | `controllers/` | `useXxxController()` returns `{ vm, status, actions }` | JSX, domain formulas |
| Model | `models/types`, `models/domain`, `models/stores` | Pure rules, Zustand slices | React UI, HTTP |
| Service | `services/` | URLs, DTOs, mappers, repositories (mock and http behind one interface) | UI state |

## State
- Server data: TanStack Query.
- Shared UI state: Zustand.
- Local UI state (dialog open, hover): `useState`.

## Files
- Shared components go in `views/common/`. Page-specific components go in `views/features/<page>/`.
- Each component has `<name>.tsx` and `<name>.props.ts` in the same folder.
- Mark `"use client"` only at feature boundaries. Pages stay Server Components.

## Styling
- Define colours as tokens in `app/globals.css`. Never write a hex colour in a component.
- Decide a value's `Tone` in `models/domain/`. The controller puts it in the view-model. The component maps it to a style through one `cva` `tone` variant.
- Never use colour as the only signal. Add an icon or text.
- Use one component with a `variant` or `orientation` prop instead of near-duplicate components.
