---
description: "Use when working with data fetching and backend communication. Reuse axiosClient and existing services, keep contracts stable, and avoid introducing new direct HTTP calls in UI when service-layer reuse is possible."
name: "API Integration"
applyTo:
  - "src/api/**/*.js"
  - "src/components/**/*.jsx"
  - "src/components/**/*.js"
  - "src/hooks/**/*.js"
  - "src/hooks/**/*.jsx"
  - "src/context/**/*.jsx"
---
# API Integration Rules

## Client and Service Reuse
- Reuse src/api/axiosClient.js for HTTP configuration and auth behavior.
- Prefer existing domain services under src/api/services.
- Avoid duplicate URL/header/auth setup in components.

## UI and Networking Separation
- For new or modified flows, keep HTTP calls outside purely presentational components when feasible.
- Avoid adding new direct HTTP calls in component files if a service abstraction already exists or is easy to extend safely.

## Contract Protection
- Do not change endpoints, payload schema, auth flow, or response contracts without explicit approval.
- Keep existing error handling intent and loading behavior consistent.
- Do not expose secrets in frontend code.

## Incremental Scope
- Do not move all legacy direct calls in one pass.
- Apply service-layer improvements incrementally per touched module.
