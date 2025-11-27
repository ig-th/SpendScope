# SpendScope 🐢

**SpendScope** is a modern, privacy-first personal expense tracker designed for travelers and international citizens. It focuses on seamless **multi-currency support**, intuitive **data visualization**, and complete **data privacy**.

Everything is stored locally on your device. No sign-ups, no servers, no tracking.

![SpendScope Preview](https://placehold.co/1200x630/0891b2/ffffff?text=SpendScope+v1.0)

## ✨ Key Features

### 🌍 Smart Multi-Currency
- **Real-time Conversion**: Track expenses in TWD, USD, JPY, EUR, KRW, and more.
- **Unified Views**: Automatically converts all spending to your home currency for accurate totals and charts.
- **Custom Rates**: Adjust exchange rates manually for historical accuracy.

### 📊 Insightful Visualization
- **Category Pie Chart**: See exactly where your money goes (Food, Transport, Housing, etc.).
- **Trend Bar Chart**: Analyze spending patterns over Days, Months, or Years.
- **Interactive Tooltips**: Hover to see precise details.

### 🔒 Privacy & Data Ownership
- **Local Storage**: All data resides in your browser's `localStorage`.
- **Offline First**: Works without an internet connection (once loaded).
- **Import/Export**: Full JSON backup and restore functionality. Move your data between devices easily.

### 🎨 Modern Experience
- **Dark Mode**: Built-in support for system theme preference or manual toggle.
- **Responsive Design**: Optimized for Desktop, Tablet, and Mobile.
- **Installable (PWA-like)**: Add to your mobile home screen for an app-like experience.
- **Multi-language**: Supports English, Traditional Chinese (繁體中文), and Japanese (日本語).

---

## 🚀 Getting Started

You can use the application directly if hosted, or run it locally.

### Installation (Local Development)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/spendscope.git
    cd spendscope
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## 🛠️ Tech Stack

Built with a focus on performance, type safety, and maintainability.

*   **Core**: [React 18](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts**: [Recharts](https://recharts.org/)

---

## 📂 Project Structure

```text
/
├── components/       # Reusable UI Components (Charts, Forms, DatePicker)
├── utils/            # Helper functions, Currency logic, Translations
├── App.tsx           # Main Application Logic
├── types.ts          # TypeScript Definitions
├── constants.ts      # Configs, Colors, Default Rates
└── index.html        # Entry Point
```

---

## 🌐 Deployment

This project is configured for easy deployment to **GitHub Pages**.

### 1. Automatic Deployment (GitHub Actions)
1. Push this code to a GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, select **GitHub Actions**.
4. GitHub will detect the workflow and deploy automatically.

### 2. Manual Deployment
```bash
# Builds the app and pushes the 'dist' folder to the 'gh-pages' branch
npm run deploy
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ for financial clarity.
</p>
