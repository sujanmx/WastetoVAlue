# Waste2Value — Desktop Design.md
## Professional Desktop Web UX/UI Specification
### Version 1.0

> **Product:** Waste2Value
> **Tagline:** “Don't Throw It Away. Find Its Next Value.”
> **Primary platform:** Desktop Web
> **Design direction:** Technical Minimalism + Precision Eco-Tech
> **Target widths:** 1024, 1280, 1440, 1600, 1920px

---

# 1. Product Vision

Waste2Value is a circular-economy platform that turns discarded materials into practical next-value opportunities through:

1. AI-assisted identification
2. AI-assisted value-path recommendation
3. AI-assisted receiver matching

The desktop product must feel like a real modern product, not a generic hackathon dashboard.

Product personality:

- Precise
- Calm
- Intelligent
- Trustworthy
- Human
- Operational
- Environmentally responsible
- Premium

Avoid:

- Generic green startup templates
- Excessive leaves/recycling icons
- Neon green
- Giant gradients
- Excessive glassmorphism
- Excessive rounded cards
- Cartoon illustrations
- Fake environmental statistics
- Fake AI certainty
- Dashboard clutter

---

# 2. Core Product Principle

The product journey is:

```text
UNDERSTAND
    ↓
DECIDE
    ↓
CONNECT
    ↓
COMPLETE
    ↓
TRACK
```

Primary user journey:

```text
Landing
 ↓
Authentication
 ↓
Onboarding
 ↓
Home
 ↓
Scan / Add Item
 ↓
Image Review
 ↓
Vision AI
 ↓
Item Understanding
 ↓
Value AI
 ↓
Circular Value Matrix
 ↓
Matching AI
 ↓
Receiver Discovery
 ↓
Receiver Detail
 ↓
Handover Confirmation
 ↓
Handover Success
 ↓
Item Tracking
 ↓
Impact
```

Every screen must answer:

- Where am I?
- What is happening?
- What can I do?
- What happens next?

---

# 3. Desktop Information Architecture

## Primary navigation

Persistent left sidebar:

```text
Waste2Value

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

Sidebar width:

**240–256px**

Recommended:

**256px**

Main workspace should never sit underneath the sidebar.

---

# 4. Desktop Layout System

## Grid

Use a 12-column desktop grid.

```text
Max content width: 1440px
Outer margin: 32–48px
Column gap: 24px
Section gap: 32–48px
```

At 1440px:

```text
┌──────────────┬──────────────────────────────────────────────┐
│   SIDEBAR    │                 WORKSPACE                    │
│    256px     │                                              │
│              │                 max 1440px                   │
└──────────────┴──────────────────────────────────────────────┘
```

Do not stretch content indefinitely on 1600–1920px screens.

Use whitespace instead of oversized components.

---

# 5. Desktop Breakpoints

## 1024–1199px

- Persistent sidebar
- Reduced content margins
- Two-column layouts where possible
- Secondary information can collapse
- No horizontal scrolling

## 1200–1439px

- Full sidebar
- Full 12-column system
- Two-column and three-column layouts

## 1440–1599px

Preferred desktop composition:

- Full navigation
- Comfortable whitespace
- Multi-panel analysis
- Receiver discovery with filters

## 1600–1920px

Do not simply enlarge UI.

Instead:

- maintain readable content width
- increase whitespace
- preserve hierarchy
- keep important controls predictable

---

# 6. UX Laws

Apply these laws throughout the product.

## Jakob's Law

Use familiar SaaS patterns for:

- navigation
- search
- forms
- uploads
- filters
- confirmation
- settings

## Fitts's Law

Primary controls:

- minimum 44px height
- strong visual hierarchy
- adequate spacing
- predictable placement

## Hick's Law

Reduce choices.

Use progressive disclosure.

```text
Identify
 ↓
Understand
 ↓
Choose Value
 ↓
Find Receiver
 ↓
Complete
```

## Miller's Law

Group information into meaningful chunks.

## Gestalt Principles

Apply:

- proximity
- similarity
- continuity
- common region
- figure-ground
- visual hierarchy

## Aesthetic-Usability Effect

Premium visual quality should reinforce perceived usability.

## Doherty Threshold

Give immediate feedback for:

- upload
- scan
- save
- selection
- confirmation

## Zeigarnik Effect

Show workflow progress:

```text
01 Identify
02 Assess
03 Choose Value
04 Find Receiver
05 Complete
```

## Tesler's Law

The system should handle complexity instead of forcing users to do it manually.

## Recognition Over Recall

Actions should be visible and contextual.

## Visibility of System Status

Never leave the user wondering whether an operation is running.

## Error Prevention

Prevent invalid actions before submission.

## Progressive Disclosure

Show advanced information only when useful.

---

# 7. Visual Design System

## Colors

```text
Canvas          #F7F8F5
Surface         #FFFFFF
Primary Text    #122019
Secondary Text  #66736B
Brand Green     #176B45
Deep Forest     #0B3324
Soft Green      #E8F2EC
Border          #DDE4DF
Success         #247A4A
Warning         #A66A00
Error           #B42318
```

Use green as a meaningful brand/action color, not as decoration everywhere.

---

# 8. Typography

Primary typeface:

**Inter**

Optional technical typeface:

**JetBrains Mono**

Desktop scale:

```text
Display       48–64px
H1            32–44px
H2            24–32px
H3            18–24px
Body          14–16px
Small         12–13px
```

Use strong hierarchy and comfortable line height.

---

# 9. Spacing

Use an 8px spacing system.

```text
4px
8px
16px
24px
32px
40px
48px
64px
```

Avoid arbitrary spacing.

---

# 10. Shape Language

Architectural curvature:

```text
Controls       6–8px
Inputs         8px
Buttons        8–10px
Cards          10–12px
Large panels   12–16px
Pills          only for tags/status/filters
```

Avoid making every component a pill.

---

# 11. Desktop Navigation

Sidebar states:

### Default

Icon + label.

### Active

- soft green background
- brand green icon
- primary text
- subtle left indicator if needed

### Hover

Subtle surface change.

### Collapsed

If implemented:

- icon-only rail
- tooltips
- preserve keyboard accessibility

Do not hide essential navigation without a clear interaction.

---

# 12. Global Header

Desktop header should contain:

Left:

- page title
- optional breadcrumb

Right:

- search where relevant
- notifications if implemented
- profile/avatar

Avoid putting excessive controls into the header.

---

# 13. Home Dashboard

Heading:

**Good morning, [Name].**

Supporting text:

**Turn something unwanted into something useful.**

Primary CTA:

**Scan Your Waste**

Secondary CTA:

**View My Items**

Desktop composition:

```text
┌─────────────────────────────────────────────────────────────┐
│ Good morning, [Name].                         Profile       │
│ Turn something unwanted into something useful.              │
│                                                             │
│ [ Scan Your Waste ]   [ View My Items ]                     │
├──────────────────────────────┬──────────────────────────────┤
│ QUICK SCAN                   │ RECENT ACTIVITY              │
│ Upload / Camera              │ Recent item                  │
│                              │ Current status               │
├──────────────────────────────┴──────────────────────────────┤
│ VALUE PATHS                                                 │
│ Reuse        Donate        Resell        Recycle            │
└─────────────────────────────────────────────────────────────┘
```

Do not fill the dashboard with meaningless statistics.

---

# 14. Scan Screen

Heading:

**Give your item a second look.**

Desktop layout:

```text
┌──────────────────────────────┬──────────────────────────────┐
│                              │ HOW IT WORKS                 │
│      IMAGE / CAMERA AREA     │                              │
│                              │ 1. Identify item             │
│                              │ 2. Assess condition          │
│                              │ 3. Find next value           │
│                              │                              │
│ [Take Photo] [Upload Image]  │ Supported formats            │
└──────────────────────────────┴──────────────────────────────┘
```

The upload zone must be visually dominant.

Support:

- drag and drop
- file picker
- camera where available

---

# 15. Image Review

After upload:

```text
┌─────────────────────────────────────────────────────────────┐
│ Review Image                                                 │
├────────────────────────────────┬────────────────────────────┤
│                                │ IMAGE DETAILS               │
│          IMAGE                 │                              │
│                                │ Good quality                │
│                                │ Object visible              │
│                                │                              │
│                                │ [Replace Image]             │
│                                │ [Analyze Item]              │
└────────────────────────────────┴────────────────────────────┘
```

Do not start analysis without clear user intent unless explicitly designed as auto-analysis.

---

# 16. AI Analysis

Heading:

**Understanding your item**

Show meaningful stages:

```text
01 Detecting object
02 Identifying material
03 Assessing condition
```

Use a clean progress indicator.

Do not use fake technical details.

Do not expose invented model names or fabricated confidence.

---

# 17. Three-AI Architecture

The three models should appear as one connected intelligence system.

## Model 1 — Vision AI

Question:

**What is this?**

Output:

- object
- material
- category
- condition
- confidence

UI identity:

**Teal**

---

## Model 2 — Value AI

Question:

**What should happen to it?**

Evaluate:

- condition
- material
- reuse potential
- donation suitability
- resale potential
- recycling potential
- potential demand
- effort
- distance

Output:

```text
Reuse
Donate
Resell
Recycle
```

UI identity:

**Warm Amber**

---

## Model 3 — Matching AI

Question:

**Who can take it?**

Evaluate:

- material
- category
- condition
- receiver requirements
- location
- distance
- availability

UI identity:

**Indigo**

These colors are accents only. The product must remain visually unified.

---

# 18. AI Trust UX

AI is an assistant, not an authority.

Use:

**AI-assisted assessment**

**Recommended**

**Potential value**

**Likely suitable**

Avoid:

**Guaranteed**

**100% accurate**

**AI says this is definitely correct**

Allow:

**Looks incorrect?**

**Correct result**

---

# 19. Analysis Result

Example:

```text
Old Wooden Chair

Furniture
Wood

Condition
Usable

AI-assisted identification
High confidence
```

Then:

**What should happen to this item?**

Continue into the Circular Value Matrix.

---

# 20. Circular Value Matrix

This is the signature Waste2Value interaction.

Concept:

```text
                    REUSE
                      ↑
                      │
DONATE ←──────── ITEM ────────→ RESELL
                      │
                      ↓
                   RECYCLE
```

Do not make it a generic pie chart.

The recommended path should receive:

- stronger border
- subtle elevation
- recommendation badge
- concise explanation

Example:

```text
RECOMMENDED

REUSE

Why?

✓ Usable condition
✓ Repairable material
✓ Potential local demand

[Choose Reuse]
```

Alternative paths remain available.

---

# 21. Value Decision Flow

```text
AI Recommendation
       ↓
Why?
       ↓
User Review
       ↓
Accept Recommendation
       OR
Choose Alternative
       ↓
Continue
```

The user always remains in control.

---

# 22. Receiver Discovery

Heading:

**Find a place for it.**

Desktop should support information density.

Recommended layout:

```text
┌───────────────┬─────────────────────────────────────────────┐
│ FILTERS       │ RECEIVER RESULTS                           │
│               │                                             │
│ Distance      │ Receiver card                               │
│ Type           │ Receiver card                              │
│ Material       │ Receiver card                              │
│ Availability   │ Receiver card                              │
└───────────────┴─────────────────────────────────────────────┘
```

Optional map-ready area:

```text
┌──────────────────────────────┬──────────────────────────────┐
│ Receiver list                │ Map / geographic context     │
└──────────────────────────────┴──────────────────────────────┘
```

Do not fabricate map or location data.

---

# 23. Receiver Card

Each receiver card should communicate:

- name
- type
- distance
- accepted materials/items
- availability
- verification state
- primary action

Example:

```text
Community Furniture Reuse Center

Reuse organization
2.4 km away

Accepts:
Wood furniture
Repairable furniture

[View Details]
```

If verification is not real:

**Verification status unavailable**

or:

**Demo receiver**

Never fabricate verification.

---

# 24. Receiver Detail

Desktop two-column layout:

```text
┌──────────────────────────────┬──────────────────────────────┐
│ RECEIVER INFORMATION         │ YOUR ITEM                    │
│                              │                              │
│ Name                         │ Wooden Chair                 │
│ Type                         │                              │
│ Distance                     │ Reuse                        │
│ Accepted items               │                              │
│ Availability                 │                              │
│ Verification                │                              │
│                              │                              │
│ [Select Receiver]            │                              │
└──────────────────────────────┴──────────────────────────────┘
```

The user should understand the match before confirming.

---

# 25. Handover Confirmation

Heading:

**Review your handover**

Show:

```text
ITEM
Wooden Chair

VALUE PATH
Reuse

RECEIVER
Community Furniture Reuse Center

ACTION
Handover
```

Primary:

**Confirm Handover**

Secondary:

**Back**

Do not make confirmation destructive or confusing.

---

# 26. Handover Success

Heading:

**Your item has a next step.**

Show:

- item
- receiver
- selected path
- current status
- date

Primary:

**Track Item**

Secondary:

**Back to Home**

Use subtle success animation.

Respect reduced-motion settings.

---

# 27. Item Tracking

Use a clear desktop timeline.

```text
01 Identified
      ↓
02 Value Path Selected
      ↓
03 Receiver Found
      ↓
04 Handover Scheduled
      ↓
05 Completed
```

Highlight only the current state.

Do not fabricate future events.

Example:

```text
CURRENT STATUS

Receiver selected

NEXT STEP

Arrange handover
```

---

# 28. My Items

Desktop table/card hybrid.

Recommended columns:

```text
Item
Category
Value Path
Receiver
Status
Updated
Action
```

Allow:

- search
- filters
- sort
- status filtering

Use cards when the viewport becomes too narrow for a table.

---

# 29. Discover

Discover should help users find circular opportunities.

Sections:

- Nearby receivers
- Reuse opportunities
- Donation organizations
- Recycling options
- Community listings

Desktop:

```text
Search
Filters
Results
Optional geographic context
```

---

# 30. Impact Dashboard

Heading:

**Your impact**

Focus on actual user activity.

Examples:

```text
Items given a next value
Items reused
Items donated
Items resold
Items recycled
```

Any environmental calculation must be labeled:

- Estimated
- Prototype calculation
- Demo data

Never present fabricated scientific savings as verified facts.

---

# 31. Profile

Show:

- avatar
- name
- email
- account information
- activity summary
- preferences

Keep the page focused.

---

# 32. Settings

Sections:

```text
Account
Notifications
Privacy
Accessibility
Appearance
Data
```

Use standard settings patterns.

Do not bury important controls.

---

# 33. Empty States

Example:

**No items yet**

Your saved items will appear here.

Primary:

**Scan Your Waste**

Empty states should provide a next action.

---

# 34. Error States

## AI Error

**We couldn't confidently understand this image.**

Actions:

- Try Another Image
- Enter Item Manually

## No Receiver

**No suitable receiver found nearby.**

Actions:

- Expand Search
- Choose Another Value Path

## Network

**Something went wrong while connecting.**

Action:

**Retry**

Preserve user input where possible.

---

# 35. Loading States

Use skeletons for content-heavy screens.

Use meaningful processing states for AI.

Avoid indefinite spinners.

AI processing:

```text
Understanding your item

✓ Detecting object
● Identifying material
○ Assessing condition
```

---

# 36. Micro-Interactions

Use subtle, purposeful motion.

Examples:

- button press feedback
- card hover
- upload preview
- selection state
- progress transitions
- success confirmation

Do not use:

- excessive bouncing
- particle effects
- unnecessary parallax
- decorative animation

Motion must communicate:

**state, progress, continuity, completion**

---

# 37. Accessibility

Target:

**WCAG 2.2 AA**

Requirements:

- keyboard navigation
- visible focus states
- semantic HTML
- ARIA labels where needed
- minimum 44px interactive target
- sufficient contrast
- never rely on color alone
- logical tab order
- reduced-motion support
- readable typography
- accessible status updates

Use:

`aria-live="polite"`

for dynamic AI/status updates where appropriate.

---

# 38. Desktop User Journey

## First-time user

```text
Landing
 ↓
Sign Up / Google
 ↓
Minimal Onboarding
 ↓
Home
```

## Returning user

```text
Session
 ↓
Home
```

## Core task

```text
Home
 ↓
Scan
 ↓
Upload
 ↓
Review
 ↓
Vision AI
 ↓
Result
 ↓
Value Matrix
 ↓
Choose Path
 ↓
Matching AI
 ↓
Receiver Discovery
 ↓
Receiver Detail
 ↓
Confirm
 ↓
Success
 ↓
Tracking
```

## Alternative AI decision

```text
AI Recommendation
 ↓
Why?
 ↓
Choose recommended
OR
Choose alternative
 ↓
Continue
```

---

# 39. Desktop Analysis Workspace

For desktop, use simultaneous context instead of forcing users through unnecessary navigation.

Recommended:

```text
┌───────────────┬────────────────────────┬──────────────────────┐
│ ITEM          │ AI ANALYSIS            │ VALUE PATH            │
│               │                        │                       │
│ Image         │ Identification         │ Recommended           │
│ Name          │ Material               │ Reuse                 │
│ Category      │ Condition              │                       │
│ Condition     │ Reasoning              │ Alternatives           │
│               │                        │                       │
└───────────────┴────────────────────────┴──────────────────────┘
```

This is a key desktop advantage.

---

# 40. Desktop Receiver Workspace

Use:

```text
┌─────────────────┬─────────────────────────────┬───────────────┐
│ FILTERS         │ RECEIVERS                   │ CONTEXT       │
│                 │                             │               │
│ Distance        │ Receiver cards              │ Map / details │
│ Type             │                             │               │
│ Material         │                             │               │
│ Availability     │                             │               │
└─────────────────┴─────────────────────────────┴───────────────┘
```

If a map is unavailable, replace it with useful receiver context instead of an empty map placeholder.

---

# 41. Desktop Interaction Density

Desktop should provide more context than mobile without becoming cluttered.

Prioritize:

1. Current task
2. Main content
3. Relevant context
4. Secondary actions
5. Metadata

Never prioritize decoration over task completion.

---

# 42. User Control

AI recommends.

**USER DECIDES.**

The user must always be able to:

- inspect recommendation
- see reasoning
- choose another value path
- correct identification
- go back
- cancel
- retry

---

# 43. Data Honesty

Clearly label prototype information:

- Demo data
- Estimated
- Prototype calculation
- AI-assisted
- Potential value

Never fabricate:

- receiver verification
- environmental impact
- resale price
- live availability
- AI certainty
- completed handover

---

# 44. Component System

Build a reusable desktop component system.

Components:

- Sidebar
- Header
- Breadcrumbs
- Buttons
- Inputs
- Search
- Filters
- Tabs
- Cards
- Tables
- Badges
- Status indicators
- Progress indicators
- AI insight cards
- Value Matrix
- Receiver cards
- Timeline
- Upload zone
- Image preview
- Toasts
- Modals
- Empty states
- Error states
- Skeleton loaders

Each interactive component should support:

- default
- hover
- focus
- active
- disabled
- loading
- error
- success

where applicable.

---

# 45. Final Desktop Design Quality Bar

The result should feel like:

**A serious modern AI-powered circular economy platform.**

The design should combine:

```text
Modern SaaS
      +
AI Product
      +
Marketplace
      +
Sustainability
      +
Operational Workflow
```

The final desktop experience must be:

- visually coherent
- responsive within desktop breakpoints
- information-dense but calm
- accessible
- trustworthy
- AI-transparent
- action-oriented
- production-ready

Do not design isolated screens.

Design one complete product ecosystem where:

```text
UNDERSTAND
    ↓
DECIDE
    ↓
CONNECT
    ↓
COMPLETE
    ↓
TRACK
```

is visible in the structure of the product itself.
