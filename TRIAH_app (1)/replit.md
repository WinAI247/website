# TRIAH — Trusted AI in Healthcare Validation Framework

## Overview

TRIAH (Trusted AI in Healthcare) is a multi-evaluator scoring and certification platform for healthcare AI products. It allows expert reviewers to independently evaluate AI vendors across 8 weighted standards (regulatory compliance, clinical outcomes, transparency, ethics, model validity, etc.), then aggregates scores to produce badge certifications (Bronze to Platinum) and inter-rater reliability (IRR) metrics.

**Core capabilities:**
- Browse and explore 8 structured evaluation standards with hierarchical elements and factors, each with a 5-level rubric (Not Met → Exceptional) + a "Not Applicable" option
- Manage vendor profiles with supporting documentation evidence organized by standard; store intake and vendor contact emails per vendor
- Conduct independent evaluation sessions per vendor per standard with per-factor scoring, N/A marking, and notes
- Generate document request email drafts from the evaluation workspace (pre-filled templates, copy to clipboard)
- Run calibration exercises to align evaluator scoring behavior
- Compute weighted overall scores, must-pass gate checks, badge levels, and IRR statistics (Cohen's Kappa, Fleiss' Kappa, ICC, Cronbach's Alpha); N/A factors excluded from all calculations
- Admin panel for seeding mock data, resetting data, and exporting results

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Layout

```
/client        — React SPA (Vite)
/server        — Express API server (Node/tsx)
/shared        — Shared types, Drizzle schema, standards data
/migrations    — Drizzle SQL migrations
/script        — Build scripts (esbuild + vite)
```

The client and server share types via the `/shared` directory. Path alias `@shared/*` maps to `./shared/*` in both tsconfig and vite config.

### Frontend Architecture

- **Framework:** React 18 + TypeScript, built with Vite
- **Routing:** `wouter` (lightweight client-side routing)
- **State/Data fetching:** TanStack React Query v5 — all server state is managed via query keys matching API paths; mutations invalidate relevant queries
- **UI Components:** shadcn/ui (Radix UI primitives + Tailwind CSS), "new-york" style variant
- **Styling:** Tailwind CSS with CSS custom properties for theming; light/dark mode toggled via `ThemeProvider` (stored in localStorage as `triah-theme`)
- **Forms:** react-hook-form + @hookform/resolvers + Zod for validation
- **Font stack:** DM Sans (body), Geist Mono / Fira Code (mono), Architects Daughter (display)

**Page structure (authenticated):**
- `Dashboard` — stats overview + standards summary + recent evaluations
- `Standards` — browse all 8 standards, drill into elements and factors with rubric details
- `Reference Library` (`/references`) — full registry of ~38 external references (FDA, HIPAA, EU AI Act, ISO, HL7, state laws, consensus guidelines) organized in Mandatory/Preferred/Optional tabs, with search/filter, type-grouped sub-sections, and a TRIAH IP section for factors with no external citations
- `Vendors` — vendor profiles with document lists and per-standard evidence summaries
- `Evaluations` — create and complete evaluation sessions; score each factor with notes; each factor card shows inline reference count link or TRIAH IP badge; clicking opens a reference drawer (Sheet) with compact reference cards and external links
- `Calibration` — calibration exercise creation and scoring
- `Results` — aggregated vendor scores, badge display, IRR analysis tabs
- `Admin` — seed/reset data, export results

**Authentication gate:** `useAuth` hook queries `/api/auth/user`; unauthenticated users see a `Landing` page with a "Sign In" button pointing to `/api/login`.

### Backend Architecture

- **Runtime:** Node.js with `tsx` for TypeScript execution in dev; esbuild bundle for production
- **Framework:** Express.js
- **Entry:** `server/index.ts` → registers routes via `server/routes.ts`, serves static files in production via `server/static.ts`, uses `server/vite.ts` for Vite middleware in development
- **Storage layer:** `server/storage.ts` defines `IStorage` interface implemented by `DatabaseStorage` using Drizzle ORM queries. All DB access goes through this abstraction.
- **Standards service:** `server/standards-service.ts` caches the `REFINED_STANDARDS` constant in memory after first load, computes weighted scores, badge levels, must-pass gate failures, and IRR metrics.
- **Seed data:** `server/seed-data.ts` contains `MOCK_VENDORS` array used by the admin seed endpoint.
- **Build:** `script/build.ts` runs Vite for the client then esbuild for the server, bundling an allowlisted set of server dependencies to reduce cold-start syscalls.

**Key API routes (all under `/api`):**
| Route | Purpose |
|---|---|
| `GET /api/standards` | All standards + factor count |
| `GET /api/standards/summary` | Lightweight summary per standard |
| `GET /api/vendors` / `/:id` | Vendor list / detail |
| `GET /api/vendors/:id/evaluations` | Evaluations for a vendor |
| `GET /api/evaluations` / `/:id` | Session list / detail |
| `POST /api/evaluations` | Create session |
| `PUT /api/evaluations/:id` | Update session (scores, status) |
| `GET /api/calibrations` / `/:id` | Calibration exercises |
| `POST /api/calibrations` | Create exercise |
| `GET /api/results` / `/irr` | Aggregated results + IRR |
| `GET /api/stats` | Dashboard stats |
| `POST /api/admin/seed` | Seed mock data |
| `POST /api/admin/reset` | Reset all data |
| `GET /api/admin/export` | Export data |

### Data Storage

**Database:** PostgreSQL via `drizzle-orm/node-postgres` (`pg` Pool).  
**ORM:** Drizzle ORM with Zod schema generation (`drizzle-zod`).  
**Schema location:** `shared/schema.ts` (re-exports from `shared/models/auth.ts`)

**Core tables:**

| Table | Purpose |
|---|---|
| `users` | Authenticated user profiles (Replit Auth) |
| `sessions` | Express session storage (connect-pg-simple) |
| `vendors` | AI product vendor profiles with JSONB document lists and per-standard evidence |
| `evaluation_sessions` | One session per evaluator per vendor; tracks status, overall score, badge level |
| `evaluation_scores` | Per-factor scores (standardKey, elementKey, factorKey) with notes, linked to session |
| `calibration_exercises` | Named calibration rounds with type and description |
| `calibration_scores` | Per-evaluator, per-factor scores within a calibration exercise |

JSONB columns are used for `vendors.documents` (`VendorDocument[]`) and `vendors.evidenceByStandard` (`Record<string, string>`), avoiding a normalized join table for document metadata.

### Authentication & Authorization

- **Provider:** Replit OpenID Connect (OIDC) via `openid-client` + `passport` + `passport-local` strategy wrapper
- **Sessions:** `express-session` backed by PostgreSQL (`connect-pg-simple`) using the `sessions` table with a 7-day TTL
- **Flow:** Users hit `/api/login` → redirected to Replit OIDC → callback upserts user in `users` table → session cookie set
- **Guard middleware:** `isAuthenticated` middleware (from `server/replit_integrations/auth/replitAuth.ts`) protects `/api/auth/user` and other authenticated routes
- **Client-side:** `useAuth` hook queries `/api/auth/user` with `credentials: "include"`; on 401 returns `null` and renders the `Landing` page

### Standards Data

The 8 evaluation standards are defined as a static TypeScript constant (`REFINED_STANDARDS`) in `shared/refined-standards-data.ts`. Each standard has weighted elements, each element has weighted factors, and each factor has a 5-level rubric plus `tier` and `referenceIds` fields added in March 2026. This data is loaded once and cached in memory on the server (`standards-service.ts`). No DB table stores standards — they are code-defined and versioned with the application.

### Reference Library Data

`shared/reference-library.ts` contains the `TRIAH_REFERENCES` array (~38 entries) mapping each external reference (FDA, HIPAA, NIST, EU AI Act, ISO, HL7, state laws, consensus guidelines) to the factor IDs it governs. Each reference has `tier` (mandatory/preferred/optional), `type` (federal/international/state/standards_body/consensus/academic), and helper functions: `getReferencesForFactor()`, `getReferencesForStandard()`, `getReferencesByTier()`, `isTRIAHIP()`. No DB table — purely static TypeScript. Factors with no citations are considered "TRIAH IP".

Standard weights (total = 1.0):
- S1 Regulatory Compliance & Safety: 0.20
- S2 Safety & Risk Management: 0.10
- S3 Clinical Outcomes: 0.10
- S4 Transparency: 0.15
- S5 Ethics & Fairness: 0.10
- S6 Model Validity: 0.10
- S7 Human Factors: 0.15
- S8 Post-Market Monitoring: 0.10

### Scoring & Badge Logic

Scores are 0/20/50/80/100 (Not Met / Minimal / Adequate / Strong / Exceptional). Weighted aggregation happens in `computeWeightedScore`: factor scores → element weighted average → standard weighted average → global weighted score. Must-pass elements that score 0 set `mustPassFailed = true`. Badge levels: Platinum (≥90%), Gold (≥80%), Silver (≥65%), Bronze (≥50%), Not Certified (<50% or must-pass failed).

## External Dependencies

| Dependency | Purpose |
|---|---|
| **Replit OIDC** (`https://replit.com/oidc`) | Identity provider for authentication; requires `REPL_ID` and `ISSUER_URL` env vars |
| **PostgreSQL** | Primary data store; requires `DATABASE_URL` env var |
| **connect-pg-simple** | Persists Express sessions in the `sessions` PostgreSQL table |
| **TanStack React Query v5** | Client-side server state management and caching |
| **Radix UI / shadcn/ui** | Accessible UI primitive components |
| **Drizzle ORM + drizzle-kit** | Type-safe PostgreSQL ORM and migration tooling |
| **Zod + drizzle-zod** | Schema validation; insert schemas auto-generated from Drizzle table definitions |
| **Vite + @vitejs/plugin-react** | Frontend build tool and dev server |
| **esbuild** | Server-side production bundler |
| **@replit/vite-plugin-runtime-error-modal** | Dev-mode runtime error overlay (Replit-specific) |
| **@replit/vite-plugin-cartographer** | Dev-mode source map tooling (Replit-specific, dev only) |
| **wouter** | Lightweight React router |
| **framer-motion** | Animation library (used in attached_assets reference page) |
| **recharts** | Chart components (used in `chart.tsx`) |
| **react-hook-form** | Form state management |
| **date-fns** | Date formatting utilities |
| **nanoid** | Unique ID generation (used in Vite server template cache-busting) |
| **memoizee** | Memoization for OIDC config fetch (1-hour cache) |
| **openid-client** | OIDC client for Replit authentication |
| **passport / passport-local** | Authentication middleware |
| **express-session** | Session middleware |
| **SESSION_SECRET** env var | Required for signing session cookies |