# 🎯 Goal Tracker Pro — Weekly Task Dashboard

A personal weekly productivity tracker built with vanilla HTML, CSS, and JavaScript.
Track your daily tasks, visualise progress with live charts, and export a PDF snapshot — all saved in your browser.

---

## 📸 Dashboard Preview

![Goal Tracker Dashboard](https://raw.githubusercontent.com/GADEKAR328/Goal-Tracker-Dahboard-/9fb4975a6f7d92819854b0725aed7ebee28ea069/Screenshot%20-%20Goal-Tracker-Dahboard-_.jpg)

---

## 📁 Project Structure

weekly-task-dashboard/
├── index.html      ← Main page (HTML structure)
├── style.css       ← All styles and CSS variables
├── script.js       ← All logic: clock, charts, task state, PDF export
├── banner.jpg      ← Motivational banner image
└── README.md       ← This file

---

## ✨ Features

| Feature | Details |
|---|---|
| 👤 Profile Card | Name, birthdate (auto-calculates age), gender, life goal |
| ⏱ 24-hr Day Ring | Canvas-drawn ring showing % of the day elapsed, live clock |
| 📊 KPI Cards | Completed %, Pending %, Total Tasks, Best Day, Avg/Day, Week Score |
| 🍩 Donut Chart | Overall completed vs pending (Chart.js) |
| 📈 Line Chart | Daily % completion trend across the week (Chart.js) |
| ✅ Weekly Checklist | 15 tasks × 7 days, colour-coded per day |
| 💾 Auto-save | Progress persisted in `localStorage` — survives page refresh |
| 📄 PDF Export | One-click A4 landscape PDF via jsPDF + html2canvas |

---

## 🚀 Getting Started

### Option 1 — Open locally
Just double-click `index.html` in your file explorer. No server needed.

### Option 2 — GitHub Pages (recommended)
1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set source to **main branch / root**.
4. Your dashboard will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 📦 Dependencies (loaded via CDN)

| Library | Version | Purpose |
|---|---|---|
| [Chart.js](https://www.chartjs.org/) | 4.4.1 | Donut & line charts |
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.1 | PDF generation |
| [html2canvas](https://html2canvas.hertzen.com/) | 1.4.1 | Page screenshot for PDF |

All CDN links are in `index.html` — no `npm install` needed.

---

## 🛠 Customisation

**Change the task list** — edit the `TASKS` array in `script.js`:
```js
const TASKS = [
  "Plan Daily Tasks",
  "Check Emails & Reply",
  // ... add or remove tasks here
];
```

**Change colours** — edit the CSS variables at the top of `style.css`:
```css
:root {
  --navy:  #1e3a5f;
  --teal:  #0d9488;
  --coral: #c0392b;
  /* ... */
}
```

**Reset weekly progress** — open browser DevTools console and run:
```js
localStorage.removeItem('gtd_yg_v3');
location.reload();
```

---

## 📄 License

MIT — free to use and modify.

---

*Built by Yogesh Gadekar · Goal Tracker Pro · Special Edition · 2026*
