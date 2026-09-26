# 02 — Design System

## Color tokens
```css
--sjh-ivory: #F4EFE6;
--sjh-black: #11100E;
--sjh-black-deep: #0B0A08;
--sjh-saffron: #D8652B;
--sjh-gold: #B99455;
--sjh-gold-hi: #EBC678;
--sjh-forest: #26382F;
```

## Type
Display: Cormorant Garamond 400/500. UI: Manrope 400/500/600.

If the existing site already has a compatible high-contrast serif and clean sans, reuse them rather than loading redundant global fonts.

## 390×844 layout anchors
- Header top: safe-area + 18px.
- Header logo visual width: 74–88px.
- Intro logo visual width: 100–118px.
- Menu touch target: minimum 44×44px.
- Location baseline: ~18–23% viewport height.
- Headline starts ~24–31% depending on final photo crop.
- Copy left margin: 24–34px.
- Dock horizontal margin: 16–20px.
- Dock bottom must leave room for progress + safe area.

## Typography behavior
```css
.heroTitle { font-size: clamp(3.1rem, 14.3vw, 3.8rem); line-height: .90; }
.heroKicker { font-size: clamp(.65rem, 2.8vw, .75rem); letter-spacing: .28em; }
.heroSubhead { font-size: clamp(.78rem, 3.7vw, 1rem); letter-spacing: .31em; }
.heroSupport { font-size: clamp(.95rem, 4.1vw, 1.15rem); }
```

## Contrast
Use a controlled localized dark wash behind copy. Avoid flattening the whole photo with an overly dark full-screen overlay.

## Anti-template rules
- no purple/blue SaaS gradients;
- no random glass card grid;
- no giant blur blobs;
- no excessive particles;
- no individual-letter motion;
- no bounce/elastic hero motion.
