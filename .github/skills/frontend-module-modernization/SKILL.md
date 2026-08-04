---
name: frontend-module-modernization
description: "Modernize a React JSX + Tailwind module incrementally and safely while preserving behavior, routes, permissions, contexts, and API contracts. Use for gradual UX, reuse, responsive, and accessibility improvements without full rewrites."
argument-hint: "Target module path, desired objective, and constraints (no API changes, no business-logic changes, etc.)"
user-invocable: true
---

# Frontend Module Modernization

Use this skill to modernize one module at a time with low regression risk.

## Preconditions
- Scope is explicit (single module, page, or bounded folder).
- Functional parity is mandatory.
- No backend/API contract changes unless explicitly approved.

## Workflow
1. Analyze the target module structure.
2. Identify routes, dependencies, services, contexts, and permissions impacted.
3. Identify existing reusable UI components that should be reused first.
4. Propose a small incremental plan.
5. Explain intended changes before applying them.
6. Implement in small slices while preserving behavior.
7. Keep business rules and API contracts unchanged.
8. Extract components only when there is a clear maintainability or reuse gain.
9. Improve visual consistency, responsive behavior, and accessibility progressively.
10. Validate changes with build and lint baseline-aware review.
11. Deliver a clear implementation report.

## Guardrails
- No full-module rewrites in a single pass.
- No mass migration away from Tailwind.
- No introduction of new UI framework dependencies.
- No broad architecture changes without explicit approval.
- No deletion of duplicate components before reference mapping and migration plan.

## Expected Output
- Brief analysis summary.
- Planned changes and risk notes before edits.
- Files modified and why.
- Build and lint validation results.
- Residual risks and next incremental steps.

## Reference
- Incremental playbook: ./references/playbook.md
