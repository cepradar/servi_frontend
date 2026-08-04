---
description: "Use when creating or editing UI markup and interactions. Enforces semantic HTML, keyboard support, visible focus, and pragmatic ARIA usage."
name: "Accessibility"
applyTo:
  - "src/components/**/*.jsx"
  - "src/components/**/*.js"
---
# Accessibility Rules

## Semantic and Interactive Elements
- Use semantic HTML whenever possible.
- Use button elements for actions; do not emulate buttons with plain div elements.
- Keep headings and landmark structure clear in complex screens.

## Forms and Labels
- Associate labels with form controls correctly.
- Ensure input purpose is understandable from visible labels or accessible names.

## Keyboard and Focus
- Maintain keyboard navigation for interactive controls.
- Keep visible focus styles; do not remove focus outlines without an accessible replacement.
- Ensure modals and menus remain keyboard-usable.

## ARIA and Messaging
- Add ARIA attributes only when needed and when semantic HTML alone is insufficient.
- Do not rely only on color to communicate error/success/warning states.
- For status messages, ensure screen-reader-compatible patterns are used where relevant.
