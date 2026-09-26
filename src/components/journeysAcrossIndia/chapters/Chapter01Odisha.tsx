/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: CHAPTER 01 — ODISHA
 * PASS B: Sacred Atlas Route Choreography
 * 
 * Choreography Specification (Section 5):
 * - 0.00-0.15: 01 number reveals
 * - 0.08-0.28: title mask reveal (ODISHA & / JAGANNATH / PILGRIMAGE)
 * - 0.22-0.40: support copy enters
 * - 0.30-0.75: atlas route draws progressively:
 *     Puri node appears first -> line grows -> Konark -> line grows ->
 *     Bhubaneswar -> Dhauli -> Udayagiri & Khandagiri -> Chilika
 *     Each node: scale .7 -> 1, opacity 0 -> 1
 *     Destination label: opacity 0 -> 1, x offset ~6-10px -> 0
 * - 0.30-0.75: image resolves progressively (clip-path inset(20% 0 0 12%) -> inset(0), scale 1.035 -> 1)
 * - 0.75-0.92: Understated CTA reveals after route >75% complete: opacity 0 -> 1, x: -6px -> 0
 * - 0.94-1.00: Chapter exit handoff: image opacity 1 -> 0.4, title y: 0 -> -10px
 * - Reverse scroll: route and nodes undraw in exact reverse sequence
 * - Scrub: 0.45
 */

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JourneyAtlasItem } from "../../../data/journeyAtlasData";
import { ChapterIndexRail } from "../ChapterIndexRail";
import { PhoneHeader } from "../PhoneHeader";

gsap.registerPlugin(ScrollTrigger);

interface Chapter01Props {
  data: JourneyAtlasItem;
  allData: JourneyAtlasItem[];
  onSelectIndex: (index: number) => void;
  onNavigateRoute?: (journeyId: string, href: string) => void;
}

export function Chapter01Odisha({
  data,
  allData,
  onSelectIndex,
  onNavigateRoute,
}: Chapter01Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  // Typography refs
  const numRef = useRef<HTMLSpanElement>(null);
  const titleLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const copyRef = useRef<HTMLParagraphElement>(null);

  // Route refs
  const routePathRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const labelRefs = useRef<(SVGTextElement | null)[]>([]);

  // Photo & CTA refs
  const photoImgRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateRoute && data.href) {
      onNavigateRoute("sacred-odisha", data.href);
    } else if (data.href) {
      window.location.href = data.href;
    }
  };

  // Irregular route coordinates with non-overlapping label geometry across 340 x 134 canvas
  const routeNodes = [
    { name: "PURI", x: 40, y: 20, labelX: 52, labelY: 20, align: "start" as const, prime: true },
    { name: "KONARK", x: 250, y: 34, labelX: 260, labelY: 34, align: "start" as const },
    { name: "BHUBANESWAR", x: 145, y: 58, labelX: 135, labelY: 58, align: "end" as const },
    { name: "DHAULI", x: 50, y: 82, labelX: 62, labelY: 82, align: "start" as const },
    { name: "UDAYAGIRI & KHANDAGIRI", x: 195, y: 104, labelX: 185, labelY: 104, align: "end" as const },
    { name: "CHILIKA", x: 265, y: 122, labelX: 253, labelY: 122, align: "end" as const },
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
        gsap.set(routePathRef.current, { strokeDashoffset: 0 });
        nodeRefs.current.forEach((el) => {
          if (el) gsap.set(el, { scale: 1, opacity: 1 });
        });
        labelRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, x: 0 });
        });
        gsap.set(photoImgRef.current, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 1, x: 0 });
        return;
      }

      // Initial state: hidden for progressive scroll-driven reveal
      gsap.set(numRef.current, { opacity: 0, y: 6 });
      titleLineRefs.current.forEach((line) => {
        if (line) gsap.set(line, { y: "105%", opacity: 0 });
      });
      gsap.set(copyRef.current, { opacity: 0, y: 8 });

      // Path length ~ 700px
      const pathLength = 700;
      gsap.set(routePathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      nodeRefs.current.forEach((node) => {
        if (node) gsap.set(node, { scale: 0.7, opacity: 0, transformOrigin: "center center" });
      });

      labelRefs.current.forEach((label, idx) => {
        if (!label) return;
        const offset = routeNodes[idx].align === "end" ? 8 : -8;
        gsap.set(label, { opacity: 0, x: offset });
      });

      gsap.set(photoImgRef.current, {
        y: 16,
        scale: 1.025,
        opacity: 0.75,
        clipPath: "inset(12% 0% 0% 0%)",
      });
      gsap.set(ctaRef.current, { opacity: 0, x: -6 });

      // Master Scroll-Linked Scrub Timeline (Normal Flow — Zero Sticky, Zero Pin, Zero Exit Fade)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top 82%",
          end: "bottom 55%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      // 0.00 - 0.16: 01 number reveals
      tl.to(numRef.current, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.00);

      // 0.06 - 0.28: Title mask reveal
      titleLineRefs.current.forEach((line, idx) => {
        if (!line) return;
        tl.to(
          line,
          { y: "0%", opacity: 1, duration: 0.20, ease: "power3.out" },
          0.06 + idx * 0.06
        );
      });

      // 0.18 - 0.34: Support copy enters
      tl.to(copyRef.current, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.18);

      // 0.22 - 0.72: Progressive sacred atlas route drawing
      tl.to(
        routePathRef.current,
        {
          strokeDashoffset: 0,
          duration: 0.50,
          ease: "power1.inOut",
        },
        0.22
      );

      // Progressive destination nodes & labels appear along route
      const nodeTimings = [0.24, 0.33, 0.42, 0.51, 0.60, 0.69];
      routeNodes.forEach((_, idx) => {
        const t = nodeTimings[idx];
        const node = nodeRefs.current[idx];
        const label = labelRefs.current[idx];

        if (node) {
          tl.to(node, { scale: 1, opacity: 1, duration: 0.10, ease: "back.out(1.8)" }, t);
        }
        if (label) {
          tl.to(label, { opacity: 1, x: 0, duration: 0.12, ease: "power2.out" }, t + 0.02);
        }
      });

      // 0.24 - 0.75: Photo resolves smoothly
      tl.to(
        photoImgRef.current,
        {
          y: 0,
          scale: 1.0,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.51,
          ease: "power2.out",
        },
        0.24
      );

      // 0.75 - 0.95: Understated CTA reveals (settles into final visible state)
      tl.to(
        ctaRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.20,
          ease: "power2.out",
        },
        0.75
      );

      // Register hook for testing
      (window as any).__P9_ODISHA_TL__ = tl;
    }, stage);

    return () => {
      delete (window as any).__P9_ODISHA_TL__;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={trackRef} className="p9-chapterTrack p9-chapterTrack--odisha">
      <article
        ref={stageRef}
        id="p9-ch-01"
        className="p9-viewport p9-chapter p9-chapter--odisha p9-chapterStage"
        aria-label="Chapter 01: Odisha & Jagannath Pilgrimage"
      >
        {/* Top Header Bar: SJH | ≡ */}
        <PhoneHeader />

        {/* Top Archived Rows Rail */}
        <ChapterIndexRail
          items={allData}
          currentIndex={0}
          onSelectIndex={onSelectIndex}
        />

        {/* Chapter Number & Title */}
        <div className="p9-chapter__header">
          <span ref={numRef} className="p9-chapter__num">{data.number}</span>
          <h3 className="p9-chapter__title">
            {["ODISHA &", "JAGANNATH", "PILGRIMAGE"].map((line, idx) => (
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
          <p ref={copyRef} className="p9-chapter__copy">
            Sacred coast, ancient temples and a living tradition.
          </p>
        </div>

        {/* Irregular Code-Driven Editorial Atlas Route */}
        <div className="p9-odishaAtlasRoute" aria-label="Odisha Editorial Atlas Route">
          <svg
            className="p9-odishaAtlasRoute__svg"
            viewBox="0 0 340 134"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* Subtle connecting antique-gold path */}
            <path
              ref={routePathRef}
              d="M 40,20 L 250,34 L 145,58 L 50,82 L 195,104 L 265,122"
              stroke="#B99455"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Destination points & labels along irregular geometry */}
            {routeNodes.map((node, idx) => (
              <g
                key={idx}
                ref={(el) => {
                  nodeRefs.current[idx] = el;
                }}
                className="p9-odishaAtlasRoute__group"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.prime ? 4.5 : 3}
                  fill="#B99455"
                  stroke="#F4EFE6"
                  strokeWidth="1.5"
                />
                {node.prime && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="7.5"
                    fill="none"
                    stroke="#B99455"
                    strokeWidth="0.8"
                    opacity="0.6"
                  />
                )}
                <text
                  ref={(el) => {
                    labelRefs.current[idx] = el;
                  }}
                  x={node.labelX}
                  y={node.labelY}
                  textAnchor={node.align}
                  className="p9-odishaAtlasRoute__text"
                >
                  {node.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Lower Photo: p9-odisha-pilgrimage.png with soft upward blend */}
        <div className="p9-chapter__photoStage">
          <div className="p9-chapter__photoBlend" aria-hidden="true" />
          <img
            ref={photoImgRef}
            src={data.asset}
            alt="Puri Jagannath temple spire and coastal pilgrimage scene"
            className="p9-chapter__photoImg"
            loading="lazy"
          />

          {/* Understated Editorial Text CTA */}
          <a
            ref={ctaRef}
            href={data.href || "/journeys/sacred-odisha"}
            onClick={handleCtaClick}
            className="p9-understatedCta"
            aria-label="Explore Odisha Journey"
          >
            <span className="p9-understatedCta__label">Explore Odisha Journey</span>
            <span className="p9-understatedCta__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </div>
  );
}
