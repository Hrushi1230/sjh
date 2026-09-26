/**
 * SHREE JAGANNATH HOLIDAYS — CURATED JOURNEY ITEM
 * Implements the 3 Major Beats Motion Architecture:
 * Beat 1: ARRIVAL (Index + Mood + Main Image Mask Reveal)
 * Beat 2: STORY (Title Line Mask + Route + Duration + Description)
 * Beat 3: DETAIL (CTA Button + Bespoke Supporting Imagery)
 */

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CuratedJourney, JourneyId } from "../../data/journeys";
import { SacredOdishaLayout } from "./layouts/SacredOdishaLayout";
import { KashmirValleyLayout } from "./layouts/KashmirValleyLayout";
import { RoyalRajasthanLayout } from "./layouts/RoyalRajasthanLayout";
import { KeralaSlowlyLayout } from "./layouts/KeralaSlowlyLayout";

gsap.registerPlugin(ScrollTrigger);

interface CuratedJourneyItemProps {
  journey: CuratedJourney;
  nextJourney?: CuratedJourney;
  onBackgroundShift?: (tone: string) => void;
  onJourneySelect?: (journeyId: JourneyId, href: string) => void;
}

export function CuratedJourneyItem({
  journey,
  nextJourney,
  onBackgroundShift,
  onJourneySelect,
}: CuratedJourneyItemProps) {
  const itemRef = useRef<HTMLElement>(null);
  const headerMetaRef = useRef<HTMLDivElement>(null);
  const mainImageWrapperRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const titleLinesRef = useRef<HTMLSpanElement[]>([]);
  const storyMetaRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const detailWrapperRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      if (headerMetaRef.current) headerMetaRef.current.style.opacity = "1";
      if (mainImageWrapperRef.current) mainImageWrapperRef.current.style.clipPath = "none";
      if (mainImageRef.current) mainImageRef.current.style.transform = "none";
      titleLinesRef.current.forEach((t) => {
        if (t) t.style.transform = "none";
      });
      if (storyMetaRef.current) storyMetaRef.current.style.opacity = "1";
      if (descriptionRef.current) descriptionRef.current.style.opacity = "1";
      if (ctaWrapperRef.current) ctaWrapperRef.current.style.opacity = "1";
      detailWrapperRefs.current.forEach((d) => {
        if (d) d.style.opacity = "1";
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Single Master ScrollTrigger Timeline per Journey for finger-scrubbed continuity
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          end: "bottom 65%",
          scrub: 0.55,
          onUpdate: (self) => {
            const p = self.progress;
            // Gentle background tone interpolation leading into next journey
            if (p > 0.65 && nextJourney) {
              onBackgroundShift?.(nextJourney.bgTone);
            } else {
              onBackgroundShift?.(journey.bgTone);
            }
          },
        },
      });

      // ----------------------------------------------------------------------
      // BEAT 1: ARRIVAL (0.00 -> 0.35)
      // Index + Mood enter, followed by editorial upward main image clip reveal
      // ----------------------------------------------------------------------
      if (headerMetaRef.current) {
        tl.fromTo(
          headerMetaRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 },
          0.02
        );
      }

      const radiusValue = journey.layout === "royal" ? "38px 38px 10px 10px" : "26px";
      if (mainImageWrapperRef.current) {
        tl.fromTo(
          mainImageWrapperRef.current,
          { clipPath: `inset(100% 0% 0% 0% round ${radiusValue})` },
          { clipPath: `inset(0% 0% 0% 0% round ${radiusValue})`, ease: "power2.out", duration: 0.32 },
          0.04
        );
      }

      if (mainImageRef.current) {
        tl.fromTo(
          mainImageRef.current,
          { scale: 1.045, y: 14 },
          { scale: 1.00, y: 0, ease: "none", duration: 0.40 },
          0.04
        );
      }

      // ----------------------------------------------------------------------
      // BEAT 2: STORY (0.28 -> 0.65)
      // Title lines masked reveal + Route & Duration + Description
      // ----------------------------------------------------------------------
      const titleLines = titleLinesRef.current.filter(Boolean);
      if (titleLines.length > 0) {
        tl.fromTo(
          titleLines,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.05, ease: "power2.out", duration: 0.24 },
          0.26
        );
      }

      if (storyMetaRef.current) {
        tl.fromTo(
          storyMetaRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.20 },
          0.34
        );
      }

      if (descriptionRef.current) {
        tl.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.22 },
          0.40
        );
      }

      // ----------------------------------------------------------------------
      // BEAT 3: DETAIL (0.50 -> 0.88)
      // CTA Button + Bespoke Supporting Imagery Stagger & Parallax
      // ----------------------------------------------------------------------
      if (ctaWrapperRef.current) {
        tl.fromTo(
          ctaWrapperRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.18 },
          0.50
        );
      }

      const detailItems = detailWrapperRefs.current.filter(Boolean);
      if (detailItems.length > 0) {
        tl.fromTo(
          detailItems,
          { opacity: 0, y: 22, scale: 1.02 },
          { opacity: 1, y: 0, scale: 1.0, stagger: 0.08, ease: "power2.out", duration: 0.26 },
          0.56
        );
      }
    }, el);

    return () => ctx.revert();
  }, [journey, nextJourney, onBackgroundShift]);

  // Render bespoke editorial layout based on journey variant
  const renderDetailComposition = () => {
    switch (journey.layout) {
      case "sacred":
        return <SacredOdishaLayout journey={journey} detailWrapperRefs={detailWrapperRefs} />;
      case "alpine":
        return <KashmirValleyLayout journey={journey} detailWrapperRefs={detailWrapperRefs} />;
      case "royal":
        return <RoyalRajasthanLayout journey={journey} detailWrapperRefs={detailWrapperRefs} />;
      case "slow":
        return <KeralaSlowlyLayout journey={journey} detailWrapperRefs={detailWrapperRefs} />;
      default:
        return null;
    }
  };

  return (
    <article
      ref={itemRef}
      className={`sjhJourneyItem sjhJourney--${journey.layout}`}
      aria-labelledby={`journey-title-${journey.id}`}
      data-journey-id={journey.id}
    >
      {/* ==================================================================
          BEAT 1: ARRIVAL (Index, Mood & Editorial Main Image)
          ================================================================== */}
      <div className="sjhJourney__arrival">
        <div ref={headerMetaRef} className="sjhJourney__headerMeta">
          <span className="sjhJourney__index">{journey.index}</span>
          <span className="sjhJourney__mood">{journey.mood}</span>
        </div>

        <div ref={mainImageWrapperRef} className="sjhJourney__mainImageWrapper">
          <picture>
            <img
              ref={mainImageRef}
              src={journey.mainImage.src}
              alt={journey.mainImage.alt}
              width={journey.mainImage.width}
              height={journey.mainImage.height}
              loading={journey.id === "sacred-odisha" ? "eager" : "lazy"}
              decoding="async"
              className="sjhJourney__mainImage"
              style={{ objectPosition: journey.mainImage.objectPosition }}
            />
          </picture>
        </div>
      </div>

      {/* ==================================================================
          BEAT 2: STORY (Title, Route, Duration & Description)
          ================================================================== */}
      <div className="sjhJourney__story">
        <h3 id={`journey-title-${journey.id}`} className="sjhJourney__title">
          {journey.title.map((line, i) => (
            <span key={i} className="sjhJourney__titleLine">
              <span
                ref={(node) => {
                  if (node) titleLinesRef.current[i] = node;
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </h3>

        <div ref={storyMetaRef}>
          {/* Refined Route Line with Bullet Separators */}
          <div className="sjhJourney__routeMeta">
            {journey.route.map((stop, sIdx) => (
              <React.Fragment key={stop}>
                <span className="sjhJourney__route">{stop}</span>
                {sIdx < journey.route.length - 1 && (
                  <span className="sjhJourney__routeSeparator" aria-hidden="true">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Duration Pill Indicator with Minimal Clock Icon */}
          <div className="sjhJourney__duration">
            <span className="sjhJourney__durationIcon" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <span>{journey.duration.label}</span>
          </div>
        </div>

        {/* Editorial Narrative Description */}
        <p ref={descriptionRef} className="sjhJourney__description">
          {journey.description}
        </p>
      </div>

      {/* ==================================================================
          BEAT 3: DETAIL (CTA & Bespoke Supporting Imagery)
          ================================================================== */}
      <div className="sjhJourney__detail">
        {/* Primary Editorial Action Button (Accessible button, zero 404 links) */}
        <div ref={ctaWrapperRef} className="sjhJourney__ctaWrapper">
          <button
            type="button"
            className="sjhJourney__ctaBtn"
            onClick={() => onJourneySelect?.(journey.id, journey.href)}
            aria-label={journey.accessibleCtaLabel}
          >
            <span>View Journey</span>
            <span className="sjhJourney__ctaArrow" aria-hidden="true">→</span>
          </button>
        </div>

        {/* Bespoke Supporting Detail Image Composition */}
        {renderDetailComposition()}
      </div>
    </article>
  );
}
