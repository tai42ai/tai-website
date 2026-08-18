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
