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
- The plain `plausible.io/js/script.js` is the correct script here: it already
  supports manually-fired custom events with props via `window.plausible(...)`.
  The `script.tagged-events.js` / `script.pageview-props.js` variants exist only
  for *auto-capture* (click-tagged elements, props attached to every pageview),
  which this site does not use — so no variant script is needed for the single
  `qualified_form_submission` event.
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

## Step 12 — Builders (`/builders`)

- New page `src/pages/builders.astro` with the §4.7 copy verbatim: H1 "Your
  clients. Our engine.", the sub, the body, and the honest line.
- Waitlist form: company · what you deliver today (agency / dev shop / service
  firm / operator) · roughly how many clients · email, button "Join the founding
  waitlist". Same Web3Forms routing as `/contact`, redirecting to
  `https://tai42.ai/thank-you?page=builders`, same hidden `source` handling and
  `botcheck` honeypot.
- Hard content rule honored: no dates, no prices, no speed numbers, no mechanism
  names on this page.
- Linked from the footer ("For builders →") and the Home doors line only.

## Step 13 — Agents (`/agents`) — GATED, unlinked

- New page `src/pages/agents.astro` with the §4.8 copy. Every value is a visible
  placeholder: [MCP_ENDPOINT], [TOOL_LIST], [TRIAL_KEY_INSTRUCTIONS], [DOCS_URL].
- The page is linked from **nowhere**: not in the nav, not in the footer, not in
  the Home doors line, not in the Platform honest line. It also carries
  `noindex, nofollow` because it is unpublished, machine-facing, and its gate
  has not cleared.
- Gate: the MCP endpoint responds and the placeholders are filled. Only then add
  the footer link ("For AI agents →"), the Home doors-line entry, the Platform
  honest-line sentence, the `/llms.txt` MCP gateway line, and remove the noindex.

## Step 14 — `/llms.txt`

- New `public/llms.txt`, served at the site root, with the §5.5 content.
- "- Docs: [DOCS_URL]" stays as a visible placeholder line.
- The "## For agents" section and its "MCP gateway" line are **omitted
  entirely** — the gate has not cleared. Add both when `/agents` goes live.

## Step 15 — Legal pages, careers, unused components

- `/security`, `/privacy`, `/terms` and `/company/careers` were checked for
  certification / badge language (SOC, SOC 2, "certified", ISO 27001,
  compliance badges): **none present**, so their copy is untouched.
- Two link fixes only: `src/pages/privacy.astro` and
  `src/pages/company/careers.astro` pointed at the deleted `/company/contact`;
  they now point at `/contact` directly instead of going through the redirect.
- Deleted `src/components/FinalCTA.astro` and `src/components/SecurityStrip.astro`
  — both became unused (their only importers were the old Home and Babelfish
  pages). Nothing is commented out or hidden; the files are gone.
- Careers stays at `/company/careers`, unchanged and unlinked from nav/footer.

## Step 16 — Placeholder list, gates, and the work outside this repo

### Gates and build results

- `npx astro check` — 0 errors, 0 warnings, 0 hints (20 files).
- `npm run build` — 13 pages built, no errors. Routes: `/`, `/method`,
  `/platform`, `/open-source`, `/about`, `/contact`, `/builders`, `/thank-you`,
  `/agents` (unlinked, noindex), `/security`, `/privacy`, `/terms`,
  `/company/careers`, plus the redirect pages.
- Redirects are Astro static redirect pages (meta refresh + canonical +
  `noindex`), not HTTP 301s — GitHub Pages cannot emit true 301s. Verified in
  the build output: `/pricing`, `/babelfish`, `/babelfish/agentic-to-flow`,
  `/product/babelfish`, `/product/nexus`, `/how-it-works`, `/company/about`,
  `/company/contact`.

### Open placeholders (founder fills these before publishing)

| Placeholder | Where it appears |
|---|---|
| `[WEB3FORMS_ACCESS_KEY]` | `src/pages/contact.astro` and `src/pages/builders.astro` — the `access_key` hidden input, plus a label-only chip under each submit button |
| `[DOCS_URL]` | `src/pages/open-source.astro` (body + links line), `src/pages/agents.astro`, `public/llms.txt` — rendered label-only; the value is in the docs section below |
| `[GITHUB_ORG_URL]` | `src/pages/open-source.astro` — links line (org and Discussions) |
| `[OPEN_COMMERCIAL_BOUNDARY]` | `src/pages/open-source.astro` — note above the boundary table |
| `[FOUNDER_CREDIBILITY_LINE]` | `src/pages/about.astro` — "Who built this" |
| `[TEAM_AND_AGENT_ROSTER]` | `src/pages/about.astro` — "Team" |
| `[MCP_ENDPOINT]` (gated) | `src/pages/agents.astro`; also the omitted `/llms.txt` MCP line |
| `[TOOL_LIST]` (gated) | `src/pages/agents.astro` |
| `[TRIAL_KEY_INSTRUCTIONS]` (gated) | `src/pages/agents.astro` |
| `[WHITE_PAPER_URL]` (gated) | Nowhere — the "Read the technical overview" link is omitted entirely until engineering sign-off |

Resolved, no longer placeholders: FOUNDER_EMAIL = `balin.miki@tai42.ai` (the
Web3Forms account address) and CALENDAR_URL = the existing Google Calendar
booking link, used by every "Book a production audit" CTA and by `/thank-you`.

### Activation: Web3Forms (founder, before publish)

1. Create a Web3Forms access key for **balin.miki@tai42.ai** at
   https://web3forms.com — submissions are emailed to that address; no CRM, no
   automation.
2. Replace `[WEB3FORMS_ACCESS_KEY]` in `src/pages/contact.astro` and
   `src/pages/builders.astro` (constant at the top of each file), and delete the
   `<Placeholder label="WEB3FORMS_ACCESS_KEY" />` chip under each submit button.
3. Submit each form once to confirm the mail arrives and that the redirect lands
   on `/thank-you/?page=contact&source=…` / `?page=builders&source=…`.

### Activation: Plausible (founder, before publish)

1. Register the site **tai42.ai** in Plausible (or swap the provider in
   `src/layouts/BaseLayout.astro` — it is a single script tag plus the queue
   stub). Until the site exists, the script loads and records nothing.
2. The only custom event is `qualified_form_submission`, with the properties
   `page` (contact / builders) and `source` (UTM string, referrer, or "direct").
   Enable those two custom properties in the Plausible dashboard to see them.

### Outside this repo — docs (change order §5.6)

1. Point `docs.tai42.ai` at the Mintlify custom domain (CNAME), then use that
   URL wherever `[DOCS_URL]` is still a placeholder; until the CNAME is live the
   value is the Mintlify subdomain `tai42.mintlify.app`. That staging host is
   recorded here only — it is deliberately not printed in any page's chip.
2. Change the docs landing line from "TAI42 — the OS for AI tools" to
   "the tai42 runtime — the open runtime behind the tai42 platform".
3. Add the one-sentence contract verbatim to the docs landing page:
   > tai42 builds and runs its business on this runtime; the code is open; the company sells the hosted platform and enterprise layer on top — never a different core.
4. Add a link back to tai42.ai from the docs landing page.

### Outside this repo — GitHub org (change order §5.7)

1. Enable Discussions on the organization (it is the community forum the
   `/open-source` links line points to).
2. Open the org README with the one-sentence contract, verbatim, as the first
   line:
   > tai42 builds and runs its business on this runtime; the code is open; the company sells the hosted platform and enterprise layer on top — never a different core.
3. Make the license file visible at the org/repo root.
4. Send the org URL back so `[GITHUB_ORG_URL]` can be filled on `/open-source`.

### Known conflict, reported not worked around

- Change order §5.1 requires the redirect `/product/nexus` → `/platform`, while
  §1 and acceptance test #1 require zero repo-wide hits for "Nexus". The
  redirect is implemented as specified; the string therefore survives **only**
  as the legacy source path `"/product/nexus"` in `astro.config.mjs` and in the
  generated redirect page under `dist/product/nexus/`. It appears nowhere in
  page copy, navigation, or as a product name. Drop the redirect if the zero-hit
  rule is meant to win (that route never existed in this repo anyway).

## Step 17 — Cold-review fixes

A fresh-context review of the branch found the items below. Each is a fix to
work already on this branch; no §4 copy was changed except where a factual
error made it wrong to publish.

### ⚠️ Legal copy edited — founder/legal voice pass required before publish

`/privacy` and `/terms` asserted things that this branch made untrue the moment
it shipped Plausible and two Web3Forms forms. The false statements were
corrected; **the corrected wording is engineering's best plain-language
description of the actual behaviour, not approved legal copy — the founder (and
legal, if involved) must read and sign off on `/privacy` §"What This Site
Collects" / §"When You Contact Us" and `/terms` §5 before the site goes live.**

- `src/pages/privacy.astro` — the page claimed "no accounts, no analytics, no
  tracking, no cookies, and no forms that send us your data" and "We do not run
  analytics … takes no data from you". Now stated accurately, in the page's own
  voice and structure:
  - Plausible is named as a cookie-free, privacy-respecting analytics service
    that collects aggregate page statistics only — no cookies, no cross-site
    tracking, no personal profile — plus the single
    `qualified_form_submission` event fired on `/thank-you`.
  - The contact and builders forms are described: they send exactly what the
    visitor types, plus a `source` tag (how they arrived), via Web3Forms to our
    email, used only to reply — no CRM, no automation, no resale. Booking runs
    through Google Calendar's appointment page.
  - Still-true statements kept and made precise: no accounts, and no cookies
    (Plausible sets none). The GitHub Pages hosting-log card is unchanged.
  - The H1's "We Collect Nothing on This Site" was factually false and became
    "Here Is Exactly What This Site Collects."
- `src/pages/terms.astro` §5 — "This website collects nothing about you" →
  "This website's analytics are cookie-free and aggregate, and anything you send
  through its forms is used only to respond to you." Nothing else in terms
  changed except the naming fix below.

### Naming — the sub-brand is "BabelFish"

- "Babelfish Flows" (an invented sub-brand) → "BabelFish" in
  `src/pages/privacy.astro`, `src/pages/terms.astro` (§1, §3 heading and body,
  §4, §5), `src/pages/security.astro`, `src/pages/company/careers.astro`.
  Word-level replacements only; one verb agreement followed ("Flows replace" →
  "BabelFish replaces"). `grep -r "Babelfish" src/` is now 0.
- `src/pages/platform.astro` — the section comment "the visual builder (kept
  visuals from the former Babelfish page)" → "The visual builder". Comments
  carry no migration history.

### Careers page

- `src/pages/company/careers.astro` — added `noindex` (the page is unlinked from
  nav and footer, same treatment as `/agents` and `/thank-you`), plus its own
  title and description.

### Meta titles and descriptions — legal + careers pages

`/privacy`, `/security`, `/terms` and `/company/careers` still carried the old
"X - TAI42" titles and inherited the homepage description. Each now has a title
in the site convention ("Privacy — tai42", "Security — tai42", "Terms of
Service — tai42", "Careers — tai42") and a one-sentence description written
from that page's own intro — no new claims.

### Placeholder chips no longer leak values into rendered pages

- `src/pages/contact.astro`, `src/pages/builders.astro` — the
  `[WEB3FORMS_ACCESS_KEY]` chip carried the note "created for
  balin.miki@tai42.ai", printing the founder's address into public page text.
  The note is gone; the chip is label-only. The address and the full activation
  steps stay in "Activation: Web3Forms" above.
- The invented visible sentence "Form delivery is inactive until the access key
  is filled in:" and its wrapping `<p>` were removed from both pages — it was
  not §4 copy. The chip alone remains.
- `src/pages/open-source.astro` (body + links line) and `src/pages/agents.astro`
  — the `[DOCS_URL]` chips printed the staging host `tai42.mintlify.app`. Now
  label-only; the staging host is recorded in "Outside this repo — docs" above.
- `grep -ri balin dist/` and `grep -ri mintlify dist/` are 0, except the
  deliberate `mailto:balin.miki@tai42.ai` contact link in `/terms` §8, which is
  published contact copy, not a leak.

### Open Source page

- `src/pages/open-source.astro` — removed the invented H2 "What is open, what is
  commercial" and the invented lead-in "Provisional structure, pending founder
  confirmation:". The boundary table is unchanged, and the
  `[OPEN_COMMERCIAL_BOUNDARY — founder confirms before publish]` chip still sits
  directly above it.

### Form script — consolidated and corrected

- New `src/components/FormSourceScript.astro` holds the single `is:inline`
  script that stamps `source` onto every `form[data-web3form]`. Both
  `/contact` and `/builders` import it; the duplicated (and, on `/contact`,
  mis-indented) 20-line copies are gone. The generic `form[data-web3form]`
  selector is kept.
- Referrer guard: `document.referrer` now counts as the source only when its
  host differs from `location.host`. An in-site navigation used to be recorded
  as the referrer instead of "direct".
- Idempotence: the redirect value is derived from `redirectInput.defaultValue`,
  so a re-run after a bfcache / history restore can no longer append
  `&source=…` twice. `encodeURIComponent` is unchanged.
- Both hidden `redirect` inputs now use a trailing slash —
  `https://tai42.ai/thank-you/?page=contact` and `…?page=builders` — which
  avoids an extra host-level redirect hop after the Web3Forms POST.
- Each form gained a hidden `from_name` input ("tai42.ai contact form" /
  "tai42.ai builders waitlist") so the notification mail is identifiable.

### Markup and structure

- `src/pages/method.astro` — `<Reveal>` renders a `<div>`, and it was wrapping
  each `<li>` inside `<ol class="space-y-6">`, which is invalid HTML. The
  reveal mechanism (`class="reveal"` + the `transition-delay` inline style) is
  now applied to the `<li>` elements directly, so the `<ol>` has only `<li>`
  children and the 75 ms stagger is preserved. Verified in the build output: no
  non-`<li>` direct child of any `<ol>` in `dist/`.
- `src/components/Placeholder.astro` — collapsed the redundant inner `<span>`;
  the outer `class:list` span now holds the text directly.
- `src/layouts/BaseLayout.astro` — added `og:image:alt` and `twitter:image:alt`
  ("tai42 logo"), which the OG block was missing.

### Shared constant

- New `src/consts.ts` exports `CALENDAR_URL`. The literal was duplicated in
  `src/pages/index.astro`, `src/pages/method.astro`, `src/pages/thank-you.astro`
  and `src/components/NavBar.astro`; all four now import it.

### Gates after the cold-review fixes

- `npx astro check` — 0 errors, 0 warnings, 0 hints (22 files).
- `npm run build` — 13 pages built, no errors.
- Banned strings still 0 ("Nexus" outside the `astro.config.mjs` redirect path,
  SOC, certified, autopilot, disrupt, "Request access", "No credit card", €,
  `base_url`). The one-sentence contract still appears in 3 source locations
  (Footer, `/open-source`, `/platform`) and the CTA label count is unchanged.
