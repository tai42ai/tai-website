# CHANGELOG — website correction v1.5

Branch: `website-correction-v1.5`. Implements the change order "tai42.ai Website
Correction (Change Order v1.5)" — content and structure correction only: no new
colors, fonts, icon sets, animation libraries, or npm dependencies.

Not deployed. The founder does the voice pass, fills the open placeholders (see
"Open placeholders" at the bottom), and publishes.

**Before publishing: `/privacy`, `/terms` and `/security` were rewritten by
engineering to describe what this site and the products actually do. That
wording is plain-language accuracy, not approved legal copy — the founder and
legal counsel must read and sign off on all three pages, and counsel must add
the controller identity, retention statement, and data-subject-rights section
that `/privacy` still lacks.** Details in the Step 17 and Step 18 blocks below.

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
  compliance badges): **none present**, so no badge language was removed.
  (Superseded: their copy did *not* stay untouched — Steps 17 and 18 corrected
  factual claims on all three legal pages, and Step 18 edited the careers body.
  See those steps for what changed and for the legal sign-off requirement.)
- Two link fixes only: `src/pages/privacy.astro` and
  `src/pages/company/careers.astro` pointed at the deleted `/company/contact`;
  they now point at `/contact` directly instead of going through the redirect.
- Deleted `src/components/FinalCTA.astro` and `src/components/SecurityStrip.astro`
  — both became unused (their only importers were the old Home and Babelfish
  pages). Nothing is commented out or hidden; the files are gone.
- Careers stays at `/company/careers`, unlinked from nav/footer. (Superseded:
  Step 17 added `noindex`, a title and a description; Step 18 fixed a dash in
  the body sentence.)

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

Added after Step 18 (same sign-off, wider scope):

- `/security` is now in scope too — its self-hosting claims were rescoped to
  the open-source runtime vs. the hosted BabelFish tenant (Step 18, fix 1).
- **`/privacy` now describes real data processing (Plausible, Web3Forms, GitHub
  Pages logs, a session-storage entry) but still has no controller identity, no
  retention statement, and no data-subject-rights section. Engineering
  deliberately did not invent those legal commitments — legal counsel must
  draft them before publish.**
- `/terms` "Effective date" was moved from February 2026 to **August 2026**
  because §7 promises the date is updated on material change and Steps 17–18
  changed §5. The founder must re-verify the date at the actual publish date.

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

## Step 18 — Cold-review fix wave 2

A second fresh-context review of the branch. Every fix below touches legal
pages, layout wrappers, hrefs, meta, or this changelog — **no §4 marketing copy
was altered** (home, method, platform, open-source, about, contact, builders,
agents changed only in `href` values and one comment syntax).

### Self-hosting claims rescoped to the right product

The legal pages predate the corrected positioning and said the platform *and*
BabelFish run on your own infrastructure. That is true of the **open-source
runtime when you self-host it**; the **hosted BabelFish platform** runs in a
private, dedicated, EU-hosted tenant your team operates (see `/platform`). Each
claim was rewritten minimally, in its page's own structure and tone:

- `src/pages/security.astro` — hero sub and meta description ("Open source,
  self-hosted, and deterministic. Your data and your agents stay on your
  infrastructure."), the "Self-Hosted by Design" card (now "Self-Host It, or Run
  It in Your Own Tenant"), the "Open Source and Auditable" card ("Every layer of
  the platform is open source" → the runtime underneath the platform), and the
  "No Phone-Home" card (now explicitly the runtime you self-host). Determinism
  card unchanged.
- `src/pages/privacy.astro` — the closing section, now "The Runtime You
  Self-Host, the Platform We Host": self-hosted runtime → nothing reaches our
  servers; hosted BabelFish → private, dedicated, EU-hosted tenant, governed by
  the agreement covering that tenant, not by this policy.
- `src/pages/terms.astro` §5 — same split, with the tenant covered by its
  separate agreement.

### `/privacy` made precisely factual

- Fixed the truncated sentence "…no personal profile of you is built anywhere in
  this." → "…is built."
- Analytics card: dropped the vendor-marketing and unverifiable phrasing
  ("privacy-respecting", "roughly where in the world from", "nothing that
  identifies you"). It now states what happens: Plausible counts page views in
  aggregate; like any web request the analytics request carries standard
  technical data (IP address, browser type) — mirroring the wording already used
  for the GitHub Pages hosting card; Plausible sets no cookies; what reaches us
  are aggregate totals, not individual visitors. The single
  `qualified_form_submission` event description is unchanged.
- Every "cookie-free" compound is gone, replaced with "sets no cookies" phrasing
  (`/privacy` and `/terms`); the literal word "free" no longer appears on either
  page.
- Storage disclosure added where the no-cookies claim lives (the "No Accounts,
  No Cookies, No Tracking" card): `/thank-you` writes one short-lived
  `sessionStorage` entry, solely so a reload does not count the same form
  confirmation twice, cleared when the tab closes. The claim is now honest.
- Forms paragraph corrected: it claimed both forms send "your name", but the
  builders form has no name field. Both are now described accurately — your
  answers to the questions on the page, plus the contact details that form asks
  for (contact: name, company, email; builders: company, email), plus the
  `source` tag.
- Added a one-line pointer at the end of the page directing data questions to
  the contact page (no address, no new commitments).

### `/terms`

- §5 "cookie-free and aggregate" → "aggregate and set no cookies".
- Effective date February 2026 → **August 2026** (see the sign-off note in Step
  17: the founder re-verifies at publish).
- Meta description rewritten from §1's own intro and now uses lowercase
  "tai42" — it read "the TAI42 open-source platform".

### `/company/careers`

- The body sentence used a hyphen where the page's own meta description and the
  site convention use an em dash: "agents run on - and BabelFish" → "— and
  BabelFish".

### Placeholder chip now sits under the submit button

- `src/pages/contact.astro`, `src/pages/builders.astro` — the
  `[WEB3FORMS_ACCESS_KEY]` chip is an `inline-flex` span and was a direct
  sibling of the submit button, so it rendered *beside* the button. It is now
  wrapped in a plain `<div>`, which the form's `space-y-6` rhythm spaces like
  every other field, so it sits under the button at all widths. The Step 16
  placeholder table's "under each submit button" is now accurate.

### `/method` comment no longer ships

- `src/pages/method.astro` — the HTML comment recording why the reveal is on the
  `<li>` ("an `<ol>` may only have `<li>` children") was emitted into
  `dist/method/index.html`. Converted to an Astro template comment
  (`{/* … */}`), which is compile-time only. The invariant is still documented
  in source; `grep "may only have" dist/method/index.html` is 0.

### Internal links normalized to trailing slashes

Astro builds directory-format URLs and the canonical tags are trailing-slash,
but every internal `href` was written without one, costing a GitHub Pages 301
per navigation.

- Every internal page href in `src/` now ends in a slash: `NAV_LINKS`
  (`src/components/NavBar.astro`), `SITE_LINKS` plus the doors and legal links
  (`src/components/Footer.astro`), the home doors line (`src/pages/index.astro`),
  the `/platform` CTA and honest-line links, `/privacy`'s contact and builders
  links, `/terms` §5's privacy link, and the careers CTA. `"/"` stays `"/"`.
- `src/pages/agents.astro`'s `/llms.txt` reference is a **file** path and keeps
  no slash. `public/llms.txt` is untouched (its URLs are spec-verbatim). No
  external URL, `mailto:`, or `#anchor` was touched. The two
  `THANK_YOU_REDIRECT` constants already carried the slash.
- `src/components/NavBar.astro` — the current-page highlight compared
  `Astro.url.pathname` (trailing slash stripped) against the raw href, which the
  slashed hrefs would have broken. Both sides are now normalized through one
  `normalize()` helper, so highlighting works for `/method` and `/method/`
  alike.
- `astro.config.mjs` — the redirect *targets* now carry the slash too
  (`"/platform/"`, `"/method/"`, `"/about/"`, `"/contact/"`), so the generated
  meta-refresh pages no longer point at an unslashed URL that would itself
  redirect. The legacy *source* paths, including `/product/nexus`, are unchanged
  (see "Known conflict" above).

### Changelog corrections

- Step 15 claimed the legal pages' copy was "untouched" and careers was
  "unchanged" — both were made false by Steps 17 and 18. Corrected in place,
  with cross-references.
- The legal sign-off requirement is now stated in bold in the header block at
  the top of this document, not only inside Step 17.
- Step 17's voice-pass block gained the missing-legal-sections note (controller
  identity, retention, data-subject rights) and the effective-date re-verify
  note.

### Gates after wave 2

- `npx astro check` — 0 errors, 0 warnings, 0 hints (22 files).
- `npm run build` — 13 pages built, no errors.
- `grep -nE '\bfree\b' src/pages/privacy.astro src/pages/terms.astro` — 0.
- `grep -r "anywhere in this." dist/` — 0.
- `grep "may only have" dist/method/index.html` — 0.
- `grep -rEo 'href="/[a-z-]+"' dist/` — only `/llms.txt` file references remain;
  0 internal page hrefs without a trailing slash.
- The `[WEB3FORMS_ACCESS_KEY]` chip renders inside a block `<div>` under the
  submit button on `/contact` and `/builders`.
- Banned strings still 0 ("Nexus" outside the `astro.config.mjs` redirect path,
  SOC, certified, autopilot, disrupt, "Request access", "No credit card", €,
  `base_url`, "Babelfish Flows"). The one-sentence contract still appears in 3
  source locations.
