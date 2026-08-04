---
description: "Use when improving UI behavior and visual consistency. Focus on loading/error/empty states, clear action hierarchy, and progressive UX improvements without changing business logic."
name: "UX Design"
applyTo:
  - "src/components/**/*.jsx"
  - "src/components/**/*.js"
---
# UX Design Rules

## Core UX Principles
- Keep hierarchy, spacing, and alignment consistent.
- Avoid crowded interfaces and visual noise.
- Keep control sizes and text scale coherent across modules.
- Differentiate primary, secondary, and destructive actions clearly.

## User Feedback
- Show loading states for async actions.
- Show understandable error states and messages.
- Show useful empty states for no-data scenarios.
- Avoid abrupt layout jumps during loading and data refresh.

## Interaction Guidance
- Do not introduce new uses of window.alert, window.confirm, or window.prompt.
- Prefer reusable modal confirmation and toast feedback patterns for new changes.
- Do not replace all legacy alerts/prompts in one refactor.

## Scope Protection
- Do not alter business logic to make visual changes.
- Keep current route and permission behavior unchanged while improving UI experience.
