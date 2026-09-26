# SHREE JAGANNATH HOLIDAYS
# PHASE 7 — CURATED JOURNEYS
# MOBILE-FIRST CONTINUOUS HOMEPAGE IMPLEMENTATION
# FINAL PRODUCTION DIRECTIVE

Act as a senior frontend engineer, editorial designer,
motion director, UX architect, accessibility engineer,
and mobile performance engineer.

PHASES 1–6 ARE FROZEN.

Do not redesign, refactor, retime, or disturb:

- Phase 1 ceremonial gate intro
- Phase 2 four-direction portal engine
- Phase 3 Journey Dock / Planner morph
- Phase 4 Cinema → Magazine scroll transformation
- Phase 5 Feeling chapters
- Phase 6 Travel Thread geometry
- Phase 6 waypoint logic
- Phase 6 final destination node
- existing mobile header behavior
- reduced-motion behavior
- accessibility foundations

Phase 7 adds exactly one new homepage section:

CURATED JOURNEYS

This section begins directly underneath
the existing Phase-6 Travel Thread Outro.

NO NEW SCENE.
NO NEW FULLSCREEN INTRO.
NO RESET.
NO BLACK TRANSITION.
NO NEW HERO.

The user simply keeps scrolling
inside the same mobile document.


==================================================
1. CORE EXPERIENCE
==================================================

The homepage narrative so far is:

DESTINATION
→ FEELING
→ STORY
→ TRAVEL THREAD

Phase 7 now becomes:

TRAVEL THREAD
→ REAL JOURNEYS

The user should understand:

"I know how I want to feel.
Now show me an actual journey I can take."

Phase 7 must become more practical than Phase 5,
but remain unmistakably premium and editorial.


==================================================
2. SAME VIEWPORT / SAME PAGE
==================================================

Primary design reference:

390 × 844

Also support:

360 × 800
375 × 812
393 × 852
412 × 915
430 × 932

Do not think in terms of separate scenes.

The same phone viewport simply reveals
different parts of the long document as the user scrolls.


==================================================
3. PAGE ARCHITECTURE
==================================================

Current homepage structure:

SECTION 01
Cinematic Hero
Phases 1 + 2 + 3

SECTION 02
Editorial Entry
Phase 4

SECTION 03
Choose Your Feeling
Phase 5 + Travel Thread Phase 6

SECTION 04
Curated Journeys
Phase 7 ← BUILD THIS

Future:

SECTION 05
Why SJH

SECTION 06
Traveller Stories

SECTION 07
Travel Memory Gallery

SECTION 08
Start Your Journey

Footer


==================================================
4. PHASE-6 HANDOFF
==================================================

Phase 6 currently ends with:

THE JOURNEY CONTINUES.

FOUR WAYS TO FEEL.
COUNTLESS WAYS TO TRAVEL.

          ◎
          │
          │
          ↓

data-thread-anchor="phase7-entry"

Phase 7 must continue directly from this anchor.

The gold vertical stem should visually lead toward:

JOURNEYS, CRAFTED WITH INTENT

CURATED
JOURNEYS

Do not restart the thread animation.

Do not create another large waypoint system.

The thread has completed its narrative purpose.


==================================================
5. PHASE-7 INTRO
==================================================

Create:

<section className="sjhCuratedJourneys">

Intro content:

eyebrow:
JOURNEYS, CRAFTED WITH INTENT

headline:
CURATED
JOURNEYS

support:
Handcrafted itineraries.
Deeper experiences.
Meaningful travel, the SJH way.

Keep this intro relatively compact.

Target visual height:

approximately 55–70svh,
NOT another 100svh cinematic intro.

The first Sacred Odisha image may begin
peeking into the bottom of the viewport.


==================================================
6. INTRO MOTION
==================================================

As Phase-6 final node leaves upper viewport:

gold stem:
continues downward briefly

eyebrow:
opacity 0 → 1
y 12px → 0

headline:
masked line reveal

support:
opacity 0 → 1
y 16px → 0

First journey image:
begins appearing from bottom.

No giant scale animation.

No page transition.


==================================================
7. JOURNEY DATA MODEL
==================================================

Create one typed data source.

Example:

type JourneyId =
  | "sacred-odisha"
  | "kashmir-valley"
  | "royal-rajasthan"
  | "kerala-slowly";

type Journey = {
  id: JourneyId;
  index: number;
  mood: string[];
  title: string[];
  route: string[];
  duration: {
    nights: number;
    days: number;
  };
  description: string;
  mainImage: string;
  detailImages: {
    src: string;
    alt: string;
  }[];
  href: string;
  layout:
    | "sacred"
    | "alpine"
    | "royal"
    | "slow";
};

Keep all content and assets data-driven.


==================================================
8. EXACT ASSET DIRECTORY
==================================================

Place Phase-7 assets under:

/assets/sjh-phase7/

Use EXACT filenames below.


==================================================
9. SACRED ODISHA ASSETS
==================================================

Main:

/assets/sjh-phase7/journey-sacred-odisha.webp

1200 × 1500
4:5 portrait

Supporting:

/assets/sjh-phase7/odisha-konark-detail.webp

1200 × 900
4:3 landscape

/assets/sjh-phase7/odisha-bhubaneswar-detail.webp

1200 × 900
4:3 landscape


==================================================
10. KASHMIR VALLEY ASSETS
==================================================

Main:

/assets/sjh-phase7/journey-kashmir-valley.webp

1200 × 1500

Supporting:

/assets/sjh-phase7/kashmir-srinagar-detail.webp

1200 × 900

/assets/sjh-phase7/kashmir-pahalgam-detail.webp

1200 × 900

Important:

Do NOT refer to the Srinagar/Dal Lake detail
as Gulmarg.

The main image carries the broader
mountain / valley visual.

Supporting images are:

Srinagar / Dal Lake
Pahalgam Valley


==================================================
11. ROYAL RAJASTHAN ASSETS
==================================================

Main:

/assets/sjh-phase7/journey-royal-rajasthan.webp

1200 × 1500

Supporting:

/assets/sjh-phase7/rajasthan-jodhpur-detail.webp

1200 × 900

/assets/sjh-phase7/rajasthan-udaipur-detail.webp

1200 × 900


==================================================
12. KERALA SLOWLY ASSETS
==================================================

Main:

/assets/sjh-phase7/journey-kerala-slowly.webp

1200 × 1500

Supporting:

/assets/sjh-phase7/kerala-munnar-detail.webp

1200 × 900

/assets/sjh-phase7/kerala-kochi-detail.webp

1200 × 900


==================================================
13. JOURNEY 01 — SACRED ODISHA
==================================================

index:
01 / 04

mood:
FAITH · CULTURE · COASTLINE

title:
SACRED
ODISHA

route:
Puri
Konark
Bhubaneswar

duration:
4 Nights · 5 Days

description:

Walk the sacred path through temple towns,
ancient architecture and coastal mornings —
a journey shaped by ritual, history and devotion.

CTA:

View Journey →

href:

/journeys/sacred-odisha


==================================================
14. JOURNEY 02 — KASHMIR VALLEY
==================================================

index:
02 / 04

mood:
MOUNTAINS · LAKES · STILLNESS

title:
KASHMIR
VALLEY

route:
Srinagar
Gulmarg
Pahalgam

duration:
5 Nights · 6 Days

description:

Snow peaks, still lakes and open valleys.
A slower journey through Kashmir's most
memorable landscapes.

CTA:

View Journey →

href:

/journeys/kashmir-valley


==================================================
15. JOURNEY 03 — ROYAL RAJASTHAN
==================================================

index:
03 / 04

mood:
HERITAGE · ROYALTY · LIVING CULTURE

title:
ROYAL
RAJASTHAN

route:
Jaipur
Jodhpur
Udaipur

duration:
6 Nights · 7 Days

description:

Palaces, forts and living traditions —
a journey through cities where history
still shapes everyday life.

CTA:

View Journey →

href:

/journeys/royal-rajasthan


==================================================
16. JOURNEY 04 — KERALA SLOWLY
==================================================

index:
04 / 04

mood:
NATURE · BACKWATERS · UNHURRIED DAYS

title:
KERALA
SLOWLY

route:
Kochi
Munnar
Alleppey

duration:
5 Nights · 6 Days

description:

Tea hills, heritage streets and quiet backwaters.
Travel Kerala at a pace that leaves room
to actually experience it.

CTA:

View Journey →

href:

/journeys/kerala-slowly


==================================================
17. IMPORTANT — NOT FOUR GENERIC CARDS
==================================================

Do not build:

<JourneyCard />
<JourneyCard />
<JourneyCard />
<JourneyCard />

with identical structure.

There may be one reusable technical component,
but its visual layout must support four genuinely
different editorial compositions.

If all four look structurally identical:

FAIL.


==================================================
18. SHARED CHAPTER CONTENT
==================================================

Every journey still contains:

index
mood
title
route
duration
description
main image
supporting imagery
CTA

But placement, image proportion,
spacing, and transition rhythm must vary.


==================================================
19. JOURNEY 01 LAYOUT — SACRED ODISHA
==================================================

Visual character:

sacred
warm
architectural
coastal

Composition:

metadata first

main portrait image:
large
rounded ~24–28px

copy beneath

detail images:
after primary narrative

Use:

Konark architectural detail
+
Bhubaneswar temple detail

Suggested support composition:

┌───────────────────┐
│   Konark detail   │
└───────────────────┘

      ┌─────────────┐
      │ Bhubaneswar │
      └─────────────┘

Slightly staggered,
not symmetrical card grid.


==================================================
20. JOURNEY 02 LAYOUT — KASHMIR
==================================================

Visual character:

open
cooler
breathing
spacious

Main image should feel taller
and have more surrounding negative space.

Supporting images can use:

one wider landscape
+
one inset image.

Srinagar detail:
larger supporting image.

Pahalgam:
smaller secondary visual.

Avoid crowding mountain imagery.


==================================================
21. JOURNEY 03 LAYOUT — RAJASTHAN
==================================================

Visual character:

architectural
structured
heritage

Main image may use:

upper arch-style corner treatment

or:

subtle framed geometry.

Supporting images:

Jodhpur fort/city
+
Udaipur waterfront

Composition may alternate left/right alignment
more aggressively than Kashmir.

Do not add fake ornamental PNG assets.


==================================================
22. JOURNEY 04 LAYOUT — KERALA
==================================================

Visual character:

quiet
open
water
slow

Largest breathing room of the four.

Main image should feel calm.

Supporting:

Munnar tea hills
+
Kochi heritage waterfront

Use fewer overlapping elements.

The final journey should visually decelerate
before the next homepage section.


==================================================
23. NATURAL DOCUMENT FLOW
==================================================

Important:

Do NOT make all four journeys pinned 100svh scenes.

Use normal page scrolling.

Each journey may span roughly:

95–140svh

depending its layout.

Content decides height.

Do not force exact viewport equality.


==================================================
24. MOTION INTENSITY
==================================================

Phase 7 motion is calmer than Phases 1–5.

Allowed:

image mask reveal
small parallax
line-mask typography
subtle stagger
controlled scale
next-journey peek

Not allowed:

giant portal
large pinning
3D transforms
rotating cards
horizontal slider
scroll snapping
WebGL
liquid distortion
long cinematic pause


==================================================
25. JOURNEY ARRIVAL — MASTER SEQUENCE
==================================================

As each journey approaches:

STEP 1
index + mood enter

STEP 2
main image reveals

STEP 3
title enters

STEP 4
route + duration appear

STEP 5
description enters

STEP 6
CTA appears

STEP 7
supporting images become visible

STEP 8
next journey begins peeking below


==================================================
26. MAIN IMAGE REVEAL
==================================================

Use editorial upward reveal.

Initial:

clip-path:
inset(100% 0 0 0 round 26px)

Final:

inset(0% 0 0 0 round 26px)

Image itself:

scale:
1.045 → 1.00

optional y:
18px → 0

Scroll driven.

No autoplay.


==================================================
27. IMAGE REVEAL TIMING
==================================================

Suggested trigger:

start:
top 82%

end:
top 30%

scrub:
0.45–0.7

Do not use overly laggy scrub.

Motion should feel connected to finger scrolling.


==================================================
28. NUMBER + MOOD
==================================================

Example:

01 / 04
FAITH · CULTURE · COASTLINE

Animation:

opacity:
0 → 1

y:
14px → 0

Duration:
~350ms equivalent scroll range.

Do not animate each word separately.


==================================================
29. TITLE
==================================================

Use current premium serif.

Example:

SACRED
ODISHA

line mask reveal.

Do not animate letters individually.

Suggested mobile:

font-size:
clamp(42px, 12vw, 58px)

Tune by title.


==================================================
30. ROUTE PRESENTATION
==================================================

Use:

Puri · Konark · Bhubaneswar

or a refined line such as:

Puri
   •
Konark
   •
Bhubaneswar

Do not build a mini map.

Do not repeat the Phase-6 travel thread here.


==================================================
31. DURATION
==================================================

Show:

4 Nights · 5 Days

with simple line icon:

clock / crescent / itinerary mark

Existing icon system preferred.

No badge pill explosion.


==================================================
32. DESCRIPTION
==================================================

Use approximately 3–5 lines on mobile.

Body size:

~14–16px

Readable line-height:

~1.45–1.6

Do not compress editorial copy
to fit one viewport.


==================================================
33. PRIMARY CTA
==================================================

CTA:

View Journey →

More visible than Phase-5 text actions.

Recommended:

height:
46–50px

padding:
0 20–24px

border radius:
999px
or refined 16–20px pill

Background:

Temple Black
or
Antique Gold

Use whichever gives stronger contrast
with current journey background.

No gradient.

No shimmer.

No pulse.


==================================================
34. CTA MICROINTERACTION
==================================================

Press:

scale:
1 → .98 → 1

Arrow:

translateX:
0 → 4px

Very subtle.

No ripple.


==================================================
35. CTA ROUTING CONTRACT
==================================================

Routes:

/journeys/sacred-odisha
/journeys/kashmir-valley
/journeys/royal-rajasthan
/journeys/kerala-slowly

Do NOT build full journey detail pages in Phase 7.

If real routing is already configured:

use semantic links.

If route pages do not exist yet:

store href in journey data
and expose:

onJourneySelect?(journeyId, href)

Do NOT fake a successful navigation.

Do NOT create placeholder booking pages.


==================================================
36. PHASE-5 CTA UPDATE
==================================================

Add subtle secondary link beneath
the existing Phase-5 experience markers.

Puri:

Explore Puri Journey →

Kashmir:

Explore Kashmir Journey →

Rajasthan:

Explore Rajasthan Journey →

Kerala:

Explore Kerala Journey →

These should use the same journey route metadata
as Phase 7.

Do not duplicate URL strings in two different places.


==================================================
37. PHASE-5 CTA VISUAL STYLE
==================================================

This is NOT the same as Phase-7 CTA.

Use:

background:
none

font:
12–13px

color:
existing gold / warm brown

small arrow

thin hover/press underline or line-draw

minimum accessible touch height:
44px via padding/hit area.

Visually remains secondary.


==================================================
38. SUPPORTING IMAGE APPEARANCE
==================================================

Supporting images do not need complex animation.

Use:

opacity:
0 → 1

y:
18–28px → 0

scale:
1.02 → 1

Do not individually pin them.


==================================================
39. SUPPORT IMAGE PARALLAX
==================================================

Optional extremely subtle:

maximum perceived movement:
14–24px

Do not apply to every support image.

Use:

Odisha:
small architectural parallax

Kashmir:
landscape parallax

Rajasthan:
tighter image movement

Kerala:
almost none


==================================================
40. NEXT JOURNEY PEEK
==================================================

Critical continuity behavior.

Before current journey completely exits:

next journey's visual atmosphere should begin appearing
at the bottom 10–18% of viewport.

This can be:

next main image upper edge

or:

next journey's number/mood

depending layout.

Do NOT show both aggressively.

The page must feel continuous.


==================================================
41. NO BLANK TRANSITIONS
==================================================

Never produce:

current journey ends
→ empty ivory
→ next journey begins

Keep visual rhythm connected.


==================================================
42. BACKGROUND TONES
==================================================

Subtle destination tones allowed.

Sacred Odisha:
#F4EFE6

Kashmir:
#F1F2EE

Rajasthan:
#F3E9DC

Kerala:
#EEF1E8

These already relate to Phase 5.

Do not suddenly introduce unrelated backgrounds.


==================================================
43. TONE TRANSITIONS
==================================================

Between journeys:

background-color should interpolate gently.

No white flashes.

No hard section breaks.


==================================================
44. HEADER
==================================================

Keep existing editorial header.

Dark temple-black logo/text
over ivory backgrounds.

No new header state.

Header remains quiet.


==================================================
45. PHASE-6 GOLD THREAD
==================================================

Do NOT extend the full travel thread
through all Phase-7 journeys.

Use it only for:

Phase-6 → Phase-7 handoff.

Then allow it to visually resolve/fade.

Phase 7 needs its own calmer editorial language.


==================================================
46. THREAD END BEHAVIOR
==================================================

Suggested:

gold stem reaches Curated Journeys intro

small terminal dot / rule

opacity:
1 → 0

by first Sacred Odisha main image.

No abrupt disappearance.


==================================================
47. IMAGE LOADING
==================================================

Intro:

preload only Sacred Odisha main image
once user approaches Phase 7.

Then progressively preload:

Kashmir main
then Rajasthan
then Kerala.

Supporting images:

lazy load.


==================================================
48. RESPONSIVE IMAGE MARKUP
==================================================

Use semantic:

<picture>
<img>

with:

width
height
loading
decoding

Set explicit aspect-ratio.

Main:

aspect-ratio: 4 / 5

Details:

aspect-ratio: 4 / 3

Prevent CLS.


==================================================
49. OBJECT POSITION
==================================================

Store optional objectPosition per image.

Do not rely on one global:

object-position: center

because each photograph has a different subject.

Keep configurable in data.


==================================================
50. PERFORMANCE
==================================================

Do not render all 12 images as active
high-resolution GPU layers.

Normal DOM images are fine.

Only animate near-visible elements.

Below fold:

loading="lazy"

Upcoming main image:

preload/priority only when needed.


==================================================
51. SCROLLTRIGGER STRATEGY
==================================================

Prefer small local ScrollTriggers.

Each journey can have:

1 main image reveal trigger
1 text reveal timeline
1 support image reveal

Do not create 20 unrelated triggers
for every word and icon.

Use gsap.context.

Clean on unmount.


==================================================
52. DO NOT PIN EVERYTHING
==================================================

Avoid heavy pinning.

If one journey needs brief sticky media:

maximum modest sticky behavior.

Example:

position: sticky
top: headerOffset + 20px

while text naturally scrolls.

But use only where visually necessary.

Do not force all four to use it.


==================================================
53. SACRED ODISHA MOTION CHARACTER
==================================================

Slightly ceremonial.

Image reveal:
steady upward mask.

Detail images:
architectural stagger.

CTA:
comes last.

No dramatic effects.


==================================================
54. KASHMIR MOTION CHARACTER
==================================================

More spacious.

Main image:
slower scale settle.

Typography:
larger breathing intervals.

Supporting imagery:
slight depth/parallax.

Avoid busy stagger.


==================================================
55. RAJASTHAN MOTION CHARACTER
==================================================

Tighter, more architectural rhythm.

Image mask:
cleaner / sharper.

Text:
slightly faster reveal.

Support images:
offset composition.

No fake arch animation unless done purely
through existing CSS geometry.


==================================================
56. KERALA MOTION CHARACTER
==================================================

Slowest, quietest.

Very little parallax.

More white/ivory breathing room.

Text reveal slightly softer.

The entire final journey should visually decelerate.


==================================================
57. PHASE-7 ENDING
==================================================

After Kerala:

do not immediately start Phase 8 content.

Create approximately:

20–35svh

of breathing transition.

A small continuation cue can appear:

TRAVEL,
PERSONALLY CRAFTED.

or simply let spacing lead forward.

Phase 8 will handle trust / Why SJH.


==================================================
58. NO PRICE
==================================================

Do NOT show:

₹18,999
From ₹...
Discount
Save X%
deal labels

Homepage remains enquiry-led and premium.

Pricing belongs later.


==================================================
59. NO BOOK NOW
==================================================

Use:

View Journey →

Not:

Book Now
Buy
Reserve
Check Out


==================================================
60. ACCESSIBILITY
==================================================

Section:

<section aria-labelledby="curated-journeys-title">

Main heading:

h2
CURATED JOURNEYS

Each journey:

article or section

Journey title:

h3

CTA accessible names:

View Sacred Odisha journey
View Kashmir Valley journey
View Royal Rajasthan journey
View Kerala Slowly journey


==================================================
61. IMAGE ALT TEXT
==================================================

Use meaningful concise descriptions.

Examples:

Sacred Odisha main:
Temple architecture near the Odisha coast at sunset.

Konark:
Stone wheel and carved architecture at Konark.

Bhubaneswar:
Historic temple complex in Bhubaneswar.

Kashmir:
Mountain valley and lake landscape in Kashmir.

Srinagar:
Lake and wooden houseboats in Srinagar.

Pahalgam:
Mountain river valley near Pahalgam.

Rajasthan:
Historic Rajasthan fort and palace landscape.

Jodhpur:
Fort overlooking Jodhpur city.

Udaipur:
Palace architecture beside a Rajasthan lake.

Kerala:
Houseboat on Kerala backwaters.

Munnar:
Tea plantations across Munnar hills.

Kochi:
Chinese fishing nets along Kochi waterfront.


==================================================
62. REDUCED MOTION
==================================================

For prefers-reduced-motion:

normal document flow

no image parallax

no clip-path scrubbing

use simple:

opacity 0 → 1

or content visible immediately.

No content should depend on animation.


==================================================
63. MOBILE SAFE AREAS
==================================================

Continue respecting:

env(safe-area-inset-top)
env(safe-area-inset-bottom)

Do not add extra bottom padding
to every journey unnecessarily.


==================================================
64. 360PX WIDTH
==================================================

At 360×800:

do NOT reduce typography to tiny sizes.

Allow:

title wrapping
longer journey height

Supporting images can stack vertically.

Do not squeeze them side by side
if readability suffers.


==================================================
65. 430PX WIDTH
==================================================

At 430×932:

maintain max content width.

Do not stretch imagery/text
to edge simply because more width is available.

Target content max:

~398–410px.


==================================================
66. PRIMARY QA — 390×844
==================================================

Capture:

A
Phase-6 final destination node

B
Phase-6 stem entering Curated Journeys intro

C
Curated Journeys intro settled

D
Sacred Odisha image entering

E
Sacred Odisha settled

F
Sacred Odisha support imagery

G
Sacred Odisha → Kashmir handoff

H
Kashmir settled

I
Kashmir details

J
Kashmir → Rajasthan

K
Rajasthan settled

L
Rajasthan details

M
Rajasthan → Kerala

N
Kerala settled

O
Kerala details

P
Phase-7 ending / future Phase-8 space

Q
reverse scroll one journey

R
reverse back into Phase-6 Outro


==================================================
67. ALL JOURNEY SETTLED CAPTURES
==================================================

Capture clean settled states for:

Sacred Odisha
Kashmir Valley
Royal Rajasthan
Kerala Slowly


==================================================
68. RESPONSIVE QA
==================================================

Test:

360 × 800
375 × 812
390 × 844
393 × 852
412 × 915
430 × 932

Verify:

no horizontal overflow

no clipped title

main image aspect ratio correct

supporting images readable

CTA >= 44px hit target

route text readable

duration doesn't wrap awkwardly

no content hidden beneath sticky header

next journey peek remains subtle

Phase-6 connection doesn't break


==================================================
69. PHASE-5 CTA QA
==================================================

Verify new Explore Journey links under all four
Feeling chapters.

They must:

fit without disrupting icon rows

remain visually secondary

share the same route metadata as Phase 7

not create overflow at 360px


==================================================
70. PHASE-6 REGRESSION
==================================================

Confirm:

Travel Thread still completes

final node still reveals

final one-time bloom remains

phase7-entry remains correct

reverse thread behavior unchanged


==================================================
71. UPPER PHASE REGRESSION
==================================================

Quick test:

Phase 4 reverse → hero

Phase 3 planner open/close

Phase 2 compass destination

Phase 1 ceremony

No regression.


==================================================
72. FAILURE CONDITIONS
==================================================

FAIL if:

Phase 7 opens like a new scene.

FAIL if:

there is another fullscreen intro.

FAIL if:

all four journeys look like identical cards.

FAIL if:

same Phase-5 hero images are reused.

FAIL if:

supporting photos become a generic gallery grid.

FAIL if:

every journey is pinned for 100vh.

FAIL if:

price appears.

FAIL if:

Book Now appears.

FAIL if:

Travel Thread continues through entire Phase 7.

FAIL if:

large motion returns after we intentionally reduced
animation intensity.

FAIL if:

journey CTA routes to fake booking confirmation.

FAIL if:

mobile content feels like a desktop layout squeezed down.


==================================================
73. ACCEPTANCE CHECKLIST
==================================================

[ ] Phases 1–6 remain frozen
[ ] same continuous mobile page
[ ] no new scene
[ ] Phase-6 stem connects naturally
[ ] Curated Journeys intro implemented
[ ] 4 exact main WebP assets used
[ ] 8 exact support WebP assets used
[ ] Sacred Odisha unique layout
[ ] Kashmir unique layout
[ ] Rajasthan unique layout
[ ] Kerala unique layout
[ ] natural vertical document flow
[ ] no carousel
[ ] no scroll snap
[ ] no excessive pinning
[ ] editorial image reveals
[ ] supporting imagery restrained
[ ] next journey peeks naturally
[ ] all CTA routes data-driven
[ ] Phase-5 Explore links added
[ ] no prices
[ ] no Book Now
[ ] responsive images
[ ] no CLS
[ ] lazy loading correct
[ ] reduced motion supported
[ ] semantic structure correct
[ ] six viewports pass
[ ] Phase 6 reverse remains correct
[ ] Phase 8 NOT implemented


==================================================
74. DEFINITION OF DONE
==================================================

The user should feel:

"The website first helped me discover
how I want to travel.

Now it is showing me four thoughtfully
crafted journeys that match those feelings.

These are real travel ideas,
not generic package cards.

I can understand:

where I will go,
how long the journey lasts,
what it feels like,
and where to explore it further."

The emotional progression must read:

FEELING
→ JOURNEY

not:

EDITORIAL SITE
→ TRAVEL E-COMMERCE GRID

Phase 7 should become calmer,
more informative,
and more useful than Phase 5,
without losing the premium SJH identity.

BUILD PHASE 7 ONLY.

Do not begin:
Why SJH,
Traveller Stories,
Gallery,
Final CTA,
Footer,
or full Journey Detail pages
until Phase-7 QA is complete and frozen.