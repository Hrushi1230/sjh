/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 7: CURATED JOURNEYS OUTRO
 * 20–35svh of calm breathing space after Kerala Slowly before future Phase 8.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CuratedJourneysOutro() {
  const outroRef = useRef<HTMLElement>(null);
  const stemRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = outroRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      if (stemRef.current) stemRef.current.style.opacity = "1";
      if (taglineRef.current) taglineRef.current.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 90%",
          scrub: 0.6,
        },
      });

      if (stemRef.current) {
        tl.fromTo(
          stemRef.current,
          { opacity: 0, scaleY: 0.5 },
          { opacity: 1, scaleY: 1, ease: "power2.out", duration: 0.4 },
          0
        );
      }

      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.4 },
          0.15
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={outroRef} className="sjhJourneysOutro" aria-label="End of Curated Journeys">
      <div ref={stemRef} className="sjhJourneysOutro__stem" aria-hidden="true" />
      <p ref={taglineRef} className="sjhJourneysOutro__tagline">
        TRAVEL, PERSONALLY CRAFTED.
      </p>
    </footer>
  );
}
