/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 6: THE TRAVEL THREAD
 * Route Hints, Spatial Profiles, Waypoint Metadata & Outro Copy
 */

import { IconKey } from "../editorial/editorialData";

export interface ThreadRouteHint {
  curveBias: "sacred" | "wide" | "tight" | "flat";
  waypointIcon: IconKey;
  waypointLabel: string;
  // Normalized horizontal anchors (0.0 - 1.0 of region width)
  entryX: number;
  waypointX: number;
  exitX: number;
  // Spatial personality control offsets
  controlTension: number;
  verticalLift: number;
}

export const CHAPTER_THREAD_HINTS: Record<string, ThreadRouteHint> = {
  puri: {
    curveBias: "sacred",
    waypointIcon: "temples",
    waypointLabel: "Faith · Sacred Center",
    entryX: 0.18,
    waypointX: 0.22,
    exitX: 0.68,
    controlTension: 0.45,
    verticalLift: 18,
  },
  kashmir: {
    curveBias: "wide",
    waypointIcon: "mountains",
    waypointLabel: "Escape · Alpine Ridge",
    entryX: 0.68,
    waypointX: 0.76,
    exitX: 0.32,
    controlTension: 0.65,
    verticalLift: 32,
  },
  rajasthan: {
    curveBias: "tight",
    waypointIcon: "heritage",
    waypointLabel: "Discover · Palace Arch",
    entryX: 0.32,
    waypointX: 0.44,
    exitX: 0.66,
    controlTension: 0.35,
    verticalLift: 14,
  },
  kerala: {
    curveBias: "flat",
    waypointIcon: "backwaters",
    waypointLabel: "Slow Down · Waterline",
    entryX: 0.66,
    waypointX: 0.58,
    exitX: 0.48,
    controlTension: 0.28,
    verticalLift: 8,
  },
};

export const THREAD_OUTRO_COPY = {
  eyebrow: "THE JOURNEY CONTINUES",
  titleLine1: "FOUR WAYS TO FEEL.",
  titleLine2: "COUNTLESS WAYS TO TRAVEL.",
  support:
    "Journeys shaped by devotion, altitude, heritage, and unhurried waters. Now leading toward something crafted just for you.",
  nextBadge: "NEXT: CURATED JOURNEYS",
};
