/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 8: THE LIVING TRUST LEDGER
 * LivingTrustLedger: Mobile-First Sticky Architecture with Accumulating Archived Rows
 * Asset-Locked: Uses exact supplied SVGs in /assets/sjh-phase8/
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getScrub } from "../../constants/motionTokens";

gsap.registerPlugin(ScrollTrigger);

export function LivingTrustLedger() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Archived Rows refs
  const archivedRow1Ref = useRef<HTMLDivElement>(null);
  const archivedRow2Ref = useRef<HTMLDivElement>(null);
  const archivedRow3Ref = useRef<HTMLDivElement>(null);
  const archivedRow4Ref = useRef<HTMLDivElement>(null);
  const finalRuleRef = useRef<HTMLDivElement>(null);

  // Active Stage refs
  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);
  const stage4Ref = useRef<HTMLDivElement>(null);

  // Stage internal elements refs for micro-motion
  const svg1Ref = useRef<HTMLDivElement>(null);
  const svg2Ref = useRef<HTMLDivElement>(null);
  const svg3Ref = useRef<HTMLDivElement>(null);
  const svg4Ref = useRef<HTMLDivElement>(null);

  const stage1TitleRef = useRef<HTMLHeadingElement>(null);
  const stage1BodyRef = useRef<HTMLParagraphElement>(null);
  const stage1MetaRef = useRef<HTMLDivElement>(null);

  const stage2TitleRef = useRef<HTMLHeadingElement>(null);
  const stage2BodyRef = useRef<HTMLParagraphElement>(null);
  const stage2MetaRef = useRef<HTMLDivElement>(null);

  const stage3TitleRef = useRef<HTMLHeadingElement>(null);
  const stage3BodyRef = useRef<HTMLParagraphElement>(null);

  const stage4TitleRef = useRef<HTMLHeadingElement>(null);
  const stage4BodyRef = useRef<HTMLParagraphElement>(null);
  const stage4LabelsRef = useRef<HTMLDivElement>(null);

  // Bridge (Stage 05 — Frame I: Full Ledger + Bridge) refs
  const bridgeRef = useRef<HTMLDivElement>(null);
  const bridgeThreadRef = useRef<SVGLineElement>(null);
  const bridgeDiamondRef = useRef<SVGPolygonElement>(null);
  const bridgeHeadlineLinesRef = useRef<HTMLSpanElement[]>([]);
  const bridgeFooterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // In reduced motion, document flow handles visibility without sticky pinning
      return;
    }

    const ctx = gsap.context(() => {
      // Expose for debugging and telemetry
      (window as any).ScrollTrigger = ScrollTrigger;

      // Normalized master scroll timeline (0s to 100s mapped to 0.00 -> 1.00 scroll progress)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: getScrub("trustLedger"),
        },
      });

      (window as any).__p8_tl = tl;

      // Ensure all triggers are sorted by document position so earlier pins are accounted for
      requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });

      // ----------------------------------------------------------------------
      // INITIAL TIMELINE STATE AT 0s (progress = 0.00)
      // Frame E: Row 01 is active in top ledger with line and dot
      // ----------------------------------------------------------------------
      tl.set(
        archivedRow1Ref.current,
        { height: 34, opacity: 1, overflow: "visible" },
        0
      );
      tl.set(
        [
          archivedRow2Ref.current,
          archivedRow3Ref.current,
          archivedRow4Ref.current,
        ],
        { height: 0, opacity: 0, overflow: "hidden" },
        0
      );
      tl.set(finalRuleRef.current, { scaleX: 0, opacity: 0 }, 0);

      // Stage 1 initial active state
      tl.set(stage1Ref.current, { autoAlpha: 1, y: 0 }, 0);
      tl.set(stage1TitleRef.current, { scale: 1, y: 0, opacity: 1 }, 0);
      tl.set(stage1BodyRef.current, { opacity: 1, y: 0 }, 0);
      tl.set(stage1MetaRef.current, { opacity: 1, y: 0 }, 0);
      tl.set(svg1Ref.current, { autoAlpha: 1, opacity: 0.20, y: 0 }, 0);

      // Stages 2, 3, 4 initial dormant state
      tl.set([stage2Ref.current, stage3Ref.current, stage4Ref.current], {
        autoAlpha: 0,
        y: 24,
      }, 0);
      tl.set(svg2Ref.current, { autoAlpha: 0, opacity: 0, y: 28 }, 0);
      tl.set(svg3Ref.current, { autoAlpha: 0, opacity: 0, y: 24 }, 0);
      tl.set(svg4Ref.current, { autoAlpha: 0, opacity: 0, y: 24 }, 0);

      // Bridge initial dormant state
      tl.set(bridgeRef.current, { autoAlpha: 0, y: 16 }, 0);
      tl.set(bridgeThreadRef.current, { strokeDashoffset: 60, strokeDasharray: 60 }, 0);
      tl.set(bridgeDiamondRef.current, { scale: 0, opacity: 0 }, 0);
      tl.set(bridgeHeadlineLinesRef.current, { y: "105%", opacity: 0 }, 0);
      tl.set(bridgeFooterRef.current, { opacity: 0, y: 8 }, 0);

      // ======================================================================
      // PHASE 1: 0s -> 18s (0.00 -> 0.18) : Entry 01 Dominant
      // Stable resting reading state
      // ======================================================================
      // (Resting state holds from 0 to 18s)

      // ======================================================================
      // TRANSITION 1: 18s -> 29s (0.18 -> 0.29) : 01 Archives / 02 Enters
      // ======================================================================
      // 1. Stage 01 elements archive
      tl.to(
        stage1TitleRef.current,
        { scale: 0.82, y: -10, opacity: 0.54, duration: 6, ease: "power2.inOut" },
        18
      );
      tl.to(
        [stage1BodyRef.current, stage1MetaRef.current],
        { opacity: 0, y: -6, duration: 5, ease: "power2.in" },
        18
      );
      tl.to(
        svg1Ref.current,
        { opacity: 0, y: -12, duration: 6, ease: "power2.in" },
        18
      );
      tl.to(stage1Ref.current, { autoAlpha: 0, duration: 3, ease: "none" }, 24);

      // 2. Archived Row 02 enters in top ledger
      tl.fromTo(
        archivedRow2Ref.current,
        { height: 0, opacity: 0 },
        { height: 34, opacity: 1, duration: 7, ease: "power2.out" },
        21
      );

      // 3. Stage 02 activates
      tl.fromTo(
        stage2Ref.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 6, ease: "power2.out" },
        23
      );
      tl.fromTo(
        stage2TitleRef.current,
        { scale: 1, y: 0, opacity: 1 },
        { scale: 1, y: 0, opacity: 1, duration: 6 },
        23
      );
      tl.fromTo(
        stage2BodyRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 6, ease: "power2.out" },
        23
      );
      tl.fromTo(
        stage2MetaRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 6, ease: "power2.out" },
        23
      );
      tl.fromTo(
        svg2Ref.current,
        { autoAlpha: 0, opacity: 0, y: 28 },
        { autoAlpha: 1, opacity: 0.20, y: 0, duration: 6, ease: "power2.out" },
        23
      );

      // ======================================================================
      // PHASE 2: 29s -> 47s (0.29 -> 0.47) : Entry 02 Dominant
      // Stable resting state: Rows 01 + 02 active at top + Entry 02 active
      // ======================================================================
      // (Resting state holds from 29s to 47s)

      // ======================================================================
      // TRANSITION 2: 47s -> 58s (0.47 -> 0.58) : 02 Archives / 03 Enters
      // ======================================================================
      // 1. Stage 02 archives
      tl.to(
        stage2TitleRef.current,
        { scale: 0.82, y: -10, opacity: 0.54, duration: 6, ease: "power2.inOut" },
        47
      );
      tl.to(
        [stage2BodyRef.current, stage2MetaRef.current],
        { opacity: 0, y: -6, duration: 5, ease: "power2.in" },
        47
      );
      tl.to(
        svg2Ref.current,
        { opacity: 0, y: -12, duration: 6, ease: "power2.in" },
        47
      );
      tl.to(stage2Ref.current, { autoAlpha: 0, duration: 3, ease: "none" }, 53);

      // 2. Archived Row 03 enters in top ledger
      tl.fromTo(
        archivedRow3Ref.current,
        { height: 0, opacity: 0 },
        { height: 34, opacity: 1, duration: 7, ease: "power2.out" },
        50
      );

      // 3. Stage 03 activates
      tl.fromTo(
        stage3Ref.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 6, ease: "power2.out" },
        52
      );
      tl.fromTo(
        stage3TitleRef.current,
        { scale: 1, y: 0, opacity: 1 },
        { scale: 1, y: 0, opacity: 1, duration: 6 },
        52
      );
      tl.fromTo(
        stage3BodyRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 6, ease: "power2.out" },
        52
      );
      tl.fromTo(
        svg3Ref.current,
        { autoAlpha: 0, opacity: 0, y: 24 },
        { autoAlpha: 1, opacity: 0.19, y: 0, duration: 6, ease: "power2.out" },
        52
      );

      // ======================================================================
      // PHASE 3: 58s -> 75s (0.58 -> 0.75) : Entry 03 Dominant
      // Stable resting state: Rows 01 + 02 + 03 archived at top + Entry 03 active
      // ======================================================================
      // (Resting state holds from 58s to 75s)

      // ======================================================================
      // TRANSITION 3: 75s -> 85s (0.75 -> 0.85) : 03 Archives / 04 Enters
      // ======================================================================
      // 1. Stage 03 archives
      tl.to(
        stage3TitleRef.current,
        { scale: 0.82, y: -10, opacity: 0.54, duration: 6, ease: "power2.inOut" },
        75
      );
      tl.to(
        stage3BodyRef.current,
        { opacity: 0, y: -6, duration: 5, ease: "power2.in" },
        75
      );
      tl.to(
        svg3Ref.current,
        { opacity: 0, y: -12, duration: 6, ease: "power2.in" },
        75
      );
      tl.to(stage3Ref.current, { autoAlpha: 0, duration: 3, ease: "none" }, 81);

      // 2. Archived Row 04 enters in top ledger
      tl.fromTo(
        archivedRow4Ref.current,
        { height: 0, opacity: 0 },
        { height: 34, opacity: 1, duration: 7, ease: "power2.out" },
        78
      );

      // 3. Stage 04 activates
      tl.fromTo(
        stage4Ref.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 5, ease: "power2.out" },
        80
      );
      tl.fromTo(
        stage4TitleRef.current,
        { scale: 1, y: 0, opacity: 1 },
        { scale: 1, y: 0, opacity: 1, duration: 5 },
        80
      );
      tl.fromTo(
        stage4BodyRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 5, ease: "power2.out" },
        80
      );
      tl.fromTo(
        stage4LabelsRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 5, ease: "power2.out" },
        80
      );
      tl.fromTo(
        svg4Ref.current,
        { autoAlpha: 0, opacity: 0, y: 24 },
        { autoAlpha: 1, opacity: 0.20, y: 0, duration: 5, ease: "power2.out" },
        80
      );

      // ======================================================================
      // PHASE 4: 85s -> 93s (0.85 -> 0.93) : Entry 04 Dominant
      // Stable resting state: Rows 01 + 02 + 03 + 04 active at top + Entry 04 active
      // ======================================================================
      // (Resting state holds from 85s to 93s)

      // ======================================================================
      // PHASE 5: 92s -> 100s (0.92 -> 1.00) : Complete Ledger State & Bridge (Frame I)
      // 92s-94s: Active copy archives, Row 04 & final gold rule lock in
      // 94s-98s: Bridge reveals (upper vertical thread, headline, lower thread)
      // 98s-100s: All 4 rows archived together + Complete Bridge (Frame I resting state)
      // ======================================================================
      // 1. Stage 04 active copy fades
      tl.to(
        stage4Ref.current,
        { autoAlpha: 0, y: -8, duration: 2.5, ease: "power2.in" },
        92
      );
      tl.to(
        svg4Ref.current,
        { opacity: 0, y: -10, duration: 2.5, ease: "power2.in" },
        92
      );

      // 2. Closing gold rule expands across below row 04
      tl.fromTo(
        finalRuleRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 2.5, ease: "power2.out" },
        93
      );

      // 3. Stage 05 Bridge reveals under Row 04
      tl.to(
        bridgeRef.current,
        { autoAlpha: 1, y: 0, duration: 1.5, ease: "none" },
        93.5
      );
      tl.fromTo(
        bridgeThreadRef.current,
        { strokeDashoffset: 60 },
        { strokeDashoffset: 0, duration: 2, ease: "power1.out" },
        93.5
      );
      tl.fromTo(
        bridgeDiamondRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "back.out(1.5)" },
        94.5
      );

      // 4. Narrative Bridge Headline reveals line by line
      bridgeHeadlineLinesRef.current.forEach((line, idx) => {
        if (!line) return;
        tl.fromTo(
          line,
          { y: "105%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 2, ease: "power3.out" },
          94.5 + idx * 0.4
        );
      });

      // 5. Eyebrow "NEXT" and arrow reveal
      tl.fromTo(
        bridgeFooterRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
        96.5
      );

      // 6. Complete Frame I holds resting state through 100s
      tl.to({}, { duration: 2 }, 98);
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={trackRef} className="trust-ledger-track">
      <div ref={stickyRef} className="trust-ledger-sticky">
        <div className="trust-ledger-content">
          {/* ==============================================================
              ARCHIVED ROWS CONTAINER (Top Region ~18-24% of Viewport)
              Rows accumulate as user scrolls forward
              ============================================================== */}
          <div className="trust-archived-rows" aria-label="Archived Trust Entries">
            {/* ROW 01 */}
            <div
              ref={archivedRow1Ref}
              className="trust-archived-row trust-archived-row--01"
              aria-hidden="true"
            >
              <div className="trust-archived-row__content">
                <span className="trust-archived-row__num">01</span>
                <span className="trust-archived-row__title">PERSONALLY CRAFTED</span>
              </div>
              <div className="trust-archived-row__ruleWrap">
                <span className="trust-archived-row__line" />
                <span className="trust-archived-row__dot" />
              </div>
            </div>

            {/* ROW 02 */}
            <div
              ref={archivedRow2Ref}
              className="trust-archived-row trust-archived-row--02"
              aria-hidden="true"
            >
              <div className="trust-archived-row__content">
                <span className="trust-archived-row__num">02</span>
                <span className="trust-archived-row__title">ROOTED IN ODISHA</span>
              </div>
              <div className="trust-archived-row__ruleWrap">
                <span className="trust-archived-row__line" />
                <span className="trust-archived-row__dot" />
              </div>
            </div>

            {/* ROW 03 */}
            <div
              ref={archivedRow3Ref}
              className="trust-archived-row trust-archived-row--03"
              aria-hidden="true"
            >
              <div className="trust-archived-row__content">
                <span className="trust-archived-row__num">03</span>
                <span className="trust-archived-row__title">ONE HUMAN CONTACT</span>
              </div>
              <div className="trust-archived-row__ruleWrap">
                <span className="trust-archived-row__line" />
                <span className="trust-archived-row__dot" />
              </div>
            </div>

            {/* ROW 04 */}
            <div
              ref={archivedRow4Ref}
              className="trust-archived-row trust-archived-row--04"
              aria-hidden="true"
            >
              <div className="trust-archived-row__content">
                <span className="trust-archived-row__num">04</span>
                <span className="trust-archived-row__title">DETAILS, HANDLED</span>
              </div>
              <div className="trust-archived-row__ruleWrap">
                <span className="trust-archived-row__line" />
                <span className="trust-archived-row__dot" />
              </div>
            </div>

            {/* Closing Gold Rule below 4 archived rows */}
            <div ref={finalRuleRef} className="trust-archived-rows__finalRule" aria-hidden="true" />
          </div>

          {/* ==============================================================
              ACTIVE TRUST STAGE CONTAINER (Middle & Bottom Region)
              Dominant entry + supplied SVG illustration
              ============================================================== */}
          <div className="trust-active-stage">
            {/* ------------------------------------------------------------
                STAGE 01: PERSONALLY CRAFTED
                ------------------------------------------------------------ */}
            <article
              ref={stage1Ref}
              id="trust-entry-01"
              className="trust-stage trust-stage--01"
              aria-label="01: Personally Crafted"
            >
              <div className="trust-stage__header">
                <span className="trust-stage__num">01</span>
                <h3 ref={stage1TitleRef} className="trust-stage__title">
                  <span>PERSONALLY</span>
                  <span>CRAFTED</span>
                </h3>
                <p ref={stage1BodyRef} className="trust-stage__body">
                  Your journey begins with a conversation, not a template.
                </p>
                <div ref={stage1MetaRef} className="trust-stage__meta trust-stage__meta--rules">
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

              {/* Exact Supplied SVG Asset: trust-crafted-route.svg */}
              <div ref={svg1Ref} className="trust-stage__svgWrap trust-stage__svgWrap--01" aria-hidden="true">
                <img
                  src="/assets/sjh-phase8/trust-crafted-route.svg"
                  alt=""
                  width={1448}
                  height={1086}
                  className="trust-stage__svg trust-stage__svg--route"
                />
              </div>
            </article>

            {/* ------------------------------------------------------------
                STAGE 02: ROOTED IN ODISHA
                ------------------------------------------------------------ */}
            <article
              ref={stage2Ref}
              id="trust-entry-02"
              className="trust-stage trust-stage--02"
              aria-label="02: Rooted in Odisha"
            >
              <div className="trust-stage__header">
                <span className="trust-stage__num">02</span>
                <h3 ref={stage2TitleRef} className="trust-stage__title">
                  <span>ROOTED</span>
                  <span>IN ODISHA</span>
                </h3>
                <p ref={stage2BodyRef} className="trust-stage__body">
                  Local understanding where our story began.
                </p>
                <div ref={stage2MetaRef} className="trust-stage__meta trust-stage__meta--odisha">
                  <span>PURI · KONARK</span>
                  <span>BHUBANESWAR · CHILIKA</span>
                  <span>DHAULI</span>
                </div>
              </div>

              {/* Exact Supplied SVG Asset: trust-rooted-temple.svg */}
              <div ref={svg2Ref} className="trust-stage__svgWrap trust-stage__svgWrap--02" aria-hidden="true">
                <img
                  src="/assets/sjh-phase8/trust-rooted-temple.svg"
                  alt=""
                  width={1254}
                  height={1254}
                  className="trust-stage__svg trust-stage__svg--temple"
                />
              </div>
            </article>

            {/* ------------------------------------------------------------
                STAGE 03: ONE HUMAN CONTACT
                ------------------------------------------------------------ */}
            <article
              ref={stage3Ref}
              id="trust-entry-03"
              className="trust-stage trust-stage--03"
              aria-label="03: One Human Contact"
            >
              <div className="trust-stage__header">
                <span className="trust-stage__num">03</span>
                <h3 ref={stage3TitleRef} className="trust-stage__title">
                  <span>ONE HUMAN</span>
                  <span>CONTACT</span>
                </h3>
                <p ref={stage3BodyRef} className="trust-stage__body">
                  One person who knows your journey, from planning to return.
                </p>
                <div className="trust-stage__relationalConnector" aria-hidden="true">
                  <span className="trust-stage__relationalLine" />
                  <span className="trust-stage__relationalMarker trust-stage__relationalMarker--diamond" style={{ left: "0%" }} />
                  <span className="trust-stage__relationalMarker trust-stage__relationalMarker--dot" style={{ left: "25%" }} />
                  <span className="trust-stage__relationalMarker trust-stage__relationalMarker--diamond" style={{ left: "50%" }} />
                  <span className="trust-stage__relationalMarker trust-stage__relationalMarker--dot" style={{ left: "75%" }} />
                  <span className="trust-stage__relationalMarker trust-stage__relationalMarker--diamond" style={{ left: "100%" }} />
                </div>
              </div>

              {/* Exact Supplied SVG Asset: trust-human-landscape.svg */}
              <div ref={svg3Ref} className="trust-stage__svgWrap trust-stage__svgWrap--03" aria-hidden="true">
                <img
                  src="/assets/sjh-phase8/trust-human-landscape.svg"
                  alt=""
                  width={2172}
                  height={724}
                  className="trust-stage__svg trust-stage__svg--landscape"
                />
              </div>
            </article>

            {/* ------------------------------------------------------------
                STAGE 04: DETAILS, HANDLED
                ------------------------------------------------------------ */}
            <article
              ref={stage4Ref}
              id="trust-entry-04"
              className="trust-stage trust-stage--04"
              aria-label="04: Details, Handled"
            >
              <div className="trust-stage__header">
                <span className="trust-stage__num">04</span>
                <h3 ref={stage4TitleRef} className="trust-stage__title">
                  <span>DETAILS,</span>
                  <span>HANDLED.</span>
                </h3>
                <p ref={stage4BodyRef} className="trust-stage__body">
                  Stays, transport and timing brought together with care.
                </p>
                <div ref={stage4LabelsRef} className="trust-stage__ledgerLabels">
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

              {/* Exact Supplied SVG Asset: trust-details-botanical.svg */}
              <div ref={svg4Ref} className="trust-stage__svgWrap trust-stage__svgWrap--04" aria-hidden="true">
                <img
                  src="/assets/sjh-phase8/trust-details-botanical.svg"
                  alt=""
                  width={1448}
                  height={1086}
                  className="trust-stage__svg trust-stage__svg--botanical"
                />
              </div>
            </article>

            {/* ------------------------------------------------------------
                STAGE 05: FULL LEDGER + BRIDGE (Frame I)
                All 4 rows archived at top + Vertical Thread + Headline + Next
                ------------------------------------------------------------ */}
            <article
              ref={bridgeRef}
              id="trust-entry-bridge"
              className="trust-stage trust-stage--bridge"
              aria-label="Closure and Phase 9 Bridge"
            >
              {/* Vertical Thread Connector with Diamond Tip from under Row 04 anchor dot */}
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
                      ref={(el) => { if (el) bridgeHeadlineLinesRef.current[idx] = el; }}
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
      </div>
    </div>
  );
}
