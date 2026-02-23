from playwright.sync_api import Page, expect, sync_playwright

def verify_truth_dare(page: Page):
    # Navigate to the page
    page.goto("http://localhost:3000/en/truth-or-dare-generator")

    # Wait for hydration
    page.wait_for_timeout(3000)

    # Verify H1
    h1 = page.get_by_role("heading", name="Truth or Dare Generator", level=1)
    expect(h1).to_be_visible()

    # Verify Direct Answer
    direct_answer = page.get_by_text("What is a Truth or Dare Generator?")
    expect(direct_answer).to_be_visible()

    # Verify some participants are loaded (Check for a question or "Truth"/"Dare" text if visible in the list or wheel)
    # The default view is list or wheel. Let's check for text content in the participants list.
    # Note: MainApp usually renders a list of participants in the sidebar or main area.
    # Let's check if "What is your biggest fear?" is present (it's truth_0).

    # Check for presence of truth text
    # It might be in the sidebar list or in the wheel segments (if wheel is SVG).
    # Sidebar list is easier.

    # Try to find a text that matches one of the questions.
    # "What is your biggest fear?"
    expect(page.get_by_text("What is your biggest fear?")).to_be_visible()

    # Screenshot
    page.screenshot(path="verification/truth_dare.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_truth_dare(page)
            print("Verification successful!")
        except AssertionError as e:
            print(f"Verification failed (assertion): {e}")
            page.screenshot(path="verification/error.png")
        except Exception as e:
            print(f"Verification failed (unexpected): {type(e).__name__}: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
