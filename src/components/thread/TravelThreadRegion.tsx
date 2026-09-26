/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 6: THE TRAVEL THREAD
 * Master Region Wrapper, Layout Measurement & Scroll-Driven Draw Engine
 */

import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getScrub } from "../../constants/motionTokens";
import { getChapterOrder } from "../editorial/editorialData";
import { buildTravelThreadPath, ThreadPathResult } from "./travelThreadGeometry";
import { TravelThread } from "./TravelThread";
import { TravelThreadNode } from "./TravelThreadNode";
import "./travelThread.css";

gsap.registerPlugin(ScrollTrigger);

interface TravelThreadRegionProps {
  activeDestination: "puri" | "kashmir" | "rajasthan" | "kerala";
  children: React.ReactNode;
}

export function TravelThreadRegion({ activeDestination, children }: TravelThreadRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const [pathResult, setPathResult] = useState<ThreadPathResult | null>(null);

  // Waypoint activation states (boolean for each node)
  const [reachedWaypoints, setReachedWaypoints] = useState<boolean[]>([false, false, false, false]);

  const chapterOrder = getChapterOrder(activeDestination).map((c) => c.id);

  // Recalculate path geometry from real DOM layout
  const updateGeometry = useCallback(() => {
    const region = regionRef.current;
    if (!region) return;

    const result = buildTravelThreadPath(region, chapterOrder);
    if (result) {
      setPathResult(result);
    }
  }, [activeDestination]);

  // Initial measurement after fonts and layout settle
  useEffect(() => {
    let timeoutId: number;

    const handleInitialMeasure = () => {
      timeoutId = window.setTimeout(() => {
        updateGeometry();
      }, 150);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(handleInitialMeasure);
    } else {
      handleInitialMeasure();
    }

    return () => window.clearTimeout(timeoutId);
  }, [updateGeometry]);

  // Debounced ResizeObserver (Section 46 & 47: ignore small mobile bar height changes)
  useLayoutEffect(() => {
    const region = regionRef.current;
    if (!region) return;

    let prevWidth = region.getBoundingClientRect().width;
    let resizeTimer: number;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const curWidth = entry.contentRect.width;
        // Only recalculate on meaningful width or orientation changes (> 6px)
        if (Math.abs(curWidth - prevWidth) > 6) {
          prevWidth = curWidth;
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(() => {
            updateGeometry();
            ScrollTrigger.refresh();
          }, 120);
        }
      }
    });

    ro.observe(region);

    return () => {
      ro.disconnect();
      window.clearTimeout(resizeTimer);
    };
  }, [updateGeometry]);

  // Master ScrollTrigger Timeline for progressive thread draw & node activation
  useEffect(() => {
    const region = regionRef.current;
    const activePath = activePathRef.current;
    if (!region || !activePath || !pathResult) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Measure total path length
    let pathLength = 0;
    try {
      pathLength = activePath.getTotalLength();
    } catch {
      pathLength = 2000;
    }

    // Set initial dash properties
    activePath.style.strokeDasharray = `${pathLength}`;

    if (reduceMotion) {
      // Reduced motion: line is fully visible, all nodes active
      activePath.style.strokeDashoffset = "0";
      setReachedWaypoints([true, true, true, true]);
      return;
    }

    // Initial state: fully undrawn
    activePath.style.strokeDashoffset = `${pathLength}`;

    const st = ScrollTrigger.create({
      trigger: region,
      start: "top 72%",
      end: "bottom 72%",
      scrub: getScrub("travelThread"),
      onUpdate: (self) => {
        const p = self.progress;

        // Section 57 & 58: Thread begins drawing only around ~15% into Chapter 01 continuation
        // to protect Phase 4 breathing room
        let drawProgress = 0;
        if (p > 0.04) {
          drawProgress = Math.min((p - 0.04) / 0.91, 1);
        }

        // Draw active path
        const currentOffset = pathLength * (1 - drawProgress);
        activePath.style.strokeDashoffset = `${currentOffset}`;

        // Toggle waypoint nodes when drawn line reaches them
        const newReached = pathResult.waypoints.map((wp) => {
          return drawProgress >= wp.progressThreshold;
        });

        setReachedWaypoints((prev) => {
          if (
            prev[0] !== newReached[0] ||
            prev[1] !== newReached[1] ||
            prev[2] !== newReached[2] ||
            prev[3] !== newReached[3]
          ) {
            return newReached;
          }
          return prev;
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [pathResult]);

  return (
    <div ref={regionRef} className="sjhTravelThreadRegion">
      {/* Unified SVG Travel Thread Overlay */}
      {pathResult && (
        <TravelThread
          ref={activePathRef}
          d={pathResult.d}
          width={pathResult.dimensions.width}
          height={pathResult.dimensions.height}
        />
      )}

      {/* Floating Chapter Waypoint Nodes */}
      {pathResult && (
        <div className="sjhTravelThread__nodes" aria-hidden="true">
          {pathResult.waypoints.map((wp, idx) => (
            <TravelThreadNode
              key={wp.id}
              waypoint={wp}
              index={idx + 1}
              isReached={reachedWaypoints[idx]}
            />
          ))}
        </div>
      )}

      {/* Editorial Content & Narrative Outro */}
      <div className="sjhTravelThreadRegion__inner">
        {children}
      </div>
    </div>
  );
}
