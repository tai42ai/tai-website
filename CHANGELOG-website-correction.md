# CHANGELOG — website correction v1.5

Branch: `website-correction-v1.5`. Implements the change order "tai42.ai Website
Correction (Change Order v1.5)" — content and structure correction only: no new
colors, fonts, icon sets, animation libraries, or npm dependencies.

Not deployed. The founder does the voice pass, fills the open placeholders (see
"Open placeholders" at the bottom), and publishes.

---

## Step 1 — changelog scaffold + redirects

- Created this changelog.
- `astro.config.mjs` — redirect map rewritten. Astro's static `redirects` emit
  meta-refresh redirect pages (GitHub Pages cannot serve true HTTP 301s); this
  is the settled approach for this repo.
  - Added: `/product/babelfish` → `/platform`, `/product/nexus` → `/platform`,
    `/how-it-works` → `/method`, `/pricing` → `/platform`, `/babelfish` →
    `/platform`, `/company/about` → `/about`, `/company/contact` → `/contact`.
  - Kept: `/babelfish/agentic-to-flow` → `/platform` (was → `/babelfish`).
  - Removed: `/about` → `/company/about` and `/contact` → `/company/contact` —
    the new pages live AT `/about` and `/contact`, so the old entries would have
    created redirect loops.
- `/product/*` and `/how-it-works` never existed in this repo; those two
  redirects are created anyway per the change order (harmless).
- No "Request access" destination exists in this repo, so the
  "Request access → /contact" redirect has no source route to map.

## Step 2 — NavBar

- `src/components/NavBar.astro` — navigation is now exactly the six links
  (Home · Method · Platform · Open Source · About · Contact) plus the single
  primary CTA button "Book a production audit", pointing at the existing
  booking link (CALENDAR_URL). Applied to both the desktop and the mobile block.
- Removed: the Company dropdown (and its mobile accordion plus the accordion
  JS), the Docs link, the Babelfish and Pricing links, the mobile GitHub link,
  and the old "Talk to us" CTA.

## Step 3 — Footer

- `src/components/Footer.astro` — rebuilt: the six site links; a "Doors" column
  with "For builders →" (`/builders`) only; the one-sentence open-source
  contract verbatim; legal links (Security / Privacy / Terms); and the footer
  line "tai42 — we take AI from demo to production."
- No `/agents` link anywhere (gate not cleared). Careers is unlinked but the
  page is kept at `/company/careers`. The Docs, GitHub, Babelfish and Pricing
  links are gone.

## Step 4 — Plausible analytics in the base layout

- `src/layouts/BaseLayout.astro` — added the deferred Plausible script
  (`data-domain="tai42.ai"`) plus the standard `window.plausible` queue stub, so
  custom events with properties can be fired before the script finishes
  loading. Nothing else on the layout changed.
- One event only: `qualified_form_submission` with `page` and `source` props,
  fired from `/thank-you` (step 11).
- The script is inert until the founder creates the Plausible site for
  `tai42.ai` — see the activation instructions at the end of this changelog.

## Step 5 — Home (`/`)

- `src/pages/index.astro` — replaced entirely with the §4.1 copy: hero H1 and
  sub, the single primary CTA "Book a production audit" (→ the booking link),
  the proof strip, the doors line (builders door only — the agents door is
  omitted, gate not cleared), the "The problem" and "What we do" blocks, and the
  three "Why it holds" text cards (Gates, not promises. / Speed with receipts. /
  The AI can't touch your money.).
- Removed with the old page: the "THE OPEN AGENT PLATFORM COMPANY" eyebrow, the
  two-pillar Open Source / Babelfish product grid, the "Explore the platform" and
  "Meet Babelfish" CTAs, the pricing link, and the `FinalCTA` band.
- The removal list in §4.1 (AGENTIC GATEWAY eyebrow, "Stop paying frontier
  prices…", the `base_url` block, "No credit card needed", the "Request access"
  buttons, the trust-badge row) had no counterpart in this repo — none of those
  strings existed here.
