/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: CHAPTER INDEX / ARCHIVED ROWS RAIL
 * Matches the exact storyboard "Scroll Progression (Archived Rows)" specification:
 * - Each row shows number + title
 * - Current active entry displays gold indicator bullet ● and extending rule ────
 * - Archived entries above are subdued
 * - Future entries below are hinted faintly
 */

import { JourneyAtlasItem } from "../../data/journeyAtlasData";

interface ChapterIndexRailProps {
  items: JourneyAtlasItem[];
  currentIndex: number;
  onSelectIndex?: (index: number) => void;
}

export function ChapterIndexRail({
  items,
  currentIndex,
  onSelectIndex,
}: ChapterIndexRailProps) {
  // In the storyboard:
  // For early chapters (01-04), show up to 4 rows (archived + active + future)
  // For later chapters (05-08), show the relevant progression window
  const startIndex = Math.max(0, Math.min(currentIndex - 2, items.length - 4));
  const visibleItems = items.slice(startIndex, startIndex + 4);

  return (
    <div
      className="p9-archivedRail"
      aria-label={`Editorial Chapter Index: Chapter ${items[currentIndex].number} of ${items.length}`}
    >
      {visibleItems.map((item, relIdx) => {
        const actualIdx = startIndex + relIdx;
        const isCurrent = actualIdx === currentIndex;
        const isArchived = actualIdx < currentIndex;
        const isFuture = actualIdx > currentIndex;

        return (
          <div
            key={item.id}
            className={`p9-archivedRail__row ${
              isCurrent
                ? "is-current"
                : isArchived
                ? "is-archived"
                : isFuture
                ? "is-future"
                : ""
            }`}
            onClick={() => onSelectIndex?.(actualIdx)}
            role="button"
            tabIndex={0}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span className="p9-archivedRail__num">{item.number}</span>
            <span className="p9-archivedRail__title">{item.indexLabel.replace(/^\d+\s*/, "")}</span>

            {isCurrent && (
              <div className="p9-archivedRail__activeIndicator" aria-hidden="true">
                <span className="p9-archivedRail__bullet" />
                <span className="p9-archivedRail__line" />
              </div>
            )}
            {isArchived && (
              <div className="p9-archivedRail__archivedRule" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}
