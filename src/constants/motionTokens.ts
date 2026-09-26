/**
 * SHREE JAGANNATH HOLIDAYS — GLOBAL MOTION TOKENS
 * Single source of truth for easing, durations, and motion hierarchy across all 12 phases.
 * 
 * Hierarchy:
 * LEVEL 5: Ceremonial Gate, Destination Portal, Hero World Transitions
 * LEVEL 4: Cinema -> Magazine Scroll Transformation
 * LEVEL 3: Choose Your Feeling, Travel Thread, Journey Atlas
 * LEVEL 2: Trust Ledger, Real Travel Memories
 * LEVEL 1: Final Start Your Journey CTA, Site Footer
 */

export const SJH_EASE = {
  cinematic: "power3.inOut",
  portal: "power4.inOut",
  settle: "power3.out",
  reveal: "power2.out",
  micro: "power2.out",
  exit: "power2.in",
} as const;

export const SJH_DURATION = {
  micro: 0.12,      // 80–180ms: tap feedback, badges, state indicators
  control: 0.24,    // 180–320ms: buttons, modal toggles, compass taps
  reveal: 0.45,     // 350–600ms: editorial headlines, node blossoms
  transition: 0.75, // 550–900ms: destination portal commit, card transforms
  cinematic: 1.20,  // 900–1400ms: ceremonial opening, calm autoplay world changes
} as const;

export const SJH_SCRUB = {
  // Mobile touch (coarse pointer): tight attachment to the thumb, minimal catch-up lag
  mobile: {
    heroToMagazine: 0.40,
    travelThread: 0.28,
    trustLedger: 0.30,
    journeyAtlas: 0.35,
  },
  // Desktop mouse wheel (fine pointer): luxurious momentum gliding
  desktop: {
    heroToMagazine: 0.80,
    travelThread: 0.55,
    trustLedger: 0.50,
    journeyAtlas: 0.50,
  },
} as const;

/**
 * Returns mobile-tuned or desktop-tuned scrub based on pointer capability.
 */
export function getScrub(phase: keyof typeof SJH_SCRUB.mobile): number {
  if (typeof window === "undefined") return SJH_SCRUB.mobile[phase];
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  return isFinePointer ? SJH_SCRUB.desktop[phase] : SJH_SCRUB.mobile[phase];
}
