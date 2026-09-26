import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getScrub } from "../../constants/motionTokens";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollTransitionRefs {
  track: HTMLElement;
  pinTarget: HTMLElement;
  cardStage: HTMLElement;
  cardImg: HTMLElement;
  doors: HTMLElement;
  dock: HTMLElement;
  compassNav: HTMLElement;
  heroCopy: HTMLElement;
  header: HTMLElement;
  ivoryCanvas: HTMLElement;
  editorialIntro: HTMLElement;
  editorialMeta: HTMLElement;
}

export interface ScrollTransitionCallbacks {
  onProgress?: (progress: number) => void;
  onLockChange?: (locked: boolean) => void;
}

export interface ScrollTransitionHandle {
  timeline: gsap.core.Timeline;
  scrollTrigger: ScrollTrigger;
  kill: () => void;
  seek: (progress: number) => void;
}

/**
 * Creates and initializes the master Phase 4 ScrollTrigger timeline:
 * Fullscreen Cinematic Hero -> Editorial Magazine Card on warm ivory canvas.
 * Total scroll distance: ~135svh.
 */
export function createHeroScrollTransition(
  refs: ScrollTransitionRefs,
  callbacks?: ScrollTransitionCallbacks
): ScrollTransitionHandle {
  // Clear any existing triggers on the track
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger === refs.track) {
      st.kill();
    }
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Calculate dynamic card dimensions matching mobile viewport
  const viewportWidth = window.innerWidth || 390;
  const viewportHeight = window.innerHeight || 844;
  const targetCardWidth = Math.min(viewportWidth - 32, 358);
  const targetCardHeight = Math.min(Math.max(380, Math.round(viewportHeight * 0.54)), 480);
  const targetCardTop = Math.min(Math.max(96, Math.round(viewportHeight * 0.135)), 122);

  // Initialize paused master timeline
  const tl = gsap.timeline({
    paused: true,
    defaults: { overwrite: "auto" },
  });

  if (reduceMotion) {
    // Reduced motion: immediate layout setup, no pinned 135svh scrub
    gsap.set(refs.doors, { opacity: 0 });
    gsap.set([refs.dock, refs.compassNav, refs.heroCopy], { opacity: 0, pointerEvents: "none" });
    gsap.set(refs.ivoryCanvas, { opacity: 1 });
    gsap.set(refs.cardStage, {
      width: targetCardWidth,
      height: targetCardHeight,
      borderRadius: "28px",
      boxShadow: "0 20px 48px rgba(17, 16, 14, 0.20)",
      top: targetCardTop,
    });
    gsap.set(refs.header, { color: "#11100E" });
    gsap.set([refs.editorialIntro, refs.editorialMeta], { autoAlpha: 1, y: 0 });

    const dummySt = ScrollTrigger.create({
      trigger: refs.track,
      start: "top top",
      end: "+=100",
    });

    return {
      timeline: tl,
      scrollTrigger: dummySt,
      kill: () => dummySt.kill(),
      seek: () => {},
    };
  }

  // 1. Gate framing recession (progress 0.10 -> 0.34)
  tl.to(
    refs.doors,
    {
      autoAlpha: 0,
      scale: 1.04,
      duration: 0.24,
      ease: "power2.inOut",
    },
    0.10
  );

  // 2. Journey Dock exits downward (progress 0.08 -> 0.28)
  tl.fromTo(
    refs.dock,
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
    },
    {
      autoAlpha: 0,
      y: 24,
      scale: 0.94,
      duration: 0.20,
      ease: "power2.in",
    },
    0.08
  );

  // 3. Compass nav exits (progress 0.08 -> 0.25)
  tl.fromTo(
    refs.compassNav,
    {
      autoAlpha: 1,
      scale: 1,
    },
    {
      autoAlpha: 0,
      scale: 0.90,
      duration: 0.17,
      ease: "power2.in",
    },
    0.08
  );

  // 4. Hero typography departs cleanly (progress 0.26 -> 0.50)
  tl.to(
    refs.heroCopy,
    {
      autoAlpha: 0,
      y: -20,
      duration: 0.24,
      ease: "power2.in",
    },
    0.26
  );

  // 5. Warm ivory canvas (#F4EFE6) emerges (progress 0.20 -> 0.50)
  tl.to(
    refs.ivoryCanvas,
    {
      opacity: 1,
      duration: 0.30,
      ease: "power1.inOut",
    },
    0.20
  );

  // 6. Hero image stage detaches from fullscreen, scales inward, and rounds corners (progress 0.26 -> 0.72)
  tl.to(
    refs.cardStage,
    {
      width: targetCardWidth,
      height: targetCardHeight,
      borderRadius: "28px",
      boxShadow: "0 22px 52px rgba(17, 16, 14, 0.22)",
      top: targetCardTop,
      duration: 0.46,
      ease: "power2.inOut",
    },
    0.26
  );

  // 7. Subtle interior photographic reframe inside card (progress 0.28 -> 0.74)
  tl.to(
    refs.cardImg,
    {
      scale: 1.05,
      y: -12,
      filter: "brightness(1) saturate(1) blur(0px)",
      duration: 0.46,
      ease: "power1.out",
    },
    0.28
  );

  // 8. Header palette adapts from light/gold to dark temple-black (#11100E) over ivory (progress 0.32 -> 0.65)
  tl.to(
    refs.header,
    {
      color: "#11100E",
      duration: 0.33,
      ease: "power2.out",
    },
    0.32
  );

  // 9. Editorial section intro arrives: "WHAT ARE YOU LOOKING FOR? Not destinations. A feeling." (progress 0.44 -> 0.64)
  tl.fromTo(
    refs.editorialIntro,
    { autoAlpha: 0, y: 16 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.20,
      ease: "power2.out",
    },
    0.44
  );

  // 10. Editorial feeling details arrive below the card (progress 0.58 -> 0.76)
  tl.fromTo(
    refs.editorialMeta,
    { autoAlpha: 0, y: 20 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.18,
      ease: "power3.out",
    },
    0.58
  );

  // ScrollTrigger instance pinning the hero over 135svh of native scroll
  const scrollDistance = Math.round(viewportHeight * 1.35);

  let wasLocked = false;

  const st = ScrollTrigger.create({
    trigger: refs.track,
    start: "top top",
    end: `+=${scrollDistance}`,
    pin: refs.pinTarget,
    pinSpacing: true,
    scrub: getScrub("heroToMagazine"),
    animation: tl,
    onUpdate: (self) => {
      const p = self.progress;
      callbacks?.onProgress?.(p);

      // Lock all cardinal and portal interactions when progress > 0.04
      const isLocked = p > 0.04;
      if (isLocked !== wasLocked) {
        wasLocked = isLocked;
        callbacks?.onLockChange?.(isLocked);
      }

      // Pointer event safety on fading controls
      if (refs.dock) {
        refs.dock.style.pointerEvents = p > 0.20 ? "none" : "auto";
        if (p >= 0.28) {
          refs.dock.style.opacity = "0";
          refs.dock.style.visibility = "hidden";
        } else if (p <= 0.04) {
          refs.dock.style.opacity = "1";
          refs.dock.style.visibility = "visible";
          refs.dock.style.transform = "translate(0px, 0px) scale(1)";
        } else {
          refs.dock.style.visibility = "visible";
        }
      }
      if (refs.compassNav) {
        refs.compassNav.style.pointerEvents = p > 0.18 ? "none" : "auto";
        if (p >= 0.25) {
          refs.compassNav.style.opacity = "0";
          refs.compassNav.style.visibility = "hidden";
        } else if (p <= 0.04) {
          refs.compassNav.style.opacity = "1";
          refs.compassNav.style.visibility = "visible";
        } else {
          refs.compassNav.style.visibility = "visible";
        }
      }

      // Doors visibility safety
      if (refs.doors) {
        refs.doors.style.visibility = p >= 0.34 ? "hidden" : "visible";
      }

      // Header adaptation class
      if (refs.header) {
        if (p > 0.50) {
          refs.header.classList.add("is-editorial");
        } else {
          refs.header.classList.remove("is-editorial");
        }
      }
    },
  });

  return {
    timeline: tl,
    scrollTrigger: st,
    kill: () => {
      st.kill();
      tl.kill();
    },
    seek: (progress: number) => {
      // Kill any in-flight scrub tween so seek is instantaneous
      const scrubTween = (st as any).getTween?.();
      if (scrubTween) {
        scrubTween.kill();
      }
      const scrollPos = st.start + (st.end - st.start) * progress;
      if (typeof window !== "undefined") {
        window.scrollTo(0, scrollPos);
      }
      st.scroll(scrollPos);
      tl.progress(progress);
      callbacks?.onProgress?.(progress);
      const isLocked = progress > 0.04;
      wasLocked = isLocked;
      callbacks?.onLockChange?.(isLocked);
      if (refs.doors) {
        refs.doors.style.visibility = progress >= 0.34 ? "hidden" : "visible";
      }
      if (refs.dock) {
        if (progress >= 0.28) {
          refs.dock.style.opacity = "0";
          refs.dock.style.visibility = "hidden";
          refs.dock.style.pointerEvents = "none";
        } else if (progress <= 0.04) {
          refs.dock.style.opacity = "1";
          refs.dock.style.visibility = "visible";
          refs.dock.style.pointerEvents = "auto";
          refs.dock.style.transform = "translate(0px, 0px) scale(1)";
        } else {
          refs.dock.style.visibility = "visible";
          refs.dock.style.pointerEvents = progress > 0.20 ? "none" : "auto";
        }
      }
      if (refs.compassNav) {
        if (progress >= 0.25) {
          refs.compassNav.style.opacity = "0";
          refs.compassNav.style.visibility = "hidden";
          refs.compassNav.style.pointerEvents = "none";
        } else if (progress <= 0.04) {
          refs.compassNav.style.opacity = "1";
          refs.compassNav.style.visibility = "visible";
          refs.compassNav.style.pointerEvents = "auto";
          refs.compassNav.style.transform = "translate(0px, 0px) scale(1)";
        } else {
          refs.compassNav.style.visibility = "visible";
          refs.compassNav.style.pointerEvents = progress > 0.18 ? "none" : "auto";
        }
      }
      if (refs.header) {
        if (progress > 0.50) {
          refs.header.classList.add("is-editorial");
        } else {
          refs.header.classList.remove("is-editorial");
        }
      }
    },
  };
}
