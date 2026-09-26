# 04 — Component Architecture

## Recommended hierarchy
```text
MobileCinematicHero
├── background image
├── localized shade/vignette
├── crack layer
├── doors
│   ├── left wrapper + door image
│   └── right wrapper + door image
├── intro overlay
│   ├── centered intro logo
│   └── line + EXPLORE
└── settled UI
    ├── mobile header
    │   ├── home/logo link
    │   └── existing menu trigger
    ├── hero copy
    ├── Journey Dock → existing enquiry/planner action
    └── visual pagination
```

## Layer order
```text
z0  hero-puri.webp
z1  localized shade
z2  light crack
z3  doors
z4  intro + settled UI
```

## Door wrappers
Use a 50%-viewport wrapper for each side because `xPercent` then maps predictably to the visible half-width.

```css
.doorSide {
  position:absolute;
  inset-block:0;
  width:50%;
  overflow:visible;
  transform-style:preserve-3d;
  will-change:transform;
}
.left  { left:0; transform-origin:0 50%; }
.right { right:0; transform-origin:100% 50%; }
```

The child image is taller than the viewport and shifted upward:
```css
--door-top-crop: clamp(96px, 12svh, 118px);
--door-bottom-overscan: clamp(38px, 5svh, 50px);
.doorImage {
  position:absolute;
  top:calc(-1 * var(--door-top-crop));
  height:calc(100% + var(--door-top-crop) + var(--door-bottom-overscan));
  width:auto;
  max-width:none;
}
.left .doorImage  { right:-2px; }
.right .doorImage { left:-2px; }
```

This is the audited fix for the rejected top blank areas.

## Intro and settled logo are separate
Use the same SVG twice:
- intro instance centered over doors;
- header instance top-left, hidden until the opening nearly completes.

Crossfade; do not create a fragile single-element teleport unless the real repo already has a robust shared-layout motion system.

## Crack
The texture is intentionally wider than the intended visible seam. Put it inside a narrow clipping wrapper. A 1px CSS line may sit above it as the bright core.

## Existing behavior integration
Menu and Journey Dock are adapters to the existing app. Do not create a second drawer or second enquiry state machine if those already exist.

## State
No frame-by-frame React state. Timeline owns motion. If a later phase adds destination swipe, that state must be separate from intro completion.
