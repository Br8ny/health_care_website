# Contributing

Thanks for taking the time to contribute to Health Care Website.

## Getting set up

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build and lint must pass before anything is merged:

```bash
npm run lint
npm run build
```

## Workflow

1. Branch from `main` (`git checkout -b feat/your-change`).
2. Keep the change scoped to one concern.
3. Run the checks above.
4. Open a pull request against `main` and fill in the PR template.

## Conventions

- **Commits** follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`,
  `chore:`), imperative mood, subject under ~72 characters.
- **React**: functional components and hooks only; keep styles in Tailwind utility
  classes plus `src/index.css`; design tokens live under `@theme` in `src/index.css`.
- **Data**: this project is frontend-only with mock records — do not introduce a
  backend, API keys, or analytics without discussing it in an issue first.
- **Secrets**: never commit `.env` files or credentials.

## Reporting bugs

Open an issue with steps to reproduce, expected vs actual behaviour, and whether
it happens on mobile widths. Include a sample patient record when relevant.

## Requesting a feature

Open an issue describing the clinical workflow it supports. Changes to triage
priorities (`src/utils/triageLogic.js`) need maintainer discussion before
implementation, since they affect how patients are ranked.
