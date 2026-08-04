# Frontend Audit Checklist

Use this checklist during assessment. Do not modify code unless explicitly requested.

## 1. Scope Mapping
- Identify main component/page entry.
- Identify children/components composed by the target.
- Identify hooks used.
- Identify contexts used.
- Identify services/API calls used.
- Identify route dependencies and navigation impact.

## 2. Reuse and Duplication
- Check whether existing reusable components can be applied.
- Identify duplicated modal, table, feedback, loader, or permission patterns.
- List duplicated logic blocks and where they appear.

## 3. Tailwind and CSS Consistency
- Confirm Tailwind-first usage for component-level styling.
- Identify repeated long class patterns that suggest extraction.
- Identify places where CSS variables/tokens would reduce repetition.
- Verify CSS usage is justified (global, animation, advanced styling, cross-cutting utilities).

## 4. Responsive
- Verify layout at small, medium, large breakpoints.
- Check horizontal overflow risk in tables/forms/panels.
- Check if repeated resize listeners are being added in components.
- Prefer utility breakpoints before JS viewport logic.

## 5. Accessibility
- Semantic tags and heading hierarchy.
- Button semantics for actions.
- Label-input associations.
- Keyboard navigation and focus visibility.
- ARIA only when needed.
- Error/status messages not only color-based.

## 6. UX States
- Loading state present and understandable.
- Error state present and understandable.
- Empty state useful and actionable.
- Primary/secondary/destructive actions visually differentiated.
- Avoid introducing new alert/confirm/prompt patterns.

## 7. API Integration Safety
- Reuse axiosClient and existing service layer where possible.
- Detect direct HTTP calls in UI and assess migration complexity.
- Verify no endpoint/contract/auth changes are proposed implicitly.

## 8. Risk Analysis
- Identify fragile dependencies and likely regression points.
- Mark high-risk files for guarded refactor.
- Propose test/validation checkpoints (build + lint baseline awareness).

## 9. Deliverable
- Findings by severity: Critical, High, Medium, Low.
- Small-step improvement plan.
- Explicitly document assumptions and unknowns.
