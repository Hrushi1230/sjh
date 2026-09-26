import gsap from "gsap";
import { Direction } from "./heroData";
import { SJH_EASE, SJH_DURATION } from "../../constants/motionTokens";

export interface PortalElements {
  root: HTMLElement;
  baseImg: HTMLElement;
  portalWrap: HTMLElement;
  portalImg: HTMLElement;
  portalRing: HTMLElement;
  portalCue?: HTMLElement | null;
  copyContainer: HTMLElement;
  locationText: HTMLElement;
  titleLine1: HTMLElement;
  titleLine2: HTMLElement;
  subhead?: HTMLElement | null;
  support: HTMLElement;
  dock: HTMLElement;
}

export interface PortalGeometry {
  portalX: number;
  portalY: number;
  portalR: number;
  maxRadius: number;
  ringOpacity: number;
  cueOpacity: number;
  baseScale: number;
  baseBrightness: number;
  baseSaturate: number;
  baseBlur: number;
  portalScale: number;
  copyOpacity: number;
  dockOpacity: number;
  dockScale: number;
}

function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * Computes non-linear portal geometry, center magnetism, and reactive world styles.
 * Supports absolute 4-directional portal behavior (North, East, South, West).
 */
export function calculatePortalGeometry(
  progress: number,
  pointerX: number,
  pointerY: number,
  viewportWidth: number,
  viewportHeight: number,
  direction: Direction = "north"
): PortalGeometry {
  // Clamped pointer coordinates: 18%-82% width, 20%-78% height
  const clampedX = Math.max(viewportWidth * 0.18, Math.min(viewportWidth * 0.82, pointerX));
  const clampedY = Math.max(viewportHeight * 0.20, Math.min(viewportHeight * 0.78, pointerY));

  // Restrained Directional Bias
  let biasX = 0;
  let biasY = 0;
  if (direction === "north") biasY = -26;
  else if (direction === "south") biasY = 26;
  else if (direction === "west") biasX = -26;
  else if (direction === "east") biasX = 26;

  // Center magnetism:
  // At small radius: portal follows pointer + directional bias.
  // As progress grows (0.25 to 0.75): portal center smoothly migrates toward hero composition center.
  const magnet = smoothstep(0.25, 0.75, progress);
  const biasedPointerX = clampedX + biasX * (1 - magnet);
  const biasedPointerY = clampedY + biasY * (1 - magnet);

  const compCenterX = viewportWidth * 0.50;
  const compCenterY = viewportHeight * 0.50;

  const portalX = biasedPointerX + (compCenterX - biasedPointerX) * magnet;
  const portalY = biasedPointerY + (compCenterY - biasedPointerY) * magnet;

  // Exact fullscreen coverage calculation to farthest viewport corner
  const dTL = Math.hypot(portalX, portalY);
  const dTR = Math.hypot(viewportWidth - portalX, portalY);
  const dBL = Math.hypot(portalX, viewportHeight - portalY);
  const dBR = Math.hypot(viewportWidth - portalX, viewportHeight - portalY);
  const maxRadius = Math.max(dTL, dTR, dBL, dBR) * 1.04;

  // Non-linear radius curve
  let portalR = 0;
  if (progress >= 0.10) {
    const t = Math.min(1, Math.max(0, (progress - 0.10) / 0.90));
    portalR = 36 + (maxRadius - 36) * (0.80 * Math.pow(t, 1.6) + 0.20 * Math.pow(t, 2.8));
  }

  // Portal edge ring opacity
  let ringOpacity = 0;
  if (portalR > 0) {
    if (progress <= 0.35) {
      ringOpacity = 0.85;
    } else {
      ringOpacity = Math.max(0, 0.85 * (1 - (progress - 0.35) / 0.40));
    }
  }

  // Directional micro-cue opacity
  let cueOpacity = 0;
  if (progress >= 0.10 && progress <= 0.42) {
    cueOpacity = Math.max(0, 1 - (progress - 0.18) / 0.22);
  }

  // Base world response (composite-friendly transforms, avoid expensive filter thrash)
  const baseScale = 1.035 + 0.015 * progress;
  const baseBrightness = Math.max(0.85, 1 - 0.15 * progress);
  const baseSaturate = 1;
  const baseBlur = 0;

  // Incoming world response: begins slightly zoomed ~1.055, settles toward 1.035
  const portalScale = 1.055 - 0.02 * progress;

  // Copy response: 0–25% intact, 25–50% fades down
  let copyOpacity = 1;
  if (progress >= 0.25) {
    copyOpacity = Math.max(0, 1 - (progress - 0.25) / 0.25);
  }

  // Journey Dock response: subtle dip
  const dockDip = Math.sin(progress * Math.PI);
  const dockOpacity = 1 - 0.16 * dockDip;
  const dockScale = 1 - 0.015 * dockDip;

  return {
    portalX,
    portalY,
    portalR,
    maxRadius,
    ringOpacity,
    cueOpacity,
    baseScale,
    baseBrightness,
    baseSaturate,
    baseBlur,
    portalScale,
    copyOpacity,
    dockOpacity,
    dockScale,
  };
}

/**
 * Directly writes calculated geometry to DOM elements for 60fps drag performance.
 * Uses GPU-accelerated transforms and avoids filter layout thrashing.
 */
export function applyPortalStyles(elements: PortalElements, geo: PortalGeometry) {
  const { root, baseImg, portalWrap, portalRing, portalCue, copyContainer, dock } = elements;

  // CSS variables for circular clip-path
  root.style.setProperty("--portal-x", `${geo.portalX.toFixed(1)}px`);
  root.style.setProperty("--portal-y", `${geo.portalY.toFixed(1)}px`);
  root.style.setProperty("--portal-r", `${geo.portalR.toFixed(1)}px`);
  root.style.setProperty("--portal-scale", `${geo.portalScale.toFixed(3)}`);
  root.style.setProperty("--portal-ring-opacity", `${geo.ringOpacity.toFixed(2)}`);

  // Base world transform (GPU composite)
  baseImg.style.transform = `scale(${geo.baseScale.toFixed(3)})`;

  // Portal visibility
  if (geo.portalR > 0) {
    portalWrap.classList.add("is-active");
    portalRing.classList.add("is-active");
  } else {
    portalWrap.classList.remove("is-active");
    portalRing.classList.remove("is-active");
  }

  // Micro-cue positioning & opacity
  if (portalCue) {
    portalCue.style.left = `${geo.portalX.toFixed(1)}px`;
    portalCue.style.top = `${geo.portalY.toFixed(1)}px`;
    portalCue.style.opacity = `${geo.cueOpacity.toFixed(2)}`;
    if (geo.cueOpacity > 0.01) {
      portalCue.classList.add("is-active");
    } else {
      portalCue.classList.remove("is-active");
    }
  }

  // UI reactions
  copyContainer.style.opacity = `${geo.copyOpacity.toFixed(2)}`;
  dock.style.opacity = `${geo.dockOpacity.toFixed(2)}`;
  dock.style.transform = `scale(${geo.dockScale.toFixed(3)})`;
}

/**
 * Resets all temporary gesture and portal styles to the settled baseline.
 */
export function resetPortalStyles(elements: PortalElements) {
  const { root, baseImg, portalWrap, portalRing, portalCue, copyContainer, dock } = elements;

  root.style.removeProperty("--portal-x");
  root.style.removeProperty("--portal-y");
  root.style.removeProperty("--portal-r");
  root.style.removeProperty("--portal-scale");
  root.style.removeProperty("--portal-ring-opacity");

  baseImg.style.transform = "scale(1.035)";
  baseImg.style.filter = "brightness(1) saturate(1) blur(0px)";

  portalWrap.classList.remove("is-active");
  portalRing.classList.remove("is-active");
  if (portalCue) {
    portalCue.classList.remove("is-active");
    portalCue.style.opacity = "0";
  }

  copyContainer.style.opacity = "1";
  copyContainer.style.visibility = "visible";
  dock.style.opacity = "1";
  dock.style.visibility = "visible";
  dock.style.transform = "scale(1)";
}

/**
 * Animates full commitment of portal expansion (~450–600ms, power3.inOut) to cover entire viewport.
 */
export function animatePortalCommit(
  elements: PortalElements,
  startGeo: PortalGeometry,
  onComplete: () => void
) {
  const { root, baseImg, portalCue, copyContainer, dock } = elements;

  const anim = {
    r: startGeo.portalR,
    portalScale: startGeo.portalScale,
    ringOpacity: startGeo.ringOpacity,
    cueOpacity: startGeo.cueOpacity,
    baseScale: startGeo.baseScale,
    copyOpacity: startGeo.copyOpacity,
  };

  gsap.to(anim, {
    r: startGeo.maxRadius,
    portalScale: 1.035,
    ringOpacity: 0,
    cueOpacity: 0,
    baseScale: 1.055,
    copyOpacity: 0,
    duration: SJH_DURATION.transition * 0.75, // ~560ms
    ease: SJH_EASE.portal,
    onUpdate: () => {
      root.style.setProperty("--portal-r", `${anim.r.toFixed(1)}px`);
      root.style.setProperty("--portal-scale", `${anim.portalScale.toFixed(3)}`);
      root.style.setProperty("--portal-ring-opacity", `${anim.ringOpacity.toFixed(2)}`);
      baseImg.style.transform = `scale(${anim.baseScale.toFixed(3)})`;
      copyContainer.style.opacity = `${anim.copyOpacity.toFixed(2)}`;
      if (portalCue) {
        portalCue.style.opacity = `${anim.cueOpacity.toFixed(2)}`;
      }
    },
    onComplete: () => {
      gsap.to(dock, { opacity: 1, scale: 1, duration: SJH_DURATION.control, ease: SJH_EASE.settle });
      onComplete();
    },
  });
}

/**
 * Smoothly cancels uncommitted portal drag, contracting circle back to 0 (~340ms, power3.out).
 */
export function animatePortalCancel(
  elements: PortalElements,
  startGeo: PortalGeometry,
  onComplete: () => void
) {
  const { root, baseImg, portalCue, copyContainer, dock } = elements;

  const anim = {
    r: startGeo.portalR,
    ringOpacity: startGeo.ringOpacity,
    cueOpacity: startGeo.cueOpacity,
    baseScale: startGeo.baseScale,
    copyOpacity: startGeo.copyOpacity,
    dockOpacity: startGeo.dockOpacity,
    dockScale: startGeo.dockScale,
  };

  gsap.to(anim, {
    r: 0,
    ringOpacity: 0,
    cueOpacity: 0,
    baseScale: 1.035,
    copyOpacity: 1,
    dockOpacity: 1,
    dockScale: 1,
    duration: 0.36,
    ease: SJH_EASE.settle,
    onUpdate: () => {
      root.style.setProperty("--portal-r", `${anim.r.toFixed(1)}px`);
      root.style.setProperty("--portal-ring-opacity", `${anim.ringOpacity.toFixed(2)}`);
      baseImg.style.transform = `scale(${anim.baseScale.toFixed(3)})`;
      copyContainer.style.opacity = `${anim.copyOpacity.toFixed(2)}`;
      dock.style.opacity = `${anim.dockOpacity.toFixed(2)}`;
      dock.style.transform = `scale(${anim.dockScale.toFixed(3)})`;
      if (portalCue) {
        portalCue.style.opacity = `${anim.cueOpacity.toFixed(2)}`;
      }
    },
    onComplete: () => {
      resetPortalStyles(elements);
      onComplete();
    },
  });
}

/**
 * Calm, elegant Hero Destination Autoplay Transition (~1.15s–1.25s).
 * Current destination subtle scale 1 -> .99
 * Incoming portal expands smoothly from composition center
 * Incoming image becomes dominant, old image releases cleanly
 * Typography settles with subtle fade
 */
export function animatePortalAutoplay(
  elements: PortalElements,
  viewportWidth: number,
  viewportHeight: number,
  onMidpoint: () => void,
  onComplete: () => void
): gsap.core.Timeline {
  const { root, baseImg, portalWrap, portalRing, copyContainer, dock } = elements;

  const compCenterX = viewportWidth * 0.5;
  const compCenterY = viewportHeight * 0.5;
  const maxRadius = Math.hypot(compCenterX, compCenterY) * 1.06;

  root.style.setProperty("--portal-x", `${compCenterX.toFixed(1)}px`);
  root.style.setProperty("--portal-y", `${compCenterY.toFixed(1)}px`);
  root.style.setProperty("--portal-r", "0px");
  root.style.setProperty("--portal-scale", "1.06");
  root.style.setProperty("--portal-ring-opacity", "0.65");

  portalWrap.classList.add("is-active");
  portalRing.classList.add("is-active");

  const anim = {
    r: 0,
    portalScale: 1.06,
    ringOpacity: 0.65,
    baseScale: 1.035,
    copyOpacity: 1,
  };

  let midpointCalled = false;

  const tl = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => {
      resetPortalStyles(elements);
      onComplete();
    },
  });

  tl.to(copyContainer, {
    opacity: 0,
    y: -8,
    duration: 0.35,
    ease: SJH_EASE.exit,
  }, 0);

  tl.to(dock, {
    opacity: 0.88,
    scale: 0.985,
    duration: 0.40,
    ease: SJH_EASE.micro,
  }, 0);

  tl.to(anim, {
    r: maxRadius,
    portalScale: 1.035,
    ringOpacity: 0,
    baseScale: 0.995,
    duration: SJH_DURATION.cinematic, // ~1.20s
    ease: SJH_EASE.cinematic,
    onUpdate: () => {
      root.style.setProperty("--portal-r", `${anim.r.toFixed(1)}px`);
      root.style.setProperty("--portal-scale", `${anim.portalScale.toFixed(3)}`);
      root.style.setProperty("--portal-ring-opacity", `${anim.ringOpacity.toFixed(2)}`);
      baseImg.style.transform = `scale(${anim.baseScale.toFixed(3)})`;

      // Trigger base swap at ~70% expansion when incoming world dominates
      if (!midpointCalled && anim.r > maxRadius * 0.70) {
        midpointCalled = true;
        onMidpoint();
      }
    },
  }, 0.15);

  tl.to(dock, {
    opacity: 1,
    scale: 1,
    duration: 0.35,
    ease: SJH_EASE.settle,
  }, "-=0.35");

  return tl;
}

/**
 * Editorial masked typography reveal for first arrival or manual compass / swipe commit (~450ms–600ms).
 */
export function animateCopyReveal(
  elements: {
    location: HTMLElement;
    title1: HTMLElement;
    title2: HTMLElement;
    subhead?: HTMLElement | null;
    support: HTMLElement;
  },
  onComplete?: () => void
) {
  const tl = gsap.timeline({
    onComplete: () => {
      onComplete?.();
    },
  });

  tl.fromTo(
    elements.location,
    { autoAlpha: 0, x: 12 },
    { autoAlpha: 1, x: 0, duration: 0.28, ease: SJH_EASE.reveal },
    0
  )
    .fromTo(
      elements.title1,
      { yPercent: 112, y: 0 },
      { yPercent: 0, y: 0, duration: 0.44, ease: SJH_EASE.settle },
      0.08
    )
    .fromTo(
      elements.title2,
      { yPercent: 112, y: 0 },
      { yPercent: 0, y: 0, duration: 0.44, ease: SJH_EASE.settle },
      0.18
    );

  if (elements.subhead) {
    tl.fromTo(
      elements.subhead,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.34, ease: SJH_EASE.reveal },
      0.26
    );
  }

  tl.fromTo(
    elements.support,
    { autoAlpha: 0, y: 8 },
    { autoAlpha: 1, y: 0, duration: 0.32, ease: SJH_EASE.reveal },
    0.32
  );

  return tl;
}

/**
 * Calm typography crossfade for autoplay destination transitions.
 * Avoids replaying dramatic theatrical letter reveals every 7.5s.
 */
export function animateCopyCrossfade(
  elements: {
    location: HTMLElement;
    title1: HTMLElement;
    title2: HTMLElement;
    subhead?: HTMLElement | null;
    support: HTMLElement;
  },
  onComplete?: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline({
    onComplete: () => {
      onComplete?.();
    },
  });

  const targets = [
    elements.location,
    elements.title1,
    elements.title2,
    elements.subhead,
    elements.support,
  ].filter(Boolean) as HTMLElement[];

  tl.fromTo(
    targets,
    { autoAlpha: 0, y: 8 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.38,
      stagger: 0.04,
      ease: SJH_EASE.reveal,
    }
  );

  return tl;
}
