import time
from playwright.sync_api import sync_playwright, TimeoutError

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a context
        context = browser.new_context(
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1" # Mock Mobile User Agent
        )
        page = context.new_page()

        # 1. Mock navigator.share to simulate a "Native Share" environment that fails/cancels
        # This forces the component to think it CAN share natively, but then fails when called.
        page.add_init_script("""
            Object.defineProperty(navigator, 'share', {
                value: async (data) => {
                    console.log('Mock share called with:', data);
                    throw new Error('User cancelled or API failed');
                },
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'canShare', {
                value: (data) => true,
                writable: true,
                configurable: true
            });
        """)

        print("Navigating to home...")
        # Assuming server is running on localhost:3000
        page.goto("http://localhost:3000")

        # Wait for hydration - improved
        print("Waiting for page to be ready...")
        try:
             # Wait for the share button to be attached to the DOM, which indicates main content is loaded
             # Using title attribute as it is more stable than text content for this button
             page.wait_for_selector("header button[title='Share...']", timeout=10000)
        except TimeoutError:
             print("Timeout waiting for page hydration")
             page.screenshot(path="verification_timeout.png")
             browser.close()
             return

        print("Looking for share button in header...")
        # The share button in header has aria-label="Share..."
        share_btn = page.get_by_role("button", name="Share...")

        # If not found by role, try locator
        if share_btn.count() == 0:
            print("Trying alternate locator...")
            share_btn = page.locator("header button[title='Share...']")

        if share_btn.count() > 0 and share_btn.first.is_visible():
            print("Share button found.")

            # 2. Click the button
            # Since we mocked navigator.share, this should trigger handleShare -> native share -> throw -> open dropdown
            print("Clicking share button...")
            share_btn.first.click()

            # 3. Verify Dropdown is open
            try:
                # Wait for dropdown to be visible
                # Using role="menuitem" which is standard for DropdownMenu items
                # We specifically look for the one containing the Twitter icon/link as a proxy for the menu being open
                dropdown_item = page.locator("a[aria-label='Share on Twitter']")
                dropdown_item.wait_for(state="visible", timeout=5000)
                print("SUCCESS: Dropdown menu opened after native share failure!")

                # Take screenshot
                page.screenshot(path="verification_share_success.png")
            except TimeoutError as e:
                print(f"FAILURE: Dropdown menu did not open (Timeout).")
                page.screenshot(path="verification_share_failure.png")
            except Exception as e:
                print(f"FAILURE: Unexpected error: {e}")
                page.screenshot(path="verification_error.png")

        else:
            print("FAILURE: Share button not found.")
            page.screenshot(path="verification_not_found.png")

        browser.close()

if __name__ == "__main__":
    run_test()
