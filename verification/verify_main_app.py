from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        print("Navigating to homepage...")
        page.goto("http://localhost:3000/en")

        print("Waiting for H1...")
        page.wait_for_selector("h1:has-text('Sorteo Pro')")

        print("Waiting for Start button...")
        # Start button might have 'Start Giveaway' or similar text, or be an icon button.
        # Based on code: {t("start_button")} which defaults to "Start Giveaway" in English?
        # Let's look for the button with Play icon or text.
        page.wait_for_selector("button:has-text('Start Giveaway')")

        print("Taking screenshot...")
        page.screenshot(path="verification/homepage.png", full_page=True)

        browser.close()
        print("Done.")

if __name__ == "__main__":
    run()
