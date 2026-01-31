from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Disable JS to see SSR output (which should include skeletons)
        context = browser.new_context(java_script_enabled=False)
        page = context.new_page()

        print("Verifying Home Page (Default)...")
        # / matches middleware, redirects to /en
        page.goto("http://localhost:3000/")
        page.screenshot(path="verification/home_skeleton.png")
        print("Captured home_skeleton.png")

        print("Verifying Wheel Page...")
        # Direct access to localized path because middleware matcher excludes non-localized paths
        page.goto("http://localhost:3000/en/wheel-of-names")
        page.screenshot(path="verification/wheel_skeleton.png")
        print("Captured wheel_skeleton.png")

        print("Verifying Dice Page...")
        page.goto("http://localhost:3000/en/dice-roller")
        page.screenshot(path="verification/dice_skeleton.png")
        print("Captured dice_skeleton.png")

        browser.close()

if __name__ == "__main__":
    run()
