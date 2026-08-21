# CHANGELOG — website hotfix 1

Branch: `website-hotfix-1`, based on live `main` (e821a2a). Implements the
post-launch hotfix: fill the values that resolved, hide (never delete) the
sections that are still unconfirmed, and stop the known 404s. No new
dependencies, colors, or fonts. Three components were added along the way, all
composed from the existing tokens and idioms: `StepLine.astro`,
`ScreenshotSlot.astro`, and `FormSubmissionEvent.astro` (which renders no markup
at all — an inline script only).

Not deployed from here. Never pushed by the implementer.

## Resolved values used in this hotfix

- `DOCS_HOST` = `https://docs.tai42.ai` — **verified live before use**: the host
  returns 200, and both deep paths spot-checked (`/getting-started/installation`
  and `/concepts/layering`) return 200. The CNAME is live, so no
  "domain flip pending" note is needed anywhere on the site.
- GitHub org = `https://github.com/tai42ai`
- GitHub Discussions = `https://github.com/orgs/tai42ai/discussions`

## Pending — founder / engineering (the single open list, current as of the cold-review fix wave)

This list supersedes every earlier "parked" note in this file.

> **Superseded 2026-08-21 — items 1, 2, and 10 below are void.** The site no longer
> has forms: the 20-Aug decision replaced both with `mailto:` buttons, and the
> Formspree endpoints, the `PENDING_FOUNDER` sentinels, the `_next` redirect and
> both thank-you pages were removed on `website-hotfix-2`. There are no form IDs
> to supply and no paid-plan question to answer. See
> `CHANGELOG-website-hotfix-2.md`, Step 4. The rest of this list is untouched,
> and nothing below or above this line has been rewritten — this is a pointer,
> not a correction.

1. **The two Formspree form IDs.** `FORMSPREE_CONTACT_ID` (`src/pages/contact.astro`)
   and `FORMSPREE_BUILDERS_ID` (`src/pages/builders.astro`) both hold the
   sentinel `PENDING_FOUNDER`, so both forms post to
   `https://formspree.io/f/PENDING_FOUNDER` — **the forms are wired but dead
   until the IDs are swapped in.** One constant per file.
2. **Verify Formspree's paid-plan requirement for the `_next` custom redirect.**
   On the free tier a submission may land on Formspree's own branded success
   page instead of our thank-you pages, which is where the analytics event and
   the calendar hand-off live.
3. **The three `/platform` screenshot files, plus their flag flips.** Drop
   `example-flow.png`, `visual-builder.png`, and `audit-observability.png` into
   `/public/images/platform/` and set `show` on that one `ScreenshotSlot`
   instance. Nothing renders until `show` is flipped — the slot emits no `<img>`
   and no empty frame while the flag is false. Order matters: drop the file in
   **before** flipping, or the flipped slot renders a broken image (the flag,
   not the file's presence, is what gates the markup — see the comment at the
   top of `src/components/ScreenshotSlot.astro`).
4. **The open/commercial boundary table on `/open-source`** — founder confirms
   the split, then `SHOW_BOUNDARY_TABLE = true`.
5. **The agent-roster content on `/about`** — founder supplies the entries
   (agent + owner role, never a person's name), then `SHOW_AGENT_ROSTER = true`.
6. **`/security` — engineering sign-off on the two sentences** marked
   `<!-- VERIFY: engineering -->` ("The open-source runtime you self-host makes
   no outbound calls back to us and has no required cloud dependency." and
   "Nothing about your workloads is reported to tai42."). Remove the two
   comments once signed off.
7. **`/platform` contract instance (7j)** — founder confirms whether Change
   Order v1.5 §4.4 still requires the one-sentence contract in the `/platform`
   body; today it reaches the page through the footer only. See step 14.
8. **Enable GitHub Discussions for the `tai42ai` org** (turn the feature on in
   one repo, which GitHub designates as the org's Discussions source repo).
   `/open-source` links `GITHUB_DISCUSSIONS_URL` =
   `https://github.com/orgs/tai42ai/discussions` (`src/pages/open-source.astro:23`),
   and that URL **returns 404 today** — verified against the GitHub API: no repo
   under the org has discussions enabled, so the org-level Discussions page does
   not exist yet. §8.2 (the community forum) is blocked on this. **The URL is
   correct and stays as written** — it is the org's canonical Discussions path
   and starts resolving the moment a source repo is designated; the fix is on
   GitHub, not in this repo.
9. **"Read the technical overview" returns to `/platform` card 1** once
   engineering signs the overview off; 7j removed the link for now.
10. **Live end-to-end form test** — void with items 1 and 2 (no forms exist).
   Its deliverability concern moved to the mailto flow: see the 2026-08-21
   entry in `CHANGELOG-website-hotfix-2.md` — verify both Google Groups accept
   external senders and test each mailto from an outside address.

---

## Step 1 — changelog scaffold + placeholder inventory

Created this changelog. Recorded the pre-hotfix placeholder inventory below, so
every later step can be measured against it.

### Raw placeholder strings in source (not via the `Placeholder` component)

| File | Line | Placeholder |
| --- | --- | --- |
| `src/pages/contact.astro` | 15 | `[WEB3FORMS_ACCESS_KEY]` (form `access_key` value) |
| `src/pages/builders.astro` | 12 | `[WEB3FORMS_ACCESS_KEY]` (form `access_key` value) |
| `public/llms.txt` | 10 | `[DOCS_URL]` (Docs line) |

### `<Placeholder>` component call sites — 13 sites, 16 rendered bracket instances

The two raw `access_key` values above render as two more bracket instances in
`dist/`, and the 13 component call sites render one chip each, plus `llms.txt`
carries one — 16 rendered bracket instances in the built site in total.

| File | Line | Label |
| --- | --- | --- |
| `src/pages/agents.astro` | 40 | `MCP_ENDPOINT` |
| `src/pages/agents.astro` | 44 | `TOOL_LIST` |
| `src/pages/agents.astro` | 48 | `TRIAL_KEY_INSTRUCTIONS` |
| `src/pages/agents.astro` | 55 | `DOCS_URL` |
| `src/pages/open-source.astro` | 43 | `DOCS_URL` (body sentence) |
| `src/pages/open-source.astro` | 73 | `GITHUB_ORG_URL` |
| `src/pages/open-source.astro` | 77 | `GITHUB_ORG_URL` (Discussions tab of the org) |
| `src/pages/open-source.astro` | 81 | `DOCS_URL` (Links line) |
| `src/pages/open-source.astro` | 93 | `OPEN_COMMERCIAL_BOUNDARY` (founder confirms before publish) |
| `src/pages/about.astro` | 48 | `FOUNDER_CREDIBILITY_LINE` |
| `src/pages/about.astro` | 66 | `TEAM_AND_AGENT_ROSTER` |
| `src/pages/contact.astro` | 107 | `WEB3FORMS_ACCESS_KEY` |
| `src/pages/builders.astro` | 135 | `WEB3FORMS_ACCESS_KEY` |

Bracket instances counted in the pre-hotfix `dist/`:

```
4 [WEB3FORMS_ACCESS_KEY]     (2 pages x form value + visible chip)
4 [DOCS_URL]                 (open-source x2, agents x1, llms.txt x1)
1 [TRIAL_KEY_INSTRUCTIONS]
1 [TOOL_LIST]
1 [MCP_ENDPOINT]
1 [GITHUB_ORG_URL]
1 [GITHUB_ORG_URL — Discussions tab of the org]
1 [TEAM_AND_AGENT_ROSTER — founder supplies; list only agents that run today]
1 [OPEN_COMMERCIAL_BOUNDARY — founder confirms before publish]
1 [FOUNDER_CREDIBILITY_LINE — founder supplies; do not write one]
```

Target after this hotfix: only the four `[WEB3FORMS_ACCESS_KEY]` instances
remain, because that step is parked.

## Step 2 — /open-source: real links, boundary table hidden

`src/pages/open-source.astro`:

- Frontmatter now carries the three resolved URLs as consts (`DOCS_URL`,
  `GITHUB_ORG_URL`, `GITHUB_DISCUSSIONS_URL`) plus the gate flag.
- Hero body sentence now reads "Documentation lives at docs.tai42.ai." with
  `docs.tai42.ai` as a real `<a href="https://docs.tai42.ai">` in the page's
  existing inline-link styling (`font-medium text-crimson hover:text-burgundy
  transition-colors`). The space before the host and the sentence-final period
  are correct in the rendered output (verified in `dist/`).
- Links list: "GitHub org" → https://github.com/tai42ai; "GitHub Discussions
  (the community forum)" (copy unchanged) → https://github.com/orgs/tai42ai/discussions;
  "docs" → https://docs.tai42.ai. All three replace `Placeholder` chips and use
  the same inline-link styling, in the same `flex flex-wrap items-baseline`
  row pattern the list already used.
- New external links open in the **same tab** (no `target="_blank"`), matching
  the treatment the hotfix mandates for the Docs nav entry, so docs/GitHub
  links behave consistently across the site. The calendar CTA keeps its
  existing `target="_blank"`.
- Open/commercial boundary table: **hidden, not deleted.** The whole section is
  gated behind `const SHOW_BOUNDARY_TABLE = false;` +
  `{SHOW_BOUNDARY_TABLE && (...)}`. Re-enabling is one flag flip.
- The `[OPEN_COMMERCIAL_BOUNDARY — founder confirms before publish]` chip is
  **removed entirely** (not merely hidden) — it was the founder-facing marker
  for the gate, and the gate is now the flag.
- Table cells were already one item per `<li>` inside a `<ul>` per cell
  (driven by the `OPEN_ROWS` / `COMMERCIAL_ROWS` arrays) — no concatenated "·"
  run existed, so the required structure is confirmed rather than changed.
- `Placeholder` import dropped from this page (no call sites left).

Verified in `dist/open-source/index.html`: 4 × `docs.tai42.ai`, 1 × org link,
1 × discussions link, 0 × `<table`, 0 × bracket chips.

## Step 3 — /about: "Who built this" and "Team" hidden

`src/pages/about.astro`:

- Two frontmatter gates added — `const SHOW_WHO_BUILT_THIS = false;` and
  `const SHOW_TEAM = false;` — with each section's markup kept verbatim inside
  `{FLAG && (...)}`. The `Placeholder` chips for `FOUNDER_CREDIBILITY_LINE` and
  `TEAM_AND_AGENT_ROSTER` are preserved inside the hidden markup, so the
  founder-facing markers survive for whoever re-enables the sections.
- The page now renders hero + body only; the footer follows directly.
- Verified absent from `dist/about/index.html`: the instruction sentence
  "humans (founders, engineers) and the agent workforce side by side, each
  agent with a human owner —" (0 hits), `FOUNDER_CREDIBILITY_LINE` (0),
  `TEAM_AND_AGENT_ROSTER` (0), the `Team` heading (0). Only the site's usual
  `<!-- Who built this -->` / `<!-- Team -->` section-label comments remain in
  the HTML source, matching the comment idiom used on every other page.
- Gate rationale lives in frontmatter comments (not emitted), so page source
  does not advertise what is being withheld.

## Step 4 — /agents returns 404 (page hidden, not deleted)

- `src/pages/agents.astro` → **`src/pages/_agents.astro`** (`git mv`).
  Underscore-prefixed files in `src/pages/` are not routed by Astro, so
  https://tai42.ai/agents now 404s: no page is emitted and nothing links to it.
  Re-publishing the agent door is a rename back to `agents.astro`.
- While the file was open, its `DOCS_URL` chip was filled with a real link to
  https://docs.tai42.ai (same inline-link styling as the neighbouring
  `/llms.txt` link), so re-enabling really is just the rename.
- The header comment was updated from "GATED PAGE — built but not published by
  links" to describe the unrouted state accurately.
- Verified: a clean `npm run build` emits **12** pages (was 13) and there is no
  `dist/agents/` directory. A repo-wide grep finds no remaining link to
  `/agents` in any page, component, or `public/llms.txt`.

## Step 5 — doc-path redirects via the 404 page

New file `src/pages/404.astro`. GitHub Pages serves `404.html` for every route
it cannot resolve, so one page catches every deep doc path.

- Site-styled and minimal: `BaseLayout` (with `noindex`), `NavBar`, one `<h1>`
  ("Page not found"), one line of body copy, one link home using the existing
  crimson button classes, `Footer`. No new components, colors, or copy patterns.
- At the very top of the body, before the nav renders, an `is:inline` script
  matches `^/(getting-started|concepts|guides|reference)(/|$)` against
  `location.pathname` and, on a match, `location.replace()`s to
  `"https://docs.tai42.ai" + pathname + search + hash` — path, query, and
  fragment are all preserved. Regex behaviour spot-checked:
  `/getting-started/installation`, `/concepts/layering`, `/guides/`,
  `/reference`, `/reference/cli/run` all match; `/getting-startedX`, `/about/`,
  `/platform/`, `/` do not.
- This fixes the PyPI `tai42-*` README links to `https://tai42.ai/getting-started/*`,
  `/concepts/*`, `/guides/*`, `/reference/*`, which all 404 today.
- Verified: the build emits `dist/404.html` and the redirect script is present
  inside it.

**Flagged — two caveats:**

1. **This is a client-side redirect, not a true 301.** GitHub Pages cannot serve
   server-side wildcard redirects, so the browser first receives the 404 page
   (HTTP 404) and the script then replaces the location. It works for humans and
   for crawlers that execute JS; it does not pass link equity like a 301 and it
   does not help non-JS clients (curl, some bots, package-index link checkers).
2. **README links in the next package release should point at
   https://docs.tai42.ai directly** rather than relying on this catcher.

## Step 6 — /llms.txt Docs line filled

`public/llms.txt` line 10: `- Docs: [DOCS_URL]` → `- Docs: https://docs.tai42.ai`.

Nothing else on the file changed. **Confirmed: the file contains no `agents`
line** (case-insensitive grep for "agent" in `llms.txt` returns nothing), so
unrouting `/agents` in step 4 left no stale entry here.

## Step 7 — Docs tab in the nav and the footer

Order is now Home · Method · Platform · Open Source · **Docs** · About ·
Contact, plus the single CTA.

- `src/components/NavBar.astro` — one entry added to the `NAV_LINKS` array
  (`{ href: "https://docs.tai42.ai", label: "Docs" }`), which feeds **both** the
  desktop block and the mobile panel, so the external href flows through
  cleanly and Docs is styled identically to the other items in each block. No
  `target="_blank"`: it opens in the same tab, as required.
- `isActive()` now returns `false` immediately for any href that does not start
  with `/`. Without that guard `normalize()` would have compared the request
  path against a full URL — harmless in practice, but the explicit guard makes
  "off-site links are never highlighted" a rule rather than an accident. The
  header comment was updated to the new order.
- `src/components/Footer.astro` — the same entry added in the same position to
  `SITE_LINKS` (the site-links column), rendered with the column's existing
  link styling. The column now carries seven links; its comment was updated.
- Verified in `dist/about/index.html`: exactly 3 `Docs` links
  (desktop nav, mobile panel, footer), all pointing at
  `https://docs.tai42.ai`, none with `target`. On `/open-source/` — the page
  most likely to false-positive — the Docs entries render in the inactive
  style, so the active highlight is unaffected.

## Step 8 — /security rewritten

`src/pages/security.astro` — body replaced with the supplied copy, verbatim.
Layout idiom unchanged: the same centered hero plus the same 2-column grid of
four bordered cards, reusing the existing classes and the existing check icon.
No new components, colors, or classes (the only class added anywhere is a
`mt-3` between the two paragraphs of the fourth card).

- H1: "Secure by Architecture." → **"Security by architecture"**.
- Intro, and the four block headings and bodies, now read exactly as specified:
  "Open and auditable", "Your infrastructure, or your tenant", "Deterministic
  where it matters", "No outbound calls from the self-hosted runtime".
  Rendered text was diffed against the supplied copy — verbatim match.
- The fourth block is two separate paragraphs, each preceded by
  `<!-- VERIFY: engineering -->`, as required: one above "The open-source
  runtime you self-host makes no outbound calls back to us and has no required
  cloud dependency." and one above "Nothing about your workloads is reported to
  tai42."
- Removed as demanded: "maximum security and accuracy, with no surprises in
  production", "no black boxes, no hidden telemetry", every Title-Case heading
  (all headings are sentence case now), and every " - " hyphen-as-dash — em
  dashes throughout. Verified: `grep -c " - "` = 0 in both the source and the
  built page; each removed phrase = 0 hits in `dist/`.
- Meta description updated to the new intro sentence. `noindex` stays **off**,
  as today; the section-label HTML comments were renamed to the new headings.
- Note: the two `VERIFY: engineering` comments are HTML comments, so they do
  ship in `dist/security/index.html` page source (2 hits). That is the
  requested form — remove them once engineering signs the two sentences off.

## Step 9 — /method sentence capitalization

`src/pages/method.astro` — two paragraph openings capitalized, nothing else
(diff is exactly two lines changed):

- "your people at the decisions you name; ours on call…" → **"Your** people at…"
- "you already have a demo. You've written down…" → **"You** already have a demo. …"

This supersedes the earlier verbatim-lowercase ruling in the correction
changelog — founder instruction. Other intentionally lowercase copy elsewhere
on the site was left untouched.

## Step 10 — /thank-you CTA label (hotfix §2.2)

`src/pages/thank-you.astro` — the calendar button label changed from
"Book a production audit" to **"Book your production audit"**. It is the same
`CALENDAR_URL` link with the same styling; nothing else on the page changed.

The site's single-primary-CTA rule is unaffected: the nav and mobile-menu CTAs
still read "Book a production audit" (2 instances on this page), and the
possessive wording is the post-submission variant the hotfix asks for.

---

## Gates and self-checks after step 10

`npx astro check` — 23 files, **0 errors, 0 warnings, 0 hints**.
`npm run build` (clean `dist/`) — **13 pages, complete, no warnings**.

| Check | Result |
| --- | --- |
| Rendered bracket placeholders in `dist/` | `4 × [WEB3FORMS_ACCESS_KEY]` only — every other placeholder is gone (was 16 instances across 10 distinct labels) |
| `dist/agents/` | absent; `/agents` will 404 |
| `dist/404.html` | present, carries the doc-path redirect script (`getting-started\|concepts\|guides\|reference` → `https://docs.tai42.ai`) and `robots: noindex, nofollow` |
| `dist/llms.txt` Docs line | `- Docs: https://docs.tai42.ai` |
| Docs in nav + footer | 3 × `Docs` on every page — desktop nav, mobile panel, footer — never in the active style |
| `docs.tai42.ai` links in `dist/` | 41 `href` instances across 13 HTML files: 39 chrome (13 pages × 3) + 2 in the `/open-source` body and Links list |
| Banned strings in `dist/` | `Text-to-Flow` 0, `Request access` 0, `No credit card` 0, `SOC 2` 0, `certified` 0, `autopilot` 0, `disrupt` 0, `€` 0, `base_url` 0. `Nexus` 1 — **counted case-insensitively**, and the single hit is the lowercase URL path in the pre-existing `/product/nexus/` legacy-URL redirect stub (noindex meta-refresh to `/platform/`, from `astro.config.mjs` on `main`, untouched by this hotfix). The capitalized brand term `Nexus` is **0** everywhere in `dist/`, which is what the later gates tables report — so the 1 → 0 across this document is a counting-method difference, not a change to the output |
| Open-source contract sentence | present in all 3 required places — the footer (so on all 13 pages), the `/open-source` body, the `/platform` body — verbatim, whitespace-normalized comparison |
| `" - "` on `/security` | 0 in the source and 0 in the built page |
| `VERIFY: engineering` comments | 2 in `src/pages/security.astro` (also emitted into `dist/security/index.html`) |
| Internal links | all internal `href`s in touched files keep trailing slashes (`/`, `/builders/`, `/security/`, `/privacy/`, `/terms/`) |

Still open after this hotfix — both parked by instruction:

1. `[WEB3FORMS_ACCESS_KEY]` in `/contact` and `/builders` (4 rendered instances).
2. The `/platform` visual-builder mock.

Nothing was pushed.

---

# Hotfix v2 — wave A (spec `_state/task2-hotfix-v2.md`, sections 7h · 7i · 7j · 7k)

Wave A covers: nav rename + `/method` rebuild (7h), `/about` rebuild (7i — the
Home card in 7i is wave B), `/platform` rebuild (7j), `/open-source` rebuild
(7k). Copy is verbatim from the spec. No new colours, fonts, or dependencies;
two small components added, both built from the existing card/Reveal idiom.

## Step 11 — nav label "Method" → "How it works" (v2 §7h, §4b)

`src/components/NavBar.astro`, `src/components/Footer.astro` — the nav item
label changed from "Method" to "How it works". The route is unchanged
(`/method/`): `/how-it-works` is an existing legacy redirect *into* `/method`
and was deliberately not created as a page.

Final order in both the header (desktop + mobile panel) and the footer "Site"
list: Home · How it works · Platform · Open Source · Docs · About · Contact,
then the primary CTA button — i.e. the order 7h asks for, already satisfied by
the existing sequence once the label changed.

`src/pages/method.astro` — page `<title>` is now `How it works — tai42` (it also
feeds the OG and Twitter titles through `BaseLayout`). The page body is rebuilt
in step 12.

The CTA button's label and target are untouched here — 7c/7d retarget it in
wave B.

## Step 12 — `/method` rebuilt as "How it works" (v2 §7h)

`src/pages/method.astro` rewritten to the 7h copy, verbatim. Six sections in
order:

1. the five steps, as a horizontal step line (new component, below) with the two
   "you can leave here" stop-points between steps 2→3 and 4→5;
2. "What's in the readiness report" — text card with the intro line and the
   six-item list;
3. "Where humans stay";
4. "What we ask of you" — text card;
5. "What you keep" — text card;
6. "Who we work with (the honest filter)".

H1 is "How it works"; the intro is the 7h paragraph and the meta description is
derived from it. Bottom CTA: **"Get your readiness report" → `/contact/`** (the
calendar link is gone from this page — 7d puts it on the contact thank-you page
only). Step 1 now reads "The production readiness review (free, entry)." per
7h, which supersedes the 7c wording.

New component `src/components/StepLine.astro` — the only markup this wave adds.
It takes `steps` (`{ title, body, link? }[]`), optional `stopAfter` (1-based
step numbers a stop-point follows) and `stopLabel` (default
"you can leave here"). Horizontal rail with numbered nodes on `lg:` and up,
stacked on mobile; when a step carries `link`, its card becomes an anchor. It is
built only from existing tokens and idioms — the crimson/10 numbered node from
the old /method list, the `bg-white rounded-xl border border-gray-200` card, the
`.reveal` and `.card-hover` classes. No new colours, fonts, or dependencies.
Wave B's homepage passes its own four compressed steps with `link: "/method/"`.

Sections 4 and 5 render as two cards in one band (the security-page two-column
card idiom) so that every text card keeps the site's white-card-on-gray-50
contrast.

## Step 13 — `/about` rebuilt (v2 §7i; supersedes §1.3 and §7g)

`src/pages/about.astro` rewritten to the 7i copy, verbatim. H1 unchanged
("The self-driving company, the honest way"). Body, in order:

1. the 7i opening paragraph — it carries the 7g evidence (Carnegie Mellon, MIT,
   Anthropic's Project Vend) as design rationale with the sources named, which
   is where site rule 7g allows it; the meta description is derived from it;
2. "How the company is built — three layers" — three text cards
   (The open-source runtime. / BabelFish, the platform. / The engagements.)
   followed by the "Why the layers are separate." paragraph;
3. "How we hold ourselves to it" — one paragraph, rendered plainly, including
   the clause "…until a flow can do it." (no emphasis invented beyond the
   spec's own);
4. the gated agent-roster section "The agent roster — how tai42 runs on itself"
   — present but not rendered (`SHOW_AGENT_ROSTER = false`), with the entry
   format ("Status & reporting agent" + owner: engineering) in a source comment
   only, never rendered, and no person names anywhere;
5. CTA **"Get your readiness report" → `/contact/`**.

**"Who built this" is REMOVED**, not hidden, per v2 §1.3: the section, its
`SHOW_WHO_BUILT_THIS` flag, the `Placeholder` import and the
`FOUNDER_CREDIBILITY_LINE` slot are all gone from the file — zero hits for
"Who built this" in `src/` and in `dist/`. The v1 pass had only hidden it; git
history keeps the old markup.

The one-sentence contract closes the open-source-runtime card and is
byte-identical to the footer's. To make that literal rather than approximate,
`src/components/Footer.astro` now holds the sentence on a single source line
(whitespace-only change, no visual difference); the same single-line string is
used on `/about` and, in step 15, on `/open-source`. Verified in `dist/`: an
exact-string grep matches twice on `/about/` (card + footer).

Note for the founder: the 7i paragraph contains "We claim no certification we
can't hand over." That is a disclaimer, not a certification claim, and it is
spec-verbatim; the banned term "certified" still has zero hits.

## Step 14 — `/platform` rebuilt, benefits-led (v2 §7j; supersedes §6)

`src/pages/platform.astro` rewritten to the 7j copy, verbatim: H1 · sub ·
"What it runs" · "What you get" (the six text cards, in the spec's order) ·
"Getting started" · "The honest line" · actions. The actions row carries the
primary **"Get your readiness report" → `/contact/`** plus
**"Talk to us about a tenant" → `/contact/`**; the meta description is the new
sub-line. The `<title>` ("BabelFish — one engine for business functions in
production — tai42") is composed, not spec copy — 7j gives no title.

Removed, per the 7j remove-list: the HTML builder mock (the flow-canvas SVG with
the Router / Extractor / Validator steps and the `greet_user` version-history
widget), the standalone visual-builder caption, the old "Enterprise by design" /
"Own the logic" / "The rule that makes it safe" blocks and the
Observe→Identify→Compile-adjacent captions (that content now lives in card 1),
any sub-brand split, and the "Read the technical overview" link. Zero hits in
`dist/platform/index.html` for `Router`, `Extractor`, `greet_user`,
`version history`, `Nexus`, `technical overview`, `€`.

The agents sentence is deliberately **not** in the honest line: `/agents` is not
live, so the gate 7c/7j sets is not cleared.

Three hidden screenshot slots via the new `src/components/ScreenshotSlot.astro`
(props: `src`, `alt`, `show` — default `false`). Nothing renders while `show` is
false: no `<img>`, no empty frame, no placeholder text. Instances:

| Card | File (drop into `/public/images/platform/`) | alt |
| --- | --- | --- |
| 1 | `example-flow.png` | "Deterministic where it matters, generative where it's wanted." |
| 4 | `visual-builder.png` | "the visual builder — guardrails, versioned flows, instant rollback" (§0) |
| 5 | `audit-observability.png` | "Audit and observability, by construction." |

Verified: `images/platform` has zero hits in the built page.

### ⚠ CONFLICT FOR THE FOUNDER — the /platform contract instance

**7j removes the `/platform` contract instance required by Change Order v1.5
§4.4 — the footer instance still renders on every page; founder should confirm.**
The v1 hotfix recorded the one-sentence open-source contract in three places
(footer, `/open-source` body, `/platform` body) because v1.5 §4.4 required it in
the `/platform` honest-line block. The 7j copy for `/platform` does not contain
that sentence, and nothing was invented into the page — so the body instance is
gone. The sentence is still present *on* `/platform` because the footer renders
on every page (exact-string grep: 1 hit on `dist/platform/index.html`). v2's own
acceptance (§7k, §8) only requires the footer, `/open-source`, and `/about`
instances, all of which match verbatim. Founder decides whether §4.4 stands.

## Step 15 — `/open-source` rebuilt (v2 §7k; supersedes the §1.2 fixes)

`src/pages/open-source.astro` rewritten to the 7k copy, verbatim, in the spec's
order: H1 "The runtime is open" · "Why we did it" · "What it is" (with the
`Links: Docs · GitHub` line) · the one-sentence contract as a blockquote · the
hidden boundary table · "What we promise about it" · "How we run it" (GitHub
Discussions linked; "Install from PyPI; start at the docs." with the docs
linked) · actions **"Read the docs" → https://docs.tai42.ai** and
**"GitHub" → https://github.com/tai42ai**. The meta description is the first
sentence of "Why we did it".

License: the page states Apache-2.0 as the spec writes it — confirmed by the
orchestrator against the GitHub API for all public `tai42ai` repos (§0/§7k).

The boundary table keeps the existing `SHOW_BOUNDARY_TABLE = false` mechanism
(nothing rendered while false); its cell contents are updated to the 7k lists,
one item per line per cell — Open (the engine · self-hosting · permissions,
audit, delegated access) and Commercial (managed private tenants · the visual
builder and optimizer as an operated service · delivery guarantees and
acceptance-backed engagements · support) — under the 7k column headings.

Verified in `dist/open-source/index.html`: the contract sentence matches the
footer's byte for byte (2 exact-string hits: body + footer), "free forever" has
0 hits (table hidden), and the docs / GitHub / Discussions URLs are the §0
values.

## Gates and self-checks after wave A (steps 11–15)

`npx astro check` — 25 files, **0 errors, 0 warnings, 0 hints**.
`npm run build` (clean `dist/`) — **13 pages, complete, no warnings**.

| Check | Result |
| --- | --- |
| "Method" as a nav label or page title | 0 — gone from `src/` and from every built page; the route `/method/` is unchanged and `/how-it-works` is still the legacy redirect stub |
| `/method` step line | 5 numbered steps + exactly 2 "you can leave here" stop-points in `dist/method/index.html`; six sections render in the 7h order |
| "Who built this" | 0 hits in `src/`, 0 in `dist/` (removed, not hidden) |
| Screenshot slots | 3 `ScreenshotSlot` instances on `/platform`, all `show=false`; `dist/platform/index.html` contains no `images/platform` reference and no `<img>` beyond the two chrome logos |
| Old /platform mock | `Router` 0, `Extractor` 0, `greet_user` 0, `version history` 0, `technical overview` 0 in `dist/platform/index.html` |
| Contract sentence | byte-identical everywhere: footer on all 13 real pages, plus a second exact-string hit on `/about` (runtime card) and on `/open-source` (blockquote). **Not** in the `/platform` body — see the conflict flagged in step 14 |
| Banned strings in `dist/` | Nexus 0 · Text-to-Flow 0 · Text to Flow 0 · Request access 0 · No credit card 0 · AGENTIC GATEWAY 0 · autopilot 0 · disrupt 0 · SOC 2 0 · SOC2 0 · certified 0 · € 0 · 3,500 0 · base_url 0 |
| "production audit" | 30 hits, all outside wave A's pages' bodies and all wave B's to sweep (7c/7d): 27 × the nav/mobile CTA "Book a production audit" (2 per page × 13 + 1 homepage hero), 2 × "Book your production audit" (thank-you), 1 × the `/contact` form subject value |
| Bracket regex `\[[A-Z_]+[^\]]*\]` in `dist/` | 4 × `[WEB3FORMS_ACCESS_KEY]` only (contact + builders) — wave B |
| Internal links in the touched files | all trailing-slashed: `/contact/` ×4, `/open-source/` ×2, `/method/`, `/builders/` |
| New design-system surface | none — no new colours, fonts, or dependencies. Two components added (`StepLine.astro`, `ScreenshotSlot.astro`) and one button variant composed from existing tokens (white/gray-200 outline) for the secondary action next to the primary CTA on `/platform` and `/open-source` |

Wave A did not touch: the homepage, the CTA button label/target, `/contact`,
`/builders`, `/thank-you`. Nothing was pushed.

## Wave B, step 16 (spec 7b): homepage hero strings

`src/pages/index.astro` — the three hero strings replaced verbatim with 7b's
copy, and nothing else in this commit.

* H1: "AI, from demo to production."
* Sub-line: "tai42 takes AI into production — turning your working demo into a
  production application: deterministic where money moves, AI where judgment is
  needed, humans at the decisions you name. Live with real users in weeks, not
  quarters, against acceptance criteria you sign."
* `BaseLayout title` = "AI, from demo to production. — tai42" — the layout feeds
  the same string to `<title>`, `og:title`, and `twitter:title`, so one prop
  covers all three.
* `BaseLayout description` = "tai42 takes AI into production — turning your
  working demo into a production application: deterministic where money moves,
  AI where judgment is needed, humans at the decisions you name." — likewise
  feeds `meta description`, `og:description`, and `twitter:description`.

The old H1 ("Your AI demo works. Production is where it dies.") now returns 0
hits repo-wide outside the changelog and the v1 acceptance report.

## Wave B, step 17 (spec 7e + 7f + 7i home card): homepage restructured

`src/pages/index.astro` rebuilt to the 7f section order — hero · How it works ·
What we build · Why it works · doors · CTA · footer.

**Removed entirely (7e/7f):** the proof strip section ("In production with a
travel-tech marketplace · Two further engagements in delivery · Built on our own
platform — and we run our own company on the same flows."), with no replacement;
the "The problem" heading and its paragraph (the industry statistic — no
third-party statistics on Home); the "What we do" heading and paragraph
(superseded by "How it works"); the heading "Why it holds". The hero is now H1 ·
sub · CTA only, and the doors line has left it.

**How it works** — the 7f paragraph verbatim, then the compressed four-step line
built on wave A's `StepLine` component: four steps, each card linking to
`/method/`, no stop-point labels here (`stopAfter` omitted). Step texts verbatim
from 7f, with step 1 in the "Production readiness review (free)." form.

**Three things, one company.** — 7i's text card, verbatim, directly after the
step line and before "What we build". Its closing "(→ About)" renders as a link
to `/about/`, so the sentence reads as written and the arrow is the affordance.

**What we build** — 7f's paragraph verbatim, new section.

**Why it works** — the three existing cards, byte-identical bodies and titles;
only the section heading text changed from "Why it holds".

**The doors block (7e)** — its own section after "Why it works", visually
separated, using the existing text-card styling (`bg-white rounded-xl border
border-gray-200` on a `bg-gray-50` band): lead line "Two other doors." then the
builders door, "For builders → join the founding waitlist" → `/builders/`. The
agents door is NOT rendered — `/agents` is not live. The footer "Doors" list is
untouched.

**Bottom CTA** — "Get your readiness report" → `/contact/`.

The hero CTA button still reads "Book a production audit" at this commit; the
sitewide rename and retarget are step 18 (7c/7d), kept separate as specified.

`npx astro check`: 25 files, 0 errors / 0 warnings / 0 hints.

## Wave B, step 18 (spec 7c + 7d): primary CTA renamed and retargeted

"audit" is retired from every human-facing CTA; the primary call to action is
"Get your readiness report" and it points at `/contact/` — form first, calendar
second.

| File | Change |
| --- | --- |
| `src/components/NavBar.astro` | Both CTA buttons (desktop header + mobile panel): label "Book a production audit" → "Get your readiness report"; `href={CALENDAR_URL}` → `"/contact/"`; `target="_blank"` and `rel="noopener noreferrer"` removed (the link is internal now); the `CALENDAR_URL` import removed — it had no other use in the file; header comment updated |
| `src/pages/index.astro` | Hero CTA: same label change, `href="/contact/"`, external attributes and the `CALENDAR_URL` import removed |
| `src/pages/thank-you.astro` | Button label "Book your production audit" → "Get your readiness report" — an interim sweep; the page is rebuilt as the contact thank-you with the "Pick a time." calendar button in step 21 |
| `src/consts.ts` | Comment updated: `CALENDAR_URL` is now documented as appearing in exactly one place on the site, the contact thank-you page. The constant itself is unchanged |

Verified already correct from wave A, unchanged here: `/method`'s bottom CTA
("Get your readiness report" → `/contact/`) and `/platform`'s two actions
("Talk to us about a tenant" → `/contact/`, "Get your readiness report" →
`/contact/`), plus `/platform`'s "Getting started" paragraph, which already
carries 7c's "The readiness report is free …" wording.

Remaining "audit" hits in `src/` after this step, every one classified:

| Hit | Classification |
| --- | --- |
| `src/pages/security.astro:41,48` — "Open and auditable" (comment + heading) | product property — keep (7c exempts "auditable") |
| `src/pages/open-source.astro:22` — boundary-table cell "permissions, audit, delegated access" (hidden) | product property — keep |
| `src/pages/open-source.astro:79` — "Permissions, audit, and delegated access are part of the open core" | product property — keep |
| `src/pages/about.astro:25` — same sentence inside the runtime layer card | product property — keep |
| `src/pages/builders.astro:55` — "full audit, humans at the named decisions" | product property — keep (7c exempts "full audit") |
| `src/pages/platform.astro:150` — card 5 title "Audit and observability, by construction." | product property — keep |
| `src/pages/platform.astro:159,160` — hidden slot `audit-observability.png` + its alt | product property — keep (asset name from the card title) |
| `src/pages/contact.astro:46` — hidden `subject` value "tai42.ai — production audit request" | human-facing (email subject) — replaced in step 20 with the Formspree `_subject` "[tai42] Readiness report request" |
| `src/pages/contact.astro:103` — submit button "Book your production audit" | human-facing — replaced in step 19 with "Get your readiness report" |

`npx astro check`: 25 files, 0 errors / 0 warnings / 0 hints.

## Wave B, step 19 (spec 7d): `/contact` — the demo question made prominent

`src/pages/contact.astro`. The intro and H1 ("Three questions. They save us both
a meeting.") are unchanged.

Question 1 — the demo field — is now the prominent first field: it sits in its
own card (the existing `rounded-xl border border-gray-200` text-card token on a
`bg-gray-50` fill), its label is set one step larger and semibold, and the
helper text sits directly under the label, verbatim: "Paste a link, a video, or
a sentence — anything that shows what you've built."

The field is now OPTIONAL — `required` removed. Because the helper says
"optional but encouraged", that fact is carried in the label itself —
"Do you have a working demo today? (optional)" — following the site's form
idiom, so it reaches screen readers rather than living only in visual copy. The
helper paragraph is wired to the textarea with `aria-describedby="demo-help"`,
and the box is one row taller to invite a longer answer. The other two questions
and the name / company / email fields stay required.

Submit button: "Book your production audit" → "Get your readiness report".

`npx astro check`: 25 files, 0 errors / 0 warnings / 0 hints.

## Wave B, step 20 (spec §2 / §1.4): both forms moved to Formspree

FORM_BACKEND is Formspree, per the orchestrator's resolution: the site is on
GitHub Pages, so no native host form handling exists, and there is no working
Web3Forms key in the repo. Web3Forms is gone from `src/` entirely (0 hits).

**The endpoint and the pending IDs.** Each form page carries one clearly-named
frontmatter constant holding the sentinel string `PENDING_FOUNDER`:

* `src/pages/contact.astro` — `FORMSPREE_CONTACT_ID`
* `src/pages/builders.astro` — `FORMSPREE_BUILDERS_ID`

The action is composed as `https://formspree.io/f/${…_ID}`, so **swap-in is one
constant per file** when the IDs arrive. The sentinel carries no square brackets
and is never rendered as visible text — it only ever appears inside the `action`
URL. **PENDING founder values: the two Formspree form IDs.** Until they are
filled, both forms post to `https://formspree.io/f/PENDING_FOUNDER`, which is
not a live form — the forms are wired but not yet functional.

**Removed:** the `[WEB3FORMS_ACCESS_KEY]` chip on both pages (and with it the
last `Placeholder` usage outside the unrouted `_agents` page), the `access_key`
hidden input, the Web3Forms `botcheck` honeypot, the `from_name` input, and the
Web3Forms `subject`/`redirect` field names.

**Added / renamed on both forms:**

| Field | Contact | Builders |
| --- | --- | --- |
| `_subject` (hidden) | `[tai42] Readiness report request` | `[tai42] Founding builder` |
| `_next` (hidden) | `https://tai42.ai/thank-you/` | `https://tai42.ai/thank-you-builders/` |
| `source` (hidden) | kept — filled client-side | kept — filled client-side |
| `_gotcha` (honeypot) | `type="text"`, `class="hidden"`, `display:none`, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"` | same |

The form marker attribute is now `data-source-form` (was `data-web3form`).

**`src/components/FormSourceScript.astro`** — the same shared inline script,
extended rather than replaced. It still derives `source` from UTM parameters,
then an off-site referrer (the same-origin guard is unchanged), then `"direct"`.
It now writes the redirect into Formspree's `_next` instead of Web3Forms'
`redirect`, appending `source` with the right separator (`?` when the stored
`_next` has no query, `&` when it does) and `encodeURIComponent`. And it fills
`_subject`: on load and on every keystroke in the company field it recomputes
`_subject.defaultValue + " — " + company`, so the founder's inbox shows
"[tai42] Readiness report request — Acme". Every write is derived from the
input's `defaultValue`, so bfcache restores and repeated keystrokes recompute
instead of appending twice.

**`src/pages/privacy.astro`** — the sentence naming the form processor updated
from Web3Forms to Formspree; nothing else on the page changed.

**NOTE for the founder — verify when creating the forms:**

1. **Formspree's custom `_next` redirect may require a paid plan.** On the free
   tier a submission may land on Formspree's own branded success page instead of
   our thank-you pages. Verify at form-creation time; if it is gated, the plan
   has to be upgraded or the thank-you flow rethought — the analytics event and
   the calendar hand-off both live on those pages.
2. **Destinations are configured account-side, not in the markup**: `/contact`
   → contact@tai42.ai, `/builders` → builders@tai42.ai. The account is the one
   registered to contact@tai42.ai.
3. Record the two form IDs in this changelog when they are created.

Roadmap: replace the third-party form backend with an intake endpoint on the
tai42 runtime — the first internal inbound flow.

`npx astro check`: 25 files, 0 errors / 0 warnings / 0 hints.

## Wave B, step 21 (spec 7d): the thank-you pages split in two

One thank-you page could not serve both forms once 7d moved the calendar behind
the contact form only, so there are now two — and the route, not a query
parameter, says which form was submitted.

**`src/pages/thank-you.astro` — the CONTACT thank-you** (the contact form's
`_next`). Rebuilt to the 7d copy: heading "Thanks — we'll read this before we
meet.", the single line "Pick a time and we'll come to the call having read what
you sent.", and the calendar as a button reading "Pick a time." pointing at
`CALENDAR_URL`. This is the ONLY place on the site the calendar URL appears —
confirmed in the build: `calendar.google.com` matches exactly one file in
`dist/`, `dist/thank-you/index.html`. The link keeps `target="_blank"` and
`rel="noopener noreferrer"` because it is genuinely external. `noindex` kept.

**`src/pages/thank-you-builders.astro` → `/thank-you-builders/` — the BUILDERS
thank-you** (new; the builders form's `_next`). Same page frame, same tokens,
deliberately no calendar: founding partners are contacted, not booked. Heading
"Thanks — you're on the list."; the body says back the /builders honest line
rather than inventing a new promise — "Founding partners are invited in small
batches as delivery capacity opens. We'll be in touch when it opens for yours."
`noindex` set. `dist/thank-you-builders/index.html` contains 0 calendar hits.

**`src/components/FormSubmissionEvent.astro`** (new) — the Plausible
`qualified_form_submission` event, lifted out of the old thank-you page so both
pages share one implementation. It takes a `page` prop, so the event's `page`
property comes from the route (`"contact"` / `"builders"`) and can no longer be
lost or spoofed by a redirect that drops its query string. `source` still
arrives in the query, stamped onto `_next` by `FormSourceScript`, and the
sessionStorage dedupe key (page + source) is unchanged. Verified in the build:
`page = "contact"` in `dist/thank-you/`, `page = "builders"` in
`dist/thank-you-builders/`.

**Dropped:** the old `?page=` query mechanism, and with it the old script's
`if (!page) return;` guard — the route now encodes the form, so a visitor who
lands on the page without a query still counts.

`npx astro check`: 25 files → 0 errors / 0 warnings / 0 hints (with the two new
components, 27 files checked). `npm run build`: 14 pages (was 13 — the new
builders thank-you), complete, no warnings.

## Wave B, step 22: `CALENDAR_URL` reduced to one consumer

Verification step, per 7d's "the calendar URL appears on the contact thank-you
page and nowhere else". After steps 18 and 21, `grep -rn "CALENDAR_URL" src/`
returns exactly three lines: the export in `src/consts.ts`, its single import in
`src/pages/thank-you.astro`, and the one `href` on that page's "Pick a time."
button. `NavBar.astro`, `index.astro`, and `method.astro` no longer import it.

Nothing dead was left to remove: `src/consts.ts` exports only `CALENDAR_URL`,
which still has a live consumer, so the file stays. Its comment now records the
one-consumer rule so a future edit does not quietly reintroduce a second use.
`src/components/Placeholder.astro` also stays — after the two Web3Forms chips
came out in step 20 its only remaining user is the unrouted `_agents.astro`.

## Gates and self-checks after wave B (steps 16–22)

`npx astro check` — 27 files (two new components), **0 errors, 0 warnings,
0 hints**.
`npm run build` (clean `dist/`) — **14 pages, complete, no warnings**.

| Check | Result |
| --- | --- |
| "production audit" / "Book a production audit" / "Book your production audit" | **0** in `src/`, **0** in `dist/` |
| Remaining "audit" hits (case-insensitive, `src/`) | 9, every one a product property: `builders.astro:63` "full audit" · `open-source.astro:29` hidden boundary-table cell "permissions, audit, delegated access" · `open-source.astro:86` "Permissions, audit, and delegated access …" · `about.astro:30` the same sentence in the runtime layer card · `platform.astro:150` card 5 title "Audit and observability, by construction." · `platform.astro:159,160` the hidden `audit-observability.png` slot and its alt · `security.astro:41,48` "Open and auditable" (comment + heading). No human-facing CTA use remains |
| Calendar URL in the build | exactly **one** file — `dist/thank-you/index.html`. `dist/thank-you-builders/index.html`: 0 hits |
| "Get your readiness report" → `/contact/` | every occurrence: nav desktop + nav mobile (×2 on all 14 pages), home hero, home bottom CTA, `/method` bottom, `/about` bottom, `/platform` action. The one exception is `/contact`'s own submit button, which is the form's `<button type="submit">` and has no href. Home checked in `dist/index.html`: 4 anchors carrying the label, all `href="/contact/"` |
| "travel-tech marketplace" / "Two further engagements" / "The problem" / "Why it holds" in `dist/` | **0 / 0 / 0 / 0** |
| "under a third" in `dist/` | **1**, and only in `dist/about/index.html` — 7i's opening paragraph, where the evidence is required and the sources are named. **0** on Home, as 7f requires |
| Home section order in `dist/index.html` | H1 "AI, from demo to production." → h2 "How it works" → the four step cards → the "Three things, one company." card → h2 "What we build" → h2 "Why it works" + the three cards → "Two other doors." + the builders door → the CTA. Matches 7f exactly |
| Home step-line links | 4 step cards → `/method/` |
| Bracket regex `\[[A-Z_]+[^\]]*\]` in `dist/` | **0** |
| "web3form" in `src/` | **0** |
| Form endpoints in `dist/` | both `action="https://formspree.io/f/PENDING_FOUNDER"` — **flagged: the two form IDs are pending the founder; the forms are wired but not live until they are swapped in** |
| Hidden fields in `dist/` | contact: `_subject="[tai42] Readiness report request"`, `_next="https://tai42.ai/thank-you/"`, `source=""`, `_gotcha`. builders: `_subject="[tai42] Founding builder"`, `_next="https://tai42.ai/thank-you-builders/"`, `source=""`, `_gotcha` |
| `/contact` demo field | label carries "(optional)", `aria-describedby="demo-help"` present, and `required` now appears 5× on the page (the two other questions + name, company, email) — the demo textarea is not among them |
| `public/llms.txt` | **UNCHANGED** — no diff against the wave A tip |
| New design-system surface | none — no new colours, fonts, or dependencies. One new component, `FormSubmissionEvent.astro`, which renders no markup at all (an inline script only), plus the new page `/thank-you-builders/` built from the existing page frame |

Nothing was pushed.

---

# Cold-review fix wave

A verified cold review of the branch produced thirteen fixes consolidated from
the review's findings; all are applied here. No new dependencies, colours,
fonts, or components, and no spec copy was altered except at the four points
the review explicitly authorised:

- the `/thank-you-builders` sentence "We'll be in touch when it opens for
  yours." removed (item 8);
- the `/privacy` thank-you-page plural (recorded inside item 2);
- the `public/llms.txt` label rename "- Method:" → "- How it works:" (item 9);
- the `/terms` §8 contact swap `balin.miki@tai42.ai` → `contact@tai42.ai`
  (item 10).

Item 7 also changes page-frame text that is not spec copy: the
`/thank-you-builders` `<title>` becomes "You're on the list — tai42" so the two
thank-you pages no longer share one title.

## Forms — `src/components/FormSourceScript.astro`

1. **`_subject` is now re-synced on submit.** The company was appended on load
   and on every `input` event only, so an autofill or a session restore — neither
   of which fires `input` — could repopulate the company field and send a
   subject line without it. `form.addEventListener("submit", syncSubject)` now
   runs the same handler as the form leaves. The computation is unchanged and
   still derives from `subjectInput.defaultValue`, so the extra run is
   idempotent.
2. **The source tag stores the referrer HOST only.** It stored
   `document.referrer` in full — path and query included — which is more than
   `/privacy` promises. The already-computed `referrerHost` is now what gets
   stored (`referrer = referrerHost;`), so the value that reaches the founder's
   inbox and the Plausible event is exactly "the site that referred you".
   `/privacy`'s referrer sentence ("a campaign link, the site that referred you,
   or simply 'direct'") therefore now describes the code exactly and needed no
   change. The one `/privacy` edit in this wave is the singular thank-you page:
   the session-storage entry is written "by our thank-you pages … so that
   reloading one does not count the same form confirmation twice" — there are
   two thank-you pages since wave B step 21.
3. **`_next` is derived from `Astro.site`, not hardcoded.** `/contact` and
   `/builders` both held a literal `https://tai42.ai/thank-you…`, so a preview
   build's form would have redirected into production. Both now compose
   `new URL("/thank-you…/", Astro.site?.href || "https://tai42.ai").href`, the
   same fallback idiom `BaseLayout` uses. The built values are unchanged
   (`astro.config.mjs` sets `site: "https://tai42.ai"`).

## Structure and accessibility

4. **`StepLine` takes a `headingLevel` prop** (default `"h3"`), and `/method`
   passes `headingLevel="h2"`. `/method` had an h1 → h3 skip: the five step
   titles were h3 directly under the page h1. The homepage keeps the default h3,
   because there the step line sits under the "How it works" h2. Verified in the
   build: `dist/method/index.html` main is h1 then h2 only; `dist/index.html`
   main is h1 · h2 · h3×5 · h2 · h2 · h3×3 — no skips on either page.
   The stop-marker `<li>`s are now `aria-hidden="true"`: they are decorative
   labels, and the five steps stay the list's semantic items.
5. **`ScreenshotSlot`'s unused `class` prop removed** — no call site passed one;
   the `<figure>` carries its classes directly.
6. **Canonical and `og:url` are omitted on `noindex` pages.** `dist/404.html`
   was emitting `canonical` and `og:url` of `https://tai42.ai/404/` — a URL that
   does not exist, on a document GitHub Pages serves at *every* unknown path.
   `BaseLayout` now gates both tags behind `!noindex`. **Applied uniformly, and
   that is correct SEO**: a page we ask crawlers to skip has no canonical URL to
   declare. Checked before applying — no other `noindex` page depends on its
   canonical: the two thank-you pages and `/company/careers` are reachable only
   by direct navigation and are linked from nowhere, and `_agents.astro` is
   unrouted. Verified: 0 canonicals on `/404`, `/thank-you/`,
   `/thank-you-builders/`, `/company/careers/`; every indexable page still has
   exactly one. The rest of the OG card (title, description, image) is untouched.

## Copy and content

7. **The two thank-you pages no longer share a `<title>`.** Contact keeps
   "Thank you — tai42"; builders becomes **"You're on the list — tai42"**,
   derived from its own H1. The title also feeds `og:title` / `twitter:title`.
8. **Removed from `/thank-you-builders`: "We'll be in touch when it opens for
   yours."** — an unapproved commitment about when we make contact. The H1
   ("Thanks — you're on the list.") and the restated honest line ("Founding
   partners are invited in small batches as delivery capacity opens.") stay.
   *Founder: a wording nod on the shortened paragraph would be welcome — it now
   ends on the honest line and promises nothing further.*
9. **`public/llms.txt` line 5: "- Method:" → "- How it works:"** — the label,
   not the URL, which stays `https://tai42.ai/method`. **Ruling:** the 7h
   rename-everywhere ("Method" is retired as a label sitewide) supersedes the
   older verbatim-block treatment of `llms.txt`; the file was the last place the
   old label survived.
10. **`/terms` §8 now contacts `contact@tai42.ai`** instead of
    `balin.miki@tai42.ai` — same `mailto:` link pattern and styling, label
    updated to match. This removes the last person-named address from the site;
    nothing else in §8 changed. `balin` now returns 0 hits in `dist/`.
11. **Three author-rationale HTML comments became Astro template comments**
    (`{/* … */}`), so they no longer ship in `dist/`: the demo-question note on
    `/contact`, and the "hidden until the founder …" gate notes on `/about` and
    `/open-source`. The two `<!-- VERIFY: engineering -->` comments on
    `/security` are sanctioned and remain HTML comments (2 hits in the built
    page, by design). Section-label comments elsewhere are the site idiom and
    were left alone.

## Band rhythm

12. **Homepage.** "What we build" and "Why it works" were both `bg-white`, and
    "Why it works" put three `bg-white` cards on a white band. One fill flip
    could not fix it — inserting or flipping a single band shifts the parity of
    everything after it — so the tail of the page was re-alternated: "Why it
    works" → `bg-gray-50` (its white cards get their contrast back), "The other
    doors" → `bg-white` with its card switched to the `bg-gray-50` card fill
    already used on `/contact`, and the closing CTA → `bg-gray-50`, matching the
    CTA band on `/method`, `/about`, and `/open-source`. The full sequence is now
    hero white · How it works gray · What we build white · Why it works gray ·
    doors white · CTA gray. No copy changed; the frontmatter const
    `WHY_IT_HOLDS` was renamed to `WHY_IT_WORKS` to match the heading.
13. **The two gated sections.** `/open-source`'s boundary table and `/about`'s
    agent roster each rendered next to a section with the same fill, so the
    promised one-flag flip would have broken the rhythm. A gated section is an
    extra band, so the fills *after* it derive from the flag: `/about` gets
    `BAND_CTA`, `/open-source` gets `BAND_PROMISE` / `BAND_HOW_WE_RUN` /
    `BAND_ACTIONS`. Verified by building with each flag flipped both ways — both
    pages alternate in both states, and the flags are back to `false`.

## Gates and self-checks after the cold-review fix wave

`npx astro check` — 27 files, **0 errors, 0 warnings, 0 hints**.
`npm run build` (clean `dist/`) — **14 pages, complete, no warnings**.

| Check | Result |
| --- | --- |
| "The demo question" / "hidden until the founder" in `dist/` | 0 / 0 |
| "We'll be in touch when it opens" in `dist/` | 0 |
| `dist/llms.txt` line 5 | `- How it works: https://tai42.ai/method` |
| `rel="canonical"` in `dist/404.html` | 0 (was 1 × `https://tai42.ai/404/`); `og:url` 0 |
| Canonicals on the other `noindex` pages | `/thank-you/` 0, `/thank-you-builders/` 0, `/company/careers/` 0 — all were 1; indexable pages unchanged at 1 each |
| `balin` in `dist/` | 0 — `/terms` §8 is now `mailto:contact@tai42.ai` |
| Referrer storage | host only — `referrer = referrerHost;` in the built inline script |
| Submit-time `_subject` sync | present on both form pages in `dist/` |
| `dist/method` heading order | h1 → h2 only in `<main>` (was h1 → h3); homepage h1 · h2 · h3×5 · h2 · h2 · h3×3 |
| Stop markers | 2 on `/method`, both `aria-hidden="true"` |
| Home band sequence | white · gray-50 · white · gray-50 · white · gray-50 |
| Gate flips | `/open-source` and `/about` alternate with the flag `true` **and** `false` (built both ways; flags left `false`) |
| Bracket regex `\[[A-Z_]+[^\]]*\]` in `dist/` | 0 |
| Banned strings in `dist/` | Text-to-Flow 0 · Request access 0 · No credit card 0 · SOC 2 0 · certified 0 · autopilot 0 · disrupt 0 · € 0 · base_url 0 · Nexus 0 · Web3Forms 0 |
| "Get your readiness report" anchors | 33 across `dist/`, every one `href="/contact/"` |
| `VERIFY: engineering` comments | still 2, still HTML comments, in `src/pages/security.astro` and `dist/security/index.html` |
| `_next` values in `dist/` | `https://tai42.ai/thank-you/` and `https://tai42.ai/thank-you-builders/` — unchanged, now derived from `Astro.site` |

Nothing was pushed.

---

# Cold-review fix wave 2

Five small items from the final cold pass. No copy in the verbatim-locked spec
blocks was touched, no new dependencies, colours, fonts, or components.

1. **`/security` no longer skips a heading level.** The page outline was
   h1 → h3 × 4 with no h2 anywhere on it. The four block titles ("Open and
   auditable", "Your infrastructure, or your tenant", "Deterministic where it
   matters", "No outbound calls from the self-hosted runtime") are now `h2`,
   classes unchanged and the strings byte-identical. `<main>` outline in
   `dist/security/index.html`: **1, 2, 2, 2, 2**.
2. **`StepLine` — unused `class` prop removed** (`Props.class`, the
   `class: className` destructure, and the `class:list` on the `<ol>`, which is
   now a plain `class`). Neither caller passed it; the same cleanup was already
   done on `ScreenshotSlot`.
3. **`StepLine` stop markers: `aria-hidden="true"` → `role="presentation"`.**
   `role="presentation"` takes the marker `<li>` out of the list's item count —
   so assistive tech still reads five steps, not seven — while the spec-mandated
   "you can leave here" label stays readable, which `aria-hidden` had suppressed.
   `dist/method/index.html`: 2 × `role="presentation"`, 0 × `aria-hidden`, and
   "you can leave here" still present twice.
4. **`/privacy` — the last singular "our thank-you page" pluralised.** The
   analytics-event sentence now reads "when a form submission lands on **one of
   our thank-you pages** …", matching the pluralisation already applied to the
   session-storage sentence in wave 1. There are two thank-you pages.
5. **`/platform` band rhythm.** The page declared `bg-white` twice in a row —
   the hero and the "What it runs" section, which has no top padding and is
   painted as part of the hero's band. The redundant declaration is removed, so
   the section inherits the `body`'s white and the page's painted bands read
   **white · gray-50 · white · gray-50 · white**, like every other page. Nothing
   moves on screen and no card fill changes: the cards still sit `bg-white` on
   the one gray band. (A single fill *flip* cannot alternate this page: with six
   sections, the only one-flip solution is a grey hero, which no other page has.)
6. **Changelog corrections.** Four stale line refs in the wave-B audit
   classification row are corrected against the current files —
   `builders.astro:59 → 63`, `open-source.astro:22 → 29`,
   `open-source.astro:79 → 86`, `about.astro:25 → 30`. The wave-1 opening
   paragraph undercounted itself: it now reads "thirteen fixes consolidated from
   the review's findings" and names all **four** authorised text changes
   (`/thank-you-builders` sentence removal, `/privacy` plural, `llms.txt` label
   rename, `/terms` §8 contact swap), plus the `/thank-you-builders` `<title>`
   change from item 7.

The wave-1 gates table row "Stop markers | 2 on `/method`, both
`aria-hidden="true"`" is superseded by item 3 above.

## Gates and self-checks after fix wave 2

`npx astro check` — 27 files, **0 errors, 0 warnings, 0 hints**.
`npm run build` (clean `dist/`) — **14 pages, complete, no warnings**.

| Check | Result |
| --- | --- |
| `dist/security` `<main>` outline | **1, 2, 2, 2, 2** (was 1, 3, 3, 3, 3) |
| `dist/security` block titles | all four byte-exact, `class` unchanged |
| `VERIFY: engineering` comments | still **2** in `src/pages/security.astro` and **2** in `dist/security/index.html` |
| `dist/method` stop markers | **2 × `role="presentation"`**, **0 × `aria-hidden`**; "you can leave here" × 2 |
| `dist/method` `<main>` outline | h1 → h2 × 10 — unchanged |
| `dist/index` `<main>` outline | h1 · h2 · h3 × 5 · h2 · h2 · h3 × 3 — unchanged; 0 stop markers (home passes no `stopAfter`) |
| `/privacy` singular "thank-you page" in body copy | **0** (2 × "thank-you pages") |
| `dist/platform` band sequence | `bg-white` · *(no fill — hero continuation)* · `bg-gray-50` · `bg-white` · `bg-gray-50` · `bg-white` → painted **white · gray · white · gray · white** |
| Bracket regex `\[[A-Z_]+[^\]]*\]` in `dist/` | **0** |
| Banned strings in `dist/` | Text-to-Flow 0 · Request access 0 · No credit card 0 · SOC 2 0 · certified 0 · autopilot 0 · disrupt 0 · € 0 · base_url 0 · Nexus 0 · Web3Forms 0 · "production audit" 0 |
| Files touched | `src/pages/security.astro`, `src/components/StepLine.astro`, `src/pages/privacy.astro`, `src/pages/platform.astro`, `CHANGELOG-website-hotfix.md` |

Known and left alone: `src/layouts/BaseLayout.astro:68` carries an HTML comment
ending "… fired from the thank-you page." — a developer note about the Plausible
custom event, not visitor copy. It ships in every built page (14 hits for the
singular form in `dist/`) and predates this wave.

Nothing was pushed.

## Cold-review fix wave 3 (documentation)

Documentation only — no page copy, no markup, no logic. One Astro frontmatter
comment and this changelog. `dist/` is byte-identical before and after
(40 files, sha256 per file — no diff), so nothing shipped changed.

1. **`src/pages/about.astro` — the roster gate comment was wrong about the
   flip.** It said "Flip this to true to bring the section back — nothing else
   has to change", but `AGENT_ROSTER` is `[]`, so a lone flip publishes an empty
   card. The comment now spells out the order: **first** fill `AGENT_ROSTER`
   with entries (agent + owner role, never a person's name), **then** flip
   `SHOW_AGENT_ROSTER`. Pending-list item 5 already said the founder supplies
   the entries; only the in-file comment was misleading.
2. **Wave-A gates row `Nexus 1` clarified.** That row counted
   case-insensitively, and its single hit is the lowercase URL path in the
   `/product/nexus/` redirect stub. The capitalized brand term is 0 in `dist/`
   (re-verified this wave: `grep -ro "Nexus" dist` → **0**,
   `grep -ro "nexus" dist` → **1**), which is what the later gates tables
   report. The 1 → 0 across this document is a counting-method difference, not
   a change to the output.
3. **Pending item 3 (the `/platform` screenshots) corrected.** "Nothing renders
   while a file is missing" was loose — the missing file is not what gates the
   markup. `ScreenshotSlot.astro` renders nothing while `show` is false, and
   renders an `<img>` at `src` as soon as `show` is true, file or no file. The
   item now states the order: drop the file in **before** flipping, or the slot
   renders a broken image.
4. **New pending item 8 — enable GitHub Discussions for the `tai42ai` org.**
   Found while checking the outbound links: `/open-source` links
   `https://github.com/orgs/tai42ai/discussions`, which **returns 404**. Checked
   against the GitHub API — no repo under the org has discussions enabled, so
   GitHub has no source repo to serve the org-level Discussions page from. §8.2
   (the community forum) is blocked on it. The URL is the org's canonical
   Discussions path and is **left exactly as written**; it starts resolving as
   soon as a source repo is designated. This is a GitHub-side action for the
   founder, not a code change.

Gates after this wave: `npx astro check` — 27 files, **0 errors, 0 warnings,
0 hints**. `npm run build` — **14 pages, complete, no warnings**. `dist/`
unchanged (byte-identical, all 40 files). Files touched:
`src/pages/about.astro`, `CHANGELOG-website-hotfix.md`.

Nothing was pushed.
