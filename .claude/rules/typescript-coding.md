---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript coding

- Follow `.claude/typescript-best-practices.md`. Code snippets in the docs are illustrative; where they differ in style, best-practices wins.
- Ignore its Browser/Performance section where Next.js already covers it. Lazy-load ECharts with `next/dynamic`.
- Write a Vitest unit test for every function in `models/domain/`.
- Add no dependency outside the list in FE-design.md §4 without asking the user.
- A change is done only when `tsc --noEmit`, `eslint` and the tests pass for the touched code.
