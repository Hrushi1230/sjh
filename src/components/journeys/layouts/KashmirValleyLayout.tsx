/**
 * SHREE JAGANNATH HOLIDAYS — LAYOUT 02: KASHMIR VALLEY
 * Open, alpine, cooler, spacious breathing.
 * Srinagar Dal Lake (wide landscape) + Inset Pahalgam Valley.
 */

import React from "react";
import { CuratedJourney } from "../../../data/journeys";

interface KashmirValleyLayoutProps {
  journey: CuratedJourney;
  detailWrapperRefs: React.MutableRefObject<HTMLDivElement[]>;
}

export function KashmirValleyLayout({ journey, detailWrapperRefs }: KashmirValleyLayoutProps) {
  const [srinagar, pahalgam] = journey.detailImages;

  return (
    <div className="sjhJourney__detailImages sjhAlpineDetails">
      {/* Srinagar Dal Lake Detail (Wide Landscape) */}
      <div
        ref={(el) => {
          if (el) detailWrapperRefs.current[0] = el;
        }}
        className="sjhJourney__detailWrapper sjhAlpineDetails__item--srinagar"
      >
        <picture>
          <img
            src={srinagar.src}
            alt={srinagar.alt}
            width={srinagar.width}
            height={srinagar.height}
            loading="lazy"
            decoding="async"
            className="sjhJourney__detailImg"
            style={{ objectPosition: srinagar.objectPosition }}
          />
        </picture>
        <div className="sjhJourney__detailCaption">{srinagar.caption}</div>
      </div>

      {/* Pahalgam Valley View (Spacious Inset View) */}
      <div
        ref={(el) => {
          if (el) detailWrapperRefs.current[1] = el;
        }}
        className="sjhJourney__detailWrapper sjhAlpineDetails__item--pahalgam"
      >
        <picture>
          <img
            src={pahalgam.src}
            alt={pahalgam.alt}
            width={pahalgam.width}
            height={pahalgam.height}
            loading="lazy"
            decoding="async"
            className="sjhJourney__detailImg"
            style={{ objectPosition: pahalgam.objectPosition }}
          />
        </picture>
        <div className="sjhJourney__detailCaption">{pahalgam.caption}</div>
      </div>
    </div>
  );
}
