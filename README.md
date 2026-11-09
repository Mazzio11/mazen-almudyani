# Mazen Almudyani — portfolio

A bilingual, static portfolio built with React, TypeScript, Vite, Lucide and a centralized CSS design system. English is the default; Arabic includes RTL layout and persistent language selection. Exactly three projects have dedicated hash-routed case studies.

## Develop

Use Node 24 and pnpm 11 (or install pnpm with `npm install -g pnpm@11`).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
```

Local environment note: this Codex runtime bundles Node and pnpm but does not expose npm. Equivalent direct Node commands work for installed packages: `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174`, `node node_modules/typescript/bin/tsc --noEmit`, `node node_modules/eslint/bin/eslint.js src`, and `node node_modules/vite/bin/vite.js build`.

## Structure

- `src/content.ts`: bilingual project data, timeline and skills; source-backed case-study copy.
- `src/main.tsx`: navigation, landing sections, case-study template and native-dialog gallery.
- `src/styles.css`: tokens, original CSS illustrations, responsive layouts and reduced-motion overrides.
- `public/media/`: optimized supplied screenshots and original SVG branding. No screenshots are generated.
- `scripts/qa.mjs`: browser checks and screenshots, defaulting to the local server at port 5174.
- `.github/workflows/deploy.yml`: manually triggered deployment after public-content review.

## Routing and accessibility

`#/projects/<slug>` routes survive refresh on GitHub Pages without server rewrites. Vite uses `base: './'` so a user root repository and repository subpath both work. The application has a skip link, semantic landmarks, keyboard-operated timeline disclosures, accessible dialog with native focus trapping, arrow-key gallery navigation, Escape dismissal, and focus-visible indicators. All screenshots have captions and alt text. Missing or unapproved media is documented instead of shown as fake evidence.

## Content boundaries

No backend, analytics, forms, external AI requests or live project demos. Email is an approved mailto link. Google Fonts is the only external presentation request; system fallbacks remain available offline. Contact copy uses Clipboard API with a mailto fallback. No CV or social URLs are invented. The initial personal spelling in Arabic is a transliteration and should be reviewed by the owner.

## Verification

Run `node scripts/qa.mjs` with the dev server active. Install the Playwright browser using `pnpm exec playwright install chromium` if needed. Browser paths can be supplied through `PLAYWRIGHT_BROWSERS_PATH`. QA images and machine-readable results are written to ignored `qa/`. See `FINAL_REPORT_AR.md` for the actual execution results and limitations.

The media preparation script is a local authoring utility with original attachment paths, not part of deployment. It requires an installed Sharp module path as its argument. Committed WebP assets require no image tooling during a normal build.

Deployment guidance follows the official Vite static-deployment documentation: https://vite.dev/guide/static-deploy.html. The public username and repository are deliberately not guessed.

