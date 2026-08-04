# Frontend Project Guidelines

## Stack and Scope
- Keep React + Vite + JavaScript with JSX.
- Do not migrate JSX files to TypeScript.
- Tailwind CSS is the primary styling system for component-level UI.
- Use CSS files mainly for global tokens, base rules, shared animations, and complex cases where utility classes are not the best fit.
- Do not replace Tailwind with Bootstrap, Material UI, or other UI frameworks.

## Change Strategy
- Prefer small, safe, and verifiable changes.
- Avoid massive rewrites and broad refactors in a single task.
- Preserve existing business behavior, API contracts, permissions, and routing.
- Before structural changes, explain impact and risks.

## Existing Frontend Boundaries
- Reuse the current providers and contexts in src/context.
- Keep compatibility with protected routes and current navigation flow.
- Respect current API client and service layer conventions.
- Treat current lint issues as baseline; do not try to fix all existing issues in one pass.

## Canonical Reusable UI Targets
When implementing equivalent UI, prefer existing reusable components first:
- Data table: src/components/DataTable.jsx
- Modal baseline: src/components/common/Modal.jsx
- Spinner: src/components/ui/Spinner.jsx
- Toast provider/hook: src/components/ui/Toast.jsx
- Permission gate: src/components/ui/Can.jsx
- Error boundary: src/components/ui/ErrorBoundary.jsx

## Validation Expectations
- Run npm run build after significant code changes.
- Run npm run lint when requested or when validating broader edits.
- Distinguish pre-existing lint findings from newly introduced issues.
- Do not disable ESLint rules globally to hide problems.
