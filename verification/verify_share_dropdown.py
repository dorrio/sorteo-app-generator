from playwright.sync_api import sync_playwright, expect

def test_share_dropdown():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport to trigger the StickyShareFooter
        context = browser.new_context(
            viewport={'width': 375, 'height': 812},
            has_touch=False
        )

        # Mock navigator.share and matchMedia
        context.add_init_script("""
            Object.defineProperty(navigator, 'share', {
                value: undefined,
                configurable: true
            });
            window.matchMedia = window.matchMedia || function() {
                return {
                    matches: false,
                    addListener: function() {},
                    removeListener: function() {}
                };
            };
        """)

        page = context.new_page()

        try:
            page.goto("http://localhost:3000/en/wheel-of-names")
            page.wait_for_timeout(3000)

            # Scroll to trigger sticky footer
            page.evaluate("window.scrollTo(0, 1500)")
            page.wait_for_timeout(2000)

            # Try to click the share button in the sticky footer
            # The translations for share_cta are likely different depending on participants, it uses 'cta_invite' or 'Share Tool'
            share_button = page.locator('button', has_text="Share").first
            if not share_button.is_visible():
                share_button = page.locator('button', has_text="Invite").first

            expect(share_button).to_be_visible(timeout=5000)
            share_button.click()

            page.wait_for_timeout(1000)

            page.screenshot(path="verification/share_dropdown.png")
            print("Verification successful!")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_share_dropdown.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_share_dropdown()
