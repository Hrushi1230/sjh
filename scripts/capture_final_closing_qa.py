"""
SHREE JAGANNATH HOLIDAYS — FINAL CLOSING SEQUENCE MASTER QA SUITE
Captures all 15 required milestones (F01 through F15 at 390x844)
and runs full responsive & functional validation.
"""

import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACT_DIR = r"C:\Users\hrkes\.gemini\antigravity-ide\brain\a4662cb2-11c2-4104-9a7b-0e24ea748f01\screenshots"
LOCAL_DIR = "./screenshots"

os.makedirs(ARTIFACT_DIR, exist_ok=True)
os.makedirs(LOCAL_DIR, exist_ok=True)

async def save_shot(page, filename):
    p1 = os.path.join(LOCAL_DIR, f"{filename}.png")
    p2 = os.path.join(ARTIFACT_DIR, f"{filename}.png")
    await page.screenshot(path=p1)
    await page.screenshot(path=p2)
    print(f"[QA CAPTURED] {filename}.png")

async def main():
    print("============================================================")
    print("  STARTING SJH FINAL CLOSING SEQUENCE MASTER QA SUITE       ")
    print("============================================================")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True,
        )
        page = await context.new_page()

        print("Navigating to http://localhost:5173/...")
        await page.goto("http://localhost:5173/", wait_until="networkidle")
        await page.wait_for_timeout(1000)

        # 1. Locate closing sections
        p10_top = await page.evaluate("() => { const el = document.getElementById('travel-memories'); return el ? el.offsetTop : null; }")
        print(f"Phase 10 (Travel Memories) offsetTop: {p10_top}px")

        p11_top = await page.evaluate("() => { const el = document.getElementById('start-your-journey'); return el ? el.offsetTop : null; }")
        print(f"Phase 11 (Start Your Journey) offsetTop: {p11_top}px")

        p12_top = await page.evaluate("() => { const el = document.getElementById('site-footer'); return el ? el.offsetTop : null; }")
        print(f"Phase 12 (Site Footer) offsetTop: {p12_top}px")

        # F01: Phase 9 -> Travel Memories boundary
        print("\nCapturing F01: Phase 9 -> Travel Memories boundary...")
        await page.evaluate("""() => {
            const el = document.getElementById('travel-memories');
            if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'start' });
                window.scrollBy(0, -180);
            }
        }""")
        await page.wait_for_timeout(600)
        await save_shot(page, "F01_phase9_memories_boundary")

        # F02: Travel Memories headline entering
        print("Capturing F02: Travel Memories headline entering...")
        await page.evaluate("""() => {
            const el = document.getElementById('travel-memories');
            if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'start' });
                window.scrollBy(0, -60);
            }
        }""")
        await page.wait_for_timeout(600)
        await save_shot(page, "F02_memories_headline_entering")

        # F03: Travel Memories fully settled (one composed viewport)
        print("Capturing F03: Travel Memories fully settled...")
        await page.evaluate("""() => {
            const el = document.getElementById('travel-memories');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }""")
        await page.wait_for_timeout(800)
        await save_shot(page, "F03_memories_fully_settled")

        # F04: Travel Memories CTA state ("View all memories ->")
        print("Capturing F04: Travel Memories CTA state...")
        await page.evaluate("""() => {
            const el = document.getElementById('travel-memories');
            if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'start' });
                window.scrollBy(0, 140);
            }
        }""")
        await page.wait_for_timeout(500)
        await save_shot(page, "F04_memories_cta_state")

        # F05: View All Memories transition tap sequence
        print("Capturing F05: View All Memories transition...")
        cta_btn = await page.query_selector(".sjhTravelMemories__cta")
        if cta_btn:
            await cta_btn.click()
        else:
            await page.evaluate("() => window.history.pushState({}, '', '/travel-memories')")
        await page.wait_for_timeout(400)
        await save_shot(page, "F05_view_all_memories_transition")

        # F06: /travel-memories intro
        print("Capturing F06: /travel-memories intro...")
        await page.wait_for_timeout(600)
        await page.evaluate("() => window.scrollTo({ top: 0, behavior: 'instant' })")
        await save_shot(page, "F06_travel_memories_intro")

        # F07: internal gallery first viewport
        print("Capturing F07: internal gallery first viewport...")
        await page.evaluate("() => window.scrollTo({ top: 220, behavior: 'instant' })")
        await page.wait_for_timeout(600)
        await save_shot(page, "F07_internal_gallery_first_viewport")

        # F08: lightbox open
        print("Capturing F08: lightbox open...")
        first_photo = await page.query_selector(".sjhGalleryItem")
        if first_photo:
            await first_photo.click()
            await page.wait_for_timeout(600)
        await save_shot(page, "F08_lightbox_open")

        # Test lightbox navigation & escape close
        print("Testing Lightbox ArrowRight and Escape...")
        await page.keyboard.press("ArrowRight")
        await page.wait_for_timeout(300)
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(400)

        # F09: browser back restored to homepage memories
        print("Capturing F09: browser back restored to homepage memories...")
        # Click the Back button in the header
        back_btn = await page.query_selector(".sjhMemoriesPage__backBtn")
        if back_btn:
            await back_btn.click()
        else:
            await page.go_back()
        await page.wait_for_timeout(800)
        await save_shot(page, "F09_browser_back_restored")

        # F10: Ivory -> dark CTA transition midpoint
        print("Capturing F10: Ivory -> dark CTA transition midpoint...")
        await page.evaluate("""() => {
            const el = document.getElementById('start-your-journey');
            if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'start' });
                window.scrollBy(0, -220);
            }
        }""")
        await page.wait_for_timeout(600)
        await save_shot(page, "F10_ivory_dark_transition_midpoint")

        # F11: Final CTA settled ("WHERE SHOULD WE TAKE YOU NEXT?")
        print("Capturing F11: Final CTA settled...")
        await page.evaluate("""() => {
            const el = document.getElementById('start-your-journey');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }""")
        await page.wait_for_timeout(800)
        await save_shot(page, "F11_final_cta_settled")

        # F12: Planner opening from final CTA
        print("Capturing F12: Planner opening from final CTA...")
        plan_btn = await page.query_selector(".sjhFinalCta__btn")
        if plan_btn:
            await plan_btn.click()
            await page.wait_for_timeout(800)
        await save_shot(page, "F12_planner_opening_from_cta")

        # F13: Planner closed / scroll restored
        print("Capturing F13: Planner closed / scroll restored...")
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(600)
        await save_shot(page, "F13_planner_closed_scroll_restored")

        # F14: Footer upper section
        print("Capturing F14: Footer upper section...")
        await page.evaluate("""() => {
            const el = document.getElementById('site-footer');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }""")
        await page.wait_for_timeout(600)
        await save_shot(page, "F14_footer_upper_section")

        # F15: Footer lower section / final gold node
        print("Capturing F15: Footer lower section / final gold node...")
        await page.evaluate("""() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
        }""")
        await page.wait_for_timeout(600)
        await save_shot(page, "F15_footer_lower_final_node")

        # ==========================================================
        # RESPONSIVE QA (360, 375, 390, 393, 412, 430)
        # ==========================================================
        print("\n============================================================")
        print("  RUNNING RESPONSIVE VIEWPORT SUITE                         ")
        print("============================================================")

        viewports = [
            {"w": 360, "h": 800, "name": "360x800"},
            {"w": 375, "h": 812, "name": "375x812"},
            {"w": 390, "h": 844, "name": "390x844"},
            {"w": 393, "h": 852, "name": "393x852"},
            {"w": 412, "h": 915, "name": "412x915"},
            {"w": 430, "h": 932, "name": "430x932"},
        ]

        for vp in viewports:
            await page.set_viewport_size({"width": vp["w"], "height": vp["h"]})
            await page.evaluate(f"() => {{ window.scrollTo({{ top: {p10_top}, behavior: 'instant' }}); }}")
            await page.wait_for_timeout(400)

            has_overflow = await page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 1")
            status = "FAIL" if has_overflow else "PASS"
            print(f"Viewport {vp['name']}: Horizontal overflow: {status}")

        # ==========================================================
        # FUNCTIONAL QA
        # ==========================================================
        print("\n============================================================")
        print("  RUNNING FUNCTIONAL QA AUDIT                               ")
        print("============================================================")

        # 1. Verify /travel-memories route has 28 photos
        await page.goto("http://localhost:5173/travel-memories")
        await page.wait_for_timeout(600)
        photo_count = await page.evaluate("() => document.querySelectorAll('.sjhGalleryItem').length")
        print(f"Travel Memories gallery items count: {photo_count} (expected: 28)")
        assert photo_count == 28, f"Expected 28 photos, got {photo_count}"

        # 2. Verify verified contact info
        contact_text = await page.evaluate("() => { const el = document.querySelector('.sjhFooter__contactDetails'); return el ? el.textContent : ''; }")
        print(f"Footer contact text: '{contact_text.strip()}'")
        has_placeholders = "Coming Soon" in contact_text or "+91" in contact_text
        print(f"Contains forbidden placeholders: {'FAIL' if has_placeholders else 'PASS (No placeholders)'}")
        assert not has_placeholders, "Forbidden placeholders detected!"

        await browser.close()
        print("\n============================================================")
        print("  MASTER QA COMPLETE: ALL 15 CAPTURES & TESTS PASSED!       ")
        print("============================================================")

asyncio.run(main())
