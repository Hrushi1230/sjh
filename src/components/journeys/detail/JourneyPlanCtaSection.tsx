/**
 * SHREE JAGANNATH HOLIDAYS — FINAL PLAN THIS JOURNEY CTA
 * Triggers the Phase-3 Journey Planner with destination prefilled.
 */

import { CuratedJourney } from "../../../data/journeys";

interface JourneyPlanCtaSectionProps {
  journey: CuratedJourney;
  onOpenPlanner: () => void;
}

export function JourneyPlanCtaSection({ journey, onOpenPlanner }: JourneyPlanCtaSectionProps) {
  return (
    <div className="sjhDetailPlanCta">
      <button
        type="button"
        className="sjhDetailPlanCta__btn"
        onClick={onOpenPlanner}
        aria-label={`Plan this ${journey.title.join(" ")} journey with SJH concierge`}
      >
        <span>PLAN THIS JOURNEY</span>
        <span aria-hidden="true">→</span>
      </button>

      <p className="sjhDetailPlanCta__sub">
        Personalized, enquiry-led itinerary crafting with your dedicated SJH travel specialist
      </p>
    </div>
  );
}
