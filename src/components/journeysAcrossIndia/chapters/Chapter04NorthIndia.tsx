/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: CHAPTER 04 — NORTH INDIA
 * PASS B: Horizon Strata Choreography
 * 
 * Choreography Specification (Section 8):
 * - 0.00-0.18: 04 + title line masks reveal
 * - 0.18-0.30: support copy enters
 * - 0.28-0.72: 5 Horizon lines grow with varied length & X origins:
 *     RAJASTHAN (longest line)
 *     UTTAR PRADESH (medium-long line)
 *     UTTARAKHAND (medium line)
 *     HIMACHAL PRADESH (compact line)
 *     JAMMU & KASHMIR (shortest line)
 *     Labels: opacity 0 -> 1, y 6 -> 0
 *     Lines: scaleX 0 -> 1
 * - 0.30-0.70: image rises from lower frame (translateY 16px -> 0, max 16px parallax)
 * - At final state: all 5 horizons remain fully visible
 * - 0.72-0.90: Understated CTA appears (opacity 0 -> 1, x -6px -> 0)
 * - 0.94-1.00: Chapter exit handoff: image opacity 1 -> 0.4, title y: 0 -> -10px
 * - Reverse: horizons retract naturally
 * - Scrub: 0.4
 */

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JourneyAtlasItem } from "../../../data/journeyAtlasData";
import { ChapterIndexRail } from "../ChapterIndexRail";
import { PhoneHeader } from "../PhoneHeader";

gsap.registerPlugin(ScrollTrigger);

interface Chapter04Props {
  data: JourneyAtlasItem;
  allData: JourneyAtlasItem[];
  onSelectIndex: (index: number) => void;
  onOpenPlanner?: (destinationHint?: string) => void;
}

export function Chapter04NorthIndia({
  data,
  allData,
  onSelectIndex,
  onOpenPlanner,
}: Chapter04Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  // Typography refs
  const numRef = useRef<HTMLSpanElement>(null);
  const titleLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const copyRef = useRef<HTMLParagraphElement>(null);

  // Horizon entries refs
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Photo & CTA refs
  const photoImgRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenPlanner?.("north-india");
  };

  const horizons = [
    { name: "RAJASTHAN", offset: 0, lineWidth: 210 },
    { name: "UTTAR PRADESH", offset: 16, lineWidth: 175 },
    { name: "UTTARAKHAND", offset: 30, lineWidth: 140 },
    { name: "HIMACHAL PRADESH", offset: 12, lineWidth: 110 },
    { name: "JAMMU & KASHMIR", offset: 38, lineWidth: 75 },
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
        entryRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 });
        });
        lineRefs.current.forEach((el) => {
          if (el) gsap.set(el, { scaleX: 1 });
        });
        gsap.set(photoImgRef.current, { translateY: 0, scale: 1, opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 1, x: 0 });
        return;
      }

      // Initial state: hidden for triggered reveal
      gsap.set(numRef.current, { opacity: 0, y: 6 });
      titleLineRefs.current.forEach((line) => {
        if (line) gsap.set(line, { y: "105%", opacity: 0 });
      });
      gsap.set(copyRef.current, { opacity: 0, y: 8 });

      entryRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 6 });
      });
      lineRefs.current.forEach((el) => {
        if (el) gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      });

      gsap.set(photoImgRef.current, {
        y: 16,
        scale: 1.02,
        opacity: 0.75,
      });
      gsap.set(ctaRef.current, { opacity: 0, x: -6 });

      // Triggered timeline (Zero Sticky, Zero Pin, Zero Exit Fade)
      const tl = gsap.timeline({ paused: true });

      // 0.00 - 0.22: 04 + title reveal
      tl.to(numRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.00);
      titleLineRefs.current.forEach((line, idx) => {
        if (!line) return;
        tl.to(
          line,
          { y: "0%", opacity: 1, duration: 0.32, ease: "power3.out" },
          0.08 + idx * 0.08
        );
      });

      // 0.20 - 0.44: Support copy enters
      tl.to(copyRef.current, { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" }, 0.20);

      // Horizons extend and labels resolve
      const horizonTimings = [
        { label: 0.24, line: 0.26 },
        { label: 0.34, line: 0.36 },
        { label: 0.44, line: 0.46 },
        { label: 0.54, line: 0.56 },
        { label: 0.64, line: 0.66 },
      ];

      horizons.forEach((_, idx) => {
        const { label: tLabel, line: tLine } = horizonTimings[idx];
        const entry = entryRefs.current[idx];
        const line = lineRefs.current[idx];

        if (entry) {
          tl.to(entry, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, tLabel);
        }
        if (line) {
          tl.to(line, { scaleX: 1, duration: 0.20, ease: "power2.out" }, tLine);
        }
      });

      // 0.28 - 0.83: Photo settles
      tl.to(
        photoImgRef.current,
        {
          y: 0,
          scale: 1.0,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
        },
        0.28
      );

      // 0.76 - 1.00: Understated CTA enters
      tl.to(
        ctaRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.24,
          ease: "power2.out",
        },
        0.76
      );

      ScrollTrigger.create({
        trigger: stage,
        start: "top 65%",
        once: true,
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
      });

      (window as any).__P9_NORTH_TL__ = tl;
    }, stage);

    return () => {
      delete (window as any).__P9_NORTH_TL__;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={trackRef} className="p9-chapterTrack p9-chapterTrack--north">
      <article
        ref={stageRef}
        id="p9-ch-04"
        className="p9-viewport p9-chapter p9-chapter--north p9-chapterStage"
        aria-label="Chapter 04: North India Tours"
      >
        {/* Top Header Bar: SJH | ≡ */}
        <PhoneHeader />

        {/* Top Archived Rows Rail */}
        <ChapterIndexRail
          items={allData}
          currentIndex={3}
          onSelectIndex={onSelectIndex}
        />

        {/* Chapter Number & Title */}
        <div className="p9-chapter__header">
          <span ref={numRef} className="p9-chapter__num">{data.number}</span>
          <h3 className="p9-chapter__title">
            {["NORTH", "INDIA TOURS"].map((line, idx) => (
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
            Mountains, heritage, spirituality
            <br />
            and unforgettable landscapes.
          </p>
        </div>

        {/* Horizon Language: Horizontal Strata Lines with Varied Length & Slight X Offsets */}
        <div className="p9-chHorizons" aria-label="North India Regional Horizons">
          {horizons.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => {
                entryRefs.current[idx] = el;
              }}
              className="p9-chHorizons__entry"
              style={{ marginLeft: `${item.offset}px` }}
            >
              <span className="p9-chHorizons__name">{item.name}</span>
              <div
                ref={(el) => {
                  lineRefs.current[idx] = el;
                }}
                className="p9-chHorizons__line"
                style={{ width: `${item.lineWidth}px` }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Lower Photo: p9-north-india.png with soft upward blend */}
        <div className="p9-chapter__photoStage">
          <div className="p9-chapter__photoBlend" aria-hidden="true" />
          <img
            ref={photoImgRef}
            src={data.asset}
            alt="Ancient Himalayan monastery and golden palace along river valley at sunset"
            className="p9-chapter__photoImg"
            loading="lazy"
          />

          {/* Understated Editorial Text CTA */}
          <a
            ref={ctaRef}
            href={data.href || "/concierge"}
            onClick={handleCtaClick}
            className="p9-understatedCta"
            aria-label="Explore North India"
          >
            <span className="p9-understatedCta__label">Explore North India</span>
            <span className="p9-understatedCta__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </div>
  );
}
