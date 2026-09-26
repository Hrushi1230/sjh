/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 7: CURATED JOURNEYS MASTER SECTION
 * Continuous mobile editorial section directly beneath Phase 6 Travel Thread.
 * Interpolates destination background tones and coordinates journey chapters.
 */

import { useState, useCallback, useEffect } from "react";
import { CURATED_JOURNEYS, JourneyId } from "../../data/journeys";
import { CuratedJourneysIntro } from "./CuratedJourneysIntro";
import { CuratedJourneyItem } from "./CuratedJourneyItem";
import { CuratedJourneysOutro } from "./CuratedJourneysOutro";
import "./journeys.css";

interface CuratedJourneysSectionProps {
  onJourneySelect?: (journeyId: JourneyId, href: string) => void;
}

export function CuratedJourneysSection({ onJourneySelect }: CuratedJourneysSectionProps) {
  const [currentTone, setCurrentTone] = useState<string>(CURATED_JOURNEYS[0].bgTone);

  // Smooth tone shift handler
  const handleBackgroundShift = useCallback((tone: string) => {
    setCurrentTone(tone);
  }, []);

  // Preload upcoming Phase 7 main assets
  useEffect(() => {
    CURATED_JOURNEYS.forEach((journey) => {
      const img = new Image();
      img.src = journey.mainImage.src;
    });
  }, []);

  return (
    <section
      id="phase7-journeys"
      data-section="phase7"
      className="sjhCuratedJourneys"
      aria-labelledby="curated-journeys-title"
      style={{ backgroundColor: currentTone }}
    >
      <div className="sjhCuratedJourneys__container">
        {/* Phase 7 Section Intro (Handoff from Phase 6 Outro Stem) */}
        <CuratedJourneysIntro />

        {/* Four Art-Directed Editorial Journeys */}
        {CURATED_JOURNEYS.map((journey, idx) => {
          const nextJourney = CURATED_JOURNEYS[idx + 1];

          return (
            <CuratedJourneyItem
              key={journey.id}
              journey={journey}
              nextJourney={nextJourney}
              onBackgroundShift={handleBackgroundShift}
              onJourneySelect={onJourneySelect}
            />
          );
        })}

        {/* Visual Deceleration Buffer before future Phase 8 */}
        <CuratedJourneysOutro />
      </div>
    </section>
  );
}
export default CuratedJourneysSection;
