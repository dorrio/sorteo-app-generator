from playwright.sync_api import Page, expect, sync_playwright

def debug_home(page: Page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)
    page.screenshot(path="/home/jules/verification/debug_home.png")

    # Print accessibility tree
    snapshot = page.accessibility.snapshot()
    import json
    print(json.dumps(snapshot, indent=2))

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            debug_home(page)
        finally:
            browser.close()
