import React from "react";
import { HOMEPAGE_MEMORIES } from "../../data/travelMemories";

interface TravelMemoryMosaicProps {
  onPhotoClick?: (memoryId: string) => void;
  isTransitioning?: boolean;
}

export const TravelMemoryMosaic: React.FC<TravelMemoryMosaicProps> = ({
  onPhotoClick,
  isTransitioning = false,
}) => {
  const { photoA, photoB, photoC, photoD } = HOMEPAGE_MEMORIES;

  return (
    <div
      className={`sjhMosaicStage ${isTransitioning ? "sjhMosaicStage--transitioning" : ""}`}
      aria-label="Editorial contact sheet of real travel moments"
    >
      {/* Decorative hairline editorial marker */}
      <div className="sjhMosaicStage__goldRule sjhMosaicStage__goldRule--top" aria-hidden="true" />
      <div className="sjhMosaicStage__goldRule sjhMosaicStage__goldRule--vert" aria-hidden="true" />

      {/* PHOTO A: Dominant Group Photograph (~54% width, 235px height) */}
      <div
        className="sjhMosaicItem sjhMosaicItem--a"
        onClick={() => onPhotoClick?.(photoA.id)}
        role="button"
        tabIndex={0}
        aria-label={`Featured memory: ${photoA.alt}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPhotoClick?.(photoA.id);
          }
        }}
      >
        <div className="sjhMosaicItem__crop">
          <img
            src={photoA.src}
            alt={photoA.alt}
            width={photoA.width}
            height={photoA.height}
            className="sjhMosaicImg sjhMosaicImg--dominant"
            style={{ viewTransitionName: "sjh-shared-memory-hero" }}
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="sjhMosaicItem__tag" aria-hidden="true">
          <span className="sjhMosaicItem__num">01</span>
          <span className="sjhMosaicItem__node">●</span>
        </div>
      </div>

      {/* PHOTO B: Pilgrimage / Temple Landmark (upper right, 0 radius) */}
      <div
        className="sjhMosaicItem sjhMosaicItem--b"
        onClick={() => onPhotoClick?.(photoB.id)}
        role="button"
        tabIndex={0}
        aria-label={`Memory: ${photoB.alt}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPhotoClick?.(photoB.id);
          }
        }}
      >
        <div className="sjhMosaicItem__crop">
          <img
            src={photoB.src}
            alt={photoB.alt}
            width={photoB.width}
            height={photoB.height}
            className="sjhMosaicImg"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="sjhMosaicItem__tag" aria-hidden="true">
          <span className="sjhMosaicItem__num">02</span>
        </div>
      </div>

      {/* PHOTO C: Coach / Road Journey (compact lower left, 2px radius) */}
      <div
        className="sjhMosaicItem sjhMosaicItem--c"
        onClick={() => onPhotoClick?.(photoC.id)}
        role="button"
        tabIndex={0}
        aria-label={`Memory: ${photoC.alt}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPhotoClick?.(photoC.id);
          }
        }}
      >
        <div className="sjhMosaicItem__crop">
          <img
            src={photoC.src}
            alt={photoC.alt}
            width={photoC.width}
            height={photoC.height}
            className="sjhMosaicImg"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="sjhMosaicItem__tag" aria-hidden="true">
          <span className="sjhMosaicItem__num">03</span>
        </div>
      </div>

      {/* PHOTO D: Evening / Festive Destination (medium landscape lower right, 2px radius) */}
      <div
        className="sjhMosaicItem sjhMosaicItem--d"
        onClick={() => onPhotoClick?.(photoD.id)}
        role="button"
        tabIndex={0}
        aria-label={`Memory: ${photoD.alt}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPhotoClick?.(photoD.id);
          }
        }}
      >
        <div className="sjhMosaicItem__crop">
          <img
            src={photoD.src}
            alt={photoD.alt}
            width={photoD.width}
            height={photoD.height}
            className="sjhMosaicImg"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="sjhMosaicItem__tag" aria-hidden="true">
          <span className="sjhMosaicItem__num">04</span>
        </div>
      </div>
    </div>
  );
};
