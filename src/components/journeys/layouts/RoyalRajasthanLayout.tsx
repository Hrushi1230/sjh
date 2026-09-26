/**
 * SHREE JAGANNATH HOLIDAYS — LAYOUT 03: ROYAL RAJASTHAN
 * Architectural, heritage cadence, structured alternating composition.
 * Jodhpur Mehrangarh Fort + Udaipur Lake Palace.
 */

import React from "react";
import { CuratedJourney } from "../../../data/journeys";

interface RoyalRajasthanLayoutProps {
  journey: CuratedJourney;
  detailWrapperRefs: React.MutableRefObject<HTMLDivElement[]>;
}

export function RoyalRajasthanLayout({ journey, detailWrapperRefs }: RoyalRajasthanLayoutProps) {
  const [jodhpur, udaipur] = journey.detailImages;

  return (
    <div className="sjhJourney__detailImages sjhRajasthanDetails">
      {/* Jodhpur Mehrangarh Fort (Left Cadence) */}
      <div
        ref={(el) => {
          if (el) detailWrapperRefs.current[0] = el;
        }}
        className="sjhJourney__detailWrapper sjhRajasthanDetails__item--jodhpur"
      >
        <picture>
          <img
            src={jodhpur.src}
            alt={jodhpur.alt}
            width={jodhpur.width}
            height={jodhpur.height}
            loading="lazy"
            decoding="async"
            className="sjhJourney__detailImg"
            style={{ objectPosition: jodhpur.objectPosition }}
          />
        </picture>
        <div className="sjhJourney__detailCaption">{jodhpur.caption}</div>
      </div>

      {/* Udaipur Lake Palace (Offset Right Cadence) */}
      <div
        ref={(el) => {
          if (el) detailWrapperRefs.current[1] = el;
        }}
        className="sjhJourney__detailWrapper sjhRajasthanDetails__item--udaipur"
      >
        <picture>
          <img
            src={udaipur.src}
            alt={udaipur.alt}
            width={udaipur.width}
            height={udaipur.height}
            loading="lazy"
            decoding="async"
            className="sjhJourney__detailImg"
            style={{ objectPosition: udaipur.objectPosition }}
          />
        </picture>
        <div className="sjhJourney__detailCaption">{udaipur.caption}</div>
      </div>
    </div>
  );
}
