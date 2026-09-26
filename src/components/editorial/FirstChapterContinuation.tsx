import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FeelingChapter } from "./editorialData";
import { EditorialIcon } from "./EditorialIcons";
import { PHASE5_JOURNEY_LINKS } from "../../data/journeys";

gsap.registerPlugin(ScrollTrigger);

interface FirstChapterContinuationProps {
  chapter: FeelingChapter;
  onJourneySelect?: (journeyId: string, href: string) => void;
}

export function FirstChapterContinuation({ chapter, onJourneySelect }: FirstChapterContinuationProps) {
  const containerRef = useRef<HTMLElement>(null);
  const headlineLinesRef = useRef<HTMLSpanElement[]>([]);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const experienceRowRef = useRef<HTMLDivElement>(null);
  const link = PHASE5_JOURNEY_LINKS[chapter.id];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // Gentle reveal of the deeper story narrative as user scrolls past Phase 4
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 45%",
          scrub: 0.6,
        },
      });

      if (headlineLinesRef.current.length > 0) {
        tl.fromTo(
          headlineLinesRef.current,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.08, ease: "power2.out" },
          0
        );
      }

      if (bodyRef.current) {
        tl.fromTo(
          bodyRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, ease: "power2.out" },
          0.14
        );
      }

      if (experienceRowRef.current) {
        tl.fromTo(
          experienceRowRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, ease: "power3.out" },
          0.22
        );
      }
    }, el);

    return () => ctx.revert();
  }, [chapter]);

  return (
    <section
      ref={containerRef}
      className={`sjhFirstChapterContinuation sjhChapter--${chapter.layoutVariant}`}
      aria-label={`Chapter 01: ${chapter.feeling}`}
      data-thread-anchor="chapter-start"
    >
      <div className="sjhFirstChapter__content">
        {/* Chapter 01 Marker */}
        <div className="sjhFirstChapter__header">
          <span className="sjhFirstChapter__number">01</span>
          <span className="sjhFirstChapter__total">/ 04</span>
          <div className="sjhFirstChapter__divider" aria-hidden="true" />
          <div className="sjhFirstChapter__meta">
            <span className="sjhFirstChapter__feeling">{chapter.feeling}</span>
            <span className="sjhFirstChapter__location">{chapter.location}</span>
          </div>
        </div>

        {/* Optional Intro Eyebrow */}
        {chapter.intro && (
          <span className="sjhFirstChapter__intro">{chapter.intro}</span>
        )}

        {/* Deep Chapter Headline */}
        <h3 className="sjhFirstChapter__title">
          {chapter.title.map((line, i) => (
            <span key={i} className="sjhFirstChapter__titleLine">
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

        {/* Chapter Body Story */}
        <p ref={bodyRef} className="sjhFirstChapter__body">
          {chapter.body}
        </p>

        {/* Experience Markers (3 Columns) */}
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
        {link && (
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
        )}
      </div>
    </section>
  );
}
