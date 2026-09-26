"""
Automated QA Suite for SJH Production Contact + 7-Step Journey Planner + WhatsApp Integration
Validates all 6 Functional Test Cases + Mobile Composition at 390x844
"""

import sys
import urllib.parse
from playwright.sync_api import sync_playwright

def run_tests():
    print("=" * 60, flush=True)
    print("  RUNNING SJH PRODUCTION CONTACT & PLANNER QA SUITE", flush=True)
    print("=" * 60, flush=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        # Mock window.open to reliably capture generated URLs across environments
        page.add_init_script("""
            window.__LAST_OPENED_URL__ = null;
            const origOpen = window.open;
            window.open = function(url, target, features) {
                window.__LAST_OPENED_URL__ = url;
                return { closed: false, focus: () => {} };
            };
        """)

        # ========================================================
        # TEST CASE 1: Full 7-Step Enquiry Flow & WhatsApp URL
        # ========================================================
        print("\n--- TEST CASE 1: Full 7-Step Enquiry Flow ---", flush=True)
        page.goto("http://localhost:5173/")
        page.wait_for_timeout(600)

        # Settle hero intro immediately
        page.evaluate("window.__SJH_SET_SETTLED__ && window.__SJH_SET_SETTLED__();")
        page.wait_for_timeout(300)

        # Open planner deterministically via testing hook
        page.evaluate("window.__SJH_PLANNER_OPEN__ && window.__SJH_PLANNER_OPEN__();")
        page.wait_for_timeout(700)

        # Verify Step 1: Step 1 of 7 · JOURNEY
        step_badge = page.inner_text(".sjhFlow__stepBadge")
        step_title = page.inner_text(".sjhFlow__stepTitle")
        print(f"Step indicator: '{step_badge}' - '{step_title}'", flush=True)
        assert "STEP 1 OF 7" in step_badge, f"Expected STEP 1 OF 7, got {step_badge}"
        assert "JOURNEY" in step_title, f"Expected JOURNEY, got {step_title}"

        # Verify exactly 8 destination chips are present
        chips = page.locator(".sjhFlow__destChip")
        chip_count = chips.count()
        print(f"Found {chip_count} destination chips (expected 8)", flush=True)
        assert chip_count == 8, f"Expected 8 destination chips, got {chip_count}"

        # Fill Step 1: From = Bhubaneswar, Destination = South India
        from_input = page.locator(".sjhHero__plannerInput").first
        from_input.fill("Bhubaneswar")
        
        # Select "South India" chip
        page.click("button.sjhFlow__destChip:has-text('South India')")
        page.wait_for_timeout(200)

        # Click CONTINUE to Step 2
        page.click("button.sjhHero__plannerCta:has-text('CONTINUE')")
        page.wait_for_timeout(400)

        # Verify Step 2: DATES
        step_badge = page.inner_text(".sjhFlow__stepBadge")
        assert "STEP 2 OF 7" in step_badge, f"Expected STEP 2 OF 7, got {step_badge}"
        print(f"Step 2 indicator: '{step_badge}'", flush=True)

        # Select Exact Dates: 2027-01-12 to 2027-01-20
        page.click("button.sjhHero__whenPill:has-text('I know my dates')")
        page.wait_for_timeout(200)
        page.locator("input[type='date']").nth(0).fill("2027-01-12")
        page.locator("input[type='date']").nth(1).fill("2027-01-20")

        # Click CONTINUE to Step 3
        page.click("button.sjhHero__plannerCta:has-text('CONTINUE')")
        page.wait_for_timeout(400)

        # Verify Step 3: TRAVELLERS
        step_badge = page.inner_text(".sjhFlow__stepBadge")
        assert "STEP 3 OF 7" in step_badge, f"Expected STEP 3 OF 7, got {step_badge}"
        print(f"Step 3 indicator: '{step_badge}'", flush=True)

        # Increment Adults from 2 to 3, Children from 0 to 1
        page.locator("button[aria-label='Increase adults']").click(force=True)
        page.locator("button[aria-label='Increase children']").click(force=True)

        # Click CONTINUE to Step 4
        page.click("button.sjhHero__plannerCta:has-text('CONTINUE')")
        page.wait_for_timeout(400)

        # Verify Step 4: JOURNEY TYPE
        step_badge = page.inner_text(".sjhFlow__stepBadge")
        assert "STEP 4 OF 7" in step_badge, f"Expected STEP 4 OF 7, got {step_badge}"
        print(f"Step 4 indicator: '{step_badge}'", flush=True)

        # Select "Pilgrimage & Spiritual Tour"
        page.click("button.sjhFlow__typeRow:has-text('Pilgrimage & Spiritual Tour')")

        # Click CONTINUE to Step 5
        page.click("button.sjhHero__plannerCta:has-text('CONTINUE')")
        page.wait_for_timeout(400)

        # Verify Step 5: YOUR DETAILS
        step_badge = page.inner_text(".sjhFlow__stepBadge")
        assert "STEP 5 OF 7" in step_badge, f"Expected STEP 5 OF 7, got {step_badge}"
        print(f"Step 5 indicator: '{step_badge}'", flush=True)

        # Fill Details: Name = Test Traveller, Phone = 9876543210
        inputs = page.locator(".sjhHero__plannerInput")
        inputs.nth(0).fill("Test Traveller")
        inputs.nth(1).fill("9876543210")

        # Click CONTINUE to Step 6
        page.click("button.sjhHero__plannerCta:has-text('CONTINUE')")
        page.wait_for_timeout(400)

        # Verify Step 6: NOTES
        step_badge = page.inner_text(".sjhFlow__stepBadge")
        assert "STEP 6 OF 7" in step_badge, f"Expected STEP 6 OF 7, got {step_badge}"
        print(f"Step 6 indicator: '{step_badge}'", flush=True)

        page.locator("textarea.sjhFlow__textarea").fill("Travelling with senior citizens.")

        # Click REVIEW JOURNEY DETAILS to Step 7
        page.click("button.sjhHero__plannerCta:has-text('REVIEW')")
        page.wait_for_timeout(400)

        # Verify Step 7: REVIEW
        step_badge = page.inner_text(".sjhFlow__stepBadge")
        assert "STEP 7 OF 7" in step_badge, f"Expected STEP 7 OF 7, got {step_badge}"
        print(f"Step 7 indicator: '{step_badge}'", flush=True)

        # Verify Review Card Content
        review_text = page.inner_text(".sjhReviewCard")
        assert "BHUBANESWAR" in review_text.upper()
        assert "SOUTH INDIA" in review_text.upper()
        assert "3 ADULTS" in review_text.upper()
        assert "1 CHILD" in review_text.upper()
        assert "PILGRIMAGE & SPIRITUAL TOUR" in review_text.upper()
        assert "TEST TRAVELLER" in review_text.upper()
        assert "9876543210" in review_text
        assert "TRAVELLING WITH SENIOR CITIZENS" in review_text.upper()
        print("Review card display validation: PASS", flush=True)

        # Click CONTINUE ON WHATSAPP
        page.click(".sjhFlow__whatsappBtn")
        page.wait_for_timeout(400)
        
        wa_url = page.evaluate("window.__LAST_OPENED_URL__;")
        print(f"Captured WhatsApp URL: {wa_url}", flush=True)
        assert "919288367190" in wa_url, f"Expected 919288367190 in WhatsApp URL, got {wa_url}"
        
        parsed_url = urllib.parse.urlparse(wa_url)
        params = urllib.parse.parse_qs(parsed_url.query)
        message = params.get("text", [""])[0]
        print("\nDecoded WhatsApp Message:\n" + message, flush=True)

        assert "From: Bhubaneswar" in message
        assert "Destination: South India" in message
        assert "12 January 2027" in message
        assert "20 January 2027" in message
        assert "Adults: 3" in message
        assert "Children: 1" in message
        assert "Pilgrimage & Spiritual Tour" in message
        assert "Name: Test Traveller" in message
        assert "Phone: 9876543210" in message
        assert "Travelling with senior citizens." in message
        print("Test Case 1: PASS", flush=True)

        # ========================================================
        # TEST CASE 2: Contextual Prefill from Sacred Odisha Page
        # ========================================================
        print("\n--- TEST CASE 2: Sacred Odisha Destination Prefill ---", flush=True)
        page.goto("http://localhost:5173/journeys/sacred-odisha")
        page.wait_for_timeout(800)

        # Click PLAN THIS JOURNEY
        page.click(".sjhDetailPlanCta__btn")
        page.wait_for_timeout(600)

        # Verify Step 1 destination chip has "Puri / Odisha" selected or destination is prefilled
        selected_dest_chip = page.locator(".sjhFlow__destChip.is-active").first.inner_text()
        print(f"Prefilled destination chip: '{selected_dest_chip}'", flush=True)
        assert "Odisha" in selected_dest_chip, f"Expected Odisha in prefill, got {selected_dest_chip}"
        print("Test Case 2: PASS", flush=True)

        # Close modal
        page.click(".sjhPlanModal__card .sjhHero__plannerClose")
        page.wait_for_timeout(400)

        # ========================================================
        # TEST CASE 3: Flexible Dates WhatsApp Message
        # ========================================================
        print("\n--- TEST CASE 3: Flexible Dates Formatting ---", flush=True)
        page.goto("http://localhost:5173/")
        page.wait_for_timeout(600)
        page.evaluate("window.__SJH_SET_SETTLED__ && window.__SJH_SET_SETTLED__();")
        page.wait_for_timeout(300)
        page.evaluate("window.__SJH_PLANNER_OPEN__ && window.__SJH_PLANNER_OPEN__();")
        page.wait_for_timeout(600)

        # Step 1 -> Destination = Kashmir
        page.click("button.sjhFlow__destChip:has-text('Kashmir')")
        page.click("button.sjhHero__plannerCta:has-text('CONTINUE')")
        page.wait_for_timeout(400)

        # Step 2 -> Flexible dates with Preferred Month = December 2026
        page.locator("select").select_option("December 2026")
        page.click("button.sjhHero__plannerCta:has-text('CONTINUE')")
        page.wait_for_timeout(400)

        # Step 3 -> Continue
        page.click("button.sjhHero__plannerCta:has-text('CONTINUE')")
        page.wait_for_timeout(400)

        # Step 4 -> Pan-India Group Tour
        page.click("button.sjhFlow__typeRow:has-text('Pan-India Group Tour')")
        page.click("button.sjhHero__plannerCta:has-text('CONTINUE')")
        page.wait_for_timeout(400)

        # Step 5 -> Name & Phone
        inputs = page.locator(".sjhHero__plannerInput")
        inputs.nth(0).fill("Flexible Traveller")
        inputs.nth(1).fill("9123456780")
        page.click("button.sjhHero__plannerCta:has-text('CONTINUE')")
        page.wait_for_timeout(400)

        # Step 6 -> Review
        page.click("button.sjhHero__plannerCta:has-text('REVIEW')")
        page.wait_for_timeout(400)

        # Trigger WhatsApp
        page.click(".sjhFlow__whatsappBtn")
        page.wait_for_timeout(400)

        wa_url = page.evaluate("window.__LAST_OPENED_URL__;")
        parsed_url = urllib.parse.urlparse(wa_url)
        params = urllib.parse.parse_qs(parsed_url.query)
        msg = params.get("text", [""])[0]
        print("Flexible Message Preview:\n" + msg, flush=True)
        assert "Dates: Flexible" in msg
        assert "Preferred Month: December 2026" in msg
        assert "Departure:" not in msg
        assert "Return:" not in msg
        print("Test Case 3: PASS", flush=True)

        # ========================================================
        # TEST CASE 4: Direct Footer WhatsApp
        # ========================================================
        print("\n--- TEST CASE 4: Direct Footer WhatsApp Link ---", flush=True)
        page.goto("http://localhost:5173/")
        page.wait_for_timeout(500)
        footer_wa_link = page.locator(".sjhFooter a[aria-label*='WhatsApp']").get_attribute("href")
        print(f"Footer WhatsApp href: {footer_wa_link}", flush=True)
        assert "wa.me/919288367190" in footer_wa_link
        print("Test Case 4: PASS", flush=True)

        # ========================================================
        # TEST CASE 5: Phone Link Tel Protocol
        # ========================================================
        print("\n--- TEST CASE 5: Phone Link Tel Protocol ---", flush=True)
        footer_tel_link = page.locator(".sjhFooter a[aria-label*='Call']").get_attribute("href")
        print(f"Footer Tel href: {footer_tel_link}", flush=True)
        assert footer_tel_link == "tel:+919288367190", f"Expected tel:+919288367190, got {footer_tel_link}"
        print("Test Case 5: PASS", flush=True)

        # ========================================================
        # TEST CASE 6: Social Links & YouTube Check
        # ========================================================
        print("\n--- TEST CASE 6: Verified Social Links & No YouTube ---", flush=True)
        ig_link = page.locator(".sjhFooter a:has-text('Instagram')").get_attribute("href")
        fb_link = page.locator(".sjhFooter a:has-text('Facebook')").get_attribute("href")
        print(f"Instagram: {ig_link}", flush=True)
        print(f"Facebook: {fb_link}", flush=True)
        assert "instagram.com/tikun.official" in ig_link
        assert "facebook.com/share/1DTW4LuWEQ" in fb_link

        body_html = page.content()
        assert "youtube" not in body_html.lower(), "Found YouTube references in DOM!"
        assert "coming soon" not in body_html.lower(), "Found 'Coming Soon' placeholder in DOM!"
        print("Test Case 6: PASS (No YouTube, no Coming Soon, verified socials)", flush=True)

        # Capture Step 1 Mobile Composition Screenshot (390x844)
        print("\n--- CAPTURING STEP 1 MOBILE COMPOSITION SCREENSHOT ---", flush=True)
        page.goto("http://localhost:5173/")
        page.wait_for_timeout(600)
        page.evaluate("window.__SJH_SET_SETTLED__ && window.__SJH_SET_SETTLED__();")
        page.wait_for_timeout(300)
        page.evaluate("window.__SJH_PLANNER_OPEN__ && window.__SJH_PLANNER_OPEN__();")
        page.wait_for_timeout(800)
        page.screenshot(path="step1_mobile_composition_390x844.png")
        print("Screenshot saved to step1_mobile_composition_390x844.png", flush=True)

        browser.close()
        print("\n" + "=" * 60, flush=True)
        print("  ALL 6 FUNCTIONAL TEST CASES PASSED SUCCESSFULLY!", flush=True)
        print("=" * 60, flush=True)

if __name__ == "__main__":
    run_tests()
