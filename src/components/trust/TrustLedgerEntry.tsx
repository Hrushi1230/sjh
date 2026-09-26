/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 8: THE TRUST LEDGER
 * TrustLedgerEntry: Polymorphic Bespoke Editorial Layout Renderer (01, 02, 03, 04)
 * Polished visual density: planning itinerary line, ghost word, abstract temple line geometry,
 * relational spanning connector, and disciplined ledger rows.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrustEntryData } from "./trustLedgerData";

gsap.registerPlugin(ScrollTrigger);

interface TrustLedgerEntryProps {
  entry: TrustEntryData;
  index?: number;
}

export function TrustLedgerEntry({ entry }: TrustLedgerEntryProps) {
  const containerRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleLinesRef = useRef<HTMLSpanElement[]>([]);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  // Layout-specific refs
  const rule01Ref = useRef<HTMLDivElement>(null);
  const marginNoteRef = useRef<HTMLDivElement>(null);
  const ghostWordRef = useRef<HTMLDivElement>(null);
  const itineraryPathRef = useRef<SVGPathElement>(null);
  const serviceNotesRef = useRef<HTMLDivElement>(null);

  const stepStrokesRef = useRef<HTMLDivElement[]>([]);
  const templePathRef = useRef<SVGPathElement>(null);

  const connectorLineRef = useRef<SVGPathElement>(null);

  const closureUnderlineRef = useRef<HTMLDivElement>(null);
  const ledgerRowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      if (numberRef.current) {
        numberRef.current.style.opacity = "1";
        numberRef.current.style.transform = "none";
      }
      titleLinesRef.current.forEach((t) => {
        if (t) {
          t.style.opacity = "1";
          t.style.transform = "none";
        }
      });
      if (bodyRef.current) {
        bodyRef.current.style.opacity = "1";
        bodyRef.current.style.transform = "none";
      }
      if (rule01Ref.current) rule01Ref.current.style.transform = "none";
      if (marginNoteRef.current) marginNoteRef.current.style.opacity = "1";
      if (ghostWordRef.current) ghostWordRef.current.style.opacity = "0.06";
      if (itineraryPathRef.current) itineraryPathRef.current.style.strokeDashoffset = "0";
      if (serviceNotesRef.current) serviceNotesRef.current.style.opacity = "1";
      stepStrokesRef.current.forEach((s) => {
        if (s) s.style.transform = "none";
      });
      if (templePathRef.current) templePathRef.current.style.strokeDashoffset = "0";
      if (connectorLineRef.current) connectorLineRef.current.style.strokeDashoffset = "0";
      if (closureUnderlineRef.current) closureUnderlineRef.current.style.transform = "none";
      if (ledgerRowsRef.current) ledgerRowsRef.current.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "center 52%",
          scrub: 0.5,
        },
      });

      if (entry.layout === "crafted") {
        // ENTRY 01: PERSONALLY CRAFTED
        // 1. Ghost word appears subtly (5-8% opacity)
        if (ghostWordRef.current) {
          tl.fromTo(
            ghostWordRef.current,
            { opacity: 0, x: -16 },
            { opacity: 0.065, x: 0, duration: 0.35, ease: "power1.out" },
            0.02
          );
        }

        // 2. Rule draws first
        if (rule01Ref.current) {
          tl.fromTo(
            rule01Ref.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.2, ease: "power2.out" },
            0.05
          );
        }

        // 3. Margin note moves from edge ~24px toward title
        if (marginNoteRef.current) {
          tl.fromTo(
            marginNoteRef.current,
            { x: -24, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
            0.10
          );
        }

        // 4. "01" number appears (fade + small x shift)
        if (numberRef.current) {
          tl.fromTo(
            numberRef.current,
            { opacity: 0, x: -12 },
            { opacity: 1, x: 0, duration: 0.2, ease: "power2.out" },
            0.12
          );
        }

        // 5. Title rises through mask
        titleLinesRef.current.forEach((line, i) => {
          if (!line) return;
          tl.fromTo(
            line,
            { y: "105%", opacity: 0 },
            { y: "0%", opacity: 1, duration: 0.25, ease: "power3.out" },
            0.18 + i * 0.08
          );
        });

        // 6. Body copy appears only after title settles
        if (bodyRef.current) {
          tl.fromTo(
            bodyRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" },
            0.40
          );
        }

        // 7. Faint itinerary planning line & service notes reveal
        if (itineraryPathRef.current) {
          const pathLen = itineraryPathRef.current.getTotalLength() || 240;
          itineraryPathRef.current.style.strokeDasharray = `${pathLen}`;
          tl.fromTo(
            itineraryPathRef.current,
            { strokeDashoffset: pathLen },
            { strokeDashoffset: 0, duration: 0.25, ease: "none" },
            0.46
          );
        }

        if (serviceNotesRef.current) {
          tl.fromTo(
            serviceNotesRef.current,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
            0.52
          );
        }
      } else if (entry.layout === "rooted") {
        // ENTRY 02: ROOTED IN ODISHA
        // 1. Abstract Odisha temple architectural SVG geometry draws vertically (8-12% opacity)
        if (templePathRef.current) {
          const tLen = templePathRef.current.getTotalLength() || 680;
          templePathRef.current.style.strokeDasharray = `${tLen}`;
          tl.fromTo(
            templePathRef.current,
            { strokeDashoffset: tLen },
            { strokeDashoffset: 0, duration: 0.55, ease: "none" },
            0.04
          );
        }

        // 2. Stepped architectural temple strokes grow DOWN
        stepStrokesRef.current.forEach((stroke, i) => {
          if (!stroke) return;
          tl.fromTo(
            stroke,
            { scaleY: 0, transformOrigin: "top" },
            { scaleY: 1, duration: 0.22, ease: "power2.out" },
            0.08 + i * 0.06
          );
        });

        // 3. "02" reveals from clipped top
        if (numberRef.current) {
          tl.fromTo(
            numberRef.current,
            { opacity: 0, y: -16 },
            { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" },
            0.20
          );
        }

        // 4. Title reveals
        titleLinesRef.current.forEach((line, i) => {
          if (!line) return;
          tl.fromTo(
            line,
            { y: "105%", opacity: 0 },
            { y: "0%", opacity: 1, duration: 0.24, ease: "power3.out" },
            0.26 + i * 0.08
          );
        });

        // 5. Body copy
        if (bodyRef.current) {
          tl.fromTo(
            bodyRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" },
            0.46
          );
        }
      } else if (entry.layout === "human") {
        // ENTRY 03: ONE HUMAN CONTACT
        // 1. "03" static anchor
        if (numberRef.current) {
          tl.fromTo(
            numberRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.2 },
            0.05
          );
        }

        // 2. Word "ONE" appears
        if (titleLinesRef.current[0]) {
          tl.fromTo(
            titleLinesRef.current[0],
            { y: "105%", opacity: 0 },
            { y: "0%", opacity: 1, duration: 0.22, ease: "power3.out" },
            0.10
          );
        }

        // 3. Single relational line draws across negative space connecting ONE → HUMAN CONTACT
        if (connectorLineRef.current) {
          const cLen = connectorLineRef.current.getTotalLength() || 320;
          connectorLineRef.current.style.strokeDasharray = `${cLen}`;
          tl.fromTo(
            connectorLineRef.current,
            { strokeDashoffset: cLen },
            { strokeDashoffset: 0, duration: 0.32, ease: "power2.out" },
            0.20
          );
        }

        // 4. Words "HUMAN CONTACT" reveal
        if (titleLinesRef.current[1]) {
          tl.fromTo(
            titleLinesRef.current[1],
            { y: "105%", opacity: 0 },
            { y: "0%", opacity: 1, duration: 0.22, ease: "power3.out" },
            0.32
          );
        }

        // 5. Body copy
        if (bodyRef.current) {
          tl.fromTo(
            bodyRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" },
            0.46
          );
        }
      } else if (entry.layout === "handled") {
        // ENTRY 04: DETAILS, HANDLED
        // 1. "04" quiet fade
        if (numberRef.current) {
          tl.fromTo(
            numberRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.25, ease: "power1.out" },
            0.05
          );
        }

        // 2. Title masked reveal
        titleLinesRef.current.forEach((line, i) => {
          if (!line) return;
          tl.fromTo(
            line,
            { y: "105%", opacity: 0 },
            { y: "0%", opacity: 1, duration: 0.24, ease: "power2.out" },
            0.14 + i * 0.08
          );
        });

        // 3. Body copy
        if (bodyRef.current) {
          tl.fromTo(
            bodyRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.24, ease: "power2.out" },
            0.32
          );
        }

        // 4. Disciplined ledger-line fragments / resolved rows reveal
        if (ledgerRowsRef.current) {
          tl.fromTo(
            ledgerRowsRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.26, ease: "power2.out" },
            0.42
          );
        }

        // 5. Short gold closure underline draws AFTER body copy appears
        if (closureUnderlineRef.current) {
          tl.fromTo(
            closureUnderlineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.25, ease: "power2.out" },
            0.54
          );
        }
      }

      // Editorial Continuity: Partial fade on departure to retain 20-25% presence until next establishes
      gsap.to(el, {
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "bottom 50%",
          end: "bottom 15%",
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [entry.layout]);

  // Abstract Odisha Temple Architectural Elevation Spline (pure line art, stepped shikhara / pidha elevation)
  const templeElevationPath = 
    "M 50 10 L 50 200 " + // Center vertical axis
    "M 45 35 L 55 35 " +
    "M 42 55 L 58 55 " +
    "M 38 78 L 62 78 " +
    "M 34 105 L 66 105 " +
    "M 30 135 L 70 135 " +
    "M 26 168 L 74 168 " +
    "M 22 198 L 78 198 " +
    // Stepped outer perimeter contour
    "M 45 35 L 45 55 L 42 55 L 42 78 L 38 78 L 38 105 L 34 105 L 34 135 L 30 135 L 30 168 L 26 168 L 26 198 L 22 198 " +
    "M 55 35 L 55 55 L 58 55 L 58 78 L 62 78 L 62 105 L 66 105 L 66 135 L 70 135 L 70 168 L 74 168 L 74 198 L 78 198";

  // Relational Connector Line spanning negative space from ONE (top-left) to HUMAN CONTACT (mid-right)
  const relationalPath = "M 56 14 L 230 14 Q 254 14 254 34 Q 254 52 230 52 L 140 52";

  return (
    <article
      ref={containerRef}
      id={`trust-entry-${entry.id}`}
      className={`sjhTrustEntry sjhTrustEntry--${entry.layout}`}
      aria-label={entry.accessibleLabel}
    >
      {/* ====================================================================
          ENTRY 01: PERSONALLY CRAFTED
          ==================================================================== */}
      {entry.layout === "crafted" && (
        <>
          {/* Oversized Ghost Word "PERSONAL" (5-8% opacity) */}
          <div ref={ghostWordRef} className="sjhTrustEntry__ghostWord" aria-hidden="true">
            PERSONAL
          </div>

          {/* Margin Note Accent */}
          <div ref={marginNoteRef} className="sjhTrustEntry__marginNote" aria-hidden="true" />

          {/* Leading Architectural Rule */}
          <div ref={rule01Ref} className="sjhTrustEntry__rule01" aria-hidden="true" />
        </>
      )}

      {/* ====================================================================
          ENTRY 02: ROOTED IN ODISHA
          ==================================================================== */}
      {entry.layout === "rooted" && (
        <>
          {/* Abstract Odisha Temple Architectural SVG Geometry (Line Art, 8-12% opacity) */}
          <div className="sjhTrustEntry__templeGeometry" aria-hidden="true">
            <svg
              className="sjhTrustEntry__templeSvg"
              viewBox="0 0 100 210"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                ref={templePathRef}
                d={templeElevationPath}
                className="sjhTrustEntry__templePath"
              />
            </svg>
          </div>

          {/* Stepped Architectural Motif (Temple Spire Geometry) */}
          <div className="sjhTrustEntry__steppedMotif" aria-hidden="true">
            <div
              ref={(el) => { if (el) stepStrokesRef.current[0] = el; }}
              className="sjhTrustEntry__stepStroke sjhTrustEntry__stepStroke--1"
            />
            <div
              ref={(el) => { if (el) stepStrokesRef.current[1] = el; }}
              className="sjhTrustEntry__stepStroke sjhTrustEntry__stepStroke--2"
            />
            <div
              ref={(el) => { if (el) stepStrokesRef.current[2] = el; }}
              className="sjhTrustEntry__stepStroke sjhTrustEntry__stepStroke--3"
            />
          </div>
        </>
      )}

      {/* Ledger Entry Number (Decorative Serif) */}
      <div className="sjhTrustEntry__numWrap" aria-hidden="true">
        <span ref={numberRef} className="sjhTrustEntry__number">
          {entry.id}
        </span>
      </div>

      {/* ====================================================================
          ENTRY 03: ONE HUMAN CONTACT
          ==================================================================== */}
      {entry.layout === "human" ? (
        <h3 ref={titleRef} className="sjhTrustEntry__title">
          <div className="sjhTrustEntry__relationalContainer">
            {/* Top row: Word "ONE" */}
            <div className="sjhTrustEntry__relationalTop">
              <span className="sjhTrustMaskedLine sjhTrustEntry__wordOne">
                <span
                  ref={(el) => { if (el) titleLinesRef.current[0] = el; }}
                  className="sjhTrustMaskedLine__inner"
                >
                  {entry.title[0]}
                </span>
              </span>
            </div>

            {/* Single relational line spanning across previously empty negative space */}
            <div className="sjhTrustEntry__relationalConnectorWrap" aria-hidden="true">
              <svg
                className="sjhTrustEntry__relationalSvg"
                viewBox="0 0 280 64"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  ref={connectorLineRef}
                  d={relationalPath}
                  className="sjhTrustEntry__relationalLinePath"
                />
                <circle cx="56" cy="14" r="2.5" fill="#B99455" />
                <circle cx="140" cy="52" r="2.5" fill="#B99455" />
              </svg>
            </div>

            {/* Bottom row: Words "HUMAN CONTACT" */}
            <div className="sjhTrustEntry__relationalBottom">
              <span className="sjhTrustMaskedLine sjhTrustEntry__wordsContact">
                <span
                  ref={(el) => { if (el) titleLinesRef.current[1] = el; }}
                  className="sjhTrustMaskedLine__inner"
                >
                  {entry.title[1]}
                </span>
              </span>
            </div>
          </div>
        </h3>
      ) : (
        <h3 ref={titleRef} className="sjhTrustEntry__title">
          {entry.title.map((line, idx) => (
            <span key={idx} className="sjhTrustMaskedLine">
              <span
                ref={(el) => { if (el) titleLinesRef.current[idx] = el; }}
                className="sjhTrustMaskedLine__inner"
              >
                {line}
              </span>
            </span>
          ))}
        </h3>
      )}

      {/* Body Statement */}
      <p ref={bodyRef} className="sjhTrustEntry__body">
        {entry.body}
      </p>

      {/* ====================================================================
          ENTRY 01 ENRICHMENT: Faint Itinerary Planning Line & Service Margin Notes
          ==================================================================== */}
      {entry.layout === "crafted" && (
        <div className="sjhTrustEntry__craftedEnrichment" aria-hidden="true">
          {/* Faint itinerary / planning-line geometry */}
          <div className="sjhTrustEntry__itineraryGeometry">
            <svg
              className="sjhTrustEntry__itinerarySvg"
              viewBox="0 0 280 24"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                ref={itineraryPathRef}
                d="M 12 12 L 268 12"
                stroke="#B99455"
                strokeWidth="1"
                strokeDasharray="4 5"
                opacity="0.35"
              />
              <circle cx="36" cy="12" r="2.5" fill="#B99455" opacity="0.5" />
              <line x1="36" y1="6" x2="36" y2="18" stroke="#B99455" strokeWidth="1" opacity="0.4" />
              <circle cx="132" cy="12" r="2.5" fill="#B99455" opacity="0.5" />
              <line x1="132" y1="6" x2="132" y2="18" stroke="#B99455" strokeWidth="1" opacity="0.4" />
              <circle cx="230" cy="12" r="2.5" fill="#B99455" opacity="0.5" />
              <line x1="230" y1="6" x2="230" y2="18" stroke="#B99455" strokeWidth="1" opacity="0.4" />
            </svg>
          </div>

          {/* Tiny real service margin notes: CUSTOM PLANNING / PILGRIMAGE / FAMILY JOURNEYS */}
          <div ref={serviceNotesRef} className="sjhTrustEntry__serviceNotes">
            <span>CUSTOM PLANNING</span>
            <span className="sjhTrustEntry__serviceDivider">/</span>
            <span>PILGRIMAGE</span>
            <span className="sjhTrustEntry__serviceDivider">/</span>
            <span>FAMILY JOURNEYS</span>
          </div>
        </div>
      )}

      {/* ====================================================================
          ENTRY 04 ENRICHMENT: Disciplined Ledger-Line Fragments & Closure Underline
          ==================================================================== */}
      {entry.layout === "handled" && (
        <>
          {/* Disciplined ledger-line fragments / resolved rows */}
          <div ref={ledgerRowsRef} className="sjhTrustEntry__ledgerRows" aria-hidden="true">
            <div className="sjhTrustEntry__ledgerRow">
              <span className="sjhTrustEntry__ledgerLabel">STAYS</span>
              <div className="sjhTrustEntry__ledgerTrack">
                <span className="sjhTrustEntry__ledgerFragment" style={{ width: "42%" }} />
                <span className="sjhTrustEntry__ledgerTabTick" />
                <span className="sjhTrustEntry__ledgerFragment" style={{ width: "50%" }} />
              </div>
            </div>

            <div className="sjhTrustEntry__ledgerRow">
              <span className="sjhTrustEntry__ledgerLabel">TRANSFERS</span>
              <div className="sjhTrustEntry__ledgerTrack">
                <span className="sjhTrustEntry__ledgerFragment" style={{ width: "65%" }} />
                <span className="sjhTrustEntry__ledgerTabTick" />
                <span className="sjhTrustEntry__ledgerFragment" style={{ width: "28%" }} />
              </div>
            </div>

            <div className="sjhTrustEntry__ledgerRow">
              <span className="sjhTrustEntry__ledgerLabel">TIMING</span>
              <div className="sjhTrustEntry__ledgerTrack">
                <span className="sjhTrustEntry__ledgerFragment" style={{ width: "36%" }} />
                <span className="sjhTrustEntry__ledgerTabTick" />
                <span className="sjhTrustEntry__ledgerFragment" style={{ width: "56%" }} />
              </div>
            </div>
          </div>

          {/* Gold Closure Underline */}
          <div ref={closureUnderlineRef} className="sjhTrustEntry__closureUnderline" aria-hidden="true" />
        </>
      )}
    </article>
  );
}
