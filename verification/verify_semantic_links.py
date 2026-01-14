from playwright.sync_api import Page, expect, sync_playwright

def test_semantic_anchor(page: Page):
  page.goto("http://localhost:3000/en/random-number-generator")

  cta_link = page.get_by_role("link", name="Generate Random Number")
  expect(cta_link).to_be_visible()
  expect(cta_link).to_have_attribute("href", "#sorteo-section")

  section = page.locator("#sorteo-section")
  expect(section).to_be_visible()

  # Use relative path
  page.screenshot(path="verification/rng-anchor.png")

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
      test_semantic_anchor(page)
    finally:
      browser.close()
