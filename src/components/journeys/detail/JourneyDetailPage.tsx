/**
 * SHREE JAGANNATH HOLIDAYS — MASTER JOURNEY DETAIL PAGE
 * Complete internal editorial route architecture:
 * Hero → Why → Route → Itinerary with Photos → Essentials → Stay/Transport → Inclusions → Plan CTA
 */

import { useState, useEffect } from "react";
import { CuratedJourney } from "../../../data/journeys";
import { JourneyHero } from "./JourneyHero";
import { JourneyWhySection } from "./JourneyWhySection";
import { JourneyRouteSection } from "./JourneyRouteSection";
import { JourneyItinerarySection } from "./JourneyItinerarySection";
import { JourneyEssentialsSection } from "./JourneyEssentialsSection";
import { JourneyStayTransportSection } from "./JourneyStayTransportSection";
import { JourneyInclusionsSection } from "./JourneyInclusionsSection";
import { JourneyPlanCtaSection } from "./JourneyPlanCtaSection";
import { PlanJourneyModal } from "../PlanJourneyModal";
import { JourneyDraft } from "../../hero/plannerData";
import "./journeyDetail.css";

interface JourneyDetailPageProps {
  journey: CuratedJourney;
  onBack: () => void;
  onCreateJourney?: (draft: JourneyDraft) => void;
}

export function JourneyDetailPage({
  journey,
  onBack,
  onCreateJourney,
}: JourneyDetailPageProps) {
  const [plannerOpen, setPlannerOpen] = useState(false);

  // Set document title and meta description dynamically
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${journey.title.join(" ")} — Shree Jagannath Holidays`;
    window.scrollTo(0, 0);

    return () => {
      document.title = prevTitle;
    };
  }, [journey]);

  return (
    <main
      className="sjhDetailPage"
      style={{ backgroundColor: journey.bgTone }}
      data-journey-page={journey.id}
    >
      <div className="sjhDetailPage__container">
        {/* A. JOURNEY HERO */}
        <JourneyHero journey={journey} onBack={onBack} />

        {/* B. WHY THIS JOURNEY */}
        <JourneyWhySection journey={journey} />

        {/* C. ROUTE OVERVIEW */}
        <JourneyRouteSection journey={journey} />

        {/* D. DAY-BY-DAY ITINERARY WITH CONTEXTUAL SUPPORTING PHOTOS */}
        <JourneyItinerarySection journey={journey} />

        {/* E. JOURNEY ESSENTIALS */}
        <JourneyEssentialsSection journey={journey} />

        {/* F. STAY & TRANSPORT */}
        <JourneyStayTransportSection journey={journey} />

        {/* G. INCLUSIONS & NOTES */}
        <JourneyInclusionsSection journey={journey} />

        {/* H. FINAL PLAN THIS JOURNEY CTA */}
        <JourneyPlanCtaSection
          journey={journey}
          onOpenPlanner={() => setPlannerOpen(true)}
        />

        {/* EDITORIAL FRAMEWORK DISCLAIMER */}
        <div className="sjhDetailFrameworkNote">
          <p>
            All journey itineraries, route stops, and inclusions represent illustrative editorial frameworks. Final arrangements, curated stays, private transit, and pricing are confirmed directly during bespoke consultation with your Shree Jagannath Holidays concierge.
          </p>
        </div>
      </div>

      {/* REUSED PHASE-3 JOURNEY PLANNER MODAL */}
      <PlanJourneyModal
        isOpen={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        destination={journey.id}
        source={journey.id}
        onCreateJourney={onCreateJourney}
      />
    </main>
  );
}
