import gsap from "gsap";

export type HeroMotionRefs = {
  introBrand: HTMLElement;
  introPrompt: HTMLElement;
  header: HTMLElement;
  crack: HTMLElement;
  leftDoor: HTMLElement;
  rightDoor: HTMLElement;
  background: HTMLElement;
  location: HTMLElement;
  titleLines: HTMLElement[];
  subhead: HTMLElement;
  support: HTMLElement;
  dock: HTMLElement;
  pagination: HTMLElement;
};

export function setHeroSettled(r: HeroMotionRefs) {
  gsap.set([r.introBrand, r.introPrompt, r.crack], { autoAlpha: 0 });
  gsap.set([r.header, r.location, r.subhead, r.support, r.dock, r.pagination], { autoAlpha: 1 });
  gsap.set(r.titleLines, { yPercent: 0 });
  gsap.set(r.leftDoor, { xPercent: -82, rotateY: 4 });
  gsap.set(r.rightDoor, { xPercent: 82, rotateY: -4 });
  gsap.set(r.background, { scale: 1.035, filter: "brightness(1) blur(0px)" });
}

export function createHeroIntro(r: HeroMotionRefs) {
  const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

  tl.set([r.introBrand, r.introPrompt, r.header, r.location, r.subhead, r.support, r.dock, r.pagination], { autoAlpha: 0 })
    .set(r.titleLines, { yPercent: 112 })
    .set(r.background, { scale: 1.11, filter: "brightness(.72) blur(2px)" })
    .set(r.crack, { autoAlpha: 0, scaleY: 0.15, transformOrigin: "50% 50%" })
    .fromTo(r.introBrand,
      { autoAlpha: 0, y: 10, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" },
      0.20
    )
    .fromTo(r.introPrompt,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 0.82, y: 0, duration: 0.34, ease: "power2.out" },
      0.35
    )
    .to(r.crack, { autoAlpha: 0.72, scaleY: 1, duration: 0.50, ease: "power2.out" }, 0.58)
    .to([r.introBrand, r.introPrompt], { autoAlpha: 0, y: -6, duration: 0.36, ease: "power2.in" }, 1.08)
    // Tune xPercent against the real repository wrapper width and screenshot captures.
    .to(r.leftDoor, { xPercent: -82, rotateY: 4, duration: 1.12, ease: "power3.inOut" }, 1.08)
    .to(r.rightDoor, { xPercent: 82, rotateY: -4, duration: 1.12, ease: "power3.inOut" }, 1.08)
    .to(r.background, { scale: 1.035, filter: "brightness(1) blur(0px)", duration: 1.12, ease: "power3.inOut" }, 1.08)
    .to(r.crack, { autoAlpha: 0, duration: 0.38, ease: "power2.out" }, 1.25)
    .fromTo(r.header, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.34, ease: "power2.out" }, 2.05)
    .fromTo(r.location, { autoAlpha: 0, x: 14 }, { autoAlpha: 1, x: 0, duration: 0.28, ease: "power2.out" }, 2.22)
    .to(r.titleLines, { yPercent: 0, duration: 0.47, stagger: 0.09, ease: "power3.out" }, 2.35)
    .fromTo(r.subhead, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power2.out" }, 2.62)
    .fromTo(r.support, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out" }, 2.88)
    .fromTo(r.dock, { autoAlpha: 0, y: 28, scale: 0.975 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.47, ease: "power3.out" }, 3.08)
    .to(r.pagination, { autoAlpha: 1, duration: 0.24, ease: "power2.out" }, 3.42);

  return tl;
}
