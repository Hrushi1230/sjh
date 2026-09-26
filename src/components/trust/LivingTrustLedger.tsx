/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 8: THE LIVING TRUST LEDGER
 * LivingTrustLedger: Mobile-First Non-Pinned Living Trust Ledger with Auto-Transition & Interactive Tabs
 * Asset-Locked: Uses exact supplied SVGs in /assets/sjh-phase8/
 * Performance: 100% Native Document Scroll, 0 sticky scroll traps, buttery auto-advance & swipe.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TRUST_ENTRIES } from "./trustLedgerData";

gsap.registerPlugin(ScrollTrigger);

interface LivingTrustLedgerProps {
  onToneChange?: (tone: string) => void;
}

const DURATION_MS = 5000; // 5.0 seconds per slide

export function LivingTrustLedger({ onToneChange }: LivingTrustLedgerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageCardRef = useRef<HTMLDivElement>(null);

  // Bridge refs
  const bridgeRef = useRef<HTMLDivElement>(null);
  const bridgeThreadRef = useRef<SVGLineElement>(null);
  const bridgeDiamondRef = useRef<SVGPolygonElement>(null);
  const bridgeHeadlineLinesRef = useRef<HTMLSpanElement[]>([]);
  const bridgeFooterRef = useRef<HTMLDivElement>(null);

  // Auto-advance timing refs
  const timerStartTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const userPauseTimeoutRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(false);

  // Touch gesture refs
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  // Change active index with smooth transition & tone update
  const goToIndex = useCallback(
    (index: number) => {
      const nextIndex = (index + TRUST_ENTRIES.length) % TRUST_ENTRIES.length;
      setActiveIndex(nextIndex);
      setProgress(0);
      timerStartTimeRef.current = Date.now();
      elapsedBeforePauseRef.current = 0;

      if (onToneChange) {
        onToneChange(TRUST_ENTRIES[nextIndex].bgTone);
      }

      // Smooth GSAP crossfade on card content
      if (stageCardRef.current) {
        gsap.fromTo(
          stageCardRef.current,
          { opacity: 0.35, y: 8 },
          { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" }
        );
      }
    },
    [onToneChange]
  );

  const handleNext = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const handlePrev = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  // User manual tab tap: changes slide immediately and pauses for 8s
  const handleSelectTab = useCallback(
    (index: number) => {
      goToIndex(index);

      // Temporarily pause auto-advance so user can read what they tapped
      setIsPaused(true);
      if (userPauseTimeoutRef.current) {
        window.clearTimeout(userPauseTimeoutRef.current);
      }
      userPauseTimeoutRef.current = window.setTimeout(() => {
        setIsPaused(false);
        timerStartTimeRef.current = Date.now();
        elapsedBeforePauseRef.current = 0;
      }, 8000);
    },
    [goToIndex]
  );

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
    if (isPaused) {
      timerStartTimeRef.current = Date.now() - elapsedBeforePauseRef.current;
    } else {
      elapsedBeforePauseRef.current = Date.now() - timerStartTimeRef.current;
    }
  }, [isPaused]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Detect horizontal swipe if deltaX is significantly larger than vertical movement
    if (Math.abs(deltaX) > 44 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        // Swipe left -> Next
        handleSelectTab(activeIndex + 1);
      } else {
        // Swipe right -> Prev
        handleSelectTab(activeIndex - 1);
      }
    }
  };

  // IntersectionObserver: Only run auto-transition when section is visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            timerStartTimeRef.current = Date.now() - elapsedBeforePauseRef.current;
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance requestAnimationFrame loop
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    timerStartTimeRef.current = Date.now();

    const loop = () => {
      if (isVisibleRef.current && !isPaused) {
        const elapsed = Date.now() - timerStartTimeRef.current;
        const currentProgress = Math.min(1, elapsed / DURATION_MS);
        setProgress(currentProgress);

        if (elapsed >= DURATION_MS) {
          goToIndex(activeIndex + 1);
          return;
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [activeIndex, isPaused, goToIndex]);

  // Clean up user timeout
  useEffect(() => {
    return () => {
      if (userPauseTimeoutRef.current) {
        window.clearTimeout(userPauseTimeoutRef.current);
      }
    };
  }, []);

  // Bridge reveal on scroll
  useEffect(() => {
    const bridge = bridgeRef.current;
    if (!bridge) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: bridge,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          if (bridgeThreadRef.current) {
            tl.fromTo(
              bridgeThreadRef.current,
              { strokeDashoffset: 60, strokeDasharray: 60 },
              { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }
            );
          }
          if (bridgeDiamondRef.current) {
            tl.fromTo(
              bridgeDiamondRef.current,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
              "-=0.2"
            );
          }
          bridgeHeadlineLinesRef.current.forEach((line, idx) => {
            if (!line) return;
            tl.fromTo(
              line,
              { y: "105%", opacity: 0 },
              { y: "0%", opacity: 1, duration: 0.45, ease: "power3.out" },
              0.25 + idx * 0.08
            );
          });
          if (bridgeFooterRef.current) {
            tl.fromTo(
              bridgeFooterRef.current,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
              "-=0.2"
            );
          }
        },
      });
    }, bridge);

    return () => ctx.revert();
  }, []);

  const activeEntry = TRUST_ENTRIES[activeIndex];

  return (
    <div ref={containerRef} className="trust-ledger-track">
      <div className="trust-ledger-content">
        {/* ==============================================================
            ARCHITECTURAL LEDGER TABS (Interactive 01, 02, 03, 04)
            All 4 entries visible as an architectural index; active tab shows progress & dot
            ============================================================== */}
        <div className="trust-ledger-tabs" role="tablist" aria-label="Trust Ledger Pillars">
          {TRUST_ENTRIES.map((entry, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={entry.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`trust-stage-${entry.id}`}
                id={`trust-tab-${entry.id}`}
                className={`trust-ledger-tab ${isActive ? "trust-ledger-tab--active" : ""}`}
                onClick={() => handleSelectTab(idx)}
              >
                <div className="trust-ledger-tab__content">
                  <span className="trust-ledger-tab__num">{entry.id}</span>
                  <span className="trust-ledger-tab__title">{entry.title.join(" ")}</span>
                  {isActive && (
                    <span className="trust-ledger-tab__activeBadge" aria-hidden="true">
                      {isPaused ? "PAUSED" : "ACTIVE"}
                    </span>
                  )}
                </div>
                <div className="trust-ledger-tab__ruleWrap" aria-hidden="true">
                  <span className="trust-ledger-tab__line" />
                  {isActive && (
                    <span
                      className="trust-ledger-tab__progress"
                      style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
                    />
                  )}
                  <span
                    className={`trust-ledger-tab__dot ${
                      isActive ? "trust-ledger-tab__dot--active" : ""
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* ==============================================================
            ACTIVE TRUST STAGE CARD (Smooth Crossfade & Swipe)
            Displays the current pillar with full editorial artwork & metadata
            ============================================================== */}
        <div
          className="trust-ledger-card-wrap"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div ref={stageCardRef} className="trust-ledger-stage-card">
            {/* ------------------------------------------------------------
                PILLAR 01: PERSONALLY CRAFTED
                ------------------------------------------------------------ */}
            {activeEntry.id === "01" && (
              <article
                id="trust-stage-01"
                role="tabpanel"
                aria-labelledby="trust-tab-01"
                className="trust-stage-panel trust-stage-panel--01"
              >
                <div className="trust-stage__header">
                  <span className="trust-stage__num">01</span>
                  <h3 className="trust-stage__title">
                    <span>PERSONALLY</span>
                    <span>CRAFTED</span>
                  </h3>
                  <p className="trust-stage__body">
                    Your journey begins with a conversation, not a template.
                  </p>
                  <div className="trust-stage__meta trust-stage__meta--rules">
                    <div className="trust-stage__metaRuleItem">
                      <span className="trust-stage__metaLine" />
                      <span className="trust-stage__metaLabel">CUSTOM PLANNING</span>
                    </div>
                    <div className="trust-stage__metaRuleItem">
                      <span className="trust-stage__metaLine" />
                      <span className="trust-stage__metaLabel">PILGRIMAGE</span>
                    </div>
                    <div className="trust-stage__metaRuleItem">
                      <span className="trust-stage__metaLine" />
                      <span className="trust-stage__metaLabel">FAMILY JOURNEYS</span>
                      <span className="trust-stage__metaLine" />
                    </div>
                  </div>
                </div>

                <div className="trust-stage__svgWrap trust-stage__svgWrap--01" aria-hidden="true">
                  <img
                    src="/assets/sjh-phase8/trust-crafted-route.svg"
                    alt=""
                    width={1448}
                    height={1086}
                    className="trust-stage__svg trust-stage__svg--route"
                    loading="lazy"
                  />
                </div>
              </article>
            )}

            {/* ------------------------------------------------------------
                PILLAR 02: ROOTED IN ODISHA
                ------------------------------------------------------------ */}
            {activeEntry.id === "02" && (
              <article
                id="trust-stage-02"
                role="tabpanel"
                aria-labelledby="trust-tab-02"
                className="trust-stage-panel trust-stage-panel--02"
              >
                <div className="trust-stage__header">
                  <span className="trust-stage__num">02</span>
                  <h3 className="trust-stage__title">
                    <span>ROOTED</span>
                    <span>IN ODISHA</span>
                  </h3>
                  <p className="trust-stage__body">
                    Local understanding where our story began.
                  </p>
                  <div className="trust-stage__meta trust-stage__meta--odisha">
                    <span>PURI · KONARK</span>
                    <span>BHUBANESWAR · CHILIKA</span>
                    <span>DHAULI</span>
                  </div>
                </div>

                <div className="trust-stage__svgWrap trust-stage__svgWrap--02" aria-hidden="true">
                  <img
                    src="/assets/sjh-phase8/trust-rooted-temple.svg"
                    alt=""
                    width={1254}
                    height={1254}
                    className="trust-stage__svg trust-stage__svg--temple"
                    loading="lazy"
                  />
                </div>
              </article>
            )}

            {/* ------------------------------------------------------------
                PILLAR 03: ONE HUMAN CONTACT
                ------------------------------------------------------------ */}
            {activeEntry.id === "03" && (
              <article
                id="trust-stage-03"
                role="tabpanel"
                aria-labelledby="trust-tab-03"
                className="trust-stage-panel trust-stage-panel--03"
              >
                <div className="trust-stage__header">
                  <span className="trust-stage__num">03</span>
                  <h3 className="trust-stage__title">
                    <span>ONE HUMAN</span>
                    <span>CONTACT</span>
                  </h3>
                  <p className="trust-stage__body">
                    One person who knows your journey, from planning to return.
                  </p>
                  <div className="trust-stage__relationalConnector" aria-hidden="true">
                    <span className="trust-stage__relationalLine" />
                    <span
                      className="trust-stage__relationalMarker trust-stage__relationalMarker--diamond"
                      style={{ left: "0%" }}
                    />
                    <span
                      className="trust-stage__relationalMarker trust-stage__relationalMarker--dot"
                      style={{ left: "25%" }}
                    />
                    <span
                      className="trust-stage__relationalMarker trust-stage__relationalMarker--diamond"
                      style={{ left: "50%" }}
                    />
                    <span
                      className="trust-stage__relationalMarker trust-stage__relationalMarker--dot"
                      style={{ left: "75%" }}
                    />
                    <span
                      className="trust-stage__relationalMarker trust-stage__relationalMarker--diamond"
                      style={{ left: "100%" }}
                    />
                  </div>
                </div>

                <div className="trust-stage__svgWrap trust-stage__svgWrap--03" aria-hidden="true">
                  <img
                    src="/assets/sjh-phase8/trust-human-landscape.svg"
                    alt=""
                    width={2172}
                    height={724}
                    className="trust-stage__svg trust-stage__svg--landscape"
                    loading="lazy"
                  />
                </div>
              </article>
            )}

            {/* ------------------------------------------------------------
                PILLAR 04: DETAILS, HANDLED
                ------------------------------------------------------------ */}
            {activeEntry.id === "04" && (
              <article
                id="trust-stage-04"
                role="tabpanel"
                aria-labelledby="trust-tab-04"
                className="trust-stage-panel trust-stage-panel--04"
              >
                <div className="trust-stage__header">
                  <span className="trust-stage__num">04</span>
                  <h3 className="trust-stage__title">
                    <span>DETAILS,</span>
                    <span>HANDLED.</span>
                  </h3>
                  <p className="trust-stage__body">
                    Stays, transport and timing brought together with care.
                  </p>
                  <div className="trust-stage__ledgerLabels">
                    <div className="trust-stage__ledgerItem">
                      <span className="trust-stage__ledgerName">STAYS</span>
                      <div className="trust-stage__ledgerRuleWrap">
                        <span className="trust-stage__ledgerRule" />
                        <span className="trust-stage__ledgerDot" />
                      </div>
                    </div>
                    <div className="trust-stage__ledgerItem">
                      <span className="trust-stage__ledgerName">TRANSFERS</span>
                      <div className="trust-stage__ledgerRuleWrap">
                        <span className="trust-stage__ledgerRule" />
                        <span className="trust-stage__ledgerDot" />
                      </div>
                    </div>
                    <div className="trust-stage__ledgerItem">
                      <span className="trust-stage__ledgerName">TIMING</span>
                      <div className="trust-stage__ledgerRuleWrap">
                        <span className="trust-stage__ledgerRule" />
                        <span className="trust-stage__ledgerDot" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="trust-stage__svgWrap trust-stage__svgWrap--04" aria-hidden="true">
                  <img
                    src="/assets/sjh-phase8/trust-details-botanical.svg"
                    alt=""
                    width={1448}
                    height={1086}
                    className="trust-stage__svg trust-stage__svg--botanical"
                    loading="lazy"
                  />
                </div>
              </article>
            )}
          </div>

          {/* Discreet Interactive Carousel Controls */}
          <div className="trust-ledger-controls" aria-label="Carousel navigation">
            <div className="trust-ledger-controls__status">
              <span className="trust-ledger-controls__counter">
                {activeEntry.id} / 04
              </span>
              <button
                type="button"
                className="trust-ledger-controls__pauseBtn"
                onClick={togglePause}
                aria-label={isPaused ? "Resume auto-play" : "Pause auto-play"}
              >
                {isPaused ? (
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                    <polygon points="4,2 14,8 4,14" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                    <rect x="3" y="2" width="3.5" height="12" rx="1" />
                    <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
                  </svg>
                )}
                <span>{isPaused ? "Play" : "Auto"}</span>
              </button>
            </div>

            <div className="trust-ledger-controls__arrows">
              <button
                type="button"
                className="trust-ledger-controls__arrowBtn"
                onClick={handlePrev}
                aria-label="Previous pillar"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="10,3 5,8 10,13" />
                </svg>
              </button>
              <button
                type="button"
                className="trust-ledger-controls__arrowBtn"
                onClick={handleNext}
                aria-label="Next pillar"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="6,3 11,8 6,13" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ==============================================================
            STAGE 05: FULL LEDGER + BRIDGE (Frame I)
            Natural Document Flow directly below the card — connects to Phase 9
            ============================================================== */}
        <article
          ref={bridgeRef}
          id="trust-entry-bridge"
          className="trust-bridge-section"
          aria-label="Closure and Phase 9 Bridge"
        >
          {/* Vertical Thread Connector with Diamond Tip */}
          <div className="trust-bridge__threadWrap" aria-hidden="true">
            <svg
              className="trust-bridge__threadSvg"
              viewBox="0 0 40 64"
              preserveAspectRatio="none"
            >
              <line
                ref={bridgeThreadRef}
                x1="20"
                y1="0"
                x2="20"
                y2="52"
                stroke="#B99455"
                strokeWidth="1.5"
              />
              <polygon
                ref={bridgeDiamondRef}
                points="20,52 23.5,56.5 20,61 16.5,56.5"
                fill="#B99455"
              />
            </svg>
          </div>

          {/* Narrative Bridge Headline */}
          <h3 className="trust-bridge__headline" aria-label="The best journeys leave stories behind.">
            {["THE BEST", "JOURNEYS", "LEAVE STORIES", "BEHIND."].map((line, idx) => (
              <span key={idx} className="trust-bridge__maskedLine">
                <span
                  ref={(el) => {
                    if (el) bridgeHeadlineLinesRef.current[idx] = el;
                  }}
                  className="trust-bridge__maskedLine__inner"
                >
                  {line}
                </span>
              </span>
            ))}
          </h3>

          {/* Lower Vertical Thread to Phase 9 */}
          <div ref={bridgeFooterRef} className="trust-bridge__footer">
            <div className="trust-bridge__lowerLine" aria-hidden="true" />
            <span className="trust-bridge__eyebrow">NEXT</span>
            <svg
              className="trust-bridge__downArrow"
              viewBox="0 0 12 16"
              width="12"
              height="16"
              aria-hidden="true"
            >
              <line x1="6" y1="0" x2="6" y2="12" stroke="#B99455" strokeWidth="1.5" />
              <polyline
                points="2,8 6,13 10,8"
                fill="none"
                stroke="#B99455"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </article>
      </div>
    </div>
  );
}
