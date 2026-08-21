# HOTFIX-2-REPORT — website-hotfix-2

Branch `website-hotfix-2` · HEAD `02e4e7c` · **23 commits** on base `d266de4` (live `main`) —
6 from the deploy-completion pass (task 3, `ebb1016`…`58fc3d5`) and 17 from the 20-Aug
decision set (task 4, `18d5c7e`…`02e4e7c`). Working tree clean.
Verified **2026-08-21**. This file **replaces** the previous report, which described the
pre-task-4 state and is superseded in full.

Every check below was re-run from scratch for this report: `rm -rf dist && npm run build`,
then greps over `src/`, `public/` and the rendered `dist/`, the two `mailto:` hrefs decoded
out of the built HTML, and **cache-busted live `curl`** (unique `?cb=<timestamp>` +
`Cache-Control: no-cache`, so neither the browser nor the Pages CDN can answer from cache)
wherever the claim is about the live site.

**Build gate.** `npx astro check` → **22 files, 0 errors, 0 warnings, 0 hints**.
`rm -rf dist && npm run build` → exit 0, `[build] 12 page(s) built in 683ms`,
`[build] Complete!`, no warnings. `dist/` holds **20 HTML files** — the 12 built pages plus
the 8 legacy redirect stubs. (`src/pages/_agents.astro` is underscore-prefixed and unrouted,
so it is not one of the 12.)

---

> ## ⚠️ NONE OF THIS IS LIVE
>
> **Live `main` is `d266de4`. This branch is 23 commits ahead and has never been pushed or
> deployed.** Everything in this report describes the *branch build*, not what tai42.ai
> serves right now. Proof, fetched cache-busted on 2026-08-21:
>
> | Live `tai42.ai` today (`d266de4`) | This branch |
> | --- | --- |
> | `/about` `<h1>` = "The self-driving company, **the honest way**" | "The self-driving company, in production." |
> | `/method` renders "Who we work with **(the honest filter)**" | "Who we work with" |
> | `/method` renders "**you can leave here**" ×1 | 0 sitewide |
> | `/terms` renders "**TAI42, Inc.**" | 0 sitewide |
> | `/builders` serves **1 `<form>`** | 0 forms sitewide |
> | Home CTA reads "**Get your readiness report**" ×4 | "Get your production readiness report" ×30 |
> | `/thank-you/` → **200** | route deleted (will 404 after publish — accepted, see below) |
>
> The founder publishes. Nothing here is deployed from this branch.

Verdicts: **PASS** · **PASS (with founder action)** · **NOT-A-DEFECT**.

---

## Summary

| # | Check | Verdict |
| --- | --- | --- |
| 1 | Original diagnosis table (task 3) | **NOT-A-DEFECT** — stale cache; live re-verified today |
| 2 | Placeholder regex `\[[A-Z_]+[^\]]*\]` = 0 | **PASS** — 0 in `src/` + `public/` + `dist/` |
| 3 | Both mailto buttons | **PASS** (build) · founder does the 30-second client test |
| 4 | Redirects — 8 stubs + doc-path redirector | **PASS** |
| 5 | One shared header/footer everywhere | **PASS** |
| 6 | Casing regex `(^\|[.!?]\s+)tai42\b` = 0 | **PASS** — 0 rendered, 0 in metas |
| 7 | CTA "Get your production readiness report" | **PASS** — 30 instances, 29 → `/contact/` + 1 mailto |
| 8 | "the honest way" / "you can leave here" / label vocabulary | **PASS** — all 0 |
| 9 | Alignment + styling uniform | **PASS** — `text-center` 0, ` - ` 0, headings sentence-case |
| 10 | Sitewide zero-hit sweep + page-render spot-checks | **PASS** |

---

## 1. The original diagnosis table · NOT-A-DEFECT (resolved in task 3)

**Condensed.** The prompt's "the live site is half old, half new" table was disproved in
task 3 and the finding stands. Full cause analysis: **`CHANGELOG-website-hotfix-2.md`,
Step 1** — read it there, it is not repeated here. In one line: the repo and the deployed
artifact were both, entirely, the new generation; GitHub Pages publishes **one atomic
artifact** per run (`dist/` replaces the whole site, so "half deployed" is impossible by
construction), the `deploy-pages` run for `d266de4` completed `success` 2026-08-19
21:18:34Z, and what the founder saw were **pre-deploy browser/CDN cached copies**. Remedy:
a hard refresh. No redeploy was or is needed for that symptom.

**The four pages re-verified live today** (2026-08-21, `?cb=<ts>` + `Cache-Control: no-cache`):

| URL | HTTP | Live `<h1>` | Old-generation markers |
| --- | --- | --- | --- |
| `https://tai42.ai/platform/` | **200** | "BabelFish — one engine for business functions in production." | `mock` 0, bracket regex 0 |
| `https://tai42.ai/about/` | **200** | "The self-driving company, the honest way" | bracket regex 0 |
| `https://tai42.ai/builders/` | **200** | "Your clients. Our engine." | `WEB3FORMS` 0, bracket regex 0 |
| `https://tai42.ai/security/` | **200** | "Security by architecture" | bracket regex 0 |

Each H1 exists only in the new generation. `/about`'s live H1 is still the *old* new-gen
wording ("the honest way") — that is this branch's change (§8), and it is **not live**.

The two task-3 code fixes (the "Two other doors." heading, the StepLine mobile marker) were
both **superseded inside this branch**: 4d removed the doors label outright (changelog
Step 9) and 4e removed the stop-point marker from `StepLine` entirely (changelog Step 8).

## 2. Bracket placeholders · PASS

```
$ grep -rEo '\[[A-Z_]+[^]]*\]' src/ public/ dist/ | wc -l
0
```

Zero across source, static assets and the rendered build — including the unrouted
`src/pages/_agents.astro`. Also 0 on all four live pages (§1). **This regex is the last gate
before every future publish.**

## 3. Both mailto buttons · PASS in the build · founder does the client test

Decoded straight out of the built HTML (`&#38;` is the HTML-escaped `&`; browsers decode it
before navigating). Both are **plain `<a href="mailto:…">` anchors with no `target` and no
`rel`** — a `target="_blank"` would open a dead tab in most desktop mail configurations.

### `/contact` — `dist/contact/index.html`

* Address: `contact@tai42.ai` ✅
* Subject: `Production readiness report` ✅ (byte-identical to spec)
* Body, decoded — line breaks are `\r\n` (`%0D%0A`), never bare `\n`:

```
Do you have a working demo today? (paste a link, a video, or a sentence)⏎
⏎
What breaks — or what's stopping you from putting it in front of real users?⏎
⏎
How will you measure success in production?⏎
⏎
Name / Company:⏎
⏎
```

All four prompt lines **byte-identical** to the spec (`_state/task4-completion-v2.md`,
Step 3 forms), including the em dash (U+2014) and the straight apostrophe (U+0027) in
"what's". One blank line after every prompt, including the last, so there is room to type
under "Name / Company:".

Second address instance on the page: `<a href="mailto:contact@tai42.ai">` in the inline
line "or write to contact@tai42.ai — we read everything and reply with a time to talk."

### `/builders` — `dist/builders/index.html`

* Address: `builders@tai42.ai` ✅
* Subject: `Founding builder` ✅
* Body, decoded:

```
Company:⏎
⏎
What you deliver today (agency / dev shop / service firm / operator):⏎
⏎
Roughly how many clients:⏎
⏎
```

All three prompt lines byte-identical to spec. Same `\r\n` layout. Second instance: the
inline "or write to builders@tai42.ai."

### ⚠️ The render-and-deliver test is manual — 30 seconds, founder

The build proves the **href is correct**; it cannot prove your mail client prefills it or
that Google Workspace accepts the mail. Do this on the preview before publishing:

1. Open the preview `/contact/`, click **"Get your production readiness report"**. Your mail
   client should open a new message **To** `contact@tai42.ai`, **Subject** "Production
   readiness report", **Body** the four prompts with a blank line under each. Confirm the
   blank lines survived (some webmail clients collapse them — if so, say so and we adjust).
2. Repeat on `/builders/` with **"Join the founding waitlist"** → `builders@tai42.ai`,
   subject "Founding builder", three prompts.
3. **Send one real test to each Group from an address outside the domain** (personal Gmail,
   phone). Confirm both arrive.

Step 3 is the one that can silently fail: **both `contact@tai42.ai` and
`builders@tai42.ai` Google Groups must be set to accept external senders.** A members-only
group drops outside mail with no bounce, and with the forms gone there is no backend, no
bounce surface and no analytics event left to notice a lost message — these two buttons are
the site's **only** intake path. This is the deliverability founder-action recorded in
`CHANGELOG-website-hotfix-2.md`, Step 4.

## 4. Redirects · PASS

**Eight legacy stubs, one hop each, in the build and live.** `astro.config.mjs` declares
them; each emits a `<meta http-equiv="refresh" content="0;url=…">` plus a matching
`<link rel="canonical">` and `<meta name="robots" content="noindex">`. **Every target is a
real page, never another stub** — one hop, no chains.

| Requested | Stub target in `dist/` | Canonical | Live (cache-busted) | Target live |
| --- | --- | --- | --- | --- |
| `/pricing/` | `/platform/` | `https://tai42.ai/platform/` | **200** | **200** |
| `/product/nexus/` | `/platform/` | `https://tai42.ai/platform/` | **200** | **200** |
| `/product/babelfish/` | `/platform/` | `https://tai42.ai/platform/` | **200** | **200** |
| `/babelfish/` | `/platform/` | `https://tai42.ai/platform/` | **200** | **200** |
| `/babelfish/agentic-to-flow/` | `/platform/` | `https://tai42.ai/platform/` | **200** | **200** |
| `/how-it-works/` | `/method/` | `https://tai42.ai/method/` | **200** | **200** |
| `/company/about/` | `/about/` | `https://tai42.ai/about/` | **200** | **200** |
| `/company/contact/` | `/contact/` | `https://tai42.ai/contact/` | **200** | **200** |

**Doc-path client-side redirector — intact in `dist/404.html`.** GitHub Pages has no
redirect rule file and no wildcard, so a path with no file *must* answer 404 on the wire;
the redirect therefore lives in the 404 body that Pages serves for every unknown route.
Present verbatim in the built `dist/404.html`:

```js
var docPaths = /^\/(getting-started|concepts|guides|reference)(\/|$)/;
var path = window.location.pathname;
if (docPaths.test(path)) {
  window.location.replace(
    "https://docs.tai42.ai" + path + window.location.search + window.location.hash
  );
}
```

Path, query and hash all preserved. Docs targets live, 2026-08-21:

| URL | Status |
| --- | --- |
| `https://docs.tai42.ai/getting-started/installation` | **200** |
| `https://docs.tai42.ai/concepts/layering` | **200** |
| `https://docs.tai42.ai/guides` | **200** |
| `https://docs.tai42.ai/reference` | **307 → `…/reference/api` → 200** (docs host's own trailing redirect; resolves) |
| `https://tai42.ai/concepts/layering` | **404** on the wire — expected; the body redirects in a browser |

**True 301s require a hosting move** (Cloudflare Pages/Workers, Netlify, Vercel — any origin
with a rule file). Founder decision, not a code change.

**`/thank-you/` and `/thank-you-builders/`** are deleted with the forms (changelog Step 4).
Both were `noindex`ed and reachable only as a form `_next` target; nothing on or off the site
linked to them. They will 404 after publish — **accepted deliberately**, no stub added.
(Live they still return 200 today, because this branch is not deployed.)

## 5. One shared header and footer everywhere · PASS

**One nav component, one link array, both viewports** — `src/components/NavBar.astro`:

```
19  const NAV_LINKS = [
20    { href: "/",                      label: "Home" },
21    { href: "/method/",               label: "How it works" },
22    { href: "/platform/",             label: "Platform" },
23    { href: "/open-source/",          label: "Open Source" },
24    { href: "https://docs.tai42.ai",  label: "Docs" },
25    { href: "/about/",                label: "About" },
26    { href: "/contact/",              label: "Contact" },
27  ];
…
40        {NAV_LINKS.map((link) => (     ← :40  desktop row  (hidden lg:flex)
…
72      {NAV_LINKS.map((link) => (       ← :72  mobile panel (#mobile-menu)
```

Nav order as specified: **Home · How it works · Platform · Open Source · Docs · About ·
Contact**, then the CTA — `NavBar.astro:51` (desktop) and `:81` (mobile), both
`Get your production readiness report` → `/contact/`.

**One footer** — `src/components/Footer.astro`, single source of the columns and of the
contract sentence (`Footer.astro:51`).

`NavBar` is imported by **13** files under `src/pages/` and `Footer` by the same **13** — the
12 built pages plus the unrouted `_agents.astro` (e.g. `src/pages/index.astro:4`
`import Footer from "../components/Footer.astro";`, `:208` `<Footer />`). **No page holds its
own copy of a link list**, so no page can carry a stale nav or footer.

Verified in the build, not just in source:

* The extracted `(href, label)` list from `<nav>` is **identical across all 12 built pages**
  — one MD5 (`dd09bfedc87c`) for the lot, 8 logo/desktop/mobile+CTA entries repeated as
  expected. The 8 files with no `<nav>` are exactly the 8 redirect stubs.
* The whole `<footer>…</footer>` block is **byte-identical across all 12 built pages** — one
  MD5 (`571a60d09898`).

## 6. Name casing · PASS

```
regex: (^|[.!?]\s+)tai42\b
rendered text, all 20 built HTML files (scripts, styles, comments and tags stripped) → 0
every <meta description> / og:description / twitter:description                       → 0
```

**Ruled exemption, stated:** `og:image:alt` and `twitter:image:alt` carry the value
`tai42 logo` — **24 occurrences** (2 per page × 12 pages), the only distinct `image:alt`
value in the build; the logo `<img>` also carries `alt="tai42"` **24 times**. These are the
logo image's alt text, which spec 4b(2) exempts explicitly ("the logo image … untouched").
They are not sentences and not rendered copy; they are excluded from the regex sweep by that
rule, not by oversight.

Also 0: `TAI42` (case-sensitive) in `src/`, `public/`, `dist/`.

**The one-sentence contract, three instances, byte-identical.** `sort -u` over every rendered
occurrence yields exactly **one** distinct string:

> Tai42 builds and runs its business on this runtime; the code is open; the company sells the hosted platform and enterprise layer on top — never a different core.

Source instances — `src/components/Footer.astro:51`, `src/pages/open-source.astro:103`
(blockquote), `src/pages/about.astro:34` (layer-card body). Rendered: the footer instance on
all 12 pages, plus the extra one on `/about` and on `/open-source` (both files show 2).
`/platform` shows **1** — footer only; there is no contract instance in its body (see the
founder item below).

## 7. The CTA · PASS

`Get your production readiness report` — **30 rendered instances** in `dist/`:

| Surface | Per page | Total |
| --- | --- | --- |
| `NavBar` desktop CTA + mobile-menu CTA | 2 × 12 built pages | 24 |
| `/` hero CTA + `/` bottom CTA | 2 | 2 |
| `/method` bottom CTA | 1 | 1 |
| `/about` bottom CTA | 1 | 1 |
| `/platform` actions row (primary of the pair; the secondary "Talk to us about a tenant" is untouched) | 1 | 1 |
| `/contact` mailto button | 1 | 1 |
| | | **30** |

Per-file counts: `index` 4 · `platform` 3 · `method` 3 · `about` 3 · `contact` 3 ·
`404`/`builders`/`careers`/`open-source`/`privacy`/`security`/`terms` 2 each.

**Every one of the 29 non-mailto instances resolves to `/contact/`**; the single exception is
the `/contact` button itself, whose `href` is the `mailto:contact@tai42.ai?subject=…` from §3.

```
grep -rio 'Get your readiness report' src/ public/ dist/   → 0
```

**Upgraded first mentions — the complete list (two sentences):**

1. `src/pages/platform.astro:193`, "Getting started" — renders:
   "Enterprise pricing, sized to your tenant and usage — talk to us. The **production
   readiness report** is free: we assess your demo and your integration surface, …"
   (the sentence's own later "a written report" is the thereafter case, left alone).
2. `src/pages/method.astro`, section-2 heading — renders `<h2>` **"What's in the production
   readiness report"**. The page's literally-first occurrence of the words is inside step 1's
   locked paragraph ("You leave with a written readiness report and a proposal"), which 4e
   locks verbatim and which already sits under the step title "The production readiness
   review (free, entry)."; the `<h2>` is the page's first *standalone* naming, so the full
   name lands there. Both verified in the rendered text.

Deliberately not changed (all say "review", not "report", or are later mentions):
`/method` step-1 title and page intro, `/about`'s "the readiness review", `/`'s "Production
readiness review (free)." and `/method`'s locked step-1 paragraph.

## 8. Working labels and the leave-idea · PASS

Counted over `src/` + `public/` (case-insensitive) and over `dist/`:

| Term | src+public | dist |
| --- | --- | --- |
| `the honest way` | 0 | 0 |
| `you can leave here` | 0 | 0 |
| `honest line` | 0 | 0 |
| `honest filter` | 0 | 0 |
| `Two other doors` | 0 | 0 |
| `doors line` | 0 | 0 |
| `proof strip` | 0 | 0 |
| `the one-sentence contract` | 1 † | **0** |
| `earns its keep` | 0 | 0 |

† The single source hit is `src/pages/about.astro:32`, an Astro frontmatter `//` comment
explaining *why* the lead-in was deleted. Frontmatter comments are compiled away — 0 in
`dist`. (HTML `<!-- -->` comments **do** survive into the build; those were all renamed in
changelog Steps 9 and 11, which is why the `dist` column is clean.)

The leave-idea now appears exactly once on the site, as the `/method` gate line: "Every phase
ends at a written gate. You can stop at any of them — which is exactly why clients don't."

Home's doors block renders with **no heading** — the rendered text runs straight from the
"Why it works" cards to "For builders → join the founding waitlist".

## 9. Alignment and styling · PASS

| Check | Result |
| --- | --- |
| `text-center` in `src/` | **0** |
| `text-center` in `dist/` **HTML** | **0** |
| `text-center` in `dist/` CSS | 1 dead utility ‡ |
| ` - ` (spaced hyphen) in rendered text, all 20 HTML files | **0** |
| Sentence-case headings, every `h1`–`h3` on all 12 built pages | **all sentence case** |

‡ `dist/_astro/about.*.css` emits `.text-center{text-align:center}` because Tailwind v4 scans
the repo's markdown too and `CHANGELOG-website-hotfix-2.md` mentions the class in its
changed-elements table. **No element in any built page uses it.** Dead CSS, not a live
alignment.

Headings were enumerated from the build and read: `/` "How it works" / "What we build" /
"Why it works"; `/method` "The five steps" / "What's in the production readiness report" /
"Where humans stay" / "What we ask of you" / "What you keep" / "Who we work with";
`/platform` "What it runs" / "What you get" / "Getting started"; `/open-source` "Why we did
it" / "What it is" / "What we promise about it" / "How we run it"; `/terms` "1. Acceptance of
terms" … "10. Contact"; `/privacy` "What this site collects" / "When you write to us" / "Who
is responsible & your rights" / "The runtime you self-host, the platform we host";
`/company/careers` "Build the open agent runtime." + "Open roles". No Title Case survivors.
(The footer's `Site` / `Doors` / `Legal` column labels are single words; their all-caps look
is a CSS `uppercase`, not copy.)

**The changed-elements evidence lives in `CHANGELOG-website-hotfix-2.md`, Step 12** — the
full table of every element whose alignment or style was touched, plus the stated spacing
scale (`py-20 lg:py-28` heroes, `py-20 lg:py-24` every other band, `pb-20 lg:pb-24` for a
closing section) and the `/privacy` band note under it. It is not duplicated here.
**Three entries spot-verified against source today:**

| Changelog row | Verified |
| --- | --- |
| `/` hero container — `text-center` removed | `src/pages/index.astro:108` is `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 lg:mt-16`; `text-center` count in the whole file = **0** ✅ |
| `/security` `<h1>` — `tracking-tight` → `leading-[1.1]` | `src/pages/security.astro:21` = `text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-[1.1] mb-6` ✅ |
| `/company/careers` — H1 downcased, "Get in touch →" to the sitewide link idiom | `careers.astro:22–24` renders "Build the open agent runtime."; `:48` = `inline-flex items-center font-medium text-crimson hover:text-burgundy transition-colors` ✅ |

`/platform` and `/open-source` action rows both carry the shared
`flex flex-col sm:flex-row items-start sm:items-center gap-4` (platform `:222`,
open-source `:189`) — one idiom, two pages.

## 10. Sitewide sweep and page-render spot-checks · PASS

**Zero-hit list** — `grep -rio` over `src/` + `public/` and over `dist/`:

| Term | src+public | dist |
| --- | --- | --- |
| production audit | 0 | 0 |
| travel-tech marketplace | 0 | 0 |
| travel-tech | 0 | 0 |
| SOC 2 | 0 | 0 |
| SOC2 | 0 | 0 |
| certified | 0 | 0 |
| autopilot | 0 | 0 |
| disrupt | 0 | 0 |
| € | 0 | 0 |
| Nexus (case-sensitive) | 0 | 0 § |
| base_url | 0 | 0 |
| Request access | 0 | 0 |
| No credit card | 0 | 0 |
| TAI42 (case-sensitive) | 0 | 0 |
| `Inc\.` | 0 | 0 |
| Formspree | 0 | 0 |
| Web3Forms | 0 | 0 |
| calendar.google.com | 0 | 0 |
| PENDING_FOUNDER | 0 | 0 |
| qualified_form_submission | 0 | 0 |
| thank-you | 3 ¶ | 0 |

§ One **case-insensitive** hit in `dist/product/nexus/index.html` — the legacy *URL path*
inside the retired-URL redirect stub (`/product/nexus/` → `/platform/`). Case-sensitive
`Nexus` is 0: the retired brand name appears nowhere in copy.
¶ Three source `//` frontmatter comments (`contact.astro:9`, `builders.astro:9`,
`privacy.astro:10`) recording that there is no thank-you page. Compiled away — 0 in `dist`.

**`/agents` — 404 by absence · PASS.** No `dist/agents/` directory is emitted; the page
source is parked at `src/pages/_agents.astro` and Astro does not route a leading-underscore
file. `href="/agents` → **0** hits in `src/` and `dist/`. Live:
`https://tai42.ai/agents/` → **404** (cache-busted, 2026-08-21).

**`/method` renders strip → gate line → blocks · PASS.** Rendered text order in
`dist/method/index.html`: `<h2>` "The five steps" → the five strip nodes
`1 Readiness review · 2 Readiness gate · 3 Build · 4 Acceptance · 5 Run` → the gate line
"Every phase ends at a written gate. You can stop at any of them — which is exactly why
clients don't." → the five detail blocks, each `badge + <h3> + locked paragraph`. Heading
outline, no skip: `h1` "How it works" → `h2` "The five steps" → five `h3` step titles →
five sibling `h2` sections. Step titles are `text-base font-bold` (16px) against `text-3xl
sm:text-4xl` (30/36px) section headings — visibly subordinate. One number per step (the
badge; no numeral in any title).

**`/about` new H1 and titles · PASS.** `<h1>` = "The self-driving company, in production.";
`<title>`, `og:title` and `twitter:title` all = "The self-driving company, in production. —
tai42" (all three derive from the one `title` prop in `BaseLayout`).

**`/terms` §8 Trademarks and §9 Provider render · PASS.** Rendered verbatim:

> **8. Trademarks** — Tai42, the tai42 logo, and BabelFish are marks of tai42. The
> Apache-2.0 license covering the runtime grants no rights to these marks; you may not use
> them except to accurately describe the origin of the software.
>
> **9. Provider** — Tai42 is currently operated by its founders. A corporate entity will be
> designated upon incorporation, and these terms will be updated to name it. Questions:
> contact@tai42.ai.

§§1–7 keep their numbers, Contact moved to §10. **No governing-law section, no Aviso Legal,
no jurisdiction clause, no registered office, no registry number** — all 0 in the rendered
page. §1 now reads "…any services provided by tai42 ("tai42," "we," "us")…". Effective date
renders "August 2026" (founder re-verifies at the actual publish date).

**`/privacy` truth spot-checks · PASS.** The page's claims are checked against the build, not
against intent:

| Claim on the page | Build |
| --- | --- |
| "the site has no forms" | `<form` in `dist/` → **0** |
| "nothing written to browser storage" | `sessionStorage` **0**, `localStorage` **0**, `document.cookie` **0** in `dist/` |
| "Page views are the only measurement: the site fires no other events" | `plausible(` **0**, `window.plausible` **0** in `dist/`; the only Plausible artefact is the tag itself |
| Plausible *is* loaded | `<script is:inline defer data-domain="tai42.ai" src="https://plausible.io/js/script.js">` present in **12 / 12** built pages (`BaseLayout.astro:69`); the inline event-queue shim is gone |
| Processors named | renders "Providers that handle data on the way: GitHub hosts the site and receives standard request data, Plausible receives the analytics request, and Google carries our mail and our calendar — each processing it under its own terms." — three named, matching the three the build actually uses |
| Formspree / forms / thank-you / source tag / session-storage entry | **0** hits on the page |
| No entity, registry or address named | confirmed |

---

## Still open — founder

Nothing in this list blocks the build; every item is a value, a decision or an action only
the founder can take.

1. **Deliverability check (do this first).** Confirm both `contact@tai42.ai` and
   `builders@tai42.ai` Google Groups **accept external senders**, then send one test mail to
   each from an outside address and confirm arrival. See §3 for the 30-second procedure.
   These two mailtos are the site's only intake path and a members-only group drops outside
   mail silently. (`CHANGELOG-website-hotfix-2.md`, Step 4.)
2. **Enable GitHub Discussions** on a `tai42ai` repo. `/open-source` links
   `https://github.com/orgs/tai42ai/discussions` (`open-source.astro:23`), which returns
   **404 today**. The URL is correct and needs no change — the feature needs enabling.
3. **The three `/platform` screenshots.** Drop `example-flow.png`, `visual-builder.png`,
   `audit-observability.png` into `public/images/platform/`, **then** flip `show` to `true`
   on each of the three `ScreenshotSlot` instances (`platform.astro:89, :139, :158`). File
   first: the flag, not the file, gates the markup — flipping first renders a broken image.
4. **`/open-source` boundary table.** Founder confirms the open/commercial split, then
   `SHOW_BOUNDARY_TABLE = true` (`open-source.astro:12`). Band colours flip automatically.
5. **`/about` agent roster.** Founder supplies the entries (agent + owner *role*, never a
   person's name), then `SHOW_AGENT_ROSTER = true` (`about.astro:17`).
6. **`/security` engineering sign-off ×2.** The two sentences marked
   `<!-- VERIFY: engineering -->` (`security.astro:102` and `:107`): "The open-source runtime
   you self-host makes no outbound calls back to us and has no required cloud dependency."
   and "Nothing about your workloads is reported to tai42." Remove both comments once signed.
7. **`/platform` contract instance.** Founder confirms whether Change Order v1.5 §4.4 still
   requires the one-sentence contract in the `/platform` **body**. The 7j rebuild removed it;
   only the footer instance renders on that page today (§6).
8. **"Read the technical overview"** returns to `/platform` card 1 once engineering signs off
   on the white paper. Absent everywhere today, as gated.
9. **Counsel / voice-pass notes** (copy is correct as written; these want a human read):
   * `/terms` now says **"these terms"** throughout (6 occurrences) where the previous
     version said "these Terms of Service" — a defined-term capitalisation counsel may want
     back.
   * §1's defined-term parenthetical **dropped `"or our"`** — it now reads
     `("tai42," "we," "us")` — while the body still uses "our" twice (§5 "our privacy
     policy", §7 "our website"). Harmless in plain English; counsel may want "or our"
     restored to the definition.
   * `/company/careers` H1 was **downcased** to "Build the open agent runtime." by the
     sentence-case sweep. Confirm that reads right for a recruiting page.
   * **Three meta descriptions run past the ~160-character search-snippet window:** `/` 185,
     `/platform` 173, `/builders` 167. (`/security` 150 and `/privacy` 136 were already
     trimmed in the cold-review waves.) Not a defect — a trim for the voice pass.

Also carried forward, neither a code change: **a hard refresh** is the whole remedy for the
"half old" report (§1), and **a true 301 for the doc paths needs a hosting move** (§4).

## Deliverables

* **Branch `website-hotfix-2`** — **23 commits** on base `d266de4` (HEAD `02e4e7c`): 6 from
  the task-3 deploy-completion pass, 17 from the task-4 20-Aug decision set.
* **`CHANGELOG-website-hotfix-2.md`** — Step 1 the cause analysis, Steps 2–3 the two task-3
  fixes (both later superseded inside the branch), Steps 4–14 the decision set with a wave
  gate after each wave, then the cold-review fix waves.
* **`CHANGELOG-website-correction.md`** — the earlier branch's record, carried unchanged;
  its two "Outside this repo" contract-sentence instructions (docs landing, GitHub org
  README) are **superseded** by the casing rule, with the corrected text recorded in
  hotfix-2 Step 11 rather than history being rewritten.
* **`HOTFIX-2-REPORT.md`** — this report, replacing the pre-task-4 version in full.

**Cold review.** Task 3 ran one solo cycle (`d2e16ff`, `58fc3d5`). Task 4 ran **2 review
batches, 2 fix waves and 3 final passes** (`e1a72e6`, `7afaba0`, `02e4e7c`) and came back
**certified clean** — no high, medium or substantive-low findings outstanding.

**NOT deployed.** Nothing has been pushed. Live `main` is still `d266de4`; the founder
publishes after reading. **The placeholder regex `\[[A-Z_]+[^\]]*\]` is the last gate before
every future publish.**
