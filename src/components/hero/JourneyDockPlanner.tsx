import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import {
  JourneyDraft,
  PlannerState,
  createDefaultDraft,
} from "./plannerData";
import {
  createPlannerOpenTimeline,
  createPlannerCloseTimeline,
  setPlannerOpenReducedMotion,
  setPlannerClosedReducedMotion,
  PlannerMotionRefs,
} from "./plannerMotion";
import { heroCopy } from "./heroData";
import { JourneyPlannerFlow } from "../planner/JourneyPlannerFlow";

export interface JourneyDockPlannerHandle {
  open: () => void;
  close: () => void;
  getState: () => PlannerState;
  getDraft: () => JourneyDraft;
  setField: <K extends keyof JourneyDraft>(field: K, value: JourneyDraft[K]) => void;
  seek: (progress: number) => void;
}

interface JourneyDockPlannerProps {
  dockRef?: React.RefObject<HTMLDivElement>;
  activeDestination: string;
  assetBase?: string;
  isIntroComplete: boolean;
  isPortalActive: boolean;
  onOpenStateChange?: (state: PlannerState) => void;
  onCreateJourney?: (draft: JourneyDraft) => void;
  backgroundRef: React.RefObject<HTMLImageElement>;
  headerRef: React.RefObject<HTMLElement>;
  compassNavRef: React.RefObject<HTMLElement>;
  veilRef: React.RefObject<HTMLDivElement>;
}

export const JourneyDockPlanner = forwardRef<JourneyDockPlannerHandle, JourneyDockPlannerProps>(
  function JourneyDockPlanner(
    {
      dockRef,
      activeDestination,
      assetBase = "/assets/sjh-hero",
      isIntroComplete,
      isPortalActive,
      onOpenStateChange,
      onCreateJourney,
      backgroundRef,
      headerRef,
      compassNavRef,
      veilRef,
    },
    ref
  ) {
    const shellRef = useRef<HTMLDivElement>(null);
    const setShellRef = useCallback(
      (node: HTMLDivElement | null) => {
        (shellRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (dockRef) {
          (dockRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [dockRef]
    );

    const dockCollapsedRef = useRef<HTMLButtonElement>(null);
    const dockExpandedRef = useRef<HTMLDivElement>(null);
    const plannerHeaderRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const flowContainerRef = useRef<HTMLDivElement>(null);
    const dummyCtaRef = useRef<HTMLDivElement>(null);

    // Active GSAP Timeline
    const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

    // Planner State Machine
    const [plannerState, setPlannerState] = useState<PlannerState>("closed");
    const plannerStateRef = useRef<PlannerState>("closed");
    plannerStateRef.current = plannerState;

    // Track user edits
    const isDirtyRef = useRef(false);

    // Journey draft data
    const [draft, setDraft] = useState<JourneyDraft>(() => createDefaultDraft(activeDestination));
    const draftRef = useRef<JourneyDraft>(draft);
    draftRef.current = draft;

    // Notify state changes
    const updateState = useCallback(
      (newState: PlannerState) => {
        setPlannerState(newState);
        onOpenStateChange?.(newState);
      },
      [onOpenStateChange]
    );

    // Synchronize destination with hero when untouched
    useEffect(() => {
      if (!isDirtyRef.current) {
        setDraft((prev) => ({
          ...prev,
          destination: activeDestination,
        }));
      }
    }, [activeDestination]);

    // Body scroll locking
    const unlockBodyScroll = useCallback(() => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("sjh-scroll-locked");
        document.body.classList.remove("sjh-scroll-locked");
      }
    }, []);

    useEffect(() => {
      const isLocked = plannerState === "open" || plannerState === "opening";
      if (typeof document !== "undefined") {
        if (isLocked) {
          document.documentElement.classList.add("sjh-scroll-locked");
          document.body.classList.add("sjh-scroll-locked");
        } else {
          unlockBodyScroll();
        }
      }
      return () => {
        unlockBodyScroll();
      };
    }, [plannerState, unlockBodyScroll]);

    // Responsive height target
    const calculateExpandedHeight = useCallback(() => {
      const vh = window.innerHeight || 844;
      const target = Math.round(vh * 0.74);
      return Math.min(Math.max(480, target), 620);
    }, []);

    // Motion refs for GSAP
    const getMotionRefs = useCallback((): PlannerMotionRefs | null => {
      if (
        !shellRef.current ||
        !dockCollapsedRef.current ||
        !dockExpandedRef.current ||
        !plannerHeaderRef.current ||
        !backgroundRef.current ||
        !headerRef.current ||
        !compassNavRef.current ||
        !veilRef.current
      ) {
        return null;
      }

      return {
        shell: shellRef.current,
        dockCollapsed: dockCollapsedRef.current,
        dockExpanded: dockExpandedRef.current,
        header: plannerHeaderRef.current,
        rows: flowContainerRef.current ? [flowContainerRef.current] : [],
        cta: dummyCtaRef.current || dockExpandedRef.current,
        veil: veilRef.current,
        backgroundImg: backgroundRef.current,
        heroHeader: headerRef.current,
        compassNav: compassNavRef.current,
      };
    }, [backgroundRef, headerRef, compassNavRef, veilRef]);

    // Open Morph Action
    const openPlanner = useCallback(() => {
      if (!isIntroComplete || isPortalActive || plannerStateRef.current !== "closed") {
        return;
      }

      activeTimelineRef.current?.kill();
      updateState("opening");

      const refs = getMotionRefs();
      if (!refs) {
        updateState("open");
        return;
      }

      const expandedH = calculateExpandedHeight();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        setPlannerOpenReducedMotion(refs, expandedH);
        updateState("open");
        closeBtnRef.current?.focus();
        return;
      }

      const tl = createPlannerOpenTimeline(refs, expandedH, () => {
        updateState("open");
        closeBtnRef.current?.focus();
      });
      activeTimelineRef.current = tl;
    }, [isIntroComplete, isPortalActive, updateState, getMotionRefs, calculateExpandedHeight]);

    // Close Reverse Morph Action
    const closePlanner = useCallback(() => {
      if (
        plannerStateRef.current === "closed" ||
        plannerStateRef.current === "closing"
      ) {
        return;
      }

      activeTimelineRef.current?.kill();
      updateState("closing");
      unlockBodyScroll();

      const refs = getMotionRefs();
      if (!refs) {
        updateState("closed");
        dockCollapsedRef.current?.focus();
        return;
      }

      const collapsedH = window.innerHeight <= 820 ? 72 : 78;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        setPlannerClosedReducedMotion(refs, collapsedH);
        updateState("closed");
        dockCollapsedRef.current?.focus();
        return;
      }

      const tl = createPlannerCloseTimeline(refs, collapsedH, () => {
        updateState("closed");
        dockCollapsedRef.current?.focus();
      });
      activeTimelineRef.current = tl;
    }, [updateState, getMotionRefs, unlockBodyScroll]);

    // Keyboard and window cleanup listeners
    useEffect(() => {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && plannerStateRef.current !== "closed") {
          e.preventDefault();
          closePlanner();
          unlockBodyScroll();
        }
      };

      const handleWindowCleanup = () => {
        if (plannerStateRef.current === "closed") {
          unlockBodyScroll();
        }
      };

      window.addEventListener("keydown", handleGlobalKeyDown);
      window.addEventListener("resize", handleWindowCleanup);
      window.addEventListener("pagehide", unlockBodyScroll);
      window.addEventListener("orientationchange", handleWindowCleanup);

      return () => {
        unlockBodyScroll();
        window.removeEventListener("keydown", handleGlobalKeyDown);
        window.removeEventListener("resize", handleWindowCleanup);
        window.removeEventListener("pagehide", unlockBodyScroll);
        window.removeEventListener("orientationchange", handleWindowCleanup);
      };
    }, [closePlanner, unlockBodyScroll]);

    // Imperative API for Pass B / testing hooks & parent components
    useImperativeHandle(
      ref,
      () => ({
        open: openPlanner,
        close: closePlanner,
        getState: () => plannerStateRef.current,
        getDraft: () => draftRef.current,
        setField: <K extends keyof JourneyDraft>(field: K, value: JourneyDraft[K]) => {
          isDirtyRef.current = true;
          setDraft((prev) => ({ ...prev, [field]: value }));
        },
        seek: (progress: number) => {
          if (!activeTimelineRef.current) {
            const refs = getMotionRefs();
            if (refs) {
              const h = calculateExpandedHeight();
              activeTimelineRef.current = createPlannerOpenTimeline(refs, h);
            }
          }
          if (activeTimelineRef.current) {
            activeTimelineRef.current.pause();
            activeTimelineRef.current.progress(progress);
          }
        },
      }),
      [openPlanner, closePlanner, getMotionRefs, calculateExpandedHeight]
    );

    const isExpandedVisible = plannerState !== "closed";

    return (
      <div
        ref={setShellRef}
        className={`sjhHero__dock ${isExpandedVisible ? "is-open" : ""}`}
      >
        {/* Collapsed Resting Dock View */}
        <button
          ref={dockCollapsedRef}
          type="button"
          className="sjhHero__dockCollapsed"
          onClick={openPlanner}
          aria-label="Book now"
          tabIndex={isExpandedVisible ? -1 : 0}
          aria-hidden={isExpandedVisible}
        >
          <span className="sjhHero__dockIcon" aria-hidden="true">
            <img src={`${assetBase}/compass.svg`} alt="" />
          </span>
          <span className="sjhHero__dockLabel">{heroCopy.dock}</span>
          <span className="sjhHero__dockAction" aria-hidden="true">
            <img src={`${assetBase}/arrow-right.svg`} alt="" />
          </span>
        </button>

        {/* Expanded Morph Planner View */}
        <div
          ref={dockExpandedRef}
          className="sjhHero__dockExpanded"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sjh-planner-title"
          aria-hidden={!isExpandedVisible}
          style={{ overflowY: "auto" }}
        >
          {/* Header */}
          <div ref={plannerHeaderRef} className="sjhHero__plannerHeader">
            <div>
              <h2 id="sjh-planner-title" className="sjhHero__plannerTitle">
                PLAN YOUR JOURNEY
              </h2>
              <div style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#B99455", textTransform: "uppercase", marginTop: "2px" }}>
                Enquiry Concierge
              </div>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              className="sjhHero__plannerClose"
              onClick={closePlanner}
              aria-label="Close journey planner"
              tabIndex={isExpandedVisible ? 0 : -1}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          {/* Upgraded 5-Step Flow Body */}
          <div ref={flowContainerRef} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <JourneyPlannerFlow
              draft={draft}
              onDraftChange={(newDraft) => {
                isDirtyRef.current = true;
                setDraft(newDraft);
              }}
              onClose={closePlanner}
              onComplete={onCreateJourney}
            />
          </div>

          {/* Dummy element for GSAP CTA ref */}
          <div ref={dummyCtaRef} style={{ display: "none" }} aria-hidden="true" />
        </div>
      </div>
    );
  }
);
