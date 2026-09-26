/**
 * SHREE JAGANNATH HOLIDAYS — FINAL PLAN THIS JOURNEY CTA
 * Primary: Triggers the Journey Planner with destination prefilled.
 * Secondary: Quiet contextual direct WhatsApp chat link.
 */

import { CuratedJourney } from "../../../data/journeys";
import { getDirectWhatsAppEnquiryUrl } from "../../../utils/contact";

interface JourneyPlanCtaSectionProps {
  journey: CuratedJourney;
  onOpenPlanner: () => void;
}

export function JourneyPlanCtaSection({ journey, onOpenPlanner }: JourneyPlanCtaSectionProps) {
  const whatsAppUrl = getDirectWhatsAppEnquiryUrl(journey.id);

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

      {/* Quiet WhatsApp text CTA (Section 21) */}
      <div className="sjhDetailPlanCta__whatsappWrap" style={{ marginTop: "18px", textAlign: "center" }}>
        <span style={{ fontSize: "12.5px", color: "rgba(244, 239, 230, 0.65)", display: "block", marginBottom: "4px" }}>
          Prefer WhatsApp?
        </span>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sjhDetailPlanCta__whatsappLink"
          style={{
            color: "#B99455",
            fontSize: "13px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 500,
          }}
        >
          <span>Chat with us</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <p className="sjhDetailPlanCta__sub" style={{ marginTop: "24px" }}>
        Personalized, enquiry-led itinerary crafting with your dedicated SJH travel specialist
      </p>
    </div>
  );
}
