/**
 * SHREE JAGANNATH HOLIDAYS — 7-STEP JOURNEY PLANNER FLOW
 * Upgraded production customer enquiry flow:
 * 01 JOURNEY: From + Destination (combined into Step 1)
 * 02 DATES: Flexible or exact dates + duration
 * 03 TRAVELLERS: Adults + Children + Infants
 * 04 JOURNEY TYPE: Verified SJH service selection
 * 05 YOUR DETAILS: Name + Phone + optional Email
 * 06 NOTES: Optional additional requirements
 * 07 REVIEW: Complete summary + WhatsApp handoff
 */

import React, { useState, useRef, useEffect, useId, useMemo } from "react";
import {
  JourneyDraft,
  FormErrors,
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  formatWhenSummary,
  formatTravellersSummary,
} from "../hero/plannerData";
import { SUGGESTED_DESTINATIONS, JOURNEY_TYPE_OPTIONS, ODISHA_DISTRICTS } from "../../config/business";
import { buildJourneyWhatsAppMessage, createWhatsAppUrl } from "../../utils/contact";
import "./plannerFlow.css";

interface JourneyPlannerFlowProps {
  draft: JourneyDraft;
  onDraftChange: (draft: JourneyDraft) => void;
  step?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  onStepChange?: (step: 1 | 2 | 3 | 4 | 5 | 6 | 7) => void;
  onClose?: () => void;
  onComplete?: (draft: JourneyDraft) => void;
  isKeyboardOpen?: boolean;
  variant?: "hero" | "modal";
  onFormTouch?: () => void;
  onDestinationTouch?: () => void;
  onDropdownStateChange?: (isOpen: boolean) => void;
  onKeyboardStateChange?: (isOpen: boolean) => void;
  onPromoteToSheet?: (focusField?: string) => void;
  onContinueFromHero?: () => void;
  focusFieldOnMount?: string | null;
  onClearFocusField?: () => void;
}

export const JourneyPlannerFlow: React.FC<JourneyPlannerFlowProps> = ({
  draft,
  onDraftChange,
  step: stepProp,
  onStepChange,
  onClose,
  onComplete,
  isKeyboardOpen = false,
  variant = "modal",
  onFormTouch,
  onDestinationTouch,
  onDropdownStateChange,
  onKeyboardStateChange: _onKeyboardStateChange,
  onPromoteToSheet,
  onContinueFromHero,
  focusFieldOnMount,
  onClearFocusField,
}) => {
  const [internalStep, setInternalStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const step = stepProp !== undefined ? stepProp : internalStep;
  const setStep = (nextStep: 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
    if (onStepChange) {
      onStepChange(nextStep);
    } else {
      setInternalStep(nextStep);
    }
  };
  const [errors, setErrors] = useState<FormErrors>({});
  const [isHandoffDone, setIsHandoffDone] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState("");
  const [isCustomDest, setIsCustomDest] = useState(false);
  const [isDestDropdownOpen, setIsDestDropdownOpen] = useState(false);
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isCustomFrom, setIsCustomFrom] = useState(false);

  const idPrefix = useId();
  const destDropdownRef = useRef<HTMLDivElement>(null);
  const fromDropdownRef = useRef<HTMLDivElement>(null);

  // Close destination dropdown on outside click
  useEffect(() => {
    if (!isDestDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (destDropdownRef.current && !destDropdownRef.current.contains(e.target as Node)) {
        setIsDestDropdownOpen(false);
        onDropdownStateChange?.(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isDestDropdownOpen, onDropdownStateChange]);

  // Close from dropdown on outside click
  useEffect(() => {
    if (!isFromDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(e.target as Node)) {
        setIsFromDropdownOpen(false);
        onDropdownStateChange?.(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isFromDropdownOpen, onDropdownStateChange]);


  // Upcoming 12 months for flexible dates dropdown
  const upcomingMonths = useMemo(() => {
    const list: string[] = [];
    const date = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(date.getFullYear(), date.getMonth() + i, 1);
      const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      list.push(label);
    }
    return list;
  }, []);

  const todayStr = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  // Update a single field on draft
  const setField = <K extends keyof JourneyDraft>(key: K, value: JourneyDraft[K]) => {
    onDraftChange({ ...draft, [key]: value });
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  // Helper to transition steps cleanly with keyboard handling (Requirement 23)
  const transitionToStep = (nextStep: 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
    const isInputFocused =
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement &&
      (document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.tagName === "SELECT");

    if (isKeyboardOpen || isInputFocused) {
      if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      setTimeout(() => {
        setStep(nextStep);
      }, 200);
    } else {
      setStep(nextStep);
    }
  };

  // Auto-focus requested field when promoted to viewport sheet
  useEffect(() => {
    if (focusFieldOnMount && variant === "modal") {
      const timer = setTimeout(() => {
        const el =
          document.getElementById(`${idPrefix}-${focusFieldOnMount}`) ||
          document.querySelector<HTMLElement>(`[name="${focusFieldOnMount}"]`);
        if (el) {
          el.focus({ preventScroll: true });
        }
        onClearFocusField?.();
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [focusFieldOnMount, variant, idPrefix, onClearFocusField]);

  // Clean focus handler for modal inputs without premature keyboard events
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    onFormTouch?.();
  };

  // Step 1: Journey (From + Destination)
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep1(draft);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (variant === "hero" && onContinueFromHero) {
      onContinueFromHero();
    } else {
      transitionToStep(2);
    }
  };

  // Step 2: Dates
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep2(draft);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    transitionToStep(3);
  };

  // Step 3: Travellers
  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep3(draft);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    transitionToStep(4);
  };

  // Step 4: Journey Type
  const handleNextStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep4(draft);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    transitionToStep(5);
  };

  // Step 5: Your Details
  const handleNextStep5 = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep5(draft);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    transitionToStep(6);
  };

  // Step 6: Notes -> Review
  const handleNextStep6 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    transitionToStep(7);
  };

  // Step 7: Continue on WhatsApp
  const handleContinueOnWhatsApp = () => {
    const message = buildJourneyWhatsAppMessage(draft);
    const url = createWhatsAppUrl(message);
    setGeneratedWhatsAppUrl(url);

    // Call external callback
    onComplete?.(draft);

    setIsHandoffDone(true);

    try {
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (!win || win.closed || typeof win.closed === "undefined") {
        setPopupBlocked(true);
      }
    } catch {
      setPopupBlocked(true);
    }
  };

  return (
    <div
      className={`sjhFlow ${variant === "hero" ? "sjhFlow--hero" : ""}`}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Step Header & Progress (1 OF 7 through 7 OF 7) */}
      {!isHandoffDone && (
        variant === "hero" ? (
          <div className="sjhHeroCard__header">
            <div className="sjhHeroCard__headerTitles">
              <span className="sjhHeroCard__kicker">PLAN YOUR JOURNEY</span>
              <span className="sjhHeroCard__subtitle">ENQUIRY CONCIERGE</span>
            </div>
            <div className="sjhHeroCard__headerMeta">
              <span className="sjhHeroCard__stepBadge">
                STEP {step} OF 7 · {
                  step === 1 ? "JOURNEY" :
                  step === 2 ? "DATES" :
                  step === 3 ? "TRAVELLERS" :
                  step === 4 ? "JOURNEY TYPE" :
                  step === 5 ? "YOUR DETAILS" :
                  step === 6 ? "NOTES" : "REVIEW"
                }
              </span>
              {step > 1 && (
                <button
                  type="button"
                  className="sjhHeroCard__backBtn"
                  onClick={() => {
                    onFormTouch?.();
                    setErrors({});
                    transitionToStep((step - 1) as any);
                  }}
                  aria-label="Return to previous step"
                >
                  ← BACK
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="sjhFlow__stepBar">
            <div className="sjhFlow__stepInfo">
              <span className="sjhFlow__stepBadge">STEP {step} OF 7</span>
              <span className="sjhFlow__stepTitle">
                {step === 1 && "JOURNEY"}
                {step === 2 && "TRAVEL DATES"}
                {step === 3 && "TRAVELLERS"}
                {step === 4 && "JOURNEY TYPE"}
                {step === 5 && "YOUR DETAILS"}
                {step === 6 && "SPECIAL REQUESTS"}
                {step === 7 && "REVIEW ENQUIRY"}
              </span>
            </div>

            {step > 1 && (
              <button
                type="button"
                className="sjhFlow__backBtn"
                onClick={() => {
                  setErrors({});
                  transitionToStep((step - 1) as any);
                }}
                aria-label="Return to previous step"
              >
                ← BACK
              </button>
            )}
          </div>
        )
      )}

      {/* ======================================================== */}
      {/* STEP 1 / 7: JOURNEY (FROM + DESTINATION COMBINED)        */}
      {/* ======================================================== */}
      {step === 1 && (
        <form onSubmit={handleNextStep1} className="sjhFlow__form sjhFlow__stepAnimated" data-step="1">
          <div className="sjhFlow__scrollArea">
            {/* FROM */}
            <div className={`sjhHero__plannerRow sjhHeroCard__fromRow ${errors.from ? "has-error" : ""}`} style={{ paddingBottom: "10px" }}>
              <label className="sjhHero__plannerLabel" htmlFor={`${idPrefix}-from`}>
                WHERE ARE YOU TRAVELLING FROM? *
              </label>

              {variant === "hero" ? (
                /* Compact Origin Selector Dropdown (Symmetrical with Destination) */
                <div ref={fromDropdownRef} className="sjhHeroCard__destSelectorWrap">
                  <button
                    id={`${idPrefix}-from`}
                    type="button"
                    className="sjhHeroCard__destSelectBtn"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onFormTouch?.();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFormTouch?.();
                      setIsDestDropdownOpen(false);
                      setIsFromDropdownOpen((prev) => {
                        const next = !prev;
                        onDropdownStateChange?.(next);
                        return next;
                      });
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={isFromDropdownOpen}
                  >
                    <span className="sjhHeroCard__destSelectVal">
                      {draft.from || "Select Origin District"}
                    </span>
                    <span className="sjhHeroCard__destSelectChevron" aria-hidden="true">
                      {isFromDropdownOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isFromDropdownOpen && (
                    <div className="sjhHeroCard__fromDropdown" role="listbox">
                      {ODISHA_DISTRICTS.map((district) => (
                        <button
                          key={district}
                          type="button"
                          role="option"
                          aria-selected={draft.from === district}
                          className={`sjhHeroCard__destDropdownItem ${draft.from === district ? "is-active" : ""}`}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            onFormTouch?.();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onFormTouch?.();
                            if (district === "Other City / State") {
                              setIsCustomFrom(true);
                              setField("from", "");
                              setIsFromDropdownOpen(false);
                              onDropdownStateChange?.(false);
                              onPromoteToSheet?.("from");
                            } else {
                              setIsCustomFrom(false);
                              setField("from", district);
                              setIsFromDropdownOpen(false);
                              onDropdownStateChange?.(false);
                            }
                          }}
                        >
                          {district}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Modal Origin Selector: Dropdown with All 30 Districts + Quick Top Chips */
                <div>
                  <div ref={fromDropdownRef} className="sjhHeroCard__destSelectorWrap">
                    <button
                      id={`${idPrefix}-from`}
                      type="button"
                      className="sjhHeroCard__destSelectBtn"
                      onClick={() => {
                        if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                        setIsFromDropdownOpen((prev) => !prev);
                      }}
                      aria-haspopup="listbox"
                      aria-expanded={isFromDropdownOpen}
                    >
                      <span className="sjhHeroCard__destSelectVal">
                        {draft.from || "Select Origin District"}
                      </span>
                      <span className="sjhHeroCard__destSelectChevron" aria-hidden="true">
                        {isFromDropdownOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {isFromDropdownOpen && (
                      <div className="sjhFlow__dropdownModal" role="listbox">
                        {ODISHA_DISTRICTS.map((district) => (
                          <button
                            key={district}
                            type="button"
                            role="option"
                            aria-selected={draft.from === district}
                            className={`sjhHeroCard__destDropdownItem ${draft.from === district ? "is-active" : ""}`}
                            onClick={() => {
                              if (district === "Other City / State") {
                                setIsCustomFrom(true);
                                setField("from", "");
                              } else {
                                setIsCustomFrom(false);
                                setField("from", district);
                              }
                              setIsFromDropdownOpen(false);
                            }}
                          >
                            {district}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Top Origin Quick Chips for fastest 1-tap selection */}
                  <div className="sjhFlow__fromChips" role="group" aria-label="Quick origin selection">
                    {["Bhubaneswar", "Cuttack", "Puri", "Mayurbhanj (Baripada)", "Ganjam (Berhampur)", "Sundargarh (Rourkela)", "Sambalpur", "Balasore"].map((city) => (
                      <button
                        key={city}
                        type="button"
                        className={`sjhFlow__chip ${draft.from === city ? "is-active" : ""}`}
                        onClick={() => {
                          setIsCustomFrom(false);
                          setField("from", city);
                          setIsFromDropdownOpen(false);
                        }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>

                  {/* Custom city input if "Other City / State" or custom */}
                  {(isCustomFrom || (!ODISHA_DISTRICTS.includes(draft.from as any) && draft.from)) && (
                    <div className="sjhHero__plannerValueWrap" style={{ marginTop: "8px" }}>
                      <input
                        id={`${idPrefix}-from-custom`}
                        className="sjhHero__plannerInput"
                        type="text"
                        value={draft.from}
                        onChange={(e) => {
                          setField("from", e.target.value);
                        }}
                        placeholder="Enter your origin city / state"
                      />
                    </div>
                  )}
                </div>
              )}

              {errors.from && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.from}
                </span>
              )}
            </div>

            {/* DESTINATION */}
            <div className={`sjhHero__plannerRow sjhHeroCard__destRow ${errors.destination ? "has-error" : ""}`} style={{ paddingTop: "6px" }}>
              <label className="sjhHero__plannerLabel" htmlFor={`${idPrefix}-dest`}>
                WHERE WOULD YOU LIKE TO GO? *
              </label>

              {variant === "hero" ? (
                /* Compact Destination Selector Dropdown (Requirement 6) */
                <div ref={destDropdownRef} className="sjhHeroCard__destSelectorWrap">
                  <button
                    type="button"
                    className="sjhHeroCard__destSelectBtn"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onFormTouch?.();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFormTouch?.();
                      setIsFromDropdownOpen(false);
                      setIsDestDropdownOpen((prev) => {
                        const next = !prev;
                        onDropdownStateChange?.(next);
                        return next;
                      });
                    }}
                    aria-haspopup="listbox"
                    aria-expanded={isDestDropdownOpen}
                  >
                    <span className="sjhHeroCard__destSelectVal">
                      {draft.destination || "Select Destination"}
                    </span>
                    <span className="sjhHeroCard__destSelectChevron" aria-hidden="true">
                      {isDestDropdownOpen ? "▲" : "▼"}
                    </span>
                  </button>


                  {isDestDropdownOpen && (
                    <div className="sjhHeroCard__destDropdown" role="listbox">
                      {SUGGESTED_DESTINATIONS.map((dest) => (
                        <button
                          key={dest}
                          type="button"
                          role="option"
                          aria-selected={draft.destination === dest}
                          className={`sjhHeroCard__destDropdownItem ${draft.destination === dest ? "is-active" : ""}`}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            onFormTouch?.();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onFormTouch?.();
                            onDestinationTouch?.();
                            if (dest === "Customized Journey") {
                              setIsCustomDest(true);
                              setField("destination", "Customized Journey");
                            } else {
                              setIsCustomDest(false);
                              setField("destination", dest);
                            }
                            setIsDestDropdownOpen(false);
                            onDropdownStateChange?.(false);
                          }}
                        >
                          {dest}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* 8-Destination 2-Column Grid (Modal) */
                <div className="sjhFlow__destGrid2Col" role="group" aria-label="Select destination">
                  {SUGGESTED_DESTINATIONS.map((dest) => {
                    const isSelected = draft.destination === dest || (dest === "Customized Journey" && isCustomDest);
                    return (
                      <button
                        key={dest}
                        type="button"
                        className={`sjhFlow__destChip ${isSelected ? "is-active" : ""}`}
                        onClick={() => {
                          if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                          }
                          onDestinationTouch?.();
                          if (dest === "Customized Journey") {
                            setIsCustomDest(true);
                            setField("destination", "Customized Journey");
                          } else {
                            setIsCustomDest(false);
                            setField("destination", dest);
                          }
                        }}
                      >
                        {dest}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Optional Custom Destination Input if Customized or typed */}
              {isCustomDest && (
                <div className="sjhHero__plannerValueWrap" style={{ marginTop: "8px" }}>
                  <input
                    id={`${idPrefix}-dest`}
                    className="sjhHero__plannerInput"
                    type="text"
                    value={draft.destination === "Customized Journey" ? "" : draft.destination}
                    onChange={(e) => {
                      onFormTouch?.();
                      onDestinationTouch?.();
                      setField("destination", e.target.value);
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onFormTouch?.();
                      if (variant === "hero") {
                        e.preventDefault();
                        onPromoteToSheet?.("dest");
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFormTouch?.();
                      if (variant === "hero") {
                        e.preventDefault();
                        onPromoteToSheet?.("dest");
                      }
                    }}
                    onFocus={handleInputFocus}
                    placeholder="Specify destination or region"
                    readOnly={variant === "hero"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        (e.target as HTMLElement).blur();
                      }
                    }}
                  />
                </div>
              )}

              {errors.destination && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.destination}
                </span>
              )}
            </div>
          </div>

          {/* CONTINUE BUTTON */}
          <div className="sjhFlow__actionArea">
            <button
              type="submit"
              className="sjhHero__plannerCta"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onFormTouch?.();
              }}
            >
              <span>CONTINUE</span>
              <span className="sjhHero__plannerCtaArrow" aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* STEP 2 / 7: DATES (FLEXIBLE OR EXACT + DURATION)         */}
      {/* ======================================================== */}
      {step === 2 && (
        <form onSubmit={handleNextStep2} className="sjhFlow__form sjhFlow__stepAnimated">
          <div className="sjhFlow__scrollArea">
            <div className="sjhHero__plannerRow">
              <span className="sjhHero__plannerLabel">WHEN WOULD YOU LIKE TO TRAVEL?</span>
              <div className="sjhHero__whenPills" role="radiogroup" aria-label="Date mode">
                <button
                  type="button"
                  className={`sjhHero__whenPill ${draft.dateMode === "flexible" ? "is-active" : ""}`}
                  onClick={() => setField("dateMode", "flexible")}
                  role="radio"
                  aria-checked={draft.dateMode === "flexible"}
                >
                  My dates are flexible
                </button>
                <button
                  type="button"
                  className={`sjhHero__whenPill ${draft.dateMode === "specific" ? "is-active" : ""}`}
                  onClick={() => setField("dateMode", "specific")}
                  role="radio"
                  aria-checked={draft.dateMode === "specific"}
                >
                  I know my dates
                </button>
              </div>

              {/* Exact Dates Picker */}
              {draft.dateMode === "specific" ? (
                <div className="sjhFlow__dateGrid">
                  <div className={`sjhFlow__dateCol ${errors.date ? "has-error" : ""}`}>
                    <label className="sjhFlow__dateLabel" htmlFor={`${idPrefix}-dep`}>
                      Departure Date *
                    </label>
                    <input
                      id={`${idPrefix}-dep`}
                      type="date"
                      className="sjhHero__dateInput"
                      min={todayStr}
                      value={draft.date || ""}
                      onPointerDown={(e) => e.stopPropagation()}
                      onChange={(e) => setField("date", e.target.value)}
                      onFocus={handleInputFocus}
                    />
                    {errors.date && (
                      <span className="sjhHero__plannerError" role="alert">
                        {errors.date}
                      </span>
                    )}
                  </div>

                  <div className={`sjhFlow__dateCol ${errors.returnDate ? "has-error" : ""}`}>
                    <label className="sjhFlow__dateLabel" htmlFor={`${idPrefix}-ret`}>
                      Return Date
                    </label>
                    <input
                      id={`${idPrefix}-ret`}
                      type="date"
                      className="sjhHero__dateInput"
                      min={draft.date || todayStr}
                      value={draft.returnDate || ""}
                      onPointerDown={(e) => e.stopPropagation()}
                      onChange={(e) => setField("returnDate", e.target.value)}
                      onFocus={handleInputFocus}
                    />
                    {errors.returnDate && (
                      <span className="sjhHero__plannerError" role="alert">
                        {errors.returnDate}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* Flexible Dates Mode */
                <div className="sjhFlow__flexibleWrap">
                  <div className={`sjhFlow__dateCol ${errors.preferredMonth ? "has-error" : ""}`}>
                    <label className="sjhFlow__dateLabel" htmlFor={`${idPrefix}-month`}>
                      Preferred Month *
                    </label>
                    <select
                      id={`${idPrefix}-month`}
                      className="sjhHero__plannerInput"
                      value={draft.preferredMonth || ""}
                      onChange={(e) => setField("preferredMonth", e.target.value)}
                      style={{ background: "#1C1914", padding: "8px 10px", borderRadius: "6px" }}
                    >
                      <option value="">Select a preferred month</option>
                      {upcomingMonths.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    {errors.preferredMonth && (
                      <span className="sjhHero__plannerError" role="alert">
                        {errors.preferredMonth}
                      </span>
                    )}
                  </div>

                  <div className="sjhFlow__dateCol" style={{ marginTop: "6px" }}>
                    <span className="sjhFlow__dateLabel">Approximate Duration (Optional)</span>
                    <div className="sjhFlow__durationChips">
                      {["3–5 days", "7–10 days", "12–15 days", "2+ weeks"].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          className={`sjhFlow__chip ${draft.approximateDuration === dur ? "is-active" : ""}`}
                          onClick={() =>
                            setField("approximateDuration", draft.approximateDuration === dur ? "" : dur)
                          }
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sjhFlow__actionArea">
            <button type="submit" className="sjhHero__plannerCta">
              <span>CONTINUE</span>
              <span className="sjhHero__plannerCtaArrow" aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* STEP 3 / 7: TRAVELLERS (ADULTS, CHILDREN, INFANTS)       */}
      {/* ======================================================== */}
      {step === 3 && (
        <form onSubmit={handleNextStep3} className="sjhFlow__form sjhFlow__stepAnimated">
          <div className="sjhFlow__scrollArea">
            <div className="sjhHero__plannerRow">
              <span className="sjhHero__plannerLabel">WHO IS TRAVELLING?</span>
              <div className="sjhHero__travellersGrid">
                {/* Adults */}
                <div className="sjhHero__stepperItem">
                  <span className="sjhHero__stepperLabel">Adults (12y+) *</span>
                  <div className="sjhHero__stepperControls">
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => setField("adults", Math.max(1, draft.adults - 1))}
                      disabled={draft.adults <= 1}
                      aria-label="Decrease adults"
                    >
                      −
                    </button>
                    <span className="sjhHero__stepperCount">{draft.adults}</span>
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => setField("adults", Math.min(20, draft.adults + 1))}
                      aria-label="Increase adults"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="sjhHero__stepperItem">
                  <span className="sjhHero__stepperLabel">Children (2–11y)</span>
                  <div className="sjhHero__stepperControls">
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => setField("children", Math.max(0, draft.children - 1))}
                      disabled={draft.children <= 0}
                      aria-label="Decrease children"
                    >
                      −
                    </button>
                    <span className="sjhHero__stepperCount">{draft.children}</span>
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => setField("children", Math.min(10, draft.children + 1))}
                      aria-label="Increase children"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="sjhHero__stepperItem">
                  <span className="sjhHero__stepperLabel">Infants (&lt;2y)</span>
                  <div className="sjhHero__stepperControls">
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => setField("infants", Math.max(0, (draft.infants || 0) - 1))}
                      disabled={!draft.infants || draft.infants <= 0}
                      aria-label="Decrease infants"
                    >
                      −
                    </button>
                    <span className="sjhHero__stepperCount">{draft.infants || 0}</span>
                    <button
                      type="button"
                      className="sjhHero__stepperBtn"
                      onClick={() => setField("infants", Math.min(6, (draft.infants || 0) + 1))}
                      aria-label="Increase infants"
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

          <div className="sjhFlow__actionArea">
            <button type="submit" className="sjhHero__plannerCta">
              <span>CONTINUE</span>
              <span className="sjhHero__plannerCtaArrow" aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* STEP 4 / 7: JOURNEY TYPE (VERIFIED SJH SERVICES)         */}
      {/* ======================================================== */}
      {step === 4 && (
        <form onSubmit={handleNextStep4} className="sjhFlow__form sjhFlow__stepAnimated">
          <div className="sjhFlow__scrollArea">
            <div className={`sjhHero__plannerRow ${errors.journeyType ? "has-error" : ""}`}>
              <label className="sjhHero__plannerLabel">SELECT YOUR JOURNEY INTEREST *</label>
              <div className="sjhFlow__typeList" role="radiogroup" aria-label="Journey Type">
                {JOURNEY_TYPE_OPTIONS.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`sjhFlow__typeRow ${draft.journeyType === type ? "is-selected" : ""}`}
                    onClick={() => setField("journeyType", type)}
                    role="radio"
                    aria-checked={draft.journeyType === type}
                  >
                    <span className="sjhFlow__typeLabel">{type}</span>
                    {draft.journeyType === type && <span className="sjhFlow__typeDot" />}
                  </button>
                ))}
              </div>
              {errors.journeyType && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.journeyType}
                </span>
              )}
            </div>
          </div>

          <div className="sjhFlow__actionArea">
            <button type="submit" className="sjhHero__plannerCta">
              <span>CONTINUE</span>
              <span className="sjhHero__plannerCtaArrow" aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* STEP 5 / 7: YOUR DETAILS (NAME, PHONE, OPTIONAL EMAIL)   */}
      {/* ======================================================== */}
      {step === 5 && (
        <form onSubmit={handleNextStep5} className="sjhFlow__form sjhFlow__stepAnimated">
          <div className="sjhFlow__scrollArea">
            {/* NAME */}
            <div className={`sjhHero__plannerRow ${errors.name ? "has-error" : ""}`}>
              <label className="sjhHero__plannerLabel" htmlFor={`${idPrefix}-name`}>
                FULL NAME *
              </label>
              <div className="sjhHero__plannerValueWrap">
                <input
                  id={`${idPrefix}-name`}
                  className="sjhHero__plannerInput"
                  type="text"
                  value={draft.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onPointerDown={(e) => e.stopPropagation()}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  onFocus={handleInputFocus}
                />
              </div>
              {errors.name && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            {/* PHONE */}
            <div className={`sjhHero__plannerRow ${errors.phone ? "has-error" : ""}`}>
              <label className="sjhHero__plannerLabel" htmlFor={`${idPrefix}-phone`}>
                PHONE NUMBER (WHATSAPP CONNECTED) *
              </label>
              <div className="sjhHero__plannerValueWrap">
                <input
                  id={`${idPrefix}-phone`}
                  className="sjhHero__plannerInput"
                  type="tel"
                  inputMode="tel"
                  value={draft.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  onPointerDown={(e) => e.stopPropagation()}
                  placeholder="+91 XXXXX XXXXX"
                  autoComplete="tel"
                  onFocus={handleInputFocus}
                />
              </div>
              {errors.phone && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* EMAIL */}
            <div className={`sjhHero__plannerRow ${errors.email ? "has-error" : ""}`}>
              <label className="sjhHero__plannerLabel" htmlFor={`${idPrefix}-email`}>
                EMAIL ADDRESS (OPTIONAL)
              </label>
              <div className="sjhHero__plannerValueWrap">
                <input
                  id={`${idPrefix}-email`}
                  className="sjhHero__plannerInput"
                  type="email"
                  inputMode="email"
                  value={draft.email || ""}
                  onChange={(e) => setField("email", e.target.value)}
                  onPointerDown={(e) => e.stopPropagation()}
                  placeholder="example@email.com"
                  autoComplete="email"
                  onFocus={handleInputFocus}
                />
              </div>
              {errors.email && (
                <span className="sjhHero__plannerError" role="alert">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="sjhFlow__actionArea">
            <button type="submit" className="sjhHero__plannerCta">
              <span>CONTINUE</span>
              <span className="sjhHero__plannerCtaArrow" aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* STEP 6 / 7: NOTES (SPECIAL REQUIREMENTS)                 */}
      {/* ======================================================== */}
      {step === 6 && (
        <form onSubmit={handleNextStep6} className="sjhFlow__form sjhFlow__stepAnimated">
          <div className="sjhFlow__scrollArea">
            <div className="sjhHero__plannerRow">
              <label className="sjhHero__plannerLabel" htmlFor={`${idPrefix}-notes`}>
                ANYTHING WE SHOULD KNOW? (OPTIONAL)
              </label>
              <textarea
                id={`${idPrefix}-notes`}
                className="sjhFlow__textarea"
                rows={4}
                value={draft.notes || ""}
                onChange={(e) => setField("notes", e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder="Hotel preference, senior citizens, pickup requirements, special pilgrimage needs, coach preference, etc."
                onFocus={handleInputFocus}
              />
            </div>
          </div>

          <div className="sjhFlow__actionArea">
            <button type="submit" className="sjhHero__plannerCta">
              <span>REVIEW JOURNEY DETAILS</span>
              <span className="sjhHero__plannerCtaArrow" aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* STEP 7 / 7: REVIEW ENQUIRY + WHATSAPP HANDOFF            */}
      {/* ======================================================== */}
      {step === 7 && !isHandoffDone && (
        <div className="sjhFlow__form sjhFlow__stepAnimated">
          <div className="sjhFlow__scrollArea">
            <div className="sjhReviewCard">
              {/* Route */}
              <div className="sjhReviewCard__route">
                <span className="sjhReviewCard__city">{draft.from}</span>
                <span className="sjhReviewCard__arrow">↓</span>
                <span className="sjhReviewCard__city">{draft.destination}</span>
              </div>

              {/* Grid */}
              <div className="sjhReviewCard__grid">
                <div className="sjhReviewCard__cell">
                  <span className="sjhReviewCard__label">DATES</span>
                  <span className="sjhReviewCard__val">{formatWhenSummary(draft)}</span>
                </div>

                <div className="sjhReviewCard__cell">
                  <span className="sjhReviewCard__label">TRAVELLERS</span>
                  <span className="sjhReviewCard__val">
                    {formatTravellersSummary(draft.adults, draft.children, draft.infants)}
                  </span>
                </div>

                <div className="sjhReviewCard__cell sjhReviewCard__cell--full">
                  <span className="sjhReviewCard__label">JOURNEY TYPE</span>
                  <span className="sjhReviewCard__val">{draft.journeyType}</span>
                </div>

                <div className="sjhReviewCard__cell sjhReviewCard__cell--full">
                  <span className="sjhReviewCard__label">CONTACT</span>
                  <span className="sjhReviewCard__val">
                    {draft.name} · {draft.phone}
                    {draft.email ? ` · ${draft.email}` : ""}
                  </span>
                </div>

                {draft.notes && draft.notes.trim() && (
                  <div className="sjhReviewCard__cell sjhReviewCard__cell--full">
                    <span className="sjhReviewCard__label">NOTES</span>
                    <div className="sjhReviewCard__notes">{draft.notes}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Review Actions */}
          <div className="sjhFlow__actionArea">
            <div className="sjhFlow__actions">
              <button
                type="button"
                className="sjhFlow__whatsappBtn"
                onClick={handleContinueOnWhatsApp}
              >
                <svg className="sjhFlow__whatsappIcon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.124-.518-1.503-.623-2.457-2.158-2.531-2.257-.074-.099-.606-.807-.606-1.537 0-.73.383-1.09.52-1.236.143-.146.312-.182.416-.182.104 0 .208.002.299.006.096.004.225-.036.352.269.13.312.442 1.077.481 1.156.039.078.065.17.013.273-.052.104-.078.17-.156.26-.078.091-.164.204-.234.273-.078.078-.16.162-.069.318.091.156.403.665.864 1.075.594.528 1.096.691 1.252.769.156.078.247.065.338-.039.091-.104.39-.455.494-.611.104-.156.208-.13.352-.078.143.052.91.429 1.066.507.156.078.26.117.299.182.039.065.039.377-.105.782zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.178L2 22l4.981-1.396A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
                <span>CONTINUE ON WHATSAPP →</span>
              </button>

              <button
                type="button"
                className="sjhFlow__secondaryBtn"
                onClick={() => transitionToStep(1)}
              >
                EDIT DETAILS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* WHATSAPP HANDOFF CONFIRMATION STATE                      */}
      {/* ======================================================== */}
      {isHandoffDone && (
        <div className="sjhFlow__scrollArea">
          <div className="sjhHandoff">
            <div className="sjhHandoff__iconRing">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.124-.518-1.503-.623-2.457-2.158-2.531-2.257-.074-.099-.606-.807-.606-1.537 0-.73.383-1.09.52-1.236.143-.146.312-.182.416-.182.104 0 .208.002.299.006.096.004.225-.036.352.269.13.312.442 1.077.481 1.156.039.078.065.17.013.273-.052.104-.078.17-.156.26-.078.091-.164.204-.234.273-.078.078-.16.162-.069.318.091.156.403.665.864 1.075.594.528 1.096.691 1.252.769.156.078.247.065.338-.039.091-.104.39-.455.494-.611.104-.156.208-.13.352-.078.143.052.91.429 1.066.507.156.078.26.117.299.182.039.065.039.377-.105.782zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.178L2 22l4.981-1.396A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
            </div>

            <h3 className="sjhHandoff__title">Ready to Send on WhatsApp</h3>

            <p className="sjhHandoff__desc">
              WhatsApp will open with your journey details ready to send.
            </p>

            <div className="sjhHandoff__note">
              Please tap <strong>Send</strong> in WhatsApp to reach our concierge.
            </div>

            {popupBlocked || (
              <a
                href={generatedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sjhFlow__whatsappBtn"
                style={{ width: "100%", textDecoration: "none" }}
              >
                <span>OPEN WHATSAPP NOW →</span>
              </a>
            )}

            <div className="sjhFlow__actionsRow" style={{ width: "100%" }}>
              <button
                type="button"
                className="sjhFlow__secondaryBtn"
                style={{ flex: 1 }}
                onClick={() => {
                  setIsHandoffDone(false);
                  transitionToStep(7);
                }}
              >
                Review Details
              </button>
              <button
                type="button"
                className="sjhFlow__secondaryBtn"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
