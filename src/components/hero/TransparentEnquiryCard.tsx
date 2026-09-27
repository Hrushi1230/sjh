import React, { useState, useRef, useEffect, useMemo } from "react";
import { JourneyDraft } from "./plannerData";
import { createWhatsAppUrl, createPhoneUrl, buildJourneyWhatsAppMessage } from "../../utils/contact";

const POPULAR_CITIES = [
  "Bhubaneswar",
  "Cuttack",
  "Puri",
  "Kolkata",
  "Delhi / NCR",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Raipur",
  "Visakhapatnam",
  "Rourkela",
  "Sambalpur",
];

const POPULAR_DESTINATIONS = [
  "Puri Jagannath Dham",
  "Konark Sun Temple & Beach",
  "Chilika Lake & Mangalajodi",
  "Golden Triangle Odisha",
  "Kashmir Valley",
  "Royal Rajasthan",
  "Kerala Backwaters",
  "Customized Odisha Tour",
];

interface TransparentEnquiryCardProps {
  draft: JourneyDraft;
  onDraftChange: (draft: JourneyDraft) => void;
  onClose: () => void;
  onExploreJourneys?: () => void;
  onPlanMyTrip?: (draft: JourneyDraft) => void;
  onFormTouch?: () => void;
}

export function TransparentEnquiryCard({
  draft,
  onDraftChange,
  onClose,
  onExploreJourneys,
  onPlanMyTrip,
  onFormTouch,
}: TransparentEnquiryCardProps) {
  const [activeTab, setActiveTab] = useState<"explore" | "plan">("plan");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [stepDir, setStepDir] = useState<"next" | "back">("next");
  const [isFromPickerOpen, setIsFromPickerOpen] = useState(false);
  const [isDestPickerOpen, setIsDestPickerOpen] = useState(false);
  const [isTypingFrom, setIsTypingFrom] = useState(false);
  const [isTypingDest, setIsTypingDest] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent | PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsFromPickerOpen(false);
        setIsDestPickerOpen(false);
        setIsTypingFrom(false);
        setIsTypingDest(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFromPickerOpen(false);
        setIsDestPickerOpen(false);
        setIsTypingFrom(false);
        setIsTypingDest(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const filteredCities = useMemo(() => {
    if (!isTypingFrom) return POPULAR_CITIES;
    const query = (draft.from || "").trim().toLowerCase();
    if (!query) return POPULAR_CITIES;
    const matched = POPULAR_CITIES.filter((c) => c.toLowerCase().includes(query));
    return matched.length > 0 ? matched : POPULAR_CITIES;
  }, [draft.from, isTypingFrom]);

  const filteredDestinations = useMemo(() => {
    if (!isTypingDest) return POPULAR_DESTINATIONS;
    const query = (draft.destination || "").trim().toLowerCase();
    if (!query) return POPULAR_DESTINATIONS;
    const matched = POPULAR_DESTINATIONS.filter((d) => d.toLowerCase().includes(query));
    return matched.length > 0 ? matched : POPULAR_DESTINATIONS;
  }, [draft.destination, isTypingDest]);

  const handleFieldChange = (field: keyof JourneyDraft, value: any) => {
    onFormTouch?.();
    onDraftChange({
      ...draft,
      [field]: value,
    });
  };

  const handleExploreClick = () => {
    setActiveTab("explore");
    if (onExploreJourneys) {
      onExploreJourneys();
    } else {
      const el = document.getElementById("sacred-journeys") || document.getElementById("destinations");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handlePlanClick = () => {
    setActiveTab("plan");
  };

  const goToStep = (step: 1 | 2 | 3, dir: "next" | "back") => {
    setStepDir(dir);
    setCurrentStep(step);
  };

  const handleAdultsChange = (delta: number) => {
    const nextVal = Math.min(8, Math.max(1, (draft.adults || 2) + delta));
    handleFieldChange("adults", nextVal);
  };

  const handleChildrenChange = (delta: number) => {
    const nextVal = Math.min(6, Math.max(0, (draft.children || 0) + delta));
    handleFieldChange("children", nextVal);
  };

  // Build full WhatsApp URL using the official business formatter
  const getWhatsAppSubmissionUrl = () => {
    const message = buildJourneyWhatsAppMessage({
      ...draft,
      from: draft.from && draft.from.trim() ? draft.from.trim() : "Not specified yet",
      destination: draft.destination && draft.destination.trim() ? draft.destination.trim() : "Flexible / Odisha",
      date: draft.date || "Flexible Dates",
      name: draft.name && draft.name.trim() ? draft.name.trim() : "Guest",
      phone: draft.phone && draft.phone.trim() ? draft.phone.trim() : "To be shared on WhatsApp",
    });
    return createWhatsAppUrl(message);
  };

  // Instant quick WhatsApp URL for Step 1
  const getQuickWhatsAppUrl = () => {
    const fromText = draft.from && draft.from.trim() ? draft.from.trim() : "Not specified yet";
    const destText = draft.destination && draft.destination.trim() ? draft.destination.trim() : "Flexible / All Odisha";
    const dateText = draft.date && draft.date.trim() ? draft.date.trim() : "Flexible dates";
    const typeText = draft.journeyType && draft.journeyType !== "Not Sure Yet" ? draft.journeyType : "Curated Holidays";

    const msg = [
      "Hello Shree Jagannath Holidays,",
      "",
      "I would like to start a travel enquiry from your website:",
      "",
      `📍 Travelling From: ${fromText}`,
      `🗺️ Destination Interest: ${destText}`,
      `📅 Travel Date: ${dateText}`,
      `✨ Journey Type: ${typeText}`,
      "",
      "Please assist me with curated options and planning.",
    ].join("\n");

    return createWhatsAppUrl(msg);
  };

  const handleFinalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onPlanMyTrip) {
      onPlanMyTrip(draft);
    }
    const url = getWhatsAppSubmissionUrl();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={cardRef}
      className="sjhEnquiryCardWrapper"
      onPointerDownCapture={() => onFormTouch?.()}
      onTouchStartCapture={() => onFormTouch?.()}
      onClickCapture={() => onFormTouch?.()}
      onFocusCapture={() => onFormTouch?.()}
      onKeyDownCapture={() => onFormTouch?.()}
      onPointerDown={(e) => {
        e.stopPropagation();
        onFormTouch?.();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        onFormTouch?.();
      }}
    >
      {/* Top Navigation Tabs */}
      <div className="sjhEnquiry__topTabs" role="tablist" aria-label="Journey actions">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "explore"}
          className={`sjhEnquiry__tabBtn ${activeTab === "explore" ? "sjhEnquiry__tabBtn--active" : "sjhEnquiry__tabBtn--solid"}`}
          onClick={handleExploreClick}
        >
          Explore Journeys
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "plan"}
          className={`sjhEnquiry__tabBtn ${activeTab === "plan" ? "sjhEnquiry__tabBtn--ghostActive" : "sjhEnquiry__tabBtn--ghost"}`}
          onClick={handlePlanClick}
        >
          Plan My Trip
        </button>
      </div>

      {/* Main Transparent Enquiry Card */}
      <div className="sjhEnquiryCard">
        {/* Header with Step Indicator & Back Button */}
        <div className="sjhEnquiry__header">
          <div className="sjhEnquiry__titleWrap">
            {currentStep > 1 && (
              <button
                type="button"
                className="sjhEnquiry__backBtn"
                onClick={() => goToStep((currentStep - 1) as 1 | 2, "back")}
                aria-label={`Go back to step ${currentStep - 1}`}
                title="Go back"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            )}

            <span className="sjhEnquiry__sparkleIcon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"
                  fill="url(#sparkle-grad)"
                  stroke="#EBC678"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <circle cx="19" cy="5" r="1.5" fill="#EBC678" />
                <circle cx="5" cy="18" r="1.2" fill="#EBC678" />
                <defs>
                  <linearGradient id="sparkle-grad" x1="3" y1="2" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFE7A3" />
                    <stop offset="1" stopColor="#B99455" />
                  </linearGradient>
                </defs>
              </svg>
            </span>

            <h2 className="sjhEnquiry__title">
              {currentStep === 1 && "Start your travel enquiry"}
              {currentStep === 2 && "Travellers & Contact"}
              {currentStep === 3 && "Review & WhatsApp Enquiry"}
            </h2>
          </div>

          <div className="sjhEnquiry__headerActions">
            {/* 3-Step Storyboard Indicator */}
            <div className="sjhEnquiry__stepIndicator" aria-label={`Step ${currentStep} of 3`}>
              <span className={`sjhEnquiry__stepDot ${currentStep >= 1 ? "is-active" : ""}`} />
              <span className={`sjhEnquiry__stepDot ${currentStep >= 2 ? "is-active" : ""}`} />
              <span className={`sjhEnquiry__stepDot ${currentStep >= 3 ? "is-active" : ""}`} />
            </div>

            {/* Minimize / Collapse to Pill button */}
            <button
              type="button"
              className="sjhEnquiry__minimizeBtn"
              onClick={onClose}
              aria-label="Minimize travel enquiry"
              title="Minimize to Book Now pill"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        {/* ==============================================
            STEP 1: JOURNEY & DATES
            ============================================== */}
        {currentStep === 1 && (
          <div className={`sjhEnquiry__stepContent sjhEnquiry__stepContent--${stepDir}`}>
            {/* Quick City Suggestions Popover */}
            {isFromPickerOpen && (
              <div
                className="sjhEnquiry__popover"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onFormTouch?.();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  onFormTouch?.();
                }}
              >
                <div className="sjhEnquiry__popoverHeader">
                  <span className="sjhEnquiry__popoverTitle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EBC678" strokeWidth="2.5">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    POPULAR DEPARTURE CITIES
                  </span>
                  <button
                    type="button"
                    className="sjhEnquiry__popoverClose"
                    onClick={() => setIsFromPickerOpen(false)}
                    aria-label="Close city suggestions"
                  >
                    ✕
                  </button>
                </div>
                <div className="sjhEnquiry__chipsGrid">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      className={`sjhEnquiry__chipBtn ${draft.from?.toLowerCase() === city.toLowerCase() ? "is-selected" : ""}`}
                      onClick={() => {
                        handleFieldChange("from", city);
                        setIsTypingFrom(false);
                        setIsFromPickerOpen(false);
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Destination Suggestions Popover */}
            {isDestPickerOpen && (
              <div
                className="sjhEnquiry__popover"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onFormTouch?.();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  onFormTouch?.();
                }}
              >
                <div className="sjhEnquiry__popoverHeader">
                  <span className="sjhEnquiry__popoverTitle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EBC678" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="12 8 8 12 12 16 16 12 12 8" />
                    </svg>
                    POPULAR DESTINATIONS
                  </span>
                  <button
                    type="button"
                    className="sjhEnquiry__popoverClose"
                    onClick={() => setIsDestPickerOpen(false)}
                    aria-label="Close destination suggestions"
                  >
                    ✕
                  </button>
                </div>
                <div className="sjhEnquiry__chipsGrid">
                  {filteredDestinations.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      className={`sjhEnquiry__chipBtn ${draft.destination?.toLowerCase() === dest.toLowerCase() ? "is-selected" : ""}`}
                      onClick={() => {
                        handleFieldChange("destination", dest);
                        setIsTypingDest(false);
                        setIsDestPickerOpen(false);
                      }}
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="sjhEnquiry__grid">
              {/* Field 1: Travelling From */}
              <div className="sjhEnquiry__field">
                <label htmlFor="sjh-enquiry-from" className="sjhEnquiry__label">
                  TRAVELLING FROM
                </label>
                <div
                  className="sjhEnquiry__inputWrap"
                  onClick={() => {
                    fromInputRef.current?.focus();
                    setIsTypingFrom(false);
                    setIsFromPickerOpen(true);
                    setIsDestPickerOpen(false);
                  }}
                >
                  <input
                    ref={fromInputRef}
                    id="sjh-enquiry-from"
                    type="text"
                    className="sjhEnquiry__input"
                    placeholder="Enter city"
                    value={draft.from}
                    onChange={(e) => {
                      handleFieldChange("from", e.target.value);
                      setIsTypingFrom(true);
                      setIsFromPickerOpen(true);
                    }}
                    onFocus={() => {
                      setIsTypingFrom(false);
                      setIsFromPickerOpen(true);
                      setIsDestPickerOpen(false);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTypingFrom(false);
                      setIsFromPickerOpen(true);
                      setIsDestPickerOpen(false);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="sjhEnquiry__icon sjhEnquiry__iconBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fromInputRef.current?.focus();
                      setIsTypingFrom(false);
                      setIsFromPickerOpen((prev) => !prev);
                      setIsDestPickerOpen(false);
                    }}
                    title="Select departure city"
                    aria-label="Select departure city"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Field 2: Destination Interest */}
              <div className="sjhEnquiry__field">
                <label htmlFor="sjh-enquiry-dest" className="sjhEnquiry__label">
                  DESTINATION INTEREST
                </label>
                <div
                  className="sjhEnquiry__inputWrap"
                  onClick={() => {
                    destInputRef.current?.focus();
                    setIsTypingDest(false);
                    setIsDestPickerOpen(true);
                    setIsFromPickerOpen(false);
                  }}
                >
                  <input
                    ref={destInputRef}
                    id="sjh-enquiry-dest"
                    type="text"
                    className="sjhEnquiry__input"
                    placeholder="Where to? (optional)"
                    value={draft.destination}
                    onChange={(e) => {
                      handleFieldChange("destination", e.target.value);
                      setIsTypingDest(true);
                      setIsDestPickerOpen(true);
                    }}
                    onFocus={() => {
                      setIsTypingDest(false);
                      setIsDestPickerOpen(true);
                      setIsFromPickerOpen(false);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTypingDest(false);
                      setIsDestPickerOpen(true);
                      setIsFromPickerOpen(false);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="sjhEnquiry__icon sjhEnquiry__iconBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      destInputRef.current?.focus();
                      setIsTypingDest(false);
                      setIsDestPickerOpen((prev) => !prev);
                      setIsFromPickerOpen(false);
                    }}
                    title="Select destination"
                    aria-label="Select destination"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="12 8 8 12 12 16 16 12 12 8" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Field 3: Travel Date */}
              <div className="sjhEnquiry__field">
                <label htmlFor="sjh-enquiry-date" className="sjhEnquiry__label">
                  TRAVEL DATE
                </label>
                <div className="sjhEnquiry__inputWrap">
                  <input
                    id="sjh-enquiry-date"
                    type="date"
                    className="sjhEnquiry__input sjhEnquiry__dateInput"
                    value={draft.date || ""}
                    onChange={(e) => handleFieldChange("date", e.target.value)}
                    onClick={(e) => {
                      try {
                        (e.target as HTMLInputElement).showPicker?.();
                      } catch {}
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  />
                  <span className="sjhEnquiry__icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Field 4: Journey Type */}
              <div className="sjhEnquiry__field">
                <label htmlFor="sjh-enquiry-type" className="sjhEnquiry__label">
                  JOURNEY TYPE
                </label>
                <div
                  className="sjhEnquiry__inputWrap sjhEnquiry__selectWrap"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <select
                    id="sjh-enquiry-type"
                    className="sjhEnquiry__input sjhEnquiry__select"
                    value={draft.journeyType || "Not Sure Yet"}
                    onChange={(e) => handleFieldChange("journeyType", e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <option value="Not Sure Yet">Not Sure Yet</option>
                    <option value="Pilgrimage & Temple Darshan">Pilgrimage & Temple Darshan</option>
                    <option value="Heritage & Cultural">Heritage & Cultural</option>
                    <option value="Family Leisure">Family Leisure</option>
                    <option value="Honeymoon & Luxury">Honeymoon & Luxury</option>
                    <option value="Nature & Wildlife">Nature & Wildlife</option>
                  </select>
                  <span className="sjhEnquiry__icon sjhEnquiry__chevronIcon" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Advance to Step 2 CTA */}
            <button
              type="button"
              className="sjhEnquiry__submitBtn"
              onClick={() => goToStep(2, "next")}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <span>Next: Travellers & Contact</span>
              <span className="sjhEnquiry__submitArrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>

            {/* Bottom Quick Contact Bar */}
            <div
              className="sjhEnquiry__contactBar"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <a
                href={createPhoneUrl()}
                className="sjhEnquiry__contactBtn sjhEnquiry__contactBtn--phone"
                aria-label="Direct Phone Call with Concierge"
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <span className="sjhEnquiry__contactIcon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span>Contact</span>
              </a>

              <a
                href={getQuickWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="sjhEnquiry__contactBtn sjhEnquiry__contactBtn--whatsapp"
                aria-label="Continue Travel Enquiry on WhatsApp"
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <span className="sjhEnquiry__contactIcon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* ==============================================
            STEP 2: TRAVELLERS & CONTACT DETAILS
            ============================================== */}
        {currentStep === 2 && (
          <div className={`sjhEnquiry__stepContent sjhEnquiry__stepContent--${stepDir}`}>
            <div className="sjhEnquiry__grid">
              {/* Field 1: Travellers Stepper */}
              <div className="sjhEnquiry__field">
                <label className="sjhEnquiry__label">
                  TRAVELLERS
                </label>
                <div
                  className="sjhEnquiry__inputWrap sjhEnquiry__stepperWrap"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="sjhEnquiry__stepperBtn"
                    onClick={() => handleAdultsChange(-1)}
                    disabled={draft.adults <= 1}
                    aria-label="Decrease adults"
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    −
                  </button>
                  <span className="sjhEnquiry__stepperVal">
                    {draft.adults || 2} Adults
                  </span>
                  <button
                    type="button"
                    className="sjhEnquiry__stepperBtn"
                    onClick={() => handleAdultsChange(1)}
                    disabled={draft.adults >= 8}
                    aria-label="Increase adults"
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="sjhEnquiry__stepperBtn"
                    style={{ width: "auto", padding: "0 6px", fontSize: "10px" }}
                    onClick={() => handleChildrenChange(draft.children > 0 ? -1 : 1)}
                    title="Add or remove children"
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    {draft.children > 0 ? `${draft.children}K` : "+Kids"}
                  </button>
                </div>
              </div>

              {/* Field 2: Duration */}
              <div className="sjhEnquiry__field">
                <label htmlFor="sjh-enquiry-duration" className="sjhEnquiry__label">
                  DURATION
                </label>
                <div
                  className="sjhEnquiry__inputWrap sjhEnquiry__selectWrap"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <select
                    id="sjh-enquiry-duration"
                    className="sjhEnquiry__input sjhEnquiry__select"
                    value={draft.approximateDuration || "5–7 days"}
                    onChange={(e) => handleFieldChange("approximateDuration", e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <option value="2–3 days">2–3 Days (Weekend)</option>
                    <option value="4–6 days">4–6 Days (Recommended)</option>
                    <option value="7–10 days">7–10 Days (Comprehensive)</option>
                    <option value="10+ days">10+ Days (Extended)</option>
                  </select>
                  <span className="sjhEnquiry__icon sjhEnquiry__chevronIcon" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Field 3: Full Name */}
              <div className="sjhEnquiry__field">
                <label htmlFor="sjh-enquiry-name" className="sjhEnquiry__label">
                  YOUR NAME
                </label>
                <div
                  className="sjhEnquiry__inputWrap"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <input
                    id="sjh-enquiry-name"
                    type="text"
                    className="sjhEnquiry__input"
                    placeholder="Enter your name"
                    value={draft.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    autoComplete="name"
                  />
                  <span className="sjhEnquiry__icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Field 4: WhatsApp Number */}
              <div className="sjhEnquiry__field">
                <label htmlFor="sjh-enquiry-phone" className="sjhEnquiry__label">
                  PHONE / WHATSAPP
                </label>
                <div
                  className="sjhEnquiry__inputWrap"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <input
                    id="sjh-enquiry-phone"
                    type="tel"
                    className="sjhEnquiry__input"
                    placeholder="Mobile number"
                    value={draft.phone || ""}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    autoComplete="tel"
                  />
                  <span className="sjhEnquiry__icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Advance to Step 3 CTA */}
            <div
              className="sjhEnquiry__btnGroup"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="sjhEnquiry__backStepBtn"
                onClick={() => goToStep(1, "back")}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                ← Back
              </button>
              <button
                type="button"
                className="sjhEnquiry__submitBtn sjhEnquiry__submitBtn--flex"
                onClick={() => goToStep(3, "next")}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <span>Review & Dispatch</span>
                <span className="sjhEnquiry__submitArrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ==============================================
            STEP 3: STORYBOARD REVIEW & WHATSAPP SEND
            ============================================== */}
        {currentStep === 3 && (
          <div className={`sjhEnquiry__stepContent sjhEnquiry__stepContent--${stepDir}`}>
            {/* Review Summary Card */}
            <div
              className="sjhEnquiry__summaryBox"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="sjhEnquiry__summaryRow">
                <span className="sjhEnquiry__summaryLabel">
                  <span>📍</span> Route:
                </span>
                <span className="sjhEnquiry__summaryVal">
                  {draft.from?.trim() || "Any City"} → {draft.destination?.trim() || "Flexible / Odisha"}
                </span>
              </div>
              <div className="sjhEnquiry__summaryRow">
                <span className="sjhEnquiry__summaryLabel">
                  <span>📅</span> Date & Style:
                </span>
                <span className="sjhEnquiry__summaryVal">
                  {draft.date || "Flexible Dates"} • {draft.approximateDuration || "4–6 Days"}
                </span>
              </div>
              <div className="sjhEnquiry__summaryRow">
                <span className="sjhEnquiry__summaryLabel">
                  <span>👥</span> Travellers:
                </span>
                <span className="sjhEnquiry__summaryVal">
                  {draft.adults || 2} Adults{draft.children > 0 ? `, ${draft.children} Kids` : ""} • {draft.journeyType || "Curated"}
                </span>
              </div>
              <div className="sjhEnquiry__summaryRow">
                <span className="sjhEnquiry__summaryLabel">
                  <span>👤</span> Guest Contact:
                </span>
                <span className="sjhEnquiry__summaryVal">
                  {draft.name?.trim() || "Guest"}{draft.phone?.trim() ? ` (${draft.phone.trim()})` : ""}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Send Action */}
            <button
              type="button"
              className="sjhEnquiry__submitBtn sjhEnquiry__submitBtn--whatsapp"
              onClick={() => handleFinalSubmit()}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <span className="sjhEnquiry__contactIcon" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </span>
              <span>Send via WhatsApp →</span>
            </button>

            {/* Secondary Row: Call Concierge or Edit Details */}
            <div
              className="sjhEnquiry__contactBar"
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <a
                href={createPhoneUrl()}
                className="sjhEnquiry__contactBtn sjhEnquiry__contactBtn--phone"
                aria-label="Direct Phone Call with Concierge"
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <span className="sjhEnquiry__contactIcon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span>Call Concierge</span>
              </a>

              <button
                type="button"
                className="sjhEnquiry__contactBtn sjhEnquiry__contactBtn--whatsapp"
                onClick={() => goToStep(1, "back")}
                aria-label="Edit enquiry fields"
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <span>✏️ Edit Details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
