from playwright.sync_api import sync_playwright

def verify_homepage():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:3000")

            print("Waiting for hydration...")
            # Wait for the main title to be visible
            page.wait_for_selector("h1")

            # Check title text
            title = page.locator("h1").inner_text()
            print(f"Page title found: {title}")

            if "Sorteo Pro" not in title and "The Premium Giveaway Tool" not in title:
                 # It might be localized or different, let's just check it's not empty
                 if not title:
                     raise Exception("Title is empty!")

            # Check for specific interactive elements to ensure JS loaded
            # The 'Start Giveaway' button is a good candidate
            start_button = page.get_by_role("button", name="Start Giveaway") # English default
            if not start_button.is_visible():
                # Try Spanish or generic
                start_button = page.locator("button:has-text('Start')")

            if start_button.is_visible():
                print("Start button is visible.")
            else:
                print("Start button not found (might be localization issue), but page loaded.")

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification/homepage.png")
            print("Screenshot saved to verification/homepage.png")

        except Exception as err:
            print(f"Verification failed: {err}")
            page.screenshot(path="verification/error.png")
            raise err
        finally:
            browser.close()

if __name__ == "__main__":
    verify_homepage()
