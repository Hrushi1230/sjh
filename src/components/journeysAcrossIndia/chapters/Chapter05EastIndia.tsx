/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: CHAPTER 05 — EAST INDIA
 * PASS B: Editorial Layers Choreography
 * 
 * Choreography Specification (Section 9):
 * - 0.00-0.18: 05 + title line masks reveal
 * - 0.18-0.30: support copy enters
 * - 0.28-0.70: 4 Layer planes step in with overlapping ranges:
 *     Plane 1: Odisha (0.28-0.46)
 *     Plane 2: West Bengal (0.36-0.54)
 *     Plane 3: Sikkim (0.44-0.62)
 *     Plane 4: Northeast (0.52-0.70)
 *     Each plane: x 18px -> 0, opacity 0 -> 1
 * - 0.30-0.70: image reveals from masked windows (clip-path inset(14% 0 0 0) -> inset(0), opacity .85 -> 1)
 * - 0.70-0.88: Understated CTA enters (opacity 0 -> 1, x -6px -> 0)
 * - 0.94-1.00: Chapter exit handoff: image opacity 1 -> 0.4, title y: 0 -> -10px
 * - Reverse: layers retract naturally
 * - Scrub: 0.4
 */

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JourneyAtlasItem } from "../../../data/journeyAtlasData";
import { PhoneHeader } from "../PhoneHeader";

gsap.registerPlugin(ScrollTrigger);

interface Chapter05Props {
  data: JourneyAtlasItem;
  allData?: JourneyAtlasItem[];
  onSelectIndex?: (index: number) => void;
  onOpenPlanner?: (destinationHint?: string) => void;
}

export function Chapter05EastIndia({
  data,
  onOpenPlanner,
}: Chapter05Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  // Typography refs
  const numRef = useRef<HTMLSpanElement>(null);
  const titleLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const copyRef = useRef<HTMLParagraphElement>(null);

  // Layer panels refs
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Photo & CTA refs
  const photoStageRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenPlanner?.("east-india");
  };

  const layers = [
    { num: "01", name: "ODISHA", offset: 0, depth: "rgba(185, 148, 85, 0.05)" },
    { num: "02", name: "WEST BENGAL", offset: 22, depth: "rgba(185, 148, 85, 0.08)" },
    { num: "03", name: "SIKKIM", offset: 44, depth: "rgba(185, 148, 85, 0.11)" },
    { num: "04", name: "NORTHEAST", offset: 66, depth: "rgba(185, 148, 85, 0.14)" },
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
        titleLineRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: "0%", opacity: 1 });
        });
        gsap.set(copyRef.current, { opacity: 1, y: 0 });
        panelRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, x: 0 });
        });
        if (photoStageRef.current) gsap.set(photoStageRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(photoImgRef.current, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
        gsap.set(ctaRef.current, { opacity: 1, x: 0 });
        return;
      }

      // Initial state: hidden for triggered reveal
      gsap.set(numRef.current, { opacity: 0, y: 6 });
      titleLineRefs.current.forEach((line) => {
        if (line) gsap.set(line, { y: "105%", opacity: 0 });
      });
      gsap.set(copyRef.current, { opacity: 0, y: 8 });

      panelRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, x: 18 });
      });

      // Photo initial state: container curtain inset and image scale/opacity
      const photoStage = photoStageRef.current;
      if (photoStage) {
        gsap.set(photoStage, { clipPath: "inset(0% 0% 100% 0%)" });
      }
      gsap.set(photoImgRef.current, {
        y: 20,
        scale: 1.08,
        opacity: 0.2,
      });
      gsap.set(ctaRef.current, { opacity: 0, x: -8 });

      // 1. Chapter Header & Layers Animation (triggers when chapter reaches middle of viewport)
      const headerTl = gsap.timeline({ paused: true });

      // 0.00 - 0.22: 05 + title reveal
      headerTl.to(numRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.00);
      titleLineRefs.current.forEach((line, idx) => {
        if (!line) return;
        headerTl.to(
          line,
          { y: "0%", opacity: 1, duration: 0.32, ease: "power3.out" },
          0.08 + idx * 0.08
        );
      });

      // 0.20 - 0.44: Support copy enters
      headerTl.to(copyRef.current, { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" }, 0.20);

      // 4 Planes resolve with subtle overlap
      const layerTimings = [0.24, 0.36, 0.48, 0.60];
      layers.forEach((_, idx) => {
        const t = layerTimings[idx];
        const panel = panelRefs.current[idx];
        if (panel) {
          headerTl.to(
            panel,
            { opacity: 1, x: 0, duration: 0.22, ease: "power2.out" },
            t
          );
        }
      });

      ScrollTrigger.create({
        trigger: stage,
        start: "top 75%",
        animation: headerTl,
        toggleActions: "play none none reverse",
      });

      // 2. Photo Stage Dramatic Curtain Reveal (triggers directly when the photo enters view)
      const photoTl = gsap.timeline({ paused: true });

      if (photoStage) {
        photoTl.to(
          photoStage,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.75,
            ease: "power2.out",
          },
          0.00
        );
      }

      photoTl.to(
        photoImgRef.current,
        {
          y: 0,
          scale: 1.0,
          opacity: 1.0,
          duration: 0.75,
          ease: "power2.out",
        },
        0.00
      );

      photoTl.to(
        ctaRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.30,
          ease: "power2.out",
        },
        0.35
      );

      if (photoStage) {
        ScrollTrigger.create({
          trigger: photoStage,
          start: "top 75%",
          animation: photoTl,
          toggleActions: "play none none reverse",
        });
      }

      (window as any).__P9_EAST_TL__ = headerTl;
      (window as any).__P9_EAST_PHOTO_TL__ = photoTl;
    }, stage);

    return () => {
      delete (window as any).__P9_EAST_TL__;
      delete (window as any).__P9_EAST_PHOTO_TL__;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={trackRef} className="p9-chapterTrack p9-chapterTrack--east">
      <article
        ref={stageRef}
        id="p9-ch-05"
        className="p9-viewport p9-chapter p9-chapter--east p9-chapterStage"
        aria-label="Chapter 05: East India Tours"
      >
        {/* Top Header Bar: SJH | ≡ */}
        <PhoneHeader />

        {/* Chapter Number & Title */}
        <div className="p9-chapter__header">
          <span ref={numRef} className="p9-chapter__num">{data.number}</span>
          <h3 className="p9-chapter__title">
            {["EAST", "INDIA TOURS"].map((line, idx) => (
              <span key={idx} className="p9-maskedLine">
                <span
                  ref={(el) => {
                    titleLineRefs.current[idx] = el;
                  }}
                  className="p9-maskedLine__inner"
                >
                  {line}
                </span>
              </span>
            ))}
          </h3>
          <p ref={copyRef} className="p9-chapter__copy">
            Real India, rich in culture,
            <br />
            nature and heritage.
          </p>
        </div>

        {/* Layer Language: Offset Editorial Layers with Subtle Thin Rules / Masks */}
        <div className="p9-chLayers" aria-label="East India Editorial Layers">
          {layers.map((layer, idx) => (
            <div
              key={idx}
              ref={(el) => {
                panelRefs.current[idx] = el;
              }}
              className="p9-chLayers__panel"
              style={{
                marginLeft: `${layer.offset}px`,
                backgroundColor: layer.depth,
              }}
            >
              <span className="p9-chLayers__num">{layer.num}</span>
              <span className="p9-chLayers__name">{layer.name}</span>
              <div className="p9-chLayers__edgeMask" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* Lower Photo: p9-east-india.png with soft upward blend */}
        <div ref={photoStageRef} className="p9-chapter__photoStage">
          <div className="p9-chapter__photoBlend" aria-hidden="true" />
          <img
            ref={photoImgRef}
            src={data.asset}
            alt="Serene Eastern Himalayan monastery, misty pine valleys and blooming rhododendrons"
            className="p9-chapter__photoImg"
            loading="lazy"
          />

          {/* Understated Editorial Text CTA */}
          <a
            ref={ctaRef}
            href={data.href || "/concierge"}
            onClick={handleCtaClick}
            className="p9-understatedCta"
            aria-label="Explore East India"
          >
            <span className="p9-understatedCta__label">Explore East India</span>
            <span className="p9-understatedCta__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </div>
  );
}
