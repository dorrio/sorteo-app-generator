import time
import sys
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Grant clipboard permissions for copy tests if needed
        context = browser.new_context(permissions=['clipboard-read', 'clipboard-write'])
        page = context.new_page()

        # Retry connection
        last_error = None
        for i in range(10):
            try:
                page.goto("http://localhost:3000/en", timeout=30000)
                break
            except Exception as e:
                last_error = e
                print(f"Waiting for server... Attempt {i+1}/10. Error: {e}")
                time.sleep(2)
        else:
            # If the loop finishes without breaking, raise the error
            if last_error:
                 raise RuntimeError(f"Failed to connect to server after 10 attempts. Last error: {last_error}")
            else:
                 sys.exit("Failed to connect to server.")


        # Wait for hydration
        page.wait_for_load_state("networkidle")

        # Verify WheelGeoServer content (Exact match from en.json)
        # "what_is_wheel": "What is a Wheel of Names?"
        page.get_by_text("What is a Wheel of Names?").scroll_into_view_if_needed()

        # Verify the "Try It" button exists
        # We expect 2 occurrences: One in the text/button, one in the visual (sr-only).
        # We'll just verify the first one (the button) is visible.
        # Note: sr-only might be considered visible by playwright if it's in the DOM,
        # but visually hidden via CSS class.
        # Let's target the button specifically if possible, or just take the first.
        page.get_by_text("Try Wheel Mode Now").first.scroll_into_view_if_needed()

        # Screenshot
        page.screenshot(path="verification_homepage.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run()
