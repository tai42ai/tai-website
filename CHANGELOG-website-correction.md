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

## Step 6 — Method (`/method`)

- New page `src/pages/method.astro` with the §4.2 copy: H1 "How an engagement
  works", the intro, the numbered five-step line (audit → readiness gate →
  build → acceptance → run), the "Where humans stay" line, the honest filter,
  and the CTA "Book a production audit" (→ the booking link).
- `/how-it-works` redirects here (step 1).

## Step 7 — Platform (`/platform`)

- New page `src/pages/platform.astro` with the §4.3 copy: H1 "BabelFish — the
  platform behind every engagement", the sub, and the blocks "Enterprise by
  design", "Own the logic", "The rule that makes it safe", "Getting started",
  and the honest line. Page action: "Talk to us about a tenant" → `/contact`.
- The one-sentence open-source contract appears verbatim in the honest-line
  block.
- Deleted `src/pages/babelfish/index.astro` (route redirects to `/platform`) and
  `src/pages/pricing.astro` (route redirects to `/platform`).
- §4.3 "existing material to keep":
  - **Kept** — the control-plane visual, i.e. the flow-canvas SVG and the
    version-history panel from the old Babelfish page, re-captioned "the visual
    builder — guardrails, versioned flows, instant rollback."
  - **Missing from the repo** — the "Observe → Identify → Compile" explanation
    and the replay-validation line do not exist anywhere in this repo, so no
    "the optimizer" feature block could be carried over. The optimizer is
    described in the §4.3 sub-line only. Nothing was invented in its place.
  - Nothing to remove: the "Edge compiler proxy / Governance control plane"
    sub-brand split and the "Nexus" naming never existed in this repo.
- The "Read the technical overview" link is **omitted entirely** (gate: white
  paper sign-off) — the [WHITE_PAPER_URL] placeholder therefore does not appear
  in the markup, per §4.3's instruction to omit the link.
- The honest line's agents-door sentence ("If you're an AI agent, connect free
  via our MCP gateway") is **omitted entirely** — it is conditional on `/agents`
  being live, and the gate has not cleared.

## Step 8 — Open Source (`/open-source`)

- `src/pages/open-source.astro` — reworked to the §4.4 copy: H1 "The runtime is
  open", the body with the [DOCS_URL] placeholder in place, the one-sentence
  contract as a blockquote, the links line (GitHub org · GitHub Discussions ·
  docs, all still placeholders), and the two-column open/commercial boundary
  table built against the provisional structure, with the
  [OPEN_COMMERCIAL_BOUNDARY] confirmation note visible above it.
- Removed with the old page: the four-block "what's in the platform" grid, the
  self-host section, the "TAI42 Cloud" managed-service card and its pricing link,
  and the hard-coded GitHub/docs URLs (they are founder-confirmed placeholders
  now).
- **New component**: `src/components/Placeholder.astro` — a bordered, muted,
  monospace "[LABEL — note]" chip used to keep every unfilled value visible in
  the rendered page. No new colors, fonts, or dependencies.

## Step 9 — About (`/about`)

- New page `src/pages/about.astro` with the §4.5 copy: H1 "The self-driving
  company, the honest way", the body, "Who built this" and "Team".
- Both gated items are rendered as visible placeholder chips:
  [FOUNDER_CREDIBILITY_LINE] and [TEAM_AND_AGENT_ROSTER]. Nothing was written in
  their place.
- Deleted `src/pages/company/about.astro`; `/company/about` redirects to
  `/about` (step 1).

## Step 10 — Contact (`/contact`)

- New page `src/pages/contact.astro` with the §4.6 copy: the intro line as the
  page heading, the three questions as labeled textareas, plus name, company and
  email inputs. Submit button: "Book your production audit".
- Backend: plain HTML POST to `https://api.web3forms.com/submit` (no npm
  dependency). Hidden fields: `access_key` (visible [WEB3FORMS_ACCESS_KEY]
  placeholder), `subject`, `redirect` → `https://tai42.ai/thank-you?page=contact`,
  and `source`. Web3Forms `botcheck` honeypot included.
- A small inline script reads UTM params (or the referrer, else "direct"), fills
  the hidden `source` input and appends `&source=…` to the redirect URL so the
  thank-you page can fire the analytics event.
- Native HTML validation only: `required` on every field, `type="email"` on the
  email input.
- Deleted `src/pages/company/contact.astro` (the investor / enterprise /
  developer mailto cards); `/company/contact` redirects to `/contact` (step 1).

## Step 11 — Thank you (`/thank-you`)

- New page `src/pages/thank-you.astro`. Copy is deliberately minimal and
  neutral (this page's wording is not specified in §4): one short line, then the
  booking link as the prominent action, using the sitewide CTA label.
- Fires `qualified_form_submission` once per session via `window.plausible`,
  with the `page` and `source` props read from the query string (both are set by
  the form's redirect URL). No event fires without a `page` param.
- `noindex, nofollow` meta.
- `src/layouts/BaseLayout.astro` — added an optional `noindex` prop (used here
  and by `/agents`) and updated the default title/description, which still
  described the old positioning.
