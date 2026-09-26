/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: CHAPTER 03 — SOUTH INDIA
 * PASS B: Flow Ribbon Choreography
 * 
 * Choreography Specification (Section 7):
 * - 0.00-0.18: 03 + title line masks reveal
 * - 0.18-0.30: support copy enters
 * - 0.28-0.72: route ribbon begins (strokeDashoffset full -> 0)
 *     Locations resolve along curve with organic timing:
 *     Tamil Nadu (first), Kerala (short delay), Karnataka (longer gap),
 *     Andhra Pradesh (short gap), Telangana (settles last)
 * - 0.30-0.72: image lifts gently into place (clip-path inset(18% 0 0 0) -> inset(0), translateY 14px -> 0)
 * - 0.72-0.90: Understated CTA appears once flow resolves (opacity 0 -> 1, x -6px -> 0)
 * - 0.94-1.00: Chapter exit handoff: image opacity 1 -> 0.4, title y: 0 -> -10px
 * - Reverse: ribbon and locations undraw in reverse order
 * - Scrub: 0.45
 */

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JourneyAtlasItem } from "../../../data/journeyAtlasData";
import { ChapterIndexRail } from "../ChapterIndexRail";
import { PhoneHeader } from "../PhoneHeader";

gsap.registerPlugin(ScrollTrigger);

interface Chapter03Props {
  data: JourneyAtlasItem;
  allData: JourneyAtlasItem[];
  onSelectIndex: (index: number) => void;
  onOpenPlanner?: (destinationHint?: string) => void;
}

export function Chapter03SouthIndia({
  data,
  allData,
  onSelectIndex,
  onOpenPlanner,
}: Chapter03Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  // Typography refs
  const numRef = useRef<HTMLSpanElement>(null);
  const titleLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const copyRef = useRef<HTMLParagraphElement>(null);

  // Flow Ribbon refs
  const ribbonPathRef = useRef<SVGPathElement>(null);
  const ribbonWashRef = useRef<SVGPathElement>(null);
  const locationRefs = useRef<(SVGGElement | null)[]>([]);

  // Photo & CTA refs
  const photoImgRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenPlanner?.("south-india");
  };

  const flowNodes = [
    { name: "TAMIL NADU", x: 42, y: 40, labelX: 42, labelY: 26, anchor: "start" },
    { name: "KERALA", x: 106, y: 104, labelX: 106, labelY: 120, anchor: "middle" },
    { name: "KARNATAKA", x: 172, y: 64, labelX: 172, labelY: 48, anchor: "middle" },
    { name: "ANDHRA PRADESH", x: 236, y: 38, labelX: 236, labelY: 24, anchor: "middle" },
    { name: "TELANGANA", x: 298, y: 86, labelX: 298, labelY: 102, anchor: "end" },
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
        gsap.set(ribbonPathRef.current, { strokeDashoffset: 0 });
        gsap.set(ribbonWashRef.current, { opacity: 1 });
        locationRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, scale: 1 });
        });
        gsap.set(photoImgRef.current, { clipPath: "inset(0% 0% 0% 0%)", translateY: 0, opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 1, x: 0 });
        return;
      }

      // Initial state: hidden for triggered reveal
      gsap.set(numRef.current, { opacity: 0, y: 6 });
      titleLineRefs.current.forEach((line) => {
        if (line) gsap.set(line, { y: "105%", opacity: 0 });
      });
      gsap.set(copyRef.current, { opacity: 0, y: 8 });

      const pathLength = 550;
      gsap.set(ribbonPathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });
      gsap.set(ribbonWashRef.current, { opacity: 0 });

      locationRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, scale: 0.7, transformOrigin: "center center" });
      });

      gsap.set(photoImgRef.current, {
        y: 16,
        scale: 1.025,
        opacity: 0.75,
        clipPath: "inset(12% 0% 0% 0%)",
      });
      gsap.set(ctaRef.current, { opacity: 0, x: -6 });

      // Triggered timeline (Zero Sticky, Zero Pin, Zero Exit Fade)
      const tl = gsap.timeline({ paused: true });

      // 0.00 - 0.22: 03 + title reveal
      tl.to(numRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.00);
      titleLineRefs.current.forEach((line, idx) => {
        if (!line) return;
        tl.to(
          line,
          { y: "0%", opacity: 1, duration: 0.32, ease: "power3.out" },
          0.08 + idx * 0.08
        );
      });

      // 0.22 - 0.44: Support copy enters
      tl.to(copyRef.current, { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" }, 0.22);

      // 0.26 - 0.80: Route ribbon begins
      tl.to(
        ribbonPathRef.current,
        {
          strokeDashoffset: 0,
          duration: 0.55,
          ease: "power1.inOut",
        },
        0.26
      );
      tl.to(
        ribbonWashRef.current,
        { opacity: 1, duration: 0.45, ease: "power1.inOut" },
        0.30
      );

      // Locations resolve along curve
      const flowTimings = [0.28, 0.40, 0.52, 0.62, 0.72];
      flowNodes.forEach((_, idx) => {
        const t = flowTimings[idx];
        const el = locationRefs.current[idx];
        if (el) {
          tl.to(el, { opacity: 1, scale: 1, duration: 0.16, ease: "back.out(1.6)" }, t);
        }
      });

      // 0.30 - 0.85: Photo settles into place
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
        0.30
      );

      // 0.80 - 1.04: Understated CTA appears once flow resolves
      tl.to(
        ctaRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.24,
          ease: "power2.out",
        },
        0.80
      );

      ScrollTrigger.create({
        trigger: stage,
        start: "top 65%",
        once: true,
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
      });

      (window as any).__P9_SOUTH_TL__ = tl;
    }, stage);

    return () => {
      delete (window as any).__P9_SOUTH_TL__;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={trackRef} className="p9-chapterTrack p9-chapterTrack--south">
      <article
        ref={stageRef}
        id="p9-ch-03"
        className="p9-viewport p9-chapter p9-chapter--south p9-chapterStage"
        aria-label="Chapter 03: South India Tours"
      >
        {/* Top Header Bar: SJH | ≡ */}
        <PhoneHeader />

        {/* Top Archived Rows Rail */}
        <ChapterIndexRail
          items={allData}
          currentIndex={2}
          onSelectIndex={onSelectIndex}
        />

        {/* Chapter Number & Title */}
        <div className="p9-chapter__header">
          <span ref={numRef} className="p9-chapter__num">{data.number}</span>
          <h3 className="p9-chapter__title">
            {["SOUTH", "INDIA TOURS"].map((line, idx) => (
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
            Temples, backwaters, beaches
            <br />
            and timeless culture.
          </p>
        </div>

        {/* Flow Language: Broad Gentle Code-Drawn Ribbon / Curve */}
        <div className="p9-chFlowRibbon" aria-label="South India Flowing Ribbon">
          <svg
            className="p9-chFlowRibbon__svg"
            viewBox="0 0 340 134"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* Subtle flowing ribbon wash */}
            <path
              ref={ribbonWashRef}
              d="M 12,74 C 55,20 100,122 165,68 C 220,18 265,115 328,58 L 328,68 C 265,125 220,28 165,78 C 100,132 55,30 12,84 Z"
              fill="rgba(185, 148, 85, 0.10)"
            />

            {/* Broad gentle curved ribbon spine */}
            <path
              ref={ribbonPathRef}
              d="M 12,79 C 55,25 100,127 165,73 C 220,23 265,120 328,63"
              stroke="#B99455"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              vectorEffect="non-scaling-stroke"
            />

            {/* Secondary parallel wave echo */}
            <path
              d="M 18,87 C 60,35 105,135 168,81 C 223,31 270,128 325,72"
              stroke="#B99455"
              strokeWidth="0.6"
              strokeDasharray="2 4"
              opacity="0.35"
            />

            {/* Flow Nodes along Ribbon */}
            {flowNodes.map((node, idx) => (
              <g
                key={idx}
                ref={(el) => {
                  locationRefs.current[idx] = el;
                }}
                className="p9-chFlowRibbon__group"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3.5"
                  fill="#B99455"
                  stroke="#F4EFE6"
                  strokeWidth="1.5"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="6.5"
                  fill="none"
                  stroke="#B99455"
                  strokeWidth="0.7"
                  opacity="0.4"
                />
                <text
                  x={node.labelX}
                  y={node.labelY}
                  textAnchor={node.anchor as any}
                  className="p9-chFlowRibbon__text"
                >
                  {node.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Lower Photo: p9-south-india.png with soft upward blend */}
        <div className="p9-chapter__photoStage">
          <div className="p9-chapter__photoBlend" aria-hidden="true" />
          <img
            ref={photoImgRef}
            src={data.asset}
            alt="Traditional Kerala houseboat sailing through lush backwaters at sunset"
            className="p9-chapter__photoImg"
            loading="lazy"
          />

          {/* Understated Editorial Text CTA */}
          <a
            ref={ctaRef}
            href={data.href || "/concierge"}
            onClick={handleCtaClick}
            className="p9-understatedCta"
            aria-label="Explore South India"
          >
            <span className="p9-understatedCta__label">Explore South India</span>
            <span className="p9-understatedCta__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </div>
  );
}
