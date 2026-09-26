import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";
import {
  DestinationId,
  JourneyDraft,
  PlannerState,
  ActiveFieldSelector,
  FormErrors,
  DESTINATION_DISPLAY_NAMES,
  createDefaultDraft,
  validateJourneyDraft,
} from "./plannerData";
import {
  createPlannerOpenTimeline,
  createPlannerCloseTimeline,
  setPlannerOpenReducedMotion,
  setPlannerClosedReducedMotion,
  PlannerMotionRefs,
} from "./plannerMotion";
import { heroCopy } from "./heroData";

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
  activeDestination: DestinationId;
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
    const ctaBtnRef = useRef<HTMLButtonElement>(null);
    const fromInputRef = useRef<HTMLInputElement>(null);

    // Row element refs for staggered entry animation
    const rowFromRef = useRef<HTMLDivElement>(null);
    const rowDestRef = useRef<HTMLDivElement>(null);
    const rowWhenRef = useRef<HTMLDivElement>(null);
    const rowTravellersRef = useRef<HTMLDivElement>(null);

    // Timeline ref for active morph
    const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

    // State machine
    const [plannerState, setPlannerState] = useState<PlannerState>("closed");
    const plannerStateRef = useRef<PlannerState>("closed");
    plannerStateRef.current = plannerState;

    // Track whether user made manual edits
    const isDirtyRef = useRef(false);

    // Active field selector within the planner
    const [activeField, setActiveField] = useState<ActiveFieldSelector>("none");

    // Form errors
    const [errors, setErrors] = useState<FormErrors>({});

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

    // Keep draft destination synchronized with active hero destination when untouched
    useEffect(() => {
      if (!isDirtyRef.current) {
        setDraft((prev) => ({
          ...prev,
          destination: activeDestination,
        }));
      }
    }, [activeDestination]);

    // Helper function to safely unlock body scroll
    const unlockBodyScroll = useCallback(() => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("sjh-scroll-locked");
        document.body.classList.remove("sjh-scroll-locked");
      }
    }, []);

    // Ensure document scroll state is locked when planner is open, and restored on EVERY exit path
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
        // Guaranteed cleanup on unmount or state transition
        unlockBodyScroll();
      };
    }, [plannerState, unlockBodyScroll]);

    // Calculate responsive expanded height based on current viewport
    // Target: clamp(448px, 58svh, 500px)
    const calculateExpandedHeight = useCallback(() => {
      const vh = window.innerHeight || 844;
      const target = Math.round(vh * 0.58);
      return Math.min(Math.max(448, target), 500);
    }, []);

    // Helper to gather refs for motion engine
    const getMotionRefs = useCallback((): PlannerMotionRefs | null => {
      if (
        !shellRef.current ||
        !dockCollapsedRef.current ||
        !dockExpandedRef.current ||
        !plannerHeaderRef.current ||
        !ctaBtnRef.current ||
        !backgroundRef.current ||
        !headerRef.current ||
        !compassNavRef.current ||
        !veilRef.current
      ) {
        return null;
      }

      const rows = [
        rowFromRef.current,
        rowDestRef.current,
        rowWhenRef.current,
        rowTravellersRef.current,
      ].filter(Boolean) as HTMLElement[];

      return {
        shell: shellRef.current,
        dockCollapsed: dockCollapsedRef.current,
        dockExpanded: dockExpandedRef.current,
        header: plannerHeaderRef.current,
        rows,
        cta: ctaBtnRef.current,
        veil: veilRef.current,
        backgroundImg: backgroundRef.current,
        heroHeader: headerRef.current,
        compassNav: compassNavRef.current,
      };
    }, [backgroundRef, headerRef, compassNavRef, veilRef]);

    // Open Morph Action
    const openPlanner = useCallback(() => {
      // Locking: only open when intro complete, idle portal, and currently closed
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
      setActiveField("none");
      updateState("closing");
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("sjh-scroll-locked");
        document.body.classList.remove("sjh-scroll-locked");
      }

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

    // Additional global safety: restore scroll on Escape, resize, pagehide, orientationchange, or errors
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

      const handleError = () => {
        unlockBodyScroll();
      };

      window.addEventListener("keydown", handleGlobalKeyDown);
      window.addEventListener("resize", handleWindowCleanup);
      window.addEventListener("pagehide", unlockBodyScroll);
      window.addEventListener("orientationchange", handleWindowCleanup);
      window.addEventListener("error", handleError);

      return () => {
        unlockBodyScroll();
        window.removeEventListener("keydown", handleGlobalKeyDown);
        window.removeEventListener("resize", handleWindowCleanup);
        window.removeEventListener("pagehide", unlockBodyScroll);
        window.removeEventListener("orientationchange", handleWindowCleanup);
        window.removeEventListener("error", handleError);
      };
    }, [closePlanner, unlockBodyScroll]);

    // Expose imperative API for testing hooks & parent components
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
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        },
        seek: (progress: number) => {
          if (!activeTimelineRef.current) {
            // If closed, begin open timeline paused
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

    // Keyboard focus trap and Escape handler
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (plannerStateRef.current === "closed") return;

      if (e.key === "Escape") {
        e.preventDefault();
        closePlanner();
        return;
      }

      if (e.key === "Tab") {
        // Focus trap between close button and CTA button
        const focusable = dockExpandedRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Form Field Handlers
    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      isDirtyRef.current = true;
      const val = e.target.value;
      setDraft((prev) => ({ ...prev, from: val }));
      if (errors.from) {
        setErrors((prev) => ({ ...prev, from: undefined }));
      }
    };

    const handleSelectDestination = (destId: DestinationId) => {
      isDirtyRef.current = true;
      setDraft((prev) => ({ ...prev, destination: destId }));
      setActiveField("none");
      if (errors.destination) {
        setErrors((prev) => ({ ...prev, destination: undefined }));
      }
    };

    const handleDateModeChange = (mode: "flexible" | "specific") => {
      isDirtyRef.current = true;
      setDraft((prev) => ({ ...prev, dateMode: mode }));
      if (mode === "flexible" && errors.date) {
        setErrors((prev) => ({ ...prev, date: undefined }));
      }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      isDirtyRef.current = true;
      const val = e.target.value;
      setDraft((prev) => ({ ...prev, date: val }));
      if (errors.date) {
        setErrors((prev) => ({ ...prev, date: undefined }));
      }
    };

    const handleAdultsChange = (delta: number) => {
      isDirtyRef.current = true;
      setDraft((prev) => {
        const next = Math.max(1, Math.min(8, prev.adults + delta));
        return { ...prev, adults: next };
      });
      if (errors.adults) {
        setErrors((prev) => ({ ...prev, adults: undefined }));
      }
    };

    const handleChildrenChange = (delta: number) => {
      isDirtyRef.current = true;
      setDraft((prev) => {
        const next = Math.max(0, Math.min(6, prev.children + delta));
        return { ...prev, children: next };
      });
    };

    // Validation & Submission
    const handleCreateJourney = (e: React.MouseEvent) => {
      e.preventDefault();
      const validationErrors = validateJourneyDraft(draft);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});

      // Subdued button press micro-interaction (scale 0.985)
      if (ctaBtnRef.current) {
        gsap.to(ctaBtnRef.current, {
          scale: 0.985,
          duration: 0.08,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      }

      // Invoke external typed callback
      onCreateJourney?.(draft);
    };

    const isExpandedVisible = plannerState !== "closed";

    return (
      <div
        ref={setShellRef}
        className={`sjhHero__dock ${isExpandedVisible ? "is-open" : ""}`}
        onKeyDown={handleKeyDown}
      >
        {/* Collapsed Resting Dock View */}
        <button
          ref={dockCollapsedRef}
          type="button"
          className="sjhHero__dockCollapsed"
          onClick={openPlanner}
          aria-label="Plan your journey"
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
        >
          {/* Header */}
          <div ref={plannerHeaderRef} className="sjhHero__plannerHeader">
            <h2 id="sjh-planner-title" className="sjhHero__plannerTitle">
              PLAN YOUR JOURNEY
            </h2>
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

          {/* Form Rows Body */}
          <div className="sjhHero__plannerBody">
            {/* ROW 1: FROM */}
            <div
              ref={rowFromRef}
              className={`sjhHero__plannerRow ${errors.from ? "has-error" : ""}`}
            >
              <label className="sjhHero__plannerLabel" htmlFor="sjh-planner-from">
                FROM
              </label>
              <div className="sjhHero__plannerValueWrap">
                <input
                  id="sjh-planner-from"
                  ref={fromInputRef}
                  className="sjhHero__plannerInput"
                  type="text"
                  value={draft.from}
                  onChange={handleFromChange}
                  placeholder="Enter departure city"
                  tabIndex={isExpandedVisible ? 0 : -1}
                />
                <span className="sjhHero__plannerRowChevron" aria-hidden="true">
                  ›
                </span>
              </div>
              {errors.from && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.from}
                </span>
              )}
            </div>

            {/* ROW 2: DESTINATION */}
            <div
              ref={rowDestRef}
              className={`sjhHero__plannerRow is-interactive ${
                activeField === "destination" ? "is-expanded" : ""
              } ${errors.destination ? "has-error" : ""}`}
            >
              <span className="sjhHero__plannerLabel">DESTINATION</span>
              <div
                className="sjhHero__plannerValueWrap"
                onClick={() =>
                  setActiveField((prev) => (prev === "destination" ? "none" : "destination"))
                }
                role="button"
                tabIndex={isExpandedVisible ? 0 : -1}
                aria-expanded={activeField === "destination"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveField((prev) => (prev === "destination" ? "none" : "destination"));
                  }
                }}
              >
                <span className="sjhHero__plannerValue">
                  {DESTINATION_DISPLAY_NAMES[draft.destination]}
                </span>
                <span className="sjhHero__plannerRowChevron" aria-hidden="true">
                  ›
                </span>
              </div>

              {/* Inline Destination Selector */}
              {activeField === "destination" && (
                <div className="sjhHero__destGrid" role="radiogroup" aria-label="Select destination">
                  {(["puri", "kashmir", "rajasthan", "kerala"] as DestinationId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      className={`sjhHero__destOption ${draft.destination === id ? "is-selected" : ""}`}
                      onClick={() => handleSelectDestination(id)}
                      role="radio"
                      aria-checked={draft.destination === id}
                      tabIndex={isExpandedVisible ? 0 : -1}
                    >
                      <span>{DESTINATION_DISPLAY_NAMES[id]}</span>
                      {draft.destination === id && <span className="sjhHero__destDot" />}
                    </button>
                  ))}
                </div>
              )}
              {errors.destination && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.destination}
                </span>
              )}
            </div>

            {/* ROW 3: WHEN */}
            <div ref={rowWhenRef} className="sjhHero__plannerRow">
              <span className="sjhHero__plannerLabel">WHEN</span>
              <div className="sjhHero__whenWrap">
                <div className="sjhHero__whenPills" role="radiogroup" aria-label="Date flexibility">
                  <button
                    type="button"
                    className={`sjhHero__whenPill ${draft.dateMode === "flexible" ? "is-active" : ""}`}
                    onClick={() => handleDateModeChange("flexible")}
                    role="radio"
                    aria-checked={draft.dateMode === "flexible"}
                    tabIndex={isExpandedVisible ? 0 : -1}
                  >
                    Flexible dates
                  </button>
                  <button
                    type="button"
                    className={`sjhHero__whenPill ${draft.dateMode === "specific" ? "is-active" : ""}`}
                    onClick={() => handleDateModeChange("specific")}
                    role="radio"
                    aria-checked={draft.dateMode === "specific"}
                    tabIndex={isExpandedVisible ? 0 : -1}
                  >
                    Specific date
                  </button>
                </div>

                {draft.dateMode === "specific" && (
                  <input
                    type="date"
                    className="sjhHero__dateInput"
                    value={draft.date}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    aria-label="Select specific travel date"
                    tabIndex={isExpandedVisible ? 0 : -1}
                  />
                )}
              </div>
              {errors.date && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.date}
                </span>
              )}
            </div>

            {/* ROW 4: TRAVELLERS */}
            <div ref={rowTravellersRef} className="sjhHero__plannerRow">
              <span className="sjhHero__plannerLabel">TRAVELLERS</span>
              <div className="sjhHero__travellersGrid">
                {/* Adults Stepper */}
                <div className="sjhHero__stepperItem">
                  <span className="sjhHero__stepperLabel">Adults</span>
                  <div className="sjhHero__stepperControls">
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => handleAdultsChange(-1)}
                      disabled={draft.adults <= 1}
                      aria-label="Decrease adults"
                      tabIndex={isExpandedVisible ? 0 : -1}
                    >
                      −
                    </button>
                    <span className="sjhHero__stepperCount">{draft.adults}</span>
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => handleAdultsChange(1)}
                      disabled={draft.adults >= 8}
                      aria-label="Increase adults"
                      tabIndex={isExpandedVisible ? 0 : -1}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children Stepper */}
                <div className="sjhHero__stepperItem">
                  <span className="sjhHero__stepperLabel">Children</span>
                  <div className="sjhHero__stepperControls">
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => handleChildrenChange(-1)}
                      disabled={draft.children <= 0}
                      aria-label="Decrease children"
                      tabIndex={isExpandedVisible ? 0 : -1}
                    >
                      −
                    </button>
                    <span className="sjhHero__stepperCount">{draft.children}</span>
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => handleChildrenChange(1)}
                      disabled={draft.children >= 6}
                      aria-label="Increase children"
                      tabIndex={isExpandedVisible ? 0 : -1}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              {errors.adults && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.adults}
                </span>
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          <button
            ref={ctaBtnRef}
            type="button"
            className="sjhHero__plannerCta"
            onClick={handleCreateJourney}
            tabIndex={isExpandedVisible ? 0 : -1}
          >
            <span>CREATE MY JOURNEY</span>
            <span className="sjhHero__plannerCtaArrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    );
  }
);
