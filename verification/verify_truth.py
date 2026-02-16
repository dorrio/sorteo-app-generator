from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to Truth or Dare Generator...")
            page.goto("http://localhost:3000/en/truth-or-dare-generator", timeout=60000)

            # Wait for hydration
            page.wait_for_timeout(3000)

            print("Verifying content...")
            expect(page.get_by_role("heading", name="Truth or Dare Generator", level=1)).to_be_visible()
            expect(page.get_by_text("What is a Truth or Dare Generator?")).to_be_visible()

            # Check for a truth or dare in the list (assuming it might be visible or we can see the button)
            # The wheel/slot machine might obscure text, but we can check if the button works

            print("Taking screenshot...")
            page.screenshot(path="verification/truth_page.png", full_page=True)
            print("Screenshot saved to verification/truth_page.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
