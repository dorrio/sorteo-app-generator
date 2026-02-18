from playwright.sync_api import sync_playwright
import time

def verify_truth(page):
    # 1. Navigate to the page
    page.goto("http://localhost:3000/en/truth-or-dare-generator")

    # 2. Wait for hydration
    page.wait_for_timeout(3000)

    # 3. Check title
    title = page.locator("h1").first
    print(f"Title found: {title.inner_text()}")

    # 4. Check for Direct Answer
    geo_title = page.get_by_text("What is a Truth or Dare Generator?")
    if geo_title.count() > 0:
        print("GEO Title found")

    # 5. Take screenshot
    page.screenshot(path="verification/truth_verification.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_truth(page)
        finally:
            browser.close()
