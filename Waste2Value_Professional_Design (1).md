---
name: Waste2Value — Professional Product Design System
version: 2.0
status: production-ready-design-spec
product: Waste2Value
design_direction: Technical Minimalism
platforms: web, tablet, mobile
---

# Waste2Value — Professional Product Design System

> **Don't Throw It Away. Find Its Next Value.**

Waste2Value is an AI-assisted circular-economy platform that helps users understand discarded materials, identify their most practical next value, connect with suitable receivers, complete a handover, and track the resulting journey.

The core product loop is:

**Waste → Understand → Value Path → Receiver → Handover → Impact**

The interface must feel like a **real premium climate-tech / circular-commerce product**, not a generic environmental website and not a typical student hackathon dashboard.

---

# 1. Product Design North Star

## Design objective

Make a complex circular-economy workflow feel as simple as:

> **“I have something I don't need anymore. Tell me what I should do with it.”**

The product should progressively answer five questions:

1. **What is this?**
2. **What condition is it in?**
3. **What is its best practical next value?**
4. **Who can receive it?**
5. **What happened after I handed it over?**

## Product personality

- Calm
- Precise
- Intelligent
- Trustworthy
- Human
- Environmentally responsible
- Operationally useful
- Premium

## Avoid

- Generic green-startup aesthetics
- Excessive leaves/recycling symbols
- Neon green
- Childish illustrations
- Excessive gradients
- Excessive glassmorphism
- Giant rounded cards everywhere
- Dashboard clutter
- Fake environmental statistics
- Fake AI certainty
- Decorative animation without purpose

---

# 2. UX Design Principles

Apply these principles throughout the product.

## Nielsen's usability heuristics

### Visibility of system status
Always show meaningful state:

- Uploading
- Processing
- AI analysis
- Recommendation ready
- Receiver matched
- Handover pending
- Completed

### Match with the real world
Use understandable language:

- Scan
- Upload
- Reuse
- Donate
- Resell
- Recycle
- Find receiver
- Handover

Avoid unnecessary technical terminology.

### User control and freedom
Users should be able to:

- Go back
- Cancel
- Retry
- Edit item details
- Change value path
- Change receiver
- Cancel a pending action where supported

### Consistency
Buttons, forms, cards, statuses, navigation, spacing and interaction patterns must remain consistent.

### Error prevention
Before meaningful or potentially irreversible actions:

- Show a summary
- Explain what will happen
- Provide Cancel / Back
- Require explicit confirmation

### Recognition over recall
Show:

- Recent items
- Previous actions
- Saved receivers
- Recent searches
- Impact history

### Error recovery
Every error should answer:

**What happened?**

**What can I do now?**

---

# 3. Laws of UX

## Fitts's Law

Important interactive elements use a minimum ~44–48px target.

Primary actions:

- Scan
- Upload
- Analyze
- Continue
- Confirm
- Request handover

must be easy to reach.

## Hick's Law

Reduce unnecessary choices.

The analysis screen should clearly establish one recommended path while still exposing alternatives.

Example:

**Recommended — Reuse**

Secondary:

Donate · Resell · Recycle

## Gestalt Principles

Use:

- Proximity
- Similarity
- Common region
- Continuity
- Figure-ground
- Common alignment

Do not visually group unrelated information.

## Jakob's Law

Use interaction patterns users already understand.

Examples:

- Search behaves like search
- Filters behave like filters
- Password visibility behaves like standard password controls
- Navigation remains stable
- Back navigation behaves predictably

## Aesthetic-Usability Effect

Visual polish should improve perceived usability without sacrificing clarity.

## Von Restorff Effect

Use visual emphasis sparingly for:

- Recommended value path
- Primary CTA
- Current tracking stage
- Important warning

## Tesler's Law

Hide system complexity where possible.

The user should not need to understand AI pipelines, matching algorithms, databases or scoring models.

## Doherty Threshold

Keep interactions responsive and communicate progress immediately when processing takes time.

## Peak-End Rule

Make the completion state especially clear and reassuring.

---

# 4. Accessibility

Target **WCAG 2.2 AA**.

Requirements:

- Strong text contrast
- Visible keyboard focus
- Semantic labels
- Proper `<label>` associations
- Accessible form errors
- `aria-live="polite"` for dynamic status
- Keyboard navigation
- Screen-reader-friendly controls
- Minimum 44–48px interactive targets
- Never communicate important information through color alone
- Respect `prefers-reduced-motion`

Focus ring:

```text
1px brand-green border
+
3px soft green focus halo
```

---

# 5. Visual Language

## Design movement

### Technical Minimalism

Combine:

- Institutional precision
- Circular-economy warmth
- Modern SaaS clarity
- Restrained technology cues

Reference the **clarity and discipline** of modern products such as Linear, Stripe, Vercel and Apple without copying their interfaces.

---

# 6. Color System

## Core tokens

| Token | Value | Purpose |
|---|---|---|
| Canvas | `#F7F8F5` | Main background |
| Surface | `#FFFFFF` | Cards and functional surfaces |
| Primary Text | `#122019` | Main typography |
| Secondary Text | `#66736B` | Supporting content |
| Brand Green | `#176B45` | Primary brand interaction |
| Deep Forest | `#0B3324` | Primary CTA / high contrast |
| Soft Green | `#E8F2EC` | Selected/soft state |
| Border | `#DDE4DF` | Structural borders |
| Success | `#247A4A` | Positive state |
| Warning | `#A66A00` | Warning |
| Error | `#B42318` | Error |

Green must be used intentionally, not as a background for the entire product.

---

# 7. Typography

Primary font:

**Inter**

Technical data only:

**JetBrains Mono**

## Type scale

| Style | Size | Weight | Line height |
|---|---:|---:|---:|
| Display | 48px | 600 | 56px |
| Display Mobile | 32px | 600 | 40px |
| H1 | 32px | 600 | 40px |
| H1 Mobile | 24px | 600 | 32px |
| H2 | 24px | 600 | 32px |
| H3 | 18px | 600 | 24px |
| Body Large | 16px | 400 | 24px |
| Body | 14px | 400 | 20px |
| Small | 12px | 400 | 16px |
| Label | 13px | 500 | 16px |
| Micro Label | 11px | 600 | 14px |

Use negative tracking only on larger headings.

Use tabular numerals for metrics and telemetry.

---

# 8. Layout System

## Grid

Desktop:

- 12-column grid
- Maximum content width: 1440px
- 24px desktop gutters

Mobile:

- 4-column structure
- 16px page margins
- 16px gutters

## Spacing

Use an 8px spacing system:

```text
4
8
12
16
24
32
40
48
64
80
96
```

Avoid arbitrary spacing.

---

# 9. Shape Language

The product uses **architectural curvature**, not excessive rounded UI.

| Component | Radius |
|---|---:|
| Small control | 6px |
| Input | 8px |
| Button | 8–10px |
| Card | 10–12px |
| Large panel | 12–16px |
| Status badge | 9999px |

Do not turn every component into a pill.

---

# 10. Elevation

Prefer borders over shadows.

## Resting surface

```text
background: #FFFFFF
border: 1px solid #DDE4DF
```

## Raised surface

```text
border: 1px solid #DDE4DF
shadow:
0 2px 4px rgba(18,32,25,.03),
0 8px 16px rgba(18,32,25,.04)
```

## Floating surface

For dialogs, command palettes and drawers:

```text
border: 1px solid #DDE4DF
shadow:
0 16px 32px -4px rgba(18,32,25,.08),
0 4px 8px -2px rgba(18,32,25,.03)
```

---

# 11. Component System

## Buttons

### Primary

- Deep forest background
- White text
- 48px minimum height
- 8–10px radius
- Subtle inset highlight

### Secondary

- White background
- Dark text
- 1px border

### Tertiary

- Transparent
- Secondary text
- Minimal visual weight

### Destructive

Use only for destructive actions.

Never place destructive actions adjacent to the primary CTA without separation.

---

# 12. Forms

Inputs:

- 48–52px height
- White surface
- 1px border
- Clear label
- Placeholder only as supporting information

Focus:

```text
border: #176B45
box-shadow: 0 0 0 3px rgba(23,107,69,.12)
```

Validation:

- Validate early when helpful
- Keep valid information after errors
- Explain how to fix the problem
- Do not rely only on red borders

---

# 13. Status System

Use icon + text + color.

Examples:

```text
Analyzing
Recommendation ready
Listed
Matched
Handover pending
Completed
```

Never use color alone.

---

# 14. Navigation Architecture

## Desktop sidebar

```text
WASTE2VALUE

Home
Scan
My Items
Discover
Impact

----------------

Help
Settings
Profile
```

Sidebar:

- ~240px
- Stable
- Minimal
- Quiet
- Strong active state

## Mobile navigation

```text
Home
Scan
Items
Impact
Profile
```

Scan receives stronger emphasis.

---

# 15. Core Product Flow

```text
LANDING
   ↓
AUTHENTICATION
   ↓
ONBOARDING
   ↓
HOME
   ↓
SCAN / UPLOAD
   ↓
IMAGE REVIEW
   ↓
AI ANALYSIS
   ↓
ANALYSIS RESULT
   ↓
VALUE PATH
   ↓
RECEIVER DISCOVERY
   ↓
RECEIVER DETAIL
   ↓
CONFIRM HANDOVER
   ↓
SUCCESS
   ↓
TRACKING
   ↓
IMPACT
```

---

# 16. Screen Specification — Authentication

## Login

### Purpose
Fast, trustworthy entry.

### Layout

Desktop split screen:

**Left**
- Waste2Value brand
- Tagline
- Circular lifecycle visual
- Short mission statement

**Right**
- 420–460px authentication panel

### Copy

**Welcome back**

Continue your journey toward a circular future.

Fields:

- Email
- Password

Controls:

- Remember me
- Forgot password?

Actions:

- Sign in
- Continue with Google
- Create account

States:

- Default
- Focus
- Invalid
- Loading
- Authentication error
- Success

Never use fake/demo authentication.

---

# 17. Screen Specification — Sign Up

## Create your Waste2Value account

Fields:

- Full name
- Email
- Password
- Confirm password

Optional:

- Location

Primary:

**Create account**

Secondary:

**Continue with Google**

Footer:

Already have an account? **Sign in**

Keep the form short.

---

# 18. Screen Specification — Onboarding

Maximum 3 steps.

## Step 1

**What brings you to Waste2Value?**

Options:

- Household
- Student
- Business
- Recycler
- NGO / Community

## Step 2

**What are you interested in?**

- Reuse
- Donation
- Resale
- Recycling

## Step 3

**Find opportunities near you**

Explain why location is useful.

Actions:

- Allow location
- Enter manually
- Skip for now

Show progress.

---

# 19. Screen Specification — Home

This is the primary workspace.

Header:

**Good morning, [Name].**

Supporting:

**Turn something unwanted into something useful.**

Primary:

**Scan waste**

Secondary:

**Upload photo**

## Overview metrics

Use compact, credible metrics:

- Items processed
- Items recovered
- Items donated/reused
- Estimated value recovered

If values are prototype data, explicitly label them.

## Continue where you left off

Show recent items.

Each item:

- Image
- Name
- Category
- Current status
- Recommended action

---

# 20. Screen Specification — Scan

Headline:

**Give your item a second look.**

Large central upload/camera zone.

Primary:

**Take photo**

Secondary:

**Upload image**

Categories:

- Electronics
- Furniture
- Plastic
- Paper
- Metal
- Clothing
- Other

Helper:

**Clear photos produce better identification.**

Keep this screen extremely focused.

---

# 21. Screen Specification — Image Review

Show uploaded image prominently.

Question:

**Does this look right?**

Actions:

**Analyze item**

**Retake**

**Choose another**

Quality hints:

- Good lighting
- Complete item visible
- Avoid obstruction

---

# 22. Screen Specification — AI Analysis

Headline:

**Understanding your item**

Use progressive status:

```text
✓ Image received
✓ Identifying material
● Assessing condition
○ Evaluating value paths
○ Finding relevant opportunities
```

Do not show fake percentage completion.

Do not expose unnecessary model terminology.

---

# 23. Screen Specification — Analysis Result

Example:

# Old Wooden Chair

Furniture

**AI-assisted identification**

Condition:
Usable

Confidence:
High

Then:

## Recommended next value

### REUSE

Explain why.

Example:

> Based on the apparent condition, keeping the item in use may preserve more practical value than immediately recycling its materials.

Alternative paths:

- Reuse
- Donate
- Resell
- Recycle

Include:

**Is this incorrect?**

**Correct result**

AI must be presented as an assessment, not absolute truth.

---

# 24. Signature Screen — Circular Value Matrix

This is the product's central decision experience.

## Heading

**What should happen to this item?**

Show four pathways:

### Reuse
Keep the item in use.

### Donate
Give it to someone who needs it.

### Resell
Recover economic value.

### Recycle
Recover useful materials.

The system may visually emphasize one recommendation.

## Recommendation reasoning

Show concise factors:

- Condition
- Material
- Potential demand
- Distance
- Recovery potential

Do not overload users with algorithmic detail.

Primary:

**Find opportunities**

---

# 25. Receiver Discovery

Headline:

**Find a place for it.**

Search:

**Search organizations, recyclers and reuse partners**

Filters:

- All
- Reuse
- Donation
- Resale
- Recycling

Additional:

- Distance
- Material
- Open now

## Receiver card

Example:

**GreenLoop Community**

Community reuse center

2.4 km

Accepts:

Furniture · Books · Electronics

Open until 6 PM

Action:

**View details**

Do not claim verification unless actual verification exists.

---

# 26. Receiver Detail

Show:

- Receiver name
- Type
- Location
- Distance
- Accepted materials
- Operating hours
- Description

## Why this match?

Show transparent matching reasons:

- Material match
- Condition match
- Distance

Primary:

**Request handover**

Secondary:

**Contact**

**Save**

---

# 27. Create Listing

Fields:

- Item
- Category
- Condition
- Quantity
- Description
- Photos
- Preferred value path
- Location
- Optional expected value

Actions:

**Preview**

**Create listing**

---

# 28. Confirm Handover

Heading:

**Ready to give this item its next value?**

Summary:

```text
ITEM
ACTION
RECEIVER
LOCATION
```

Primary:

**Confirm handover**

Secondary:

**Edit**

Keep confirmation calm and explicit.

---

# 29. Handover Success

Avoid excessive confetti.

Use a refined confirmation state.

Headline:

**Your item has a next step.**

Show:

- Selected path
- Receiver
- Location
- Next action

Primary:

**Track item**

Secondary:

**Back to home**

---

# 30. Item Tracking

Visual timeline:

```text
Uploaded
   ↓
Analyzed
   ↓
Value path selected
   ↓
Receiver matched
   ↓
Handover
   ↓
Completed
```

Highlight the current stage.

Show timestamps only when actual data exists.

---

# 31. My Items

Tabs:

- All
- Active
- Completed

Item row/card:

- Image
- Item name
- Category
- Value path
- Receiver
- Status

Support:

- Edit
- View
- Cancel where applicable

---

# 32. Discover

Purpose:

Allow users to find receivers even before uploading an item.

Desktop:

**Map + list**

Mobile:

**List + optional map sheet**

Search:

**Find a recycler, NGO or reuse partner**

Filters:

- Category
- Distance
- Type
- Open now

---

# 33. Impact Dashboard

Headline:

**Your impact**

Primary metric:

**27 items given a second life**

Secondary metrics:

- Reused
- Donated
- Resold
- Recycled

Charts:

- Activity over time
- Material categories
- Value-path distribution
- Impact history

## Data honesty

Use:

**Estimated**

**Prototype calculation**

**Based on available information**

when metrics are not directly measured.

Never manufacture environmental claims.

---

# 34. Profile

Show:

- Avatar
- Name
- Email
- User type
- Impact summary

Navigation:

- My items
- Saved receivers
- Activity
- Settings

---

# 35. Settings

Sections:

## Account
- Profile
- Email
- Password

## Notifications
- Updates
- Handover alerts

## Location
- Current location
- Search radius

## Privacy
- Data permissions
- Image usage information

## Security
- Password
- Active sessions

## Accessibility
- Motion
- Text preferences

## Danger zone
- Delete account

Destructive actions must be separated.

---

# 36. Forgot Password

Headline:

**Reset your password**

Input:

Email

Primary:

**Send reset link**

Success:

**Check your email for a password reset link.**

Do not reveal whether an account exists.

---

# 37. Empty States

## My Items

**No items yet.**

Your first scan starts the journey.

CTA:

**Scan waste**

## Receivers

**No suitable matches nearby.**

Actions:

- Expand search
- Change filters

## Impact

**Your impact starts with your first item.**

CTA:

**Scan an item**

Empty states should guide the user forward rather than merely state that data is missing.

---

# 38. Error States

## AI analysis failure

**We couldn't identify this item.**

Try a clearer image or provide additional details.

CTA:

**Try again**

## Network failure

**You're offline.**

Check your connection and try again.

## Upload failure

**The image couldn't be uploaded.**

Try another image.

## Authentication failure

Use a clear, non-sensitive message.

Never expose implementation details or secret information.

---

# 39. AI Transparency

Every AI-generated result must be visually marked as:

**AI-assisted assessment**

Where applicable show:

- Confidence
- Supporting factors
- User correction

Never say:

- Guaranteed
- 100% accurate
- Certain

unless the product has actual evidence supporting that claim.

---

# 40. Trust & Safety

Never fabricate:

- Receiver verification
- Environmental impact
- Resale value
- AI certainty
- Real-world availability

Use:

- Estimated
- Potential
- AI-assisted
- Based on available information
- Demo data

For potentially hazardous materials, surface appropriate safety guidance.

---

# 41. Motion

Motion should explain state changes.

Use:

- Upload transition
- Analysis progression
- Selection feedback
- Navigation transitions
- Success confirmation

Animation should be:

- Fast
- Subtle
- Purposeful

Respect:

`prefers-reduced-motion`

Avoid decorative animation loops.

---

# 42. Responsive Strategy

## Desktop

- 1280–1440px optimized
- Sidebar navigation
- Multi-column layouts
- Map/list split where appropriate

## Tablet

- Condensed navigation
- Preserve content hierarchy
- Reduce columns before reducing readability

## Mobile

- 390–430px optimized
- Bottom navigation
- Single-column content
- Full-width primary actions
- No horizontal scrolling
- Important content before secondary metadata

Do not simply shrink desktop layouts.

Recompose them.

---

# 43. Data & Product Integrity

Prototype/demo information must be visibly distinguishable from verified real-world information.

Recommended labels:

```text
Demo data
Estimated
AI-assisted
Prototype calculation
Potential value
```

Do not use fake live metrics to make the product appear more successful.

---

# 44. MVP Priority

The actual hackathon implementation should prioritize one exceptional end-to-end journey.

## Primary demo

```text
LOGIN
 ↓
HOME
 ↓
SCAN WASTE
 ↓
UPLOAD ITEM
 ↓
AI ANALYSIS
 ↓
ITEM IDENTIFICATION
 ↓
RECOMMENDED VALUE PATH
 ↓
FIND RECEIVER
 ↓
RECEIVER DETAIL
 ↓
CONFIRM HANDOVER
 ↓
SUCCESS
 ↓
TRACK ITEM
 ↓
IMPACT
```

The user should be able to complete this flow with minimal clicks.

---

# 45. Screen Inventory

The design system should cover:

1. Landing
2. Login
3. Sign up
4. Forgot password
5. Reset password
6. Onboarding
7. Home dashboard
8. Scan material
9. Image review
10. AI analysis
11. Analysis result
12. Circular Value Matrix
13. Receiver discovery
14. Receiver detail
15. Create listing
16. Confirm handover
17. Handover success
18. Item tracking
19. My items
20. Discover
21. Impact dashboard
22. Profile
23. Settings
24. Empty states
25. Error states
26. Loading states

---

# 46. Design Quality Gate

Before considering any screen complete, verify:

### Hierarchy
- Is the user's next action immediately obvious?
- Is secondary information visually quieter?

### Consistency
- Are spacing, typography and controls from the same system?
- Does navigation remain stable?

### Accessibility
- Can the screen be used by keyboard?
- Are controls large enough?
- Is contrast sufficient?
- Does color-independent meaning exist?

### Trust
- Are AI results clearly labeled?
- Are estimates clearly labeled?
- Are real and demo data distinguishable?

### Responsiveness
- Does the screen recompose on mobile?
- Is there any horizontal scrolling?

### Interaction
- Are loading, error, empty and success states designed?
- Can the user recover from mistakes?

### Visual quality
- Is there unnecessary decoration?
- Are there too many cards?
- Are borders and shadows restrained?
- Does the interface feel like one product?

---

# 47. Final Art Direction

The final Waste2Value interface should feel like:

**A premium circular-intelligence operating system for everyday materials.**

It should communicate:

> **“We make the next step obvious.”**

The design should combine:

**Climate-tech credibility**
+
**Modern SaaS precision**
+
**Circular-economy warmth**
+
**AI transparency**
+
**Human-centered UX**

The result should be visually sophisticated enough for a professional startup presentation while remaining simple enough for a first-time user to understand immediately.

---

# 48. Stitch / UI Generation Instruction

When generating screens from this document:

1. Reuse the exact design tokens.
2. Maintain one coherent component system.
3. Do not invent unrelated colors.
4. Do not introduce random gradients.
5. Do not use excessive rounded cards.
6. Do not add decorative UI that does not support the task.
7. Prioritize whitespace and alignment.
8. Make the primary action visually dominant.
9. Create realistic loading/error/empty/success states.
10. Preserve AI/data transparency.
11. Make desktop and mobile compositions intentionally different.
12. Keep all screens visually connected.
13. Prefer product-grade details over decorative complexity.
14. Treat the **Circular Value Matrix** as the signature interaction.
15. Treat **Scan → AI → Value Path → Receiver → Handover → Impact** as the central product narrative.

## Final product feeling

**Premium. Quiet. Intelligent. Precise. Sustainable. Trustworthy.**

Not a hackathon template.

A believable production product.
