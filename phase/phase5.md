# SHREE JAGANNATH HOLIDAYS
# PHASE 5 — CHOOSE YOUR FEELING
# FOUR EDITORIAL TRAVEL CHAPTERS
# MOBILE-FIRST IMPLEMENTATION DIRECTIVE

Act as a senior editorial designer, motion director,
frontend engineer, UX architect and mobile performance engineer.

PHASES 1–4 ARE FROZEN.

Do not redesign or retime:

- ceremonial gate intro
- Phase-1 gate physics
- destination portal system
- cardinal compass
- Journey Dock / planner morph
- Phase-4 Cinema → Magazine ScrollTrigger
- Phase-4 hero-card handoff
- Phase-4 header transition
- reduced-motion architecture
- accessibility foundations

Phase 5 begins exactly where Phase 4 ends.

==================================================
1. CORE IDEA
==================================================

Phase 5 is NOT:

- four destination cards
- a carousel
- a slider
- a grid
- four generic travel packages
- four nearly identical sections

It is an editorial journey through four FEELINGS:

FAITH
ESCAPE
DISCOVER
SLOW DOWN

Each feeling corresponds to one destination:

Puri       → Faith
Kashmir    → Escape
Rajasthan  → Discover
Kerala     → Slow Down

The user should feel like they are scrolling
through four chapters of a premium travel magazine.

The emotional progression is:

PLACE
→ FEELING
→ STORY
→ EXPERIENCE

Not:

DESTINATION
→ PRICE
→ BOOK NOW

Commercial package content comes later.

==================================================
2. PHASE-4 CONTINUITY — CRITICAL
==================================================

Phase 4 already ends with:

- warm ivory canvas
- current destination image as editorial card
- feeling label
- editorial title
- description

DO NOT create another duplicate image/card
at the beginning of Phase 5.

The Phase-4 final editorial state IS the beginning
of the first Phase-5 chapter.

Phase 5 should extend naturally beneath it.

User should never perceive:

Phase 4 ending
→ new Faith card appearing

FAIL.

They should perceive:

the magazine page they just entered
continues unfolding into a deeper chapter.

PASS.

==================================================
3. ACTIVE DESTINATION BECOMES FIRST CHAPTER
==================================================

Phase 5 must respect activeDestination.

If user entered Phase 4 from:

Puri
→ first chapter = Faith

Kashmir
→ first chapter = Escape

Rajasthan
→ first chapter = Discover

Kerala
→ first chapter = Slow Down

Then rotate remaining chapters.

Base canonical order:

puri
kashmir
rajasthan
kerala

Example:

active = puri

01 Faith / Puri
02 Escape / Kashmir
03 Discover / Rajasthan
04 Slow Down / Kerala


active = kashmir

01 Escape / Kashmir
02 Discover / Rajasthan
03 Slow Down / Kerala
04 Faith / Puri


active = rajasthan

01 Discover / Rajasthan
02 Slow Down / Kerala
03 Faith / Puri
04 Escape / Kashmir


active = kerala

01 Slow Down / Kerala
02 Faith / Puri
03 Escape / Kashmir
04 Discover / Rajasthan

The number displayed is the JOURNEY ORDER,
not a permanent destination ID.

Use:

01 / 04
02 / 04
03 / 04
04 / 04

==================================================
4. DATA MODEL
==================================================

Extend existing destination editorial data.

Do not create another disconnected data source.

Example:

type FeelingChapter = {
  feeling: string;
  location: string;
  title: string[];
  intro?: string;
  body: string;
  experiences: {
    label: string;
    icon: IconKey;
  }[];
  layoutVariant:
    | "faith"
    | "escape"
    | "discover"
    | "slow";
  chapterBackground: string;
  imagePosition: string;
};

==================================================
5. COPY
==================================================

PURI / FAITH

feeling:
FAITH

location:
PURI · ODISHA

intro:
More than a place.

title:
A DEEPER
CONNECTION.

body:
Witness centuries-old traditions,
stand before the Lord,
and feel a journey that touches
something deeper within.

experiences:
Temples
Rituals
Coastal Calm


KASHMIR / ESCAPE

feeling:
ESCAPE

location:
KASHMIR · INDIA

title:
GO WHERE
THE NOISE
ENDS.

body:
Mountains, valleys and open skies.
A place to breathe again
and rediscover what truly matters.

experiences:
Mountains
Valleys
Tranquility


RAJASTHAN / DISCOVER

feeling:
DISCOVER

location:
RAJASTHAN · INDIA

title:
STEP INTO
ANOTHER
CENTURY.

body:
Palaces, carved stone,
vibrant markets and stories
that still live in every wall.

experiences:
Palaces
Heritage
Living Culture


KERALA / SLOW DOWN

feeling:
SLOW DOWN

location:
KERALA · INDIA

title:
LET TIME
MOVE
DIFFERENTLY.

body:
Backwaters, green horizons
and unhurried days.
A journey to slow down
and be present again.

experiences:
Backwaters
Nature
Unhurried Days

Keep text data-driven.

==================================================
6. IMAGES
==================================================

Reuse approved destination assets:

hero-puri.webp
hero-kashmir.webp
hero-rajasthan.webp
hero-kerala.webp

Phase 5 should reinterpret them using:

- different crop
- mask geometry
- parallax
- layout
- typography

Do NOT duplicate the files.

Do NOT generate fake extra photography in code.

Future phases may introduce richer galleries.

==================================================
7. PAGE STRUCTURE
==================================================

Suggested:

<EditorialExperience>
  <FirstFeelingContinuation />
  <FeelingChapter />
  <FeelingChapter />
  <FeelingChapter />
</EditorialExperience>

The first chapter must consume / extend
the Phase-4 editorial context.

Do not render four completely independent
100vh pages with duplicated boilerplate.

==================================================
8. CHAPTER LENGTH
==================================================

Each chapter should have enough scroll space
to breathe.

Target:

~90–115svh per chapter

depending content.

Initial recommendation:

100svh visual chapter
with ~115svh scroll track
for transitions where needed.

Do NOT make every section 200vh.

The page should still feel usable,
not like a motion demo.

==================================================
9. SCROLL PHILOSOPHY
==================================================

Normal native scrolling.

No hijacked scrolling.

No snapping mandatory.

No scroll-jacking.

No horizontal wheel conversion.

GSAP ScrollTrigger may orchestrate
individual chapter motion.

The browser remains in control.

==================================================
10. CHAPTER MOTION LANGUAGE
==================================================

Use only our established motion vocabulary:

MASK REVEAL
SUBTLE PARALLAX
EDITORIAL TYPOGRAPHY REVEAL
CONTROLLED SCALE
OPACITY
CHAPTER HANDOFF

Do NOT introduce:

3D cards
floating blobs
liquid distortion
WebGL
random rotations
bouncing
scroll snapping
fake page flips

==================================================
11. THREE-BEAT CHAPTER SYSTEM
==================================================

Every chapter has three beats:

A — ARRIVAL
B — STORY
C — HANDOFF

ARRIVAL:
feeling + destination establish themselves.

STORY:
headline, body, experiences settle.

HANDOFF:
current chapter quiets
while next destination begins entering.

Reuse this system across all four chapters.

==================================================
12. CHAPTER ARRIVAL
==================================================

Suggested progress:

0.00–0.25

Animate:

chapter number
feeling
location
photography

Possible sequence:

number opacity 0 → 1
feeling y 14 → 0
location fade
image clip reveal
image scale 1.045 → 1.02

No huge entrance animation.

==================================================
13. STORY REVEAL
==================================================

Progress:

~0.22–0.62

Headline lines reveal through masks.

Example:

GO WHERE
THE NOISE
ENDS.

Each line:

yPercent 100 → 0

short stagger.

Body enters after headline.

Experience icons enter last.

No per-letter animation.

==================================================
14. HANDOFF
==================================================

Progress:

~0.68–1.00

Current chapter:

headline slightly shifts upward
body fades to ~0.45
image parallax continues
experience icons soften

Next chapter image begins appearing.

Do NOT completely fade the entire screen to ivory.

There must be visual continuity.

==================================================
15. CHAPTER-TO-CHAPTER TRANSITION
==================================================

Preferred transition:

NEXT DESTINATION PHOTOGRAPH
reveals upward through an editorial mask
while current chapter resolves.

Conceptually:

CURRENT CHAPTER
       ↓ scroll
next image peeks from bottom
       ↓
mask grows upward
       ↓
current typography departs
       ↓
new chapter number/feeling appears
       ↓
next world owns viewport

No sliding card carousel.

==================================================
16. TRANSITION MASK
==================================================

Use either:

clip-path inset()

or

overflow-hidden media wrapper

with translate/scale.

Preferred:

next media wrapper:
clip-path: inset(100% 0 0 0 round 28px)

→

clip-path: inset(0% 0 0 0 round 0/desired radius)

depending composition.

Keep transitions editorial.

No circles here.

Circular portals belong exclusively to Phase 2.

==================================================
17. DO NOT REUSE PORTAL MOTION
==================================================

Important motion vocabulary separation:

Phase 2:
CIRCULAR WORLD PORTAL

Phase 5:
EDITORIAL VERTICAL REVEAL

Do not turn every transition into the same effect.

==================================================
18. BACKGROUND TONES
==================================================

Remain within our ivory family.

Use restrained destination tint shifts.

Suggested:

Faith:
#F4EFE6

Escape:
#F1F2EE

Discover:
#F3E9DC

Slow Down:
#EEF1E8

Transitions between tones should be gradual.

No pure white.

No saturated backgrounds.

==================================================
19. HEADER
==================================================

Phase-4 dark-on-ivory header remains.

Do not rebuild another navbar.

During Phase 5:

header stays compact
dark temple-black / antique gold.

It may remain sticky.

Do not make it visually dominant.

==================================================
20. CHAPTER NUMBER
==================================================

Use a large restrained serif number:

01
02
03
04

But not enormous full-screen numbers.

Suggested:

32–48px mobile.

Pair with a fine vertical divider.

Example:

01 | FAITH
     PURI · ODISHA

==================================================
21. TYPOGRAPHY
==================================================

Display:

Cormorant Garamond
or current approved serif

UI / metadata:

Manrope / current approved sans

Headline target:

~46–58px mobile depending viewport.

Use clamp().

Do not let 360px viewport wrap awkwardly.

==================================================
22. FAITH LAYOUT VARIANT
==================================================

Feeling:
FAITH

Mood:
sacred / warm / devotional

Composition:

top:
chapter marker

upper/middle:
large Puri photography

lower:
ivory typography region

Use warm gold accent.

Image may have an organic soft mask
at lower edge,
but keep it refined.

Headline:

More than a place.
A deeper connection.

"More than a place."
can be smaller serif.

"A deeper connection."
becomes primary.

==================================================
23. ESCAPE LAYOUT VARIANT
==================================================

Feeling:
ESCAPE

Mood:
space / silence / altitude

Composition should feel more open.

Use:

more negative space
cooler ivory tone
image slightly taller
mountains allowed to breathe

Headline:

GO WHERE
THE NOISE
ENDS.

Avoid crowding the image with overlays.

==================================================
24. DISCOVER LAYOUT VARIANT
==================================================

Feeling:
DISCOVER

Mood:
architecture / history / texture

Rajasthan image can use a subtle
architectural frame treatment.

Possible:

top corners:
larger arch-like radius

or

CSS mask suggesting an architectural opening.

Do not fabricate ornamental assets.

Keep geometry simple enough for performance.

Headline:

STEP INTO
ANOTHER
CENTURY.

==================================================
25. SLOW DOWN LAYOUT VARIANT
==================================================

Feeling:
SLOW DOWN

Mood:
calm / water / nature / space

This should be the quietest chapter.

Largest amount of breathing room.

Let Kerala water reflections remain visible.

Headline:

LET TIME
MOVE
DIFFERENTLY.

Motion should be slower and less dense.

==================================================
26. IMAGE PARALLAX
==================================================

Each chapter may have subtle internal image movement.

Maximum:

~24–40px perceived travel.

Do not shift entire section dramatically.

Different feelings can vary slightly:

Faith:
24px

Escape:
36px

Discover:
28px

Slow Down:
20px

These differences are subtle,
not theatrical.

==================================================
27. EXPERIENCE ROW
==================================================

Three small experience markers per chapter.

Example:

[icon]
Temples

[icon]
Rituals

[icon]
Coastal Calm

Layout:

three equal columns.

No cards around each icon.

No colored circles.

Just:

fine line icon
+
small label.

==================================================
28. ICON STYLE
==================================================

Use one coherent custom line-icon language.

Antique gold.

Stroke approximately:

1.25–1.5px

No emoji.

No mixed icon packs.

If existing icon library can supply coherent shapes,
use it.

Otherwise create simple SVG icons locally.

==================================================
29. EXPERIENCE ICON MAP
==================================================

FAITH:

Temples
→ temple

Rituals
→ lotus / diya-style abstract mark

Coastal Calm
→ wave


ESCAPE:

Mountains
→ mountain

Valleys
→ pine / landscape

Tranquility
→ lotus / minimal calm symbol


DISCOVER:

Palaces
→ palace

Heritage
→ arch

Living Culture
→ restrained elephant / craft symbol


SLOW DOWN:

Backwaters
→ houseboat

Nature
→ leaf

Unhurried Days
→ sun

Keep all icons stylistically consistent.

==================================================
30. NO STRONG CTA IN EVERY CHAPTER
==================================================

Do NOT put:

BOOK NOW

under every feeling.

We are still telling the story.

Optional micro-action:

"Explore Puri →"
"Explore Kashmir →"

But if destination pages do not exist yet:

do not create dead navigation.

For Phase 5,
prefer no primary CTA.

Phase 7 will introduce curated journeys.

==================================================
31. FIRST CHAPTER CONTINUATION
==================================================

Critical.

The first chapter begins from the
Phase-4 final editorial card.

Do not repeat:

WHAT ARE YOU LOOKING FOR?
Not destinations.
A feeling.

That heading has already been introduced.

As Phase 5 scrolling continues:

Phase-4 card/meta
→ naturally expands into
deeper feeling story.

The user should feel one continuous page.

==================================================
32. FIRST CHAPTER HANDOFF
==================================================

If Phase-4 active destination is Puri:

existing:

FAITH
SOMETHING GREATER THAN A HOLIDAY.

can transition into:

More than a place.
A deeper connection.

The former Phase-4 text may reduce/fade
while the deeper chapter copy arrives.

Do not show both giant headlines simultaneously.

Same logic applies to the other destinations.

==================================================
33. ACTIVE-FIRST ROTATION
==================================================

Create helper:

getChapterOrder(activeDestinationId)

Return cyclic destination order.

Do not mutate canonical destination array.

Example:

function rotateFrom<T>(items, activeIndex) { ... }

Memoize as appropriate.

==================================================
34. CHAPTER STATE
==================================================

Phase 5 does NOT change activeDestination
from the hero.

Scrolling into another feeling chapter
should NOT update Phase-2 portal state.

These are editorial chapters,
not hero browsing state.

Keep concepts separate.

==================================================
35. SCROLLING BACK TO PHASE 4
==================================================

If user scrolls upward:

Phase 5 unwinds naturally.

Eventually Phase-4 editorial state returns.

Then Phase-4 reverse transformation restores hero.

No hard boundary.

No sudden element reset.

==================================================
36. TRANSITION INTO PHASE 5
==================================================

Do not add another pin immediately after
Phase 4 releases.

Give approximately:

10–20svh

of normal breathing scroll before
the next stronger chapter choreography.

Avoid:

pin
release
immediate pin

which feels mechanical.

==================================================
37. PINNING
==================================================

Not every chapter needs full pinning.

Preferred:

light sticky behavior for media/text composition.

Example:

chapter track:
110svh

inner visual:
position: sticky
top: headerOffset

This is often smoother than heavy ScrollTrigger pinning.

Use ScrollTrigger mainly for:

progress mapping
mask reveal
parallax
text entrance.

==================================================
38. MOBILE COMPOSITION
==================================================

Primary target:

390×844.

Content should remain readable on:

360×800
375×812
390×844
393×852
412×915
430×932

Avoid designing only for 430px.

==================================================
39. CHAPTER HEIGHT ON SMALL SCREENS
==================================================

On 360×800:

allow content to extend beyond exactly one viewport.

Do not squeeze:

headline
body
icons

into tiny space.

Content integrity > fake 100vh perfection.

==================================================
40. VISUAL DENSITY
==================================================

Each chapter should contain:

1 dominant image
1 major headline
1 short body
3 experience markers

That's enough.

Do not add:

ratings
prices
tags
buttons
badges
chips
review counts
hotel details

Phase 5 is emotional storytelling.

==================================================
41. MICRO TRAVEL LINE — PHASE 6 HOOK ONLY
==================================================

Do NOT build the full Travel Thread yet.

However prepare hooks for Phase 6.

Add:

data-thread-anchor="chapter-start"
data-thread-anchor="chapter-media"
data-thread-anchor="chapter-end"

or refs for each chapter.

We will connect these later.

You may render a tiny static gold line accent
inside individual chapter layouts.

But DO NOT create the full
cross-section animated route yet.

==================================================
42. NO LOOPING MOTION
==================================================

Once chapter settles:

everything becomes calm.

No:

breathing images
shimmer
floating icons
continuous waves
pulsing gold
automatic text movement

Motion responds to scroll only.

==================================================
43. PERFORMANCE
==================================================

Below-fold images should lazy load.

But anticipate upcoming chapter.

When user approaches current chapter:

preload next chapter image.

Do not keep four duplicate giant image nodes alive
in multiple visual layers.

==================================================
44. IMAGE LAYERS
==================================================

At most:

current chapter image
+
incoming next chapter image

should require active transition treatment.

Avoid stacking all four full-screen GPU layers.

==================================================
45. GSAP CLEANUP
==================================================

Each chapter animation:

must clean ScrollTriggers on unmount.

Use gsap.context where practical.

No orphaned triggers.

No duplicated triggers after HMR.

==================================================
46. RESIZE
==================================================

On viewport changes:

ScrollTrigger refresh.

Recalculate:

sticky offsets
image dimensions
mask values

Do not hard-code desktop metrics into mobile.

==================================================
47. ACCESSIBILITY
==================================================

Use semantic:

<section>
<h2>
<p>
<ul>

for chapter content.

Feeling title can be eyebrow,
not separate heading if unnecessary.

Each destination image:

meaningful alt text.

Do not stuff SEO keywords into alt.

==================================================
48. REDUCED MOTION
==================================================

For prefers-reduced-motion:

no prolonged sticky choreography.

Display chapters in normal document flow.

Use:

simple fade
minimal image movement
no parallax
no large clip animation

All content remains visible.

==================================================
49. SEMANTIC HEADING STRUCTURE
==================================================

Phase-4 section:

h2:
Not destinations. A feeling.

Each Phase-5 chapter:

h3:
appropriate feeling chapter headline

Do not introduce additional h1.

==================================================
50. CHAPTER DIVIDERS
==================================================

Do not use normal horizontal `<hr>` lines
between all chapters.

Use spacing and image transition
to separate chapters.

Tiny gold rules may accompany metadata.

==================================================
51. STARTING CHAPTER QA
==================================================

Test Phase 5 when Phase-4 active destination is:

Puri
Kashmir
Rajasthan
Kerala

The correct first feeling must appear each time.

Remaining chapters must rotate correctly.

==================================================
52. REQUIRED 390×844 QA FRAMES
==================================================

Capture:

A
Phase-4 final state / Phase-5 starting point

B
First chapter continuation ~25%

C
First chapter full story

D
First → second chapter handoff

E
Second chapter settled

F
Second → third handoff

G
Third chapter settled

H
Third → fourth handoff

I
Fourth chapter settled

J
End of Phase 5

K
Reverse scroll into previous chapter

L
Back into Phase-4 final state

==================================================
53. DESTINATION VISUAL QA
==================================================

Capture each settled chapter:

Faith / Puri

Escape / Kashmir

Discover / Rajasthan

Slow Down / Kerala

Verify:

correct image
correct copy
correct icon row
correct background tone
correct layout variant.

==================================================
54. RESPONSIVE QA
==================================================

Test at:

360×800
375×812
390×844
393×852
412×915
430×932

For each ensure:

no horizontal overflow
no clipped headline
no icon collision
no content under header
no image distortion
no strange sticky gap
no section overlap
no ScrollTrigger jump.

==================================================
55. REGRESSION QA
==================================================

After Phase 5:

retest Phase 4:

100% editorial state
reverse 50%
reverse 0%

Then verify:

Phase 3 planner works
Phase 2 portal works
Phase 1 hero remains intact.

Do not assume lower sections cannot affect
upper ScrollTrigger calculations.

==================================================
56. VISUAL FAILURE CONDITIONS
==================================================

FAIL if:

four sections look like repeated templates.

FAIL if:

every destination uses exact same image/text layout.

FAIL if:

Phase-4 card is duplicated.

FAIL if:

user sees two copies of active destination consecutively.

FAIL if:

chapter transitions look like carousel slides.

FAIL if:

every chapter is pinned for excessive time.

FAIL if:

copy becomes too small to fit 100vh.

FAIL if:

experience icons look like SaaS feature cards.

FAIL if:

gold accents become decorative clutter.

FAIL if:

full Travel Thread is implemented in this phase.

==================================================
57. MOTION FAILURE CONDITIONS
==================================================

FAIL if:

new chapter pops instantly.

FAIL if:

previous chapter fully disappears before next enters.

FAIL if:

image masks use the circular Phase-2 portal language.

FAIL if:

continuous loop animation remains after settle.

FAIL if:

scroll feels delayed or disconnected from finger.

==================================================
58. ACCEPTANCE CHECKLIST
==================================================

[ ] Phase 1 unchanged
[ ] Phase 2 unchanged
[ ] Phase 3 unchanged
[ ] Phase 4 unchanged
[ ] Phase-4 card becomes first chapter context
[ ] no duplicate first destination card
[ ] active destination appears first
[ ] remaining chapters rotate correctly
[ ] four unique editorial layouts
[ ] Faith content correct
[ ] Escape content correct
[ ] Discover content correct
[ ] Slow Down content correct
[ ] three experience markers per chapter
[ ] one consistent icon language
[ ] native vertical scroll
[ ] no carousel behavior
[ ] chapter handoff uses editorial vertical masks
[ ] image parallax restrained
[ ] no excessive pinning
[ ] no looping motion
[ ] backgrounds transition gently
[ ] header remains coherent
[ ] reduced-motion supported
[ ] semantic HTML correct
[ ] thread anchors prepared
[ ] full Travel Thread NOT implemented
[ ] all 4 active-first variants tested
[ ] all 6 mobile viewports pass
[ ] reverse scrolling cleanly returns to Phase 4
[ ] zero upper-phase regression

==================================================
59. DEFINITION OF DONE
==================================================

The user should feel:

“I entered the homepage through one destination.

That destination became an emotion.

As I continue downward,
the site introduces me to other ways I might want to travel.

Puri is not just Puri.
It is Faith.

Kashmir is not just Kashmir.
It is Escape.

Rajasthan is Discovery.

Kerala is permission to Slow Down.

I am not browsing products yet.

I am discovering what kind of journey I want.”

If it feels like:

“Here are four destination cards.”

FAIL.

If it feels like:

“I am moving through four chapters
of a beautifully art-directed travel magazine.”

PASS.

BUILD PHASE 5 ONLY.

Do not start:
- full Travel Thread
- packages
- testimonials
- gallery
- final CTA
- footer

until Phase-5 QA is complete.