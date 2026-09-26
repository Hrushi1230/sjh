/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: SECTION INTRO VIEWPORT
 * Phase 8 -> Phase 9 Mobile Smoothness Hotfix
 * Normal Document Flow, Triggered Timeline (No Scrub, No Pin, Under ~900ms)
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
  const stageRef = useRef<HTMLElement>(null);
  const stemRef = useRef<HTMLSpanElement>(null);
  const eyebrowWrapRef = useRef<HTMLDivElement>(null);
  const headlineLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const copyWrapRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLImageElement>(null);
  const pinRingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Immediate resolved state for reduced motion
        if (stemRef.current) gsap.set(stemRef.current, { scaleY: 1 });
        gsap.set(eyebrowWrapRef.current, { opacity: 1, y: 0 });
        headlineLineRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: "0%", opacity: 1 });
        });
        gsap.set(copyWrapRef.current, { opacity: 1, y: 0 });
        gsap.set(outlineRef.current, { opacity: 0.42, scale: 1, y: 0 });
        gsap.set(pinRingRef.current, { opacity: 1, scale: 1 });
        return;
      }

      // Initial dormant state
      if (stemRef.current) gsap.set(stemRef.current, { scaleY: 0 });
      gsap.set(eyebrowWrapRef.current, { opacity: 0, y: 8 });
      headlineLineRefs.current.forEach((el) => {
        if (el) gsap.set(el, { y: "105%", opacity: 0 });
      });
      gsap.set(copyWrapRef.current, { opacity: 0, y: 8 });
      gsap.set(outlineRef.current, { opacity: 0, scale: 1.025, y: 8 });
      gsap.set(pinRingRef.current, { opacity: 0, scale: 0.8 });

      // Normal triggered timeline (Completes in ~850ms, no scrub, no pin)
      const tl = gsap.timeline({ paused: true });

      // 0.00: Gold vertical stem scaleY 0 -> 1
      if (stemRef.current) {
        tl.to(
          stemRef.current,
          {
            scaleY: 1,
            duration: 0.22,
            ease: "power2.out",
          },
          0.00
        );
      }

      // 0.08: JOURNEYS ACROSS INDIA reveal
      tl.to(
        eyebrowWrapRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.24,
          ease: "power2.out",
        },
        0.08
      );

      // 0.14 - 0.28: INDIA, / IN MANY / WAYS. line reveals
      const lineDelays = [0.14, 0.21, 0.28];
      headlineLineRefs.current.forEach((line, idx) => {
        if (!line) return;
        tl.to(
          line,
          {
            y: "0%",
            opacity: 1,
            duration: 0.38,
            ease: "power3.out",
          },
          lineDelays[idx] || 0.14 + idx * 0.07
        );
      });

      // 0.35: Support copy enters
      tl.to(
        copyWrapRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        0.35
      );

      // 0.42: India vector outline settles (clean and static after settling)
      tl.to(
        outlineRef.current,
        {
          opacity: 0.42,
          scale: 1.0,
          y: 0,
          duration: 0.38,
          ease: "power2.out",
        },
        0.42
      );

      // 0.60: Atlas marker settles
      tl.to(
        pinRingRef.current,
        {
          opacity: 1,
          scale: 1.0,
          duration: 0.25,
          ease: "back.out(1.5)",
        },
        0.60
      );

      // Triggered on scroll entry (normal document flow, no sticky lock)
      ScrollTrigger.create({
        trigger: stage,
        start: "top 72%",
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <div className="p9-chapterTrack p9-chapterTrack--intro">
      <header
        ref={stageRef}
        id="p9-intro"
        className="p9-viewport p9-intro p9-chapterStage"
        aria-label="Journeys Across India Introduction"
      >
        {/* Top Header Bar: SJH | ≡ */}
        <PhoneHeader />

        {/* Phase 8 -> Phase 9 Handoff: Visual Continuity Vertical Gold Stem */}
        <div className="p9-handoff-stem" aria-hidden="true">
          <span ref={stemRef} className="p9-handoff-stem__line" />
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

        {/* Watermark Area: Crisp India Vector Outline + Circular Anchor */}
        <div className="p9-intro__watermarkArea" aria-hidden="true">
          <div ref={pinRingRef} className="p9-intro__pinRing">
            <span className="p9-intro__pinRingOuter" />
            <span className="p9-intro__pinRingInner" />
          </div>
          <img
            ref={outlineRef}
            src="/assets/phase9/p9-india-outline.svg"
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
