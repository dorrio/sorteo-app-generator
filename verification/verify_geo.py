from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        tools = [
            ("RNG", "http://localhost:3000/en/random-number-generator"),
            ("List", "http://localhost:3000/en/list-randomizer"),
            ("Team", "http://localhost:3000/en/team-generator"),
            ("SecretSanta", "http://localhost:3000/en/secret-santa-generator"),
        ]

        for name, url in tools:
            print(f"Verifying {name} at {url}...")
            try:
                page.goto(url)
                # Wait a bit for hydration just in case
                page.wait_for_timeout(2000)

                # Take screenshot immediately to see what's happening
                page.screenshot(path=f"verification/{name.lower()}_geo.png")
                print(f"Screenshot taken for {name}")

                # Check for H2
                h2s = page.locator("h2").all_inner_texts()
                print(f"Found H2s: {h2s}")

            except Exception as e:
                print(f"Error checking {name}: {e}")

        browser.close()

if __name__ == "__main__":
    run()
