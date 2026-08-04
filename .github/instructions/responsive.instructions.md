---
description: "Use when implementing responsive behavior in pages, forms, tables, modals, and panels. Prefer Tailwind breakpoints first and centralize JS breakpoint logic in reusable hooks when needed."
name: "Responsive Design"
applyTo:
  - "src/components/**/*.jsx"
  - "src/components/**/*.js"
  - "src/hooks/**/*.js"
  - "src/hooks/**/*.jsx"
---
# Responsive Rules

## Strategy
- Mobile-first behavior should be preserved and improved incrementally.
- Prefer Tailwind responsive utilities before adding JavaScript viewport logic.
- Reuse existing breakpoint hooks when JS logic is necessary.

## JavaScript Responsive Logic
- Avoid adding repeated resize listeners inside multiple components.
- If viewport logic is required, centralize it in a reusable hook.
- Keep breakpoint conventions aligned with existing project breakpoints.

## Layout and Overflow
- Avoid unnecessary fixed widths.
- Prevent uncontrolled horizontal overflow.
- Validate large tables and dense panels on small screens.
- Ensure actionable controls remain touch-friendly.

## Scope
- Do not hide critical information on mobile without an accessible alternative.
- Keep behavior parity across desktop, tablet, and mobile when feasible.
