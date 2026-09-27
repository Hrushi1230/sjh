/**
 * SHREE JAGANNATH HOLIDAYS — VIEWPORT-LEVEL JOURNEY PLANNER MODAL
 * Portaled to document.body. Fully isolated viewport-level interaction layer.
 * Includes:
 * - Robust iOS-safe body scroll lock with exact scroll restoration
 * - Visual Viewport tracking (--planner-vvh, --planner-vv-top, keyboard detection)
 * - Zero autofocus on open (Section 3)
 * - Calm GSAP opening animation (Section 9)
 * - Safe-area insets & focus restoration with preventScroll (Section 36)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import {
  JourneyDraft,
  getDestinationLabel,
  createDefaultDraft,
} from "../hero/plannerData";
import { JourneyPlannerFlow } from "../planner/JourneyPlannerFlow";
import "../planner/plannerFlow.css";

interface PlanJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination?: string;
  source?: string;
  onCreateJourney?: (draft: JourneyDraft) => void;
  triggerElement?: HTMLElement | null;
}

export function PlanJourneyModal({
  isOpen,
  onClose,
  destination = "",
  source = "modal",
  onCreateJourney,
  triggerElement,
}: PlanJourneyModalProps) {
  const [draft, setDraft] = useState<JourneyDraft>(() => createDefaultDraft(destination));
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Synchronize destination & source when opening modal
  useEffect(() => {
    if (isOpen) {
      setDraft((prev) => ({
        ...prev,
        destination: getDestinationLabel(destination) || prev.destination || "Puri / Odisha",
        source: source || prev.source,
      }));
    }
  }, [isOpen, destination, source]);

  // Remember triggering element for focus restoration (Requirement 36)
  useEffect(() => {
    if (isOpen) {
      triggerRef.current =
        (document.activeElement as HTMLElement) || triggerElement || null;
    }
  }, [isOpen, triggerElement]);

  // Robust iOS-safe body scroll lock (Requirements 4 & 34)
  useEffect(() => {
    if (!isOpen) return;

    const lockedScrollY =
      window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

    const originalBodyPos = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.position = originalBodyPos;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;

      window.scrollTo(0, lockedScrollY);
    };
  }, [isOpen]);

  // Visual Viewport tracking & Keyboard detection (Requirements 6, 7, 8, 15, 16)
  useEffect(() => {
    if (!isOpen) return;

    const updateVisualViewport = () => {
      const vv = window.visualViewport;
      const overlay = overlayRef.current;
      if (!overlay) return;

      if (vv) {
        overlay.style.setProperty("--planner-vvh", `${vv.height}px`);
        overlay.style.setProperty("--planner-vv-top", `${vv.offsetTop}px`);

        // Detect if keyboard is open:
        // On iOS & mobile browsers, keyboard shrinks visual viewport height significantly
        const heightReduction = window.innerHeight - vv.height;
        const isKb = heightReduction > 130;
        setIsKeyboardOpen(isKb);
      } else {
        overlay.style.setProperty("--planner-vvh", `${window.innerHeight}px`);
        overlay.style.setProperty("--planner-vv-top", "0px");
        setIsKeyboardOpen(false);
      }
    };

    updateVisualViewport();

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", updateVisualViewport);
      vv.addEventListener("scroll", updateVisualViewport);
    }
    window.addEventListener("resize", updateVisualViewport);

    return () => {
      if (vv) {
        vv.removeEventListener("resize", updateVisualViewport);
        vv.removeEventListener("scroll", updateVisualViewport);
      }
      window.removeEventListener("resize", updateVisualViewport);
    };
  }, [isOpen]);

  // Opening animation (Requirement 9)
  useEffect(() => {
    if (!isOpen) return;

    const backdrop = backdropRef.current;
    const shell = shellRef.current;
    if (!backdrop || !shell) return;

    // Background opacity 0 -> 1 (180-240ms)
    gsap.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.22, ease: "power2.out" }
    );

    // Planner shell y: 18 -> 0, scale 0.985 -> 1, opacity 0 -> 1 (320-380ms, power3.out)
    gsap.fromTo(
      shell,
      { y: 18, scale: 0.985, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" }
    );
  }, [isOpen]);

  // Clean close behavior with keyboard dismiss & focus restoration (Requirements 24 & 36)
  const handleClose = useCallback(() => {
    // 1. Blur active input element gracefully
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // 2. Animate out quickly
    const backdrop = backdropRef.current;
    const shell = shellRef.current;

    if (backdrop && shell) {
      gsap.to(backdrop, { opacity: 0, duration: 0.18, ease: "power2.in" });
      gsap.to(shell, {
        y: 14,
        opacity: 0,
        scale: 0.985,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          onClose();
          // Restore focus with preventScroll
          setTimeout(() => {
            try {
              triggerRef.current?.focus({ preventScroll: true });
            } catch {}
          }, 50);
        },
      });
    } else {
      onClose();
      setTimeout(() => {
        try {
          triggerRef.current?.focus({ preventScroll: true });
        } catch {}
      }, 50);
    }
  }, [onClose]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="sjhPlannerOverlay"
      data-keyboard-open={isKeyboardOpen ? "true" : "false"}
      role="presentation"
    >
      {/* Cheap static backdrop - no heavy blur animation (Requirement 31) */}
      <div
        ref={backdropRef}
        className="sjhPlannerBackdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Visual Viewport Matched Layer (Requirements 6 & 7) */}
      <div ref={viewportRef} className="sjhPlannerViewport">
        <div
          ref={shellRef}
          className="sjhPlannerShell"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sjh-planner-title"
          data-keyboard-open={isKeyboardOpen ? "true" : "false"}
        >
          {/* Unified Header (Requirement 13) */}
          <div className="sjhPlannerHeader">
            <div className="sjhPlannerHeader__info">
              <h2 id="sjh-planner-title" className="sjhPlannerHeader__title">
                PLAN YOUR JOURNEY
              </h2>
              <div className="sjhPlannerHeader__subtitle">
                {draft.destination ? `${draft.destination} Edition` : "Enquiry Concierge"}
              </div>
            </div>

            <button
              type="button"
              className="sjhPlannerHeader__close"
              onClick={handleClose}
              aria-label="Close journey planner"
            >
              ✕
            </button>
          </div>

          {/* 7-Step Journey Planner Flow (Requirement 12 & 13) */}
          <JourneyPlannerFlow
            draft={draft}
            onDraftChange={setDraft}
            onClose={handleClose}
            onComplete={onCreateJourney}
            isKeyboardOpen={isKeyboardOpen}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
