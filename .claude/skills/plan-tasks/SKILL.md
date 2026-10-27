---
name: plan-tasks
description: Write a phased task plan with inputs, outputs and dependencies before coding any FactoryX frontend feature, then execute it in sequence or in parallel. Use at the start of every implementation request.
---

# Plan tasks, then execute

## 1. Plan
Write `docs/tasks/<feature>-tasks.md`. Show it to the user. Do not code until the user approves.

### Task
- One purpose per task. If the purpose needs "and", split it.
- ID: `P<phase>-T<nn>`, for example `P2-T03`. Never reuse or renumber an ID.
- Fields:
  - **Inputs:** files or exports the task uses, each with the ID of the task that produces it.
  - **Outputs:** files the task creates or edits, and the exports it provides. Only this task edits them.
  - **Depends on:** the IDs of the tasks that produce its Inputs. Nothing else.
  - **Wave:** see below.
  - **Done when:** the check that proves it is finished, for example "tsc and eslint pass, `zone.test.ts` passes".
  - **Status:** `todo`, `in-progress` or `done`.

### Phases
Order phases by dependency:
1. Tokens, types, `*.props.ts` contracts, domain functions and their tests.
2. Common primitives and building blocks, all together.
3. Shared composite components.
4. Specialized components. Put components with the same parent or similar props together. Put components of the same tab together.
5. Controllers, stores, services.
6. Page and route wiring.

### Parallel rules
- Create contracts first (types, props files, domain signatures, token names). Later tasks code against them and need no implementation.
- Edit shared files in one integration task only. Shared files: `globals.css`, `package.json`, barrel/index files, route registries, the stores index.
- Wave: within a phase, wave 1 holds tasks with no unfinished dependency. Wave 2 holds tasks that depend on wave 1, and so on.
- Tasks in the same wave run in parallel. This is safe only if they have no dependency on each other and no shared Output file.

### Format
```md
## Phase 2 – Common building blocks
| ID | Purpose | Inputs (from) | Outputs | Depends on | Wave | Done when | Status |
|---|---|---|---|---|---|---|---|
| P2-T01 | `ProgressBar` with `tone` variant | `Tone` (P1-T02) | views/common/progress-bar.tsx, progress-bar.props.ts | P1-T02 | 1 | tsc, eslint pass | todo |
```
End the file with an **Execution plan**: for each phase, list the waves and the tasks in each.

## 2. Execute
Always: put the task ID in commit messages. Put new work found along the way in a new task with a new ID. Never add it silently.

**Sequential:** run one task at a time. Start a task only when all its dependencies are `done`.

**Parallel:** run one wave at a time.
1. Start one `typescript-developer` agent per task in the wave, all in one batch. Give each agent its own task row and the docs and contract files it names. Use `isolation: "worktree"` when tasks touch nearby folders.
2. Each agent sets its task to `done` only when its "Done when" check passes.
3. When all agents in the wave have reported, merge their results. Run `tsc --noEmit`, `eslint` and the tests on the whole wave. Fix failures before starting the next wave.
4. After the last wave of a phase, report the phase result to the user.
