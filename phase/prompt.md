# SHREE JAGANNATH HOLIDAYS
# FINAL PHASE 1 IMPLEMENTATION PROMPT
# Mobile Cinematic Hero — Black Brand Intro → Real Hinged Gate → Puri Reveal

Act as a senior frontend engineer, interaction designer, and motion engineer.

Build a completely new standalone Shree Jagannath Holidays mobile hero inside the existing fresh Vite + React + TypeScript workspace.

Do not connect to, import from, search for, or reuse any older Lovable project, Vishal Travels project, GitHub repository, or other existing website.

Use only the supplied SJH assets and the current fresh project.

==================================================
1. CORE CREATIVE DIRECTION
==================================================

The hero must feel like a cinematic ceremonial transition:

BLACK VOID
→ SJH LOGO DRAW
→ DARK GATE EMERGES
→ THIN GOLDEN LIGHT SEAM
→ LIGHT INTENSIFIES
→ HEAVY GATE PHYSICALLY SWINGS OPEN FROM HINGES
→ BRIGHT PORTAL BLOOM
→ PURI TEMPLE RESOLVES
→ HERO UI APPEARS QUIETLY
→ CALM IDLE STATE

This must NOT feel like:

- two PNGs sliding sideways
- a split-screen reveal
- two flat cards moving apart
- an image cut down the middle
- generic app transition
- fantasy particle portal
- Three.js/WebGL showcase

The defining moment is a REAL, HEAVY, ARCHITECTURAL HINGED GATE OPENING.

==================================================
2. PHASE 1 SCOPE
==================================================

Implement only:

01 — Black Brand Intro
02 — Gate Emerges From Darkness
03 — Golden Seam / Pressure Build
04 — Real Hinged Gate Opening
05 — Settled Puri Hero

Do NOT implement yet:

- destination swipe
- Kashmir portal
- planner expansion
- additional homepage sections
- desktop hero
- booking flow
- extra routes
- WebGL
- Three.js
- particle systems

==================================================
3. TARGET VIEWPORTS
==================================================

Primary:

390 × 844 CSS px

Also validate:

360 × 800
375 × 812
393 × 852
412 × 915
430 × 932

Phase 1 is mobile only:

< 768px

==================================================
4. PROVIDED ASSETS
==================================================

Use these supplied assets:

public/assets/sjh-hero/

hero-puri.webp
door-left.png
door-right.png
light-crack.png
sjh-logo.svg
compass.svg
arrow-right.svg
menu.svg

Do NOT regenerate substitutes.

Do NOT use a top-frame asset.

Do NOT replace hero-puri.webp.

Do NOT introduce stock photography.

==================================================
5. RUNTIME ASSET OPTIMIZATION
==================================================

The PNG doors are source masters.

Create optimized transparent runtime WebP versions if visual quality remains excellent:

door-left.webp
door-right.webp
light-crack.webp

Keep originals as masters.

Do not noticeably degrade:

- carvings
- gold details
- Jagannath motifs
- edge transparency

Preload only critical hero assets.

==================================================
6. STRUCTURE
==================================================

Use roughly:

src/
  components/
    hero/
      MobileCinematicHero.tsx
      heroMotion.ts
      heroData.ts
      hero.css

Use:

React
TypeScript
GSAP
CSS

No canvas.
No Three.js.
No R3F.
No WebGL.

==================================================
7. FRAME 01 — BLACK BRAND INTRO
==================================================

The hero begins near pure black.

Background:

#080705 or similar.

At first paint:

- Puri image may already be loaded behind the scene
- gate exists but is essentially hidden in darkness
- no hero copy visible
- no header visible
- no Journey Dock visible

The first visible event is the SJH brand.

Approx timing:

0.00–0.15s
black silence

0.15–0.85s
logo reveal

==================================================
8. SJH LOGO REVEAL
==================================================

Use sjh-logo.svg.

Create a refined SVG draw / mask reveal.

If useful SVG paths exist:

use stroke-dasharray / stroke-dashoffset.

If filled paths dominate:

use masks/clipping based on the SAME geometry.

Do not redraw the brand.

Suggested reveal order:

symbol
→ SJH
→ SHREE JAGANNATH HOLIDAYS

Motion:

opacity 0 → 1
scale .985 → 1
very small y movement
restrained gold illumination

No bounce.
No spring overshoot.

Below logo:

thin vertical gold line
+
EXPLORE

small uppercase
high letter-spacing
low-key premium treatment

==================================================
9. FRAME 02 — GATE EMERGES FROM DARKNESS
==================================================

Around 0.70–1.15s:

gradually reveal the closed carved gate from darkness.

Do not abruptly fade it in.

Gate initial visual state:

brightness around .28–.38
saturation slightly reduced
contrast slightly elevated

As it emerges:

bronze highlights appear first
wood detail becomes readable
outer gate remains darker than center

The Puri temple must still not visibly leak through.

The logo remains visible during the first part of this reveal.

==================================================
10. CLOSED GATE GEOMETRY
==================================================

The two doors must read as ONE physical closed gate.

Requirements:

- zero temple leakage
- zero blank top wedge
- center seam fully sealed
- preserve aspect ratio
- no horizontal stretching
- center overlap about 4–8px if needed
- use existing audited crop/overscan logic for curved transparent tops

Do not simply place two 50vw images and hope they align.

==================================================
11. FRAME 03 — GOLDEN SEAM
==================================================

Around ~1.15–1.30s:

introduce a very thin central light seam.

Build it using THREE synchronized layers:

A. CORE
1px bright vertical line
warm white/gold
approximately #FFE9A8

B. INNER GLOW
4–18px soft gold glow
blurred
restrained

C. BLOOM TEXTURE
light-crack.png
inside a narrow clipped wrapper

Never render light-crack.png at full width.

Initial wrapper width:

~18–22px

Build toward:

~28–45px before the gate opens.

No huge energy beam.
No magic explosion.
No floating spark storm.

==================================================
12. LIGHT REVEALS THE GATE
==================================================

As the seam intensifies:

the INNER EDGES of the gate should become brighter before the outer edges.

Create a centered animated illumination overlay using CSS gradients.

Visual behavior:

center seam bright
→ nearby carvings warm up
→ mid-door detail becomes readable
→ outer edges remain darker

This makes the light feel physically present behind the gate.

==================================================
13. PRESSURE BUILD
==================================================

Around ~1.45–1.65s:

before the large opening:

create a tiny mechanical release.

For example:

center gap:
0px
→ 2px
→ 4px

Very subtle.

No shaking.
No vibration.
No cartoon squash.

The viewer should feel:

“something powerful is behind this heavy gate.”

==================================================
14. REAL HINGED GATE PHYSICS
==================================================

THIS IS THE MOST IMPORTANT REQUIREMENT.

Use a parent perspective container:

perspective:
approximately 1100–1400px

Left door:

transform-origin: left center

Right door:

transform-origin: right center

ROTATION is primary.

TRANSLATION is secondary.

Do NOT primarily animate using xPercent ±82.

Suggested starting geometry:

LEFT:
rotateY(0 → approximately -72deg to -80deg)

RIGHT:
rotateY(0 → approximately +72deg to +80deg)

Small supporting translation only:

LEFT:
translateX around -2vw to -5vw

RIGHT:
translateX around +2vw to +5vw

Tune visually.

The viewer must clearly perceive:

outer edges = hinges
inner edges = swing away from each other

The doors must move INTO DEPTH.

==================================================
15. DOOR THICKNESS
==================================================

The doors must not look like paper-thin PNG cards.

Add a restrained perceived depth strip to the INNER edge of each leaf.

Approx perceived thickness:

8–14px

Left door:
thickness on right inner edge

Right door:
thickness on left inner edge

Use dark wood / bronze gradient.

During rotation:

thickness becomes slightly more visible.

This is essential for realism.

==================================================
16. SHADOW SYSTEM
==================================================

Closed:

strong contact darkness at center seam.

As gates open:

- center contact shadow decreases
- inner edges receive warm light
- subtle directional gate shadows appear
- no giant CSS drop-shadow
- no neon outline

Keep shadows photographic and understated.

==================================================
17. GATE SPEED PROFILE
==================================================

The movement must feel HEAVY.

The opening must not use constant speed.

Motion rhythm:

0–15%
very slow release

15–45%
accelerates

45–70%
fastest part of the whole hero

70–100%
heavy deceleration and settle

Use:

power3.inOut

or a carefully tuned custom cubic-bezier.

No bounce.

The fastest moment of the entire intro must occur during the middle of the gate opening.

==================================================
18. MASTER GATE OPEN TIMING
==================================================

Approx:

1.60s
opening begins

1.60–1.82
slow physical release

1.82–2.25
strong acceleration

2.25–2.55
fast portal reveal

2.55–2.80
heavy braking / settle

Do not obsess over milliseconds if better visual physics require a small adjustment.

==================================================
19. PORTAL BLOOM BEHAVIOR
==================================================

As the gate begins opening:

core seam brightness ↑
inner glow width ↑
light-crack bloom ↑
inner door illumination ↑

At roughly 35–50% gate openness:

portal bloom reaches maximum intensity.

Then:

bloom opacity ↓
Puri clarity ↑
background exposure ↑

By approximately 75% gate openness:

bloom is nearly gone
Puri image is clearly visible

The result should feel like:

camera briefly overwhelmed by light
→ vision adapts
→ Puri appears

Do not leave a glowing beam hanging in the final hero.

==================================================
20. PURI BACKGROUND REVEAL
==================================================

Initial:

scale approximately 1.10–1.12

filter approximately:

brightness(.55–.65)
blur(2px–3px)
saturate(.85)

During opening:

scale → ~1.025–1.04
brightness → 1
blur → 0
saturate → 1

Optional tiny y correction:

translateY(6–10px → 0)

Keep temple composition centered.

Shikhara must remain visually dominant.

No aggressive zoom.

==================================================
21. INTRO LOGO EXIT
==================================================

As the heavy gate opening begins:

center intro logo exits.

Suggested:

opacity 1 → 0
scale 1 → .985
y 0 → -6px

duration:

300–400ms

It should feel like the logo dissolves into the light.

Do not keep centered logo over the final hero.

==================================================
22. SETTLED GATE FRAMING
==================================================

The doors must NOT disappear completely.

At settled state:

leave approximately:

20–34px

of carved gate presence visible at both sides.

It should feel like:

looking THROUGH an opened ceremonial doorway.

Not:

a fullscreen background with unrelated decorative bars.

Tune final rotation/translation per viewport to preserve this.

==================================================
23. SETTLED UI ORDER
==================================================

Only after the gate is mostly open:

1. header SJH logo
2. menu button
3. PURI | ODISHA
4. JOURNEYS
5. OF FAITH.
6. MEMORIES FOR LIFE.
7. support copy
8. Journey Dock
9. optional decorative progress

Do not show this UI during the black intro.

==================================================
24. HEADER
==================================================

Top-left:

small SJH logo

Top-right:

menu button

Respect:

env(safe-area-inset-top)

Keep it visually light.

No giant glass navigation bar.

==================================================
25. HERO COPY
==================================================

Use:

PURI | ODISHA

JOURNEYS
OF FAITH.

MEMORIES
FOR LIFE.

Pilgrimages · Holidays
Crafted Personally.

Headline:

warm ivory

FAITH.:

antique gold approximately #EBC678

High-contrast elegant serif heading.

Clean sans-serif for supporting UI.

==================================================
26. TEXT MOTION
==================================================

Use line masks.

Each headline line:

overflow: hidden

Child begins:

translateY(105–115%)

Animate to:

translateY(0)

Stagger:

~70–100ms

No per-letter flying text.
No text explosions.
No bounce.

==================================================
27. JOURNEY DOCK
==================================================

Bottom control:

compass icon
Where do you want
to go?
gold circular arrow

Dark warm translucent surface.

Very restrained blur.

Subtle border.

Height approximately:

68–78px

Respect:

env(safe-area-inset-bottom)

Entrance:

y 26–30px → 0
opacity 0 → 1
scale .98 → 1

ease:

power3.out

==================================================
28. PROGRESS INDICATOR
==================================================

The visual reference contains:

5 horizontal segments
+
01 / 05

Phase 1 has no swipe.

If displayed:

pointer-events: none
aria-hidden: true

Do not create real carousel state yet.

Do not imply interaction in code.

==================================================
29. MASTER TIMELINE
==================================================

Use this as the target rhythm:

0.00
BLACK

0.15
SVG LOGO DRAW

0.35
EXPLORE DETAIL

0.72
GATE STARTS EMERGING

1.15
1PX LIGHT CORE

1.28
INNER GLOW

1.43
PORTAL BLOOM BUILD

1.58
MICRO SEAM

1.66
HINGED GATE MOTION START

1.66–2.78
DOOR SWING
+
PORTAL BLOOM
+
PURI REVEAL
+
INTRO LOGO EXIT

2.70
HEADER IN

2.82
PURI | ODISHA

2.94
JOURNEYS

3.05
OF FAITH.

3.22
MEMORIES FOR LIFE.

3.38
SUPPORT COPY

3.55
JOURNEY DOCK

3.85
OPTIONAL PROGRESS

4.00
IDLE

Final intro can land around:

3.8–4.2 seconds

if needed for better pacing.

==================================================
30. IDLE STATE
==================================================

After ~4 seconds:

major animation stops.

Allowed:

very slight image breathing
very subtle lighting drift

Not allowed:

constant particles
door wobble
pulsating CTA
continuous text motion
obvious looping parallax

Luxury requires stillness.

==================================================
31. USER INTERRUPTION
==================================================

During intro only:

intentional tap/click/scroll may fast-forward smoothly to settled state.

Prefer short accelerated completion rather than an ugly snap.

After intro:

REMOVE interruption listeners.

Do not interfere with:

menu
Journey Dock
future links

==================================================
32. REVISIT LOGIC
==================================================

Use sessionStorage.

First visit in session:

play full cinematic intro.

After completed:

set:

sjh_hero_intro_seen

Future Home renders in same session:

show settled hero immediately
OR
use refined <=700ms mini reveal.

Do not replay the entire ceremony every time.

==================================================
33. REDUCED MOTION
==================================================

For:

prefers-reduced-motion: reduce

skip:

logo drawing
gate reveal
beam
gate swing
camera motion

Show final settled state immediately.

==================================================
34. RESPONSIVE CALIBRATION
==================================================

Do not use one fixed final door angle for all mobile widths.

For every required viewport:

calibrate final:

rotateY
translation
crop
background positioning

to achieve:

20–34px side framing
zero horizontal overflow
zero blank top wedge
zero temple leak before reveal

Required sizes:

360×800
375×812
390×844
393×852
412×915
430×932

==================================================
35. VISUAL QA STATES
==================================================

At 390×844 capture screenshots for:

FRAME A
Black logo intro

FRAME B
Gate emerged in darkness

FRAME C
Bright thin seam / pressure state

FRAME D
Mid real-hinged opening

FRAME E
Settled Puri hero

Do not report “pixel perfect” or “exact match” without actual screenshot comparison.

==================================================
36. QA CHECKLIST
==================================================

Verify:

[ ] starts from true near-black
[ ] SJH logo reveals before gate
[ ] gate emerges slowly from darkness
[ ] no Puri leak before intended reveal
[ ] gold seam begins thin
[ ] beam does not look like energy weapon
[ ] light reveals inner carvings first
[ ] gate has physical hinge behavior
[ ] rotateY is the primary opening motion
[ ] translation is secondary only
[ ] doors have visible thickness
[ ] no flat-card appearance
[ ] no split-screen feeling
[ ] opening has heavy acceleration/deceleration
[ ] fastest point is middle of gate opening
[ ] bloom peaks briefly then disappears
[ ] Puri resolves from brightness
[ ] temple remains centered
[ ] side carved framing remains
[ ] no horizontal overflow
[ ] no layout jump
[ ] notch safe area works
[ ] bottom safe area works
[ ] reduced-motion works
[ ] revisit logic works
[ ] intro skip works
[ ] skip listener removed afterward
[ ] final hero becomes calm
[ ] all six viewport sizes pass

==================================================
37. DEVELOPMENT PROCESS
==================================================

Before modifying code:

1. inspect the current Phase 1 implementation
2. locate old sideways/xPercent door behavior
3. preserve working crop/overscan logic
4. preserve sessionStorage logic
5. preserve reduced-motion logic
6. preserve safe-area handling
7. replace only incorrect motion/visual mechanics
8. implement real perspective hinges
9. implement three-layer light
10. run app
11. screenshot key states
12. visually compare
13. iterate

Do not rewrite unrelated stable code.

==================================================
38. DEFINITION OF DONE
==================================================

A viewer should understand this experience without explanation:

“I am in darkness.
The SJH identity is revealed.
A monumental carved gateway emerges.
A tiny line of sacred light appears.
The light grows stronger.
The massive gate releases.
The two heavy leaves physically swing open.
For a moment the world beyond is overwhelmingly bright.
Puri slowly resolves from the light.
I am looking through the opened gate.
The travel interface quietly appears.”

If instead it feels like:

“two PNGs slide away and reveal a background image”

the implementation is incorrect.

Build this final Phase 1 now.

Do NOT proceed to Phase 2 until the five key visual states are screenshot-validated.