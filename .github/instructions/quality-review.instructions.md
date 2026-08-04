---
description: "Use when validating changes before delivery. Keeps lint baseline awareness, requires build checks, and prevents masking issues with broad rule disables."
name: "Quality and Review"
applyTo:
  - "src/**/*.js"
  - "src/**/*.jsx"
  - "src/**/*.css"
  - "eslint.config.js"
  - "vite.config.js"
  - "tailwind.config.cjs"
  - "postcss.config.js"
  - "package.json"
---
# Quality and Review Rules

## Baseline Policy
- Treat current lint findings as existing baseline.
- Do not attempt to fix all existing lint errors in one unrelated task.
- For each change, avoid introducing new lint issues.

## Validation Steps
- Run npm run build after relevant code changes.
- Run npm run lint when requested or when change scope justifies it.
- Clearly distinguish pre-existing errors from newly introduced ones.

## Safe Fixing Policy
- Fix lint issues directly related to edited files when low risk and in scope.
- Do not disable ESLint globally to hide errors.
- Do not add eslint-disable comments unless there is a concrete, documented reason.

## Delivery Checklist
- Report files created/modified.
- Report validations executed.
- Report errors found and whether they are pre-existing or introduced.
- Report any residual risks and pending follow-up actions.
