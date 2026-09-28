import { useState, useRef, useCallback, useEffect, useLayoutEffect, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";
import {
  JourneyDraft,
  PlannerState,
} from "./plannerData";
import { heroCopy } from "./heroData";
import { JourneyPlannerFlow } from "../planner/JourneyPlannerFlow";

export interface JourneyDockPlannerHandle {
  showCard: () => void;
  hideCard: () => void;
  open: () => void;
  close: () => void;
  isCardVisible: () => boolean;
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
  isPortalActive?: boolean;
  isOpen?: boolean;
  draft: JourneyDraft;
  onDraftChange: (draft: JourneyDraft) => void;
  step?: 1 | 2 | 3 | 4 | 5 | 6;
  onStepChange?: (step: 1 | 2 | 3 | 4 | 5 | 6) => void;
  onPromoteToSheet?: (focusField?: string) => void;
  onContinueToSheet?: () => void;
  onOpenPlanner?: () => void;
  onOpenStateChange?: (state: PlannerState) => void;
  onFormTouch?: () => void;
  onDestinationTouch?: () => void;
  onDropdownStateChange?: (isOpen: boolean) => void;
  onCreateJourney?: (draft: JourneyDraft) => void;
  onCardVisibleChange?: (visible: boolean) => void;
  backgroundRef?: React.RefObject<HTMLImageElement>;
  headerRef?: React.RefObject<HTMLElement>;
  compassNavRef?: React.RefObject<HTMLElement>;
  veilRef?: React.RefObject<HTMLDivElement>;
}

const SESSION_STORAGE_KEY = "sjh_hero_intro_seen";

export const JourneyDockPlanner = forwardRef<JourneyDockPlannerHandle, JourneyDockPlannerProps>(
  function JourneyDockPlanner(
    {
      dockRef,
      assetBase = "/assets/sjh-hero",
      isIntroComplete,
      isOpen: externalIsOpen,
      draft,
      onDraftChange,
      step = 1,
      onStepChange,
      onPromoteToSheet,
      onContinueToSheet,
      onFormTouch,
      onDestinationTouch,
      onDropdownStateChange,
      onCreateJourney,
      onCardVisibleChange,
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
    const cardContentRef = useRef<HTMLDivElement>(null);

    // Check if intro was already seen in this session
    const isAlreadySeen = typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
    const hasAnimatedOpenRef = useRef(isAlreadySeen);

    // Booking Card Visibility:
    // On revisit: visible immediately. On first visit: wait ~400ms after Hero settles, then auto-open.
    // The Hero booking card is normal settled Hero UI, NOT a blocking modal.
    const [isCardVisible, setIsCardVisible] = useState(isAlreadySeen);

    // Auto-open sequence after first ceremonial hero intro
    useEffect(() => {
      if (!isIntroComplete) return;

      if (isAlreadySeen) {
        setIsCardVisible(true);
        onCardVisibleChange?.(true);
        return;
      }

      if (!isCardVisible) {
        const timer = setTimeout(() => {
          setIsCardVisible(true);
          onCardVisibleChange?.(true);
        }, 400);

        return () => clearTimeout(timer);
      }
    }, [isIntroComplete, isCardVisible, isAlreadySeen, onCardVisibleChange]);

    // Smooth Auto-Open Choreography (GSAP ~750ms, ease: power3.out, NO bounce, NO autofocus)
    useLayoutEffect(() => {
      if (!isCardVisible) return;
      if (hasAnimatedOpenRef.current) return;
      hasAnimatedOpenRef.current = true;

      const shell = shellRef.current;
      const content = cardContentRef.current;
      if (!shell || !content) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Dock lifts slightly: scale .98 -> 1, y 18 -> 0
      tl.fromTo(
        shell,
        { scale: 0.98, y: 18, opacity: 0.9 },
        { scale: 1, y: 0, opacity: 1, duration: 0.75 }
      );

      // Inner elements stagger in smoothly
      const header = content.querySelector(".sjhHeroCard__header");
      if (header) {
        tl.fromTo(header, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, 0.1);
      }

      const fromRow = content.querySelector(".sjhHeroCard__fromRow");
      if (fromRow) {
        tl.fromTo(fromRow, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, 0.2);
      }

      const destRow = content.querySelector(".sjhHeroCard__destRow");
      if (destRow) {
        tl.fromTo(destRow, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, 0.3);
      }

      const actionArea = content.querySelector(".sjhFlow__actionArea");
      if (actionArea) {
        tl.fromTo(actionArea, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, 0.4);
      }
    }, [isCardVisible]);

    // Show Hero card in-place (does NOT open PlanJourneyModal)
    const showHeroBookingCard = useCallback(() => {
      onFormTouch?.();
      setIsCardVisible(true);
      onCardVisibleChange?.(true);
    }, [onFormTouch, onCardVisibleChange]);

    const hideHeroBookingCard = useCallback(() => {
      setIsCardVisible(false);
      onCardVisibleChange?.(false);
    }, [onCardVisibleChange]);

    // Imperative API for parent components & automated test hooks
    useImperativeHandle(
      ref,
      () => ({
        showCard: showHeroBookingCard,
        hideCard: hideHeroBookingCard,
        open: showHeroBookingCard,
        close: hideHeroBookingCard,
        isCardVisible: () => isCardVisible,
        getState: () => (isCardVisible ? "open" : "closed"),
        getDraft: () => draft,
        setField: <K extends keyof JourneyDraft>(field: K, value: JourneyDraft[K]) => {
          onDraftChange({ ...draft, [field]: value });
        },
        seek: () => {},
      }),
      [showHeroBookingCard, hideHeroBookingCard, isCardVisible, draft, onDraftChange]
    );

    const isVisible = externalIsOpen !== undefined ? externalIsOpen : isCardVisible;

    return (
      <div
        ref={setShellRef}
        className={`sjhHero__dock ${isVisible ? "is-open" : ""}`}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {isVisible ? (
          <div ref={cardContentRef} className="sjhHero__dockExpanded">
            <div className="sjhHeroBookingCard">
              <JourneyPlannerFlow
                variant="hero"
                draft={draft}
                onDraftChange={onDraftChange}
                step={step}
                onStepChange={onStepChange}
                onClose={hideHeroBookingCard}
                onFormTouch={onFormTouch}
                onDestinationTouch={onDestinationTouch}
                onDropdownStateChange={onDropdownStateChange}
                onComplete={onCreateJourney}
                onPromoteToSheet={onPromoteToSheet}
                onContinueFromHero={onContinueToSheet}
              />
            </div>
          </div>
        ) : (
          /* Collapsed Resting Dock View */
          <button
            ref={dockCollapsedRef}
            type="button"
            className="sjhHero__dockCollapsed"
            onClick={showHeroBookingCard}
            aria-label="Book now"
          >
            <span className="sjhHero__dockIcon" aria-hidden="true">
              <img src={`${assetBase}/compass.svg`} alt="" />
            </span>
            <span className="sjhHero__dockLabel">{heroCopy.dock}</span>
            <span className="sjhHero__dockAction" aria-hidden="true">
              <img src={`${assetBase}/arrow-right.svg`} alt="" />
            </span>
          </button>
        )}
      </div>
    );
  }
);
