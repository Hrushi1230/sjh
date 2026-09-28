import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { MobileCinematicHero } from "./components/hero/MobileCinematicHero";
import { JourneyDraft, getDestinationLabel } from "./components/hero/plannerData";
import { PlannerSessionProvider, usePlannerSession } from "./context/PlannerSessionContext";
import { EditorialExperience } from "./components/editorial/EditorialExperience";
import { TravelThreadRegion } from "./components/thread/TravelThreadRegion";
import { TravelThreadOutro } from "./components/thread/TravelThreadOutro";
import { TrustLedgerSection } from "./components/trust";
import { JourneysAcrossIndiaSection } from "./components/journeysAcrossIndia";
import { JourneyDetailPage } from "./components/journeys/detail/JourneyDetailPage";
import { PlanJourneyModal } from "./components/journeys/PlanJourneyModal";
import { TravelMemoriesPreview } from "./components/travelMemories/TravelMemoriesPreview";
import { TravelMemoriesPage } from "./components/travelMemories/TravelMemoriesPage";
import { FinalJourneyCTA } from "./components/closing/FinalJourneyCTA";
import { SiteFooter } from "./components/closing/SiteFooter";
import { useJourneyRouter } from "./hooks/useJourneyRouter";
import { BUSINESS_INFO } from "./config/business";
import { createPhoneUrl, createWhatsAppUrl } from "./utils/contact";

import "./components/travelMemories/travelMemories.css";
import "./components/closing/closing.css";
import "./components/journeys/detail/journeyDetail.css";

export function App() {
  return (
    <PlannerSessionProvider initialDestination="puri">
      <AppContent />
    </PlannerSessionProvider>
  );
}

function AppContent() {
  const planner = usePlannerSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDestination, setActiveDestination] = useState<
    "puri" | "kashmir" | "rajasthan" | "kerala"
  >("puri");

  const {
    activeJourney,
    navigateToJourney,
    navigateToMemories,
    navigateHome,
    isTravelMemories,
  } = useJourneyRouter();

  const isInternalPageOpen = Boolean(activeJourney || isTravelMemories);

  const handleOpenMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleCreateJourney = useCallback((draft: JourneyDraft) => {
    console.log("[SJH Journey Created]", draft);
  }, []);

  const handleJourneySelect = useCallback((journeyId: string, href: string) => {
    const mapping: Record<string, string> = {
      "sacred-odisha": "puri",
      "kashmir-valley": "kashmir",
      "royal-rajasthan": "rajasthan",
      "kerala-slowly": "kerala",
    };
    navigateToJourney(journeyId, href, mapping[journeyId]);
  }, [navigateToJourney]);

  // If returning to homepage without explicit section target, restore exact previous scroll position
  useLayoutEffect(() => {
    if (!activeJourney && !isTravelMemories) {
      const saved = sessionStorage.getItem("sjh_home_scroll");
      if (saved) {
        const y = parseInt(saved, 10);
        window.scrollTo(0, y);
        if ((window as any).ScrollTrigger) {
          (window as any).ScrollTrigger.refresh();
        }
      }
    }
  }, [activeJourney, isTravelMemories]);

  // Navigate to sections seamlessly across homepage and internal pages
  const handleNavigateSection = useCallback(
    (targetId: string, route?: string) => {
      setMenuOpen(false);

      if (route === "/travel-memories") {
        if (!isTravelMemories) {
          navigateToMemories();
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (isInternalPageOpen) {
        sessionStorage.removeItem("sjh_home_scroll");
        navigateHome();
        const executeScroll = () => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.pushState(null, "", `#${targetId}`);
          }
        };
        setTimeout(executeScroll, 350);
        setTimeout(executeScroll, 750);
        return;
      }

      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${targetId}`);
        }, 60);
      }
    },
    [isInternalPageOpen, isTravelMemories, navigateHome, navigateToMemories]
  );

  // Handle direct hash navigation on initial load or popstate
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (
        hash &&
        [
          "destinations",
          "journeys-across-india",
          "sacred-journeys",
          "pilgrimages",
          "our-heritage",
          "about",
          "why-sjh",
          "travel-memories",
        ].includes(hash)
      ) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 500);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Close planner safely if route changes (Requirement 35)
  useEffect(() => {
    planner.closePlannerSheet();
  }, [activeJourney, isTravelMemories, planner]);

  // Global planner hooks so callers anywhere (Hero, Phase 9, Phase 11, Footer, Menu) open planner seamlessly
  useLayoutEffect(() => {
    const win = window as any;

    win.__SJH_PLANNER_SET_FIELD__ = (field: string, val: any) => {
      if (field === "destination") {
        if (!planner.destinationTouchedByUser) {
          const label = getDestinationLabel(val) || val;
          planner.updateDraftField("destination", label);
        }
      } else if (field === "source") {
        planner.updateDraftField("source", val);
      }
    };

    win.__SJH_PLANNER_OPEN__ = () => {
      planner.openPlannerSheet();
    };

    win.__SJH_PLANNER_CLOSE__ = () => {
      planner.closePlannerSheet();
    };

    win.__SJH_GET_PLANNER_STATE__ = () => {
      return planner.isPlannerSheetOpen ? "open" : "closed";
    };
  }, [planner]);

  return (
    <>
      {/* Standard Homepage Flow: Hero (Phases 1-3) -> Phase 4 -> Phase 5 -> Phase 6 -> Phase 8 -> Phase 9 -> Phase 10 -> Phase 11 -> Phase 12 */}
      <main
        className="sjhMainContainer"
        style={{ display: isInternalPageOpen ? "none" : "block" }}
        aria-hidden={isInternalPageOpen}
      >
        <MobileCinematicHero
          onOpenMenu={handleOpenMenu}
          onOpenPlannerSheet={planner.openPlannerSheet}
          onPlanJourney={() => planner.openPlannerSheet()}
          onCreateJourney={handleCreateJourney}
          onDestinationChange={(dest) => {
            setActiveDestination(dest);
            planner.setActiveHeroDestination(dest);
          }}
          draft={planner.draft}
          onDraftChange={planner.setDraft}
          step={planner.step}
          onStepChange={planner.setStep}
          destinationTouchedByUser={planner.destinationTouchedByUser}
          onDestinationTouched={() => planner.setDestinationTouchedByUser(true)}
          isPlannerSheetOpen={planner.isPlannerSheetOpen}
          isInternalPageOpen={isInternalPageOpen}
        />

        {/* Phase 6: The Travel Thread connecting Phase 5 Editorial Chapters & Outro */}
        <div id="sacred-journeys" style={{ scrollMarginTop: "80px" }}>
          <span id="pilgrimages" style={{ display: "none" }} />
          <TravelThreadRegion activeDestination={activeDestination}>
            <EditorialExperience
              activeDestination={activeDestination}
              assetBase="/assets/sjh-hero"
              onJourneySelect={handleJourneySelect}
            >
              {/* Phase 6 Narrative Transition Bridge */}
              <TravelThreadOutro activeDestination={activeDestination} />
            </EditorialExperience>
          </TravelThreadRegion>
        </div>

        {/* Phase 8: Section 05 — Why Shree Jagannath Holidays (The Trust Ledger) */}
        <div id="our-heritage" style={{ scrollMarginTop: "80px" }}>
          <span id="about" style={{ display: "none" }} />
          <TrustLedgerSection />
        </div>

        {/* Phase 9: Section 06 — Journeys Across India (Editorial Atlas) */}
        <div id="destinations" style={{ scrollMarginTop: "80px" }}>
          <JourneysAcrossIndiaSection onJourneySelect={handleJourneySelect} />
        </div>

        {/* Phase 10: Real Travel Memories (ONE composed editorial viewport: 90svh-105svh) */}
        <div id="travel-memories" style={{ scrollMarginTop: "80px" }}>
          <TravelMemoriesPreview
            onNavigateToMemories={navigateToMemories}
            onPhotoClick={navigateToMemories}
          />
        </div>

        {/* Phase 11: Start Your Journey (Final conversion moment, Temple Black) */}
        <FinalJourneyCTA
          onOpenPlanner={() => {
            planner.openPlannerSheet({ source: "final-home-cta" });
          }}
        />

        {/* Phase 12: Site Footer (Editorial Colophon, verified info, final gold node) */}
        <SiteFooter
          onOpenPlanner={() => {
            planner.openPlannerSheet({ source: "footer" });
          }}
          onNavigateRoute={(href) => {
            if (href === "/travel-memories") {
              navigateToMemories();
            } else if (href.startsWith("/journeys/")) {
              const slug = href.replace("/journeys/", "");
              handleJourneySelect(slug, href);
            }
          }}
        />
      </main>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(11, 10, 8, 0.96)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 24px",
            color: "var(--sjh-ivory, #F4EFE6)",
            backdropFilter: "blur(14px)",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <img src="/assets/sjh-hero/sjh-logo.svg" alt="SJH Logo" style={{ width: "76px" }} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "1px solid rgba(244, 239, 230, 0.6)",
                fontSize: "20px",
                display: "grid",
                placeItems: "center",
                background: "transparent",
                color: "#F4EFE6",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <a
              href="#destinations"
              onClick={(e) => {
                e.preventDefault();
                handleNavigateSection("destinations");
              }}
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px", color: "#F4EFE6", textDecoration: "none" }}
            >
              Destinations
            </a>
            <a
              href="#sacred-journeys"
              onClick={(e) => {
                e.preventDefault();
                handleNavigateSection("sacred-journeys");
              }}
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px", color: "#F4EFE6", textDecoration: "none" }}
            >
              Sacred Journeys
            </a>
            <a
              href="#our-heritage"
              onClick={(e) => {
                e.preventDefault();
                handleNavigateSection("our-heritage");
              }}
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px", color: "#F4EFE6", textDecoration: "none" }}
            >
              Our Heritage
            </a>
            <a
              href="/travel-memories"
              onClick={(e) => {
                e.preventDefault();
                handleNavigateSection("travel-memories", "/travel-memories");
              }}
              style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px", color: "#F4EFE6", textDecoration: "none" }}
            >
              Travel Memories
            </a>
          </nav>

          {/* Direct Contact Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(185, 148, 85, 0.25)", paddingTop: "18px" }}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                planner.openPlannerSheet({ source: "mobile-menu" });
              }}
              style={{
                background: "rgba(185, 148, 85, 0.15)",
                border: "1px solid #B99455",
                color: "#F4EFE6",
                padding: "12px 18px",
                borderRadius: "999px",
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              PLAN A JOURNEY →
            </button>

            <a
              href={createWhatsAppUrl("Hello Shree Jagannath Holidays,\n\nI would like to enquire about a journey.\n\nPlease help me with the details.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              style={{
                background: "transparent",
                border: "1px solid rgba(244, 239, 230, 0.25)",
                color: "#F4EFE6",
                padding: "11px 18px",
                borderRadius: "999px",
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "#25D366" }}>●</span> WHATSAPP US
            </a>

            <a
              href={createPhoneUrl()}
              onClick={() => setMenuOpen(false)}
              aria-label="Call Shree Jagannath Holidays"
              style={{
                background: "transparent",
                border: "1px solid rgba(244, 239, 230, 0.25)",
                color: "#F4EFE6",
                padding: "11px 18px",
                borderRadius: "999px",
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              CALL US · {BUSINESS_INFO.phone.display}
            </a>
          </div>

          {/* Social Links & Location */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(185, 148, 85, 0.15)", paddingTop: "14px", marginTop: "8px" }}>
            <div style={{ display: "flex", gap: "16px" }}>
              <a
                href={BUSINESS_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#B99455", fontSize: "12px", letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}
              >
                Instagram ↗
              </a>
              <a
                href={BUSINESS_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#B99455", fontSize: "12px", letterSpacing: "0.12em", textDecoration: "none", textTransform: "uppercase" }}
              >
                Facebook ↗
              </a>
            </div>

            <div style={{ fontSize: "10px", letterSpacing: "0.16em", color: "rgba(244, 239, 230, 0.55)", textTransform: "uppercase" }}>
              {BUSINESS_INFO.location}
            </div>
          </div>
        </div>
      )}

      {/* Internal Travel Memories Archive Page */}
      {isTravelMemories && (
        <TravelMemoriesPage
          onBack={navigateHome}
          onOpenMenu={handleOpenMenu}
        />
      )}

      {/* Internal Journey Detail Page */}
      {activeJourney && (
        <JourneyDetailPage
          journey={activeJourney}
          onBack={navigateHome}
          onCreateJourney={handleCreateJourney}
          onOpenPlanner={(dest) => {
            planner.openPlannerSheet({
              source: `journey-detail-${activeJourney.id}`,
              destination: dest,
            });
          }}
        />
      )}

      {/* Viewport Planner Sheet Modal — Shares the same session draft & step */}
      <PlanJourneyModal
        isOpen={planner.isPlannerSheetOpen}
        onClose={planner.closePlannerSheet}
        draft={planner.draft}
        onDraftChange={planner.setDraft}
        step={planner.step}
        onStepChange={planner.setStep}
        destinationTouchedByUser={planner.destinationTouchedByUser}
        onDestinationTouch={() => planner.setDestinationTouchedByUser(true)}
        focusField={planner.focusField}
        onClearFocusField={planner.clearFocusField}
        onCreateJourney={handleCreateJourney}
      />
    </>
  );
}

export default App;
