# SHREE JAGANNATH HOLIDAYS
# PHASE 6 — THE TRAVEL THREAD
# ONE CONTINUOUS ROUTE THROUGH FOUR FEELINGS
# MOBILE-FIRST PRODUCTION IMPLEMENTATION DIRECTIVE

Act as a senior motion director, editorial designer,
frontend engineer, SVG systems engineer,
accessibility engineer, and mobile performance engineer.

PHASES 1–5 ARE FROZEN.

Do not redesign or retime:

- Phase 1 ceremonial gate
- Phase 2 four-direction portal
- Phase 3 Journey Planner morph
- Phase 4 Cinema → Magazine transition
- Phase 5 chapter order
- Phase 5 editorial copy
- Phase 5 chapter photography
- Phase 5 individual layout variants
- Phase 5 vertical editorial handoffs
- Phase 5 experience icon rows

Phase 6 adds ONE new visual system:

A SINGLE CONTINUOUS ANTIQUE-GOLD TRAVEL THREAD
that physically connects the four editorial chapters
and exits Phase 5 toward the future Curated Journeys section.

This thread must visually imply:

FAITH
→ ESCAPE
→ DISCOVER
→ SLOW DOWN
→ THE JOURNEY CONTINUES

==================================================
1. CORE CONCEPT
==================================================

This is not a decorative SVG pasted over the page.

The travel thread represents the journey itself.

As the user scrolls:

the line begins near Chapter 01,
travels around or through editorial composition,
touches a meaningful waypoint,
leaves the chapter,
moves into the next visual world,
and continues until the fourth chapter.

After Chapter 04:

the line leaves the feeling experience
and leads into a handoff state:

THE JOURNEY
CONTINUES.

Four ways to feel.
Countless ways to travel.

This is the bridge into Phase 7.

Do NOT implement Phase 7 package cards yet.

==================================================
2. MOST IMPORTANT VISUAL RULE
==================================================

The thread must NOT follow
the exact same geometry in all four chapters.

FAIL:

same S-curve
same node
same vertical position
same icon placement
repeated four times.

PASS:

Faith:
thread behaves around sacred architecture.

Escape:
thread moves broadly through open mountain composition.

Discover:
thread bends around architectural framing.

Slow Down:
thread becomes quieter and flatter,
moving with the waterline.

The route is ONE system,
but every chapter gives it a different spatial character.

==================================================
3. EXISTING ANCHORS
==================================================

Phase 5 already includes:

data-thread-anchor="chapter-start"
data-thread-anchor="chapter-media"
data-thread-anchor="chapter-end"

Use these anchors.

Do not hard-code route positions based only on viewport Y pixels.

For each chapter:

measure:

- chapter start anchor
- media anchor
- end / experience anchor

Build route geometry relative to real rendered positions.

==================================================
4. SVG ARCHITECTURE
==================================================

Use ONE main SVG overlay for the complete
Phase-5 thread region.

Recommended structure:

<section class="sjhTravelThreadRegion">
  <svg class="sjhTravelThread">
    <path class="sjhTravelThread__shadow" />
    <path class="sjhTravelThread__path" />
    <g class="sjhTravelThread__nodes">
      ...
    </g>
  </svg>

  <EditorialExperience />
</section>

SVG should cover the complete Phase-5 vertical region.

Do not create a separate disconnected SVG
inside every chapter unless required for technical fallback.

Preferred:
one continuous path.

==================================================
5. COORDINATE SYSTEM
==================================================

Use document-relative measurements converted
into the overlay SVG coordinate space.

At geometry calculation time:

1. measure thread region rect
2. measure each anchor rect
3. convert anchor centers into SVG-local x/y
4. generate chapter-specific control points
5. build one compound continuous path

Do not use magic absolute values tied only to 390×844.

==================================================
6. RESPONSIVE GEOMETRY
==================================================

Thread geometry must adapt to:

360×800
375×812
390×844
393×852
412×915
430×932

Use ratios and anchor positions.

Example:

x positions should often derive from:

regionWidth * 0.16
regionWidth * 0.42
regionWidth * 0.68

instead of:

left: 81px

Hard-coded values may be used only for small optical offsets.

==================================================
7. PATH GENERATION
==================================================

Create a utility such as:

buildTravelThreadPath({
  regionRect,
  chapters,
  viewportWidth
})

Return:

- SVG d path
- waypoint positions
- segment metadata

Use cubic Bézier curves.

Avoid:

jagged polyline
random noise
machine-like perfect repeated arcs

We want a refined hand-drawn editorial route.

==================================================
8. PATH CHARACTER
==================================================

Line should feel:

human
calm
precise
luxury
slightly organic

Not:

GPS route
subway map
stock infographic
ECG line
neon sci-fi path

Use asymmetrical Bézier control points.

==================================================
9. LINE STYLE
==================================================

Primary stroke:

existing antique gold family.

Suggested:

#B99455
or
existing project gold token.

Stroke width:

mobile:
~1.3–1.7px

Do not make it thick.

Linecap:
round

Linejoin:
round

No giant glowing outline.

Optional:
very faint shadow/bloom below line
at extremely low opacity.

==================================================
10. TWO-LAYER LINE
==================================================

Preferred:

background guide path:
same path
opacity ~0.12–0.18

active drawn path:
opacity ~0.9

This gives subtle continuity before the path is reached.

But if this makes the design look diagrammatic:

remove the guide path.

Visual QA decides.

==================================================
11. DRAW ANIMATION
==================================================

Use SVG path length.

Measure:

const pathLength = path.getTotalLength()

Set:

stroke-dasharray: pathLength
stroke-dashoffset: pathLength

As user scrolls:

dashoffset
pathLength → 0

The route draws progressively.

No time-based autoplay.

No looping.

==================================================
12. SCROLL-BASED PROGRESS
==================================================

Thread progress should be connected to
actual scroll position through the Phase-5 region.

Use:

GSAP ScrollTrigger

or existing scroll infrastructure.

Do not add another scroll library.

Suggested:

start:
top ~70% viewport

end:
bottom ~70% viewport

scrub:
0.5–0.9

Tune by feel.

==================================================
13. DO NOT USE ONE GLOBAL LINEAR SPEED
==================================================

The visible line should not move at uniform speed
through every chapter.

Map progress by chapter segment.

Example:

Chapter 01:
0.00 → 0.22

Chapter 02:
0.22 → 0.46

Chapter 03:
0.46 → 0.70

Chapter 04:
0.70 → 0.90

Phase 7 handoff:
0.90 → 1.00

These are visual proportions,
not necessarily exact equal path lengths.

==================================================
14. CHAPTER 01 — FAITH GEOMETRY
==================================================

Puri / Faith.

The route should begin subtly near the continuation
of the Phase-4 / Chapter-01 editorial state.

Preferred behavior:

start near lower editorial content,
move toward a sacred architectural region,
curve around image composition,
touch the Faith waypoint,
then leave toward Chapter 02.

Do not cut across:

main temple focal point
large headline
body copy.

Route may pass through unused image negative space
or along boundary between photography and ivory canvas.

==================================================
15. FAITH WAYPOINT
==================================================

Use existing temple or sacred flame icon.

Waypoint:

small gold circular node
+
icon positioned near/above node.

Approx node:

6–9px outer circle
2–4px solid center

Icon:

~24–30px

Do not build a large map marker.

==================================================
16. FAITH NODE ANIMATION
==================================================

As drawn line reaches node:

node:
scale .65 → 1

opacity:
0 → 1

icon:
opacity 0 → 1
y 6px → 0

Duration:
~220–320ms

No bounce.

No pulse after settling.

==================================================
17. CHAPTER 02 — ESCAPE GEOMETRY
==================================================

Kashmir / Escape.

This chapter should feel more open.

Thread can create a broader,
slower arc through the chapter.

It may travel through lower mountain/lake negative space.

Avoid crossing main mountain peak
or primary headline.

Compared with Faith:

use longer horizontal span.

This spatial expansion reinforces ESCAPE.

==================================================
18. ESCAPE WAYPOINT
==================================================

Use mountain icon.

Placement should feel integrated with
landscape horizon or open lower composition.

Not identical vertical position to Faith node.

==================================================
19. CHAPTER 03 — DISCOVER GEOMETRY
==================================================

Rajasthan / Discover.

The route should interact with architectural rhythm.

Use a tighter controlled curve.

Possible behavior:

route approaches architectural edge,
dips around arch geometry,
reaches heritage waypoint,
then exits.

Do not literally trace the whole arch.

Hint at structure without becoming ornamental overload.

==================================================
20. DISCOVER WAYPOINT
==================================================

Use:

heritage arch icon

not another temple icon.

Placement can align with:

jharokha / architectural opening
or chapter transition boundary.

Again:
different geometry from Faith and Escape.

==================================================
21. CHAPTER 04 — SLOW DOWN GEOMETRY
==================================================

Kerala / Slow Down.

This must be the calmest route segment.

Flatten curve amplitude.

Let it feel almost like a gentle water current.

Avoid dramatic S-bends.

The line can glide through:

water reflection
quiet lower imagery
open ivory region.

==================================================
22. SLOW DOWN WAYPOINT
==================================================

Use:

palm
or houseboat

Select whichever sits best visually.

Node should feel softer and more spacious.

No additional decorative ripple animation.

==================================================
23. CHAPTER CROSSINGS
==================================================

Between chapters:

the line must visually continue.

Do not:

end line
fade it
start a new line.

The route should cross chapter boundaries
through shared page whitespace.

At most:

stroke color/opacity may subtly react
to background tone.

==================================================
24. COLOR ADAPTATION
==================================================

Across backgrounds:

Faith:
antique gold standard

Escape:
slightly muted gold

Discover:
warmer gold

Slow Down:
soft warm gold

Do not animate obvious hue shifts.

Keep brand consistency.

If dynamic stroke color adds complexity:
use one gold everywhere.

==================================================
25. ROUTE AROUND TEXT
==================================================

Never place path directly through:

headline letters
body text
chapter number
experience labels

The path can cross photography.

It should not reduce reading clarity.

==================================================
26. ROUTE AROUND SUBJECTS
==================================================

Do not blindly cross important image subjects.

For our existing assets:

Puri:
avoid central temple / major deity architecture.

Kashmir:
avoid major mountain summit.

Rajasthan:
avoid central palace/arch focal area where possible.

Kerala:
avoid cutting directly across houseboat cabin.

Use chapter-specific safe corridor logic.

==================================================
27. SAFE CORRIDORS
==================================================

Implement optional per-chapter route hints in data.

Example:

thread: {
  entryX: 0.18,
  waypointX: 0.32,
  exitX: 0.72,
  bend: "low"
}

Use normalized values.

Possible type:

type ThreadRouteHint = {
  entryX: number;
  mediaX: number;
  exitX: number;
  waypointOffsetX?: number;
  waypointOffsetY?: number;
  curveBias?: "wide" | "tight" | "flat" | "sacred";
};

Keep route responsive.

==================================================
28. ACTIVE THREAD PROGRESS
==================================================

As user scrolls:

not-yet-reached path:
optional faint guide

reached path:
gold

reached waypoint:
visible

upcoming waypoint:
invisible or extremely subtle

Do not show all four active icons immediately.

==================================================
29. REVERSE SCROLL
==================================================

When scrolling upward:

line naturally retracts.

Waypoint icons disappear
when the route passes back before them.

No state should remain stuck.

==================================================
30. THREAD MUST NOT COMPETE WITH PHASE 5
==================================================

The line is secondary.

Photography and typography remain primary.

If at any viewport the line becomes
the first thing the eye sees:

reduce:

opacity
stroke width
icon scale.

==================================================
31. SCROLL INDICATOR RELATIONSHIP
==================================================

If Phase 5 already has any chapter progress cues,
do not add another large progress bar.

The Travel Thread itself becomes
the visual continuity indicator.

==================================================
32. END OF CHAPTER 04
==================================================

After Kerala experience row:

the route should continue into
a new calm transition region.

Do not abruptly terminate at Kerala.

Create:

<TravelThreadOutro />

This is still Phase 6.

==================================================
33. TRAVEL THREAD OUTRO
==================================================

Build a transitional section:

warm ivory / very subtle destination-inspired wash.

Suggested content:

eyebrow:
THE JOURNEY CONTINUES

headline:
FOUR WAYS TO FEEL.
COUNTLESS WAYS TO TRAVEL.

or:

THE JOURNEY
CONTINUES.

support:
Four ways to feel.
Countless ways to travel.

Keep concise.

==================================================
34. OUTRO COMPOSITION
==================================================

Do not make this another normal centered CTA section.

The thread itself should guide composition.

Example:

gold line enters from Chapter 04,
travels vertically / diagonally,
forms final larger destination node,
then continues slightly downward off-screen.

Text sits adjacent to this path.

This implies:

something is next.

==================================================
35. FINAL DESTINATION NODE
==================================================

At end of Phase 6:

create one larger hollow node.

Not a chapter icon.

This node represents:

NEXT JOURNEY.

Style:

outer:
12–18px ring

inner:
4–6px dot

small bloom only as it appears.

No infinite pulse.

==================================================
36. PHASE 7 HANDOFF
==================================================

The path should visually continue
BEYOND Phase 6.

Expose:

data-thread-anchor="phase7-entry"

or ref.

Do not implement actual Curated Journeys content yet.

Temporary semantic handoff may contain:

NEXT
CURATED JOURNEYS

but do not build package cards.

==================================================
37. NO CTA BUTTON YET
==================================================

Do not add:

Explore Journeys
View Packages
Book Now

in Phase 6.

Phase 7 will introduce actual journeys.

The Phase-6 ending is a narrative bridge.

==================================================
38. OUTRO MOTION
==================================================

As user reaches Phase-6 end:

line completes to final node.

Then:

eyebrow fades in
headline mask reveals
support copy appears

No giant scale effects.

The node can appear before typography.

==================================================
39. HEADER
==================================================

Keep Phase-5 editorial header behavior.

Do not introduce another navbar state.

Header must remain visually quiet.

==================================================
40. Z-INDEX
==================================================

Thread should layer intentionally.

Some segments may sit:

over image

while others may sit:

behind chapter typography.

Prefer a consistent layering model:

background photography
thread
editorial content

But if line over copy hurts readability:
clip/thread mask around text zones.

Do not randomly change z-index by chapter.

==================================================
41. THREAD MASKING
==================================================

If needed:

use chapter-specific masks or CSS mask layers
to hide line behind important content blocks.

This can create an elegant depth effect.

Example:

line appears behind editorial text panel,
then reemerges near image boundary.

Use sparingly.

==================================================
42. DEPTH BEHAVIOR
==================================================

Allowed:

thread passes behind one foreground content area.

Not allowed:

complex fake 3D weaving
multiple crossing layers
shadow-heavy ribbon effects.

Keep it subtle.

==================================================
43. PERFORMANCE
==================================================

Only one main path should animate.

Avoid dozens of independent SVG strokes.

Use:

one main path
four node groups
one final node

GSAP updates:

strokeDashoffset
node transforms / opacity

Do not animate complex filters every frame.

==================================================
44. NO PATH RECALCULATION ON SCROLL
==================================================

Geometry is calculated:

initialization
resize
orientation change
font/image/layout settle

NOT every scroll frame.

Scroll only changes draw progress.

==================================================
45. IMAGE / FONT READINESS
==================================================

Path geometry depends on rendered layout.

Initialize after:

document fonts ready

and critical Phase-5 layout settled.

Use:

document.fonts.ready

plus image readiness
or appropriate ResizeObserver.

Do not calculate path while image heights are unstable.

==================================================
46. RESIZE OBSERVER
==================================================

Use ResizeObserver on thread region
or chapter container.

When geometry changes:

debounce / requestAnimationFrame

rebuild route path.

Then refresh ScrollTrigger.

Avoid recursive resize loops.

==================================================
47. MOBILE BROWSER RESIZE
==================================================

Do not rebuild entire path on every tiny browser-bar
visualViewport height change.

Geometry is mostly width/layout dependent.

Use smart threshold:

recalculate on meaningful width/orientation/layout change.

Avoid iOS Safari jitter.

==================================================
48. REDUCED MOTION
==================================================

For prefers-reduced-motion:

render full static thread.

No progressive dash animation required.

All nodes visible.

No scroll-linked parallax added by Phase 6.

Content remains semantically identical.

==================================================
49. ACCESSIBILITY
==================================================

The SVG travel line is decorative.

Use:

aria-hidden="true"
focusable="false"

Do not expose every waypoint icon
as separate screen-reader content.

The chapter headings already communicate structure.

==================================================
50. SEMANTIC OUTRO
==================================================

TravelThreadOutro should use semantic text.

Example:

<section aria-labelledby="journey-continues-title">

heading level should follow existing page hierarchy.

Do not use heading text inside SVG.

==================================================
51. NO SEO TEXT IN SVG
==================================================

All meaningful copy remains HTML.

SVG contains visual route only.

==================================================
52. NO NEW ASSETS
==================================================

Phase 6 needs:

NO new photographs
NO PNG route
NO textures
NO video
NO WebGL
NO map imagery

Reuse:

Phase-5 photography
existing editorial icons

Create path entirely in SVG/code.

==================================================
53. DEVELOPMENT COMPONENTS
==================================================

Suggested:

src/components/thread/
  TravelThread.tsx
  TravelThreadNode.tsx
  TravelThreadOutro.tsx
  travelThreadGeometry.ts
  travelThreadData.ts
  travelThread.css

Do not pollute hero components.

==================================================
54. ROUTE DATA
==================================================

Keep route hints data-driven.

Example:

const THREAD_HINTS = {
  faith: {
    curveBias: "sacred",
    waypointIcon: "temple",
    entryX: .14,
    waypointX: .25,
    exitX: .66
  },

  escape: {
    curveBias: "wide",
    waypointIcon: "mountains",
    entryX: .66,
    waypointX: .72,
    exitX: .34
  },

  discover: {
    curveBias: "tight",
    waypointIcon: "heritage",
    entryX: .34,
    waypointX: .46,
    exitX: .69
  },

  slow: {
    curveBias: "flat",
    waypointIcon: "palm",
    entryX: .69,
    waypointX: .63,
    exitX: .42
  }
};

These numbers are examples.

Tune visually against actual layout.

==================================================
55. ACTIVE-FIRST ROTATION SUPPORT
==================================================

Critical:

Phase 5 chapter order is dynamic.

Therefore Phase 6 thread must follow
the ACTUAL rendered chapter order.

Do not assume:

Faith always first.

Example:

if active hero = Kashmir:

01 Escape
02 Discover
03 Slow Down
04 Faith

Thread route and waypoint order must become:

mountain
→ heritage
→ palm
→ temple

Generate path from rendered chapter order.

==================================================
56. NODE NUMBERING
==================================================

Do not permanently label icon nodes:

01 Faith
02 Escape
etc inside SVG.

Chapter order already communicates numbering.

Waypoint icon is enough.

If tiny order label is needed visually:

derive from current cyclic chapter order.

==================================================
57. PHASE 4 CONTINUITY
==================================================

Thread must NOT appear too early.

Phase 4 → Phase 5 first editorial continuation
needs breathing room.

Start first visible thread segment only
once Chapter-01 deeper story begins.

Not immediately when Phase-4 card settles.

==================================================
58. DRAW START
==================================================

Recommended:

thread begins around
first chapter 15–25% progression.

This prevents the line from competing with
Phase-4 handoff.

==================================================
59. DRAW END
==================================================

Final node should complete near
the end of TravelThreadOutro.

Do not finish entire route
while user is still inside Kerala chapter.

==================================================
60. DEBUG MODE
==================================================

Development only:

support optional:

?threadDebug=1

to display:

anchor positions
control points
bounding boxes
segment labels

Guard with import.meta.env.DEV.

Never ship visible debug UI in production.

==================================================
61. QA — MAIN 390×844 STORYBOARD
==================================================

Capture:

A
Phase-5 Chapter 01 before thread begins

B
Faith / first chapter
thread first emerges

C
first waypoint reached

D
transition from Chapter 01 → Chapter 02
continuous path visible

E
Chapter 02 waypoint

F
Chapter 02 → Chapter 03 connection

G
Chapter 03 waypoint

H
Chapter 03 → Chapter 04 connection

I
Chapter 04 waypoint

J
line leaving Chapter 04

K
Travel Thread Outro

L
final node + Phase-7-entry handoff

M
reverse scroll through one waypoint

N
reverse back before thread starts

==================================================
62. QA — ROUTE VARIATION
==================================================

Verify visually:

Faith path != Escape path

Escape path != Discover path

Discover path != Slow path

The system must not appear copied four times.

Check:

curve amplitude
horizontal position
waypoint position
interaction with imagery.

==================================================
63. QA — ACTIVE-FIRST ORDERS
==================================================

Test all four Phase-5 rotations:

Puri-first:
Temple → Mountain → Arch → Palm

Kashmir-first:
Mountain → Arch → Palm → Temple

Rajasthan-first:
Arch → Palm → Temple → Mountain

Kerala-first:
Palm → Temple → Mountain → Arch

The path must remain continuous
in every permutation.

==================================================
64. QA — RESPONSIVE
==================================================

Test:

360×800
375×812
390×844
393×852
412×915
430×932

Check:

line never leaves usable viewport unexpectedly

nodes do not overlap headlines

nodes do not overlap header

route does not cut through icon labels

route follows chapter geometry

no horizontal overflow

SVG doesn't increase document width

==================================================
65. QA — LAYOUT CHANGES
==================================================

Test:

device rotation

font loading delay

image loading delay

browser resize

reduced motion

refresh inside Phase 5

scroll restoration

Path should recalculate cleanly.

==================================================
66. PHASE 5 REGRESSION
==================================================

Verify:

chapter image masks unchanged

chapter typography unchanged

existing parallax unchanged

Phase-5 handoff transitions unchanged

experience icons unchanged

No route implementation should force
Phase-5 layouts into new repeated structure.

==================================================
67. UPPER PHASE REGRESSION
==================================================

Quick checks:

Phase 4 reverse → hero

Phase 3 planner

Phase 2 compass portal

Phase 1 intro

No regression.

==================================================
68. PERFORMANCE TARGET
==================================================

The Travel Thread must not introduce
visible scroll stutter.

Aim:

one animated SVG path

four waypoint groups

one final node

no expensive filter animation

no layout measurement during scroll

no React setState per scroll frame.

==================================================
69. FAILURE CONDITIONS
==================================================

FAIL if:

same route shape repeats each chapter.

FAIL if:

thread looks like a timeline component.

FAIL if:

thread looks like Google Maps navigation.

FAIL if:

thread dominates typography.

FAIL if:

path crosses major text blocks.

FAIL if:

path cuts central subjects badly.

FAIL if:

chapter layouts are modified just to fit the line.

FAIL if:

route breaks when active-first order changes.

FAIL if:

separate line fragments are visibly disconnected.

FAIL if:

line begins immediately at Phase-4 final card.

FAIL if:

Phase 7 package cards are built now.

==================================================
70. ACCEPTANCE CHECKLIST
==================================================

[ ] Phases 1–5 unchanged
[ ] one continuous SVG route
[ ] route uses existing Phase-5 anchors
[ ] path geometry generated from real layout
[ ] Faith geometry unique
[ ] Escape geometry unique
[ ] Discover geometry unique
[ ] Slow Down geometry unique
[ ] route adapts to active-first order
[ ] route adapts responsively
[ ] main line drawn by scroll
[ ] waypoint nodes reveal only when reached
[ ] reverse scroll rewinds correctly
[ ] no looping motion
[ ] route avoids typography
[ ] route respects main photo subjects
[ ] no horizontal overflow
[ ] route does not alter chapter structure
[ ] reduced motion static fallback
[ ] SVG decorative semantics correct
[ ] final Travel Thread Outro implemented
[ ] final destination node implemented
[ ] Phase-7 entry anchor exposed
[ ] no actual Phase-7 packages yet
[ ] six mobile viewports pass
[ ] all four cyclic chapter orders pass
[ ] performance remains smooth

==================================================
71. DEFINITION OF DONE
==================================================

The user should perceive:

“I moved through Faith, Escape,
Discovery and Slow Down.

They were not four unrelated sections.

A single journey was quietly connecting them.

The line changed character with each place.

It passed through sacred Puri,
opened up in Kashmir,
responded to Rajasthan's architecture,
then calmed itself across Kerala's water.

Now that line is leading me somewhere new.”

The final visual thought should be:

THE JOURNEY CONTINUES.

Not:

“End of section.”

If the thread makes the four chapters feel like
ONE continuous journey:

PASS.

If it feels like a decorative SVG timeline:

FAIL.

BUILD PHASE 6 ONLY.

Do not start Curated Journeys / Phase 7
until Phase-6 QA is complete and frozen.