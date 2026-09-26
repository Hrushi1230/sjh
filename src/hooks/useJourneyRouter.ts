/**
 * SHREE JAGANNATH HOLIDAYS — JOURNEY ROUTER HOOK
 * Progressive Enhancement Routing with View Transition API and Scroll Restoration.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { JourneyId, getJourneyById } from "../data/journeys";

export function useJourneyRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname || "/";
    }
    return "/";
  });

  const homeScrollPosRef = useRef<number>(0);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname || "/";
      const savedScroll = parseInt(sessionStorage.getItem("sjh_home_scroll") || "0", 10);

      if (newPath === "/" || newPath === "") {
        if (typeof document !== "undefined" && "startViewTransition" in document) {
          (document as any).startViewTransition(() => {
            setCurrentPath(newPath);
          }).finished.then(() => {
            window.scrollTo(0, savedScroll);
            if ((window as any).ScrollTrigger) (window as any).ScrollTrigger.refresh();
          });
        } else {
          setCurrentPath(newPath);
          setTimeout(() => {
            window.scrollTo(0, savedScroll);
            if ((window as any).ScrollTrigger) (window as any).ScrollTrigger.refresh();
          }, 30);
        }
      } else {
        setCurrentPath(newPath);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Navigate to Journey Detail with Shared Element Transition
  const navigateToJourney = useCallback(
    (journeyId: string, href: string, originDestination?: string) => {
      // 1. Record current homepage scroll position
      const scrollY = window.scrollY;
      homeScrollPosRef.current = scrollY;
      sessionStorage.setItem("sjh_home_scroll", scrollY.toString());

      // 2. Locate origin image for shared element transition
      let originImg: HTMLElement | null = null;
      if (originDestination) {
        originImg = document.querySelector(
          `[data-destination="${originDestination}"] .sjhChapter__mediaImg`
        );
        if (!originImg && originDestination === "puri") {
          originImg = document.querySelector(".sjhHero__cardStage img, .sjhHero__destBase");
        }
      }
      if (!originImg) {
        originImg = document.querySelector(".sjhChapter__mediaImg, .sjhHero__cardStage img");
      }

      if (originImg) {
        originImg.style.viewTransitionName = "journey-hero-media";
      }

      // 3. Execute navigation with View Transition API or fallback
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        const transition = (document as any).startViewTransition(() => {
          window.history.pushState({ journeyId, fromHome: true }, "", href);
          setCurrentPath(href);
        });

        transition.finished.finally(() => {
          if (originImg) {
            originImg.style.viewTransitionName = "";
          }
        });
      } else {
        window.history.pushState({ journeyId, fromHome: true }, "", href);
        setCurrentPath(href);
        if (originImg) {
          originImg.style.viewTransitionName = "";
        }
      }
    },
    []
  );

  // Navigate back to Homepage with Reverse Transition and Scroll Restoration
  const navigateHome = useCallback(() => {
    const savedScroll = parseInt(
      sessionStorage.getItem("sjh_home_scroll") || homeScrollPosRef.current.toString() || "0",
      10
    );

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      const transition = (document as any).startViewTransition(() => {
        window.history.pushState({}, "", "/");
        setCurrentPath("/");
      });

      transition.finished.then(() => {
        window.scrollTo(0, savedScroll);
        if ((window as any).ScrollTrigger) {
          (window as any).ScrollTrigger.refresh();
        }
      });
    } else {
      window.history.pushState({}, "", "/");
      setCurrentPath("/");
      setTimeout(() => {
        window.scrollTo(0, savedScroll);
        if ((window as any).ScrollTrigger) {
          (window as any).ScrollTrigger.refresh();
        }
      }, 30);
    }
  }, []);

  // Determine current active journey if on a journey route
  const activeJourney = (() => {
    if (currentPath.startsWith("/journeys/")) {
      const slug = currentPath.replace("/journeys/", "").split("?")[0].split("#")[0];
      return getJourneyById(slug as JourneyId);
    }
    return undefined;
  })();

  return {
    currentPath,
    activeJourney,
    navigateToJourney,
    navigateToMemories: () => {
      // 1. Record current homepage scroll position
      const scrollY = window.scrollY;
      homeScrollPosRef.current = scrollY;
      sessionStorage.setItem("sjh_home_scroll", scrollY.toString());

      // 2. Shared element transition source
      const originImg = document.querySelector(".sjhMosaicImg--dominant, .sjhMosaicItem--a img") as HTMLElement | null;
      if (originImg) {
        originImg.style.viewTransitionName = "sjh-shared-memory-hero";
      }

      // 3. Execute navigation
      if (typeof document !== "undefined" && "startViewTransition" in document) {
        const transition = (document as any).startViewTransition(() => {
          window.history.pushState({ route: "travel-memories", fromHome: true }, "", "/travel-memories");
          setCurrentPath("/travel-memories");
        });

        transition.finished.finally(() => {
          if (originImg) {
            originImg.style.viewTransitionName = "";
          }
        });
      } else {
        window.history.pushState({ route: "travel-memories", fromHome: true }, "", "/travel-memories");
        setCurrentPath("/travel-memories");
        if (originImg) {
          originImg.style.viewTransitionName = "";
        }
      }
    },
    navigateHome,
    isTravelMemories: currentPath === "/travel-memories",
  };
}
