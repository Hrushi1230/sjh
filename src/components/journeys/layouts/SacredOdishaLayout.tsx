/**
 * SHREE JAGANNATH HOLIDAYS — LAYOUT 01: SACRED ODISHA
 * Warm, ceremonial, architectural, coastal mornings.
 * Asymmetrical staggered detail composition: Konark (wide) + Bhubaneswar (offset right).
 */

import React from "react";
import { CuratedJourney } from "../../../data/journeys";

interface SacredOdishaLayoutProps {
  journey: CuratedJourney;
  detailWrapperRefs: React.MutableRefObject<HTMLDivElement[]>;
}

export function SacredOdishaLayout({ journey, detailWrapperRefs }: SacredOdishaLayoutProps) {
  const [konark, bhubaneswar] = journey.detailImages;

  return (
    <div className="sjhJourney__detailImages sjhSacredDetails">
      {/* Konark Architectural Detail (Wide) */}
      <div
        ref={(el) => {
          if (el) detailWrapperRefs.current[0] = el;
        }}
        className="sjhJourney__detailWrapper sjhSacredDetails__item--konark"
      >
        <picture>
          <img
            src={konark.src}
            alt={konark.alt}
            width={konark.width}
            height={konark.height}
            loading="lazy"
            decoding="async"
            className="sjhJourney__detailImg"
            style={{ objectPosition: konark.objectPosition }}
          />
        </picture>
        <div className="sjhJourney__detailCaption">{konark.caption}</div>
      </div>

      {/* Bhubaneswar Temple Complex (Offset Inset Right) */}
      <div
        ref={(el) => {
          if (el) detailWrapperRefs.current[1] = el;
        }}
        className="sjhJourney__detailWrapper sjhSacredDetails__item--bhubaneswar"
      >
        <picture>
          <img
            src={bhubaneswar.src}
            alt={bhubaneswar.alt}
            width={bhubaneswar.width}
            height={bhubaneswar.height}
            loading="lazy"
            decoding="async"
            className="sjhJourney__detailImg"
            style={{ objectPosition: bhubaneswar.objectPosition }}
          />
        </picture>
        <div className="sjhJourney__detailCaption">{bhubaneswar.caption}</div>
      </div>
    </div>
  );
}
