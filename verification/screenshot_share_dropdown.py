from playwright.sync_api import sync_playwright

def screenshot_share_dropdown():
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

        share_buttons = page.locator('button', has_text="Share")
        if share_buttons.count() > 0:
            share_buttons.first.click()
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/share_dropdown_desktop.png")
            print("Captured Desktop Share Dropdown screenshot.")
        else:
            print("Could not find Share button.")

        browser.close()

if __name__ == "__main__":
    screenshot_share_dropdown()
