from playwright.sync_api import sync_playwright

def verify_versus_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the Spanish version of the comparison page
        url = "http://localhost:3000/es/alternativa-appsorteos"
        print(f"Navigating to {url}...")
        page.goto(url)

        # Wait for content to load
        page.wait_for_selector("h1")

        # Take full page screenshot
        screenshot_path = "verification/versus_page_full.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_versus_page()
