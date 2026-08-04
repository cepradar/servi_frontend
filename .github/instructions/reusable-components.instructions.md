---
description: "Use when building or changing shared UI pieces. Prioritizes reuse of existing DataTable, Modal, Spinner, Toast, Can, and ErrorBoundary before creating new equivalents."
name: "Reusable Components"
applyTo:
  - "src/components/**/*.jsx"
  - "src/components/**/*.js"
---
# Reusable Components Rules

## Reuse Policy
- Before creating a new component, search for an existing equivalent.
- Prioritize these existing reusable components:
  - src/components/DataTable.jsx
  - src/components/common/Modal.jsx
  - src/components/ui/Spinner.jsx
  - src/components/ui/Toast.jsx
  - src/components/ui/Can.jsx
  - src/components/ui/ErrorBoundary.jsx

## Creation Criteria
- Create a new reusable component only when there is repeated usage with similar behavior and structure.
- Keep props API small, clear, and intention-driven.
- Avoid excessive boolean-prop combinations.
- Prefer children composition when it simplifies API and usage.

## Duplication Handling
- Do not remove existing duplicated implementations automatically.
- First identify the canonical implementation and enumerate references.
- Plan migration in safe, incremental steps.

## Naming and Consistency
- Use PascalCase component names.
- Keep naming consistent with current component domain language.
- Avoid introducing overlapping components with near-identical responsibilities.
