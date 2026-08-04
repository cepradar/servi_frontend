---
name: frontend-audit
description: "Audit a frontend page, component, or module before refactoring. Use for React JSX + Tailwind quality assessment, duplication detection, API-boundary review, responsive and accessibility checks, and prioritized risk reporting."
argument-hint: "Target path or module name to audit, plus desired depth: quick, standard, deep"
user-invocable: true
---

# Frontend Audit

Use this skill to analyze a target without modifying code first.

## Input
Provide:
- Scope target: file, folder, page, or module name.
- Audit depth: quick, standard, or deep.
- Optional constraints: do-not-touch areas, deadline, risk tolerance.

## Process
1. Map the module structure and entry points.
2. Identify duplicated logic, duplicated UI, and duplicated style patterns.
3. Check reusable component opportunities, especially:
   - src/components/DataTable.jsx
   - src/components/common/Modal.jsx
   - src/components/ui/Spinner.jsx
   - src/components/ui/Toast.jsx
   - src/components/ui/Can.jsx
   - src/components/ui/ErrorBoundary.jsx
4. Evaluate Tailwind and CSS consistency against project strategy:
   - Tailwind-first for component styling.
   - CSS files for global tokens/base/advanced cases.
5. Review responsive behavior and overflow risk.
6. Review accessibility basics: semantics, keyboard flow, labels, focus, ARIA necessity.
7. Review loading/error/empty states.
8. Review API usage boundaries:
   - service reuse vs direct HTTP calls in UI.
   - contract and auth safety.
9. Assess regression risk and dependency impact.
10. Classify findings by priority.

## Priority Model
- Critical: breaks security, contracts, core navigation, or major user flows.
- High: high-likelihood regressions, major UX/accessibility failures, severe duplication in key paths.
- Medium: maintainability/performance issues with moderate impact.
- Low: incremental quality improvements and consistency polish.

## Output Format
Return:
- Scope summary.
- Findings grouped by Critical, High, Medium, Low.
- Regression risks and impacted dependencies.
- Incremental plan with small safe steps.
- Explicit note: no code changes performed unless user asked.

## Reference
- Detailed checklist: ./references/checklist.md
