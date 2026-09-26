/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: JOURNEYS ACROSS INDIA
 * Master Section Container (Section 06 of Homepage)
 * PASS B: Scroll Choreography & GSAP Motion Controller
 * 
 * Choreography Features:
 * - Native document scroll with local sticky chapter stages
 * - Signature Phase 8 -> 9 handoff & intro
 * - Individual scrub timelines per chapter with dedicated spatial motion languages
 * - Bidirectional / reverse-scroll correctness
 * - Reduced motion support
 * - Planner handoff reusing Phase 3 Concierge Planner
 */

import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journeyAtlasData } from "../../data/journeyAtlasData";
import { SectionIntro } from "./SectionIntro";
import { Chapter01Odisha } from "./chapters/Chapter01Odisha";
import { Chapter02CharDham } from "./chapters/Chapter02CharDham";
import { Chapter03SouthIndia } from "./chapters/Chapter03SouthIndia";
import { Chapter04NorthIndia } from "./chapters/Chapter04NorthIndia";
import { Chapter05EastIndia } from "./chapters/Chapter05EastIndia";
import { Chapter06WestIndia } from "./chapters/Chapter06WestIndia";
import { Chapter07CentralIndia } from "./chapters/Chapter07CentralIndia";
import { Chapter08CustomPlanning } from "./chapters/Chapter08CustomPlanning";
import "./journeysAcrossIndia.css";

gsap.registerPlugin(ScrollTrigger);
if (typeof window !== "undefined") {
  (window as any).gsap = gsap;
  (window as any).ScrollTrigger = ScrollTrigger;
}

interface JourneysAcrossIndiaSectionProps {
  onJourneySelect?: (journeyId: string, href: string) => void;
}

export function JourneysAcrossIndiaSection({
  onJourneySelect,
}: JourneysAcrossIndiaSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [plannerReadyState, setPlannerReadyState] = useState(false);
  const savedScrollYRef = useRef<number>(0);

  const scrollToChapter = useCallback((index: number) => {
    const chapterIds = [
      "p9-ch-01",
      "p9-ch-02",
      "p9-ch-03",
      "p9-ch-04",
      "p9-ch-05",
      "p9-ch-06",
      "p9-ch-07",
      "p9-ch-08",
    ];
    const targetId = chapterIds[index];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  // Planner handoff reusing existing Phase 3 Concierge Planner
  const handleOpenPlanner = useCallback((destinationHint?: string) => {
    const win = window as any;
    savedScrollYRef.current = window.scrollY;

    if (win.__SJH_PLANNER_SET_FIELD__) {
      win.__SJH_PLANNER_SET_FIELD__("source", "customised planning");
      if (destinationHint) {
        win.__SJH_PLANNER_SET_FIELD__("destination", destinationHint);
      }
    }

    setPlannerReadyState(true);

    // Dim phase 9 content slightly
    if (containerRef.current) {
      gsap.to(containerRef.current, { opacity: 0.72, duration: 0.25 });
    }

    // Activate planner
    if (win.__SJH_PLANNER_OPEN__) {
      win.__SJH_PLANNER_OPEN__();
    }

    // Monitor for planner close to restore exact scroll position and opacity
    const checkClosedInterval = setInterval(() => {
      const state = win.__SJH_GET_PLANNER_STATE__ ? win.__SJH_GET_PLANNER_STATE__() : "closed";
      if (state === "closed") {
        clearInterval(checkClosedInterval);
        if (containerRef.current) {
          gsap.to(containerRef.current, { opacity: 1, duration: 0.25 });
        }
        if (savedScrollYRef.current > 0) {
          window.scrollTo({ top: savedScrollYRef.current, behavior: "instant" });
        }
        setPlannerReadyState(false);
      }
    }, 500);
  }, []);

  // Expose deterministic QA hooks for Pass B testing
  useEffect(() => {
    const win = window as any;

    win.__P9_SCROLL_TO_CHAPTER__ = (num: number) => {
      scrollToChapter(num - 1);
    };

    win.__P9_SET_PLANNER_READY__ = (ready: boolean) => {
      setPlannerReadyState(ready);
    };

    win.__P9_SEEK_INTRO__ = (progress: number) => {
      const tl = win.__P9_INTRO_TL__;
      if (tl && tl.scrollTrigger) {
        ScrollTrigger.refresh();
        const st = tl.scrollTrigger;
        const targetY = st.start + (st.end - st.start) * progress;
        window.scrollTo({ top: targetY, behavior: "instant" });
        tl.progress(progress);
        st.update();
      } else if (tl) {
        tl.progress(progress);
      }
    };

    win.__P9_SEEK_CHAPTER__ = (chapterIdx: number, progress: number) => {
      const tls = [
        win.__P9_ODISHA_TL__,
        win.__P9_CHARDHAM_TL__,
        win.__P9_SOUTH_TL__,
        win.__P9_NORTH_TL__,
        win.__P9_EAST_TL__,
        win.__P9_WEST_TL__,
        win.__P9_CENTRAL_TL__,
        win.__P9_CUSTOM_TL__,
      ];
      const targetTl = tls[chapterIdx];
      if (targetTl && targetTl.scrollTrigger) {
        ScrollTrigger.refresh();
        const st = targetTl.scrollTrigger;
        const targetY = st.start + (st.end - st.start) * progress;
        window.scrollTo({ top: targetY, behavior: "instant" });
        targetTl.progress(progress);
        st.update();
      } else if (targetTl) {
        targetTl.progress(progress);
      }
    };

    return () => {
      delete win.__P9_SCROLL_TO_CHAPTER__;
      delete win.__P9_SET_PLANNER_READY__;
      delete win.__P9_SEEK_INTRO__;
      delete win.__P9_SEEK_CHAPTER__;
    };
  }, [scrollToChapter]);

  // Ensure all downstream chapter triggers are sorted and refreshed in DOM order
  useLayoutEffect(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, []);

  return (
    <section
      id="journeys-across-india"
      data-section="phase9"
      className="sjhJourneysAcrossIndia"
      aria-label="Phase 9: Journeys Across India Editorial Atlas"
    >
      <div ref={containerRef} className="sjhJourneysAcrossIndia__container">
        {/* Sibling A: Phase 9 Intro (Normal Document Flow) */}
        <SectionIntro
          onExploreChapters={() => scrollToChapter(0)}
        />

        {/* Sibling B: Journey Atlas Chapters (Sticky behavior begins from Chapter 01 Odisha) */}
        <div className="journeyAtlasChapters" aria-label="Journey Atlas Chapters">
          {/* Chapter 01 — Odisha & Jagannath Pilgrimage (Atlas Route) */}
          <Chapter01Odisha
            data={journeyAtlasData[0]}
            allData={journeyAtlasData}
            onSelectIndex={scrollToChapter}
            onNavigateRoute={onJourneySelect}
          />

          {/* Chapter 02 — Char Dham Yatra (Vertical Ascent) */}
          <Chapter02CharDham
            data={journeyAtlasData[1]}
            allData={journeyAtlasData}
            onSelectIndex={scrollToChapter}
            onOpenPlanner={handleOpenPlanner}
          />

          {/* Chapter 03 — South India Tours (Flowing Ribbon) */}
          <Chapter03SouthIndia
            data={journeyAtlasData[2]}
            allData={journeyAtlasData}
            onSelectIndex={scrollToChapter}
            onOpenPlanner={handleOpenPlanner}
          />

          {/* Chapter 04 — North India Tours (Stacked Horizons) */}
          <Chapter04NorthIndia
            data={journeyAtlasData[3]}
            allData={journeyAtlasData}
            onSelectIndex={scrollToChapter}
            onOpenPlanner={handleOpenPlanner}
          />

          {/* Chapter 05 — East India Tours (Layered Planes) */}
          <Chapter05EastIndia
            data={journeyAtlasData[4]}
            allData={journeyAtlasData}
            onSelectIndex={scrollToChapter}
            onOpenPlanner={handleOpenPlanner}
          />

          {/* Chapter 06 — West India Tours (Restrained Heritage) */}
          <Chapter06WestIndia
            data={journeyAtlasData[5]}
            allData={journeyAtlasData}
            onSelectIndex={scrollToChapter}
            onOpenPlanner={handleOpenPlanner}
          />

          {/* Chapter 07 — Central India Tours (Grounded Earth) */}
          <Chapter07CentralIndia
            data={journeyAtlasData[6]}
            allData={journeyAtlasData}
            onSelectIndex={scrollToChapter}
            onOpenPlanner={handleOpenPlanner}
          />

          {/* Chapter 08 — Customised Planning (Human Planning Finale) */}
          <Chapter08CustomPlanning
            data={journeyAtlasData[7]}
            allData={journeyAtlasData}
            onSelectIndex={scrollToChapter}
            onOpenPlanner={() => handleOpenPlanner()}
            isPlannerReadyState={plannerReadyState}
          />
        </div>
      </div>
    </section>
  );
}

export default JourneysAcrossIndiaSection;
