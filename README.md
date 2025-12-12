# Sorteo App Generator

A modern, dynamic, and highly customizable giveaway app generator. Designed to deliver a stunning visual experience with multiple winner visualization modes.

## 🚀 Key Features

- **Multiple Drawing Modes:**
  - 🎰 **Slot Machine:** Classic slot machine style visualization.
  - 🔢 **Matrix:** Digital "Matrix" style effect to reveal winners.
  - 🃏 **Cards:** Selection via interactive cards.
  - 🌊 **Cascade:** Waterfall effect for drawings with multiple winners.

- **Internationalization (i18n):**
  - Full support for multiple languages.
  - Default language: English.
  - Automatically detects and adapts or allows the user to switch languages.
  - Built with `next-intl`.

- **Modern Tech Stack:**
  - **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
  - **Language:** TypeScript
  - **Styling:** Tailwind CSS v4
  - **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + Radix UI
  - **Animations:** Framer Motion

- **SEO & Performance:**
  - Optimized for search engines.
  - Dynamic metadata and JSON-LD.
  - Fast loading and responsive design.

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dorrio/sorteo-app-generator.git
    cd sorteo-app-generator
    ```

2.  **Install dependencies:**
    This project uses `pnpm` for package management.
    ```bash
    pnpm install
    ```

3.  **Start the development server:**
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:3000`.

4.  **Build for production:**
    ```bash
    pnpm build
    pnpm start
    ```

## 📂 Project Structure

- `/app`: Routes and main application logic (Next.js App Router).
- `/components`: Reusable components (UI, drawing logic, etc.).
- `/messages`: Translation files (JSON) for i18n.
- `/public`: Static files and images.
- `/i18n`: Internationalization configuration.
- 

## 📝 License

This project is licensed under the **GNU General Public License v3.0 (GPLv3)**.

You can view the full license file in [LICENSE](LICENSE).

---

Developed with ❤️ to create unforgettable giveaways.
