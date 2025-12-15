# STRUCTURA'S JOURNAL - ARCHITECTURAL BLUEPRINTS

## 2025-05-23 - [SorteoApp/HistoryPanel] **Break:** [Skipped level detected (H1 -> H3)] **Fix:** [Promoted H3 to H2] **Note:** [Visuals preserved via Tailwind classes]
* **Context**: `app/[locale]/page.tsx` and `components/sorteo/history-panel.tsx`.
* **Discovery**: The main title is `<h1>`. The "Participants" section and "History" section (sidebar items) are marked as `<h3>`, skipping `<h2>`.
* **Strategy**:
    1. Promote "Participants title" `<h3>` to `<h2>` in `page.tsx`.
    2. Promote "History title" `<h3>` to `<h2>` in `history-panel.tsx`.
    3. Keep existing Tailwind classes (`text-lg font-bold`, `font-semibold`) to maintain the visual hierarchy.
