from playwright.sync_api import sync_playwright

def verify(page):
    print("Navigating to Secret Santa Generator...")
    page.goto("http://localhost:3000/en/secret-santa-generator")

    print("Waiting for h1...")
    page.wait_for_selector("h1")

    print("Taking top screenshot...")
    page.screenshot(path="verification_secret_santa.png")

    print("Scrolling down...")
    page.evaluate("window.scrollBy(0, 1000)")
    page.wait_for_timeout(1000) # Wait for scroll

    print("Taking GEO screenshot...")
    page.screenshot(path="verification_secret_santa_geo.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify(page)
            print("Verification successful")
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
