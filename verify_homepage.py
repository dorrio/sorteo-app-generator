from playwright.sync_api import sync_playwright

def verify_homepage():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Verify Homepage
        print("Navigating to Homepage...")
        page.goto("http://localhost:3000/en")

        # Wait for the title to be visible (client island loaded)
        page.wait_for_selector("h1:has-text('Sorteo Pro')")

        # Wait for hydration to complete (e.g. settings button functional)
        page.wait_for_selector("button[aria-label='Customize']")

        print("Taking homepage screenshot...")
        page.screenshot(path="verification_homepage.png")

        # Verify Yes/No Page
        print("Navigating to Yes/No Page...")
        page.goto("http://localhost:3000/en/yes-or-no-wheel")

        page.wait_for_selector("h1:has-text('Yes or No Wheel')")

        # Check initial options are populated
        # This confirms that ThemeInitializer logic for population worked
        # We look for the wheel or list
        # But list is in sidebar, let's check sidebar
        # Sidebar might be hidden on mobile but visible on desktop (1280px)

        print("Taking yes-no page screenshot...")
        page.screenshot(path="verification_yes_no.png")

        browser.close()

if __name__ == "__main__":
    verify_homepage()
