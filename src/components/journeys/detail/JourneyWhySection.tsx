/**
 * SHREE JAGANNATH HOLIDAYS — WHY THIS JOURNEY SECTION
 * Editorial narrative capturing the unique spiritual, cultural, or natural essence.
 */

import { CuratedJourney } from "../../../data/journeys";

interface JourneyWhySectionProps {
  journey: CuratedJourney;
}

export function JourneyWhySection({ journey }: JourneyWhySectionProps) {
  const { whyThisJourney } = journey.content;

  return (
    <section className="sjhDetailSection sjhDetailWhy" aria-labelledby="why-this-journey-title">
      <span className="sjhDetailSection__eyebrow">INTENT & ESSENCE</span>
      <h2 id="why-this-journey-title" className="sjhDetailSection__title">
        Why This Journey
      </h2>

      <p className="sjhDetailWhy__lead">{whyThisJourney.lead}</p>

      {whyThisJourney.paragraphs.map((p, idx) => (
        <p key={idx} className="sjhDetailWhy__p">{p}</p>
      ))}

      <ul className="sjhDetailWhy__highlights" aria-label="Journey highlights">
        {whyThisJourney.highlights.map((item, idx) => (
          <li key={idx} className="sjhDetailWhy__highlightItem">
            <span className="sjhDetailWhy__highlightDot" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
