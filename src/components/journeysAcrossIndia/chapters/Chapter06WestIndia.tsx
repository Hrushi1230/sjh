/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: CHAPTER 06 — WEST INDIA
 * PASS B: Restrained Heritage Choreography
 * 
 * Choreography Specification (Section 10):
 * - Visual rest chapter: calm, spacious, dignified
 * - 0.00-0.22: 06 + title line-mask reveal
 * - 0.20-0.38: body copy fades in
 * - 0.35-0.55: single architectural gold rule draws (scaleX 0 -> 1)
 * - 0.30-0.70: image simple slow reveal (clip-path inset(12% 0 0 0) -> inset(0))
 * - 0.65-0.85: Understated CTA fade/slide 5px (opacity 0 -> 1, x -5px -> 0)
 * - 0.94-1.00: Chapter exit handoff: image opacity 1 -> 0.4, title y: 0 -> -10px
 * - Reverse: rule retracts, image re-clips, clean reversal
 * - Scrub: 0.3
 */

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JourneyAtlasItem } from "../../../data/journeyAtlasData";
import { PhoneHeader } from "../PhoneHeader";

gsap.registerPlugin(ScrollTrigger);

interface Chapter06Props {
  data: JourneyAtlasItem;
  allData?: JourneyAtlasItem[];
  onSelectIndex?: (index: number) => void;
  onOpenPlanner?: (destinationHint?: string) => void;
}

export function Chapter06WestIndia({
  data,
  onOpenPlanner,
}: Chapter06Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  // Typography refs
  const numRef = useRef<HTMLSpanElement>(null);
  const titleLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  // Photo & CTA refs
  const photoStageRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenPlanner?.("west-india");
  };

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
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "left center" });

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

      // 1. Chapter Header & Architectural Rule Animation (triggers when chapter reaches middle of viewport)
      const headerTl = gsap.timeline({ paused: true });

      // 0.00 - 0.22: 06 + title reveal
      headerTl.to(numRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.00);
      titleLineRefs.current.forEach((line, idx) => {
        if (!line) return;
        headerTl.to(
          line,
          { y: "0%", opacity: 1, duration: 0.32, ease: "power3.out" },
          0.08 + idx * 0.08
        );
      });

      // 0.20 - 0.42: Body copy fades in
      headerTl.to(copyRef.current, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.20);

      // 0.26 - 0.60: Architectural gold rule draws
      headerTl.to(
        ruleRef.current,
        { scaleX: 1, duration: 0.34, ease: "power2.out" },
        0.26
      );

      ScrollTrigger.create({
        trigger: stage,
        start: "top 55%",
        once: true,
        onEnter: () => headerTl.play(),
        onEnterBack: () => headerTl.play(),
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
          opacity: 1,
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
          start: "top 78%",
          once: true,
          onEnter: () => photoTl.play(),
          onEnterBack: () => photoTl.play(),
        });
      }

      (window as any).__P9_WEST_TL__ = headerTl;
      (window as any).__P9_WEST_PHOTO_TL__ = photoTl;
    }, stage);

    return () => {
      delete (window as any).__P9_WEST_TL__;
      delete (window as any).__P9_WEST_PHOTO_TL__;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={trackRef} className="p9-chapterTrack p9-chapterTrack--west">
      <article
        ref={stageRef}
        id="p9-ch-06"
        className="p9-viewport p9-chapter p9-chapter--west p9-chapterStage"
        aria-label="Chapter 06: West India Tours"
      >
        {/* Top Header Bar: SJH | ≡ */}
        <PhoneHeader />

        {/* Chapter Number & Title */}
        <div className="p9-chapter__header">
          <span ref={numRef} className="p9-chapter__num">{data.number}</span>
          <h3 className="p9-chapter__title">
            {["WEST", "INDIA TOURS"].map((line, idx) => (
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
            Regional journeys
            <br />
            across western India.
          </p>
        </div>

        {/* Middle: Generous Editorial Whitespace with Architectural Rule */}
        <div className="p9-quietSpace" aria-hidden="true">
          <div ref={ruleRef} className="p9-quietSpace__rule" />
        </div>

        {/* Lower Photo: p9-west-india.png with soft upward blend */}
        <div ref={photoStageRef} className="p9-chapter__photoStage">
          <div className="p9-chapter__photoBlend" aria-hidden="true" />
          <img
            ref={photoImgRef}
            src={data.asset}
            alt="Historic Rajasthan lakeside fort and sandstone palace in golden sunlight"
            className="p9-chapter__photoImg"
            loading="lazy"
          />

          {/* Understated Editorial Text CTA */}
          <a
            ref={ctaRef}
            href={data.href || "/concierge"}
            onClick={handleCtaClick}
            className="p9-understatedCta"
            aria-label="Explore West India"
          >
            <span className="p9-understatedCta__label">Explore West India</span>
            <span className="p9-understatedCta__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </div>
  );
}
