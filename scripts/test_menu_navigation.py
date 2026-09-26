import time
from playwright.sync_api import sync_playwright

def test_menu():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 390, "height": 844})
        page.goto("http://localhost:5173/")
        page.wait_for_timeout(600)
        page.evaluate("window.__SJH_SET_SETTLED__ && window.__SJH_SET_SETTLED__();")
        page.wait_for_timeout(300)

        def wait_for_scroll_settle():
            for _ in range(25):
                page.wait_for_timeout(150)
                y = page.evaluate("window.scrollY")
                top = page.evaluate("document.getElementById('destinations') ? document.getElementById('destinations').getBoundingClientRect().top : 0")
                if abs(top - 80) < 10:
                    break

        # 1. Test Destinations
        print("Testing Destinations...")
        page.click(".sjhHero__menu")
        page.wait_for_timeout(400)
        page.locator("nav a").filter(has_text="Destinations").click()
        wait_for_scroll_settle()
        dest_top = page.evaluate("document.getElementById('destinations').getBoundingClientRect().top")
        print(f"Destinations offset from top: {dest_top}px")
        assert abs(dest_top - 80) < 10, f"Destinations top unexpected: {dest_top}"

        # 2. Test Our Heritage
        print("Testing Our Heritage...")
        page.click(".sjhHero__menu")
        page.wait_for_timeout(400)
        page.locator("nav a").filter(has_text="Our Heritage").click()
        for _ in range(25):
            page.wait_for_timeout(150)
            top = page.evaluate("document.getElementById('our-heritage') ? document.getElementById('our-heritage').getBoundingClientRect().top : 0")
            if abs(top - 80) < 10:
                break
        heritage_top = page.evaluate("document.getElementById('our-heritage').getBoundingClientRect().top")
        print(f"Our Heritage offset from top: {heritage_top}px")
        assert abs(heritage_top - 80) < 10, f"Our Heritage top unexpected: {heritage_top}"

        # 3. Test Sacred Journeys
        print("Testing Sacred Journeys...")
        page.click(".sjhHero__menu")
        page.wait_for_timeout(400)
        page.locator("nav a").filter(has_text="Sacred Journeys").click()
        for _ in range(25):
            page.wait_for_timeout(150)
            top = page.evaluate("document.getElementById('sacred-journeys') ? document.getElementById('sacred-journeys').getBoundingClientRect().top : 0")
            if abs(top - 80) < 10:
                break
        sacred_top = page.evaluate("document.getElementById('sacred-journeys').getBoundingClientRect().top")
        print(f"Sacred Journeys offset from top: {sacred_top}px")
        assert abs(sacred_top - 80) < 10, f"Sacred Journeys top unexpected: {sacred_top}"

        # 4. Test Travel Memories
        print("Testing Travel Memories...")
        page.click(".sjhHero__menu")
        page.wait_for_timeout(400)
        page.locator("nav a").filter(has_text="Travel Memories").click()
        page.wait_for_timeout(1000)
        curr_url = page.url
        print(f"Travel Memories page URL: {curr_url}")
        assert "travel-memories" in curr_url, f"Expected travel-memories URL, got {curr_url}"

        # 5. From Travel Memories subpage, navigate back to Destinations
        print("Testing subpage back-to-section navigation...")
        page.click(".sjhMemoriesPage__menuBtn")
        page.wait_for_timeout(400)
        page.locator("nav a").filter(has_text="Destinations").click()
        for _ in range(30):
            page.wait_for_timeout(150)
            top = page.evaluate("document.getElementById('destinations') ? document.getElementById('destinations').getBoundingClientRect().top : 0")
            if abs(top - 80) < 15:
                break
        dest_subpage_top = page.evaluate("document.getElementById('destinations').getBoundingClientRect().top")
        print(f"Destinations offset from top after subpage transition: {dest_subpage_top}px")
        assert abs(dest_subpage_top - 80) < 15, f"Destinations top from subpage unexpected: {dest_subpage_top}"

        browser.close()
        print("\nSUCCESS: ALL 4 MENU NAVIGATION ITEMS VERIFIED AND TESTED SUCCESSFULLY!")

if __name__ == "__main__":
    test_menu()
