# Final Audit Report — v2

This handoff was re-audited after the first package was assembled.

## Problems found in v1 and corrected here
1. **Closed-gate blank top areas:** the source door silhouettes have concave transparent tops. V1 accepted near-black negative space, which contradicted the approved direction. v2 requires a controlled vertical crop/overscale so the doors fully cover the viewport on first paint.
2. **Intro brand mismatch:** the closed reference showed a centered logo, while the starter animated only the top-left header logo. v2 uses a centered intro brand, fades it during opening, then reveals the header separately.
3. **Light crack too wide in old reference:** v2 clips the supplied crack texture to a narrow center strip and adds a 1px CSS core line. The exact reference now reflects that.
4. **Legacy storyboard ambiguity:** the old storyboard showed a top-frame asset and later destination/planner features. It is moved under `references/legacy-do-not-implement-yet/` and is not a geometry source for phase 1.
5. **Pagination mismatch:** the visual concept used progress bars plus `01 / 05`; the starter had only text. v2 includes the bars.
6. **FOUC risk:** v2 adds CSS initial states under `prefers-reduced-motion: no-preference` and a reduced-motion settled fallback.
7. **Accessibility mismatch:** v2 starter exposes menu expanded state, makes the header logo a home link, and keeps decorative layers hidden from assistive tech.
8. **Bottom coverage gap discovered during geometry simulation:** top-cropping alone exposed the last ~30–40px of the viewport because the source doors end before the transparent canvas bottom. v2 adds `--door-bottom-overscan: clamp(38px, 5svh, 50px)` and was re-simulated across every target viewport.

## Closed-gate coverage simulation
Using the final crop + bottom-overscan rules, the composited left/right door alpha remained >0.98 across the full closed viewport at 360×800, 375×812, 390×844, 393×852, 412×915, and 430×932. No top or bottom background leak remained in the simulated closed state.

## Verified assets
- `door-left.png`: 1200×2600 RGBA.
- `door-right.png`: 1200×2600 RGBA.
- `hero-puri.webp`: 941×1672 RGB.
- `light-crack.png`: 724×2172 RGBA.
- SVG assets parse as valid XML.

## Reference precedence
Only the four `*-exact` viewport references are geometry/timing targets. See `references/REFERENCE_PRIORITY.md`.

## Remaining integration-dependent items
Antigravity must inspect the real repository before wiring:
- menu action/drawer;
- enquiry/planning action;
- routing link component;
- font loader;
- analytics hooks;
- exact public/static asset path.

Do not invent replacements for those systems.
