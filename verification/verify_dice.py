from playwright.sync_api import Page, expect, sync_playwright
import time

def test_dice_roller(page: Page):
    # 1. Arrange: Go to Dice Roller page
    page.goto("http://localhost:3000/en/dice-roller")

    # 2. Assert: Check Title (H1)
    expect(page.get_by_role("heading", level=1, name="Online Dice Roller")).to_be_visible()

    # 3. Assert: Check GEO Content
    expect(page.get_by_text("What is an Online Dice Roller?")).to_be_visible()

    # 4. Assert: Check default participants (1-6)
    # Target Main Tool Area to avoid sidebars and "How To" steps
    main_area = page.get_by_label("Main Tool Area")

    # Wait a bit for hydration
    time.sleep(2)

    expect(main_area.get_by_text("1", exact=True)).to_be_visible()
    expect(main_area.get_by_text("6", exact=True)).to_be_visible()

    # 5. Screenshot
    page.screenshot(path="verification/dice-roller.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_dice_roller(page)
        finally:
            browser.close()
