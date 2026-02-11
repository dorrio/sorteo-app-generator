from playwright.sync_api import sync_playwright
import time

def run():
    print("Starting Playwright...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop Context
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        print("Navigating to homepage...")
        try:
            # Wait for server to be up (simplistic retry)
            for i in range(5):
                try:
                    page.goto("http://localhost:3000/en", timeout=30000)
                    break
                except Exception as e:
                    print(f"Waiting for server... ({i})")
                    time.sleep(5)

            page.wait_for_load_state("networkidle")

            print("Checking elements...")
            # Check H1
            try:
                h1 = page.locator("h1").first
                print(f"H1 Text: {h1.inner_text()}")
            except:
                print("H1 not found")

            # Check Start Button (Play icon usually)
            try:
                start_btn = page.locator("button").filter(has_text="Start")
                if start_btn.count() > 0:
                     print("Start button found")
                else:
                     print("Start button text not found, checking generic button count")
                     print(f"Button count: {page.locator('button').count()}")
            except:
                print("Start button check failed")

            page.screenshot(path="verification/desktop_home.png")
            print("Desktop screenshot taken: verification/desktop_home.png")

        except Exception as e:
            print(f"Error Desktop: {e}")
            page.screenshot(path="verification/error_desktop.png")

        # Mobile Context (for Sticky Footer)
        context_mobile = browser.new_context(viewport={"width": 375, "height": 667}, is_mobile=True)
        page_mobile = context_mobile.new_page()
        try:
            page_mobile.goto("http://localhost:3000/en", timeout=30000)
            page_mobile.wait_for_load_state("networkidle")

            # Scroll down to trigger sticky footer
            page_mobile.evaluate("window.scrollTo(0, 1000)")
            time.sleep(2) # Wait for animation

            page_mobile.screenshot(path="verification/mobile_home.png")
            print("Mobile screenshot taken: verification/mobile_home.png")

        except Exception as e:
            print(f"Error Mobile: {e}")
            page_mobile.screenshot(path="verification/error_mobile.png")

        browser.close()

if __name__ == "__main__":
    run()
