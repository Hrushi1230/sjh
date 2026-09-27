import { useState, useRef, useCallback, useEffect, useLayoutEffect, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";
import {
  JourneyDraft,
  PlannerState,
  createDefaultDraft,
  getDestinationLabel,
} from "./plannerData";
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
  isPortalActive?: boolean;
  isOpen?: boolean;
  onOpenPlanner?: () => void;
  onOpenStateChange?: (state: PlannerState) => void;
  onFormTouch?: () => void;
  onCreateJourney?: (draft: JourneyDraft) => void;
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
      activeDestination,
      assetBase = "/assets/sjh-hero",
      isIntroComplete,
      isOpen: externalIsOpen,
      onOpenPlanner,
      onOpenStateChange,
      onFormTouch,
      onCreateJourney,
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

    // Booking Card Open State:
    // On revisit: open immediately. On first visit: wait 350-500ms after Hero settles, then auto-open.
    const [isCardOpen, setIsCardOpen] = useState(isAlreadySeen);

    // User ownership rule: before traveller manually selects/edits destination, hero changes update prefill.
    // After traveller selects/edits destination, planner destination is user-owned.
    const destinationTouchedByUserRef = useRef(false);

    // Keyboard state & lift on mobile
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);
    const [keyboardLiftPx, setKeyboardLiftPx] = useState(0);

    // Journey draft data
    const [draft, setDraft] = useState<JourneyDraft>(() => ({
      ...createDefaultDraft(activeDestination),
      from: "",
      destination: getDestinationLabel(activeDestination) || "Puri / Odisha",
    }));
    const draftRef = useRef<JourneyDraft>(draft);
    draftRef.current = draft;

    // Prefill destination from active Hero world until user edits it (Requirement 7 & 8)
    useEffect(() => {
      if (!destinationTouchedByUserRef.current && activeDestination) {
        const mapped = getDestinationLabel(activeDestination);
        if (mapped) {
          setDraft((prev) => ({
            ...prev,
            destination: mapped,
          }));
        }
      }
    }, [activeDestination]);

    // Handle user manual destination touch (Requirement 8)
    const handleDestinationTouch = useCallback(() => {
      destinationTouchedByUserRef.current = true;
      onFormTouch?.();
    }, [onFormTouch]);

    // Handle any form interaction (Requirement 9: pause hero autoplay)
    const handleFormInteraction = useCallback(() => {
      onFormTouch?.();
    }, [onFormTouch]);

    // Handle draft update
    const handleDraftChange = useCallback((nextDraft: JourneyDraft) => {
      setDraft(nextDraft);
      const win = window as any;
      if (win.__SJH_PLANNER_DRAFT__) {
        win.__SJH_PLANNER_DRAFT__ = nextDraft;
      }
    }, []);

    // Requirement 1 & 4: Auto-open sequence after first ceremonial hero animation
    useEffect(() => {
      if (!isIntroComplete) return;

      if (isAlreadySeen) {
        setIsCardOpen(true);
        onOpenStateChange?.("open");
        return;
      }

      if (!isCardOpen) {
        // Wait approximately 350–500ms after Hero settles
        const timer = setTimeout(() => {
          setIsCardOpen(true);
          onOpenStateChange?.("open");
        }, 400);

        return () => clearTimeout(timer);
      }
    }, [isIntroComplete, isCardOpen, isAlreadySeen, onOpenStateChange]);

    // Requirement 4: Smooth Auto-Open Choreography (GSAP ~750ms, ease: power3.out, NO bounce, NO autofocus)
    useLayoutEffect(() => {
      if (!isCardOpen) return;
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
    }, [isCardOpen]);

    // Requirement 12: Visual viewport & mobile keyboard lift
    useEffect(() => {
      const handleVV = () => {
        const vv = window.visualViewport;
        if (!vv) return;
        const reduction = window.innerHeight - vv.height;
        if (reduction > 130 && isKeyboardActive) {
          setKeyboardLiftPx(Math.min(reduction, 320));
        } else if (reduction <= 130) {
          setKeyboardLiftPx(0);
          setIsKeyboardActive(false);
        }
      };

      const vv = window.visualViewport;
      if (vv) {
        vv.addEventListener("resize", handleVV);
        vv.addEventListener("scroll", handleVV);
      }
      return () => {
        if (vv) {
          vv.removeEventListener("resize", handleVV);
          vv.removeEventListener("scroll", handleVV);
        }
      };
    }, [isKeyboardActive]);

    // Freeze body scroll while mobile keyboard is active in hero
    useEffect(() => {
      if (isKeyboardActive && keyboardLiftPx > 0) {
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.position = "";
          document.body.style.width = "";
          document.body.style.top = "";
          document.body.style.overflow = "";
          window.scrollTo(0, scrollY);
        };
      }
    }, [isKeyboardActive, keyboardLiftPx]);

    const handleKeyboardChange = useCallback((isOpen: boolean) => {
      setIsKeyboardActive(isOpen);
      if (!isOpen) {
        setKeyboardLiftPx(0);
      }
    }, []);

    // Manual open action if ever triggered externally
    const openPlanner = useCallback(() => {
      onFormTouch?.();
      onOpenPlanner?.();
      setIsCardOpen(true);
      onOpenStateChange?.("open");
    }, [onFormTouch, onOpenPlanner, onOpenStateChange]);

    const closePlanner = useCallback(() => {
      setIsCardOpen(false);
      onOpenStateChange?.("closed");
    }, [onOpenStateChange]);

    // Imperative API for parent components & automated test hooks
    useImperativeHandle(
      ref,
      () => ({
        open: openPlanner,
        close: closePlanner,
        getState: () => (isCardOpen ? "open" : "closed"),
        getDraft: () => draftRef.current,
        setField: <K extends keyof JourneyDraft>(field: K, value: JourneyDraft[K]) => {
          setDraft((prev) => ({ ...prev, [field]: value }));
        },
        seek: () => {},
      }),
      [openPlanner, closePlanner, isCardOpen]
    );

    const isVisible = externalIsOpen !== undefined ? externalIsOpen : isCardOpen;

    return (
      <div
        ref={setShellRef}
        className={`sjhHero__dock ${isVisible ? "is-open" : ""}`}
        data-keyboard-open={isKeyboardActive}
        style={{
          transform: isKeyboardActive && keyboardLiftPx > 0 ? `translateY(-${keyboardLiftPx}px)` : undefined,
          transition: isKeyboardActive ? "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
        }}
      >
        {isVisible ? (
          <div ref={cardContentRef} className="sjhHero__dockExpanded">
            <div className="sjhHeroBookingCard">
              <JourneyPlannerFlow
                variant="hero"
                draft={draft}
                onDraftChange={handleDraftChange}
                onClose={closePlanner}
                onFormTouch={handleFormInteraction}
                onDestinationTouch={handleDestinationTouch}
                onComplete={onCreateJourney}
                onKeyboardStateChange={handleKeyboardChange}
              />
            </div>
          </div>
        ) : (
          /* Collapsed Resting Dock View */
          <button
            ref={dockCollapsedRef}
            type="button"
            className="sjhHero__dockCollapsed"
            onClick={openPlanner}
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
