/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 8: WHY SHREE JAGANNATH HOLIDAYS
 * THE TRUST LEDGER (SECTION 05 OF HOMEPAGE)
 * Master Section Container & Continuous Editorial Controller
 */

import { useState, useRef, useEffect, useCallback } from "react";
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

  // Subtle tonal shift on scroll: #F4EFE6 (intro) -> #F2ECE2 (middle) -> #F5F0E8 (ending)
  const handleScrollTone = useCallback((tone: string) => {
    setCurrentTone(tone);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Subtle background tone shift across section scroll
      ScrollTrigger.create({
        trigger: el,
        start: "top 30%",
        end: "bottom 30%",
        onUpdate: (self) => {
          if (self.progress < 0.35) {
            handleScrollTone("#F4EFE6");
          } else if (self.progress < 0.75) {
            handleScrollTone("#F2ECE2");
          } else {
            handleScrollTone("#F5F0E8");
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, [handleScrollTone]);

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
        {/* Section Intro: 90° Thread-to-Ledger Transition, Sticky Eyebrow & Masked Statement */}
        <TrustLedgerIntro />

        {/* The Living Trust Ledger: One Sticky Architecture with Accumulating Archived Rows + Bridge */}
        <LivingTrustLedger />
      </div>
    </section>
  );
}

