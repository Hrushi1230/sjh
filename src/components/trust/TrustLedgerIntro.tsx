/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 8: THE TRUST LEDGER
 * TrustLedgerIntro: Signature 90° Thread-to-Ledger Transition, Sticky Eyebrow & Masked Headline
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TRUST_SECTION_INTRO } from "./trustLedgerData";

gsap.registerPlugin(ScrollTrigger);

interface TrustLedgerIntroProps {
  onProgress?: (progress: number) => void;
}

export function TrustLedgerIntro({ onProgress }: TrustLedgerIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionPathRef = useRef<SVGPathElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const eyebrowRuleRef = useRef<HTMLDivElement>(null);
  const lineInnersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const path = transitionPathRef.current;
    if (!container || !path) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let pathLength = 0;
    try {
      pathLength = path.getTotalLength();
    } catch {
      pathLength = 320;
    }
    if (!pathLength || pathLength < 100) pathLength = 320;

    path.style.strokeDasharray = `${pathLength}`;

    if (reduceMotion) {
      path.style.strokeDashoffset = "0";
      lineInnersRef.current.forEach((line) => {
        if (line) {
          line.style.transform = "none";
          line.style.opacity = "1";
        }
      });
      if (eyebrowRuleRef.current) {
        eyebrowRuleRef.current.style.transform = "none";
      }
      return;
    }

    path.style.strokeDashoffset = `${pathLength}`;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          end: "center 50%",
          scrub: 0.5,
          onUpdate: (self) => {
            if (onProgress) onProgress(self.progress);
            // Sticky eyebrow text morph: condensed tag on deep scroll
            if (eyebrowRef.current) {
              if (self.progress > 0.6) {
                eyebrowRef.current.textContent = TRUST_SECTION_INTRO.eyebrowCompact;
              } else {
                eyebrowRef.current.textContent = TRUST_SECTION_INTRO.eyebrowFull;
              }
            }
          },
        },
      });

      // 1. Thread descends vertically and bends 90° horizontally into editorial baseline
      tl.fromTo(
        path,
        { strokeDashoffset: pathLength },
        { strokeDashoffset: 0, duration: 0.45, ease: "none" },
        0
      );

      // 2. Eyebrow horizontal accent rule extends
      if (eyebrowRuleRef.current) {
        tl.fromTo(
          eyebrowRuleRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.25, ease: "power2.out" },
          0.30
        );
      }

      // 3. Eyebrow fade-in
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0.35
        );
      }

      // 4. Large serif statement reveals line-by-line via line masks (~50ms perceived offset)
      lineInnersRef.current.forEach((line, idx) => {
        if (!line) return;
        tl.fromTo(
          line,
          { y: "105%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.24, ease: "power3.out" },
          0.45 + idx * 0.07
        );
      });
    }, container);

    return () => ctx.revert();
  }, [onProgress]);

  // Spline: Vertical arrival from Phase 6 endpoint (center x=180, y=0), descending to y=42,
  // curving gently 90° rightward, and extending horizontally across to establish the ledger baseline.
  const transitionSpline = "M 180 0 L 180 38 Q 180 64 206 64 L 348 64";

  return (
    <header ref={containerRef} className="sjhTrustIntro">
      {/* Signature Thread-to-Ledger 90° Transition Rule */}
      <div className="sjhTrustTransition" aria-hidden="true">
        <svg
          className="sjhTrustTransition__svg"
          viewBox="0 0 360 80"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <path
            ref={transitionPathRef}
            d={transitionSpline}
            className="sjhTrustTransition__path"
          />
        </svg>
      </div>

      {/* Sticky Eyebrow Lockup */}
      <div className="sjhTrustEyebrowSticky" aria-hidden="true">
        <span ref={eyebrowRef} className="sjhTrustEyebrowSticky__tag">
          {TRUST_SECTION_INTRO.eyebrowFull}
        </span>
        <div ref={eyebrowRuleRef} className="sjhTrustEyebrowSticky__rule" />
      </div>

      {/* Master Trust Statement with Accessible Heading and Masked Typography */}
      <h2 id="why-sjh-title" className="sjhTrustIntro__statement" aria-label={TRUST_SECTION_INTRO.accessibleTitle}>
        {TRUST_SECTION_INTRO.statementLines.map((line, idx) => (
          <span key={idx} className="sjhTrustMaskedLine" aria-hidden="true">
            <span
              ref={(el) => {
                if (el) lineInnersRef.current[idx] = el;
              }}
              className="sjhTrustMaskedLine__inner"
            >
              {line}
            </span>
          </span>
        ))}
      </h2>
    </header>
  );
}
