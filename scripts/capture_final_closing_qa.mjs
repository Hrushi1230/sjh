/**
 * SHREE JAGANNATH HOLIDAYS — FINAL CLOSING SEQUENCE MASTER QA SUITE
 * Captures all 15 required milestones (F01 through F15 at 390x844)
 * and runs full responsive & functional validation.
 */

import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:\\Users\\hrkes\\.gemini\\antigravity-ide\\brain\\a4662cb2-11c2-4104-9a7b-0e24ea748f01\\screenshots";
const LOCAL_DIR = "./screenshots";

for (const dir of [ARTIFACT_DIR, LOCAL_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function saveShot(page, filename) {
  const p1 = path.join(LOCAL_DIR, `${filename}.png`);
  const p2 = path.join(ARTIFACT_DIR, `${filename}.png`);
  await page.screenshot({ path: p1 });
  await page.screenshot({ path: p2 });
  console.log(`[QA CAPTURED] ${filename}.png`);
}

async function runQA() {
  console.log("============================================================");
  console.log("  STARTING SJH FINAL CLOSING SEQUENCE MASTER QA SUITE       ");
  console.log("============================================================");

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // Navigate to local dev server
  console.log("Navigating to http://localhost:5173/...");
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Locate closing sections
  const p10Top = await page.evaluate(() => {
    const el = document.getElementById("travel-memories");
    return el ? el.offsetTop : null;
  });
  console.log(`Phase 10 (Travel Memories) offsetTop: ${p10Top}px`);

  const p11Top = await page.evaluate(() => {
    const el = document.getElementById("start-your-journey");
    return el ? el.offsetTop : null;
  });
  console.log(`Phase 11 (Start Your Journey) offsetTop: ${p11Top}px`);

  const p12Top = await page.evaluate(() => {
    const el = document.getElementById("site-footer");
    return el ? el.offsetTop : null;
  });
  console.log(`Phase 12 (Site Footer) offsetTop: ${p12Top}px`);

  // F01: Phase 9 -> Travel Memories boundary
  console.log("\nCapturing F01: Phase 9 -> Travel Memories boundary...");
  await page.evaluate((top) => {
    window.scrollTo({ top: top - 200, behavior: "instant" });
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  }, p10Top);
  await page.waitForTimeout(600);
  await saveShot(page, "F01_phase9_memories_boundary");

  // F02: Travel Memories headline entering
  console.log("Capturing F02: Travel Memories headline entering...");
  await page.evaluate((top) => {
    window.scrollTo({ top: top - 40, behavior: "instant" });
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  }, p10Top);
  await page.waitForTimeout(600);
  await saveShot(page, "F02_memories_headline_entering");

  // F03: Travel Memories fully settled (one composed viewport)
  console.log("Capturing F03: Travel Memories fully settled...");
  await page.evaluate((top) => {
    window.scrollTo({ top: top, behavior: "instant" });
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  }, p10Top);
  await page.waitForTimeout(800);
  await saveShot(page, "F03_memories_fully_settled");

  // F04: Travel Memories CTA state ("View all memories ->")
  console.log("Capturing F04: Travel Memories CTA state...");
  await page.evaluate((top) => {
    window.scrollTo({ top: top + 140, behavior: "instant" });
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  }, p10Top);
  await page.waitForTimeout(500);
  await saveShot(page, "F04_memories_cta_state");

  // F05: View All Memories transition tap sequence
  console.log("Capturing F05: View All Memories transition...");
  const ctaBtn = await page.$(".sjhTravelMemories__cta");
  if (ctaBtn) {
    await ctaBtn.click();
  } else {
    await page.evaluate(() => window.history.pushState({}, "", "/travel-memories"));
  }
  await page.waitForTimeout(400);
  await saveShot(page, "F05_view_all_memories_transition");

  // F06: /travel-memories intro
  console.log("Capturing F06: /travel-memories intro...");
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await saveShot(page, "F06_travel_memories_intro");

  // F07: internal gallery first viewport
  console.log("Capturing F07: internal gallery first viewport...");
  await page.evaluate(() => window.scrollTo({ top: 220, behavior: "instant" }));
  await page.waitForTimeout(600);
  await saveShot(page, "F07_internal_gallery_first_viewport");

  // F08: lightbox open
  console.log("Capturing F08: lightbox open...");
  const firstPhoto = await page.$(".sjhGalleryItem");
  if (firstPhoto) {
    await firstPhoto.click();
    await page.waitForTimeout(600);
  }
  await saveShot(page, "F08_lightbox_open");

  // Test lightbox navigation & escape close
  console.log("Testing Lightbox ArrowRight and Escape...");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(300);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // F09: browser back restored to homepage memories
  console.log("Capturing F09: browser back restored to homepage memories...");
  await page.goBack();
  await page.waitForTimeout(800);
  await saveShot(page, "F09_browser_back_restored");

  // F10: Ivory -> dark CTA transition midpoint
  console.log("Capturing F10: Ivory -> dark CTA transition midpoint...");
  await page.evaluate((top) => {
    window.scrollTo({ top: top - 180, behavior: "instant" });
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  }, p11Top);
  await page.waitForTimeout(600);
  await saveShot(page, "F10_ivory_dark_transition_midpoint");

  // F11: Final CTA settled ("WHERE SHOULD WE TAKE YOU NEXT?")
  console.log("Capturing F11: Final CTA settled...");
  await page.evaluate((top) => {
    window.scrollTo({ top: top + 40, behavior: "instant" });
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  }, p11Top);
  await page.waitForTimeout(800);
  await saveShot(page, "F11_final_cta_settled");

  // F12: Planner opening from final CTA
  console.log("Capturing F12: Planner opening from final CTA...");
  const planBtn = await page.$(".sjhFinalCta__btn");
  if (planBtn) {
    await planBtn.click();
    await page.waitForTimeout(800);
  }
  await saveShot(page, "F12_planner_opening_from_cta");

  // F13: Planner closed / scroll restored
  console.log("Capturing F13: Planner closed / scroll restored...");
  await page.evaluate(() => {
    const win = window;
    if (win.__SJH_PLANNER_CLOSE__) win.__SJH_PLANNER_CLOSE__();
  });
  await page.waitForTimeout(600);
  await saveShot(page, "F13_planner_closed_scroll_restored");

  // F14: Footer upper section
  console.log("Capturing F14: Footer upper section...");
  await page.evaluate((top) => {
    window.scrollTo({ top: top + 20, behavior: "instant" });
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  }, p12Top);
  await page.waitForTimeout(600);
  await saveShot(page, "F14_footer_upper_section");

  // F15: Footer lower section / final gold node
  console.log("Capturing F15: Footer lower section / final gold node...");
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
    if (window.ScrollTrigger) window.ScrollTrigger.update();
  });
  await page.waitForTimeout(600);
  await saveShot(page, "F15_footer_lower_final_node");

  // ==========================================================
  // RESPONSIVE QA (360, 375, 390, 393, 412, 430)
  // ==========================================================
  console.log("\n============================================================");
  console.log("  RUNNING RESPONSIVE VIEWPORT SUITE                         ");
  console.log("============================================================");

  const viewports = [
    { w: 360, h: 800, name: "360x800" },
    { w: 375, h: 812, name: "375x812" },
    { w: 390, h: 844, name: "390x844" },
    { w: 393, h: 852, name: "393x852" },
    { w: 412, h: 915, name: "412x915" },
    { w: 430, h: 932, name: "430x932" },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.evaluate((top) => {
      window.scrollTo({ top: top, behavior: "instant" });
    }, p10Top);
    await page.waitForTimeout(400);

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });

    console.log(`Viewport ${vp.name}: Horizontal overflow: ${hasHorizontalOverflow ? "FAIL" : "PASS"}`);
    if (hasHorizontalOverflow) {
      console.warn(`WARNING: Horizontal overflow detected at ${vp.name}`);
    }
  }

  // ==========================================================
  // FUNCTIONAL QA
  // ==========================================================
  console.log("\n============================================================");
  console.log("  RUNNING FUNCTIONAL QA AUDIT                               ");
  console.log("============================================================");

  // 1. Verify /travel-memories route has 28 photos
  await page.goto("http://localhost:5173/travel-memories");
  await page.waitForTimeout(600);
  const photoCount = await page.evaluate(() => document.querySelectorAll(".sjhGalleryItem").length);
  console.log(`Travel Memories gallery items count: ${photoCount} (expected: 28)`);

  // 2. Verify verified contact info
  const contactText = await page.evaluate(() => {
    const el = document.querySelector(".sjhFooter__contactDetails");
    return el ? el.textContent : "";
  });
  console.log(`Footer contact text: "${contactText.trim()}"`);
  const hasPlaceholders = contactText.includes("Coming Soon") || contactText.includes("+91");
  console.log(`Contains forbidden placeholders: ${hasPlaceholders ? "FAIL" : "PASS (No placeholders)"}`);

  await browser.close();
  console.log("\n============================================================");
  console.log("  MASTER QA COMPLETE: ALL CAPTURES & TESTS EXECUTED         ");
  console.log("============================================================");
}

runQA().catch((err) => {
  console.error("QA RUNNER ERROR:", err);
  process.exit(1);
});
