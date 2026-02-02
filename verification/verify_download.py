from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen to console
    page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"Browser Error: {exc}"))

    print("Navigating to home...")
    try:
        page.goto("http://localhost:3000/en")
    except Exception as e:
        print(f"Navigation failed: {e}")
        return

    try:
        page.wait_for_selector("text=Start Giveaway", timeout=10000)
    except:
        print("Hydration failed or timeout")
        return

    # Add participants
    try:
        page.get_by_text("List", exact=True).click()
        page.fill("textarea", "WinnerOne\nWinnerTwo")
        page.click("text=Add 2 participants")
    except:
        page.fill("input[placeholder='Participant name']", "WinnerOne")
        page.press("input[placeholder='Participant name']", "Enter")
        page.fill("input[placeholder='Participant name']", "WinnerTwo")
        page.press("input[placeholder='Participant name']", "Enter")

    # Start
    print("Starting...")
    page.click("text=Start Giveaway")

    # Wait for winner
    print("Waiting for winner modal...")
    page.wait_for_selector("text=Congratulations", timeout=30000)

    # Click Download
    print("Clicking Download Certificate...")

    try:
        with page.expect_download(timeout=10000) as download_info:
            page.click("text=Download Certificate")
        download = download_info.value
        print(f"Download success: {download.suggested_filename}")
    except Exception as e:
        print(f"Download event failed: {e}")
        # Check if a new page was opened (fallback)
        if len(context.pages) > 1:
            print("New page detected (Fallback triggered)")
            popup = context.pages[1]
            print(f"Popup URL: {popup.url}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
