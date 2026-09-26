/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: CHAPTER 07 — CENTRAL INDIA
 * PASS B: Grounded Earth Choreography
 * 
 * Choreography Specification (Section 11):
 * - Grounded, earthy, stable composition
 * - 0.00-0.24: 07 reveals, title settles DOWNWARD (y -10px -> 0, opacity 0 -> 1)
 * - 0.20-0.38: body copy fades in
 * - 0.32-0.55: architectural plumb-line draws downward (scaleY 0 -> 1, transform-origin top)
 * - 0.50-0.65: grounding bracket expands (scaleX 0 -> 1)
 * - 0.35-0.70: image enters from lower edge (translateY 22px -> 0, opacity .85 -> 1)
 * - 0.65-0.85: Understated CTA enters near baseline (opacity 0 -> 1, x -5px -> 0)
 * - 0.94-1.00: Chapter exit handoff: image opacity 1 -> 0.4, title y: 0 -> -10px
 * - Reverse: plumb-line retracts upward, title moves back to -10px
 * - Scrub: 0.3
 */

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JourneyAtlasItem } from "../../../data/journeyAtlasData";
import { ChapterIndexRail } from "../ChapterIndexRail";
import { PhoneHeader } from "../PhoneHeader";

gsap.registerPlugin(ScrollTrigger);

interface Chapter07Props {
  data: JourneyAtlasItem;
  allData: JourneyAtlasItem[];
  onSelectIndex: (index: number) => void;
  onOpenPlanner?: (destinationHint?: string) => void;
}

export function Chapter07CentralIndia({
  data,
  allData,
  onSelectIndex,
  onOpenPlanner,
}: Chapter07Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  // Typography refs
  const numRef = useRef<HTMLSpanElement>(null);
  const titleLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const copyRef = useRef<HTMLParagraphElement>(null);

  // Grounded plumb-line refs
  const plumbLineRef = useRef<HTMLDivElement>(null);
  const bracketRef = useRef<HTMLDivElement>(null);

  // Photo & CTA refs
  const photoImgRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenPlanner?.("central-india");
  };

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
        gsap.set(plumbLineRef.current, { scaleY: 1 });
        gsap.set(bracketRef.current, { scaleX: 1 });
        gsap.set(photoImgRef.current, { translateY: 0, opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 1, x: 0 });
        return;
      }

      // Initial state: hidden for triggered reveal (title settles DOWNWARD from -8px)
      gsap.set(numRef.current, { opacity: 0, y: -8 });
      titleLineRefs.current.forEach((line) => {
        if (line) gsap.set(line, { y: "-10px", opacity: 0 });
      });
      gsap.set(copyRef.current, { opacity: 0, y: 8 });

      gsap.set(plumbLineRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(bracketRef.current, { scaleX: 0, transformOrigin: "center center" });

      gsap.set(photoImgRef.current, {
        y: 18,
        scale: 1.02,
        opacity: 0.80,
      });
      gsap.set(ctaRef.current, { opacity: 0, x: -5 });

      // Triggered timeline (Zero Sticky, Zero Pin, Zero Exit Fade)
      const tl = gsap.timeline({ paused: true });

      // 0.00 - 0.22: 07 reveals & title settles DOWNWARD
      tl.to(numRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.00);
      titleLineRefs.current.forEach((line, idx) => {
        if (!line) return;
        tl.to(
          line,
          { y: "0px", opacity: 1, duration: 0.32, ease: "power2.out" },
          0.08 + idx * 0.08
        );
      });

      // 0.20 - 0.42: Body copy fades in
      tl.to(copyRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.20);

      // 0.26 - 0.58: Architectural plumb-line draws downward to ground
      tl.to(
        plumbLineRef.current,
        { scaleY: 1, duration: 0.32, ease: "power2.out" },
        0.26
      );

      // 0.38 - 0.62: Grounding bracket expands
      tl.to(
        bracketRef.current,
        { scaleX: 1, duration: 0.24, ease: "power2.out" },
        0.38
      );

      // 0.28 - 0.80: Image settles
      tl.to(
        photoImgRef.current,
        {
          y: 0,
          scale: 1.0,
          opacity: 1.0,
          duration: 0.52,
          ease: "power3.out",
        },
        0.28
      );

      // 0.72 - 0.96: Understated CTA enters
      tl.to(
        ctaRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.24,
          ease: "power2.out",
        },
        0.72
      );

      ScrollTrigger.create({
        trigger: stage,
        start: "top 65%",
        once: true,
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
      });

      (window as any).__P9_CENTRAL_TL__ = tl;
    }, stage);

    return () => {
      delete (window as any).__P9_CENTRAL_TL__;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={trackRef} className="p9-chapterTrack p9-chapterTrack--central">
      <article
        ref={stageRef}
        id="p9-ch-07"
        className="p9-viewport p9-chapter p9-chapter--central p9-chapterStage"
        aria-label="Chapter 07: Central India Tours"
      >
        {/* Top Header Bar: SJH | ≡ */}
        <PhoneHeader />

        {/* Top Archived Rows Rail */}
        <ChapterIndexRail
          items={allData}
          currentIndex={6}
          onSelectIndex={onSelectIndex}
        />

        {/* Chapter Number & Title */}
        <div className="p9-chapter__header">
          <span ref={numRef} className="p9-chapter__num">{data.number}</span>
          <h3 className="p9-chapter__title">
            {["CENTRAL", "INDIA TOURS"].map((line, idx) => (
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
            Regional journeys
            <br />
            across central India.
          </p>
        </div>

        {/* Grounded Composition: Minimal Architectural Plumb-Line Connecting Copy to Lower Image */}
        <div className="p9-groundedAxis" aria-hidden="true">
          <div ref={plumbLineRef} className="p9-groundedAxis__plumbLine" />
          <div ref={bracketRef} className="p9-groundedAxis__bracket" />
        </div>

        {/* Lower Photo: p9-central-india.png with grounded upward blend */}
        <div className="p9-chapter__photoStage p9-chapter__photoStage--grounded">
          <div className="p9-chapter__photoBlend" aria-hidden="true" />
          <img
            ref={photoImgRef}
            src={data.asset}
            alt="Ancient stone temple pavilions on river ghats at golden sunset"
            className="p9-chapter__photoImg"
            loading="lazy"
          />

          {/* Understated Editorial Text CTA */}
          <a
            ref={ctaRef}
            href={data.href || "/concierge"}
            onClick={handleCtaClick}
            className="p9-understatedCta"
            aria-label="Explore Central India"
          >
            <span className="p9-understatedCta__label">Explore Central India</span>
            <span className="p9-understatedCta__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </div>
  );
}
