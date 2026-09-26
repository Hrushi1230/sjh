/**
 * SHREE JAGANNATH HOLIDAYS — ROUTE OVERVIEW SECTION
 * Visual itinerary circuit timeline connecting stops.
 */

import { CuratedJourney } from "../../../data/journeys";

interface JourneyRouteSectionProps {
  journey: CuratedJourney;
}

export function JourneyRouteSection({ journey }: JourneyRouteSectionProps) {
  const { routeOverview } = journey.content;

  return (
    <section className="sjhDetailSection sjhDetailRoute" aria-labelledby="route-overview-title">
      <span className="sjhDetailSection__eyebrow">CIRCUIT & PACING</span>
      <h2 id="route-overview-title" className="sjhDetailSection__title">
        Route Overview
      </h2>

      <div className="sjhDetailRoute__meta">
        <span className="sjhDetailRoute__badge">Pace: {routeOverview.pace}</span>
        <span className="sjhDetailRoute__badge">{routeOverview.circuitScope}</span>
      </div>

      <p className="sjhDetailWhy__p">{routeOverview.description}</p>

      {/* Vertical Connected Stop Timeline */}
      <div className="sjhDetailRoute__timeline" role="list">
        {routeOverview.stops.map((stop, idx) => (
          <div key={idx} className="sjhDetailRoute__stop" role="listitem">
            <span className="sjhDetailRoute__stopDot" aria-hidden="true" />
            <div className="sjhDetailRoute__stopHeader">
              <span className="sjhDetailRoute__stopCity">{stop.city}</span>
              {stop.nights > 0 && (
                <span className="sjhDetailRoute__stopNights">({stop.nights} Nights)</span>
              )}
            </div>
            <p className="sjhDetailRoute__stopHighlight">{stop.highlight}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
