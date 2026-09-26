import { useState, useCallback, useLayoutEffect } from "react";
import { MobileCinematicHero } from "./components/hero/MobileCinematicHero";
import { JourneyDraft } from "./components/hero/plannerData";
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

import "./components/travelMemories/travelMemories.css";
import "./components/closing/closing.css";
import "./components/journeys/detail/journeyDetail.css";

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [plannerModalOpen, setPlannerModalOpen] = useState(false);
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

  // If returning to homepage, restore exact previous scroll position
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

  // Global planner hooks so down-page callers (Phase 11, Footer) can open planner seamlessly
  useLayoutEffect(() => {
    const win = window as any;
    const heroOpen = win.__SJH_PLANNER_OPEN__;
    const heroClose = win.__SJH_PLANNER_CLOSE__;

    win.__SJH_PLANNER_OPEN__ = () => {
      if (window.scrollY > 800) {
        setPlannerModalOpen(true);
      } else if (heroOpen) {
        heroOpen();
      } else {
        setPlannerModalOpen(true);
      }
    };

    win.__SJH_PLANNER_CLOSE__ = () => {
      setPlannerModalOpen(false);
      if (heroClose) heroClose();
    };

    return () => {
      win.__SJH_PLANNER_OPEN__ = heroOpen;
      win.__SJH_PLANNER_CLOSE__ = heroClose;
    };
  }, []);

  const isInternalPageOpen = Boolean(activeJourney || isTravelMemories);

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
          onCreateJourney={handleCreateJourney}
          onDestinationChange={setActiveDestination}
          isInternalPageOpen={isInternalPageOpen}
        />

        {/* Phase 6: The Travel Thread connecting Phase 5 Editorial Chapters & Outro */}
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

        {/* Phase 8: Section 05 — Why Shree Jagannath Holidays (The Trust Ledger) */}
        <TrustLedgerSection />

        {/* Phase 9: Section 06 — Journeys Across India (Editorial Atlas) */}
        <JourneysAcrossIndiaSection onJourneySelect={handleJourneySelect} />

        {/* Phase 10: Real Travel Memories (ONE composed editorial viewport: 90svh-105svh) */}
        <TravelMemoriesPreview
          onNavigateToMemories={navigateToMemories}
          onPhotoClick={navigateToMemories}
        />

        {/* Phase 11: Start Your Journey (Final conversion moment, Temple Black) */}
        <FinalJourneyCTA
          onOpenPlanner={() => {
            const win = window as any;
            if (win.__SJH_PLANNER_SET_FIELD__) {
              win.__SJH_PLANNER_SET_FIELD__("source", "final-home-cta");
            }
            setPlannerModalOpen(true);
          }}
        />

        {/* Phase 12: Site Footer (Editorial Colophon, verified info, final gold node) */}
        <SiteFooter
          onOpenPlanner={() => {
            const win = window as any;
            if (win.__SJH_PLANNER_SET_FIELD__) {
              win.__SJH_PLANNER_SET_FIELD__("source", "footer");
            }
            setPlannerModalOpen(true);
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

        {menuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(11, 10, 8, 0.95)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "32px 24px",
              color: "var(--sjh-ivory)",
              backdropFilter: "blur(12px)",
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
                }}
              >
                ✕
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <a href="#destinations" onClick={() => setMenuOpen(false)} style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px" }}>
                Destinations
              </a>
              <a href="#pilgrimages" onClick={() => setMenuOpen(false)} style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px" }}>
                Sacred Journeys
              </a>
              <a href="#about" onClick={() => setMenuOpen(false)} style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px" }}>
                Our Heritage
              </a>
              <a
                href="/travel-memories"
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  navigateToMemories();
                }}
                style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px" }}
              >
                Travel Memories
              </a>
              <a href="#contact" onClick={() => setMenuOpen(false)} style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px" }}>
                Contact Concierge
              </a>
            </nav>

            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "rgba(244, 239, 230, 0.6)", textTransform: "uppercase" }}>
              Shree Jagannath Holidays · Puri
            </div>
          </div>
        )}
      </main>

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
        />
      )}

      {/* Plan Journey Modal for down-page triggers (Phase 11 CTA, Footer, etc.) */}
      <PlanJourneyModal
        isOpen={plannerModalOpen}
        onClose={() => setPlannerModalOpen(false)}
        destination={activeDestination}
        onCreateJourney={handleCreateJourney}
      />
    </>
  );
}
export default App;
