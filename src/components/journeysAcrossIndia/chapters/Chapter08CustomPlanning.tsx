/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: CHAPTER 08 — CUSTOMISED PLANNING
 * PASS B: Human / Conversion Finale Choreography
 * 
 * Choreography Specification (Section 12 & 13):
 * - 0.00-0.18: 08 reveals
 * - 0.08-0.34: headline reveals line by line (4 masked lines)
 * - 0.28-0.40: subheading enters
 * - 0.36-0.64: 4 planning lines resolve sequentially (01..04)
 * - 0.50-0.78: human image slowly reveals from bottom (translateY 14px -> 0, scale 1.025 -> 1)
 * - 0.72-0.90: PLAN MY JOURNEY CTA enters (opacity 0 -> 1, y 8px -> 0, scale .98 -> 1)
 * - Reuse Phase 3 concierge planner without duplication
 * - Scrub: 0.4
 */

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JourneyAtlasItem } from "../../../data/journeyAtlasData";
import { ChapterIndexRail } from "../ChapterIndexRail";
import { PhoneHeader } from "../PhoneHeader";

gsap.registerPlugin(ScrollTrigger);

interface Chapter08Props {
  data: JourneyAtlasItem;
  allData: JourneyAtlasItem[];
  onSelectIndex: (index: number) => void;
  onOpenPlanner?: () => void;
  isPlannerReadyState?: boolean;
}

export function Chapter08CustomPlanning({
  data,
  allData,
  onSelectIndex,
  onOpenPlanner,
  isPlannerReadyState = false,
}: Chapter08Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  // Typography refs
  const numRef = useRef<HTMLSpanElement>(null);
  const headlineLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  // Dimension item refs
  const dimensionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dashRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Photo & CTA refs
  const photoImgRef = useRef<HTMLImageElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Subtle press feedback
    if (ctaBtnRef.current) {
      gsap.to(ctaBtnRef.current, {
        scale: 0.98,
        duration: 0.09,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      });
    }

    onOpenPlanner?.();
  };

  const planningDimensions = [
    "Where you want to go",
    "When you want to travel",
    "Who is travelling",
    "What matters to you",
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
        headlineLineRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: "0%", opacity: 1 });
        });
        gsap.set(subheadingRef.current, { opacity: 1, y: 0 });
        dimensionRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, x: 0 });
        });
        dashRefs.current.forEach((el) => {
          if (el) gsap.set(el, { scaleX: 1 });
        });
        gsap.set(photoImgRef.current, { translateY: 0, scale: 1, opacity: 1 });
        gsap.set(ctaBtnRef.current, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // Initial state: hidden for triggered reveal
      gsap.set(numRef.current, { opacity: 0, y: 6 });
      headlineLineRefs.current.forEach((line) => {
        if (line) gsap.set(line, { y: "105%", opacity: 0 });
      });
      gsap.set(subheadingRef.current, { opacity: 0, y: 8 });

      dimensionRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, x: 8 });
      });
      dashRefs.current.forEach((el) => {
        if (el) gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      });

      gsap.set(photoImgRef.current, {
        y: 16,
        scale: 1.025,
        opacity: 0.80,
      });
      gsap.set(ctaBtnRef.current, { opacity: 0, y: 8, scale: 0.98 });

      // Triggered timeline (Zero Sticky, Zero Pin, Zero Exit Fade)
      const tl = gsap.timeline({ paused: true });

      // 0.00 - 0.22: 08 number reveals
      tl.to(numRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.00);

      // 0.08 - 0.36: Headline reveals line by line
      headlineLineRefs.current.forEach((line, idx) => {
        if (!line) return;
        tl.to(
          line,
          { y: "0%", opacity: 1, duration: 0.32, ease: "power3.out" },
          0.08 + idx * 0.08
        );
      });

      // 0.20 - 0.42: Subheading enters
      tl.to(subheadingRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.20);

      // 0.26 - 0.74: Four planning lines resolve sequentially
      const dimensionTimings = [0.26, 0.38, 0.50, 0.62];
      planningDimensions.forEach((_, idx) => {
        const t = dimensionTimings[idx];
        const dim = dimensionRefs.current[idx];
        const dash = dashRefs.current[idx];

        if (dim) {
          tl.to(dim, { opacity: 1, x: 0, duration: 0.18, ease: "power2.out" }, t);
        }
        if (dash) {
          tl.to(dash, { scaleX: 1, duration: 0.16, ease: "power2.out" }, t + 0.02);
        }
      });

      // 0.28 - 0.80: Human image reveals smoothly
      tl.to(
        photoImgRef.current,
        {
          y: 0,
          scale: 1.0,
          opacity: 1,
          duration: 0.52,
          ease: "power3.out",
        },
        0.28
      );

      // 0.76 - 1.02: Prominent PLAN MY JOURNEY button enters
      tl.to(
        ctaBtnRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1.0,
          duration: 0.26,
          ease: "back.out(1.5)",
        },
        0.76
      );

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top 65%",
        once: true,
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
      });

      if (st.progress > 0) {
        tl.progress(1);
      }

      (window as any).__P9_CUSTOM_TL__ = tl;
    }, stage);

    return () => {
      delete (window as any).__P9_CUSTOM_TL__;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={trackRef} className="p9-chapterTrack p9-chapterTrack--custom">
      <article
        ref={stageRef}
        id="p9-ch-08"
        className="p9-viewport p9-chapter p9-chapter--custom p9-chapterStage"
        aria-label="Chapter 08: Customised Travel Planning"
      >
        {/* Top Header Bar: SJH | ≡ */}
        <PhoneHeader />

        {/* Top Archived Rows Rail */}
        <ChapterIndexRail
          items={allData}
          currentIndex={7}
          onSelectIndex={onSelectIndex}
        />

        {/* Chapter Number & Human Headline */}
        <div className="p9-chapter__header">
          <span ref={numRef} className="p9-chapter__num">{data.number}</span>
          <h3 className="p9-chapter__headline">
            {["YOUR JOURNEY", "DOESN'T HAVE", "TO FIT A", "TEMPLATE."].map((line, idx) => (
              <span key={idx} className="p9-maskedLine">
                <span
                  ref={(el) => {
                    headlineLineRefs.current[idx] = el;
                  }}
                  className="p9-maskedLine__inner"
                >
                  {line}
                </span>
              </span>
            ))}
          </h3>
          <p ref={subheadingRef} className="p9-chapter__subheading">Customised Travel Planning</p>
        </div>

        {/* Middle: 4 Human Planning Dimensions with Editorial Numbered Gold Micro Markers */}
        <div className="p9-customDimensions" aria-label="Personalised Planning Dimensions">
          {planningDimensions.map((label, idx) => (
            <div
              key={idx}
              ref={(el) => {
                dimensionRefs.current[idx] = el;
              }}
              className="p9-customDimensions__item"
            >
              <span className="p9-customDimensions__num" aria-hidden="true">
                {`0${idx + 1}`}
              </span>
              <span
                ref={(el) => {
                  dashRefs.current[idx] = el;
                }}
                className="p9-customDimensions__dash"
                aria-hidden="true"
              />
              <span className="p9-customDimensions__text">{label}</span>
            </div>
          ))}
        </div>

        {/* Lower Photo: p9-custom-planning.png with soft upward blend */}
        <div className="p9-chapter__photoStage">
          <div className="p9-chapter__photoBlend" aria-hidden="true" />
          <img
            ref={photoImgRef}
            src={data.asset}
            alt="Two travellers quietly taking in panoramic lake view at sunset from scenic hilltop"
            className="p9-chapter__photoImg"
            loading="lazy"
          />

          {/* Strong Antique Gold Filled Capsule CTA (The ONLY strong filled CTA in Phase 9) */}
          <button
            ref={ctaBtnRef}
            type="button"
            id="p9-custom-cta-btn"
            onClick={handleCtaClick}
            className={`p9-floatingCta p9-floatingCta--gold ${
              isPlannerReadyState ? "is-ready" : ""
            }`}
            aria-label="Plan My Journey (Reuses Phase 3 Concierge Planner)"
            data-planner-ready={isPlannerReadyState ? "true" : "false"}
          >
            <span className="p9-floatingCta__text">PLAN MY JOURNEY</span>
            <span className="p9-floatingCta__arrow" aria-hidden="true">
              →
            </span>
            {isPlannerReadyState && (
              <span className="p9-floatingCta__badge" role="status">
                PLANNER READY
              </span>
            )}
          </button>
        </div>
      </article>
    </div>
  );
}
