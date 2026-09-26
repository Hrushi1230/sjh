# 05 — Animation Timeline

## Single master timeline
```text
0.00  CLOSED
0.20  INTRO_BRAND_IN
0.35  EXPLORE_IN
0.58  CRACK_IN
0.90  MICRO_SEAM
1.08  OPEN_START + INTRO_OVERLAY_OUT
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

## Doors
Goal: heavy architecture, not a carousel slide.
- outward translation to leave ~20–34px carved slivers;
- subtle optional rotateY 4–7° max;
- `power3.inOut` or equivalent weighted curve;
- no spring/bounce/overshoot;
- if 3D looks fake, remove it and keep the weighted translation.

## Background
During OPEN_START → OPEN_COMPLETE:
- scale ~1.11 → 1.035;
- brightness .72 → 1;
- blur 2px → 0.

## Intro brand
- centered logo appears quietly;
- Explore line/prompt follows;
- both fade as doors start opening;
- header logo is a separate later element.

## Crack
- begins before physical movement;
- thin while closed;
- peaks around OPEN_START;
- fades quickly after real sunset is visible;
- texture is clipped; do not display it full width.

## Text
Use masked line reveal:
```html
<div class="mask"><span>JOURNEYS</span></div>
```
Start at `translateY(112%)`, animate to 0.

## Idle
After intro:
- stop all hero choreography;
- optional nearly imperceptible background scale 1.035 → 1.025 over 10–12s only if profiling is smooth;
- no looping doors;
- no pulsing CTA.
