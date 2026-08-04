---
description: "Use when implementing or editing forms. Standardizes labels, validation feedback, loading states, and submit behavior while preserving backend contracts and field payload names."
name: "Forms"
applyTo:
  - "src/components/**/*.jsx"
  - "src/components/**/*.js"
---
# Forms Rules

## Structure and Clarity
- Keep labels clear, explicit, and close to fields.
- Keep save, cancel, and destructive actions visually and behaviorally consistent.
- Keep validation messaging near the corresponding field.

## Submission Behavior
- Prevent duplicate submissions while a request is in progress.
- Show loading state on submit actions.
- Keep success/error feedback understandable for users.

## Contract Safety
- Preserve existing validation intent unless explicitly requested.
- Do not change backend payload field names without approval.
- Do not alter endpoint contracts during UI-only tasks.

## Reuse and Consistency
- Reuse existing reusable controls when they already satisfy the requirement.
- Avoid introducing parallel form patterns with conflicting UX behavior.
