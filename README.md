# Health Care Website

A responsive hospital / patient-trials front office built with **React 19 + Vite 8 +
Tailwind CSS v4**. It gives clinic staff a single dashboard for registering patients,
reviewing triage priority, browsing results and reading aggregate reports.

Runs entirely in the browser against mock data — no backend, no API keys.

![CI](https://github.com/Br8ny/health_care_website/actions/workflows/ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](#license)

---

## Features

| Area | What you get |
|---|---|
| **Login** | Local session gate (`localStorage`) with demo credentials pre-filled |
| **Dashboard** | Headline metrics and today's activity snapshot |
| **New Patient** | Validated registration form that feeds the queue |
| **Patient Queue** | Sortable / filterable waiting list with triage priority badges |
| **Patient details** | Modal view of vitals, history and notes |
| **Results** | Recorded test results per patient |
| **Reports** | Aggregate charts and department-level statistics |
| **Responsive shell** | Collapsible sidebar, mobile-friendly layout, Framer Motion transitions |

Triage priority is derived from vitals by `src/utils/triageLogic.js`; sample records
live in `src/data/mockPatients.js`.

---

## Tech stack

- **UI**: React 19, React Router 7, Tailwind CSS 4 (via `@tailwindcss/vite`)
- **State**: React state + `localStorage` persistence; `react-hot-toast` notifications
- **Icons / motion**: `lucide-react`, Framer Motion
- **Tooling**: Vite 8, ESLint 9 (flat config), PostCSS / Autoprefixer

---

## Getting started

Requires **Node.js 20+**.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # production bundle into dist/
npm run preview    # serve the production build locally
npm run lint       # eslint .
```

---

## Project structure

```
health_care_website/
├── index.html
├── vite.config.js               # Vite + React + Tailwind v4 plugins
├── eslint.config.js
├── public/                      # logo.png, favicon.svg (static assets)
└── src/
    ├── main.jsx                 # entry point
    ├── App.jsx                  # routes + auth guard
    ├── index.css                # Tailwind v4 import + @theme design tokens
    ├── components/              # Layout, Sidebar, Navbar, Cards, PatientCard,
    │                            # PatientDetailsModal, RiskBadge, AlertBanner
    ├── pages/                   # Login, Dashboard, NewPatient, Queue, Results, Reports
    ├── data/mockPatients.js     # seed records
    └── utils/triageLogic.js     # priority classification
```

---

## Configuration

No environment variables are required. Theme colours are design tokens declared in
`src/index.css` under `@theme` (Tailwind v4) — adjust them there to re-skin the app.

---

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`: installs
dependencies with `npm ci`, lints, then builds for production.

---

## Contributing

Bug reports and pull requests are welcome. Keep changes focused, run
`npm run lint` and `npm run build` before pushing, and follow Conventional Commits
(`feat:`, `fix:`, `docs:`, `chore:`) for commit subjects.

---

## Known limitations

- **Demo only.** Authentication is a client-side `localStorage` check and the sign-in
  screen accepts the seeded users — there is no server, so it provides no real access
  control. Do not deploy this as a production medical system.
- All patient data is mock data generated in the browser.
- No persistence beyond `localStorage`; clearing site data loses added patients.

---

## License

Released under the [MIT License](LICENSE).
