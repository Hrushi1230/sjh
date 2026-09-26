# 08 — Performance & Accessibility

## Performance
- Ship WebP background; PNG only where alpha is required.
- Preload/decode hero + both doors because they define first paint.
- Do not lazy-load opening-frame assets.
- Animate transforms/opacity, not layout properties.
- CSS gradients are allowed only for controlled shading/highlight treatments specified here.
- Clip the crack texture instead of loading another effect asset.
- Avoid backdrop-filter on low-end devices if profiling shows dropped frames.
- No per-frame React state.
- Kill/revert timeline on unmount.

## Accessibility
- Decorative doors, crack, background effects: `aria-hidden="true"`.
- Header logo is a home link with accessible name `Shree Jagannath Holidays — Home`.
- Menu button: `aria-label="Open menu"` and existing `aria-expanded` state.
- Journey Dock: accessible label such as `Plan your journey`.
- Preserve visible focus styling.
- Do not trap focus during intro.
- Honor reduced motion and immediately expose the settled interactive UI.
