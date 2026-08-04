---
description: "Use when creating or editing React modules in this repo. Enforces JSX-only architecture, incremental refactors, and compatibility with existing routes, permissions, contexts, and APIs."
name: "React Architecture"
applyTo:
  - "src/**/*.jsx"
  - "src/**/*.js"
---
# React Architecture Rules

- Keep React with JavaScript and JSX files.
- Do not introduce TypeScript migration steps.
- Use functional components and hooks.
- Keep components focused on one responsibility when feasible.
- Avoid monolithic components that mix all concerns in one block.

## Incremental Refactor Policy
- Do not rewrite full modules in one task.
- Split large components gradually, only when there is clear reuse or maintainability benefit.
- Preserve behavior and existing business rules.
- Do not remove or rename modules without checking references.

## Existing Architecture Compatibility
- Keep current route behavior and protected-route flow intact.
- Keep current permission and context usage compatible.
- Do not change backend contracts or endpoint behavior.
- Before modifying module boundaries, review imports and call sites.

## Reuse First
- Before adding new UI components, check src/components/ui and src/components/common.
- Reuse existing abstractions when they already cover the use case.
- Avoid creating generic abstractions without a real repeated need.
