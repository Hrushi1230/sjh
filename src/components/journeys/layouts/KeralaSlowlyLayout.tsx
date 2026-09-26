/**
 * SHREE JAGANNATH HOLIDAYS — LAYOUT 04: KERALA SLOWLY
 * Quiet, water horizons, unhurried days, visual deceleration.
 * Munnar Tea Hills + Kochi Heritage Waterfront with calm breathing room.
 */

import React from "react";
import { CuratedJourney } from "../../../data/journeys";

interface KeralaSlowlyLayoutProps {
  journey: CuratedJourney;
  detailWrapperRefs: React.MutableRefObject<HTMLDivElement[]>;
}

export function KeralaSlowlyLayout({ journey, detailWrapperRefs }: KeralaSlowlyLayoutProps) {
  const [munnar, kochi] = journey.detailImages;

  return (
    <div className="sjhJourney__detailImages sjhKeralaDetails">
      {/* Munnar Tea Hills */}
      <div
        ref={(el) => {
          if (el) detailWrapperRefs.current[0] = el;
        }}
        className="sjhJourney__detailWrapper sjhKeralaDetails__item"
      >
        <picture>
          <img
            src={munnar.src}
            alt={munnar.alt}
            width={munnar.width}
            height={munnar.height}
            loading="lazy"
            decoding="async"
            className="sjhJourney__detailImg"
            style={{ objectPosition: munnar.objectPosition }}
          />
        </picture>
        <div className="sjhJourney__detailCaption">{munnar.caption}</div>
      </div>

      {/* Kochi Heritage Waterfront */}
      <div
        ref={(el) => {
          if (el) detailWrapperRefs.current[1] = el;
        }}
        className="sjhJourney__detailWrapper sjhKeralaDetails__item"
      >
        <picture>
          <img
            src={kochi.src}
            alt={kochi.alt}
            width={kochi.width}
            height={kochi.height}
            loading="lazy"
            decoding="async"
            className="sjhJourney__detailImg"
            style={{ objectPosition: kochi.objectPosition }}
          />
        </picture>
        <div className="sjhJourney__detailCaption">{kochi.caption}</div>
      </div>
    </div>
  );
}
