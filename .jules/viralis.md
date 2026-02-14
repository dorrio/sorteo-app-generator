# Viralis Journal - Growth Experiments

## 2024-05-24 - [Mobile/Sharing]
**Hypothesis:** The current native share implementation (`navigator.share`) creates a "dead end" for users when it fails (e.g., unsupported file types, user cancellation, or platform quirks), reducing the K-Factor.
**Implementation:** Implemented a "Hybrid Share" pattern in `ShareButton`.
- **Logic:** The button attempts a Native Share first. If it fails (throwing an error other than `AbortError`), it automatically falls back to opening the Dropdown Menu with manual sharing options (Copy Link, WhatsApp, etc.).
- **Refactor:** Unified `WinnerCeremony` to use this robust `ShareButton` instead of custom logic, ensuring the "Winner Reveal" moment (highest viral potential) is never a dead end.
**Outcome:** Expected 100% share intent capture. Even if native share fails, the user is immediately presented with alternative actions without needing to click again or guess what happened.
