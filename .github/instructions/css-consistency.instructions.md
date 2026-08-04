---
description: "Use when editing styles. Tailwind remains primary for component styling; CSS files are reserved for global tokens, base styles, animations, and advanced cases."
name: "Tailwind and CSS Consistency"
applyTo:
  - "src/**/*.jsx"
  - "src/**/*.js"
  - "src/**/*.css"
  - "tailwind.config.cjs"
  - "postcss.config.js"
---
# Tailwind and CSS Consistency Rules

## Styling Strategy
- Keep Tailwind utility classes as the default for component-level styling.
- Do not remove Tailwind or migrate all classes to plain CSS.
- Do not replace Tailwind with Bootstrap, Material UI, or similar frameworks.

## CSS Usage Boundaries
- Use src/main.css for global variables/tokens, base styles, shared animations, and cross-cutting utilities.
- Add component/page CSS only when Tailwind is not the right fit (complex selectors, non-trivial animations, global reusable patterns).
- Keep each component coherent: avoid arbitrary mixing of multiple styling approaches.

## Quality Rules
- Avoid inline styles except truly dynamic values.
- Avoid important unless there is a documented and justified override scenario.
- Avoid deep selectors and broad global selectors that can create side effects.
- Prefer descriptive class names for custom CSS and use component-related prefixes.

## Design Token Direction
- When repeated raw values appear, centralize via CSS variables in main.css.
- Token families to standardize progressively: color, text, border, shadow, radius, spacing, typography, transitions, max-width.
- Preserve current visual identity; no aggressive redesign in one step.
