# Waste2Value — Technical Architecture & Codebase Foundation

> **Product Vision:** Waste2Value is an AI-assisted circular-economy operating platform designed to turn discarded items and surplus materials into actionable next-value opportunities through a transparent three-model AI pipeline:
>
> 1. **Vision AI:** *"What is this?"* (Object, material, condition assessment)
> 2. **Value AI:** *"What should happen to it?"* (Circular Value Matrix: Reuse, Donate, Resell, Recycle)
> 3. **Matching AI:** *"Who can take it?"* (Receiver discovery and handover match)
>
> **Design Philosophy:** Technical Minimalism + Precision Eco-Tech. Calm, restrained, trustworthy, operational, and accessible.

---

## 1. Unified Application Architecture

Waste2Value is built as **one unified responsive web application**, not three isolated codebases. Mobile phone viewports (320px–430px), tablet breakpoints (768px–1023px), standard desktops (1024px–1440px), and professional wide displays (1600px+) share identical:

- Data entities, Supabase database types, and TypeScript contracts
- Service boundaries and interfaces
- Business logic and state management
- Authentication and session handling
- Component primitives and design tokens

Responsive differences are handled purely via **breakpoint-aware composition**:

| Dimension | Mobile (< 1024px) | Desktop (≥ 1024px) |
|---|---|---|
| **Primary Navigation** | Fixed bottom navigation bar with prominent central Scan button (`pb-safe`) | Persistent left sidebar (`w-256px`) with brand header and utility nav |
| **Header** | Compact bar with back arrow and title | Global header with contextual breadcrumb, search, and user profile |
| **Analysis Workspace** | Vertical Decision Stack with progressive disclosure | 3-panel simultaneous workspace (Item Media \| AI Insights \| Value Matrix) |
| **Value Matrix** | Vertically stacked decision cards (Recommended path visually dominant) | Spatial 4-quadrant matrix (Reuse, Donate, Resell, Recycle) |
| **Receivers View** | Vertical cards with bottom-sheet filters | Split layout (Filter rail \| Receiver grid \| Geographic context) |
| **My Items** | Touch-friendly item cards with swipe/tap actions | Hybrid table/card view with sorting and column filters |
| **Primary Actions** | Fixed thumb-zone sticky bottom CTAs | Predictable, in-flow primary buttons (48px height) |

---

## 2. Directory & Codebase Structure

```text
src/
├── config/                     # Centralized configuration & environment validation
│   ├── env.ts                  # Strictly validated environment configuration with production fail-safes
│   └── constants.ts            # Application routes, limits, categories, conditions, paths
│
├── types/                      # Domain contracts & database types
│   ├── index.ts                # Central barrel export
│   ├── database.ts             # Supabase Postgres schema type definitions
│   ├── common.ts               # AsyncState, Pagination, ApiResponse, LoadingStatus
│   ├── auth.ts                 # User, UserRole, Session, Credentials, SignUp, Onboarding
│   ├── item.ts                 # WasteItem, Category, Condition, ItemTrackingStatus
│   ├── ai.ts                   # VisionResult, ValueAiResult, MatchingResult, PipelineProgress
│   ├── receiver.ts             # Receiver, ReceiverType, ReceiverFilters, VerificationStatus
│   ├── handover.ts             # HandoverRecord, ConfirmHandoverPayload, TimelineEvent
│   └── impact.ts               # ImpactMetrics, ImpactActivityHistory (honest data labeling)
│
├── styles/                     # Design tokens & styling foundation
│   ├── globals.css             # Tailwind directives, CSS custom properties, safe-area utilities
│   └── tokens.ts               # Type-safe design token constants for TS consumption
│
├── lib/                        # Shared utility primitives & infrastructure
│   ├── supabase/
│   │   └── client.ts           # Supabase browser client with env validation
│   ├── utils.ts                # cn() class merge helper (clsx + tailwind-merge)
│   ├── formatters.ts           # Distance, date, category, and value-path formatters
│   └── storage.ts              # Safe local storage wrapper with memory fallback
│
├── services/                   # Service layer & interface boundaries
│   ├── api/
│   │   └── apiError.ts         # Normalized AppError with Supabase error mapping & user recovery advice
│   ├── interfaces/             # Strict service contracts for backend independence
│   │   ├── IAuthService.ts
│   │   ├── IItemService.ts
│   │   ├── IAiService.ts
│   │   ├── IReceiverService.ts
│   │   ├── IHandoverService.ts
│   │   └── IImpactService.ts
│   ├── supabase/               # Real production Supabase service implementations
│   │   ├── SupabaseAuthService.ts
│   │   ├── SupabaseItemService.ts
│   │   ├── SupabaseAiService.ts
│   │   ├── SupabaseReceiverService.ts
│   │   ├── SupabaseHandoverService.ts
│   │   └── SupabaseImpactService.ts
│   ├── mock/                   # Design-aligned mock data & implementations
│   │   ├── mockData.ts         # Wooden Chair, GreenLoop, Receiver dataset, Impact telemetry
│   │   └── mockServices.ts     # Mock services fulfilling interface contracts with realistic latency
│   └── index.ts                # Service container / factory exporting active implementations
│
├── context/                    # Global state management
│   ├── AuthContext.tsx         # User session, login, logout, registration, live auth subscriptions
│   └── ScanFlowContext.tsx     # Ephemeral multi-step pipeline state (Scan -> Review -> AI -> Result -> Handover)
│
├── hooks/                      # Reusable behavioral hooks
│   ├── useMediaQuery.ts        # Responsive breakpoint detector (isMobile, isTablet, isDesktop)
│   ├── useAsync.ts             # Async operation lifecycle (data, loading, error, reload)
│   ├── useAuth.ts              # Authentication state hook
│   └── useScanFlow.ts          # Scan workflow state hook
│
├── components/                 # Presentation & UI components
│   ├── common/                 # Reusable atomic primitives
│   │   ├── Button.tsx          # 48px primary, secondary, tertiary, destructive, AI variants
│   │   ├── Input.tsx           # 48px height, focus ring, labels, error states
│   │   ├── Card.tsx            # Resting (1px border), raised, interactive, recommended styles
│   │   ├── Badge.tsx           # Pill badges with semantic and AI accent styling
│   │   └── Modal.tsx           # Floating dialog with backdrop blur and escape listeners
│   ├── layout/                 # Responsive application shells
│   │   ├── AppLayout.tsx       # Main responsive container switching between sidebar & bottom nav
│   │   ├── DesktopSidebar.tsx  # 256px persistent desktop navigation
│   │   ├── DesktopHeader.tsx   # Desktop top bar with breadcrumb and user profile
│   │   ├── MobileHeader.tsx    # Mobile top bar with safe-area padding and back navigation
│   │   ├── BottomNav.tsx       # Mobile bottom navigation bar with emphasized Scan button
│   │   └── WorkspaceContainer.tsx # 1440px max-width container with calm whitespace
│   └── feedback/               # Loading, empty, and error state components
│       ├── ErrorBoundary.tsx   # React runtime error boundary
│       ├── StateView.tsx       # Unified handler for loading, error, empty, and data views
│       ├── LoadingSkeleton.tsx # Shimmer skeleton blocks respecting architectural radii
│       ├── EmptyState.tsx      # Actionable empty state with guidance and primary CTA
│       ├── ActionableError.tsx # Nielsen heuristic error recovery display
│       └── DataHonestyBadge.tsx # Standardized transparency badges ("AI-assisted", "Estimated", "Demo data")
│
├── pages/                      # Route foundation views
│   ├── LandingPage.tsx         # Public marketing & value proposition
│   ├── LoginPage.tsx           # Desktop split-screen / Mobile single-panel authentication
│   ├── SignUpPage.tsx          # Role-based registration
│   ├── ForgotPasswordPage.tsx  # Password recovery
│   ├── OnboardingPage.tsx      # 3-step onboarding (role, interests, location)
│   ├── HomePage.tsx            # Main operational dashboard
│   ├── ScanPage.tsx            # Camera and file upload entry
│   ├── ScanReviewPage.tsx      # Image verification before AI execution
│   ├── ScanAnalyzePage.tsx     # Progressive 3-stage AI analysis animation
│   ├── ScanResultPage.tsx      # Identification & Signature Circular Value Matrix
│   ├── ReceiversPage.tsx       # Matching AI receiver discovery with filters
│   ├── ReceiverDetailPage.tsx  # Receiver match rationale ("Why this match?")
│   ├── CreateListingPage.tsx   # Manual item creation
│   ├── HandoverConfirmPage.tsx # Handover review & scheduling
│   ├── HandoverSuccessPage.tsx # Success confirmation & track CTA
│   ├── ItemTrackPage.tsx       # 5-stage circular lifecycle timeline
│   ├── ItemsPage.tsx           # My Items hybrid table/card inventory
│   ├── DiscoverPage.tsx        # Neighborhood circular opportunities
│   ├── ImpactPage.tsx          # Environmental metrics with honest data labeling
│   ├── ProfilePage.tsx         # Account profile & preferences
│   ├── SettingsPage.tsx        # Grouped settings & accessibility preferences
│   ├── HelpPage.tsx            # Technical FAQ & guide
│   └── NotFoundPage.tsx        # 404 page
│
├── routes/                     # Routing architecture
│   ├── AppRoutes.tsx           # Central route tree definition
│   └── ProtectedRoute.tsx      # Authentication guard
│
├── __tests__/                  # Unit test suite
│   ├── env.test.ts             # Environment validation tests
│   ├── apiError.test.ts        # Error normalization and information leakage tests
│   └── formatters.test.ts      # Data formatter tests
│
├── App.tsx                     # Root provider tree (Error boundary, Router, Auth, ScanFlow)
└── main.tsx                    # Entry point mounting to DOM
```

---

## 3. Database Architecture & Row Level Security (RLS)

Postgres migrations reside under `supabase/migrations/` (see [`0001_initial_schema.sql`](file:///C:/Users/sujan/Downloads/a%20start/supabase/migrations/0001_initial_schema.sql)).

### A. Normalized Relational Schema
- **`public.profiles`**: Contains application-level user attributes (`name`, `role`, `city`, `interests`, `notifications_enabled`, `reduced_motion`, `search_radius_km`, `onboarding_completed`). Primary key references `auth.users(id)` ON DELETE CASCADE.
- **`public.items`**: Tracks scanned items, material taxonomy, structural conditions, recommended/selected value paths, and receiver assignments.
- **`public.ai_assessments`**: Stores Vision AI and Value AI predictions, confidence scores, and reasoning logs.
- **`public.receivers`**: Verified and community circular drop-off centers, categories accepted, and operating hours.
- **`public.handover_records`**: Manages physical handover scheduling and progression milestones.
- **`public.impact_records`**: Stores verified and estimated diverted mass, CO₂ offset telemetry, and path distributions.

### B. Automatic Profile Initialization
A database trigger (`on_auth_user_created`) automatically provisions profile and initial impact rows upon any successful registration in `auth.users`, ensuring relational integrity without race conditions in client code.

### C. Row Level Security Policies
Every table has `ENABLE ROW LEVEL SECURITY` turned on:

| Table | Policy Name | Command | Rule |
|---|---|---|---|
| `profiles` | "Users can read own profile" | SELECT | `auth.uid() = id` |
| `profiles` | "Users can update own profile" | UPDATE | `auth.uid() = id` |
| `items` | "Users can read own items" | SELECT | `auth.uid() = user_id` |
| `items` | "Users can insert own items" | INSERT | `auth.uid() = user_id` |
| `items` | "Users can update own items" | UPDATE | `auth.uid() = user_id` |
| `items` | "Users can delete own items" | DELETE | `auth.uid() = user_id` |
| `ai_assessments` | "Users can read own ai assessments" | SELECT | `auth.uid() = user_id` |
| `ai_assessments` | "Users can insert own ai assessments" | INSERT | `auth.uid() = user_id` |
| `receivers` | "Active receivers are visible" | SELECT | `is_active = true` |
| `handover_records` | "Users can read own handover records" | SELECT | `auth.uid() = user_id` |
| `handover_records` | "Users can insert own handover records" | INSERT | `auth.uid() = user_id` |
| `handover_records` | "Users can update own handover records" | UPDATE | `auth.uid() = user_id` |
| `impact_records` | "Users can read own impact records" | SELECT | `auth.uid() = user_id` |
| `impact_records` | "Users can update own impact records" | UPDATE | `auth.uid() = user_id` |

---

## 4. Service Boundaries & API Strategy

The application enforces strict service interfaces located in `src/services/interfaces/`. Components and hooks **never query Supabase tables directly or invoke raw fetch calls**.

```text
Component / Hook
       │
       ▼
Service Container (src/services/index.ts)
       │
       ├──► When VITE_USE_MOCK_SERVICES=true  ──► MockServices (realistic datasets & delay)
       │
       └──► When VITE_USE_MOCK_SERVICES=false ──► SupabaseServices (direct client queries + RLS)
```

### Removal of Redundant HTTP Abstractions
In Stage 1.5, we audited and removed the generic `ApiClient` wrapper class. Because Supabase provides an authenticated, token-managed client that respects RLS, wrapping Supabase queries in an additional generic HTTP layer was an unnecessary abstraction. External AI endpoints are proxied securely through Supabase Edge Functions.

---

## 5. State Management Architecture

State is cleanly separated into four distinct tiers:

1. **Local UI State (`useState` / `useReducer`):**
   - Controlled input text, active tab toggles, modal open/close states, accordion expansions.
2. **Form State:**
   - Managed locally inside forms with explicit validation before submission.
3. **Server / Async State (`useAsync`):**
   - Data fetched from services, with loading, error, unmount protection, and refetch capabilities.
4. **Global Application Contexts:**
   - **`AuthContext`:** User session, credentials, onboarding state, authentication status, and live `supabase.auth.onAuthStateChange` subscription.
   - **`ScanFlowContext`:** Ephemeral multi-step pipeline state holding the uploaded image, Vision AI detections, Value AI evaluations, selected path, and matched receiver across route transitions (`/scan` -> `/scan/review` -> `/scan/analyze` -> `/scan/result` -> `/receivers` -> `/handover/confirm`).

---

## 6. Error Normalization & Security Safeguards

- **Error Normalization ([`AppError.fromSupabase`](file:///C:/Users/sujan/Downloads/a%20start/src/services/api/apiError.ts)):** Raw Postgres errors, constraint names, table structures, and sensitive SQL are stripped from user-facing presentations. Codes are mapped to:
  - `AUTHENTICATION_ERROR`
  - `AUTHORIZATION_ERROR`
  - `VALIDATION_ERROR`
  - `NOT_FOUND`
  - `NETWORK_ERROR`
  - `DATABASE_ERROR`
- **Secret Protection:** Client applications only consume `VITE_SUPABASE_PUBLISHABLE_KEY`. `SUPABASE_SERVICE_ROLE_KEY` is strictly prohibited from client repositories and bundles.
