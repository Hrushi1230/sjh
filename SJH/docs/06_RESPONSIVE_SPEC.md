# 06 — Responsive Specification

## Primary
390×844 CSS px.

## Validate
- 360×800
- 375×812
- 390×844
- 393×852
- 412×915
- 430×932

## Rules
1. `height:100vh; height:100svh`.
2. Respect top/bottom safe areas.
3. Door overflow clips inside the hero, never by globally forcing `body{overflow-x:hidden}` as a band-aid.
4. Use `--door-top-crop: clamp(96px, 12svh, 118px)` and `--door-bottom-overscan: clamp(38px, 5svh, 50px)` on all validated sizes.
5. Closed gate must have zero visible top wedge at every validated size.
6. Tune background object-position per breakpoint only if the temple/copy collide.
7. On shorter devices reduce typography/gaps before moving Dock into unsafe areas.
8. Touch targets ≥44px.
9. `<768px` cinematic hero; `>=768px` existing production experience unchanged.

## Suggested variables
```css
--hero-pad-x: clamp(20px, 7vw, 34px);
--hero-safe-top: max(18px, env(safe-area-inset-top));
--hero-safe-bottom: max(14px, env(safe-area-inset-bottom));
--door-top-crop: clamp(96px, 12svh, 118px);
--door-bottom-overscan: clamp(38px, 5svh, 50px);
--dock-h: clamp(72px, 9.4svh, 82px);
```
