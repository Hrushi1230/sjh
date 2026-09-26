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

  // 1. Gate framing recession (progress 0.08 -> 0.36)
  tl.to(
    refs.doors,
    {
      autoAlpha: 0,
      scale: 1.04,
      duration: 0.28,
      ease: "power2.inOut",
    },
    0.08
  );

  // 2. Journey Dock exits downward (progress 0.06 -> 0.28)
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
      duration: 0.22,
      ease: "power2.in",
    },
    0.06
  );

  // 3. Compass nav exits (progress 0.06 -> 0.26)
  tl.fromTo(
    refs.compassNav,
    {
      autoAlpha: 1,
      scale: 1,
    },
    {
      autoAlpha: 0,
      scale: 0.90,
      duration: 0.20,
      ease: "power2.in",
    },
    0.06
  );

  // 4. Hero typography departs cleanly (progress 0.18 -> 0.42)
  tl.to(
    refs.heroCopy,
    {
      autoAlpha: 0,
      y: -20,
      duration: 0.24,
      ease: "power2.in",
    },
    0.18
  );

  // 5. Warm ivory canvas (#F4EFE6) emerges (progress 0.15 -> 0.53)
  tl.to(
    refs.ivoryCanvas,
    {
      opacity: 1,
      duration: 0.38,
      ease: "power1.inOut",
    },
    0.15
  );

  // 6. Hero image stage detaches from fullscreen, scales inward, and rounds corners (progress 0.18 -> 0.78)
  tl.to(
    refs.cardStage,
    {
      width: targetCardWidth,
      height: targetCardHeight,
      borderRadius: "28px",
      boxShadow: "0 22px 52px rgba(17, 16, 14, 0.22)",
      top: targetCardTop,
      duration: 0.60,
      ease: "power2.inOut",
    },
    0.18
  );

  // 7. Subtle interior photographic reframe inside card (progress 0.20 -> 0.78)
  tl.to(
    refs.cardImg,
    {
      scale: 1.05,
      y: -12,
      filter: "brightness(1) saturate(1) blur(0px)",
      duration: 0.58,
      ease: "power1.out",
    },
    0.20
  );

  // 8. Header palette adapts from light/gold to dark temple-black (#11100E) over ivory (progress 0.30 -> 0.65)
  tl.to(
    refs.header,
    {
      color: "#11100E",
      duration: 0.35,
      ease: "power2.out",
    },
    0.30
  );

  // 9. Editorial section intro arrives: "WHAT ARE YOU LOOKING FOR? Not destinations. A feeling." (progress 0.44 -> 0.72)
  tl.fromTo(
    refs.editorialIntro,
    { autoAlpha: 0, y: 16 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.28,
      ease: "power2.out",
    },
    0.44
  );

  // 10. Editorial feeling details arrive below the card (progress 0.60 -> 0.88)
  tl.fromTo(
    refs.editorialMeta,
    { autoAlpha: 0, y: 20 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.28,
      ease: "power3.out",
    },
    0.60
  );

  // Responsive scroll distance: mobile calibrated for effortless, buttery scroll (0.72vh ~ 600px), desktop 1.15vh
  const isMobile = typeof window !== "undefined" && (window.innerWidth <= 600 || window.matchMedia("(pointer: coarse)").matches);
  const scrollDistance = Math.round(viewportHeight * (isMobile ? 0.72 : 1.15));

  let wasLocked = false;
  let wasDoorsHidden = false;
  let wasEditorial = false;

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

      // Pointer event safety on fading controls (dock & compass)
      if (refs.dock) {
        refs.dock.style.pointerEvents = p > 0.18 ? "none" : "auto";
      }
      if (refs.compassNav) {
        refs.compassNav.style.pointerEvents = p > 0.16 ? "none" : "auto";
      }

      // Doors visibility safety (only mutate DOM when threshold crosses)
      if (refs.doors) {
        const doorsHidden = p >= 0.36;
        if (doorsHidden !== wasDoorsHidden) {
          wasDoorsHidden = doorsHidden;
          refs.doors.style.visibility = doorsHidden ? "hidden" : "visible";
        }
      }

      // Header adaptation class (only mutate DOM when threshold crosses)
      if (refs.header) {
        const isEdit = p > 0.48;
        if (isEdit !== wasEditorial) {
          wasEditorial = isEdit;
          if (isEdit) {
            refs.header.classList.add("is-editorial");
          } else {
            refs.header.classList.remove("is-editorial");
          }
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
        refs.doors.style.visibility = progress >= 0.36 ? "hidden" : "visible";
      }
      if (refs.dock) {
        refs.dock.style.pointerEvents = progress > 0.18 ? "none" : "auto";
      }
      if (refs.compassNav) {
        refs.compassNav.style.pointerEvents = progress > 0.16 ? "none" : "auto";
      }
      if (refs.header) {
        if (progress > 0.48) {
          refs.header.classList.add("is-editorial");
        } else {
          refs.header.classList.remove("is-editorial");
        }
      }
    },
  };
}
