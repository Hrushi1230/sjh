# 03 — Asset Manifest

| File | Size / type | Purpose | Production rule |
|---|---|---|---|
| `assets/hero/hero-puri.webp` | 941×1672 RGB | Main Puri background | `object-fit:cover`; never stretch |
| `assets/hero/hero-puri.png` | 941×1672 RGB | Source/reference fallback | Do not ship both unless needed |
| `assets/hero/door-left.png` | 1200×2600 RGBA | Left moving gate half | Preserve aspect ratio; use audited top crop |
| `assets/hero/door-right.png` | 1200×2600 RGBA | Right moving gate half | Preserve aspect ratio; use audited top crop |
| `assets/hero/light-crack.png` | 724×2172 RGBA | Warm seam bloom texture | Clip to narrow wrapper; never show full width |
| `assets/brand/sjh-logo.svg` | SVG 240×180 | Intro/header logo | Vector mark + live SVG text; ensure intended fonts/fallbacks render |
| `assets/ui/compass.svg` | SVG 64×64 | Dock leading icon | Scalable |
| `assets/ui/arrow-right.svg` | SVG 64×64 | Dock action icon | Scalable |
| `assets/ui/menu.svg` | SVG 64×64 | Header menu icon | Scalable |

## Critical door geometry
The source doors have concave transparent top areas. Production must use:
```css
--door-top-crop: clamp(96px, 12svh, 118px);
--door-bottom-overscan: clamp(38px, 5svh, 50px);
```
with image height `calc(100% + var(--door-top-crop) + var(--door-bottom-overscan))` and a negative top offset equal to `--door-top-crop`.

This is not optional: it is how the approved closed state eliminates blank wedges while keeping only two door assets.

## Runtime vs reference
Runtime assets live in `assets/`.

Tier-1 geometry references:
- `references/ref-00-closed-exact.jpg`
- `references/ref-01-crack-exact.jpg`
- `references/ref-02-mid-open-exact.jpg`
- `references/ref-03-settled-base-exact.jpg`

Legacy concept material is under `references/legacy-do-not-implement-yet/` and is not a geometry source.
