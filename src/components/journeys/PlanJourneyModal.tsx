/**
 * SHREE JAGANNATH HOLIDAYS — DETAIL PAGE JOURNEY PLANNER MODAL
 * Reuses Phase-3 Journey Planner architecture, fields, validation, and styling
 * with the active journey's destination prefilled.
 */

import { useState, useEffect, useRef } from "react";
import {
  DestinationId,
  JourneyDraft,
  FormErrors,
  DESTINATION_DISPLAY_NAMES,
  createDefaultDraft,
  validateJourneyDraft,
} from "../hero/plannerData";

interface PlanJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: DestinationId;
  onCreateJourney?: (draft: JourneyDraft) => void;
}

export function PlanJourneyModal({
  isOpen,
  onClose,
  destination,
  onCreateJourney,
}: PlanJourneyModalProps) {
  const [draft, setDraft] = useState<JourneyDraft>(() => createDefaultDraft(destination));
  const [activeField, setActiveField] = useState<"none" | "destination" | "when" | "travellers">("none");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Synchronize destination when opening modal for a specific journey
  useEffect(() => {
    if (isOpen) {
      setDraft((prev) => ({
        ...prev,
        destination,
      }));
      setIsSubmitted(false);
      setErrors({});
      setActiveField("none");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, destination]);

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

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDraft((prev) => ({ ...prev, from: val }));
    if (errors.from) {
      setErrors((prev) => ({ ...prev, from: undefined }));
    }
  };

  const handleSelectDestination = (dest: DestinationId) => {
    setDraft((prev) => ({ ...prev, destination: dest }));
    setActiveField("none");
    if (errors.destination) {
      setErrors((prev) => ({ ...prev, destination: undefined }));
    }
  };

  const handleDateModeChange = (mode: "flexible" | "specific") => {
    setDraft((prev) => ({ ...prev, dateMode: mode }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({ ...prev, date: e.target.value }));
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const handleAdultsChange = (delta: number) => {
    setDraft((prev) => {
      const next = Math.max(1, Math.min(8, prev.adults + delta));
      return { ...prev, adults: next };
    });
  };

  const handleChildrenChange = (delta: number) => {
    setDraft((prev) => {
      const next = Math.max(0, Math.min(6, prev.children + delta));
      return { ...prev, children: next };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateJourneyDraft(draft);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onCreateJourney?.(draft);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 1800);
  };

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
        backgroundColor: "rgba(11, 10, 8, 0.85)",
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
          maxWidth: "430px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "28px 28px 0 0",
          backgroundColor: "#11100E",
          boxShadow: "0 -16px 48px rgba(0, 0, 0, 0.45)",
          overflowY: "auto",
          zIndex: 10000,
        }}
      >
        {/* Header */}
        <div className="sjhHero__plannerHeader">
          <div>
            <h2 id="detail-planner-title" className="sjhHero__plannerTitle">
              PLAN YOUR JOURNEY
            </h2>
            <div style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#B99455", textTransform: "uppercase" }}>
              {DESTINATION_DISPLAY_NAMES[draft.destination]} Edition
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

        {isSubmitted ? (
          <div style={{ padding: "40px 24px", textAlign: "center", color: "#F4EFE6" }}>
            <div style={{ fontSize: "28px", color: "#B99455", marginBottom: "12px" }}>✓</div>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", marginBottom: "8px" }}>
              Journey Request Received
            </h3>
            <p style={{ fontSize: "13px", color: "rgba(244, 239, 230, 0.75)" }}>
              An SJH concierge will craft your personalized {DESTINATION_DISPLAY_NAMES[draft.destination]} itinerary.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="sjhHero__plannerBody">
            {/* ROW 1: FROM */}
            <div className={`sjhHero__plannerRow ${errors.from ? "has-error" : ""}`}>
              <label className="sjhHero__plannerLabel" htmlFor="planner-modal-from">
                FROM
              </label>
              <div className="sjhHero__plannerValueWrap">
                <input
                  id="planner-modal-from"
                  className="sjhHero__plannerInput"
                  type="text"
                  value={draft.from}
                  onChange={handleFromChange}
                  placeholder="Enter departure city"
                />
              </div>
              {errors.from && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.from}
                </span>
              )}
            </div>

            {/* ROW 2: DESTINATION */}
            <div
              className={`sjhHero__plannerRow is-interactive ${
                activeField === "destination" ? "is-expanded" : ""
              }`}
            >
              <span className="sjhHero__plannerLabel">DESTINATION</span>
              <div
                className="sjhHero__plannerValueWrap"
                onClick={() =>
                  setActiveField((prev) => (prev === "destination" ? "none" : "destination"))
                }
                role="button"
                tabIndex={0}
              >
                <span className="sjhHero__plannerValue">
                  {DESTINATION_DISPLAY_NAMES[draft.destination]}
                </span>
                <span className="sjhHero__plannerRowChevron" aria-hidden="true">
                  ›
                </span>
              </div>

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
                    >
                      <span>{DESTINATION_DISPLAY_NAMES[id]}</span>
                      {draft.destination === id && <span className="sjhHero__destDot" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ROW 3: WHEN */}
            <div className="sjhHero__plannerRow">
              <span className="sjhHero__plannerLabel">WHEN</span>
              <div className="sjhHero__whenWrap">
                <div className="sjhHero__whenPills" role="radiogroup" aria-label="Date flexibility">
                  <button
                    type="button"
                    className={`sjhHero__whenPill ${draft.dateMode === "flexible" ? "is-active" : ""}`}
                    onClick={() => handleDateModeChange("flexible")}
                    role="radio"
                    aria-checked={draft.dateMode === "flexible"}
                  >
                    Flexible dates
                  </button>
                  <button
                    type="button"
                    className={`sjhHero__whenPill ${draft.dateMode === "specific" ? "is-active" : ""}`}
                    onClick={() => handleDateModeChange("specific")}
                    role="radio"
                    aria-checked={draft.dateMode === "specific"}
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
                    style={{ marginTop: "10px" }}
                  />
                )}
              </div>
            </div>

            {/* ROW 4: TRAVELLERS */}
            <div className="sjhHero__plannerRow">
              <span className="sjhHero__plannerLabel">TRAVELLERS</span>
              <div className="sjhHero__steppers">
                <div className="sjhHero__stepperRow">
                  <span className="sjhHero__stepperLabel">Adults</span>
                  <div className="sjhHero__stepperControls">
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => handleAdultsChange(-1)}
                      disabled={draft.adults <= 1}
                      aria-label="Decrease adults"
                    >
                      −
                    </button>
                    <span className="sjhHero__stepperValue">{draft.adults}</span>
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => handleAdultsChange(1)}
                      disabled={draft.adults >= 8}
                      aria-label="Increase adults"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="sjhHero__stepperRow">
                  <span className="sjhHero__stepperLabel">Children</span>
                  <div className="sjhHero__stepperControls">
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => handleChildrenChange(-1)}
                      disabled={draft.children <= 0}
                      aria-label="Decrease children"
                    >
                      −
                    </button>
                    <span className="sjhHero__stepperValue">{draft.children}</span>
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => handleChildrenChange(1)}
                      disabled={draft.children >= 6}
                      aria-label="Increase children"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" className="sjhHero__plannerCta">
              <span>CRAFT MY ITINERARY</span>
              <span className="sjhHero__plannerCtaArrow">→</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
