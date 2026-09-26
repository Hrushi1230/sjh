/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 8: THE TRUST LEDGER
 * TrustLedgerOutro: Closure Bracket (Horizontal → 90° Downward) & Phase 9 Bridge
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TRUST_OUTRO_DATA } from "./trustLedgerData";

gsap.registerPlugin(ScrollTrigger);

export function TrustLedgerOutro() {
  const containerRef = useRef<HTMLElement>(null);
  const bracketPathRef = useRef<SVGPathElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineLinesRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    const path = bracketPathRef.current;
    if (!el || !path) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let pathLength = 0;
    try {
      pathLength = path.getTotalLength();
    } catch {
      pathLength = 180;
    }
    if (!pathLength || pathLength < 50) pathLength = 180;

    path.style.strokeDasharray = `${pathLength}`;

    if (reduceMotion) {
      path.style.strokeDashoffset = "0";
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = "1";
      headlineLinesRef.current.forEach((line) => {
        if (line) {
          line.style.opacity = "1";
          line.style.transform = "none";
        }
      });
      return;
    }

    path.style.strokeDashoffset = `${pathLength}`;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 35%",
          scrub: 0.6,
        },
      });

      // 1. Upper vertical thread descends
      tl.fromTo(
        path,
        { strokeDashoffset: pathLength },
        { strokeDashoffset: 0, duration: 0.35, ease: "none" },
        0
      );

      // 2. Narrative Bridge Headline reveals
      headlineLinesRef.current.forEach((line, idx) => {
        if (!line) return;
        tl.fromTo(
          line,
          { y: "105%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.22, ease: "power3.out" },
          0.25 + idx * 0.08
        );
      });

      // 3. Eyebrow "NEXT" and arrow reveal
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0.60
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  // Vertical Thread from Row 04: drops straight down x=24 (or aligned), with diamond tip
  const upperThreadSpline = "M 48 0 L 48 64";

  return (
    <footer ref={containerRef} className="sjhTrustOutro" aria-label="Phase 8 Closure and Phase 9 Bridge">
      {/* Vertical Thread Connector with Diamond Tip */}
      <div className="sjhTrustOutro__threadWrap" aria-hidden="true">
        <svg
          className="sjhTrustOutro__threadSvg"
          viewBox="0 0 100 74"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <path
            ref={bracketPathRef}
            d={upperThreadSpline}
            className="sjhTrustOutro__bracketPath"
          />
          <polygon points="48,65 52,69 48,73 44,69" fill="#B99455" />
        </svg>
      </div>

      {/* Narrative Bridge Headline */}
      <h3 className="sjhTrustOutro__headline" aria-label={TRUST_OUTRO_DATA.accessibleHeadline}>
        {TRUST_OUTRO_DATA.headlineLines.map((line, idx) => (
          <span key={idx} className="sjhTrustMaskedLine">
            <span
              ref={(el) => { if (el) headlineLinesRef.current[idx] = el; }}
              className="sjhTrustMaskedLine__inner"
            >
              {line}
            </span>
          </span>
        ))}
      </h3>

      {/* Lower Vertical Thread to Phase 9 */}
      <div ref={eyebrowRef} className="sjhTrustOutro__bridgeFooter">
        <div className="sjhTrustOutro__lowerLine" aria-hidden="true" />
        <span className="sjhTrustOutro__eyebrow">{TRUST_OUTRO_DATA.eyebrow}</span>
        <svg
          className="sjhTrustOutro__downArrow"
          viewBox="0 0 12 16"
          width="12"
          height="16"
          aria-hidden="true"
        >
          <line x1="6" y1="0" x2="6" y2="12" stroke="#B99455" strokeWidth="1.5" />
          <polyline points="2,8 6,13 10,8" fill="none" stroke="#B99455" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </footer>
  );
}
