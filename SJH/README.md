# SJH Cinematic Mobile Hero — Audited Antigravity Handoff v2

This package is the production handoff for the **first mobile home viewport** of Shree Jagannath Holidays.

The intended sequence is:

**closed carved doors → centered SJH intro mark → thin warm light seam → doors open → Puri reveal → mobile header → masked typography → Journey Dock → calm settled state.**

## Start here
1. Read `AUDIT_REPORT.md`.
2. Read `references/REFERENCE_PRIORITY.md`.
3. Paste `ANTIGRAVITY_MASTER_PROMPT.md` into Antigravity while the existing project is open.
4. Give Antigravity this entire folder.
5. Implement the static 390×844 state first, then motion.

## Scope
- Mobile hero only: `<768px`.
- Preserve the existing tablet/desktop hero and every existing route, form, menu, SEO hook, tracking hook, and enquiry behavior.
- Destination swipe and expanded planner are **phase 2**, not part of this build.

## Non-negotiables
- Use the supplied `door-left.png` and `door-right.png`.
- Use the supplied `hero-puri.webp`.
- **No separate top-frame asset.**
- **No blank/transparent wedge at the top of the closed gate.** The door images must be vertically overscaled/cropped as documented so the first viewport is fully covered.
- Light crack must stay narrow; do not render the full `light-crack.png` width.
- Intro logo is centered while doors are closed; settled header logo is a separate cross-faded instance at top-left.
- No Three.js/WebGL for this hero.
- No bounce/elastic easing.
- Do not redesign the rest of the app.

## Package map
- `assets/` — runtime assets.
- `references/` — exact target states plus legacy concept material clearly separated.
- `docs/` — design/engineering specification.
- `starter/` — React/GSAP scaffold to adapt, not blindly paste.
