import time
import sys
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

def run():
    # Configure directories from environment variables with sensible defaults
    video_dir = Path(os.environ.get("VIDEO_DIR", "./verification/videos")).expanduser().resolve()
    screenshot_dir = Path(os.environ.get("SCREENSHOT_DIR", "./verification/screenshots")).expanduser().resolve()

    # Create directories if they don't exist
    os.makedirs(video_dir, exist_ok=True)
    os.makedirs(screenshot_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Grant clipboard permissions for copy tests if needed
        context = browser.new_context(
            permissions=['clipboard-read', 'clipboard-write'],
            record_video_dir=str(video_dir)
        )
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
        page.wait_for_timeout(2000)

        # Scroll to the SeoContent section (which has "features_title")
        page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
        page.wait_for_timeout(1000)

        # Screenshot
        page.screenshot(path=str(screenshot_dir / "verification_homepage.png"), full_page=True)

        page.wait_for_timeout(1000)
        context.close()
        browser.close()

if __name__ == "__main__":
    run()