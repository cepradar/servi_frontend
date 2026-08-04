# Incremental Modernization Playbook

Use this playbook to execute safe module-level improvements.

## Step 1: Baseline Analysis
- Identify module responsibilities and user flows.
- Enumerate API/service dependencies.
- Enumerate context/permission dependencies.
- Confirm route integration points.

## Step 2: Reuse Scan
- Compare current UI patterns against existing reusable components.
- Prefer extending existing shared components over creating new ones.
- Record any duplicate implementations and migration candidates.

## Step 3: Plan Small Changes
- Group changes into minimal units that can be verified independently.
- Prioritize low-risk/high-value changes first.
- Keep each batch behavior-preserving.

## Step 4: Implementation Rules
- Preserve current contracts and business behavior.
- Keep Tailwind-first styling in component markup.
- Use CSS only when justified by global/shared/complex styling needs.
- Avoid adding new resize listeners when existing hooks can cover the case.
- Avoid introducing new alert/confirm/prompt usage.

## Step 5: Validation
- Run build after changes.
- Run lint when required by scope.
- Separate pre-existing lint baseline from introduced findings.

## Step 6: Delivery Report
Include:
- Files changed.
- What changed and why.
- Validation outputs summary.
- Regression risk notes.
- Suggested next small iteration.
