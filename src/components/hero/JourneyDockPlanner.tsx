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
import { TransparentEnquiryCard } from "./TransparentEnquiryCard";

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

    // Journey draft data: destination is not auto-filled so user can choose or leave optional
    const [draft, setDraft] = useState<JourneyDraft>(() => ({
      ...createDefaultDraft(activeDestination),
      from: "",
      destination: "",
    }));
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

    // Responsive height target for Transparent Enquiry Card
    const calculateExpandedHeight = useCallback(() => {
      const vh = window.innerHeight || 844;
      if (vh <= 700) {
        return Math.min(Math.max(285, Math.round(vh * 0.42)), 315);
      }
      return Math.min(Math.max(320, Math.round(vh * 0.40)), 355);
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

    // Close Reverse Morph Action (minimizes card back to "Book Now" pill)
    const closePlanner = useCallback(() => {
      if (
        plannerStateRef.current === "closed" ||
        plannerStateRef.current === "closing"
      ) {
        return;
      }

      activeTimelineRef.current?.kill();
      updateState("closing");

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
    }, [updateState, getMotionRefs]);

    // Auto-transition when hero intro animation completes:
    // Morph the "Book Now" pill smoothly into the Transparent Enquiry Card!
    const hasAutoOpenedRef = useRef(false);
    useEffect(() => {
      if (isIntroComplete && !hasAutoOpenedRef.current && plannerStateRef.current === "closed") {
        hasAutoOpenedRef.current = true;
        const timer = setTimeout(() => {
          openPlanner();
        }, 450);
        return () => clearTimeout(timer);
      }
    }, [isIntroComplete, openPlanner]);

    // Keyboard and window cleanup listeners
    useEffect(() => {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && plannerStateRef.current !== "closed") {
          e.preventDefault();
          closePlanner();
        }
      };

      window.addEventListener("keydown", handleGlobalKeyDown);
      return () => {
        window.removeEventListener("keydown", handleGlobalKeyDown);
      };
    }, [closePlanner]);

    // Imperative API for testing hooks & parent components
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
        {/* Collapsed Resting Dock View: "Book Now" pill with compass & gold arrow */}
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

        {/* Expanded Morph View: Luxury Transparent Enquiry Card */}
        <div
          ref={dockExpandedRef}
          className="sjhHero__dockExpanded"
          role="region"
          aria-label="Travel enquiry card"
          aria-hidden={!isExpandedVisible}
        >
          <div ref={plannerHeaderRef} style={{ width: "100%", height: "100%" }}>
            <TransparentEnquiryCard
              draft={draft}
              onDraftChange={(newDraft) => {
                isDirtyRef.current = true;
                setDraft(newDraft);
              }}
              onClose={closePlanner}
              onExploreJourneys={() => {
                const el = document.getElementById("sacred-journeys") || document.getElementById("destinations");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              onPlanMyTrip={(submittedDraft) => {
                isDirtyRef.current = true;
                setDraft(submittedDraft);
                onCreateJourney?.(submittedDraft);
                const win = window as any;
                if (win.__SJH_PLANNER_SET_FIELD__) {
                  win.__SJH_PLANNER_SET_FIELD__("destination", submittedDraft.destination);
                  win.__SJH_PLANNER_SET_FIELD__("from", submittedDraft.from);
                  win.__SJH_PLANNER_SET_FIELD__("source", "hero-enquiry-card");
                }
                if (win.__SJH_PLANNER_OPEN__) {
                  win.__SJH_PLANNER_OPEN__();
                }
              }}
            />
          </div>

          {/* Dummy element for GSAP CTA ref */}
          <div ref={dummyCtaRef} style={{ display: "none" }} aria-hidden="true" />
        </div>
      </div>
    );
  }
);
