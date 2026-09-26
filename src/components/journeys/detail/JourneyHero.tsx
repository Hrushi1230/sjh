/**
 * SHREE JAGANNATH HOLIDAYS — JOURNEY DETAIL HERO
 * Consumes the incoming shared-element view transition from Phase 5.
 */

import React from "react";
import { CuratedJourney } from "../../../data/journeys";

interface JourneyHeroProps {
  journey: CuratedJourney;
  onBack: () => void;
}

export function JourneyHero({ journey, onBack }: JourneyHeroProps) {
  return (
    <header className="sjhDetailHero">
      {/* Top Header Navigation */}
      <nav className="sjhDetailNav" aria-label="Journey navigation">
        <button
          type="button"
          className="sjhDetailNav__backBtn"
          onClick={onBack}
          aria-label="Back to Homepage"
        >
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </button>

        <div className="sjhDetailNav__brand">
          <img
            src="/assets/sjh-hero/sjh-logo.svg"
            alt="SJH"
            width="20"
            height="20"
          />
          <span className="sjhDetailNav__brandName">SHREE JAGANNATH</span>
        </div>
      </nav>

      {/* Journey Header Meta */}
      <div className="sjhDetailHero__headerMeta">
        <span className="sjhDetailHero__index">{journey.index}</span>
        <span className="sjhDetailHero__mood">{journey.mood}</span>
      </div>

      {/* Shared-Element Hero Image */}
      <div className="sjhDetailHero__mediaWrapper">
        <picture>
          <img
            src={journey.mainImage.src}
            alt={journey.mainImage.alt}
            width={journey.mainImage.width}
            height={journey.mainImage.height}
            className="sjhDetailHero__mediaImg"
            style={{ objectPosition: journey.mainImage.objectPosition }}
          />
        </picture>
      </div>

      {/* Hero Typography */}
      <h1 className="sjhDetailHero__title">
        {journey.title.map((line, i) => (
          <span key={i} className="sjhDetailHero__titleLine">
            <span>{line}</span>
          </span>
        ))}
      </h1>

      {/* Route & Duration */}
      <div className="sjhDetailHero__routeMeta">
        {journey.route.map((city, cIdx) => (
          <React.Fragment key={city}>
            <span className="sjhDetailHero__routeStop">{city}</span>
            {cIdx < journey.route.length - 1 && (
              <span className="sjhDetailHero__routeDivider" aria-hidden="true">•</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="sjhDetailHero__durationBadge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{journey.duration.label}</span>
      </div>

      <p className="sjhDetailHero__tagline">{journey.content.tagline}</p>
    </header>
  );
}
