/**
 * SHREE JAGANNATH HOLIDAYS — JOURNEY ESSENTIALS SECTION
 * Practical travel advice, seasons, attire and cultural respect.
 */

import { CuratedJourney } from "../../../data/journeys";

interface JourneyEssentialsSectionProps {
  journey: CuratedJourney;
}

export function JourneyEssentialsSection({ journey }: JourneyEssentialsSectionProps) {
  const { essentials } = journey.content;

  return (
    <section className="sjhDetailSection sjhDetailEssentials" aria-labelledby="essentials-title">
      <span className="sjhDetailSection__eyebrow">PREPARATION & ADVICE</span>
      <h2 id="essentials-title" className="sjhDetailSection__title">
        Journey Essentials
      </h2>

      <div className="sjhDetailInfoGrid">
        <div className="sjhDetailInfoCard">
          <div className="sjhDetailInfoCard__label">Best Time To Travel</div>
          <p className="sjhDetailInfoCard__text">{essentials.bestTime}</p>
        </div>

        <div className="sjhDetailInfoCard">
          <div className="sjhDetailInfoCard__label">Climate & Seasons</div>
          <p className="sjhDetailInfoCard__text">{essentials.climate}</p>
        </div>

        <div className="sjhDetailInfoCard">
          <div className="sjhDetailInfoCard__label">Recommended Attire</div>
          <p className="sjhDetailInfoCard__text">{essentials.attire}</p>
        </div>

        <div className="sjhDetailInfoCard">
          <div className="sjhDetailInfoCard__label">Cultural Guidelines</div>
          <p className="sjhDetailInfoCard__text">{essentials.culturalGuidelines}</p>
        </div>
      </div>
    </section>
  );
}
