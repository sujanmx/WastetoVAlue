# Waste2Value — Phone Design.md
## Professional Mobile Web / Mobile-First UX/UI Specification
### Version 1.0

> **Product:** Waste2Value
> **Tagline:** “Don't Throw It Away. Find Its Next Value.”
> **Primary platform:** Phone / mobile-first web experience
> **Target widths:** 320px, 360px, 375px, 390px, 393px, 430px
> **Design direction:** Technical Minimalism + Precision Eco-Tech

---

# 1. Mobile Product Vision

Waste2Value is a circular-economy platform that helps people understand discarded items and find their next practical value through:

1. Vision AI — identify the item
2. Value AI — recommend the best next-value path
3. Matching AI — connect the item to an appropriate receiver

The phone experience must feel like a modern AI product, not a compressed desktop dashboard.

The mobile design should prioritize:

- speed
- clarity
- thumb reach
- camera-first interaction
- progressive disclosure
- one primary action at a time
- short decision paths
- clear feedback
- accessible controls
- trustworthy AI

The phone experience should feel:

**FAST · SIMPLE · INTELLIGENT · HUMAN · TRUSTWORTHY**

---

# 2. Core Mobile Principle

On phone, optimize the experience around:

```text
INTENT
  ↓
UNDERSTAND
  ↓
DECIDE
  ↓
ACT
  ↓
TRACK
```

Primary task:

```text
Home
 ↓
Scan
 ↓
Upload / Camera
 ↓
Review
 ↓
Vision AI
 ↓
Result
 ↓
Value AI
 ↓
Value Path
 ↓
Matching AI
 ↓
Receiver
 ↓
Handover
 ↓
Tracking
 ↓
Impact
```

Never make the mobile user navigate through unnecessary screens.

---

# 3. Mobile UX Laws

Apply these throughout the phone experience.

## Jakob's Law

Use familiar mobile patterns:

- bottom navigation
- sticky CTA
- camera/upload controls
- bottom sheets
- tabs
- cards
- search
- pull-free vertical scrolling
- familiar form patterns

## Fitts's Law

Primary touch targets:

**Minimum 44×44px**

Preferred:

**48×48px**

Important actions should be reachable without precision tapping.

## Hick's Law

Show fewer choices at once.

Prefer:

```text
Primary action
+
One secondary action
```

over a row of many competing buttons.

## Thumb Zone Principle

Primary actions should be located near the bottom of the viewport when practical.

Use:

- sticky bottom CTA
- bottom sheets
- bottom navigation
- reachable controls

Avoid placing the only important action at the extreme top-right.

## Progressive Disclosure

Show only what is necessary.

Example:

```text
Reuse recommended

Why?

[See reasoning]
```

The full AI reasoning is hidden until requested.

## Recognition Over Recall

Users should see what they can do.

Do not make users remember commands or gestures.

## Visibility of System Status

Every operation must show state:

- uploading
- analyzing
- matching
- saving
- completed
- failed

## Doherty Threshold

Give immediate visual feedback.

Example:

```text
Tap Upload
 ↓
Preview appears immediately
 ↓
Analyze button becomes active
```

## Zeigarnik Effect

Use a compact progress indicator during the core workflow.

```text
1 Identify
2 Assess
3 Choose
4 Connect
5 Complete
```

## Tesler's Law

The system should handle complexity.

The user should not manually determine:

- material category
- value path
- receiver suitability

## Error Prevention

Validate before expensive actions.

Example:

```text
Poor image
 ↓
"Image may be difficult to analyze"
 ↓
Retake / Continue
```

---

# 4. Mobile Navigation

Use bottom navigation.

```text
┌──────────────────────────────────────┐
│                                      │
│              CONTENT                 │
│                                      │
├──────────────────────────────────────┤
│ Home │ Scan │ Items │ Impact │ Profile│
└──────────────────────────────────────┘
```

Navigation items:

- Home
- Scan
- Items
- Impact
- Profile

## Scan emphasis

Scan should be visually emphasized because it is the core product action.

Do not make the Scan button visually overpower the rest of the interface to the point that it feels unrelated to the navigation system.

---

# 5. Mobile Header

Recommended:

```text
┌──────────────────────────────────────┐
│ ←   Page Title                 •••   │
└──────────────────────────────────────┘
```

Home may use:

```text
┌──────────────────────────────────────┐
│ Waste2Value                    Avatar│
└──────────────────────────────────────┘
```

Keep headers compact.

Do not overload them with controls.

---

# 6. Mobile Safe Areas

Support:

- iOS safe area
- Android navigation areas
- notches
- rounded displays
- browser UI variations

Use safe-area-aware padding for bottom navigation and sticky CTAs.

Do not place important controls directly against screen edges.

---

# 7. Mobile Layout

Base horizontal margin:

**16px**

For larger phones:

**16–20px**

Do not use excessive horizontal margins.

Content should occupy most of the available width.

No horizontal scrolling.

---

# 8. Mobile Typography

Primary typeface:

**Inter**

Optional technical typeface:

**JetBrains Mono**

Mobile scale:

```text
Display       34–40px
H1            28–32px
H2            22–26px
H3            18–20px
Body          15–16px
Small         13–14px
Label         12px
```

Body text must remain comfortably readable.

Avoid very small metadata.

---

# 9. Mobile Color System

Use the same core product palette:

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

AI accents:

```text
Vision AI       Teal
Value AI        Amber
Matching AI     Indigo
```

AI colors should be subtle accents, not three competing themes.

---

# 10. Mobile Shape Language

Use:

```text
Buttons         8–10px
Inputs          8px
Cards           10–14px
Large panels    14–18px
Bottom sheets   20–24px top radius
Status pills    Pill
```

Avoid turning every component into a pill.

---

# 11. Mobile Spacing

Use the 8px system:

```text
4px
8px
12px
16px
24px
32px
40px
48px
64px
```

Primary section spacing:

**24–32px**

---

# 12. Mobile Home

Heading:

**Good morning, [Name].**

Supporting text:

**Turn something unwanted into something useful.**

Primary action:

**Scan Your Waste**

Secondary:

**View My Items**

Recommended mobile layout:

```text
┌──────────────────────────────┐
│ Good morning, [Name].        │
│ Turn something unwanted      │
│ into something useful.       │
│                              │
│ [ Scan Your Waste ]          │
│                              │
├──────────────────────────────┤
│ Quick Scan                   │
│ [ Camera ] [ Upload ]        │
├──────────────────────────────┤
│ Recent Item                  │
│ Wooden Chair                 │
│ Reuse • In Progress          │
├──────────────────────────────┤
│ Value Paths                  │
│ Reuse  Donate                │
│ Resell Recycle               │
└──────────────────────────────┘
```

Avoid dashboard clutter.

---

# 13. Mobile Scan

Heading:

**Give your item a second look.**

The scan screen should be camera-first.

```text
┌──────────────────────────────┐
│ Give your item a second look │
│                              │
│                              │
│       CAMERA / IMAGE         │
│                              │
│                              │
│ [ Take Photo ]               │
│                              │
│ [ Upload Image ]             │
│                              │
└──────────────────────────────┘
```

Primary action should be thumb-friendly.

Allow:

- camera
- gallery
- file upload

Avoid unnecessary instructions.

---

# 14. Mobile Image Review

After upload:

```text
┌──────────────────────────────┐
│ Review Image                 │
│                              │
│       IMAGE PREVIEW          │
│                              │
│ Looks good?                  │
│                              │
│ [ Replace Image ]            │
│                              │
│ [ Analyze Item ]             │
└──────────────────────────────┘
```

Use a sticky bottom CTA when useful:

```text
──────────────────────────────
[ Analyze Item ]
```

---

# 15. Mobile AI Analysis

Heading:

**Understanding your item**

Show only meaningful progress.

```text
Understanding your item

✓ Detecting object
● Identifying material
○ Assessing condition
```

Use a compact progress indicator.

Do not show fake technical model information.

Do not use distracting AI animations.

---

# 16. Three-AI Mobile Experience

The three models should feel like a single intelligent workflow.

## Model 1 — Vision AI

Question:

**What is this?**

Output:

- item
- category
- material
- condition
- confidence

Visual accent:

**Teal**

---

## Model 2 — Value AI

Question:

**What should happen to it?**

Evaluate:

- condition
- material
- reuse
- donation
- resale
- recycling
- potential demand
- effort

Visual accent:

**Amber**

---

## Model 3 — Matching AI

Question:

**Who can take it?**

Evaluate:

- item
- material
- value path
- location
- receiver requirements
- distance
- availability

Visual accent:

**Indigo**

---

# 17. Mobile Analysis Result

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

Use a vertically stacked value interface.

---

# 18. Mobile Circular Value Matrix

Do not force the desktop spatial matrix into a tiny phone screen.

Transform it into a mobile decision stack:

```text
WHAT SHOULD HAPPEN TO THIS ITEM?

┌──────────────────────────────┐
│ RECOMMENDED                  │
│                              │
│ REUSE                        │
│                              │
│ ✓ Usable condition           │
│ ✓ Repairable material        │
│ ✓ Potential local demand     │
│                              │
│ [ Choose Reuse ]             │
└──────────────────────────────┘

┌──────────────────────────────┐
│ Donate                       │
│ Potentially suitable         │
└──────────────────────────────┘

┌──────────────────────────────┐
│ Resell                       │
│ Potential value              │
└──────────────────────────────┘

┌──────────────────────────────┐
│ Recycle                      │
│ Material recovery            │
└──────────────────────────────┘
```

The recommended option gets stronger emphasis.

Alternatives remain visible.

---

# 19. Mobile AI Reasoning

Use progressive disclosure.

Default:

```text
Reuse recommended

[Why?]
```

Expanded:

```text
Why?

✓ Usable condition
✓ Repairable construction
✓ Material retains value
✓ Potential local demand
```

Never overwhelm the user with AI reasoning.

---

# 20. Mobile Receiver Discovery

Heading:

**Find a place for it.**

Structure:

```text
Search receivers
[ Search ]

[ Filters ]

Receiver card
Receiver card
Receiver card
```

Use bottom sheet filters.

Example:

```text
FILTERS

Distance
○ 1 km
○ 5 km
○ 10 km

Receiver type
□ NGO
□ Reuse center
□ Recycler
□ Buyer

[Apply Filters]
```

---

# 21. Mobile Receiver Card

Show only the most important information:

```text
Community Furniture Reuse Center

Reuse organization
2.4 km away

Accepts:
Wood furniture
Repairable furniture

[View Details]
```

Avoid excessive metadata.

---

# 22. Mobile Receiver Detail

Use a full-screen detail page.

```text
← Receiver

Community Furniture Reuse Center

Reuse organization

2.4 km away

Accepted items
Wood furniture
Repairable furniture

Availability

Verification status

──────────────────────────────

[ Select Receiver ]
```

Use sticky bottom CTA:

```text
[ Select Receiver ]
```

---

# 23. Mobile Handover Confirmation

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

Use a sticky bottom action where appropriate.

---

# 24. Mobile Success

Heading:

**Your item has a next step.**

Show:

```text
✓

Wooden Chair

Reuse

Community Furniture Reuse Center

Current status:
Receiver selected
```

Primary:

**Track Item**

Secondary:

**Back to Home**

Use subtle success feedback.

Respect `prefers-reduced-motion`.

---

# 25. Mobile Item Tracking

Use a vertical timeline.

```text
✓ Identified

✓ Value Path Selected

● Receiver Found

○ Handover Scheduled

○ Completed
```

Current state should be visually dominant.

Never fabricate future completion.

---

# 26. Mobile My Items

Use compact item cards.

```text
┌──────────────────────────────┐
│ IMAGE   Wooden Chair         │
│         Reuse                │
│         Receiver selected    │
│                              │
│         [View Item]          │
└──────────────────────────────┘
```

Filters can use horizontal scrolling chips only when necessary.

Do not create uncontrolled horizontal scrolling.

---

# 27. Mobile Discover

Use:

```text
Discover

Search
[ Search ]

Nearby
Reuse
Donate
Recycle
Community
```

Use vertically stacked cards.

Keep discovery task-focused.

---

# 28. Mobile Impact

Heading:

**Your impact**

Focus on personal activity.

```text
Items given a next value
12

Reused
5

Donated
3

Resold
2

Recycled
2
```

Environmental calculations must be labeled:

- Estimated
- Prototype calculation
- Demo data

Never fabricate verified environmental savings.

---

# 29. Mobile Profile

Show:

- avatar
- name
- email
- activity
- preferences

Keep it simple.

---

# 30. Mobile Settings

Use grouped list sections:

```text
Account
Notifications
Privacy
Accessibility
Appearance
Data
```

Use standard mobile settings patterns.

---

# 31. Mobile Bottom Sheets

Use bottom sheets for:

- filters
- secondary actions
- sorting
- AI reasoning
- receiver options
- contextual actions

Bottom sheets should:

- have clear title
- have visible close control
- support keyboard/screen readers
- not trap the user unexpectedly
- provide a clear primary action

---

# 32. Sticky Mobile CTAs

Use sticky bottom actions for high-intent screens:

Scan:

**Analyze Item**

Value:

**Choose Path**

Receiver:

**Select Receiver**

Handover:

**Confirm Handover**

Tracking:

**View Details**

Keep CTA above the safe-area inset.

Do not use sticky CTAs on every screen.

---

# 33. Mobile User Flow

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

## Core flow

```text
Home
 ↓
Scan
 ↓
Camera / Upload
 ↓
Image Review
 ↓
Vision AI
 ↓
Result
 ↓
Value AI
 ↓
Circular Value Decision
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
 ↓
Impact
```

---

# 34. Mobile User Decision Flow

AI recommends.

**USER DECIDES.**

```text
AI Recommendation
 ↓
Why?
 ↓
Accept
OR
Choose alternative
 ↓
Continue
```

Always provide:

- back
- cancel where appropriate
- retry
- correction

---

# 35. Mobile Error Flows

## Invalid image

```text
Upload
 ↓
Validation
 ↓
Image not suitable
 ↓
Try Another Image
```

## AI uncertainty

```text
Analysis
 ↓
Unable to confidently identify
 ↓
Try Another Image
OR
Enter Item Manually
```

## No receiver

```text
Receiver Discovery
 ↓
No suitable receiver nearby
 ↓
Expand Search
OR
Choose Another Value Path
```

## Network error

```text
Action
 ↓
Connection problem
 ↓
Retry
```

Preserve entered data.

---

# 36. Mobile Loading States

Use skeletons for content.

For AI:

```text
Understanding your item

✓ Detecting object
● Identifying material
○ Assessing condition
```

For receiver matching:

```text
Finding suitable receivers

✓ Item understood
✓ Value path selected
● Matching receivers
```

Never show an unexplained infinite spinner.

---

# 37. Mobile Micro-Interactions

Use subtle motion for:

- button press
- card selection
- upload preview
- AI state changes
- value-path selection
- success

Avoid:

- bouncing UI
- particles
- excessive parallax
- decorative motion

Motion must communicate state.

Support:

`prefers-reduced-motion`

---

# 38. Mobile Accessibility

Target:

**WCAG 2.2 AA**

Requirements:

- 44×44px minimum touch target
- 48px preferred primary control height
- keyboard accessibility when used with external keyboard
- screen-reader labels
- semantic HTML
- visible focus
- strong contrast
- never color-only communication
- logical reading order
- accessible status updates
- reduced-motion support

Use:

`aria-live="polite"`

for changing AI and status information where appropriate.

---

# 39. Mobile Data Honesty

Use explicit labels:

- AI-assisted
- Recommended
- Estimated
- Prototype calculation
- Demo data
- Potential value

Never fabricate:

- receiver verification
- environmental savings
- live availability
- exact resale price
- AI certainty
- completed handover

---

# 40. Mobile Component System

Build reusable components:

- Mobile Header
- Bottom Navigation
- Buttons
- Inputs
- Search
- Filter Chips
- Cards
- AI Insight Card
- Value Path Card
- Receiver Card
- Timeline
- Upload Zone
- Image Preview
- Bottom Sheet
- Modal
- Toast
- Skeleton
- Empty State
- Error State
- Sticky CTA
- Progress Indicator

Each interactive component should support appropriate:

- default
- pressed
- focus
- selected
- disabled
- loading
- error
- success

states.

---

# 41. Mobile Performance UX

The interface should feel fast even when AI processing takes time.

Prioritize:

- immediate image preview
- optimistic local UI where safe
- skeleton loading
- progressive rendering
- compressed image previews
- minimal blocking UI
- clear network state

Do not block the whole interface when only one component is processing.

---

# 42. Mobile Privacy & Trust

When requesting:

- camera
- location
- notifications

explain why the permission is useful.

Example:

**Allow location to find relevant receivers nearby.**

Do not request permissions before they are useful.

---

# 43. Mobile Empty States

Example:

**No items yet**

Your saved items will appear here.

Primary:

**Scan Your Waste**

Another:

**No suitable receiver found**

Try expanding your search.

**[Expand Search]**

---

# 44. Mobile Emotional Journey

The product should guide the user through:

```text
CURIOUS
   ↓
UNDERSTANDING
   ↓
CONFIDENT
   ↓
DECISION
   ↓
ACTION
   ↓
SATISFACTION
```

Landing:

“Maybe this doesn't need to become waste.”

Scan:

“Let's understand it.”

AI:

“Now I know what this is.”

Value:

“Now I know what I can do.”

Receiver:

“I know where it can go.”

Success:

“I gave it another purpose.”

Impact:

“I can see what I accomplished.”

---

# 45. Mobile Final Quality Bar

The phone experience must feel like a purpose-built mobile product.

It must NOT feel like:

- desktop squeezed onto a phone
- generic dashboard
- chatbot interface
- template marketplace
- school project

The final experience should feel:

**MODERN**
**FAST**
**PREMIUM**
**INTELLIGENT**
**CALM**
**TRUSTWORTHY**
**HUMAN**

The mobile product should make the next action obvious while keeping the user in control.

Final journey:

```text
SCAN
 ↓
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


---

# Source Alignment Note

This phone specification is aligned to the supplied Waste2Value design-system material
and preserves the product's established terminology and circular-flow concept.

The phone layout intentionally adapts desktop concepts rather than shrinking desktop
screens directly. In particular, the desktop Circular Value Matrix becomes a vertical
mobile decision stack, desktop multi-panel workspaces become focused mobile sections,
and high-intent actions use mobile sticky CTAs and bottom sheets.
