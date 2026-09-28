import { useLayoutEffect, useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import {
  destinations,
  heroCopy,
  Direction,
  getDestinationByDirection,
} from "./heroData";
import {
  createHeroIntro,
  setHeroSettled,
  calculateGateCalibration,
  HeroMotionRefs,
} from "./heroMotion";
import {
  PortalElements,
  PortalGeometry,
  calculatePortalGeometry,
  applyPortalStyles,
  resetPortalStyles,
  animatePortalCommit,
  animatePortalCancel,
  animatePortalAutoplay,
  animateCopyReveal,
  animateCopyCrossfade,
} from "./destinationPortal";
import {
  JourneyDockPlanner,
  JourneyDockPlannerHandle,
} from "./JourneyDockPlanner";
import { JourneyDraft } from "./plannerData";
import {
  createHeroScrollTransition,
  ScrollTransitionHandle,
} from "./heroScrollTransition";
import { decodeImage, scheduleProgressiveDecode } from "../../utils/imageDecoder";
import "./hero.css";

export type HeroMotionState =
  | "boot"
  | "intro"
  | "settled"
  | "auto-wait"
  | "dragging"
  | "transitioning"
  | "settling"
  | "planner-open"
  | "leaving-hero"
  | "suspended";

export type HeroTransitionSource = "auto" | "swipe" | "compass" | "keyboard";

type Props = {
  onOpenMenu?: () => void;
  onOpenPlannerSheet?: (options?: {
    source?: string;
    destination?: string;
    step?: 1 | 2 | 3 | 4 | 5 | 6;
    focusField?: string;
  }) => void;
  onPlanJourney?: () => void;
  draft: JourneyDraft;
  onDraftChange: (draft: JourneyDraft) => void;
  step?: 1 | 2 | 3 | 4 | 5 | 6;
  onStepChange?: (step: 1 | 2 | 3 | 4 | 5 | 6) => void;
  destinationTouchedByUser?: boolean;
  onDestinationTouched?: () => void;
  onCreateJourney?: (draft: JourneyDraft) => void;
  onDestinationChange?: (destinationId: "puri" | "kashmir" | "rajasthan" | "kerala") => void;
  homeHref?: string;
  assetBase?: string;
  isInternalPageOpen?: boolean;
  isPlannerSheetOpen?: boolean;
  isPlannerOpen?: boolean;
};

const SESSION_STORAGE_KEY = "sjh_hero_intro_seen";
const AUTOPLAY_DWELL_SECONDS = 4.0;

export function MobileCinematicHero({
  onOpenMenu,
  onOpenPlannerSheet,
  onPlanJourney,
  draft,
  onDraftChange,
  step = 1,
  onStepChange,
  destinationTouchedByUser: _destinationTouchedByUser = false,
  onDestinationTouched,
  onCreateJourney,
  onDestinationChange,
  homeHref = "/",
  assetBase = "/assets/sjh-hero",
  isInternalPageOpen = false,
  isPlannerSheetOpen,
  isPlannerOpen,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const introContainer = useRef<HTMLDivElement>(null);
  const introBrandWrap = useRef<HTMLDivElement>(null);
  const introFlame = useRef<SVGGElement>(null);
  const introFlameStroke1 = useRef<SVGPathElement>(null);
  const introFlameStroke2 = useRef<SVGPathElement>(null);
  const introFlameStroke3 = useRef<SVGPathElement>(null);
  const introFlameStroke4 = useRef<SVGPathElement>(null);
  const introFlameStroke5 = useRef<SVGPathElement>(null);
  const introSjh = useRef<SVGTextElement>(null);
  const introName = useRef<SVGGElement>(null);
  const introPrompt = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);

  // 3-Layer Golden Seam Refs
  const seamWrap = useRef<HTMLDivElement>(null);
  const seamCore = useRef<HTMLDivElement>(null);
  const seamGlow = useRef<HTMLDivElement>(null);
  const seamBloom = useRef<HTMLDivElement>(null);

  // Doors & Lighting Refs
  const doorsContainer = useRef<HTMLDivElement>(null);
  const gateVeil = useRef<HTMLDivElement>(null);
  const leftDoor = useRef<HTMLDivElement>(null);
  const rightDoor = useRef<HTMLDivElement>(null);
  const leftGlow = useRef<HTMLDivElement>(null);
  const rightGlow = useRef<HTMLDivElement>(null);
  const seamShadow = useRef<HTMLDivElement>(null);
  const portalBloom = useRef<HTMLDivElement>(null);

  // Background & Settled UI Refs (Only TWO full-screen image elements: base & incoming portal)
  const background = useRef<HTMLImageElement>(null);
  const location = useRef<HTMLDivElement>(null);
  const title1 = useRef<HTMLSpanElement>(null);
  const title2 = useRef<HTMLSpanElement>(null);
  const subhead = useRef<HTMLDivElement>(null);
  const support = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const compassNav = useRef<HTMLElement>(null);

  // Phase 3: Journey Planner Refs & Mental Model:
  // A. bookingCardVisible (compact card visible in settled hero)
  // B. bookingInteractionActive (idle grace period with cancellable 8s timer)
  // C. plannerSheetOpen (viewport-level sheet open)
  const plannerRef = useRef<JourneyDockPlannerHandle>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  const isSheetOpen = Boolean(isPlannerSheetOpen ?? isPlannerOpen);
  const isSheetOpenRef = useRef(isSheetOpen);
  isSheetOpenRef.current = isSheetOpen;

  const isAlreadySeen = typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
  const [bookingCardVisible, setBookingCardVisible] = useState(isAlreadySeen);

  const [isDestDropdownOpen, setIsDestDropdownOpen] = useState(false);
  const isDestDropdownOpenRef = useRef(false);
  isDestDropdownOpenRef.current = isDestDropdownOpen;

  const interactionIdleTimerRef = useRef<gsap.core.Tween | null>(null);

  // Phase 2: Destination State & Indices (Puri -> Kashmir -> Rajasthan -> Kerala)
  const [activeDestIndex, setActiveDestIndex] = useState(0); // 0 = Puri (East)
  const activeDestIndexRef = useRef(0);
  activeDestIndexRef.current = activeDestIndex;

  const [incomingDestIndex, setIncomingDestIndex] = useState(1); // 1 = Kashmir (North)
  const incomingDestIndexRef = useRef(1);
  incomingDestIndexRef.current = incomingDestIndex;

  const [portalActive, setPortalActive] = useState(false);

  const portalWrapRef = useRef<HTMLDivElement>(null);
  const portalImgRef = useRef<HTMLImageElement>(null);
  const portalRingRef = useRef<HTMLDivElement>(null);
  const portalCueRef = useRef<HTMLDivElement>(null);
  const copyContainerRef = useRef<HTMLDivElement>(null);

  // Unified Hero Motion State Machine
  const heroMotionStateRef = useRef<HeroMotionState>("boot");
  const autoplayCallRef = useRef<gsap.core.Tween | null>(null);
  const [isAutoplayManuallyPaused, setIsAutoplayManuallyPaused] = useState(false);
  const isAutoplayManuallyPausedRef = useRef(false);
  isAutoplayManuallyPausedRef.current = isAutoplayManuallyPaused;

  const isSuspendedRef = useRef(false);
  const isUserInteractingRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  const currentGeoRef = useRef<PortalGeometry | null>(null);

  // Gesture Tracker Ref
  const gestureRef = useRef<{
    startX: number;
    startY: number;
    startTime: number;
    pointerId: number;
    state: "tracking" | "dragging";
    lockedDirection: Direction | null;
    targetIndex: number;
    currentProgress: number;
  } | null>(null);

  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const isIntroCompleteRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const copyRevealTlRef = useRef<gsap.core.Timeline | null>(null);
  const activeTransitionTlRef = useRef<gsap.core.Timeline | null>(null);

  // Phase 4: Scroll Transition Refs & State
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardStageRef = useRef<HTMLDivElement>(null);
  const ivoryCanvasRef = useRef<HTMLDivElement>(null);
  const editorialIntroRef = useRef<HTMLDivElement>(null);
  const editorialMetaRef = useRef<HTMLDivElement>(null);
  const scrollTransitionRef = useRef<ScrollTransitionHandle | null>(null);
  const isScrollLockedRef = useRef(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const scrollProgressRef = useRef(0);

  const currentDest = destinations[activeDestIndex];
  const incomingDest = destinations[incomingDestIndex];

  // Persistent header theme & frosted backdrop state across all sections
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isEditorialTheme, setIsEditorialTheme] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    let prevScrolled = false;
    let prevDark = false;
    let prevEditorial = false;

    const checkScroll = () => {
      const y = window.scrollY;
      const nextScrolled = y > 60;
      if (nextScrolled !== prevScrolled) {
        prevScrolled = nextScrolled;
        setIsScrolled(nextScrolled);
      }

      const p11 = document.getElementById("start-your-journey");
      const nextDark = Boolean(p11 && p11.getBoundingClientRect().top <= 70);
      if (nextDark !== prevDark) {
        prevDark = nextDark;
        setIsDarkTheme(nextDark);
      }

      const nextEditorial = y > 450 && !nextDark;
      if (nextEditorial !== prevEditorial) {
        prevEditorial = nextEditorial;
        setIsEditorialTheme(nextEditorial);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to gather all elements required by destinationPortal engine
  const getPortalElements = useCallback((): PortalElements | null => {
    if (
      !root.current ||
      !background.current ||
      !portalWrapRef.current ||
      !portalImgRef.current ||
      !portalRingRef.current ||
      !copyContainerRef.current ||
      !location.current ||
      !title1.current ||
      !title2.current ||
      !support.current ||
      !dock.current
    ) {
      return null;
    }
    return {
      root: root.current,
      baseImg: background.current,
      portalWrap: portalWrapRef.current,
      portalImg: portalImgRef.current,
      portalRing: portalRingRef.current,
      portalCue: portalCueRef.current,
      copyContainer: copyContainerRef.current,
      locationText: location.current,
      titleLine1: title1.current,
      titleLine2: title2.current,
      subhead: subhead.current,
      support: support.current,
      dock: dock.current,
    };
  }, []);

  // Kill autoplay timer safely
  const killAutoplayTimer = useCallback(() => {
    if (autoplayCallRef.current) {
      autoplayCallRef.current.kill();
      autoplayCallRef.current = null;
    }
  }, []);

  // Check if conditions allow starting an autoplay transition
  const canAutoplay = useCallback(() => {
    if (!isIntroCompleteRef.current) return false;
    if (
      heroMotionStateRef.current !== "settled" &&
      heroMotionStateRef.current !== "auto-wait"
    ) {
      return false;
    }
    if (isSuspendedRef.current) return false;
    if (isSheetOpenRef.current) return false;
    if (isUserInteractingRef.current) return false;
    if (isDestDropdownOpenRef.current) return false;
    if (typeof document !== "undefined" && document.hidden) return false;
    if (prefersReducedMotionRef.current) return false;
    if (scrollProgressRef.current > 0.02) return false;
    if (isAutoplayManuallyPausedRef.current) return false;
    return true;
  }, []);

  // Forward declaration for scheduleAutoplay
  const scheduleAutoplayRef = useRef<(delay?: number) => void>(() => {});

  // Master Destination Transition Function (Single Motion Owner)
  const transitionDestination = useCallback(
    (targetIndex: number, source: HeroTransitionSource, fromDirection?: Direction) => {
      if (!isIntroCompleteRef.current) return;
      if (isScrollLockedRef.current) return;
      // Allow auto slideshow transitions even when booking card is visible
      if (isSheetOpenRef.current && source !== "auto") return;
      if (heroMotionStateRef.current === "transitioning" || heroMotionStateRef.current === "leaving-hero") return;
      if (targetIndex === activeDestIndexRef.current && source !== "swipe") return;

      killAutoplayTimer();

      heroMotionStateRef.current = "transitioning";
      const targetDest = destinations[targetIndex];
      const viewportWidth = root.current?.clientWidth || window.innerWidth || 390;
      const viewportHeight = root.current?.clientHeight || window.innerHeight || 844;

      // Reduced motion: instantaneous crossfade without heavy portal geometry
      if (prefersReducedMotionRef.current) {
        activeDestIndexRef.current = targetIndex;
        setActiveDestIndex(targetIndex);
        if (background.current) {
          background.current.src = `${assetBase}/${targetDest.image}`;
        }
        onDestinationChange?.(destinations[targetIndex].id);
        heroMotionStateRef.current = "settled";
        return;
      }

      // Prepare portal incoming image
      incomingDestIndexRef.current = targetIndex;
      setIncomingDestIndex(targetIndex);
      if (portalImgRef.current) {
        portalImgRef.current.src = `${assetBase}/${targetDest.image}`;
      }

      const els = getPortalElements();
      if (!els) {
        heroMotionStateRef.current = "settled";
        return;
      }

      if (source === "auto") {
        // Autoplay sequence: calm, elegant ~1.20s transition
        activeTransitionTlRef.current = animatePortalAutoplay(
          els,
          viewportWidth,
          viewportHeight,
          () => {
            // Midpoint: incoming world has expanded, update base image
            if (background.current) {
              background.current.src = `${assetBase}/${targetDest.image}`;
            }
          },
          () => {
            // Finalize destination switch
            activeDestIndexRef.current = targetIndex;
            setActiveDestIndex(targetIndex);
            onDestinationChange?.(destinations[targetIndex].id);
            setPortalActive(false);

            // Settle typography with calm crossfade
            heroMotionStateRef.current = "settling";
            copyRevealTlRef.current = animateCopyCrossfade(
              {
                location: location.current!,
                title1: title1.current!,
                title2: title2.current!,
                subhead: subhead.current,
                support: support.current!,
              },
              () => {
                heroMotionStateRef.current = isSheetOpenRef.current ? "planner-open" : "settled";
                scheduleAutoplayRef.current(AUTOPLAY_DWELL_SECONDS);
              }
            );
          }
        );
      } else if (source === "swipe") {
        // Swipe commit sequence: continues smoothly from current finger release geometry
        const startGeo =
          currentGeoRef.current ||
          calculatePortalGeometry(
            0.45,
            viewportWidth * 0.5,
            viewportHeight * 0.5,
            viewportWidth,
            viewportHeight,
            fromDirection || "west"
          );

        animatePortalCommit(els, startGeo, () => {
          if (background.current) {
            background.current.src = `${assetBase}/${targetDest.image}`;
          }
          activeDestIndexRef.current = targetIndex;
          setActiveDestIndex(targetIndex);
          onDestinationChange?.(destinations[targetIndex].id);
          setPortalActive(false);
          resetPortalStyles(els);

          heroMotionStateRef.current = "settling";
          copyRevealTlRef.current = animateCopyReveal(
            {
              location: location.current!,
              title1: title1.current!,
              title2: title2.current!,
              subhead: subhead.current,
              support: support.current!,
            },
            () => {
              heroMotionStateRef.current = "settled";
              // Manual interaction grace period: wait 8.0s before resuming autoplay
              scheduleAutoplayRef.current(8.0);
            }
          );
        });
      } else {
        // Compass or Keyboard selection
        const dir = fromDirection || targetDest.direction;
        const initialGeo = calculatePortalGeometry(
          0.18,
          viewportWidth * 0.5,
          viewportHeight * 0.5,
          viewportWidth,
          viewportHeight,
          dir
        );
        applyPortalStyles(els, initialGeo);
        setPortalActive(true);

        animatePortalCommit(els, initialGeo, () => {
          if (background.current) {
            background.current.src = `${assetBase}/${targetDest.image}`;
          }
          activeDestIndexRef.current = targetIndex;
          setActiveDestIndex(targetIndex);
          onDestinationChange?.(destinations[targetIndex].id);
          setPortalActive(false);
          resetPortalStyles(els);

          heroMotionStateRef.current = "settling";
          copyRevealTlRef.current = animateCopyReveal(
            {
              location: location.current!,
              title1: title1.current!,
              title2: title2.current!,
              subhead: subhead.current,
              support: support.current!,
            },
            () => {
              heroMotionStateRef.current = "settled";
              // Manual interaction grace period: wait 8.0s before resuming autoplay
              scheduleAutoplayRef.current(8.0);
            }
          );
        });
      }
    },
    [getPortalElements, assetBase, onDestinationChange, killAutoplayTimer]
  );

  // Schedule next autoplay cycle with cancellable GSAP delayedCall
  const scheduleAutoplay = useCallback(
    (delay = AUTOPLAY_DWELL_SECONDS) => {
      killAutoplayTimer();
      if (!canAutoplay()) return;

      heroMotionStateRef.current = "auto-wait";
      autoplayCallRef.current = gsap.delayedCall(delay, () => {
        if (!canAutoplay()) return;
        const nextIndex = (activeDestIndexRef.current + 1) % destinations.length;
        transitionDestination(nextIndex, "auto");
      });
    },
    [canAutoplay, killAutoplayTimer, transitionDestination]
  );
  scheduleAutoplayRef.current = scheduleAutoplay;

  // Manual Autoplay Pause / Resume toggle
  const toggleAutoplayPause = useCallback(() => {
    setIsAutoplayManuallyPaused((prev) => {
      const next = !prev;
      if (next) {
        killAutoplayTimer();
      } else {
        scheduleAutoplay(1.0);
      }
      return next;
    });
  }, [killAutoplayTimer, scheduleAutoplay]);

  // Fast-forward / interruption handler during intro
  const handleHeroTap = useCallback(() => {
    if (timelineRef.current && timelineRef.current.progress() < 1) {
      timelineRef.current.progress(1);
      setIsIntroComplete(true);
      isIntroCompleteRef.current = true;
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
      } catch {}
    }
  }, []);

  // Tapping compass cardinal point
  const handleCompassTap = useCallback(
    (dir: Direction) => {
      if (!isIntroCompleteRef.current || isScrollLockedRef.current || isSheetOpenRef.current || isDestDropdownOpenRef.current) return;
      if (heroMotionStateRef.current === "transitioning") return;

      if (heroMotionStateRef.current === "settling") {
        copyRevealTlRef.current?.progress(1);
        heroMotionStateRef.current = "settled";
      }

      const target = getDestinationByDirection(dir);
      if (!target) return;
      const targetIndex = destinations.findIndex((d) => d.id === target.id);
      if (targetIndex === activeDestIndexRef.current) return;

      transitionDestination(targetIndex, "compass", dir);
    },
    [transitionDestination]
  );

  // Cancellable interaction-idle timer (Section 5 & 6)
  // Every interaction pauses autoplay and resets an 8-second grace period.
  const markPlannerInteraction = useCallback(() => {
    killAutoplayTimer();
    isUserInteractingRef.current = true;

    if (interactionIdleTimerRef.current) {
      interactionIdleTimerRef.current.kill();
      interactionIdleTimerRef.current = null;
    }

    interactionIdleTimerRef.current = gsap.delayedCall(8.0, () => {
      if (
        !isSheetOpenRef.current &&
        !isDestDropdownOpenRef.current &&
        scrollProgressRef.current <= 0.02
      ) {
        isUserInteractingRef.current = false;
        scheduleAutoplayRef.current(AUTOPLAY_DWELL_SECONDS);
      }
    });
  }, [killAutoplayTimer]);

  useEffect(() => {
    if (isSheetOpen) {
      heroMotionStateRef.current = "planner-open";
      killAutoplayTimer();
      if (interactionIdleTimerRef.current) {
        interactionIdleTimerRef.current.kill();
        interactionIdleTimerRef.current = null;
      }
    } else {
      heroMotionStateRef.current = "settled";
      markPlannerInteraction();
    }
  }, [isSheetOpen, killAutoplayTimer, markPlannerInteraction]);

  useEffect(() => {
    return () => {
      if (interactionIdleTimerRef.current) {
        interactionIdleTimerRef.current.kill();
      }
    };
  }, []);

  // Mobile Swipe Gesture: Horizontal swipe advances/returns destination; Vertical swipe remains 100% native scroll!
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isIntroCompleteRef.current || isScrollLockedRef.current) return;
    if (isSheetOpenRef.current) return;
    if (heroMotionStateRef.current === "transitioning") return;

    if (heroMotionStateRef.current === "settling") {
      copyRevealTlRef.current?.progress(1);
      heroMotionStateRef.current = "settled";
    }

    gestureRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: performance.now(),
      pointerId: e.pointerId,
      state: "tracking",
      lockedDirection: null,
      targetIndex: -1,
      currentProgress: 0,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const g = gestureRef.current;
    if (!g || !isIntroCompleteRef.current || isScrollLockedRef.current) return;
    if (isSheetOpenRef.current) return;
    if (heroMotionStateRef.current === "transitioning") return;

    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;

    // Intent Lock Phase:
    if (g.state === "tracking") {
      // If vertical displacement dominates: native vertical document scroll takes full precedence!
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        gestureRef.current = null;
        return;
      }

      // If horizontal displacement dominates: initiate destination portal drag
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        killAutoplayTimer();
        isUserInteractingRef.current = true;

        const currentIdx = activeDestIndexRef.current;
        const isNext = dx < 0; // Swipe left advances (Puri -> Kashmir -> Rajasthan -> Kerala -> Puri)
        const targetIdx = isNext
          ? (currentIdx + 1) % destinations.length
          : (currentIdx - 1 + destinations.length) % destinations.length;

        const resolvedDir: Direction = isNext ? "west" : "east";
        g.lockedDirection = resolvedDir;
        g.targetIndex = targetIdx;
        g.state = "dragging";
        heroMotionStateRef.current = "dragging";

        incomingDestIndexRef.current = targetIdx;
        setIncomingDestIndex(targetIdx);
        setPortalActive(true);

        const targetDest = destinations[targetIdx];
        if (portalImgRef.current) {
          portalImgRef.current.src = `${assetBase}/${targetDest.image}`;
        }

        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {}
      }
    }

    // Portal Drag Phase: smooth circular portal follow without triggering React reconciliations
    if (g.state === "dragging" && g.targetIndex !== -1) {
      const viewportWidth = root.current?.clientWidth || window.innerWidth || 390;
      const viewportHeight = root.current?.clientHeight || window.innerHeight || 844;
      const commitDistance = viewportWidth * 0.38;
      const dragDist = Math.abs(dx);
      const progress = Math.min(1, Math.max(0, dragDist / commitDistance));
      g.currentProgress = progress;

      const rect = root.current?.getBoundingClientRect() || { left: 0, top: 0 };
      const pointerRelX = e.clientX - rect.left;
      const pointerRelY = e.clientY - rect.top;

      const geo = calculatePortalGeometry(
        progress,
        pointerRelX,
        pointerRelY,
        viewportWidth,
        viewportHeight,
        g.lockedDirection || (dx < 0 ? "west" : "east")
      );
      currentGeoRef.current = geo;

      const els = getPortalElements();
      if (els) {
        applyPortalStyles(els, geo);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const g = gestureRef.current;
    gestureRef.current = null;
    isUserInteractingRef.current = false;

    if (!g) return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (g.state !== "dragging" || g.targetIndex === -1) {
      if (heroMotionStateRef.current === "dragging") {
        heroMotionStateRef.current = "settled";
        setPortalActive(false);
        const els = getPortalElements();
        if (els) resetPortalStyles(els);
        scheduleAutoplay(8.0);
      }
      return;
    }

    const els = getPortalElements();
    if (!els || !currentGeoRef.current) {
      heroMotionStateRef.current = "settled";
      setPortalActive(false);
      scheduleAutoplay(8.0);
      return;
    }

    // Commit threshold: 50px distance OR >= 0.40px/ms velocity
    const dx = e.clientX - g.startX;
    const dt = Math.max(1, performance.now() - g.startTime);
    const velocityX = Math.abs(dx / dt);
    const absDist = Math.abs(dx);

    const shouldCommit = absDist >= 50 || velocityX >= 0.40 || g.currentProgress >= 0.36;

    if (shouldCommit) {
      transitionDestination(g.targetIndex, "swipe", g.lockedDirection || undefined);
    } else {
      animatePortalCancel(els, currentGeoRef.current, () => {
        setPortalActive(false);
        heroMotionStateRef.current = "settled";
        scheduleAutoplay(8.0);
      });
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isIntroCompleteRef.current || isScrollLockedRef.current || isSheetOpenRef.current) return;
      if (heroMotionStateRef.current === "transitioning" || heroMotionStateRef.current === "dragging") return;

      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.tagName === "SELECT")) return;

      if (e.key === "ArrowLeft") {
        const nextIdx = (activeDestIndexRef.current + 1) % destinations.length;
        transitionDestination(nextIdx, "keyboard", "west");
      } else if (e.key === "ArrowRight") {
        const prevIdx = (activeDestIndexRef.current - 1 + destinations.length) % destinations.length;
        transitionDestination(prevIdx, "keyboard", "east");
      } else if (e.key === "ArrowUp") {
        const targetIdx = destinations.findIndex((d) => d.direction === "north");
        if (targetIdx !== -1 && targetIdx !== activeDestIndexRef.current) {
          transitionDestination(targetIdx, "keyboard", "north");
        }
      } else if (e.key === "ArrowDown") {
        const targetIdx = destinations.findIndex((d) => d.direction === "south");
        if (targetIdx !== -1 && targetIdx !== activeDestIndexRef.current) {
          transitionDestination(targetIdx, "keyboard", "south");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [transitionDestination]);

  // Phase 1 Master Intro Effect & Initial Proactive Decode
  useLayoutEffect(() => {
    if (!root.current) return;

    prefersReducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Decode Kashmir proactively during gate intro
    decodeImage(`${assetBase}/hero-kashmir.webp`);

    const isTestMode = window.location.search.includes("test=1");
    let alreadySeen = false;
    if (!isTestMode) {
      try {
        alreadySeen = sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
      } catch {
        alreadySeen = false;
      }
    }

    const viewportWidth = window.innerWidth || 390;
    const gateCal = calculateGateCalibration(viewportWidth);

    const ctx = gsap.context(() => {
      const refs: HeroMotionRefs = {
        introContainer: introContainer.current!,
        introBrandWrap: introBrandWrap.current!,
        introFlame: introFlame.current!,
        introFlameStrokes: [
          introFlameStroke1.current!,
          introFlameStroke2.current!,
          introFlameStroke3.current!,
          introFlameStroke4.current!,
          introFlameStroke5.current!,
        ].filter(Boolean),
        introSjh: introSjh.current!,
        introName: introName.current!,
        introPrompt: introPrompt.current!,
        header: header.current!,
        seamWrap: seamWrap.current!,
        seamCore: seamCore.current!,
        seamGlow: seamGlow.current!,
        seamBloom: seamBloom.current!,
        doorsContainer: doorsContainer.current!,
        gateVeil: gateVeil.current!,
        leftDoor: leftDoor.current!,
        rightDoor: rightDoor.current!,
        leftGlow: leftGlow.current!,
        rightGlow: rightGlow.current!,
        seamShadow: seamShadow.current!,
        portalBloom: portalBloom.current!,
        background: background.current!,
        location: location.current!,
        titleLines: [title1.current!, title2.current!],
        subhead: subhead.current!,
        support: support.current!,
        dock: dock.current!,
        pagination: compassNav.current!,
      };

      const required = [
        refs.introContainer,
        refs.introBrandWrap,
        refs.introFlame,
        refs.introSjh,
        refs.introName,
        refs.introPrompt,
        refs.header,
        refs.seamWrap,
        refs.seamCore,
        refs.seamGlow,
        refs.seamBloom,
        refs.doorsContainer,
        refs.gateVeil,
        refs.leftDoor,
        refs.rightDoor,
        refs.leftGlow,
        refs.rightGlow,
        refs.seamShadow,
        refs.portalBloom,
        refs.background,
        refs.location,
        refs.titleLines[0],
        refs.titleLines[1],
        refs.support,
        refs.dock,
        refs.pagination,
      ];
      if (required.some((node) => !node)) return;

      if (prefersReducedMotionRef.current || alreadySeen) {
        setHeroSettled(refs, gateCal);
        setIsIntroComplete(true);
        isIntroCompleteRef.current = true;
        heroMotionStateRef.current = "settled";

        // Progressively decode remaining hero images
        scheduleProgressiveDecode([
          `${assetBase}/hero-rajasthan.webp`,
          `${assetBase}/hero-kerala.webp`,
        ], 600, 300);

        if (!prefersReducedMotionRef.current) {
          scheduleAutoplayRef.current(AUTOPLAY_DWELL_SECONDS);
        }
        return;
      }

      heroMotionStateRef.current = "intro";
      const tl = createHeroIntro(refs, gateCal, () => {
        setIsIntroComplete(true);
        isIntroCompleteRef.current = true;
        heroMotionStateRef.current = "settled";
        try {
          sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
        } catch {}

        // Decode remaining images after intro settles
        scheduleProgressiveDecode([
          `${assetBase}/hero-rajasthan.webp`,
          `${assetBase}/hero-kerala.webp`,
        ], 800, 400);

        scheduleAutoplayRef.current(AUTOPLAY_DWELL_SECONDS);
      });
      timelineRef.current = tl;

      // Deterministic testing interface on window
      const win = window as any;
      win.__SJH_HERO_TIMELINE__ = tl;
      win.__SJH_SEEK__ = (t: number) => tl.pause(t);
      win.__SJH_SET_SETTLED__ = () => {
        timelineRef.current?.kill();
        setHeroSettled(refs, gateCal);
        setIsIntroComplete(true);
        isIntroCompleteRef.current = true;
        heroMotionStateRef.current = "settled";
        scheduleAutoplayRef.current(AUTOPLAY_DWELL_SECONDS);
      };
      win.__SJH_GET_SLIVER_PX__ = () => {
        const leftImg = root.current?.querySelector(".sjhHero__door--left");
        const rightImg = root.current?.querySelector(".sjhHero__door--right");
        if (!leftImg || !rightImg) return { left: 0, right: 0 };
        const leftRect = leftImg.getBoundingClientRect();
        const rightRect = rightImg.getBoundingClientRect();
        return {
          left: Number(leftRect.right.toFixed(2)),
          right: Number((window.innerWidth - rightRect.left).toFixed(2)),
        };
      };

      // 4-Way Portal deterministic testing hook
      win.__SJH_PORTAL_DRAG_4WAY__ = (dir: Direction, progress: number, x?: number, y?: number) => {
        const viewportWidth = root.current?.clientWidth || 390;
        const viewportHeight = root.current?.clientHeight || 844;
        const px = x !== undefined ? x : viewportWidth * 0.5;
        const py = y !== undefined ? y : viewportHeight * 0.5;

        const targetDest = getDestinationByDirection(dir);
        const targetIdx = destinations.findIndex((d) => d.id === targetDest.id);

        incomingDestIndexRef.current = targetIdx;
        setIncomingDestIndex(targetIdx);
        setPortalActive(true);

        if (portalImgRef.current) {
          portalImgRef.current.src = `${assetBase}/${targetDest.image}`;
        }

        const geo = calculatePortalGeometry(progress, px, py, viewportWidth, viewportHeight, dir);
        currentGeoRef.current = geo;

        const els = getPortalElements();
        if (els) applyPortalStyles(els, geo);
      };

      // Sequential swipe portal drag testing hook
      win.__SJH_PORTAL_DRAG__ = (progress: number, x?: number, y?: number, targetId?: string) => {
        let targetIdx = (activeDestIndexRef.current + 1) % destinations.length;
        if (targetId) {
          const found = destinations.findIndex((d) => d.id === targetId);
          if (found !== -1) targetIdx = found;
        }
        const targetDest = destinations[targetIdx];
        const viewportWidth = root.current?.clientWidth || 390;
        const viewportHeight = root.current?.clientHeight || 844;
        const px = x !== undefined ? x : viewportWidth * 0.4;
        const py = y !== undefined ? y : viewportHeight * 0.5;

        incomingDestIndexRef.current = targetIdx;
        setIncomingDestIndex(targetIdx);
        setPortalActive(true);

        if (portalImgRef.current) {
          portalImgRef.current.src = `${assetBase}/${targetDest.image}`;
        }

        const geo = calculatePortalGeometry(progress, px, py, viewportWidth, viewportHeight, "west");
        currentGeoRef.current = geo;

        const els = getPortalElements();
        if (els) applyPortalStyles(els, geo);
      };

      win.__SJH_PORTAL_COMMIT__ = () => {
        transitionDestination(incomingDestIndexRef.current, "swipe");
      };

      win.__SJH_PORTAL_CANCEL__ = () => {
        const viewportWidth = root.current?.clientWidth || 390;
        const viewportHeight = root.current?.clientHeight || 844;
        const geo =
          currentGeoRef.current ||
          calculatePortalGeometry(0.2, viewportWidth * 0.5, viewportHeight * 0.5, viewportWidth, viewportHeight);
        const els = getPortalElements();
        if (els) {
          animatePortalCancel(els, geo, () => {
            setPortalActive(false);
            heroMotionStateRef.current = "settled";
          });
        }
      };

      win.__SJH_PORTAL_SET_DESTINATION__ = (id: "puri" | "kashmir" | "rajasthan" | "kerala") => {
        const targetIdx = destinations.findIndex((d) => d.id === id);
        if (targetIdx === -1) return;
        transitionDestination(targetIdx, "compass");
      };

      win.__SJH_GET_DESTINATION__ = () => {
        return destinations[activeDestIndexRef.current].id;
      };

      win.__SJH_GET_PORTAL_STATE__ = () => {
        return heroMotionStateRef.current;
      };

      win.__SJH_GET_MOTION_STATE__ = () => {
        return heroMotionStateRef.current;
      };

      win.__SJH_AUTOPLAY_PAUSE__ = () => {
        killAutoplayTimer();
        setIsAutoplayManuallyPaused(true);
      };

      win.__SJH_AUTOPLAY_RESUME__ = () => {
        setIsAutoplayManuallyPaused(false);
        scheduleAutoplayRef.current(1.0);
      };

      win.__SJH_TRIGGER_AUTOPLAY_NEXT__ = () => {
        const nextIdx = (activeDestIndexRef.current + 1) % destinations.length;
        transitionDestination(nextIdx, "auto");
      };
    }, root);

    return () => {
      timelineRef.current?.kill();
      killAutoplayTimer();
      ctx.revert();
    };
  }, [assetBase, killAutoplayTimer, transitionDestination, getPortalElements]);

  // Viewport suspension via IntersectionObserver: pauses autoplay offscreen
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && entry.intersectionRatio > 0.08;
        isSuspendedRef.current = !inView;
        if (!inView) {
          killAutoplayTimer();
          if (heroMotionStateRef.current === "auto-wait" || heroMotionStateRef.current === "settled") {
            heroMotionStateRef.current = "suspended";
          }
        } else {
          if (heroMotionStateRef.current === "suspended") {
            heroMotionStateRef.current = "settled";
            scheduleAutoplay(8.0);
          }
        }
      },
      { threshold: [0, 0.08, 0.5] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [killAutoplayTimer, scheduleAutoplay]);

  // Page visibilitychange listener: pauses autoplay when tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        killAutoplayTimer();
      } else {
        if (canAutoplay()) {
          scheduleAutoplay(AUTOPLAY_DWELL_SECONDS);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [killAutoplayTimer, canAutoplay, scheduleAutoplay]);

  // Expose Phase 3 Journey Planner deterministic testing hooks
  useEffect(() => {
    const win = window as any;
    win.__SJH_HERO_CARD_SEEK__ = (progress: number) => plannerRef.current?.seek(progress);
    win.__SJH_SHOW_HERO_CARD__ = () => plannerRef.current?.showCard();
    win.__SJH_HIDE_HERO_CARD__ = () => plannerRef.current?.hideCard();
    win.__SJH_IS_HERO_CARD_VISIBLE__ = () => plannerRef.current?.isCardVisible() ?? bookingCardVisible;
    if (!win.__SJH_GET_DRAFT__) {
      win.__SJH_GET_DRAFT__ = () => plannerRef.current?.getDraft();
    }
  }, [bookingCardVisible]);

  // Phase 4: Master Scroll Transition Effect (Cinema -> Magazine)
  useEffect(() => {
    if (!isIntroComplete) return;

    if (
      !trackRef.current ||
      !pinRef.current ||
      !cardStageRef.current ||
      !background.current ||
      !doorsContainer.current ||
      !dock.current ||
      !compassNav.current ||
      !copyContainerRef.current ||
      !header.current ||
      !ivoryCanvasRef.current ||
      !editorialIntroRef.current ||
      !editorialMetaRef.current
    ) {
      return;
    }

    const refs = {
      track: trackRef.current,
      pinTarget: pinRef.current,
      cardStage: cardStageRef.current,
      cardImg: background.current,
      doors: doorsContainer.current,
      dock: dock.current,
      compassNav: compassNav.current,
      heroCopy: copyContainerRef.current,
      header: header.current,
      ivoryCanvas: ivoryCanvasRef.current,
      editorialIntro: editorialIntroRef.current,
      editorialMeta: editorialMetaRef.current,
    };

    const handle = createHeroScrollTransition(refs, {
      onProgress: (p) => {
        scrollProgressRef.current = p;
        if (p > 0.02) {
          killAutoplayTimer();
          if (heroMotionStateRef.current === "auto-wait" || heroMotionStateRef.current === "settled") {
            heroMotionStateRef.current = "leaving-hero";
          }
        } else if (p <= 0.01 && heroMotionStateRef.current === "leaving-hero") {
          heroMotionStateRef.current = "settled";
          scheduleAutoplay(8.0);
        }
      },
      onLockChange: (locked) => {
        isScrollLockedRef.current = locked;
        setIsScrollLocked(locked);
      },
    });
    scrollTransitionRef.current = handle;

    const win = window as any;
    win.__SJH_SCROLL_SEEK__ = (p: number) => {
      handle.seek(p);
      scrollProgressRef.current = p;
      const locked = p > 0.04;
      isScrollLockedRef.current = locked;
      setIsScrollLocked(locked);
    };
    win.__SJH_GET_SCROLL_PROGRESS__ = () => scrollProgressRef.current;

    return () => {
      handle.kill();
      scrollTransitionRef.current = null;
      delete win.__SJH_SCROLL_SEEK__;
      delete win.__SJH_GET_SCROLL_PROGRESS__;
    };
  }, [isIntroComplete, killAutoplayTimer, scheduleAutoplay]);

  return (
    <div ref={trackRef} className="sjhHeroTrack">
      <div ref={pinRef} className="sjhHeroPin">
        <section
          ref={root}
          className="sjhHero"
          aria-label="Shree Jagannath Holidays - Luxury Sacred Journeys"
          onClick={!isIntroComplete ? handleHeroTap : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Warm Ivory Canvas */}
          <div ref={ivoryCanvasRef} className="sjhEditorial__canvas" aria-hidden="true" />

          {/* Editorial Section Intro: Arrives above the card */}
          <div ref={editorialIntroRef} className="sjhEditorial__intro" aria-hidden="true">
            <span className="sjhEditorial__introEyebrow">What are you looking for?</span>
            <h2 className="sjhEditorial__introTitle">
              <span className="sjhEditorial__introSub">Not destinations.</span>
              <span className="sjhEditorial__introMain">A feeling.</span>
            </h2>
          </div>

          {/* Continuous Card Stage: Holds the active photographic world */}
          <div ref={cardStageRef} className="sjhHero__cardStage">
            {/* Background revealed base image (Current Active Destination) */}
            <img
              ref={background}
              className="sjhHero__bg sjhHero__destBase"
              src={`${assetBase}/${currentDest.image}`}
              alt={currentDest.location}
              aria-hidden="true"
            />

            {/* Circular Destination Portal Layer (Reveals incoming destination inside circle) */}
            <div
              ref={portalWrapRef}
              className={`sjhHero__destPortal ${portalActive ? "is-active" : ""}`}
              aria-hidden="true"
            >
              <img
                ref={portalImgRef}
                className="sjhHero__destPortalImg"
                src={`${assetBase}/${incomingDest.image}`}
                alt={incomingDest.location}
              />
            </div>

            {/* Subtle 1px warm ivory/gold edge ring with soft bloom */}
            <div
              ref={portalRingRef}
              className={`sjhHero__portalRing ${portalActive ? "is-active" : ""}`}
              aria-hidden="true"
            />

            {/* Directional Portal Micro-Cue */}
            <div ref={portalCueRef} className="sjhHero__portalCue" aria-hidden="true">
              <span className="sjhHero__portalCueDir">{incomingDest.compassDir}</span>
              <span className="sjhHero__portalCueLabel">{incomingDest.compassLabel}</span>
            </div>

            {/* Sacred portal bloom overlay */}
            <div ref={portalBloom} className="sjhHero__portalBloom" aria-hidden="true" />

            {/* Localized photographic contrast shade */}
            <div className="sjhHero__shade" aria-hidden="true" />
          </div>

          {/* Editorial Feeling Details: Arrives below the card */}
          <div ref={editorialMetaRef} className="sjhEditorial__meta" aria-hidden="true">
            <span className="sjhEditorial__metaEyebrow">{currentDest.editorial.eyebrow}</span>
            <h3 className="sjhEditorial__metaTitle">
              {Array.isArray(currentDest.editorial.title)
                ? currentDest.editorial.title.join(" ")
                : currentDest.editorial.title}
            </h3>
            <p className="sjhEditorial__metaDesc">{currentDest.editorial.description}</p>
          </div>

          {/* Three-Layer Synchronized Golden Seam */}
          <div ref={seamWrap} className="sjhHero__seam" aria-hidden="true">
            <div ref={seamBloom} className="sjhHero__seamBloom">
              <img src={`${assetBase}/light-crack.webp`} alt="" />
            </div>
            <div ref={seamGlow} className="sjhHero__seamGlow" />
            <div ref={seamCore} className="sjhHero__seamCore" />
          </div>

          {/* Ceremonial Carved Doors */}
          <div ref={doorsContainer} className="sjhHero__doors" aria-hidden="true">
            <div ref={leftDoor} className="sjhHero__doorWrap sjhHero__doorWrap--left">
              <img
                className="sjhHero__door sjhHero__door--left"
                src={`${assetBase}/door-left.webp`}
                alt=""
              />
              <div className="sjhHero__doorThickness sjhHero__doorThickness--left" />
              <div ref={leftGlow} className="sjhHero__doorGlow sjhHero__doorGlow--left" />
            </div>

            <div ref={rightDoor} className="sjhHero__doorWrap sjhHero__doorWrap--right">
              <img
                className="sjhHero__door sjhHero__door--right"
                src={`${assetBase}/door-right.webp`}
                alt=""
              />
              <div className="sjhHero__doorThickness sjhHero__doorThickness--right" />
              <div ref={rightGlow} className="sjhHero__doorGlow sjhHero__doorGlow--right" />
            </div>

            <div ref={seamShadow} className="sjhHero__seamShadow" />
            <div ref={gateVeil} className="sjhHero__gateVeil" />
          </div>

          {/* UI Elements Layer */}
          <div className="sjhHero__ui">
            {/* Centered Intro Brand (SVG Draw & Explore Prompt in Black Space) */}
            <div
              ref={introContainer}
              className="sjhHero__intro"
              aria-hidden={isIntroComplete}
            >
              <div ref={introBrandWrap} className="sjhHero__introBrandWrap">
                <svg
                  className="sjhHero__introLogoSvg"
                  width="240"
                  height="180"
                  viewBox="0 0 240 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Shree Jagannath Holidays"
                >
                  <defs>
                    <linearGradient
                      id="g-sjh-intro"
                      x1="62"
                      y1="8"
                      x2="176"
                      y2="150"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#F7DE98" />
                      <stop offset="0.48" stopColor="#D6A64F" />
                      <stop offset="1" stopColor="#9A6926" />
                    </linearGradient>
                    <linearGradient
                      id="g-sjh-stroke"
                      x1="80"
                      y1="10"
                      x2="160"
                      y2="90"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FFF2C6" />
                      <stop offset="1" stopColor="#D6A64F" />
                    </linearGradient>
                  </defs>

                  <g className="sjhHero__introFlameStrokes">
                    <path
                      ref={introFlameStroke1}
                      d="M120 12C110 30 111 46 120 59C129 46 130 30 120 12Z"
                      stroke="url(#g-sjh-stroke)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      ref={introFlameStroke2}
                      d="M102 32C98 52 105 66 120 77C119 59 113 44 102 32Z"
                      stroke="url(#g-sjh-stroke)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      ref={introFlameStroke3}
                      d="M138 32C142 52 135 66 120 77C121 59 127 44 138 32Z"
                      stroke="url(#g-sjh-stroke)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      ref={introFlameStroke4}
                      d="M89 54C91 72 101 83 120 88C112 72 101 61 89 54Z"
                      stroke="url(#g-sjh-stroke)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      ref={introFlameStroke5}
                      d="M151 54C149 72 139 83 120 88C128 72 139 61 151 54Z"
                      stroke="url(#g-sjh-stroke)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <circle
                      cx="120"
                      cy="77"
                      r="3.5"
                      stroke="url(#g-sjh-stroke)"
                      strokeWidth="1.4"
                      fill="none"
                    />
                  </g>

                  <g ref={introFlame} className="sjhHero__introFlame" style={{ display: "none" }}>
                    <path
                      d="M120 12C110 30 111 46 120 59C129 46 130 30 120 12Z"
                      fill="url(#g-sjh-intro)"
                    />
                  </g>

                  <text
                    ref={introSjh}
                    className="sjhHero__introSjh"
                    x="120"
                    y="132"
                    textAnchor="middle"
                    fill="url(#g-sjh-intro)"
                    fontFamily="Cormorant Garamond, Georgia, serif"
                    fontSize="62"
                    fontWeight="500"
                    letterSpacing="-2"
                  >
                    SJH
                  </text>

                  <g ref={introName} className="sjhHero__introName">
                    <text
                      x="120"
                      y="155"
                      textAnchor="middle"
                      fill="#F6E9CC"
                      fontFamily="Manrope, Arial, sans-serif"
                      fontSize="8.5"
                      fontWeight="600"
                      letterSpacing="3.4"
                    >
                      SHREE JAGANNATH
                    </text>
                    <text
                      x="120"
                      y="169"
                      textAnchor="middle"
                      fill="#F6E9CC"
                      fontFamily="Manrope, Arial, sans-serif"
                      fontSize="8.5"
                      fontWeight="600"
                      letterSpacing="4.2"
                    >
                      HOLIDAYS
                    </text>
                  </g>
                </svg>
              </div>

              <div ref={introPrompt} className="sjhHero__introPrompt">
                <span className="sjhHero__introLine" />
                <span>{heroCopy.introPrompt}</span>
              </div>
            </div>

            {/* Settled Mobile Header - Portaled to document.body for persistent coverage */}
            {typeof document !== "undefined" && !isInternalPageOpen &&
              createPortal(
                <header
                  ref={header}
                  className={`sjhHero__header ${isScrolled ? "is-scrolled" : ""} ${
                    isDarkTheme ? "is-dark-theme" : isEditorialTheme ? "is-editorial" : ""
                  }`}
                  aria-hidden={isSheetOpen ? "true" : undefined}
                >
                  <a
                    className="sjhHero__home"
                    href={homeHref}
                    aria-label="Shree Jagannath Holidays — Home"
                    onClick={(e) => {
                      if (window.scrollY > 120) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    tabIndex={isSheetOpen ? -1 : 0}
                  >
                    <img
                      className="sjhHero__logo"
                      src={`${assetBase}/sjh-logo.svg`}
                      alt="SJH Logo"
                    />
                  </a>
                  <button
                    className="sjhHero__menu"
                    type="button"
                    onClick={onOpenMenu}
                    aria-label="Open menu"
                    tabIndex={isSheetOpen ? -1 : 0}
                    disabled={isSheetOpen}
                  >
                    <img src={`${assetBase}/menu.svg`} alt="" aria-hidden="true" />
                  </button>
                </header>,
                document.body
              )}

            {/* Hero Editorial Copy */}
            <div ref={copyContainerRef} className="sjhHero__copy">
              <div ref={location} className="sjhHero__location">
                <span>{currentDest.location}</span>
                <span className="sjhHero__locationLine" aria-hidden="true" />
              </div>

              <h1 className="sjhHero__title" aria-label={currentDest.title1}>
                <div className="sjhHero__mask">
                  <span ref={title1}>{currentDest.title1}</span>
                </div>
                <div className="sjhHero__mask">
                  <span ref={title2}>
                    {currentDest.title2Prefix}
                    <span className="sjhHero__accent">{currentDest.title2Accent}</span>
                  </span>
                </div>
              </h1>

              {currentDest.sub1 && (
                <div ref={subhead} className="sjhHero__sub">
                  <div>{currentDest.sub1}</div>
                  <div>{currentDest.sub2}</div>
                </div>
              )}

              <div ref={support} className="sjhHero__support">
                <div className="sjhHero__rule" />
                <div>{currentDest.support1}</div>
                <div>{currentDest.support2}</div>
              </div>
            </div>

            {/* Phase 3: Visual Backdrop Veil behind morphing planner */}
            <div
              ref={veilRef}
              className="sjhHero__veil"
              aria-hidden="true"
            />

            {/* Phase 3: Settled Journey Dock & Planner Shell */}
            <JourneyDockPlanner
              ref={plannerRef}
              dockRef={dock}
              activeDestination={currentDest.id}
              assetBase={assetBase}
              isIntroComplete={isIntroComplete}
              draft={draft}
              onDraftChange={onDraftChange}
              step={step}
              onStepChange={onStepChange}
              onPromoteToSheet={(focusField) => {
                if (onOpenPlannerSheet) {
                  onOpenPlannerSheet({ focusField, step });
                } else if (onPlanJourney) {
                  onPlanJourney();
                }
              }}
              onContinueToSheet={() => {
                const nextStep = step === 1 ? 2 : step;
                onStepChange?.(nextStep);
                if (onOpenPlannerSheet) {
                  onOpenPlannerSheet({ step: nextStep });
                } else if (onPlanJourney) {
                  onPlanJourney();
                }
              }}
              onFormTouch={markPlannerInteraction}
              onDestinationTouch={() => {
                onDestinationTouched?.();
                markPlannerInteraction();
              }}
              onDropdownStateChange={(isOpen) => {
                setIsDestDropdownOpen(isOpen);
                if (isOpen) {
                  killAutoplayTimer();
                  isUserInteractingRef.current = true;
                } else {
                  markPlannerInteraction();
                }
              }}
              onCardVisibleChange={(visible) => {
                setBookingCardVisible(visible);
              }}
              onCreateJourney={onCreateJourney}
              backgroundRef={background}
              headerRef={header}
              compassNavRef={compassNav}
              veilRef={veilRef}
            />

            {/* Spatial Cardinal Compass & Slideshow Autoplay Pause Control */}
            <nav
              ref={compassNav}
              className="sjhHero__compassNav"
              aria-label="Destination compass navigation"
              aria-hidden={isSheetOpen ? "true" : undefined}
            >
              <div className="sjhHero__compassRing">
                <button
                  type="button"
                  className={`sjhHero__compassPoint sjhHero__compassPoint--north ${currentDest.direction === "north" ? "is-active" : ""}`}
                  onClick={() => handleCompassTap("north")}
                  aria-label="Go to Kashmir (North)"
                  aria-current={currentDest.direction === "north" ? "true" : undefined}
                  tabIndex={isSheetOpen || isScrollLocked || isDestDropdownOpen ? -1 : 0}
                  disabled={isSheetOpen || isScrollLocked || isDestDropdownOpen}
                >
                  <span className="sjhHero__compassLabel">N</span>
                  <span className="sjhHero__compassDot" />
                </button>

                <button
                  type="button"
                  className={`sjhHero__compassPoint sjhHero__compassPoint--east ${currentDest.direction === "east" ? "is-active" : ""}`}
                  onClick={() => handleCompassTap("east")}
                  aria-label="Go to Puri (East)"
                  aria-current={currentDest.direction === "east" ? "true" : undefined}
                  tabIndex={isSheetOpen || isScrollLocked || isDestDropdownOpen ? -1 : 0}
                  disabled={isSheetOpen || isScrollLocked || isDestDropdownOpen}
                >
                  <span className="sjhHero__compassDot" />
                  <span className="sjhHero__compassLabel">E</span>
                </button>

                <button
                  type="button"
                  className={`sjhHero__compassPoint sjhHero__compassPoint--south ${currentDest.direction === "south" ? "is-active" : ""}`}
                  onClick={() => handleCompassTap("south")}
                  aria-label="Go to Kerala (South)"
                  aria-current={currentDest.direction === "south" ? "true" : undefined}
                  tabIndex={isSheetOpen || isScrollLocked || isDestDropdownOpen ? -1 : 0}
                  disabled={isSheetOpen || isScrollLocked || isDestDropdownOpen}
                >
                  <span className="sjhHero__compassDot" />
                  <span className="sjhHero__compassLabel">S</span>
                </button>

                <button
                  type="button"
                  className={`sjhHero__compassPoint sjhHero__compassPoint--west ${currentDest.direction === "west" ? "is-active" : ""}`}
                  onClick={() => handleCompassTap("west")}
                  aria-label="Go to Rajasthan (West)"
                  aria-current={currentDest.direction === "west" ? "true" : undefined}
                  tabIndex={isSheetOpen || isScrollLocked || isDestDropdownOpen ? -1 : 0}
                  disabled={isSheetOpen || isScrollLocked || isDestDropdownOpen}
                >
                  <span className="sjhHero__compassLabel">W</span>
                  <span className="sjhHero__compassDot" />
                </button>

                <div className="sjhHero__compassCenter" aria-hidden="true">
                  <span className="sjhHero__compassJewel" />
                </div>
              </div>

              <div className="sjhHero__compassInfo" aria-hidden="true">
                {/* Autoplay Pause / Resume Control */}
                <button
                  type="button"
                  className="sjhHero__autoplayBtn"
                  onClick={toggleAutoplayPause}
                  aria-label={
                    isAutoplayManuallyPaused
                      ? "Resume destination slideshow"
                      : "Pause destination slideshow"
                  }
                  tabIndex={isSheetOpen || isScrollLocked || isDestDropdownOpen ? -1 : 0}
                  disabled={isSheetOpen || isScrollLocked || isDestDropdownOpen}
                >
                  <span className="sjhHero__autoplayBtnIcon">
                    {isAutoplayManuallyPaused ? (
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                        <polygon points="2,1 9,5 2,9" />
                      </svg>
                    ) : (
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                        <rect x="2" y="1.5" width="2" height="7" rx="0.5" />
                        <rect x="6" y="1.5" width="2" height="7" rx="0.5" />
                      </svg>
                    )}
                  </span>
                </button>
                <span className="sjhHero__compassDirBadge">{currentDest.compassDir}</span>
                <span className="sjhHero__compassWorldName">{currentDest.compassLabel}</span>
              </div>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
