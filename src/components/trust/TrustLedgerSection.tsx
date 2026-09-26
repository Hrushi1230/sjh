/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 8: WHY SHREE JAGANNATH HOLIDAYS
 * THE TRUST LEDGER (SECTION 05 OF HOMEPAGE)
 * Master Section Container & Continuous Editorial Controller
 */

import { useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrustLedgerIntro } from "./TrustLedgerIntro";
import { LivingTrustLedger } from "./LivingTrustLedger";
import "./trustLedger.css";

gsap.registerPlugin(ScrollTrigger);
if (typeof window !== "undefined") {
  (window as any).ScrollTrigger = ScrollTrigger;
}

export function TrustLedgerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentTone, setCurrentTone] = useState<string>("#F4EFE6");

  const handleScrollTone = useCallback((tone: string) => {
    setCurrentTone(tone);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-sjh"
      data-section="phase8"
      className="sjhTrustLedger"
      aria-labelledby="why-sjh-title"
      style={{ backgroundColor: currentTone }}
    >
      <div className="sjhTrustLedger__container">
        {/* Section Intro: 90° Thread-to-Ledger Transition, Eyebrow & Masked Statement */}
        <TrustLedgerIntro />

        {/* The Living Trust Ledger: Auto-Transitioning Carousel with Interactive Architectural Tabs + Bridge */}
        <LivingTrustLedger onToneChange={handleScrollTone} />
      </div>
    </section>
  );
}

