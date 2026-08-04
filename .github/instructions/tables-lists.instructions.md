---
description: "Use when creating or updating data tables and lists. Prioritizes DataTable reuse, loading/error/empty states, stable actions, and responsive behavior without API contract changes."
name: "Tables and Lists"
applyTo:
  - "src/components/**/*.jsx"
  - "src/components/**/*.js"
---
# Tables and Lists Rules

## Reuse First
- Before creating a new table implementation, evaluate src/components/DataTable.jsx.
- Avoid duplicating sort/filter/pagination logic when existing components can be extended safely.

## Data Presentation
- Keep headers clear and stable.
- Align values by type where possible (numeric, text, action columns).
- Keep row actions consistent across equivalent modules.

## State Handling
- Include loading, empty, and error states.
- Keep actions visible and understandable in small screens.
- Preserve responsive usability and avoid horizontal overflow surprises.

## Safety Boundaries
- Do not modify API queries or response contracts only for visual changes.
- Keep permission-driven actions compatible with current authorization logic.
