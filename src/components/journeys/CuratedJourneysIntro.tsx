/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 7: CURATED JOURNEYS INTRO
 * Compact 55–70svh editorial transition connecting from Phase 6 Travel Thread.
 * Gold stem smoothly enters and resolves; title line mask reveals.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CuratedJourneysIntro() {
  const introRef = useRef<HTMLElement>(null);
  const stemRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = introRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      if (stemRef.current) stemRef.current.style.opacity = "1";
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = "1";
      if (titleLine1Ref.current) titleLine1Ref.current.style.transform = "none";
      if (titleLine2Ref.current) titleLine2Ref.current.style.transform = "none";
      if (supportRef.current) supportRef.current.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "top 25%",
          scrub: 0.6,
        },
      });

      // 1. Stem gently resolves and fades
      if (stemRef.current) {
        tl.fromTo(
          stemRef.current,
          { opacity: 0, scaleY: 0.4 },
          { opacity: 1, scaleY: 1, ease: "power2.out", duration: 0.25 },
          0
        );
      }

      // 2. Eyebrow upward fade
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.28 },
          0.10
        );
      }

      // 3. Headline masked line reveal
      const titleLines = [titleLine1Ref.current, titleLine2Ref.current].filter(Boolean);
      if (titleLines.length > 0) {
        tl.fromTo(
          titleLines,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.08, ease: "power2.out", duration: 0.35 },
          0.18
        );
      }

      // 4. Supporting text upward fade
      if (supportRef.current) {
        tl.fromTo(
          supportRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.30 },
          0.30
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={introRef} className="sjhJourneysIntro">
      {/* Downward gold vertical stem handoff from Phase 6 outro */}
      <div ref={stemRef} className="sjhJourneysIntro__stem" aria-hidden="true" />

      {/* Eyebrow */}
      <span ref={eyebrowRef} className="sjhJourneysIntro__eyebrow">
        JOURNEYS, CRAFTED WITH INTENT
      </span>

      {/* Primary Section Title (H2) */}
      <h2 id="curated-journeys-title" className="sjhJourneysIntro__headline">
        <span className="sjhJourneysIntro__headlineLine">
          <span ref={titleLine1Ref}>CURATED</span>
        </span>
        <span className="sjhJourneysIntro__headlineLine">
          <span ref={titleLine2Ref}>JOURNEYS</span>
        </span>
      </h2>

      {/* Editorial Supporting Description */}
      <p ref={supportRef} className="sjhJourneysIntro__support">
        Handcrafted itineraries. Deeper experiences.<br />
        Meaningful travel, the SJH way.
      </p>
    </header>
  );
}
