# ANTIGRAVITY MASTER PROMPT — AUDITED v2

You are working inside the existing Shree Jagannath Holidays frontend. Act as a senior frontend engineer, motion designer, and design-systems engineer.

Your task is to implement **only the first mobile home viewport** as a production-grade cinematic hero using the supplied assets and the audited specifications in this handoff.

## 0. Read order
Before touching the repo, read:
1. `AUDIT_REPORT.md`
2. `references/REFERENCE_PRIORITY.md`
3. `docs/03_ASSET_MANIFEST.md`
4. `docs/04_COMPONENT_ARCHITECTURE.md`
5. `docs/05_ANIMATION_TIMELINE.md`
6. `docs/09_QA_ACCEPTANCE.md`

The `*-exact` references and this prompt override every legacy concept image.

## 1. Inspect before editing
Before changing code:
1. Inspect the current framework, routes, Home page, hero, styling solution, font strategy, mobile breakpoints, menu/drawer behavior, enquiry/planner action, SEO metadata, and analytics hooks.
2. Identify the smallest safe integration point for a mobile-only hero.
3. Preserve all existing desktop/tablet rendering and behavior.
4. Produce a short implementation plan mapping this handoff to real repo files.
5. Then implement. Do not create a parallel app or rewrite the project architecture.

## 2. Exact phase-1 product outcome
At widths below 768px, the first home viewport becomes a 100svh cinematic scene:

1. The first paint is a **fully covered closed pair of carved doors**. No sky, page background, white area, or black blank wedge is visible above the doors.
2. A centered SJH intro brand appears quietly.
3. A small vertical line / `EXPLORE` prompt appears below it.
4. A thin warm light seam blooms at the center.
5. The seam separates by only a few pixels.
6. Both doors move outward with weighted GSAP motion while the Puri image performs a subtle camera push.
7. The centered intro brand and Explore prompt fade away during opening.
8. A separate mobile header fades in: SJH at top-left, menu at top-right.
9. Location, headline, subhead, support copy reveal with masked/quiet motion.
10. Journey Dock and progress pagination enter last.
11. Intro stops around 3.7s. Settled state is calm and interactive.

Do **not** implement the destination swipe portal or expanded planner in this phase.

## 3. Runtime assets — use these
- `assets/hero/hero-puri.webp`
- `assets/hero/door-left.png`
- `assets/hero/door-right.png`
- `assets/hero/light-crack.png`
- `assets/brand/sjh-logo.svg`
- `assets/ui/compass.svg`
- `assets/ui/arrow-right.svg`
- `assets/ui/menu.svg`

Rules:
- no top-frame asset;
- no regenerated/repainted doors;
- no replacement stock hero;
- no arbitrary extra particles;
- no WebGL/Three.js.

## 4. Reference priority
Follow these for geometry:
- `references/ref-00-closed-exact.jpg`
- `references/ref-01-crack-exact.jpg`
- `references/ref-02-mid-open-exact.jpg`
- `references/ref-03-settled-base-exact.jpg`

Use `references/ref-02-settled.jpg` only for settled UI hierarchy/density.

Anything in `references/legacy-do-not-implement-yet/` is concept history and must not override the above.

## 5. Primary viewport
Design and validate first at **390×844 CSS px**.

Also test:
- 360×800
- 375×812
- 393×852
- 412×915
- 430×932

Hero shell:
```css
position: relative;
width: 100%;
height: 100vh;
height: 100svh;
overflow: hidden;
isolation: isolate;
background: #0B0A08;
```

Respect safe-area insets.

## 6. Background
`hero-puri.webp`:
- absolute inset 0;
- width/height 100%;
- `object-fit: cover`;
- initial scale ~1.11;
- settled scale ~1.035;
- initial filter around `brightness(.72) blur(2px)`;
- settled `brightness(1) blur(0)`;
- object-position around `50% 52%`, then tune per real viewport.

Use CSS-only localized black/amber shading for text contrast.

## 7. Door geometry — critical audited rule
Both PNGs are **1200×2600 RGBA** and contain transparent space above their concave decorative tops.

Do **not** simply set them to `height:100svh; top:0`, because that recreates the rejected blank top wedges.

Use this audited crop strategy:
```css
--door-top-crop: clamp(96px, 12svh, 118px);
--door-bottom-overscan: clamp(38px, 5svh, 50px);
```

Each door image:
```css
position: absolute;
top: calc(-1 * var(--door-top-crop));
height: calc(100% + var(--door-top-crop) + var(--door-bottom-overscan));
width: auto;
max-width: none;
```

This intentionally crops the ornamental top silhouette outside the viewport so the closed first frame is fully covered. Compare directly with `ref-00-closed-exact.jpg`.

Closed seam:
- left inner/right edge at screen center;
- right inner/left edge at screen center;
- overlap 2–4 CSS px before crack starts;
- outer door portions crop beyond viewport naturally;
- never distort aspect ratio.

Recommended wrapper translation approach:
- each wrapper occupies 50% viewport width;
- image overflows wrapper inward/outward as needed;
- animate wrapper translation, not layout properties;
- leave roughly 20–34px carved side sliver at end.

3D rotation is optional and subtle, maximum ~4–7 degrees. If it creates a fake hinge or warping, prefer weighted translation over forced perspective.

## 8. Intro brand vs header brand — keep separate
Use two render instances of `sjh-logo.svg`:

### Intro brand
- centered on closed gate;
- visual width approximately 100–118px at 390px viewport;
- appears at 0.20s;
- begins fading around door-open start;
- gone by roughly 1.45s.

### Header brand
- independent element at top-left;
- visual width approximately 74–88px;
- hidden during closed-gate sequence;
- fades in around 2.05s.

Do not animate one DOM logo from center to corner unless the existing architecture already makes FLIP-style motion trivial and stable. Crossfade is preferred.

## 9. Explore prompt
Below intro brand, use CSS/text only:
- thin vertical gold line;
- small uppercase `EXPLORE`;
- subtle opacity;
- fades before/while doors start opening.

No extra image asset is required.

## 10. Light crack — thin, not a beam
The supplied `light-crack.png` is a bloom texture. **Do not show its full 724px width.**

Use a narrow clipping wrapper centered on the seam:
```css
width: clamp(24px, 8vw, 34px);
overflow: hidden;
```

Center the texture inside that wrapper and render it at low opacity. Add a separate CSS 1px bright core line if needed.

Target look: `ref-01-crack-exact.jpg`.

Never let it resemble a sci-fi laser or thick glowing pillar.

## 11. Copy — exact
- location: `PURI | ODISHA`
- headline line 1: `JOURNEYS`
- headline line 2: `OF FAITH.`
- subhead line 1: `MEMORIES`
- subhead line 2: `FOR LIFE.`
- support line 1: `Pilgrimages · Holidays`
- support line 2: `Crafted Personally.`
- dock: `Where do you want to go?`
- pagination: `01 / 05`
- intro prompt: `EXPLORE`

Do not rewrite.

## 12. Typography
Preferred:
- Display: Cormorant Garamond 400/500, fallback Georgia/serif.
- UI: Manrope 400/500/600, fallback Inter/system-ui.

Use the repository's existing font loader. If equivalent project fonts already exist, prefer them over introducing another global font system.

390px target:
- headline ~50–58px, line-height .88–.94;
- `FAITH.` gold `#EBC678`;
- location 10–12px uppercase, letter-spacing .28em;
- subhead 14–17px uppercase, tracking .30–.36em;
- support 15–18px serif.

## 13. Master GSAP timeline
Use one intro timeline.

```text
0.00  CLOSED
0.20  INTRO_BRAND_IN
0.35  EXPLORE_IN
0.58  CRACK_IN
0.90  MICRO_SEAM
1.08  OPEN_START + INTRO_BRAND_OUT + EXPLORE_OUT
2.05  HEADER_IN
2.20  OPEN_COMPLETE
2.22  LOCATION_IN
2.35  TITLE_IN
2.62  SUBHEAD_IN
2.88  SUPPORT_IN
3.08  DOCK_IN
3.42  PAGINATION_IN
3.68  IDLE
```

Motion rules:
- doors: `power3.inOut` or similar weighted curve;
- no bounce, elastic, spring, overshoot;
- background push occurs during door open;
- crack fades shortly after opening begins;
- title lines use masked vertical reveal, not letter-by-letter animation;
- no persistent pulsing CTA.

## 14. Header
- top-left brand;
- top-right menu button;
- safe-area aware;
- menu calls the existing drawer/menu action;
- expose existing `aria-expanded` state if available;
- do not create duplicate navigation state.

## 15. Journey Dock
Premium control, not generic card:
- left/right margin 16–20px;
- 72–82px height;
- dark translucent `#11100E` around 82–88%;
- subtle blur only if profiling allows;
- thin low-opacity warm-gold border;
- left compass icon in circular ring;
- center two-line label;
- right gold circular arrow action;
- connect to existing enquiry/planning behavior.

## 16. Pagination
Show both:
- 5 quiet horizontal progress segments;
- first segment longer/brighter;
- `01 / 05` number aligned to the right or according to the exact existing composition.

This is not a working carousel yet; it is visual state for phase 1.

## 17. Initial-paint / FOUC rule
Do not let settled text flash before GSAP initializes.

Use CSS initial states inside:
```css
@media (prefers-reduced-motion: no-preference) { ... }
```

Hide/reposition only the elements that animate. Do not globally hide the hero.

For reduced motion, CSS and JS must immediately show the settled state.

## 18. Reduced motion
For `prefers-reduced-motion: reduce`:
- no door animation;
- no crack animation;
- no scale animation;
- intro brand/prompt hidden;
- doors immediately in settled side-sliver state;
- header/copy/dock/pagination visible and usable.

## 19. Performance
- target 60fps on a modern mid-range phone;
- animate transform/opacity only during opening;
- preload `hero-puri.webp`, door-left, door-right;
- decode critical images before timeline when practical, but never hang indefinitely;
- no per-frame React state;
- no global body overflow mutation;
- no WebGL/Three.js;
- no unnecessary full-screen overlays.

## 20. Existing app integration
If React:
- isolate mobile hero into a component;
- use refs + `gsap.context` or `useGSAP()`;
- kill/revert timeline on unmount;
- keep copy in config/data;
- adapt asset paths to existing public/static conventions;
- use existing Router/Link component for logo home link;
- reuse existing menu and enquiry callbacks.

The starter files are a scaffold, not permission to ignore the real repo.

## 21. Desktop/tablet
At `>=768px`, preserve the production hero exactly for this phase.

## 22. Acceptance gate — do not declare complete until all pass
1. At 390×844, closed doors cover the entire viewport: **no blank top wedge**.
2. No Puri background leaks through before the crack begins.
3. Crack remains thin and warm.
4. Centered intro brand exists and disappears during opening.
5. Header appears separately after doors are mostly open.
6. Door proportions remain undistorted.
7. Door side slivers remain in settled state.
8. Puri temple stays visually centered.
9. Text remains readable over sky and temple.
10. Dock respects iPhone safe area.
11. Progress bars + `01 / 05` are present.
12. Menu and enquiry behavior reuse existing app functionality.
13. Reduced motion is correct.
14. No horizontal document overflow.
15. Desktop/tablet unchanged.
16. Capture and compare screenshots against all Tier-1 exact references.

When finished, report:
- repo files changed;
- existing behaviors reused;
- measured viewport screenshots checked;
- any visual deviation and why.

Do not claim pixel-perfect until screenshot comparison has actually been performed.
