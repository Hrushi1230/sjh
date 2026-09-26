import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { heroCopy } from "./heroData";
import { createHeroIntro, setHeroSettled } from "./heroMotion";
import "./hero.css";

type Props = {
  onOpenMenu: () => void;
  onPlanJourney: () => void;
  menuExpanded?: boolean;
  homeHref?: string;
  assetBase?: string;
};

export function MobileCinematicHero({
  onOpenMenu,
  onPlanJourney,
  menuExpanded = false,
  homeHref = "/",
  assetBase = "/assets/sjh-hero",
}: Props) {
  const root = useRef<HTMLElement>(null);
  const introBrand = useRef<HTMLImageElement>(null);
  const introPrompt = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const crack = useRef<HTMLDivElement>(null);
  const leftDoor = useRef<HTMLDivElement>(null);
  const rightDoor = useRef<HTMLDivElement>(null);
  const background = useRef<HTMLImageElement>(null);
  const location = useRef<HTMLDivElement>(null);
  const title1 = useRef<HTMLSpanElement>(null);
  const title2 = useRef<HTMLSpanElement>(null);
  const subhead = useRef<HTMLDivElement>(null);
  const support = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLButtonElement>(null);
  const pagination = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timeline: gsap.core.Timeline | undefined;

    const ctx = gsap.context(() => {
      const refs = {
        introBrand: introBrand.current,
        introPrompt: introPrompt.current,
        header: header.current,
        crack: crack.current,
        leftDoor: leftDoor.current,
        rightDoor: rightDoor.current,
        background: background.current,
        location: location.current,
        titleLines: [title1.current, title2.current],
        subhead: subhead.current,
        support: support.current,
        dock: dock.current,
        pagination: pagination.current,
      };

      const required = [
        refs.introBrand, refs.introPrompt, refs.header, refs.crack,
        refs.leftDoor, refs.rightDoor, refs.background, refs.location,
        refs.titleLines[0], refs.titleLines[1], refs.subhead, refs.support,
        refs.dock, refs.pagination,
      ];
      if (required.some((node) => !node)) return;

      const motionRefs = {
        introBrand: refs.introBrand!,
        introPrompt: refs.introPrompt!,
        header: refs.header!,
        crack: refs.crack!,
        leftDoor: refs.leftDoor!,
        rightDoor: refs.rightDoor!,
        background: refs.background!,
        location: refs.location!,
        titleLines: [refs.titleLines[0]!, refs.titleLines[1]!],
        subhead: refs.subhead!,
        support: refs.support!,
        dock: refs.dock!,
        pagination: refs.pagination!,
      };

      if (reduceMotion) {
        setHeroSettled(motionRefs);
        return;
      }

      timeline = createHeroIntro(motionRefs);
    }, root);

    return () => {
      timeline?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="sjhHero" aria-label="Puri journeys">
      <img ref={background} className="sjhHero__bg" src={`${assetBase}/hero-puri.webp`} alt="" aria-hidden="true" />
      <div className="sjhHero__shade" aria-hidden="true" />

      <div ref={crack} className="sjhHero__crack" aria-hidden="true">
        <img src={`${assetBase}/light-crack.png`} alt="" />
      </div>

      <div className="sjhHero__doors" aria-hidden="true">
        <div ref={leftDoor} className="sjhHero__doorWrap sjhHero__doorWrap--left">
          <img className="sjhHero__door sjhHero__door--left" src={`${assetBase}/door-left.png`} alt="" />
        </div>
        <div ref={rightDoor} className="sjhHero__doorWrap sjhHero__doorWrap--right">
          <img className="sjhHero__door sjhHero__door--right" src={`${assetBase}/door-right.png`} alt="" />
        </div>
      </div>

      <div className="sjhHero__ui">
        <div className="sjhHero__intro" aria-hidden="true">
          <img ref={introBrand} className="sjhHero__introBrand" src={`${assetBase}/sjh-logo.svg`} alt="" />
          <div ref={introPrompt} className="sjhHero__introPrompt">
            <span className="sjhHero__introLine" />
            <span>{heroCopy.introPrompt}</span>
          </div>
        </div>

        <header ref={header} className="sjhHero__header">
          <a className="sjhHero__home" href={homeHref} aria-label="Shree Jagannath Holidays — Home">
            <img className="sjhHero__logo" src={`${assetBase}/sjh-logo.svg`} alt="" />
          </a>
          <button
            className="sjhHero__menu"
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            aria-expanded={menuExpanded}
          >
            <img src={`${assetBase}/menu.svg`} alt="" />
          </button>
        </header>

        <div className="sjhHero__copy">
          <div ref={location} className="sjhHero__location">{heroCopy.location}</div>

          <div className="sjhHero__title" aria-label="Journeys of faith">
            <div className="sjhHero__mask"><span ref={title1}>{heroCopy.title1}</span></div>
            <div className="sjhHero__mask">
              <span ref={title2}>{heroCopy.title2Prefix}<span className="sjhHero__accent">{heroCopy.title2Accent}</span></span>
            </div>
          </div>

          <div ref={subhead} className="sjhHero__sub">
            <div>{heroCopy.sub1}</div>
            <div>{heroCopy.sub2}</div>
          </div>

          <div ref={support} className="sjhHero__support">
            <div className="sjhHero__rule" />
            <div>{heroCopy.support1}</div>
            <div>{heroCopy.support2}</div>
          </div>
        </div>

        <button ref={dock} type="button" className="sjhHero__dock" onClick={onPlanJourney} aria-label="Plan your journey">
          <span className="sjhHero__dockIcon"><img src={`${assetBase}/compass.svg`} alt="" /></span>
          <span className="sjhHero__dockLabel">{heroCopy.dock}</span>
          <span className="sjhHero__dockAction"><img src={`${assetBase}/arrow-right.svg`} alt="" /></span>
        </button>

        <div ref={pagination} className="sjhHero__pagination" aria-hidden="true">
          <div className="sjhHero__progress">
            <span className="is-active" /><span /><span /><span /><span />
          </div>
          <span className="sjhHero__pageCount">{heroCopy.pagination}</span>
        </div>
      </div>
    </section>
  );
}
