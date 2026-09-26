import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FeelingChapter } from "./editorialData";
import { EditorialIcon } from "./EditorialIcons";
import { PHASE5_JOURNEY_LINKS } from "../../data/journeys";

gsap.registerPlugin(ScrollTrigger);

interface FeelingChapterItemProps {
  chapter: FeelingChapter;
  index: number; // 1-based index (e.g. 2, 3, 4)
  totalChapters: number;
  nextChapter?: FeelingChapter;
  assetBase?: string;
  onBackgroundShift?: (color: string) => void;
  onJourneySelect?: (journeyId: string, href: string) => void;
}

export function FeelingChapterItem({
  chapter,
  index,
  totalChapters,
  nextChapter,
  assetBase = "/assets/sjh-hero",
  onBackgroundShift,
  onJourneySelect,
}: FeelingChapterItemProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const mediaImgRef = useRef<HTMLImageElement>(null);
  const headlineLinesRef = useRef<HTMLSpanElement[]>([]);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const experienceRowRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);

  const formattedIndex = String(index).padStart(2, "0");
  const formattedTotal = String(totalChapters).padStart(2, "0");

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // Create master ScrollTrigger timeline across this chapter's visibility
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top 80%",
          end: "bottom 70%",
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            // Background tone transition during handoff (Beat C)
            if (p > 0.68 && nextChapter) {
              onBackgroundShift?.(nextChapter.chapterBackground);
            } else {
              onBackgroundShift?.(chapter.chapterBackground);
            }
          },
        },
      });

      // ----------------------------------------------------
      // Beat A: Arrival & Photo Upward Clip Reveal (0.00 -> 0.32)
      // ----------------------------------------------------
      if (topBarRef.current) {
        tl.fromTo(
          topBarRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.22 },
          0.02
        );
      }

      if (mediaContainerRef.current) {
        tl.fromTo(
          mediaContainerRef.current,
          { clipPath: "inset(24% 0% 0% 0% round 28px)", opacity: 0.85 },
          { clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1, ease: "power2.out", duration: 0.28 },
          0.04
        );
      }

      if (mediaImgRef.current) {
        tl.fromTo(
          mediaImgRef.current,
          { y: -chapter.parallaxAmount * 0.5, scale: 1.05 },
          { y: chapter.parallaxAmount * 0.5, scale: 1.01, ease: "none", duration: 0.65 },
          0
        );
      }

      // ----------------------------------------------------
      // Beat B: Story Reveal (0.20 -> 0.65)
      // ----------------------------------------------------
      if (headlineLinesRef.current.length > 0) {
        tl.fromTo(
          headlineLinesRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.06, ease: "power2.out", duration: 0.28 },
          0.18
        );
      }

      if (bodyRef.current) {
        tl.fromTo(
          bodyRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.24 },
          0.28
        );
      }

      if (experienceRowRef.current) {
        tl.fromTo(
          experienceRowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.24 },
          0.38
        );
      }

      // ----------------------------------------------------
      // Beat C: Handoff to Next Chapter (0.70 -> 1.00)
      // ----------------------------------------------------
      if (nextChapter && narrativeRef.current) {
        tl.to(
          narrativeRef.current,
          {
            y: -14,
            opacity: 0.50,
            ease: "power2.inOut",
            duration: 0.26,
          },
          0.72
        );
      }
    }, track);

    return () => ctx.revert();
  }, [chapter, nextChapter, onBackgroundShift]);

  return (
    <div
      ref={trackRef}
      className={`sjhChapterTrack sjhChapter--${chapter.layoutVariant}`}
      data-chapter-index={index}
      data-destination={chapter.id}
    >
      <section
        className="sjhChapterContent"
        aria-label={`Chapter ${formattedIndex}: ${chapter.feeling}`}
        data-thread-anchor="chapter-start"
      >
        {/* Chapter Header Marker */}
        <div ref={topBarRef} className="sjhChapter__topBar">
          <div className="sjhChapter__leadGroup">
            <span className="sjhChapter__indexNumber">{formattedIndex}</span>
            <span className="sjhChapter__indexTotal">/ {formattedTotal}</span>
            <div className="sjhFirstChapter__divider" aria-hidden="true" />
            <div className="sjhChapter__labelGroup">
              <span className="sjhChapter__feelingTag">{chapter.feeling}</span>
              <span className="sjhChapter__locationTag">{chapter.location}</span>
            </div>
          </div>
          {/* Phase 6 Hook: Micro Line Anchor */}
          <div className="sjhChapter__threadHook" aria-hidden="true" />
        </div>

        {/* Media Framing Container with Parallax */}
        <div
          ref={mediaContainerRef}
          className="sjhChapter__mediaContainer"
          data-thread-anchor="chapter-media"
        >
          {/* Current Chapter Photograph */}
          <img
            ref={mediaImgRef}
            src={`${assetBase}/${chapter.imageAsset}`}
            alt={`${chapter.feeling} in ${chapter.location}`}
            className="sjhChapter__mediaImg"
            loading="lazy"
          />
        </div>

        {/* Editorial Narrative */}
        <div ref={narrativeRef} className="sjhChapter__narrative">
          {/* Headline with Masked Spans */}
          <h3 className="sjhChapter__headline">
            {chapter.title.map((line, i) => (
              <span key={i} className="sjhChapter__headlineLine">
                <span
                  ref={(node) => {
                    if (node) headlineLinesRef.current[i] = node;
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h3>

          {/* Body Copy */}
          <p ref={bodyRef} className="sjhChapter__copy">
            {chapter.body}
          </p>

          {/* Experience Row (3 Markers) */}
          <div
            ref={experienceRowRef}
            className="sjhExperienceRow"
            data-thread-anchor="chapter-end"
          >
            {chapter.experiences.map((exp, idx) => (
              <div key={idx} className="sjhExperienceItem">
                <span className="sjhExperienceItem__icon" aria-hidden="true">
                  <EditorialIcon name={exp.iconKey} size={22} />
                </span>
                <span className="sjhExperienceItem__label">{exp.label}</span>
              </div>
            ))}
          </div>

          {/* Phase 5 Secondary Explore Link */}
          {(() => {
            const link = PHASE5_JOURNEY_LINKS[chapter.id];
            if (!link) return null;
            return (
              <button
                type="button"
                className="sjhChapter__exploreLink"
                onClick={() => {
                  if (onJourneySelect) {
                    onJourneySelect(link.journeyId, link.href);
                  } else {
                    const target = document.getElementById("phase7-journeys");
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                aria-label={link.label}
              >
                <span>{link.label}</span>
              </button>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
