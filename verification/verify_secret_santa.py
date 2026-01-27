from playwright.sync_api import Page, expect, sync_playwright

def test_secret_santa_page(page: Page):
    # Navigate to the new Secret Santa page
    # Note: Ensure the locale is handled correctly.
    # Usually /en/secret-santa-generator if Next.js middleware enforces locale.
    page.goto("http://localhost:3000/en/secret-santa-generator")

    # Wait for hydration
    page.wait_for_load_state("networkidle")

    # Assert H1
    h1 = page.get_by_role("heading", level=1)
    expect(h1).to_be_visible()
    expect(h1).to_have_text("Free Secret Santa Generator")

    # Assert Direct Answer
    direct_answer = page.get_by_role("heading", name="What is a Secret Santa Generator?")
    expect(direct_answer).to_be_visible()

    # Assert Subtitle
    subtitle = page.get_by_text("Shuffle names and assign Secret Santa pairs instantly.")
    expect(subtitle).to_be_visible()

    # Screenshot
    page.screenshot(path="verification/secret_santa.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_secret_santa_page(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
