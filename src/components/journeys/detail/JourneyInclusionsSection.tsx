/**
 * SHREE JAGANNATH HOLIDAYS — INCLUSIONS & NOTES SECTION
 * Transparent luxury inclusions, exclusions, and travel notes.
 */

import { CuratedJourney } from "../../../data/journeys";

interface JourneyInclusionsSectionProps {
  journey: CuratedJourney;
}

export function JourneyInclusionsSection({ journey }: JourneyInclusionsSectionProps) {
  const { inclusions, exclusions, importantNotes } = journey.content;

  return (
    <section className="sjhDetailSection sjhDetailInclusions" aria-labelledby="inclusions-title">
      <span className="sjhDetailSection__eyebrow">TRANSPARENT TERMS</span>
      <h2 id="inclusions-title" className="sjhDetailSection__title">
        Inclusions & Notes
      </h2>

      <div className="sjhDetailInfoGrid">
        <div className="sjhDetailInfoCard">
          <div className="sjhDetailInfoCard__label">Curated Inclusions</div>
          <ul className="sjhDetailChecklist" aria-label="Included items">
            {inclusions.map((item, idx) => (
              <li key={idx} className="sjhDetailChecklist__item">
                <span className="sjhDetailChecklist__icon" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sjhDetailInfoCard">
          <div className="sjhDetailInfoCard__label">Exclusions</div>
          <ul className="sjhDetailChecklist" aria-label="Excluded items">
            {exclusions.map((item, idx) => (
              <li key={idx} className="sjhDetailChecklist__item">
                <span className="sjhDetailChecklist__icon" aria-hidden="true" style={{ color: "rgba(17, 16, 14, 0.4)" }}>✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {importantNotes.length > 0 && (
          <div className="sjhDetailInfoCard">
            <div className="sjhDetailInfoCard__label">Important Notes</div>
            <ul className="sjhDetailChecklist" aria-label="Important notes">
              {importantNotes.map((note, idx) => (
                <li key={idx} className="sjhDetailChecklist__item">
                  <span className="sjhDetailChecklist__icon" aria-hidden="true">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
