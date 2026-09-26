/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 6: THE TRAVEL THREAD
 * Screen 06 Reference Design: Travel Thread Connects & The Journey Continues
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getChapterOrder } from "../editorial/editorialData";
import { EditorialIcon } from "../editorial/EditorialIcons";
import { CHAPTER_THREAD_HINTS } from "./travelThreadData";

gsap.registerPlugin(ScrollTrigger);

interface TravelThreadOutroProps {
  activeDestination?: "puri" | "kashmir" | "rajasthan" | "kerala";
}

export function TravelThreadOutro({ activeDestination = "puri" }: TravelThreadOutroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<HTMLDivElement[]>([]);
  const finalNodeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Dynamic cyclic rotation of chapters based on hero active destination
  const chapters = getChapterOrder(activeDestination);

  // Fixed coordinate map for the 4 nodes across 360x420 viewBox (matching reference Screen 06)
  const nodeCoords = [
    { x: 92, y: 52, align: "left" },     // Node 1: upper left
    { x: 268, y: 136, align: "right" },  // Node 2: mid right
    { x: 104, y: 226, align: "left" },   // Node 3: mid-lower left
    { x: 256, y: 314, align: "right" },  // Node 4: lower right
    { x: 180, y: 390, align: "center" }, // Final Node: bottom center
  ];

  // Continuous Bézier spline winding through all 5 points
  const routeSpline = `M ${nodeCoords[0].x} ${nodeCoords[0].y} ` +
    `C 130 52, 240 85, ${nodeCoords[1].x} ${nodeCoords[1].y} ` +
    `C 285 170, 160 185, ${nodeCoords[2].x} ${nodeCoords[2].y} ` +
    `C 65 255, 200 275, ${nodeCoords[3].x} ${nodeCoords[3].y} ` +
    `C 285 340, 220 375, ${nodeCoords[4].x} ${nodeCoords[4].y} ` +
    `L 180 435`;

  // Smooth scroll down to next section on arrow click
  const handleScrollToNext = () => {
    const nextElem = document.getElementById("phase7-journeys") || document.querySelector('[data-section="phase7"]');
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    const path = pathRef.current;
    if (!el || !path) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let pathLength = 0;
    try {
      pathLength = path.getTotalLength();
    } catch {
      pathLength = 950;
    }
    if (!pathLength || pathLength < 800) {
      pathLength = 950;
    }

    path.style.strokeDasharray = `${pathLength}`;

    if (reduceMotion) {
      path.style.strokeDashoffset = "0";
      nodesRef.current.forEach((n) => {
        if (n) {
          n.style.opacity = "1";
          n.style.transform = "scale(1)";
        }
      });
      if (finalNodeRef.current) {
        finalNodeRef.current.style.opacity = "1";
        finalNodeRef.current.style.transform = "scale(1)";
      }
      return;
    }

    path.style.strokeDashoffset = `${pathLength}`;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 55%",
          end: "bottom 85%",
          scrub: 0.8,
        },
      });

      // 1. Draw the winding route smoothly (never pre-shown)
      tl.fromTo(
        path,
        { strokeDashoffset: pathLength },
        {
          strokeDashoffset: 0,
          ease: "none",
          duration: 1,
        },
        0
      );

      // 2. Reveal each waypoint node as the path reaches it
      const thresholds = [0.10, 0.35, 0.60, 0.82];
      nodesRef.current.forEach((node, i) => {
        if (!node) return;
        tl.fromTo(
          node,
          { opacity: 0, scale: 0.65 },
          { opacity: 1, scale: 1, ease: "power2.out", duration: 0.14 },
          thresholds[i]
        );
      });

      // 3. Final Destination Node arrival bloom
      if (finalNodeRef.current) {
        tl.fromTo(
          finalNodeRef.current,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, ease: "back.out(1.5)", duration: 0.15 },
          0.90
        );
      }

      // 4. Outro text content fade-in
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.22 },
          0.85
        );
      }
    }, el);

    return () => ctx.revert();
  }, [activeDestination]);

  return (
    <section
      ref={containerRef}
      className="sjhTravelThreadOutro"
      aria-labelledby="journey-continues-title"
    >
      {/* Cinematic Sunset/Twilight Background with Subtle Vignette */}
      <div
        className="sjhTravelThreadOutro__bg"
        style={{ backgroundImage: `url('/assets/sjh-hero/travel-thread-bg.jpg')` }}
        aria-hidden="true"
      />
      <div className="sjhTravelThreadOutro__overlay" aria-hidden="true" />

      {/* Screen 06 Floating Header Lockup */}
      <header className="sjhTravelThreadOutro__brandBar" aria-hidden="true">
        <div className="sjhTravelThreadOutro__brand">
          <img
            src="/assets/sjh-hero/sjh-logo.svg"
            alt=""
            className="sjhTravelThreadOutro__logo"
            width="22"
            height="22"
          />
          <div className="sjhTravelThreadOutro__brandText">
            <span className="sjhTravelThreadOutro__brandName">SHREE JAGANNATH</span>
            <span className="sjhTravelThreadOutro__brandSub">HOLIDAYS</span>
          </div>
        </div>
      </header>

      {/* Winding Vertical Travel Thread Route Map (Screen 06 Reference Design) */}
      <div className="sjhTravelThreadOutro__routeMap" aria-hidden="true">
        <svg
          className="sjhTravelThreadOutro__routeSvg"
          viewBox="0 0 360 450"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          {/* Active Scroll-Drawn Crisp Antique Gold Spline (Hidden until drawn) */}
          <path
            ref={pathRef}
            d={routeSpline}
            className="sjhTravelThreadOutro__path"
            vectorEffect="non-scaling-stroke"
            style={{ strokeDasharray: 1200, strokeDashoffset: 1200 }}
          />
        </svg>

        {/* 4 Interactive Waypoint Nodes with High-Contrast Clear Labels */}
        {chapters.map((chap, i) => {
          const coord = nodeCoords[i];
          const hint = CHAPTER_THREAD_HINTS[chap.id];

          return (
            <div
              key={chap.id}
              ref={(el) => {
                if (el) nodesRef.current[i] = el;
              }}
              className={`sjhOutroWaypoint sjhOutroWaypoint--${coord.align}`}
              style={{
                left: `${coord.x}px`,
                top: `${coord.y}px`,
                opacity: 0,
                transform: "translate(-50%, -50%) scale(0.65)",
              }}
            >
              {/* Golden Ring Marker with Solid Dot */}
              <div className="sjhOutroWaypoint__marker">
                <div className="sjhOutroWaypoint__ring" />
                <div className="sjhOutroWaypoint__dot" />
              </div>

              {/* Waypoint Card: Icon Chip + Feeling & Destination Title */}
              <div className="sjhOutroWaypoint__card">
                <div className="sjhOutroWaypoint__iconChip">
                  <EditorialIcon name={hint?.waypointIcon || "temples"} size={16} />
                </div>
                <div className="sjhOutroWaypoint__meta">
                  <span className="sjhOutroWaypoint__feeling">{chap.feeling}</span>
                  <span className="sjhOutroWaypoint__location">{chap.location.split(" · ")[0]}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Luminous Final Destination Node */}
        <div
          ref={finalNodeRef}
          className="sjhOutroFinalNode"
          style={{
            left: `${nodeCoords[4].x}px`,
            top: `${nodeCoords[4].y}px`,
            opacity: 0,
            transform: "translate(-50%, -50%) scale(0.6)",
          }}
        >
          <div className="sjhOutroFinalNode__halo" />
          <div className="sjhOutroFinalNode__ring">
            <div className="sjhOutroFinalNode__dot" />
          </div>
        </div>
      </div>

      {/* Screen 06 Narrative Outro Typography & Phase 7 Entry */}
      <div ref={contentRef} className="sjhTravelThreadOutro__content">
        <h2 id="journey-continues-title" className="sjhTravelThreadOutro__title">
          THE JOURNEY CONTINUES.
        </h2>

        <p className="sjhTravelThreadOutro__subtitle">
          Four ways to feel.<br />
          Countless ways to travel.
        </p>

        {/* Phase 7 Entry Anchor with Interactive Circular Chevron Button */}
        <div
          className="sjhTravelThreadOutro__entryAnchor"
          data-thread-anchor="phase7-entry"
        >
          <button
            type="button"
            className="sjhTravelThreadOutro__chevronBtn"
            onClick={handleScrollToNext}
            aria-label="Scroll to Curated Journeys"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 5.5L7 9.5L11 5.5" />
            </svg>
          </button>
          {/* Subtle downward continuation beacon */}
          <div className="sjhTravelThreadOutro__guideStem" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
