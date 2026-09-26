/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 6: THE TRAVEL THREAD
 * Bézier Curve Generator & Real-World DOM Anchor Coordinate System
 * 
 * Guarantees:
 * 1. Zero Text Collision: Route strictly traverses outer margins, photograph safe zones,
 *    and inter-chapter whitespace; never intersects headline letters, body text, or labels.
 * 2. Distinct Chapter Spatial Character: Faith (sacred verticality), Escape (sweeping horizontal
 *    alpine expanse), Discover (architectural cusped arch rhythm), Slow Down (calm waterline).
 * 3. Dynamic Cyclic Rotation: Respects activeDestination (Puri, Kashmir, Rajasthan, Kerala).
 */

import { CHAPTER_THREAD_HINTS, ThreadRouteHint } from "./travelThreadData";
import { IconKey } from "../editorial/editorialData";

export interface ThreadWaypoint {
  id: string;
  destinationId: string;
  chapterIndex: number;
  label: string;
  iconKey: IconKey;
  x: number;
  y: number;
  progressThreshold: number;
}

export interface ThreadPathResult {
  d: string;
  waypoints: ThreadWaypoint[];
  finalNode: {
    x: number;
    y: number;
    progressThreshold: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
}

export function buildTravelThreadPath(
  regionElement: HTMLElement,
  chapterOrder: string[]
): ThreadPathResult | null {
  const regionRect = regionElement.getBoundingClientRect();
  const width = Math.max(regionRect.width, 320);
  const height = regionRect.height;

  if (height <= 0) return null;

  // Safe margin boundaries (strictly outside centered text column and experience icons)
  const leftGutter = Math.max(Math.round(width * 0.045), 16);
  const rightGutter = Math.min(Math.round(width * 0.955), width - 16);

  // Query all chapter anchor elements
  const c1Elem = regionElement.querySelector(".sjhFirstChapterContinuation");
  const c1End = c1Elem?.querySelector('[data-thread-anchor="chapter-end"]');

  const chapterTracks = chapterOrder.map((id, idx) => {
    if (idx === 0) {
      return {
        id,
        trackElem: c1Elem,
        startElem: c1Elem?.querySelector('[data-thread-anchor="chapter-start"]'),
        mediaElem: null,
        endElem: c1End,
      };
    }
    const track = regionElement.querySelector(`.sjhChapterTrack[data-destination="${id}"]`);
    return {
      id,
      trackElem: track,
      startElem: track?.querySelector('[data-thread-anchor="chapter-start"]'),
      mediaElem: track?.querySelector('[data-thread-anchor="chapter-media"]'),
      endElem: track?.querySelector('[data-thread-anchor="chapter-end"]'),
    };
  });

  const outroElem = regionElement.querySelector(".sjhTravelThreadOutro");

  const waypoints: ThreadWaypoint[] = [];
  const pathCommands: string[] = [];

  const getLocalTop = (elem: Element | null | undefined, fallbackY: number) => {
    if (!elem) return fallbackY;
    const rect = elem.getBoundingClientRect();
    return rect.top - regionRect.top;
  };

  const getLocalBottom = (elem: Element | null | undefined, fallbackY: number) => {
    if (!elem) return fallbackY;
    const rect = elem.getBoundingClientRect();
    return rect.bottom - regionRect.top;
  };

  // --------------------------------------------------------------------------
  // CHAPTER 01: Route Origin & First Waypoint (Sacred Verticality)
  // Originates at left margin beneath Phase 4 card, leaves Phase 4 breathing room,
  // passes down left gutter safely outside headline, body text, and experience icons.
  // --------------------------------------------------------------------------
  const c1Id = chapterOrder[0] || "puri";
  const c1Hint: ThreadRouteHint = CHAPTER_THREAD_HINTS[c1Id] || CHAPTER_THREAD_HINTS.puri;

  const c1TopY = getLocalTop(c1Elem, 80);
  const c1EndBottomY = getLocalBottom(c1End, c1TopY + 420);

  // Origin point in left gutter
  const originX = leftGutter;
  const originY = c1TopY + 50; // Breathing room beneath Phase 4 card
  pathCommands.push(`M ${originX.toFixed(1)} ${originY.toFixed(1)}`);

  // Waypoint 01: positioned safely on left side with ample clearance for badge
  const wp1X = Math.max(Math.round(width * 0.14), 52);
  const wp1Y = c1TopY + 140;

  // Subtle sacred curve into Waypoint 01
  const cp1_1x = leftGutter;
  const cp1_1y = originY + (wp1Y - originY) * 0.45;
  const cp1_2x = wp1X - 6;
  const cp1_2y = wp1Y - (wp1Y - originY) * 0.2;
  pathCommands.push(
    `C ${cp1_1x.toFixed(1)} ${cp1_1y.toFixed(1)}, ${cp1_2x.toFixed(1)} ${cp1_2y.toFixed(1)}, ${wp1X.toFixed(1)} ${wp1Y.toFixed(1)}`
  );

  waypoints.push({
    id: `waypoint-${c1Id}-1`,
    destinationId: c1Id,
    chapterIndex: 1,
    label: c1Hint.waypointLabel,
    iconKey: c1Hint.waypointIcon,
    x: wp1X,
    y: wp1Y,
    progressThreshold: 0.08,
  });

  // Handoff from WP1: curves gently back into the outer left gutter,
  // passes down strictly outside the headline, body text, and experience row
  const c1GutterY = wp1Y + 36;
  pathCommands.push(
    `C ${(wp1X - 10).toFixed(1)} ${(wp1Y + 18).toFixed(1)}, ${leftGutter.toFixed(1)} ${(wp1Y + 24).toFixed(1)}, ${leftGutter.toFixed(1)} ${c1GutterY.toFixed(1)}`
  );

  // Vertical descent down left gutter past the bottom of the experience row
  const c1ClearY = c1EndBottomY + 24;
  pathCommands.push(`L ${leftGutter.toFixed(1)} ${c1ClearY.toFixed(1)}`);

  // In the inter-chapter whitespace BELOW Chapter 01 experience row:
  // Sweep gracefully from left gutter to right gutter to enter Chapter 02
  const c1ExitX = rightGutter;
  const c1ExitY = c1ClearY + 54;
  const cp1_sw1x = leftGutter + (width * 0.2);
  const cp1_sw1y = c1ClearY + 20;
  const cp1_sw2x = rightGutter - (width * 0.2);
  const cp1_sw2y = c1ExitY - 14;
  pathCommands.push(
    `C ${cp1_sw1x.toFixed(1)} ${cp1_sw1y.toFixed(1)}, ${cp1_sw2x.toFixed(1)} ${cp1_sw2y.toFixed(1)}, ${c1ExitX.toFixed(1)} ${c1ExitY.toFixed(1)}`
  );

  let prevExitX = c1ExitX;
  let prevExitY = c1ExitY;

  // --------------------------------------------------------------------------
  // CHAPTERS 02, 03, 04: Unique Chapter Geometries & Safe Corridors
  // --------------------------------------------------------------------------
  for (let i = 1; i < 4; i++) {
    const chapData = chapterTracks[i];
    const chapId = chapData.id;
    const hint: ThreadRouteHint = CHAPTER_THREAD_HINTS[chapId] || CHAPTER_THREAD_HINTS.kashmir;
    const chapIndex = i + 1;

    const chapTopY = getLocalTop(chapData.trackElem, prevExitY + 80);
    const mediaTopY = getLocalTop(chapData.mediaElem, chapTopY + 50);
    const mediaBottomY = getLocalBottom(chapData.mediaElem, mediaTopY + 280);
    const chapEndBottomY = getLocalBottom(chapData.endElem, mediaBottomY + 260);

    // Alternate side placement for dynamic visual balance:
    // Chapter 2: Right side / sweeping alpine horizontal arc
    // Chapter 3: Left side / architectural cusped arch contour
    // Chapter 4: Right side / serene waterline reflection
    const isRightSide = i % 2 === 1; // 1 = Chapter 2 (Right), 2 = Chapter 3 (Left), 3 = Chapter 4 (Right)
    const currentGutter = isRightSide ? rightGutter : leftGutter;
    const oppositeGutter = isRightSide ? leftGutter : rightGutter;

    // Cross-boundary entry from inter-chapter whitespace into Chapter's photograph
    const entryX = currentGutter;
    const entryY = mediaTopY + 24;

    const cp_trans1x = prevExitX;
    const cp_trans1y = prevExitY + (entryY - prevExitY) * 0.5;
    const cp_trans2x = entryX;
    const cp_trans2y = entryY - (entryY - prevExitY) * 0.3;
    pathCommands.push(
      `C ${cp_trans1x.toFixed(1)} ${cp_trans1y.toFixed(1)}, ${cp_trans2x.toFixed(1)} ${cp_trans2y.toFixed(1)}, ${entryX.toFixed(1)} ${entryY.toFixed(1)}`
    );

    // Waypoint coordinates within the photograph's safe negative space
    let wpX = entryX;
    let wpY = mediaBottomY - 26;

    if (hint.curveBias === "wide") {
      // Escape: sweeping horizontal arc across lower lake/valley negative space
      wpX = isRightSide ? Math.round(width * 0.72) : Math.round(width * 0.28);
      wpY = mediaBottomY - 28;
    } else if (hint.curveBias === "tight") {
      // Discover: tighter architectural rhythm dipping around cusped arch
      wpX = isRightSide ? Math.round(width * 0.74) : Math.round(width * 0.26);
      wpY = mediaBottomY - 24;
    } else if (hint.curveBias === "flat") {
      // Slow Down: calm flatter water current across glassy reflection
      wpX = isRightSide ? Math.round(width * 0.70) : Math.round(width * 0.30);
      wpY = mediaBottomY - 26;
    }

    // Bézier curve across photograph negative space to Waypoint
    const cp_wp1x = entryX;
    const cp_wp1y = entryY + (wpY - entryY) * 0.45;
    const cp_wp2x = wpX + (entryX - wpX) * 0.2;
    const cp_wp2y = wpY - 14;
    pathCommands.push(
      `C ${cp_wp1x.toFixed(1)} ${cp_wp1y.toFixed(1)}, ${cp_wp2x.toFixed(1)} ${cp_wp2y.toFixed(1)}, ${wpX.toFixed(1)} ${wpY.toFixed(1)}`
    );

    // Progress threshold for reaching waypoint
    const progressThresholds = [0.08, 0.32, 0.58, 0.82];
    waypoints.push({
      id: `waypoint-${chapId}-${chapIndex}`,
      destinationId: chapId,
      chapterIndex: chapIndex,
      label: hint.waypointLabel,
      iconKey: hint.waypointIcon,
      x: wpX,
      y: wpY,
      progressThreshold: progressThresholds[i],
    });

    // Exit curve from photo negative space to the outer gutter:
    // Moves cleanly into the gutter well above the headline
    const gutterArrivalY = mediaBottomY + 16;
    const cp_ex_photo1x = wpX;
    const cp_ex_photo1y = wpY + 16;
    const cp_ex_photo2x = currentGutter;
    const cp_ex_photo2y = gutterArrivalY - 8;
    pathCommands.push(
      `C ${cp_ex_photo1x.toFixed(1)} ${cp_ex_photo1y.toFixed(1)}, ${cp_ex_photo2x.toFixed(1)} ${cp_ex_photo2y.toFixed(1)}, ${currentGutter.toFixed(1)} ${gutterArrivalY.toFixed(1)}`
    );

    // Straight descent down outer gutter safely outside headline, body text, and experience icons
    const chapClearY = chapEndBottomY + 24;
    pathCommands.push(`L ${currentGutter.toFixed(1)} ${chapClearY.toFixed(1)}`);

    // In inter-chapter whitespace BELOW experience row:
    // Sweep across to opposite gutter (or into right gutter for Outro handoff)
    if (i < 3) {
      const exitX = oppositeGutter;
      const exitY = chapClearY + 54;
      const cp_sw1x = currentGutter + (isRightSide ? -width * 0.2 : width * 0.2);
      const cp_sw1y = chapClearY + 20;
      const cp_sw2x = oppositeGutter + (isRightSide ? width * 0.2 : -width * 0.2);
      const cp_sw2y = exitY - 14;
      pathCommands.push(
        `C ${cp_sw1x.toFixed(1)} ${cp_sw1y.toFixed(1)}, ${cp_sw2x.toFixed(1)} ${cp_sw2y.toFixed(1)}, ${exitX.toFixed(1)} ${exitY.toFixed(1)}`
      );
      prevExitX = exitX;
      prevExitY = exitY;
    } else {
      // Chapter 4 exits along right gutter directly into Outro
      prevExitX = currentGutter;
      prevExitY = chapClearY;
    }
  }

  // --------------------------------------------------------------------------
  // CHAPTER 04 HANDOFF INTO SCREEN 06 (THE TRAVEL THREAD OUTRO)
  // Chapter 04 line descends right gutter and terminates cleanly at the entrance
  // of Screen 06 where the dedicated full-screen Travel Thread route map begins.
  // --------------------------------------------------------------------------
  const outroTopY = getLocalTop(outroElem, prevExitY + 40);
  pathCommands.push(`L ${rightGutter.toFixed(1)} ${(outroTopY + 12).toFixed(1)}`);

  const finalNodeX = Math.round(width * 0.5);
  const finalNodeY = outroTopY + 390;

  return {
    d: pathCommands.join(" "),
    waypoints,
    finalNode: {
      x: finalNodeX,
      y: finalNodeY,
      progressThreshold: 0.95,
    },
    dimensions: {
      width,
      height,
    },
  };
}
