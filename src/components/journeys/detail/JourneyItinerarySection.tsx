/**
 * SHREE JAGANNATH HOLIDAYS — DAY-BY-DAY ITINERARY SECTION
 * Embeds supporting detail photography contextually throughout the days.
 */

import { CuratedJourney } from "../../../data/journeys";

interface JourneyItinerarySectionProps {
  journey: CuratedJourney;
}

export function JourneyItinerarySection({ journey }: JourneyItinerarySectionProps) {
  const { itinerary } = journey.content;

  return (
    <section className="sjhDetailSection sjhDetailItinerary" aria-labelledby="itinerary-title">
      <span className="sjhDetailSection__eyebrow">DAY BY DAY</span>
      <h2 id="itinerary-title" className="sjhDetailSection__title">
        The Itinerary
      </h2>

      <div className="sjhDetailItinerary__list">
        {itinerary.map((day) => {
          const featuredPhoto =
            day.featuredDetailIndex !== undefined
              ? journey.detailImages[day.featuredDetailIndex]
              : null;

          return (
            <article key={day.day} className="sjhDetailDayCard" aria-labelledby={`day-${day.day}-title`}>
              <div className="sjhDetailDayCard__header">
                <span className="sjhDetailDayCard__dayNum">Day {day.day}</span>
                <span className="sjhDetailDayCard__location">{day.location}</span>
              </div>

              <h3 id={`day-${day.day}-title`} className="sjhDetailDayCard__title">
                {day.title}
              </h3>

              <p className="sjhDetailDayCard__summary">{day.summary}</p>

              {/* Contextual Supporting Photography Integration */}
              {featuredPhoto && (
                <div className="sjhDetailDayCard__photoWrap">
                  <picture>
                    <img
                      src={featuredPhoto.src}
                      alt={featuredPhoto.alt}
                      width={featuredPhoto.width}
                      height={featuredPhoto.height}
                      loading="lazy"
                      decoding="async"
                      className="sjhDetailDayCard__photo"
                      style={{ objectPosition: featuredPhoto.objectPosition }}
                    />
                  </picture>
                  <div className="sjhDetailDayCard__caption">{featuredPhoto.caption}</div>
                </div>
              )}

              {/* Curated Daily Activities */}
              <ul className="sjhDetailDayCard__activities" aria-label={`Activities for Day ${day.day}`}>
                {day.activities.map((act, aIdx) => (
                  <li key={aIdx} className="sjhDetailDayCard__actItem">
                    <span className="sjhDetailDayCard__actDot" aria-hidden="true">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
