from playwright.sync_api import sync_playwright

def screenshot_verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 1280, "height": 800})

        page = context.new_page()
        page.goto("http://localhost:3000/en/verify?id=ID-12345678-ABCDEF01")
        page.wait_for_timeout(3000)

        page.screenshot(path="verification/verify_page_fixed.png")
        print("Captured basic verify page screenshot.")

        browser.close()

if __name__ == "__main__":
    screenshot_verify()
