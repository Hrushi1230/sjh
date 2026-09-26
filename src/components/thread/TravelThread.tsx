/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 6: THE TRAVEL THREAD
 * SVG Path Overlay Component (Guide Path + Active Drawn Path)
 */

import { forwardRef } from "react";

interface TravelThreadProps {
  d: string;
  width: number;
  height: number;
}

export const TravelThread = forwardRef<SVGPathElement, TravelThreadProps>(
  function TravelThread({ d, width, height }, ref) {
    if (!d || width <= 0 || height <= 0) return null;

    return (
      <svg
        className="sjhTravelThread"
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: `${height}px` }}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* Active Scroll-Drawn Crisp Antique Gold Path Only (No Faint Guide, No Blur) */}
        <path
          ref={ref}
          d={d}
          className="sjhTravelThread__path"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  }
);
