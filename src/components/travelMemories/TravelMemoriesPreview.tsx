import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TravelMemoryMosaic } from "./TravelMemoryMosaic";

gsap.registerPlugin(ScrollTrigger);

interface TravelMemoriesPreviewProps {
  onNavigateToMemories: () => void;
  onPhotoClick?: (memoryId: string) => void;
}

export const TravelMemoriesPreview: React.FC<TravelMemoriesPreviewProps> = ({
  onNavigateToMemories,
  onPhotoClick,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // GSAP ScrollTrigger Sequence
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Immediate clean presentation for reduced motion
      gsap.set(
        [
          eyebrowRef.current,
          line1Ref.current,
          line2Ref.current,
          copyRef.current,
          ctaRef.current,
          ".sjhMosaicItem",
          ".sjhMosaicImg--dominant",
        ],
        {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          clearProps: "all",
        }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial hidden states
      gsap.set(eyebrowRef.current, { opacity: 0, y: 10 });
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 105, opacity: 0 });
      gsap.set(copyRef.current, { opacity: 0, y: 10 });
      gsap.set(ctaRef.current, { opacity: 0, y: 8 });

      gsap.set(".sjhMosaicItem--a .sjhMosaicImg", {
        clipPath: "inset(8% 5% 10% 0%)",
        scale: 1.02,
      });
      gsap.set([".sjhMosaicItem--b", ".sjhMosaicItem--c", ".sjhMosaicItem--d"], {
        opacity: 0,
        y: 14,
      });

      // Master Entrance Timeline triggered on normal viewport approach
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          end: "top 25%",
          toggleActions: "play none none none",
        },
      });

      // 0.00 - 0.20: Eyebrow reveals
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, 0);

      // 0.08 - 0.30: Headline masks reveal line by line
      tl.to([line1Ref.current, line2Ref.current], {
        yPercent: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
      }, 0.08);

      // 0.20 - 0.38: Supporting copy enters
      tl.to(copyRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      }, 0.22);

      // 0.26 - 0.52: Dominant Photo A clip-reveals and settles scale
      tl.to(".sjhMosaicItem--a .sjhMosaicImg", {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1.0,
        duration: 0.75,
        ease: "power3.out",
      }, 0.28);

      // 0.38 - 0.60: Photo B resolves
      tl.to(".sjhMosaicItem--b", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      }, 0.38);

      // 0.46 - 0.70: Photo C resolves
      tl.to(".sjhMosaicItem--c", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      }, 0.46);

      // 0.52 - 0.76: Photo D resolves
      tl.to(".sjhMosaicItem--d", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      }, 0.52);

      // 0.70 - 0.90: View all memories CTA appears
      tl.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, 0.66);

      // Subtle parallax on scroll for editorial realism (8-14px max)
      gsap.to(".sjhMosaicItem--b", {
        y: -10,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      gsap.to(".sjhMosaicItem--d", {
        y: -12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleCtaClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsTransitioning(true);
      setTimeout(() => {
        onNavigateToMemories();
        setIsTransitioning(false);
      }, 120);
    },
    [onNavigateToMemories]
  );

  return (
    <section
      id="travel-memories"
      data-section="phase10"
      ref={sectionRef}
      className="sjhTravelMemories"
      aria-label="Phase 10: Real Travel Memories"
    >
      {/* Editorial handoff rule from Phase 9 */}
      <div className="sjhTravelMemories__handoff" aria-hidden="true">
        <div className="sjhTravelMemories__goldAccent" />
      </div>

      <div ref={contentRef} className="sjhTravelMemories__viewport">
        {/* Top 25–30%: Editorial Header Typography */}
        <header className="sjhTravelMemories__header">
          <div ref={eyebrowRef} className="sjhTravelMemories__eyebrow">
            <span className="sjhTravelMemories__eyebrowNode" aria-hidden="true">●</span>
            TRAVEL MEMORIES
          </div>

          <h2 className="sjhTravelMemories__title">
            <span className="sjhTravelMemories__lineMask">
              <span ref={line1Ref} className="sjhTravelMemories__line">
                REAL JOURNEYS.
              </span>
            </span>
            <span className="sjhTravelMemories__lineMask">
              <span ref={line2Ref} className="sjhTravelMemories__line">
                REAL MOMENTS.
              </span>
            </span>
          </h2>

          <p ref={copyRef} className="sjhTravelMemories__copy">
            A glimpse from journeys travelled together.
          </p>
        </header>

        {/* Middle/Lower 55–60%: 4-Photo Asymmetric Mosaic */}
        <div className="sjhTravelMemories__mosaicWrap">
          <TravelMemoryMosaic
            onPhotoClick={onPhotoClick || onNavigateToMemories}
            isTransitioning={isTransitioning}
          />
        </div>

        {/* Bottom 10–15%: Editorial View All Memories CTA */}
        <footer className="sjhTravelMemories__footer">
          <a
            ref={ctaRef}
            href="/travel-memories"
            onClick={handleCtaClick}
            className="sjhTravelMemories__cta"
            aria-label="View all travel memories gallery"
          >
            <span className="sjhTravelMemories__ctaText">View all memories</span>
            <span className="sjhTravelMemories__ctaArrow" aria-hidden="true">→</span>
          </a>
        </footer>
      </div>

      {/* Warm Ivory settling rule before transition into Phase 11 */}
      <div className="sjhTravelMemories__outroRule" aria-hidden="true">
        <span className="sjhTravelMemories__outroNode">●</span>
      </div>
    </section>
  );
};
