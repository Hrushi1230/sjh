/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: SECTION INTRO VIEWPORT
 * PASS B: Signature Phase 8 -> Phase 9 Handoff & Editorial Atlas Entry
 * 
 * Handoff Specification (Section 2 & 3):
 * - STEP A (0.00-0.20): Horizontal ledger rule remains stable with "04 DETAILS, HANDLED."
 * - STEP B (0.20-0.42): Right end bends downward into vertical stem (~70-110px)
 * - STEP C (0.35-0.60): Phase 8 content recedes (opacity 1 -> 0.55, y 0 -> -12px)
 * - STEP D (0.48-0.74): Phase 9 eyebrow reveals ("JOURNEYS ACROSS INDIA")
 * - STEP E (0.58-0.90): Headline line masks reveal ("INDIA," / "IN MANY" / "WAYS.")
 * - STEP F (0.72-1.00): India outline softly appears (opacity 0 -> 0.12, scale 1.04 -> 1)
 * - Atlas marker arrival pulse (scale 0.85 -> 1, opacity 0 -> 1)
 * - As Intro exits: India outline drifts down 14px and fades behind Chapter 01
 * - Scrub: ~0.5. Reversible.
 */

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PhoneHeader } from "./PhoneHeader";

gsap.registerPlugin(ScrollTrigger);

interface SectionIntroProps {
  onExploreChapters?: () => void;
}

export function SectionIntro({ onExploreChapters }: SectionIntroProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  // Handoff refs
  const handoffRowRef = useRef<HTMLDivElement>(null);
  const handoffPathRef = useRef<SVGPathElement>(null);

  // Intro text refs
  const eyebrowWrapRef = useRef<HTMLDivElement>(null);
  const headlineLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const copyWrapRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLImageElement>(null);
  const pinRingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Immediate resolved state for reduced motion
        gsap.set(handoffRowRef.current, { opacity: 0.55, y: -12 });
        gsap.set(eyebrowWrapRef.current, { opacity: 1, y: 0 });
        headlineLineRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: "0%", opacity: 1 });
        });
        gsap.set(copyWrapRef.current, { opacity: 1, y: 0 });
        gsap.set(outlineRef.current, { opacity: 0.12, scale: 1, y: 0 });
        gsap.set(pinRingRef.current, { opacity: 1, scale: 1 });
        return;
      }

      // Path length measurement for strokeDashoffset
      // Path: M 0,2 L 334,2 Q 344,2 344,12 L 344,90 (total ~435px, horizontal ~334px)
      const pathLength = 435;
      const initialOffset = 95; // Only horizontal portion visible initially

      // Initial state (Phase 8 end)
      gsap.set(handoffRowRef.current, { opacity: 1, y: 0 });
      gsap.set(handoffPathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: initialOffset,
      });
      gsap.set(eyebrowWrapRef.current, { opacity: 0, y: 8 });
      headlineLineRefs.current.forEach((el) => {
        if (el) gsap.set(el, { y: "105%", opacity: 0 });
      });
      gsap.set(copyWrapRef.current, { opacity: 0, y: 8 });
      gsap.set(outlineRef.current, { opacity: 0, scale: 1.04, y: 0 });
      gsap.set(pinRingRef.current, { opacity: 0, scale: 0.85 });

      // Master Intro Scrub Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // 0.00 - 0.20: Phase 8 final state holds
      tl.to({}, { duration: 0.2 });

      // 0.20 - 0.42: Ledger rule bends downward into vertical stem
      tl.to(
        handoffPathRef.current,
        {
          strokeDashoffset: 0,
          duration: 0.22,
          ease: "none",
        },
        0.20
      );

      // 0.35 - 0.60: Phase 8 row recedes
      tl.to(
        handoffRowRef.current,
        {
          opacity: 0.55,
          y: -12,
          duration: 0.25,
          ease: "power1.out",
        },
        0.35
      );

      // 0.48 - 0.74: Phase 9 eyebrow appears
      tl.to(
        eyebrowWrapRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.26,
          ease: "power2.out",
        },
        0.48
      );

      // 0.58 - 0.90: Headline lines reveal with subtle vertical stagger
      headlineLineRefs.current.forEach((line, idx) => {
        if (!line) return;
        tl.to(
          line,
          {
            y: "0%",
            opacity: 1,
            duration: 0.22,
            ease: "power3.out",
          },
          0.58 + idx * 0.08
        );
      });

      // 0.68 - 0.88: Supporting copy enters
      tl.to(
        copyWrapRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.20,
          ease: "power2.out",
        },
        0.68
      );

      // 0.72 - 1.00: India outline softly appears
      tl.to(
        outlineRef.current,
        {
          opacity: 0.12,
          scale: 1.0,
          duration: 0.28,
          ease: "power2.out",
        },
        0.72
      );

      // Atlas marker single arrival pulse
      tl.to(
        pinRingRef.current,
        {
          opacity: 1,
          scale: 1.0,
          duration: 0.20,
          ease: "back.out(1.5)",
        },
        0.80
      );

      // 0.90 - 1.00: As intro exits, outline drifts downward 14px
      tl.to(
        outlineRef.current,
        {
          y: 14,
          duration: 0.10,
          ease: "none",
        },
        0.90
      );

      // Register hook for testing
      (window as any).__P9_INTRO_TL__ = tl;
    }, track);

    return () => {
      delete (window as any).__P9_INTRO_TL__;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={trackRef} className="p9-chapterTrack p9-chapterTrack--intro">
      <header
        ref={stageRef}
        id="p9-intro"
        className="p9-viewport p9-intro p9-chapterStage"
        aria-label="Journeys Across India Introduction"
      >
        {/* Top Header Bar: SJH | ≡ */}
        <PhoneHeader />

        {/* Phase 8 -> Phase 9 Handoff: Ledger Rule Continuation & Descent */}
        <div className="p9-handoff" aria-label="Transition from Trust Ledger to Editorial Atlas">
          <div ref={handoffRowRef} className="p9-handoff__row">
            <span className="p9-handoff__num">04</span>
            <span className="p9-handoff__title">DETAILS, HANDLED.</span>
          </div>
          <svg
            className="p9-handoff__svg"
            viewBox="0 0 346 100"
            fill="none"
            aria-hidden="true"
          >
            <path
              ref={handoffPathRef}
              d="M 0,2 L 334,2 Q 344,2 344,12 L 344,90"
              stroke="#B99455"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Eyebrow: Masked / Clipped */}
        <div ref={eyebrowWrapRef} className="p9-intro__eyebrowWrap">
          <span className="p9-intro__eyebrow">JOURNEYS ACROSS INDIA</span>
        </div>

        {/* Headline: Three Masked Lines */}
        <div className="p9-intro__statementWrap">
          <h2 className="p9-intro__statement">
            {["INDIA,", "IN MANY", "WAYS."].map((text, idx) => (
              <span key={idx} className="p9-maskedLine">
                <span
                  ref={(el) => {
                    headlineLineRefs.current[idx] = el;
                  }}
                  className="p9-maskedLine__inner"
                >
                  {text}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* Supporting Copy */}
        <div ref={copyWrapRef} className="p9-intro__copyWrap">
          <p className="p9-intro__copy">
            Pilgrimage, landscapes,
            <br />
            heritage and journeys
            <br />
            shaped around you.
          </p>
        </div>

        {/* Watermark Area: India Outline + Circular Anchor */}
        <div className="p9-intro__watermarkArea" aria-hidden="true">
          <div ref={pinRingRef} className="p9-intro__pinRing">
            <span className="p9-intro__pinRingOuter" />
            <span className="p9-intro__pinRingInner" />
          </div>
          <img
            ref={outlineRef}
            src="/assets/phase9/p9-india-outline.png"
            alt=""
            width={900}
            height={900}
            className="p9-intro__outlineImg"
            loading="eager"
          />
        </div>

        {/* Bottom Atmospheric Silhouette */}
        <div className="p9-intro__bottomLandscape" aria-hidden="true">
          <div className="p9-intro__mistGradient" />
        </div>

        {/* Optional downward cue */}
        {onExploreChapters && (
          <button
            type="button"
            onClick={onExploreChapters}
            className="p9-intro__scrollCue"
            aria-label="Scroll to Chapter 01: Odisha"
          >
            <span className="p9-intro__scrollCueText">BEGIN WITH ODISHA</span>
            <span className="p9-intro__scrollCueArrow">↓</span>
          </button>
        )}
      </header>
    </div>
  );
}
