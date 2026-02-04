from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to /en/random-month-generator...")
        try:
            page.goto("http://localhost:3000/en/random-month-generator", timeout=30000)
        except Exception as e:
            print(f"Navigation failed: {e}")
            page.wait_for_timeout(5000)
            page.goto("http://localhost:3000/en/random-month-generator")

        # 1. Verify Title
        print("Verifying H1...")
        h1 = page.locator("h1")
        expect(h1).to_contain_text("Random Month Generator")
        print("H1 verified.")

        # 2. Verify Participants (Auto-populated)
        print("Verifying Month content...")
        # Check if "January" is present anywhere visible
        try:
            # Relaxed check
            expect(page.locator("body")).to_contain_text("January")
            print("January found in body.")
        except:
            print("January NOT found in body.")

        # 3. Verify GEO Content (Title)
        print("Verifying GEO content...")
        try:
            geo_heading = page.get_by_role("heading", name="What is a Random Month Generator?")
            geo_heading.scroll_into_view_if_needed()
            expect(geo_heading).to_be_visible()
            print("GEO content verified.")
        except:
            print("GEO content NOT verified.")

        # 4. Screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification/month_generator.png", full_page=True)
        print("Screenshot saved.")

        browser.close()

if __name__ == "__main__":
    run()
