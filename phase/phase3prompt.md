# SHREE JAGANNATH HOLIDAYS
# PHASE 3 — JOURNEY DOCK → PLAN YOUR JOURNEY MORPH
# FINAL IMPLEMENTATION DIRECTIVE

Act as a senior frontend engineer, interaction designer, UX architect, accessibility engineer, and motion engineer.

Phase 1 and Phase 2B are FROZEN.

Do not redesign, retime, refactor, or visually alter:

- black SJH brand intro
- SVG logo reveal
- gate emergence
- golden seam
- hinged ceremonial gate animation
- portal bloom
- destination hero presentation
- four-direction compass portal system
- North → Kashmir
- East → Puri
- South → Kerala
- West → Rajasthan
- portal geometry
- portal commit/cancel thresholds
- current typography system
- opened gate framing
- header
- destination imagery
- reduced-motion logic
- Phase-1 session revisit logic
- Phase-2 pointer/keyboard navigation

Phase 3 adds exactly one major feature:

THE EXISTING JOURNEY DOCK MUST PHYSICALLY MORPH INTO A PREMIUM “PLAN YOUR JOURNEY” PANEL.

It must feel like the same object expanding.

It must NOT feel like:
- a new modal appearing
- a bottom sheet sliding from below
- a separate card fading over the dock
- a route change
- a drawer
- a popup
- a generic booking form

==================================================
1. CORE EXPERIENCE
==================================================

CURRENT STATE:

╭─────────────────────────────╮
│ ✦  Where do you want        │
│    to go?                →  │
╰─────────────────────────────╯

User taps the Journey Dock.

THE SAME SURFACE expands upward and reorganizes into:

╭─────────────────────────────╮
│ PLAN YOUR JOURNEY        ×  │
│                             │
│ FROM                        │
│ Bhubaneswar              ›  │
│ ─────────────────────────── │
│                             │
│ DESTINATION                 │
│ Kashmir                  ›  │
│ ─────────────────────────── │
│                             │
│ WHEN                        │
│ Flexible dates           ›  │
│ ─────────────────────────── │
│                             │
│ TRAVELLERS                  │
│ 2 Adults                 ›  │
│                             │
│ [ CREATE MY JOURNEY     → ] │
╰─────────────────────────────╯

Closing reverses this exact transformation.

The original Journey Dock reappears from the expanded panel.

No hard cut.

No separate component suddenly replacing another one.

==================================================
2. PHASE 3 SCOPE
==================================================

Implement:

- Dock tap
- Morph into planner shell
- Current destination prefill
- From field
- Destination field
- When field
- Travellers field
- Local form state
- Close/reverse morph
- Escape-key close
- Background dim/blur response
- Interaction locking while planner is open
- Responsive planner layout
- Accessibility
- Reduced-motion fallback
- Frontend validation
- clean callback interface for future submission

Do NOT implement:

- backend
- payment
- real booking
- email sending
- WhatsApp submission
- API calls
- authentication
- itinerary generation
- calendar backend
- hotel search
- flight search
- Phase 4 homepage scroll transition
- any new destination

==================================================
3. DO NOT BREAK PHASE 2B
==================================================

Before modifying code:

inspect the existing Phase-2B destination engine.

Identify:

- active destination state
- direction mapping
- portal state machine
- Journey Dock component
- Compass component
- header
- hero stage
- gate framing
- keyboard handlers
- pointer handlers

Do NOT duplicate active destination state.

Planner must consume the existing destination state.

==================================================
4. DESTINATION PREFILL
==================================================

When planner opens:

Puri active
→ Destination = Puri

Kashmir active
→ Destination = Kashmir

Rajasthan active
→ Destination = Rajasthan

Kerala active
→ Destination = Kerala

This must come from the actual Phase-2B activeDestination state.

Never infer from text.

Never duplicate destination state in multiple unrelated stores.

==================================================
5. PLANNER DATA MODEL
==================================================

Create a typed frontend model.

Example:

type JourneyDraft = {
  from: string;
  destination:
    | "puri"
    | "kashmir"
    | "rajasthan"
    | "kerala";
  dateMode: "flexible" | "specific";
  date?: string;
  adults: number;
  children: number;
};

Suggested defaults:

from:
"Bhubaneswar"

destination:
current active destination

dateMode:
"flexible"

adults:
2

children:
0

Keep the form state local to the planner unless there is already an appropriate app-level state architecture.

==================================================
6. THE DOCK MUST REMAIN ONE MORPHING SURFACE
==================================================

Do not render:

collapsed dock
+
hidden full planner
+
crossfade between them

as two visually independent surfaces.

Use one shell.

Suggested:

JourneyDockShell
├── CollapsedContent
└── ExpandedContent

The SHELL itself changes:

height
border-radius
background density
border
shadow
internal layout

The user should visually track the same physical surface throughout.

==================================================
7. COLLAPSED STATE
==================================================

Preserve the approved Phase-1/2B dock appearance.

Approximately:

height:
68–78px

width:
existing mobile width

border radius:
large pill / ~34–40px

Dark warm translucent material.

Compass left.

Text center-left.

Gold circular arrow right.

Do not redesign the dock before morphing it.

==================================================
8. EXPANDED DIMENSIONS
==================================================

Primary 390×844 target:

planner width:
same horizontal footprint as Dock
or maximum +2–4px adjustment only

side inset:
approximately 14–18px

expanded height target:
~440–500px

Do NOT blindly hard-code 500px.

Use responsive constraints:

max-height:
calc(
  100svh
  - env(safe-area-inset-top)
  - 84px
)

For small 360×800 devices:
allow slightly more compact field spacing.

For taller devices:
do not stretch fields unnecessarily.

The panel must remain visually intentional.

==================================================
9. RESPONSIVE HEIGHT STRATEGY
==================================================

Use a clamp/min strategy.

Conceptually:

--planner-height:
clamp(
  430px,
  57svh,
  500px
)

But validate visually.

If content cannot fit:

only planner INTERNAL content may scroll.

Do not make the entire page jump.

Do not let panel extend below home indicator.

==================================================
10. PANEL POSITION
==================================================

Expanded planner remains bottom anchored.

Respect:

env(safe-area-inset-bottom)

Collapsed and expanded states should share essentially the same bottom anchor.

The panel should grow UPWARD from the Journey Dock.

It must not shift its bottom edge dramatically.

This reinforces the morph illusion.

==================================================
11. OPENING MOTION — MASTER PRINCIPLE
==================================================

The morph has THREE stages:

A. SHELL EXPANSION
B. INTERNAL CONTENT REORGANIZATION
C. FORM CONTENT REVEAL

Do not show all form rows instantly.

==================================================
12. OPEN TIMELINE
==================================================

Target total:

~560–720ms

Suggested:

0.00
tap

0.00–0.12
collapsed text begins fading

0.05–0.46
shell expands upward

0.08–0.44
border radius reduces

0.12–0.40
background becomes denser

0.25
planner header begins appearing

0.30–0.60
form rows reveal with short stagger

0.42–0.68
CTA enters

0.68
settled planner

Do not obsess over exact milliseconds if better motion requires slight tuning.

==================================================
13. SHELL EXPANSION
==================================================

Animate:

height:
~74px → expanded planner height

border-radius:
~37px → ~26–30px

background:
semi-transparent dock material
→ denser warm-black/obsidian panel

border opacity:
slightly increase

shadow:
slightly deepen

Use:

power3.inOut

No bounce.

No elastic.

==================================================
14. SAME OBJECT, NOT TELEPORTATION
==================================================

The user must be able to visually follow:

Dock
→ Planner

The shell’s left/right/bottom geometry should remain stable.

The top edge moves upward.

This is critical.

If it looks like:

dock disappears
then planner fades in

FAIL.

==================================================
15. COMPASS ICON TRANSITION
==================================================

Do not simply remove the compass icon instantly.

As opening begins:

compass can:

- scale ~1 → .82
- reduce opacity
- move slightly toward planner header

Then fade out or become a tiny gold accent.

Do not invent a second huge decorative icon.

Keep this subtle.

==================================================
16. ARROW TRANSITION
==================================================

Collapsed gold arrow CTA can:

- scale down
- fade
- move inward slightly

Do not morph it into the close X if the geometry feels forced.

The close button can appear separately once shell expansion is underway.

Avoid gimmicky icon morphing.

==================================================
17. PLANNER HEADER
==================================================

Header:

PLAN YOUR JOURNEY

Close button:
× or clean SVG close

Typography:

small elegant serif or existing approved heading treatment

Close button:

minimum touch target:
44 × 44px

Visual icon itself can remain smaller.

==================================================
18. FORM ROW DESIGN
==================================================

Do not create generic white input boxes.

Each field should feel integrated into the dark planner.

Recommended field structure:

SMALL UPPER LABEL

Primary value

subtle icon

chevron

subtle horizontal divider

Example:

FROM
Bhubaneswar                         ›

DESTINATION
Kashmir                             ›

WHEN
Flexible dates                      ›

TRAVELLERS
2 Adults                            ›

No giant bordered rectangles around every row unless existing visual testing proves they are superior.

Premium hierarchy > dashboard UI.

==================================================
19. FIELD TYPOGRAPHY
==================================================

Label:

uppercase
small
tracking
warm ivory ~55–70% opacity

Value:

larger
clear
warm ivory

Chevron:

antique gold or low-opacity ivory

Keep line heights compact but not cramped.

==================================================
20. ROW REVEAL
==================================================

Rows enter after shell expansion is visibly underway.

Suggested:

opacity:
0 → 1

y:
12px → 0

stagger:
~45–70ms

Use:

power3.out

No rows flying from screen edges.

==================================================
21. ACTIVE DESTINATION LINK
==================================================

Destination field must use Phase-2B destination state.

On open:

show current destination.

Examples:

Puri
Kashmir
Rajasthan
Kerala

Do not display:
"PURI | ODISHA"
inside the form value.

Use concise user-facing names.

==================================================
22. DESTINATION FIELD INTERACTION
==================================================

For Phase 3:

allow the destination row to open a compact INLINE selection mode inside the same planner.

Options:

Puri
Kashmir
Rajasthan
Kerala

Do NOT open a second modal.

Do NOT slide another sheet.

Selection list can temporarily replace field rows within the same planner shell.

Keep shell dimensions stable where possible.

==================================================
23. DESTINATION SELECTION BEHAVIOR
==================================================

Selecting a different destination in the planner:

updates JourneyDraft.destination.

Do NOT immediately trigger the Phase-2B portal while planner is expanded.

The planner is an intent/booking state.

Hero browsing state and planning state are related but not identical.

When planner closes without submission:
do not unexpectedly force hero destination to planner destination.

Current hero stays where it was.

This avoids surprising behavior.

==================================================
24. FROM FIELD
==================================================

Phase 3 does not need a city API.

Default:

Bhubaneswar

Allow local text editing.

Use a styled inline input state within the planner.

No Google Places.
No external geocoder.
No fake city autocomplete.

Keep architecture ready for future suggestions API.

==================================================
25. WHEN FIELD
==================================================

Default:

Flexible dates

Allow:

Flexible dates
Specific date

If Specific date selected:

show a native/date-compatible date selector styled carefully.

Do not build a custom calendar library in Phase 3.

Use semantic date input if appropriate.

==================================================
26. TRAVELLERS
==================================================

Provide local stepper interaction.

Adults:

minimum 1
maximum 8

Children:

minimum 0
maximum 6

Default:

2 Adults
0 Children

When children = 0:

collapsed value can show:

2 Adults

When children > 0:

example:

2 Adults · 1 Child

Use accessible + and − buttons with 44px targets.

==================================================
27. CREATE MY JOURNEY CTA
==================================================

Bottom CTA:

CREATE MY JOURNEY   →

Full-width inside planner.

Warm antique-gold background.

Dark text.

No gradient explosion.

No pulse.

No looping glow.

Height:

~52–58px

Border radius:

~14–18px

==================================================
28. SUBMISSION BEHAVIOR — IMPORTANT
==================================================

There is NO backend in Phase 3.

Do not fake a successful booking.

Do not claim a request was sent.

Expose a typed callback:

onCreateJourney?(draft: JourneyDraft): void

If no external handler exists:

validate the draft
and keep the data ready locally.

Optionally log only in development.

Do NOT show:
“Booking confirmed”
“Request sent”
or any dishonest success state.

==================================================
29. VALIDATION
==================================================

Minimum validation:

from:
non-empty

destination:
required

specific date:
required only if dateMode === "specific"

adults:
>= 1

Use restrained inline error treatment.

No giant red alert boxes.

==================================================
30. BACKGROUND RESPONSE
==================================================

When planner opens:

the destination world behind it should become quieter.

Animate the destination/background stage:

scale:
1 → ~1.025–1.035

brightness:
1 → ~.58–.65

blur:
0 → ~4–6px

But:

do not destroy image quality.

Do not apply extreme blur.

==================================================
31. GATE FRAMING WHILE PLANNER IS OPEN
==================================================

The carved gate architecture remains fixed.

Do not replay it.

Do not close it.

Do not move it.

It may become slightly darker through an overlay.

Prefer:

background scene blurred
gate still structurally readable

This maintains the sense that the planner exists inside the same architectural world.

==================================================
32. HEADER WHILE OPEN
==================================================

Keep header visible but subdued.

Suggested:

opacity:
1 → .55–.70

Do not remove it suddenly.

Menu interaction should be disabled while planner has modal focus.

==================================================
33. COMPASS WHILE OPEN
==================================================

Disable destination portal gestures while planner is open.

Disable:

drag navigation
cardinal tap
keyboard destination switching

Compass may:

fade to ~.35 opacity

or become non-interactive.

Do not let the user accidentally switch worlds behind the form.

==================================================
34. BACKDROP / VEIL
==================================================

Use a controlled visual veil behind the planner.

Example:

rgba(5, 5, 4, .18–.28)

Do not create an opaque black modal backdrop.

The destination must still be recognizable.

==================================================
35. OPEN STATE MACHINE
==================================================

Extend the interaction architecture cleanly.

Suggested planner states:

"closed"
"opening"
"open"
"field-selecting"
"closing"

Do not use:

isOpen
isAnimating
isClosing
isSelecting
isExpanded
...

as unrelated boolean soup.

==================================================
36. PORTAL + PLANNER INTERACTION LOCK
==================================================

Planner cannot open while Phase-2B is:

dragging
canceling
committing
settling

Dock activation should occur only when portal state is idle.

Similarly:

while planner is not closed:

Phase-2 destination gestures must be disabled.

==================================================
37. TAP BEHAVIOR
==================================================

The original Journey Dock remains an actual button.

On activation:

focus/gesture ownership transfers to planner.

Do not attach opening to arbitrary hero taps.

Only Dock opens planner.

==================================================
38. FOCUS MANAGEMENT
==================================================

On planner open:

remember the Dock trigger element.

After opening:
move focus to:

planner heading
or first editable field

On close:

return focus to original Dock trigger.

==================================================
39. DIALOG SEMANTICS
==================================================

Because surrounding interactions are disabled while the planner is expanded:

use appropriate dialog semantics.

Example:

role="dialog"
aria-modal="true"
aria-labelledby="journey-planner-title"

But visually it remains the morphed Journey Dock.

Semantic modal does NOT mean visually generic modal.

==================================================
40. FOCUS TRAP
==================================================

While planner is open:

Tab and Shift+Tab remain inside planner controls.

Escape closes planner.

Do not allow keyboard focus to move to destination compass/menu behind it.

==================================================
41. BACKGROUND INERTNESS
==================================================

When planner opens:

make non-planner interactive hero controls inert/unavailable where supported.

At minimum ensure:

- menu not focusable
- compass not focusable
- portal navigation disabled

Restore on close.

==================================================
42. CLOSE INTERACTION
==================================================

Close via:

X
Escape

Optionally tapping dark background may close only if it does not create accidental dismissals.

My recommendation:

X + Escape are mandatory.

Backdrop tap can be added after testing.

==================================================
43. CLOSE ANIMATION
==================================================

Close is a true reverse morph.

Sequence:

CTA/rows fade down
planner header fades
shell contracts
border radius increases
Dock compass/text/arrow return
background restores

Target:

~480–620ms

Use:

power3.inOut

Do not instantly collapse after content disappears.

==================================================
44. CLOSE MOTION DETAIL
==================================================

Suggested:

0.00
close requested

0.00–0.20
CTA / lower rows fade

0.08–0.30
remaining fields fade

0.12–0.48
shell contracts

0.30–0.52
collapsed Dock content restores

0.52
closed

==================================================
45. PRESERVE FORM DRAFT
==================================================

Closing and reopening within the same page session should preserve the current JourneyDraft.

Do not reset user's traveller/date/from choices every time.

But when planner has never been edited and current hero destination changes:

destination prefill should follow the current active hero destination.

==================================================
46. DIRTY STATE RULE
==================================================

Track whether the planner has been edited.

If untouched:

opening from Kashmir:
prefill Kashmir

later browse to Kerala:
next planner open should show Kerala

If user manually edits destination/form:

preserve their draft rather than silently overwriting it.

This distinction matters.

==================================================
47. DESTINATION COPY IS NOT FORM STATE
==================================================

Do not tie planner field values directly to rendered hero typography.

Keep:

active hero destination

and

JourneyDraft.destination

as separate concepts after the user begins editing the planner.

==================================================
48. SAFE AREAS
==================================================

Support:

env(safe-area-inset-bottom)

Expanded planner bottom CTA must never collide with:

iPhone home indicator
Android gesture bar

Header must still respect top safe area.

==================================================
49. SMALL VIEWPORT SUPPORT
==================================================

At 360×800:

do not shrink type to unreadable sizes.

Prefer:

slightly tighter gaps
slightly shorter rows
internal planner scrolling if necessary

Do not let CTA fall below viewport.

==================================================
50. LARGE MOBILE SUPPORT
==================================================

At 430×932:

do not stretch planner unnecessarily tall.

Maintain compact luxury proportions.

Whitespace should increase modestly, not become empty space.

==================================================
51. VISUAL MATERIAL
==================================================

Planner material:

warm obsidian / temple-black

Suggested family:

#11100E
#151411
#1A1814

Border:

warm ivory/gold at low opacity

Gold accent:

existing antique-gold token

Do not introduce:

blue
purple
generic SaaS gradients

==================================================
52. BACKDROP BLUR PERFORMANCE
==================================================

Use backdrop-filter carefully.

Avoid stacking multiple full-screen blurs.

Prefer:

one background-stage filter
+
one planner translucent surface

Test performance on mobile.

If blur causes jank:
reduce blur before compromising animation smoothness.

==================================================
53. HIGH-FREQUENCY PERFORMANCE
==================================================

Planner morph is timeline-driven, not pointer-driven.

Use GSAP or CSS transforms/size animations carefully.

Avoid React renders every animation frame.

Use refs where needed.

==================================================
54. LAYOUT ANIMATION
==================================================

Prefer animating:

CSS custom properties
height
transform
opacity
border-radius

If height animation causes unacceptable layout cost:

use FLIP-style transform strategy.

But do not add a large dependency merely for this.

GSAP already exists.

==================================================
55. REDUCED MOTION
==================================================

For prefers-reduced-motion:

do not run elaborate shell morph.

Use:

short fade
+
immediate expanded dimensions

Background dim can appear without animated zoom.

Closing similarly uses short fade.

Functionality must remain identical.

==================================================
56. VISUAL CONTENT ORDER
==================================================

Expanded planner content order:

PLAN YOUR JOURNEY

FROM
...

DESTINATION
...

WHEN
...

TRAVELLERS
...

CREATE MY JOURNEY

Do not add unnecessary marketing copy inside the form.

==================================================
57. FIELD ICONS
==================================================

Use simple consistent line icons if current project already has an icon system.

Examples:

From:
location pin

Destination:
compass / location

When:
calendar

Travellers:
people

Do not generate raster icons.

Do not introduce mixed icon styles.

==================================================
58. MICROINTERACTIONS
==================================================

Allowed:

row hover/press
small chevron movement
button press scale .98
subtle gold focus ring

Not allowed:

bouncy rows
pulsing icons
floating labels
excessive glows
animated gradients

==================================================
59. CREATE BUTTON PRESS
==================================================

On press:

scale:
1 → .985 → 1

Duration:
~120–160ms

No giant ripple.

No celebratory animation because no backend submission exists.

==================================================
60. BACKGROUND WORLD DURING FIELD EDITING
==================================================

Keep the world quiet.

Do not change destination photography while user edits FROM/WHEN/TRAVELLERS.

The planner owns interaction until closed.

==================================================
61. PHASE 3 QA STATES
==================================================

At 390×844 capture:

A
Collapsed Journey Dock — Puri

B
~30% planner opening

C
~70% planner opening

D
Planner fully expanded — Puri

E
Planner fully expanded — Kashmir prefilled

F
Planner fully expanded — Rajasthan prefilled

G
Planner fully expanded — Kerala prefilled

H
Destination inline selector

I
Traveller controls expanded/active

J
Specific-date state

K
Planner closing midpoint

L
Collapsed Dock restored exactly

==================================================
62. RESPONSIVE QA
==================================================

Test full expanded planner at:

360×800
375×812
390×844
393×852
412×915
430×932

Verify:

- no horizontal overflow
- no CTA clipping
- no home-indicator overlap
- no header collision
- no unreadable type
- no giant empty gaps
- internal scrolling works where needed
- collapsed Dock restores precisely

==================================================
63. INTERACTION QA
==================================================

Test:

Dock → open

X → close

Escape → close

Tab loop

Shift+Tab loop

destination prefill for all four worlds

dirty draft preservation

untouched destination synchronization

specific date validation

traveller minimum/maximum

empty FROM validation

planner opening blocked during portal transition

portal gesture blocked while planner open

destination compass disabled while planner open

focus restored after close

==================================================
64. PHASE 1/2 REGRESSION QA
==================================================

After implementing Phase 3:

re-run:

Phase 1 intro
Phase 1 revisit
Phase 1 reduced motion

Phase 2:
Puri → Kashmir
Kashmir → Rajasthan
Rajasthan → Kerala
Kerala → Puri

Do not assume Phase 3 did not affect them.

==================================================
65. ACCEPTANCE CHECKLIST
==================================================

[ ] Phase 1 unchanged
[ ] Phase 2B unchanged
[ ] existing Dock is the morph origin
[ ] no separate visual modal pops in
[ ] shell bottom remains anchored
[ ] shell grows upward
[ ] border radius transforms naturally
[ ] collapsed content transitions cleanly
[ ] planner rows stagger in
[ ] current destination prefills correctly
[ ] From field locally editable
[ ] destination locally selectable
[ ] Flexible / Specific date works
[ ] traveller stepper works
[ ] form validates
[ ] no fake backend success
[ ] typed onCreateJourney callback exists
[ ] background dims subtly
[ ] destination world remains recognizable
[ ] gate remains fixed
[ ] header subdued
[ ] compass/portal disabled while open
[ ] focus trapped
[ ] Escape closes
[ ] focus restores
[ ] dirty draft preserved
[ ] untouched destination sync works
[ ] reduced motion works
[ ] safe area works
[ ] all six mobile sizes pass
[ ] closing returns EXACT original Dock
[ ] no Phase 4 work introduced

==================================================
66. MOST IMPORTANT VISUAL TEST
==================================================

If the user perceives:

“I tapped the dock and then a form modal appeared.”

FAIL.

If the user perceives:

“The little Journey Dock physically unfolded into my travel planner.”

PASS.

==================================================
67. DEFINITION OF DONE
==================================================

The desired emotional sequence:

“I am exploring one of four destinations through the ceremonial gateway.

I tap the small Journey Dock.

The exact same object grows upward.

The world behind me softens.

My current destination is already understood.

A compact, beautifully organized journey planner reveals itself.

I can adjust where I am leaving from, destination, timing, and travellers.

Closing the planner folds the entire object back into the original Dock.

I never feel like I left the hero.”

Build Phase 3 only.

Do NOT start the next homepage section.

Do NOT start Phase 4 until all Phase-3 screenshots, accessibility checks, responsive checks, and Phase-1/2 regression tests pass.