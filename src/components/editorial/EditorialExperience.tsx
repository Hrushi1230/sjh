import { useState, useEffect, useMemo, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getChapterOrder } from "./editorialData";
import { FirstChapterContinuation } from "./FirstChapterContinuation";
import { FeelingChapterItem } from "./FeelingChapterItem";
import "./editorial.css";

interface EditorialExperienceProps {
  activeDestination: "puri" | "kashmir" | "rajasthan" | "kerala";
  assetBase?: string;
  children?: React.ReactNode;
  onJourneySelect?: (journeyId: string, href: string) => void;
}

export function EditorialExperience({
  activeDestination = "puri",
  assetBase = "/assets/sjh-hero",
  children,
  onJourneySelect,
}: EditorialExperienceProps) {
  // Dynamically calculate the active-first cyclic chapter rotation
  const chapters = useMemo(() => {
    return getChapterOrder(activeDestination);
  }, [activeDestination]);

  // Master background tone matching active chapter progression
  const [currentTone, setCurrentTone] = useState<string>(
    () => chapters[0]?.chapterBackground || "#F4EFE6"
  );

  useEffect(() => {
    if (chapters[0]) {
      setCurrentTone(chapters[0].chapterBackground);
    }
  }, [chapters]);

  const handleBackgroundShift = useCallback((color: string) => {
    setCurrentTone(color);
  }, []);

  // Preload upcoming chapter images in the background
  useEffect(() => {
    chapters.forEach((chap) => {
      const img = new Image();
      img.src = `${assetBase}/${chap.imageAsset}`;
    });
  }, [chapters, assetBase]);

  // Refresh ScrollTrigger upon resize or orientation changes
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const firstChapter = chapters[0];
  const subsequentChapters = chapters.slice(1);

  return (
    <div
      className="sjhEditorialExperience"
      style={{ backgroundColor: currentTone }}
      data-active-destination={activeDestination}
    >
      {/* Chapter 01: Continuation of Phase 4's active feeling */}
      {firstChapter && (
        <FirstChapterContinuation
          chapter={firstChapter}
          onJourneySelect={onJourneySelect}
        />
      )}

      {/* Chapters 02, 03, 04: Three-Beat Sticky Editorial Chapters */}
      {subsequentChapters.map((chap, idx) => {
        const chapterNumber = idx + 2;
        const nextChap = subsequentChapters[idx + 1];

        return (
          <FeelingChapterItem
            key={`${chap.id}-${chapterNumber}`}
            chapter={chap}
            index={chapterNumber}
            totalChapters={4}
            nextChapter={nextChap}
            assetBase={assetBase}
            onBackgroundShift={handleBackgroundShift}
            onJourneySelect={onJourneySelect}
          />
        );
      })}

      {children}
    </div>
  );
}
