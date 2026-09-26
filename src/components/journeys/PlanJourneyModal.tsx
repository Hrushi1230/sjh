/**
 * SHREE JAGANNATH HOLIDAYS — DETAIL & DOWN-PAGE JOURNEY PLANNER MODAL
 * Reuses Phase-3 Journey Planner architecture, fields, validation, and styling
 * with contextual destination prefill, review screen, and WhatsApp enquiry handoff.
 */

import { useState, useEffect, useRef } from "react";
import {
  JourneyDraft,
  getDestinationLabel,
  createDefaultDraft,
} from "../hero/plannerData";
import { JourneyPlannerFlow } from "../planner/JourneyPlannerFlow";

interface PlanJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  source?: string;
  onCreateJourney?: (draft: JourneyDraft) => void;
}

export function PlanJourneyModal({
  isOpen,
  onClose,
  destination,
  source = "modal",
  onCreateJourney,
}: PlanJourneyModalProps) {
  const [draft, setDraft] = useState<JourneyDraft>(() => createDefaultDraft(destination));
  const dialogRef = useRef<HTMLDivElement>(null);

  // Synchronize destination when opening modal for a specific journey or contextual trigger
  useEffect(() => {
    if (isOpen) {
      setDraft((prev) => ({
        ...prev,
        destination: getDestinationLabel(destination) || prev.destination,
        source: source || prev.source,
      }));
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, destination, source]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-planner-title"
      className="sjhHero__veil is-active"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        backgroundColor: "rgba(11, 10, 8, 0.88)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="sjhHero__dockExpanded sjhPlanModal__card"
        style={{
          opacity: 1,
          visibility: "visible",
          pointerEvents: "all",
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "28px 28px 0 0",
          backgroundColor: "#11100E",
          boxShadow: "0 -16px 48px rgba(0, 0, 0, 0.55)",
          overflowY: "auto",
          zIndex: 10000,
          padding: "20px 20px 24px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div className="sjhHero__plannerHeader">
          <div>
            <h2 id="detail-planner-title" className="sjhHero__plannerTitle">
              PLAN YOUR JOURNEY
            </h2>
            <div style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#B99455", textTransform: "uppercase", marginTop: "2px" }}>
              {draft.destination} Edition
            </div>
          </div>

          <button
            type="button"
            className="sjhHero__plannerClose"
            onClick={onClose}
            aria-label="Close journey planner"
          >
            ✕
          </button>
        </div>

        {/* Unified 5-Step Flow */}
        <JourneyPlannerFlow
          draft={draft}
          onDraftChange={setDraft}
          onClose={onClose}
          onComplete={onCreateJourney}
        />
      </div>
    </div>
  );
}
