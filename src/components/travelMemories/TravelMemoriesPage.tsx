import React, { useState, useEffect } from "react";
import { TravelMemory, travelMemoriesData } from "../../data/travelMemories";
import { TravelMemoriesGallery } from "./TravelMemoriesGallery";
import { TravelMemoryLightbox } from "./TravelMemoryLightbox";

interface TravelMemoriesPageProps {
  onBack: () => void;
  onOpenMenu?: () => void;
}

export const TravelMemoriesPage: React.FC<TravelMemoriesPageProps> = ({
  onBack,
  onOpenMenu,
}) => {
  const [activeMemory, setActiveMemory] = useState<TravelMemory | null>(null);

  // Update page title
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Travel Memories — Shree Jagannath Holidays";
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="sjhMemoriesPage" role="main">
      {/* Top Header Bar */}
      <header className="sjhMemoriesPage__header">
        <div className="sjhMemoriesPage__headerInner">
          <button
            type="button"
            onClick={onBack}
            className="sjhMemoriesPage__backBtn"
            aria-label="Return to homepage"
          >
            <span className="sjhMemoriesPage__backArrow" aria-hidden="true">←</span>
            <span className="sjhMemoriesPage__backText">BACK</span>
          </button>

          <a href="/" onClick={(e) => { e.preventDefault(); onBack(); }} className="sjhMemoriesPage__brand" aria-label="Shree Jagannath Holidays Home">
            <span className="sjhMemoriesPage__brandMark">SJH</span>
          </a>

          {onOpenMenu && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="sjhMemoriesPage__menuBtn"
              aria-label="Open menu"
            >
              ☰
            </button>
          )}
        </div>
      </header>

      {/* Editorial Page Intro */}
      <section className="sjhMemoriesPage__hero">
        <div className="sjhMemoriesPage__eyebrow">
          <span className="sjhMemoriesPage__eyebrowDot" aria-hidden="true">●</span>
          TRAVEL MEMORIES
        </div>

        <h1 className="sjhMemoriesPage__title">
          JOURNEYS<br />
          WE'VE SHARED.
        </h1>

        <p className="sjhMemoriesPage__sub">
          Moments from roads, temples and journeys travelled together.
        </p>

        <div className="sjhMemoriesPage__goldDivider" aria-hidden="true">
          <span className="sjhMemoriesPage__node">●</span>
        </div>
      </section>

      {/* Full 28-Photo Editorial Gallery */}
      <main className="sjhMemoriesPage__content">
        <TravelMemoriesGallery onPhotoClick={(memory) => setActiveMemory(memory)} />
      </main>

      {/* Lightbox Viewer */}
      <TravelMemoryLightbox
        memory={activeMemory}
        allMemories={travelMemoriesData}
        isOpen={Boolean(activeMemory)}
        onClose={() => setActiveMemory(null)}
        onSelectMemory={(m) => setActiveMemory(m)}
      />

      {/* Page Ending Colophon */}
      <footer className="sjhMemoriesPage__footer">
        <button
          type="button"
          onClick={onBack}
          className="sjhMemoriesPage__returnCta"
        >
          ← Return to Journey
        </button>
        <div className="sjhMemoriesPage__colophon">
          <span>SHREE JAGANNATH HOLIDAYS</span>
          <span className="sjhMemoriesPage__endNode">●</span>
          <span>ODISHA, INDIA</span>
        </div>
      </footer>
    </div>
  );
};
