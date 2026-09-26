import React, { useEffect, useCallback, useRef } from "react";
import { TravelMemory } from "../../data/travelMemories";

interface TravelMemoryLightboxProps {
  memory: TravelMemory | null;
  allMemories: TravelMemory[];
  isOpen: boolean;
  onClose: () => void;
  onSelectMemory: (memory: TravelMemory) => void;
}

export const TravelMemoryLightbox: React.FC<TravelMemoryLightboxProps> = ({
  memory,
  allMemories,
  isOpen,
  onClose,
  onSelectMemory,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const currentIndex = memory ? allMemories.findIndex((m) => m.id === memory.id) : -1;
  const total = allMemories.length;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectMemory(allMemories[currentIndex - 1]);
    } else {
      onSelectMemory(allMemories[total - 1]);
    }
  }, [currentIndex, allMemories, total, onSelectMemory]);

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      onSelectMemory(allMemories[currentIndex + 1]);
    } else {
      onSelectMemory(allMemories[0]);
    }
  }, [currentIndex, allMemories, total, onSelectMemory]);

  // Keyboard navigation & escape close & scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on mount
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch Swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handlePrev(); // swiped right
      } else {
        handleNext(); // swiped left
      }
    }
  };

  if (!isOpen || !memory) return null;

  const countDisplay = `${String(currentIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Travel photo ${countDisplay}: ${memory.alt}`}
      className="sjhLightbox"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background overlay */}
      <div className="sjhLightbox__backdrop" onClick={onClose} aria-hidden="true" />

      {/* Header bar: Back, Counter, Close */}
      <div className="sjhLightbox__bar">
        <button
          type="button"
          onClick={handlePrev}
          className="sjhLightbox__actionBtn"
          aria-label="Previous photograph"
        >
          ←
        </button>

        <span className="sjhLightbox__count" aria-live="polite">
          {countDisplay}
        </span>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="sjhLightbox__actionBtn sjhLightbox__closeBtn"
          aria-label="Close fullscreen image viewer"
        >
          ✕
        </button>
      </div>

      {/* Main photo stage */}
      <div className="sjhLightbox__stage">
        <button
          type="button"
          onClick={handlePrev}
          className="sjhLightbox__navArrow sjhLightbox__navArrow--prev"
          aria-label="Previous photo"
        >
          ‹
        </button>

        <div className="sjhLightbox__imageWrap">
          <img
            key={memory.id}
            src={memory.src}
            alt={memory.alt}
            width={memory.width}
            height={memory.height}
            className="sjhLightbox__img"
            decoding="async"
          />
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="sjhLightbox__navArrow sjhLightbox__navArrow--next"
          aria-label="Next photo"
        >
          ›
        </button>
      </div>

      {/* Minimal caption description based on visible content */}
      <div className="sjhLightbox__caption">
        <p className="sjhLightbox__captionText">{memory.alt}</p>
      </div>
    </div>
  );
};
