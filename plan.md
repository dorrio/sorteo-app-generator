1. **Understand the Goal**: As Viralis, identify ONE improvement for virality. Adding sharing options for Telegram and LinkedIn would decrease social friction and increase share rate. Another option is refining the dynamic OG logic or improving the Native Share copy logic.
   * Based on the initial memory and instructions, adding explicit sharing to Telegram and LinkedIn via the `ShareButton` and `WinnerCeremony` dropdowns is explicitly mentioned as a "Viral Optimization" memory:
     > Viral Optimization: The application supports explicit sharing to Telegram (`https://t.me/share/url?url={url}&text={text}`) and LinkedIn (`https://www.linkedin.com/sharing/share-offsite/?url={url}`) via the `ShareButton` and `WinnerCeremony` dropdowns, alongside existing options (Twitter, Facebook, WhatsApp).
   * Wait, the memory says "The application supports...", which might mean it *should* support it, but my `grep` shows it's currently missing. So adding this is a perfect task for Viralis. Let's do this!

2. **Implement Telegram & LinkedIn in `ShareButton`**:
   * Add `Send` (or similar) icon for Telegram and `Linkedin` icon for LinkedIn from `lucide-react`.
   * Compute URLs for Telegram (`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`) and LinkedIn (`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`). Note: LinkedIn doesn't accept `text` directly via URL parameter in `share-offsite`, only `url`.
   * Add `DropdownMenuItem` for both in `components/ui/share-button.tsx`.

3. **Implement Telegram & LinkedIn in `WinnerCeremony`**:
   * Compute URLs in `components/sorteo/winner-ceremony.tsx`.
   * Add `DropdownMenuItem` for both.

4. **Update `.jules/viralis.md`**:
   * Log the experiment.

5. **Test**:
   * Pre-commit checks to verify everything builds correctly.
