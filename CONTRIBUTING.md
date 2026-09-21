# Contributing to Waste2Value

Welcome to the Waste2Value codebase. This document establishes technical conventions, guidelines, and quality bars for engineering contributions.

---

## 1. Development Environment

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 10+ (tested on npm 11)

### Quick Start
```bash
# Install dependencies
npm install

# Run automated tests
npm test

# Run TypeScript typechecks
npm run typecheck

# Build for production
npm run build

# Start development server
npm run dev
```

---

## 2. Supabase Local Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. For offline design and mock development, leave `VITE_USE_MOCK_SERVICES=true`.
3. For live Supabase testing:
   - Provide your `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
   - Set `VITE_USE_MOCK_SERVICES=false`.
   - Apply migrations via Supabase SQL Editor or `npx supabase db push`.

> [!CAUTION]
> NEVER add `SUPABASE_SERVICE_ROLE_KEY` to client `.env` files or commit credentials to the repository.

---

## 3. Architectural Principles

1. **Single Responsibility Principle:** Every component, service, and hook must have one clear purpose.
2. **Separation of Concerns:**
   - Presentation logic lives in `components/` and `pages/`.
   - Business and data operations live in `services/`.
   - Data contracts live in `types/`.
   - Shared helpers live in `lib/`.
   - Responsive layout rules live in `components/layout/`.
3. **No Direct Supabase or Fetch Queries in Components:**
   - Always call methods through the `services` container (`src/services/index.ts`).
   - Wrap service calls with `useAsync` in components to ensure consistent loading, error, and cancellation behavior.
4. **Data Honesty:**
   - When surfacing estimates, demo records, or AI predictions, always use `<DataHonestyBadge>` or clear text labels (`Estimated`, `AI-assisted`, `Demo data`).
   - Never fabricate 100% certainty or fake scientific verification.
5. **Accessibility (WCAG 2.2 AA):**
   - Minimum 44px (preferred 48px) touch targets for interactive controls.
   - Proper `aria-label`, `<label>`, and `aria-live` usage for dynamic statuses.
   - Respect `prefers-reduced-motion`.
6. **Responsive-First Thinking:**
   - Build using fluid compositions that adapt gracefully from small phones (320px) to ultra-wide displays (1920px).
   - Test on both mobile navigation (`BottomNav`) and desktop sidebar navigation (`DesktopSidebar`).

---

## 4. Pull Request & Quality Checklist

Before submitting changes, ensure:
- [ ] `npm test` passes with zero failures.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` completes cleanly.
- [ ] No `any` types were introduced.
- [ ] Design tokens were used instead of arbitrary hardcoded hex codes.
- [ ] Error, loading, and empty states are handled using `StateView` / `ActionableError` / `EmptyState`.
