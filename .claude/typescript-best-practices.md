# TypeScript Best Practices

Rules for generating TypeScript. Source: andredesousa/typescript-best-practices. Match existing project conventions first; where rules conflict, prefer readability.

## Compiler & Types
- Enable `strict`, `noImplicitReturns`, `noUnusedLocals`, `forceConsistentCasingInFileNames`.
- No `any`. Type all params, returns, and public values (use `unknown` + narrowing if the type is truly unknown).
- Use literal unions for fixed sets: `type Size = 'small' | 'large'`, not `string`.
- Use utility types (`Partial`, `Readonly`, `Pick`, `Omit`) instead of duplicating interfaces.

## Naming
- Names state purpose: `isLegalDrinkingAge`, not `x1`.
- Booleans start with `is`/`has`/`can`.
- No magic numbers: `const MAX_RETRIES = 3`.

## Syntax
- `const` by default, `let` only when reassigned, never `var`.
- `===` / `!==` only.
- Literals over constructors: `{}`, `[]`, `''`.
- Always use braces and semicolons.
- Default params: `(n: number = 25)`.
- Destructuring and spread over manual copying/indexing.
- Template literals over string concatenation.
- `switch` ends with `default`.
- Declare and initialize variables at the top of their scope.

## Functions & Structure
- One job per function; keep short (~5–10 lines); extract helpers.
- ≤ 2 params (max 3); group extras into an object.
- No boolean flag params; split into separate functions.
- Early returns over deep nesting.
- Prefer pure functions; isolate side effects and I/O.
- Avoid globals; keep state in modules.
- Put changeable values in a central config.
- Sort imports; remove unused ones.
- Comment only the "why"; delete commented-out code.

## Data & Immutability
- Don't mutate inputs; return new values, use `readonly`.
- Prefer `map`/`filter`/`reduce` over imperative loops (plain `for` only for hot paths).
- Use iterators/generators for lazy sequences.
- Validate all external input (URL, forms, API, DOM), including server-side.

## Errors & Async
- Throw `Error` objects, never strings or plain objects.
- `async`/`await` over callbacks and raw `.then` chains.
- Don't use `eval`, `with`, string timers, `void`, native prototype changes.

## Process
- Enforce style with linter + formatter; follow the team style guide.
- Write tests for every new feature or module.

## Browser/Performance (web projects)
- Minimize and batch DOM access; load scripts last or with `defer`.
- Lazy-load and code-split; minify; serve Gzip/Brotli.
- Use Web Workers for heavy computation; audit with Lighthouse.
- Use web standards; progressive enhancement (real links/forms).
