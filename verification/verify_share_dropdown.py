import re
from playwright.sync_api import sync_playwright

def verify_share_dropdown():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        context.add_init_script("""
            navigator.share = async function(data) {
                console.log('navigator.share called', data);
            };
            window.matchMedia = function(query) {
                return {
                    matches: query === '(pointer: coarse)' ? false : false,
                    media: query,
                    onchange: null,
                    addListener: function() {},
                    removeListener: function() {},
                    addEventListener: function() {},
                    removeEventListener: function() {},
                    dispatchEvent: function() { return false; }
                };
            };
        """)

        page = context.new_page()
        page.goto("http://localhost:3000/en/verify?id=ID-12345678-ABCDEF01")
        page.wait_for_timeout(3000)

        share_buttons = page.locator('button', has_text=re.compile(r"Share", re.IGNORECASE))
        if share_buttons.count() > 0:
            share_buttons.first.click()
            page.wait_for_timeout(1000)

            # Assert the dropdown appeared by looking for standard menu items
            dropdown_items = page.locator('div[role="menuitem"]')
            count = dropdown_items.count()
            if count == 0:
                print("❌ Desktop view test failed: Share dropdown menu did not appear.")
                exit(1)
            else:
                print(f"✅ Desktop view test passed: Found {count} dropdown menu items.")
        else:
            print("❌ Desktop view test failed: Could not find Share button.")
            exit(1)

        browser.close()

        # Mobile context
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 375, "height": 812}, has_touch=True)
        context.add_init_script("""
            navigator.share = async function(data) {
                console.log('navigator.share called', data);
                window._nativeShareTriggered = true;
                return Promise.resolve(); // Must return a promise!
            };
            window.matchMedia = function(query) {
                return {
                    matches: query === '(pointer: coarse)' ? true : false,
                    media: query,
                    onchange: null,
                    addListener: function() {},
                    removeListener: function() {},
                    addEventListener: function() {},
                    removeEventListener: function() {},
                    dispatchEvent: function() { return false; }
                };
            };
        """)

        page = context.new_page()
        page.goto("http://localhost:3000/en/verify?id=ID-12345678-ABCDEF01")
        page.wait_for_timeout(3000)

        share_buttons = page.locator('button', has_text=re.compile(r"Share", re.IGNORECASE))
        if share_buttons.count() > 0:
            share_buttons.first.click()
            page.wait_for_timeout(1000)

            # Check if native share was called
            was_triggered = page.evaluate("window._nativeShareTriggered === true")
            if not was_triggered:
                print("❌ Mobile view test failed: Native share was not triggered.")
                exit(1)
            else:
                print("✅ Mobile view test passed: Native share was triggered.")
        else:
            print("❌ Mobile view test failed: Could not find Share button.")
            exit(1)

        browser.close()

if __name__ == "__main__":
    verify_share_dropdown()
