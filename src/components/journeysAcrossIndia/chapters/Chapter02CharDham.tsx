/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: CHAPTER 02 — CHAR DHAM
 * PASS B: Ascending Pilgrimage Choreography
 * 
 * Choreography Specification (Section 6):
 * - 0.00-0.18: 02 + title enter via line masks
 * - 0.20-0.32: support copy enters
 * - 0.28-0.72: ascent path animates upward (Yamunotri -> Gangotri -> Kedarnath -> Badrinath)
 *     Each waypoint: y 14px -> 0, opacity 0 -> 1
 *     Connecting line: strokeDashoffset animation upward
 * - 0.28-0.72: mountain image upward curtain reveal (clip-path inset(28% 0 0 0) -> inset(0), translateY 16px -> 0, scale 1.025 -> 1)
 * - 0.72-0.90: Understated CTA enters at final waypoint (opacity 0 -> 1, x -6px -> 0)
 * - 0.94-1.00: Chapter exit handoff: image opacity 1 -> 0.4, title y: 0 -> -10px
 * - Reverse: waypoints collapse in exact reverse order
 * - Scrub: 0.5
 */

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JourneyAtlasItem } from "../../../data/journeyAtlasData";
import { ChapterIndexRail } from "../ChapterIndexRail";
import { PhoneHeader } from "../PhoneHeader";

gsap.registerPlugin(ScrollTrigger);

interface Chapter02Props {
  data: JourneyAtlasItem;
  allData: JourneyAtlasItem[];
  onSelectIndex: (index: number) => void;
  onOpenPlanner?: (destinationHint?: string) => void;
}

export function Chapter02CharDham({
  data,
  allData,
  onSelectIndex,
  onOpenPlanner,
}: Chapter02Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  // Typography refs
  const numRef = useRef<HTMLSpanElement>(null);
  const titleLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const copyRef = useRef<HTMLParagraphElement>(null);

  // Ascent refs
  const ascentPathRef = useRef<SVGPathElement>(null);
  const waypointRefs = useRef<(SVGGElement | null)[]>([]);

  // Photo & CTA refs
  const photoImgRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenPlanner?.("char-dham");
  };

  const shrines = [
    { name: "YAMUNOTRI", alt: "3,291 m", x: 42, y: 108, labelX: 52, labelY: 112, anchor: "start" },
    { name: "GANGOTRI", alt: "3,100 m", x: 118, y: 78, labelX: 128, labelY: 82, anchor: "start" },
    { name: "KEDARNATH", alt: "3,583 m", x: 198, y: 48, labelX: 208, labelY: 52, anchor: "start" },
    { name: "BADRINATH", alt: "3,300 m", x: 275, y: 18, labelX: 265, labelY: 14, anchor: "end", isPeak: true },
  ];

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(numRef.current, { opacity: 1, y: 0 });
        titleLineRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: "0%", opacity: 1 });
        });
        gsap.set(copyRef.current, { opacity: 1, y: 0 });
        gsap.set(ascentPathRef.current, { strokeDashoffset: 0 });
        waypointRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 });
        });
        gsap.set(photoImgRef.current, { clipPath: "inset(0% 0% 0% 0%)", translateY: 0, scale: 1, opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 1, x: 0 });
        return;
      }

      // Initial state: hidden for triggered reveal
      gsap.set(numRef.current, { opacity: 0, y: 6 });
      titleLineRefs.current.forEach((line) => {
        if (line) gsap.set(line, { y: "105%", opacity: 0 });
      });
      gsap.set(copyRef.current, { opacity: 0, y: 8 });

      const pathLength = 450;
      gsap.set(ascentPathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      waypointRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 14 });
      });

      gsap.set(photoImgRef.current, {
        y: 16,
        scale: 1.025,
        opacity: 0,
        clipPath: "inset(12% 0% 0% 0%)",
      });
      gsap.set(ctaRef.current, { opacity: 0, x: -6 });

      // Triggered Ascent Timeline (Complete around 800-950ms)
      const tl = gsap.timeline({ paused: true });

      // 0.00: 02 + title reveal
      tl.to(numRef.current, { opacity: 1, y: 0, duration: 0.20, ease: "power2.out" }, 0.00);
      titleLineRefs.current.forEach((line, idx) => {
        if (!line) return;
        tl.to(
          line,
          { y: "0%", opacity: 1, duration: 0.24, ease: "power3.out" },
          0.06 + idx * 0.06
        );
      });

      // 0.16: Support copy enters
      tl.to(copyRef.current, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.16);

      // 0.20: Ascending connecting line draws upward
      tl.to(
        ascentPathRef.current,
        {
          strokeDashoffset: 0,
          duration: 0.48,
          ease: "power1.inOut",
        },
        0.20
      );

      // Waypoints activate sequentially in climbing elevation order (Yamunotri -> Gangotri -> Kedarnath -> Badrinath)
      const waypointTimings = [0.22, 0.34, 0.46, 0.58];
      shrines.forEach((_, idx) => {
        const t = waypointTimings[idx];
        const el = waypointRefs.current[idx];
        if (el) {
          tl.to(el, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, t);
        }
      });

      // 0.24: Mountain image settles
      tl.to(
        photoImgRef.current,
        {
          y: 0,
          scale: 1.0,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.55,
          ease: "power3.out",
        },
        0.24
      );

      // 0.68: Understated CTA enters at final waypoint
      tl.to(
        ctaRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.20,
          ease: "power2.out",
        },
        0.68
      );

      // Trigger entrance once stage enters 72% of viewport
      ScrollTrigger.create({
        trigger: stage,
        start: "top 72%",
        once: true,
        onEnter: () => tl.play(),
      });

      (window as any).__P9_CHARDHAM_TL__ = tl;
    }, stage);

    return () => {
      delete (window as any).__P9_CHARDHAM_TL__;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={trackRef} className="p9-chapterTrack p9-chapterTrack--chardham">
      <article
        ref={stageRef}
        id="p9-ch-02"
        className="p9-viewport p9-chapter p9-chapter--chardham p9-chapterStage"
        aria-label="Chapter 02: Char Dham Yatra"
      >
        {/* Top Header Bar: SJH | ≡ */}
        <PhoneHeader />

        {/* Top Archived Rows Rail */}
        <ChapterIndexRail
          items={allData}
          currentIndex={1}
          onSelectIndex={onSelectIndex}
        />

        {/* Chapter Number & Title */}
        <div className="p9-chapter__header">
          <span ref={numRef} className="p9-chapter__num">{data.number}</span>
          <h3 className="p9-chapter__title">
            {["CHAR DHAM", "YATRA"].map((line, idx) => (
              <span key={idx} className="p9-maskedLine">
                <span
                  ref={(el) => {
                    titleLineRefs.current[idx] = el;
                  }}
                  className="p9-maskedLine__inner"
                >
                  {line}
                </span>
              </span>
            ))}
          </h3>
          <p ref={copyRef} className="p9-chapter__copy">{data.copy}</p>
        </div>

        {/* Ascending Pilgrimage Composition (Feels Like Climbing) */}
        <div className="p9-chAscent" aria-label="Char Dham Himalayan Ascent">
          <svg
            className="p9-chAscent__svg"
            viewBox="0 0 340 134"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* Subtle contour lines suggesting mountain elevation */}
            <path
              d="M 20,126 Q 90,118 160,88 T 320,30"
              stroke="#B99455"
              strokeWidth="0.6"
              strokeDasharray="2 4"
              opacity="0.3"
            />
            <path
              d="M 40,132 Q 130,125 210,75 T 330,14"
              stroke="#B99455"
              strokeWidth="0.6"
              strokeDasharray="2 4"
              opacity="0.2"
            />

            {/* Ascending connecting climbing line */}
            <path
              ref={ascentPathRef}
              d="M 28,122 L 42,108 L 118,78 L 198,48 L 275,18 L 305,10"
              stroke="#B99455"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Stepped elevation ticks */}
            <line x1="20" y1="108" x2="42" y2="108" stroke="#B99455" strokeWidth="0.6" opacity="0.4" />
            <line x1="80" y1="78" x2="118" y2="78" stroke="#B99455" strokeWidth="0.6" opacity="0.4" />
            <line x1="160" y1="48" x2="198" y2="48" stroke="#B99455" strokeWidth="0.6" opacity="0.4" />
            <line x1="240" y1="18" x2="275" y2="18" stroke="#B99455" strokeWidth="0.6" opacity="0.4" />

            {/* Ascent Shrines */}
            {shrines.map((shrine, idx) => (
              <g
                key={idx}
                ref={(el) => {
                  waypointRefs.current[idx] = el;
                }}
                className="p9-chAscent__group"
              >
                {shrine.isPeak ? (
                  <>
                    <polygon
                      points={`${shrine.x},${shrine.y - 6} ${shrine.x + 5},${shrine.y + 3} ${shrine.x - 5},${shrine.y + 3}`}
                      fill="#B99455"
                    />
                    <circle
                      cx={shrine.x}
                      cy={shrine.y}
                      r="8"
                      fill="none"
                      stroke="#B99455"
                      strokeWidth="0.8"
                      opacity="0.5"
                    />
                  </>
                ) : (
                  <circle
                    cx={shrine.x}
                    cy={shrine.y}
                    r="3.5"
                    fill="#B99455"
                    stroke="#F4EFE6"
                    strokeWidth="1.5"
                  />
                )}

                <text
                  x={shrine.labelX}
                  y={shrine.labelY}
                  textAnchor={shrine.anchor as any}
                  className="p9-chAscent__text"
                >
                  {shrine.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Lower Photo: p9-char-dham.png with soft upward blend */}
        <div className="p9-chapter__photoStage">
          <div className="p9-chapter__photoBlend" aria-hidden="true" />
          <img
            ref={photoImgRef}
            src={data.asset}
            alt="Kedarnath temple and snow-clad Himalayan mountain peaks"
            className="p9-chapter__photoImg"
            loading="lazy"
          />

          {/* Understated Editorial Text CTA */}
          <a
            ref={ctaRef}
            href={data.href || "/concierge"}
            onClick={handleCtaClick}
            className="p9-understatedCta"
            aria-label="Plan Char Dham Journey"
          >
            <span className="p9-understatedCta__label">Plan Char Dham Journey</span>
            <span className="p9-understatedCta__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </div>
  );
}
