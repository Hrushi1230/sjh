# SHREE JAGANNATH HOLIDAYS
# PHASE 4 — CINEMATIC HERO → EDITORIAL HOMEPAGE TRANSITION
# MOBILE-FIRST FINAL IMPLEMENTATION DIRECTIVE

Act as a senior interaction designer, frontend engineer,
motion director, and mobile performance engineer.

PHASES 1–3 ARE FROZEN.

Do not redesign or retime:

- ceremonial SJH intro
- temple gate entrance
- golden seam
- hinged gate opening
- destination photography
- 4-direction portal navigation
- cardinal compass
- Journey Dock
- planner morph
- planner form state
- Phase-1 revisit logic
- accessibility behavior
- reduced-motion behavior

Phase 4 adds exactly one new experience:

THE FULLSCREEN CINEMATIC HERO MUST TRANSFORM,
UNDER USER SCROLL,
INTO THE FIRST EDITORIAL CARD OF THE HOMEPAGE.

Do NOT simply scroll the hero upward and reveal a new section.

==================================================
1. THE CONCEPT
==================================================

Current experience:

FULLSCREEN DESTINATION WORLD
inside ceremonial architecture.

User begins scrolling.

Instead of the hero disappearing:

the world physically becomes part of the page.

Sequence:

FULLSCREEN WORLD

        ↓ scroll

destination remains visible
but starts detaching from viewport

        ↓

carved gateway recedes

        ↓

hero corners begin rounding

        ↓

hero scales inward

        ↓

warm ivory paper-like canvas appears around it

        ↓

hero typography reorganizes

        ↓

the destination becomes an editorial image/card

        ↓

new section title arrives:

WHAT ARE YOU LOOKING FOR?

Not destinations.
A feeling.

        ↓

page becomes a calm editorial travel experience.

This transition should feel like:

CINEMA
→ MAGAZINE

not:

HERO
→ NEXT SECTION

==================================================
2. PHASE 4 SCOPE
==================================================

Implement only:

- scroll transition from hero to editorial canvas
- temporary hero pinning/sticky behavior
- destination image → editorial card transformation
- gate framing recession
- Journey Dock transition out
- header adaptation
- ivory page reveal
- first editorial section heading
- one active destination-derived editorial card
- scroll handoff into normal document flow
- responsive mobile implementation
- reduced-motion fallback
- accessibility
- Phase 1–3 regression protection

Do NOT implement yet:

- full feeling-card grid
- multiple sections below
- Travel Thread
- package cards
- testimonials
- footer
- desktop redesign
- booking backend

Those belong to later phases.

==================================================
3. ACTIVE DESTINATION CONTEXT
==================================================

Phase 4 must respect whichever destination is active
when the user starts scrolling.

Mapping:

PURI
→ editorial feeling:
FAITH

KASHMIR
→ editorial feeling:
ESCAPE

RAJASTHAN
→ editorial feeling:
DISCOVER

KERALA
→ editorial feeling:
SLOW DOWN

This mapping should be data-driven.

Example:

type EditorialTheme = {
  destinationId: DestinationId;
  eyebrow: string;
  title: string;
  description: string;
};

Suggested copy:

PURI

eyebrow:
FAITH

title:
SOMETHING
GREATER THAN
A HOLIDAY.

description:
Journeys shaped by devotion,
ritual and the coast.


KASHMIR

eyebrow:
ESCAPE

title:
GO WHERE
THE NOISE
ENDS.

description:
Mountains, valleys and room
to breathe again.


RAJASTHAN

eyebrow:
DISCOVER

title:
STEP INTO
ANOTHER
CENTURY.

description:
Palaces, craft and stories
written into stone.


KERALA

eyebrow:
SLOW DOWN

title:
LET TIME
MOVE
DIFFERENTLY.

description:
Backwaters, green horizons
and unhurried days.

Keep all copy editable in data.

==================================================
4. DOCUMENT STRUCTURE
==================================================

Recommended structure:

<App>
  <CinematicHeroSection />
  <EditorialIntroSection />
  <FutureSectionsPlaceholder />
</App>

Hero section owns the Phase-4 transition.

EditorialIntroSection exists in normal document flow.

Do not create a detached fake screenshot of the next section.

The transition must end in a real page state.

==================================================
5. SCROLL LENGTH
==================================================

Use a controlled transition range.

Mobile target:

approximately 120–150svh of scroll space
for the transformation.

Do not use an excessively long 300vh cinematic scroll.

Suggested starting point:

135svh.

Tune after testing.

The transition should feel substantial,
not exhausting.

==================================================
6. PINNING STRATEGY
==================================================

During the main transformation:

hero remains visually pinned.

Use:

GSAP ScrollTrigger

or equivalent existing GSAP stack.

Preferred:

pin: true

with carefully controlled pinSpacing.

Do not manually hijack touch scrolling.

Do not implement fake wheel scrolling.

Native scroll remains authoritative.

==================================================
7. MASTER SCROLL PROGRESS
==================================================

Use one normalized progress:

0 → 1

Map sub-phases from it.

Suggested conceptual timeline:

0.00–0.12
hero still essentially fullscreen

0.12–0.28
gate recedes
Dock begins leaving

0.22–0.48
ivory canvas begins appearing

0.30–0.68
hero scales inward
corners round

0.46–0.72
hero copy transitions out/repositions

0.58–0.82
editorial content arrives

0.82–1.00
hero becomes settled card
pin releases

Do not treat each element as an unrelated animation.

Everything must feel like one transformation.

==================================================
8. IVORY CANVAS
==================================================

Use existing brand warmth.

Primary:

#F4EFE6

Possible alternate:

#F7F3EC

Not pure white.

As the hero contracts,
this canvas becomes visible around it.

At the beginning:

0% visible

At the end:

entire page background is warm ivory.

No white flash.

==================================================
9. HERO CARD GEOMETRY
==================================================

Initial:

width:
100vw

height:
100svh

border-radius:
0

At settled editorial state:

mobile width:
calc(100vw - 28px to 36px)

target:
~358px on a 390px viewport

height:
approximately 58–64svh

Suggested visual target:

390×844:

card width:
~358px

card height:
~500–530px

border radius:
24–30px

Do not make it tiny.

It still needs photographic presence.

==================================================
10. SCALE / WIDTH BEHAVIOR
==================================================

Do not only scale transform blindly.

The final layout must become real document geometry.

During transition:

transform scale may be used for performance.

At completion:

ensure final card dimensions correspond to
actual layout positioning.

Avoid a giant invisible fullscreen hitbox
remaining after visual scale-down.

==================================================
11. POSITION
==================================================

Final editorial card:

centered horizontally.

Preferred top position after transition:

roughly 104–132px below viewport top,
depending safe area and heading arrangement.

But the page must continue naturally after pin release.

Do not permanently use fixed positioning.

==================================================
12. BORDER RADIUS
==================================================

Animate gradually.

Example:

progress 0.25
0px

0.40
8px

0.55
18px

0.75
26px

1.00
28px

Corners should emerge only after the hero clearly
starts becoming a card.

Do not round the fullscreen world immediately.

==================================================
13. DESTINATION IMAGE
==================================================

Do not replace active destination imagery.

The exact current world becomes the editorial card.

This continuity is essential.

Image crop may subtly adjust.

Initial hero:
cover fullscreen.

Final card:
cover card geometry.

Use object-position per destination if needed.

Keep data-driven crop values.

Example:

editorialObjectPosition:
"50% 50%"

Allow custom values for Rajasthan/Puri etc.

==================================================
14. IMAGE PARALLAX
==================================================

Inside shrinking card:

image may move at slightly different speed
than the card mask.

Subtle only.

Maximum perceived internal movement:

~20–36px.

This helps the hero feel like photography
being reframed into an editorial object.

Do not create exaggerated parallax.

==================================================
15. GATE FRAMING
==================================================

Phase-1 gate framing should not abruptly vanish.

During early scroll:

gate opacity:
1 → 0

scale:
1 → ~1.04

brightness:
1 → .65

blur:
0 → ~2px

Suggested fade window:

progress .08 → .36

The architecture should feel like it is
receding behind the photograph.

Do not animate the doors closed.

Do not replay hinges.

==================================================
16. JOURNEY DOCK
==================================================

Planner must be CLOSED before Phase 4 engages.

If planner is open:

scroll transition does not begin.

Normal page behavior should remain controlled.

When hero scroll begins with planner closed:

Journey Dock exits gracefully.

Suggested:

progress .08 → .28

opacity:
1 → 0

y:
0 → 18px

scale:
1 → .94

Disable pointer interactions once mostly faded.

Do not keep the Dock floating over editorial content.

==================================================
17. COMPASS
==================================================

Compass destination navigation belongs to the
fullscreen cinematic experience.

During Phase 4:

fade with Dock / hero UI.

Do not leave N/E/S/W floating on the editorial page.

Suggested fade:

progress .08 → .25.

==================================================
18. HERO HEADER
==================================================

Current hero header should transform into
the normal site header language.

Do not create a second header suddenly.

Option A preferred:

same header persists,
but visual styling adapts.

Beginning:

light/gold elements
over image.

End:

dark temple-black typography/icons
over ivory background.

Use color interpolation or class/state change.

Logo should remain stable.

==================================================
19. HEADER TRANSITION
==================================================

Suggested:

progress .35 → .72

logo/icon color:
warm ivory/gold
→ #11100E / antique gold

Backdrop:
transparent
→ subtle ivory translucency if required.

Do not add generic sticky SaaS navbar styling.

==================================================
20. HERO TYPOGRAPHY
==================================================

Fullscreen destination copy should NOT simply remain
inside the smaller card unchanged.

It needs editorial reorganization.

Phase 4 beginning:

existing hero location/headline visible.

Around .28:

hero supporting copy begins fading.

Around .40:

large hero headline starts fading/moving.

By .58:

fullscreen hero typography is mostly gone.

The photograph then becomes cleaner.

==================================================
21. EDITORIAL TEXT ARRIVAL
==================================================

New editorial copy should arrive OUTSIDE the image card.

Not baked inside the photograph.

Desired composition after transition:

WHAT ARE YOU LOOKING FOR?

Not destinations.
A feeling.

[editorial destination card]

FAITH / ESCAPE / DISCOVER / SLOW DOWN

large editorial headline

short description

Depending available viewport,
the section heading may begin above the card
while the theme caption sits beneath.

Do not overcrowd one screen.

==================================================
22. SECTION INTRO
==================================================

Use:

eyebrow / label:
WHAT ARE YOU LOOKING FOR?

Main:

NOT DESTINATIONS.
A FEELING.

Possible typography:

NOT DESTINATIONS.
in restrained sans

A FEELING.
in expressive serif

or:

Not destinations.
A feeling.

depending current design system.

Keep it elegant.

==================================================
23. SECTION INTRO ANIMATION
==================================================

As ivory canvas becomes dominant:

label:
opacity 0 → 1
y 14 → 0

main line:
masked reveal

Suggested progress:

.50 → .74.

Do not reveal everything simultaneously.

==================================================
24. EDITORIAL CARD SETTLED STATE
==================================================

At end of transition:

warm ivory page.

Header adapted.

Intro text established.

Destination image is now rounded editorial card.

Gate absent.

Dock absent.

Compass absent.

No portal gesture on the card.

This is no longer the fullscreen destination browser.

==================================================
25. EDITORIAL CARD META
==================================================

Near/below the card show:

01
FAITH

or:

FAITH
PURI · ODISHA

depending active destination.

For Kashmir:

ESCAPE
KASHMIR · INDIA

Rajasthan:

DISCOVER
RAJASTHAN · INDIA

Kerala:

SLOW DOWN
KERALA · INDIA

No carousel numbering unless there is real editorial sequence.

==================================================
26. FEELING TITLE
==================================================

Below/adjacent to image:

Puri:
SOMETHING
GREATER THAN
A HOLIDAY.

Kashmir:
GO WHERE
THE NOISE
ENDS.

Rajasthan:
STEP INTO
ANOTHER
CENTURY.

Kerala:
LET TIME
MOVE
DIFFERENTLY.

Use editorial serif.

Not giant marketing landing-page typography.

==================================================
27. CONTENT RHYTHM
==================================================

Phase 4 should end with enough content below the fold
that user naturally continues scrolling.

Do not end the ScrollTrigger in an empty viewport.

At least:

- intro heading
- image card
- feeling label
- feeling headline
- description

should exist in the first editorial section.

==================================================
28. VISUAL TRANSFORMATION PRINCIPLE
==================================================

The user must understand:

“the place I was just exploring
has become part of the story below.”

Therefore:

same active image
same destination
same emotional context.

No image swap during transition.

==================================================
29. SCROLL REVERSIBILITY
==================================================

Important:

scrolling back upward should reverse the transformation.

Editorial card:

→ grows

ivory disappears

gate framing returns

hero typography restores

Dock/compass restore

fullscreen world returns.

Use ScrollTrigger scrub.

No one-way animation.

==================================================
30. RE-ENTRY STATE
==================================================

When user scrolls fully back to hero:

portal destination navigation must work again.

Journey Dock must work again.

Planner must open normally.

No stale inline styles.

No disabled pointer handlers remaining.

==================================================
31. PORTAL LOCK DURING TRANSITION
==================================================

When Phase-4 progress > small threshold:

disable destination portal gesture.

Suggested:

progress > .04

→ browsing lock.

Why:

user should not change active destination
mid-transformation.

Re-enable only when progress returns near 0.

==================================================
32. PLANNER LOCK
==================================================

Planner Dock should not open
once scroll transformation meaningfully starts.

Suggested:

progress > .03

→ Dock non-interactive.

If planner is already open:

do not start scroll transition.

==================================================
33. TOUCH SCROLL
==================================================

Do not interfere with native momentum scrolling.

No preventDefault loops.

No custom scroll engine required.

Lenis may only be used if already present and stable.

Do not add Lenis solely for Phase 4.

==================================================
34. SCRUB FEEL
==================================================

Use a mild smoothing value.

Example:

scrub: 0.8–1.2

not:

scrub: true with harsh frame-perfect coupling

and not:

scrub: 3+ seconds of lag.

Motion should feel connected to finger scroll.

==================================================
35. MOBILE BROWSER CHROME
==================================================

Use svh/dvh carefully.

Fullscreen hero should remain stable when browser bars move.

Prefer:

min-height: 100svh

with tested fallbacks.

Avoid layout jumps from raw 100vh.

==================================================
36. SAFE AREAS
==================================================

Continue honoring:

env(safe-area-inset-top)
env(safe-area-inset-bottom)

During final editorial state,
normal content should not inherit unnecessary
hero bottom safe-area offsets.

==================================================
37. PERFORMANCE
==================================================

Critical rule:

do not animate expensive full-page layout every frame
if transform can do the job.

Prefer:

transform
clip-path
opacity
border-radius

Use one composited hero/card layer.

Avoid multiple stacked 5px blur filters.

Gate fade can use opacity instead of increasing blur aggressively.

==================================================
38. WILL-CHANGE
==================================================

Only apply will-change during transition
or to genuinely animated elements.

Do not permanently put:

will-change: transform

on the entire page.

Clean up after ScrollTrigger where practical.

==================================================
39. IMAGE PERFORMANCE
==================================================

Do not duplicate four giant destination layers
inside Phase-4 editorial state.

Only current active destination is required
for the transformed card.

Phase-2 portal preload system can stay unchanged.

==================================================
40. REDUCED MOTION
==================================================

For prefers-reduced-motion:

do not pin the user inside a long scrub sequence.

Instead:

hero transitions into editorial page
with minimal/simple layout change.

Recommended:

short crossfade
+
immediate card geometry.

Normal document scrolling continues.

Do not force 135svh cinematic scrub.

==================================================
41. SEMANTICS
==================================================

Hero remains:

<section>

Editorial intro becomes:

<section>

Use proper headings.

Example:

h1 remains the hero destination title.

Editorial:

h2:
Not destinations. A feeling.

Do not create multiple duplicate h1 elements.

==================================================
42. SCREEN-READER EXPERIENCE
==================================================

Do not duplicate visible destination copy
in both hero and editorial DOM
without handling accessibility.

If both exist during transition:

use aria-hidden appropriately
until each semantic state is active.

Avoid duplicate announcement.

==================================================
43. FOCUS
==================================================

Scrolling transition should never steal focus.

Do not autofocus editorial content.

Keyboard users should continue in logical DOM order.

==================================================
44. REFRESH AT MID-SCROLL
==================================================

Test page refresh while browser restores
a scroll position inside Phase 4.

ScrollTrigger must initialize correctly.

No:

fullscreen card stuck small
ivory missing
Dock visible at wrong stage
gate stuck transparent

==================================================
45. RESIZE / ORIENTATION
==================================================

On resize:

ScrollTrigger refresh.

Recalculate:

viewport
card target dimensions
section height
final positioning

Avoid storing geometry once forever.

==================================================
46. CURRENT DESTINATION CHANGES BEFORE SCROLL
==================================================

Test:

Puri → scroll

Kashmir → scroll

Rajasthan → scroll

Kerala → scroll

Each must use its correct:

image
editorial feeling
headline
description.

No stale copy from previous destination.

==================================================
47. DATA STRUCTURE
==================================================

Extend existing destination data rather than create
a disconnected Phase-4 data object if practical.

Example:

{
  id: "kashmir",
  ...
  editorial: {
    feeling: "ESCAPE",
    title: [
      "GO WHERE",
      "THE NOISE",
      "ENDS."
    ],
    description: ...
    objectPosition: ...
  }
}

Keep one source of truth.

==================================================
48. SCROLL TIMELINE REFERENCE
==================================================

Suggested normalized timeline:

0.00
fullscreen settled hero

0.06
portal navigation locked

0.10
Dock/compass begin fade

0.16
gate starts receding

0.22
ivory first visible

0.30
card begins shrinking

0.34
hero copy starts departing

0.42
corners visibly rounding

0.50
section eyebrow appears

0.58
gate nearly gone

0.62
hero headline gone

0.66
section headline reveals

0.72
card near final width

0.78
editorial feeling label appears

0.86
card settles

0.92
description appears

1.00
pin releases into normal page flow

Tune visually.

==================================================
49. TARGET COMPOSITION — 390 × 844
==================================================

At approximately 75–85% progress:

user should see:

warm ivory surrounding the card

top brand/header

section heading visible

rounded destination card

part of editorial caption below

This is the hero transformation money shot.

==================================================
50. DO NOT OVER-ANIMATE
==================================================

Once the card settles:

stop cinematic movement.

The editorial section becomes calm.

No:

continuous image floating
infinite parallax
looping gold shimmer
breathing cards
automatic card movement

The contrast is intentional:

Phase 1–3 = immersive

Phase 4 onward = editorial calm.

==================================================
51. QA FRAME SET
==================================================

Capture at 390×844:

A
0% — fullscreen active hero

B
~15% — Dock fading / gate starting recession

C
~30% — ivory edge appearing

D
~45% — card shrinking + corners rounding

E
~60% — editorial title entering

F
~78% — strong cinema→magazine transformation

G
100% — final editorial card + content

H
reverse at ~50%

I
returned to 0%, exact fullscreen hero restored

==================================================
52. DESTINATION QA
==================================================

Capture final editorial settled state for:

Puri / Faith

Kashmir / Escape

Rajasthan / Discover

Kerala / Slow Down

Verify:

correct image
correct crop
correct copy
correct feeling.

==================================================
53. RESPONSIVE QA
==================================================

Test:

360×800
375×812
390×844
393×852
412×915
430×932

Check:

- card remains centered
- no horizontal overflow
- card corners consistent
- intro heading does not collide with header
- image crop stays good
- content below remains reachable
- pin spacing is correct
- no blank space after pin
- no jump when pin releases

==================================================
54. REGRESSION QA
==================================================

After Phase 4 implementation,
retest:

PHASE 1
first-visit intro
same-session revisit
reduced motion

PHASE 2
all four destinations reachable
portal cancel
same-direction resistance

PHASE 3
Dock opens
planner closes
focus restores
current destination prefill works

Then:

scroll Phase 4
reverse to top

and verify Phases 2/3 still work.

==================================================
55. KNOWN FAILURE MODES
==================================================

FAIL if:

hero simply translates upward.

FAIL if:

next section abruptly fades in.

FAIL if:

destination photo changes during transformation.

FAIL if:

card looks like a generic rounded rectangle pasted
onto a white page.

FAIL if:

gate closes.

FAIL if:

Journey Dock persists over editorial content.

FAIL if:

large fullscreen copy remains inside the small card.

FAIL if:

ScrollTrigger traps the user too long.

FAIL if:

returning upward does not perfectly restore hero.

==================================================
56. ACCEPTANCE CHECKLIST
==================================================

[ ] Phase 1 unchanged
[ ] Phase 2B unchanged
[ ] Phase 3 unchanged
[ ] active destination feeds editorial theme
[ ] same hero image becomes card
[ ] native scroll drives transition
[ ] hero temporarily pinned
[ ] ivory appears around hero
[ ] gate recedes rather than closes
[ ] Dock/compass disappear gracefully
[ ] hero copy transitions out
[ ] card corners emerge progressively
[ ] editorial heading appears
[ ] final card exists in real document flow
[ ] scroll reversal restores fullscreen hero
[ ] portal locks during transition
[ ] planner cannot conflict
[ ] header adapts to ivory state
[ ] reduced motion works
[ ] all destinations supported
[ ] six mobile sizes tested
[ ] no overflow
[ ] no release jump
[ ] no stale styles after reversing
[ ] no Phase-5 implementation introduced

==================================================
57. DEFINITION OF DONE
==================================================

The user should feel:

“I was standing inside a destination.

As I scroll, that entire cinematic world
becomes a beautifully composed travel story.

The gateway disappears into the past.

The photograph I was exploring becomes
the first page of a magazine.

The site did not cut to another section.

It transformed.”

If it feels like:

“I scrolled past a hero.”

FAIL.

If it feels like:

“The hero became the homepage.”

PASS.

BUILD PHASE 4 ONLY.

Do not begin Phase 5 until:
- all Phase-4 QA frames pass
- all 4 destinations produce correct editorial states
- reverse scroll restores the hero perfectly
- Phases 1–3 show zero regressions.