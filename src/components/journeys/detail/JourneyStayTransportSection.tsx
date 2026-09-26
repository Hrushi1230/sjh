/**
 * SHREE JAGANNATH HOLIDAYS — STAY & TRANSPORT SECTION
 * Heritage stays and private chauffeured travel standards.
 */

import { CuratedJourney } from "../../../data/journeys";

interface JourneyStayTransportSectionProps {
  journey: CuratedJourney;
}

export function JourneyStayTransportSection({ journey }: JourneyStayTransportSectionProps) {
  const { stayAndTransport } = journey.content;

  return (
    <section className="sjhDetailSection sjhDetailStay" aria-labelledby="stay-transport-title">
      <span className="sjhDetailSection__eyebrow">HOSPITALITY & TRANSIT</span>
      <h2 id="stay-transport-title" className="sjhDetailSection__title">
        Stay & Transport
      </h2>

      <div className="sjhDetailInfoGrid">
        <div className="sjhDetailInfoCard">
          <div className="sjhDetailInfoCard__label">Curated Stays</div>
          <p className="sjhDetailWhy__lead" style={{ fontSize: "14.5px", marginBottom: "6px" }}>
            {stayAndTransport.stayPhilosophy}
          </p>
          <p className="sjhDetailInfoCard__text">{stayAndTransport.stayDetails}</p>
        </div>

        <div className="sjhDetailInfoCard">
          <div className="sjhDetailInfoCard__label">Private Transport</div>
          <p className="sjhDetailWhy__lead" style={{ fontSize: "14.5px", marginBottom: "6px" }}>
            {stayAndTransport.transportPhilosophy}
          </p>
          <p className="sjhDetailInfoCard__text">{stayAndTransport.transportDetails}</p>
        </div>
      </div>
    </section>
  );
}
