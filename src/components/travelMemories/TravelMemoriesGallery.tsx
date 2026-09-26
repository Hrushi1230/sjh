import React, { useState } from "react";
import { TravelMemory, travelMemoriesData } from "../../data/travelMemories";

interface TravelMemoriesGalleryProps {
  onPhotoClick: (memory: TravelMemory) => void;
}

export const TravelMemoriesGallery: React.FC<TravelMemoriesGalleryProps> = ({
  onPhotoClick,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredMemories = travelMemoriesData.filter((m) => {
    if (filterCategory === "all") return true;
    return m.category === filterCategory;
  });

  return (
    <section
      id="travel-memories-gallery"
      className="sjhGallery"
      aria-label="All Travel Memories Photographic Archive"
    >
      {/* Category filter pills (optional, lightweight) */}
      <div className="sjhGallery__filters" role="tablist" aria-label="Filter memories by category">
        {[
          { id: "all", label: "All Moments" },
          { id: "group", label: "Group" },
          { id: "temple", label: "Temples" },
          { id: "pilgrimage", label: "Pilgrimage" },
          { id: "road", label: "On the Road" },
          { id: "night", label: "Evening" },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={filterCategory === cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`sjhGallery__filterBtn ${filterCategory === cat.id ? "sjhGallery__filterBtn--active" : ""}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Editorial Masonry Grid */}
      <div className="sjhGallery__masonry">
        {filteredMemories.map((memory, index) => {
          const isFirstViewport = index < 6;
          const isDominantHero = memory.id === "memory-08";

          return (
            <article
              key={memory.id}
              className={`sjhGalleryItem sjhGalleryItem--${memory.aspectRatio.replace("/", "-")}`}
              onClick={() => onPhotoClick(memory)}
              role="button"
              tabIndex={0}
              aria-label={`View full photo: ${memory.alt}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPhotoClick(memory);
                }
              }}
            >
              <div
                className="sjhGalleryItem__crop"
                style={{
                  aspectRatio: memory.aspectRatio,
                }}
              >
                <img
                  src={memory.src}
                  alt={memory.alt}
                  width={memory.width}
                  height={memory.height}
                  className="sjhGalleryItem__img"
                  style={isDominantHero ? { viewTransitionName: "sjh-shared-memory-hero" } : undefined}
                  loading={isFirstViewport ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="sjhGalleryItem__scrim" aria-hidden="true" />
                <div className="sjhGalleryItem__meta" aria-hidden="true">
                  <span className="sjhGalleryItem__badge">
                    {String(memory.num).padStart(2, "0")}
                  </span>
                  <span className="sjhGalleryItem__expand">↗</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
