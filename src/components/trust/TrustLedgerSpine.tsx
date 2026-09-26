/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 8: THE TRUST LEDGER
 * TrustLedgerSpine: Architectural Ledger Margin Guide (x ≈ 24%)
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function TrustLedgerSpine() {
  const spineRef = useRef<HTMLDivElement>(null);
  const segment1Ref = useRef<HTMLDivElement>(null);
  const segment2Ref = useRef<HTMLDivElement>(null);
  const segment3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spineRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      [segment1Ref, segment2Ref, segment3Ref].forEach((seg) => {
        if (seg.current) {
          seg.current.style.transform = "none";
          seg.current.style.opacity = "0.3";
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      const segments = [segment1Ref.current, segment2Ref.current, segment3Ref.current].filter(Boolean);
      
      segments.forEach((seg, i) => {
        gsap.fromTo(
          seg,
          { scaleY: 0, opacity: 0 },
          {
            scaleY: 1,
            opacity: 0.28,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: `top+=${i * 30}% 70%`,
              end: `top+=${(i + 1) * 35}% 50%`,
              scrub: 0.5,
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={spineRef} className="sjhLedgerSpine" aria-hidden="true">
      <div
        ref={segment1Ref}
        className="sjhLedgerSpine__segment"
        style={{ top: "0%", height: "30%" }}
      />
      <div
        ref={segment2Ref}
        className="sjhLedgerSpine__segment"
        style={{ top: "35%", height: "30%" }}
      />
      <div
        ref={segment3Ref}
        className="sjhLedgerSpine__segment"
        style={{ top: "70%", height: "28%" }}
      />
    </div>
  );
}
