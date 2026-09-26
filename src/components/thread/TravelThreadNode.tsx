/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 6: THE TRAVEL THREAD
 * Interactive Waypoint Node & Final Destination Node Components
 */

import { forwardRef } from "react";
import { ThreadWaypoint } from "./travelThreadGeometry";
import { EditorialIcon } from "../editorial/EditorialIcons";

interface TravelThreadNodeProps {
  waypoint: ThreadWaypoint;
  index: number;
  isReached: boolean;
}

export const TravelThreadNode = forwardRef<HTMLDivElement, TravelThreadNodeProps>(
  function TravelThreadNode({ waypoint, index, isReached }, ref) {
    return (
      <div
        ref={ref}
        className={`sjhThreadNode ${isReached ? "is-reached" : ""}`}
        style={{
          left: `${waypoint.x}px`,
          top: `${waypoint.y}px`,
        }}
        data-destination={waypoint.destinationId}
        data-waypoint-index={index}
        aria-hidden="true"
      >
        {/* Purely Visual Waypoint Icon Chip (No text) */}
        <div className="sjhThreadNode__iconChip">
          <EditorialIcon name={waypoint.iconKey} size={16} />
        </div>

        {/* Precision Coordinate Dot & Ring Marker on Path */}
        <div className="sjhThreadNode__marker">
          <div className="sjhThreadNode__ring" />
          <div className="sjhThreadNode__dot" />
        </div>
      </div>
    );
  }
);

interface TravelThreadFinalNodeProps {
  position: { x: number; y: number };
  isReached: boolean;
}

export const TravelThreadFinalNode = forwardRef<HTMLDivElement, TravelThreadFinalNodeProps>(
  function TravelThreadFinalNode({ position, isReached }, ref) {
    return (
      <div
        ref={ref}
        className={`sjhThreadFinalNode ${isReached ? "is-reached" : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        aria-hidden="true"
      >
        {/* Architectural Destination Ring */}
        <div className="sjhThreadFinalNode__halo" />
        <div className="sjhThreadFinalNode__ring">
          <div className="sjhThreadFinalNode__center" />
        </div>
        <span className="sjhThreadFinalNode__label">NEXT DESTINATION</span>
      </div>
    );
  }
);
