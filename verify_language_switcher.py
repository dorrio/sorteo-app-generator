from playwright.sync_api import Page, expect, sync_playwright

def test_language_switcher_accessibility(page: Page):
    """
    This test verifies that the Language Switcher uses semantic <a> tags for links.
    """

    # 1. Arrange: Go to the homepage
    page.goto("http://localhost:3000")

    # 2. Act: Find the language switcher.
    # The button has text "Switch Language" but it's sr-only.
    # We can try to find it by the button itself or the icon.
    # The button has aria-label="Switch Language" implicitly from the span text if properly associated,
    # but the span is just inside. The button itself does not have aria-label.
    # Wait, the button has `aria-label="Switch Language"`? No, the code says:
    # <Button ...><span className="sr-only">{t("switchLanguage")}</span></Button>
    # Playwright's get_by_role("button", name="Switch Language") should find it because of the text content.

    lang_button = page.get_by_role("button", name="Switch Language")
    lang_button.click()

    # 3. Assert: Verify the options are links
    # Find "Español" item.
    # It should be a link now.

    # Wait for menu to open
    page.wait_for_timeout(500)

    # In my changes, DropdownMenuItem uses asChild, and the child is a Link which renders an <a>.
    # However, DropdownMenuItem itself adds role="menuitem".
    # If using asChild, the <a> tag might receive the role="menuitem" OR be nested.
    # Shadcn DropdownMenuItem implementation:
    # <DropdownMenuPrimitive.Item ...> which renders a div by default, but if asChild is true, it renders the child.
    # So the <a> tag will be the menuitem.

    es_link = page.get_by_role("menuitem", name="Español")

    # Verify it is an anchor tag
    tag_name = es_link.evaluate("element => element.tagName")
    print(f"Tag name: {tag_name}")
    assert tag_name == "A"

    # Verify it has an href attribute
    href = es_link.get_attribute("href")
    print(f"Found href: {href}")

    assert href is not None
    assert "/es" in href

    # 4. Screenshot
    page.screenshot(path="/home/jules/verification/language_switcher.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_language_switcher_accessibility(page)
        finally:
            browser.close()
