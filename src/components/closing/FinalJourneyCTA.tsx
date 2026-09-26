import React, { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SJH_EASE } from "../../constants/motionTokens";

gsap.registerPlugin(ScrollTrigger);

interface FinalJourneyCTAProps {
  onOpenPlanner: () => void;
}

export const FinalJourneyCTA: React.FC<FinalJourneyCTAProps> = ({ onOpenPlanner }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLSpanElement>(null);
  const title2Ref = useRef<HTMLSpanElement>(null);
  const title3Ref = useRef<HTMLSpanElement>(null);
  const title4Ref = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPressed, setIsPressed] = useState(false);

  // GSAP animation on scroll approach
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(
        [
          lineRef.current,
          nodeRef.current,
          eyebrowRef.current,
          title1Ref.current,
          title2Ref.current,
          title3Ref.current,
          title4Ref.current,
          copyRef.current,
          buttonRef.current,
        ],
        { opacity: 1, y: 0, scaleY: 1, scale: 1, clearProps: "all" }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(nodeRef.current, { scale: 0, opacity: 0 });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 8 });
      gsap.set(
        [title1Ref.current, title2Ref.current, title3Ref.current, title4Ref.current],
        { yPercent: 105, opacity: 0 }
      );
      gsap.set(copyRef.current, { opacity: 0, y: 8 });
      gsap.set(buttonRef.current, { opacity: 0, scale: 0.98 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      });

      // 1. Vertical Antique Gold journey line descends
      tl.to(lineRef.current, {
        scaleY: 1,
        duration: 0.7,
        ease: "power2.inOut",
      }, 0);

      // 2. Node blooms at arrival point
      tl.to(nodeRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: SJH_EASE.settle,
      }, 0.45);

      // 3. Eyebrow appears
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, 0.25);

      // 4. Headline lines reveal sequentially
      tl.to(
        [title1Ref.current, title2Ref.current, title3Ref.current, title4Ref.current],
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.35
      );

      // 5. Supporting copy enters
      tl.to(copyRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, 0.6);

      // 6. CTA Button appears
      tl.to(buttonRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "power2.out",
      }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  const handleClick = useCallback(() => {
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
      const win = window as any;
      if (win.__SJH_PLANNER_SET_FIELD__) {
        win.__SJH_PLANNER_SET_FIELD__("source", "final-home-cta");
      }
      onOpenPlanner();
    }, 90);
  }, [onOpenPlanner]);

  return (
    <section
      id="start-your-journey"
      data-section="phase11"
      ref={sectionRef}
      className="sjhFinalCta"
      aria-label="Phase 11: Start Your Journey Final Conversion"
    >
      {/* Warm Ivory to Temple Black gradual gradient transition boundary */}
      <div className="sjhFinalCta__boundaryTransition" aria-hidden="true" />

      {/* Atmospheric subtle texture/undertone */}
      <div className="sjhFinalCta__bgGlow" aria-hidden="true" />

      <div className="sjhFinalCta__container">
        {/* Top 15-20%: Thin antique-gold journey vertical line with node */}
        <div className="sjhFinalCta__lineTrack" aria-hidden="true">
          <div ref={lineRef} className="sjhFinalCta__goldLine" />
          <div ref={nodeRef} className="sjhFinalCta__journeyNode">●</div>
        </div>

        {/* Eyebrow */}
        <div ref={eyebrowRef} className="sjhFinalCta__eyebrow">
          START YOUR JOURNEY
        </div>

        {/* Middle 40-45%: Grand Editorial Serif Headline */}
        <h2 className="sjhFinalCta__title">
          <span className="sjhFinalCta__lineMask">
            <span ref={title1Ref} className="sjhFinalCta__line">WHERE</span>
          </span>
          <span className="sjhFinalCta__lineMask">
            <span ref={title2Ref} className="sjhFinalCta__line">SHOULD WE</span>
          </span>
          <span className="sjhFinalCta__lineMask">
            <span ref={title3Ref} className="sjhFinalCta__line">TAKE YOU</span>
          </span>
          <span className="sjhFinalCta__lineMask">
            <span ref={title4Ref} className="sjhFinalCta__line sjhFinalCta__line--gold">NEXT?</span>
          </span>
        </h2>

        {/* Lower-Middle 15-20%: Support Copy + CTA */}
        <div className="sjhFinalCta__actionWrap">
          <p ref={copyRef} className="sjhFinalCta__copy">
            Every journey begins with a conversation.
          </p>

          <button
            ref={buttonRef}
            type="button"
            onClick={handleClick}
            className={`sjhFinalCta__btn ${isPressed ? "sjhFinalCta__btn--pressed" : ""}`}
            aria-label="Plan my journey — open personal journey planner"
          >
            <span className="sjhFinalCta__btnLabel">PLAN MY JOURNEY</span>
            <span className="sjhFinalCta__btnArrow" aria-hidden="true">→</span>
          </button>
        </div>

        {/* Bottom route handoff into footer */}
        <div className="sjhFinalCta__handoff" aria-hidden="true">
          <div className="sjhFinalCta__handoffLine" />
          <div className="sjhFinalCta__handoffNode">●</div>
          <div className="sjhFinalCta__handoffLine" />
        </div>
      </div>
    </section>
  );
};
