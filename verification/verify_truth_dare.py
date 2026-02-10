from playwright.sync_api import Page, expect, sync_playwright

def verify_truth_dare_generator(page: Page):
    print("Navigating to page...")
    # Navigate to the new page
    page.goto("http://localhost:3000/en/truth-or-dare-generator")

    print("Checking for H1...")
    # Wait for the main title
    # We expect "Truth or Dare Generator"
    heading = page.get_by_role("heading", name="Truth or Dare Generator", level=1)
    expect(heading).to_be_visible(timeout=60000)

    print("Checking for GEO content...")
    # Check for GEO content ("What is a Truth or Dare Generator?")
    # Note: It might be inside the TruthDareGeo component which renders H2
    geo_heading = page.get_by_role("heading", name="What is a Truth or Dare Generator?", level=2)
    expect(geo_heading).to_be_visible()

    print("Checking for participants...")
    # Check for participants list being populated
    # "What is your biggest fear?" should be there. It might be in the list items.
    # The list is rendered inside ParticipantManager or SorteoSelector depending on view.
    # Default view usually shows list.
    expect(page.get_by_text("What is your biggest fear?")).to_be_visible()

    # Check for "Do 10 pushups."
    expect(page.get_by_text("Do 10 pushups.")).to_be_visible()

    print("Taking screenshot...")
    # Take screenshot
    page.screenshot(path="verification/truth_dare.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_truth_dare_generator(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/failure.png")
        finally:
            browser.close()
