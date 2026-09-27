import gsap from "gsap";

export interface PlannerMotionRefs {
  shell: HTMLElement;
  dockCollapsed: HTMLElement;
  dockExpanded: HTMLElement;
  header: HTMLElement;
  rows: HTMLElement[];
  cta: HTMLElement;
  veil: HTMLElement;
  backgroundImg: HTMLElement;
  heroHeader: HTMLElement;
  compassNav: HTMLElement;
}

/**
 * Creates and runs the physical upward morph timeline for the Journey Dock -> Planner.
 * Timeline target: ~560–720ms.
 * Easing: power3.inOut for shell, power3.out for rows.
 */
export function createPlannerOpenTimeline(
  refs: PlannerMotionRefs,
  expandedHeight: number,
  onComplete?: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => {
      onComplete?.();
    },
  });

  // 1. Initial immediate setups
  tl.set(refs.dockExpanded, {
    autoAlpha: 1,
    visibility: "visible",
    pointerEvents: "auto",
  }, 0);

  // 2. Collapsed dock content begins fading immediately (0.00 - 0.14s)
  tl.to(
    refs.dockCollapsed,
    {
      opacity: 0,
      scale: 0.94,
      duration: 0.14,
      ease: "power2.out",
      onComplete: () => {
        refs.dockCollapsed.style.pointerEvents = "none";
      },
    },
    0
  );

  // 3. Shell expands upward physically (0.04 - 0.52s)
  // Height increases, radius drops from pill (999px) to tablet corner (24px), background stays transparent frosted glass
  tl.to(
    refs.shell,
    {
      height: expandedHeight,
      maxWidth: 440,
      borderRadius: "20px",
      backgroundColor: "transparent",
      borderColor: "transparent",
      boxShadow: "none",
      duration: 0.44,
      ease: "power3.inOut",
    },
    0.04
  );

  // 4. Background stage world response: stays luminous and clear without heavy dimming (0.04 - 0.50s)
  tl.to(
    refs.backgroundImg,
    {
      scale: 1.025,
      filter: "brightness(0.92) saturate(1.0) blur(0px)",
      duration: 0.46,
      ease: "power3.inOut",
    },
    0.04
  );

  // 5. Veil emerges very subtly behind planner so temple photography is visible (0.04 - 0.44s)
  tl.to(
    refs.veil,
    {
      opacity: 0.15,
      duration: 0.40,
      ease: "power2.out",
    },
    0.04
  );

  // 6. Non-planner hero UI subdues gently (header & compass)
  tl.to(
    refs.heroHeader,
    {
      opacity: 0.90,
      duration: 0.32,
      ease: "power2.out",
    },
    0.06
  );
  tl.to(
    refs.compassNav,
    {
      opacity: 0.85,
      duration: 0.32,
      ease: "power2.out",
    },
    0.06
  );

  // 7. Planner header appears as shell expansion is underway (0.24 - 0.46s)
  tl.fromTo(
    refs.header,
    { autoAlpha: 0, y: -8 },
    { autoAlpha: 1, y: 0, duration: 0.24, ease: "power2.out" },
    0.22
  );

  // 8. Form rows reveal with short, refined stagger (0.28 - 0.58s)
  if (refs.rows.length > 0) {
    tl.fromTo(
      refs.rows,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        stagger: 0.045,
        ease: "power3.out",
      },
      0.28
    );
  }

  // 9. CTA button enters and settles (0.40 - 0.64s)
  tl.fromTo(
    refs.cta,
    { autoAlpha: 0, y: 10, scale: 0.98 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.26, ease: "power3.out" },
    0.40
  );

  return tl;
}

/**
 * Creates and runs the true physical reverse morph timeline for Planner -> Journey Dock.
 * Target: ~480–620ms.
 * Easing: power3.inOut for shell contraction.
 */
export function createPlannerCloseTimeline(
  refs: PlannerMotionRefs,
  collapsedHeight: number = 78,
  onComplete?: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => {
      // Clean up expanded elements
      gsap.set(refs.dockExpanded, {
        autoAlpha: 0,
        visibility: "hidden",
        pointerEvents: "none",
      });
      refs.dockCollapsed.style.pointerEvents = "auto";
      onComplete?.();
    },
  });

  // 1. CTA button and lower form rows fade down first (0.00 - 0.18s)
  tl.to(
    refs.cta,
    {
      autoAlpha: 0,
      y: 6,
      scale: 0.98,
      duration: 0.16,
      ease: "power2.in",
    },
    0
  );

  if (refs.rows.length > 0) {
    tl.to(
      refs.rows,
      {
        autoAlpha: 0,
        y: 6,
        duration: 0.18,
        stagger: 0.02,
        ease: "power2.in",
      },
      0.02
    );
  }

  // 2. Planner header fades out (0.06 - 0.22s)
  tl.to(
    refs.header,
    {
      autoAlpha: 0,
      y: -6,
      duration: 0.16,
      ease: "power2.in",
    },
    0.06
  );

  // 3. Shell contracts downward into the original dock pill (0.12 - 0.48s)
  tl.to(
    refs.shell,
    {
      height: collapsedHeight,
      maxWidth: 362,
      borderRadius: "999px",
      backgroundColor: "rgba(17, 16, 14, 0.84)",
      borderColor: "rgba(185, 148, 85, 0.5)",
      boxShadow: "0 18px 50px rgba(0, 0, 0, 0.35)",
      duration: 0.36,
      ease: "power3.inOut",
    },
    0.12
  );

  // 4. Background stage world restores to crisp baseline (0.12 - 0.46s)
  tl.to(
    refs.backgroundImg,
    {
      scale: 1.035,
      filter: "brightness(1) saturate(1) blur(0px)",
      duration: 0.34,
      ease: "power3.inOut",
    },
    0.12
  );

  // 5. Veil fades out (0.10 - 0.40s)
  tl.to(
    refs.veil,
    {
      opacity: 0,
      duration: 0.30,
      ease: "power2.out",
    },
    0.10
  );

  // 6. Hero header and compass restore to active interaction (0.16 - 0.44s)
  tl.to(
    refs.heroHeader,
    {
      opacity: 1,
      duration: 0.28,
      ease: "power2.out",
    },
    0.16
  );
  tl.to(
    refs.compassNav,
    {
      opacity: 1,
      duration: 0.28,
      ease: "power2.out",
    },
    0.16
  );

  // 7. Collapsed dock content restores cleanly (0.28 - 0.50s)
  tl.to(
    refs.dockCollapsed,
    {
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
    },
    0.26
  );

  return tl;
}

/**
 * Instantaneous / reduced-motion fallback for open morph.
 */
export function setPlannerOpenReducedMotion(
  refs: PlannerMotionRefs,
  expandedHeight: number
) {
  gsap.set(refs.dockCollapsed, { opacity: 0, pointerEvents: "none" });
  gsap.set(refs.shell, {
    height: expandedHeight,
    maxWidth: 440,
    borderRadius: "20px",
    backgroundColor: "transparent",
    borderColor: "transparent",
    boxShadow: "none",
  });
  gsap.set(refs.backgroundImg, {
    filter: "brightness(0.92) blur(0px)",
  });
  gsap.set(refs.veil, { opacity: 0.15 });
  gsap.set(refs.heroHeader, { opacity: 0.90 });
  gsap.set(refs.compassNav, { opacity: 0.85 });
  gsap.set(refs.dockExpanded, {
    autoAlpha: 1,
    visibility: "visible",
    pointerEvents: "auto",
  });
  gsap.set([refs.header, ...refs.rows, refs.cta], { autoAlpha: 1, y: 0, scale: 1 });
}

/**
 * Instantaneous / reduced-motion fallback for close morph.
 */
export function setPlannerClosedReducedMotion(
  refs: PlannerMotionRefs,
  collapsedHeight: number = 78
) {
  gsap.set(refs.dockExpanded, {
    autoAlpha: 0,
    visibility: "hidden",
    pointerEvents: "none",
  });
  gsap.set(refs.shell, {
    height: collapsedHeight,
    maxWidth: 362,
    borderRadius: "999px",
    backgroundColor: "rgba(17, 16, 14, 0.84)",
    borderColor: "rgba(185, 148, 85, 0.5)",
    boxShadow: "0 18px 50px rgba(0, 0, 0, 0.35)",
  });
  gsap.set(refs.backgroundImg, {
    scale: 1.035,
    filter: "brightness(1) blur(0px)",
  });
  gsap.set(refs.veil, { opacity: 0 });
  gsap.set(refs.heroHeader, { opacity: 1 });
  gsap.set(refs.compassNav, { opacity: 1 });
  gsap.set(refs.dockCollapsed, { opacity: 1, scale: 1, pointerEvents: "auto" });
}
