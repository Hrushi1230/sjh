# 07 — Implementation Steps

1. Inspect existing Home hero, menu, enquiry CTA, breakpoints, font/image strategy, analytics, and SEO.
2. Copy/flatten runtime assets into the repo's normal static/public location while keeping filenames stable.
3. Create the mobile hero without changing desktop markup first.
4. Build the **static settled state** at 390×844.
5. Build the **static closed state** using the audited door top crop; confirm no blank top wedge.
6. Add separate centered intro brand + Explore prompt.
7. Add narrow clipped crack layer.
8. Add GSAP master timeline with cleanup.
9. Add delayed settled header.
10. Connect menu to existing navigation behavior.
11. Connect Journey Dock to existing enquiry/planning behavior.
12. Add progress bars + `01 / 05`.
13. Add reduced-motion settled state.
14. Preload critical imagery and prevent FOUC.
15. Validate all mobile sizes.
16. Regression-test desktop/tablet.
17. Capture closed/crack/mid-open/settled screenshots and compare to Tier-1 references.
18. Only after approval, start destination swipe phase.

## Do not do
- no backend changes;
- no new booking workflow;
- no Three.js/WebGL;
- no full homepage refactor;
- no destination carousel yet;
- no desktop redesign;
- no stock-image substitution;
- no top-frame asset.
