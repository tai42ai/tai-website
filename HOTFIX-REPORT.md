# HOTFIX-REPORT — website-hotfix-1

Branch `website-hotfix-1` · HEAD `f485690` · 28 commits on base `e821a2a` (live `main`).
Verified 2026-08-19 19:12–19:17 UTC, on this branch, working tree clean
(`git status` → "nothing to commit, working tree clean").

Every check below was re-run from scratch for this report: `rm -rf dist && npm run build`,
then greps over `src/`, `public/`, and the rendered `dist/`, plus live `curl` where the spec
asks for a live resolve. Nothing is cited from an earlier review.

**Build gate.** `rm -rf dist && npm run build` → exit 0, `[build] 14 page(s) built in 1.18s`,
`[build] Complete!`, no warnings. `npx astro check` → `Result (27 files): 0 errors, 0 warnings,
0 hints`. Node v24.13.1, npm 11.8.0.

**Local evidence server.** `npm run preview -- --port 4399` (astro preview over `dist/`),
used for status codes and content types. Anything that depends on GitHub Pages serving the
built site at tai42.ai is marked *post-deploy*.

Verdicts: **PASS** · **BLOCKED-ON-FOUNDER** (correct as written, cannot complete without a
founder-side action) · **N/A**.

---

## Summary

| # | Check | Verdict |
| --- | --- | --- |
| 1 | No bracket placeholders in rendered pages/templates/content | PASS |
| 2 | `/open-source` matches 7k; links; table hidden; license | **BLOCKED-ON-FOUNDER** (Discussions only) |
| 3 | `/about` matches 7i; no "Who built this"; roster hidden | PASS |
| 4 | Forms render, validate, submit; no key/ID/address visible | **BLOCKED-ON-FOUNDER** (form IDs) |
| 5 | Doc redirects + four legacy redirects | PASS (doc paths client-side; live side post-deploy) |
| 6 | `/llms.txt` 200 text/plain, DOCS filled, no agents line | PASS |
| 7 | `/agents` 404, no page, no link | PASS (live 404 post-deploy) |
| 8 | `/blog` URLs resolve; blog unlinked | N/A — no blog ever existed in this repo |
| 9 | `/security` verbatim; two VERIFY comments in source | PASS |
| 10 | `/platform` matches 7j; three hidden slots; no mock, no overview link | PASS |
| 11 | `/method` capitalization (absorbed into 7h) | PASS |
| 12 | `/privacy` + `/terms` zero-hit list | PASS |
| 13 | Sitewide zero-hit list | PASS |
| 14 | No new dependencies, colors, fonts, components (list) | PASS (3 components listed) |
| 15 | Homepage H1/sub/title/OG; old H1 zero hits | PASS |
| 15x | "Three things, one company" card; `/about` matches 7i | PASS |
| 15y | Nav order + `/method` per 7h; "Method" label gone | PASS |
| 15z | About carries the evidence; Home carries no third-party statistics | PASS |
| 15a | Home order; zero-hits; no proof strip; doors block placement | PASS |
| 15b | Primary CTA text + target; calendar once; "audit" hits listed | PASS |
| 16 | Docs in nav after Open Source and in footer; → DOCS_HOST; 200; same styling | PASS |

---

## 1. Placeholders — zero bracket hits · PASS

```
grep -rEn '\[[A-Z_]+[^]]*\]' src/ public/ astro.config.mjs      → 0
grep -rEo '\[[A-Z_]+[^]]*\]' --include='*.html' dist/           → 0
grep -rEo '\[[A-Z_]+[^]]*\]' dist/llms.txt                      → 0
```

Zero hits in source, in every rendered page, and in the one content file. (The only
bracket matches anywhere under `dist/` are 24 JavaScript array literals inside the bundled
Astro runtime chunk `dist/chunks/astro/server_*.mjs` — e.g. `[Symbol.toStringTag]`,
`[PROP_TYPE.Date, value.toISOString()]` — not page content.) The pre-hotfix baseline
recorded in the changelog was 16 rendered bracket instances across 10 distinct labels.

## 2. `/open-source` — 7k copy, links, hidden table, license · BLOCKED-ON-FOUNDER (Discussions)

**Structure — PASS.** `dist/open-source/index.html` renders, in order: H1 "The runtime is
open" → "Why we did it" → "What it is" (with the Docs · GitHub links line) → the
one-sentence contract as a blockquote → "What we promise about it" → "How we run it" →
actions "Read the docs" / "GitHub". Copy matches 7k verbatim, including "under the
Apache-2.0 license". The contract sentence on the page is character-identical to the footer
instance ("tai42 builds and runs its business on this runtime; the code is open; the company
sells the hosted platform and enterprise layer on top — never a different core.").

**Boundary table hidden — PASS.** `src/pages/open-source.astro:11` `const
SHOW_BOUNDARY_TABLE = false;`
`grep -c "managed private tenants\|What's open, what's commercial\|<table" dist/open-source/index.html` → `0`.
No markup, no empty frame. The written rows (`OPEN_ROWS`, `COMMERCIAL_ROWS`) are kept in
source for the flip.

**Links — live `curl -s -o /dev/null -w "%{http_code}" -L`:**

| URL | Status |
| --- | --- |
| `https://github.com/tai42ai` | **200** |
| `https://docs.tai42.ai` | **200** |
| `https://docs.tai42.ai/getting-started/installation` | **200** |
| `https://docs.tai42.ai/concepts/layering` | **200** |
| `https://github.com/orgs/tai42ai/discussions` | **404** |

**BLOCKED-ON-FOUNDER — GitHub Discussions.** `https://github.com/orgs/tai42ai/discussions`
returns 404 today. Cause verified against the GitHub API
(`GET /orgs/tai42ai/repos?per_page=100`): all 6 public repos report `has_discussions: false`,
so GitHub has no source repo from which to build the org-level Discussions page.

```
tai-dynamic-postgres-mcp | Apache-2.0 | has_discussions: False
tai-studio               | Apache-2.0 | has_discussions: False
tai-docs                 | Apache-2.0 | has_discussions: False
tai-website              | Apache-2.0 | has_discussions: False
tai-distribution         | Apache-2.0 | has_discussions: False
tai42                    | Apache-2.0 | has_discussions: False
```

The URL in `src/pages/open-source.astro:23` (`GITHUB_DISCUSSIONS_URL`) is the canonical
org Discussions path and is **correct as written** — it starts resolving the moment the
founder enables Discussions on one `tai42ai` repo. The fix is on GitHub, not in this repo.

**License — PASS.** The page claims Apache-2.0; the same API response shows
`spdx_id: Apache-2.0` on **all 6** public `tai42ai` repos (table above). The claim matches
the repos.

## 3. `/about` — 7i body, no "Who built this", roster hidden · PASS

`dist/about/index.html` renders: H1 "The self-driving company, the honest way" → the 7i
opening paragraph verbatim → "How the company is built — three layers" (three cards: The
open-source runtime · BabelFish, the platform · The engagements) → "Why the layers are
separate." → "How we hold ourselves to it" → (hidden roster) → CTA "Get your readiness
report" → `/contact/`.

```
grep -rn "Who built this" src/ dist/ --include='*.astro' --include='*.html'  → 0
grep -ic "agent roster\|owner: engineering" dist/about/index.html            → 0
src/pages/about.astro:17  const SHOW_AGENT_ROSTER = false;
src/pages/about.astro:133 {SHOW_AGENT_ROSTER && (   … "The agent roster — how tai42 runs on itself"
```

The contract sentence inside the first layer card matches the footer verbatim. No bracket
text (check 1).

## 4. `/contact` + `/builders` — render, validate, submit · BLOCKED-ON-FOUNDER (form IDs)

**Everything verifiable statically is verified.**

Rendered `dist/contact/index.html`:

```html
<form action="https://formspree.io/f/PENDING_FOUNDER" method="POST" data-source-form …>
  <input type="hidden" name="_subject" value="[tai42] Readiness report request">
  <input type="hidden" name="_next"    value="https://tai42.ai/thank-you/">
  <input type="hidden" name="source"   value="">
  <!-- Formspree honeypot -->
  <input type="text" name="_gotcha" class="hidden" style="display:none" tabindex="-1"
         autocomplete="off" aria-hidden="true">
```

Rendered `dist/builders/index.html`: same shape, `_subject` = `[tai42] Founding builder`,
`_next` = `https://tai42.ai/thank-you-builders/`.

| Item | Contact | Builders |
| --- | --- | --- |
| Method / endpoint | POST → `https://formspree.io/f/…` | POST → `https://formspree.io/f/…` |
| Honeypot `_gotcha` | present, `display:none`, `aria-hidden` | present |
| Hidden `source` | present, stamped by script | present |
| `_subject` base | `[tai42] Readiness report request` | `[tai42] Founding builder` |
| `_next` redirect | `/thank-you/` | `/thank-you-builders/` |
| Fields | demo (optional) · what breaks (required) · how you'll measure success (required) · name · company · email (all required) | company · what you deliver today · roughly how many clients · email (4 × `required`) |
| Submit label | "Get your readiness report" | "Join the founding waitlist" |

`_next` is derived from `Astro.site` (`src/pages/contact.astro:17-20`), so a preview build
redirects into itself rather than into production.

**Dynamic `_subject` and `source` — `src/components/FormSourceScript.astro`, verified in
the rendered inline script of both pages.** `source` = joined UTM params, else the referring
site's **host only** (never path or query — matches what `/privacy` promises), else
`"direct"`. `_next` gets `?source=…`/`&source=…` appended with the right separator.
`_subject` gets `" — " + company` appended live on `input`, re-synced on `submit` (autofill
and session restore do not fire `input`). Every write recomputes from the input's
`defaultValue`, so a bfcache/history re-run cannot double-append.

**Analytics — PASS.** `src/components/FormSubmissionEvent.astro` fires
`plausible("qualified_form_submission", { props: { page, source } })` from the thank-you
pages only; `page` comes from the route (not a spoofable query param), `source` from the
query; a `sessionStorage` key on `page+source` de-duplicates reloads. Present on both
thank-you pages; Plausible itself is loaded sitewide
(`<script defer data-domain="tai42.ai" src="https://plausible.io/js/script.js">`).

**Thank-you pages — PASS (7d split).**
`dist/thank-you/index.html`: "Thanks — we'll read this before we meet." / "Pick a time and
we'll come to the call having read what you sent." / button "Pick a time." → the calendar URL.
`dist/thank-you-builders/index.html`: "Thanks — you're on the list." / batches sentence /
**zero links in `<main>`** — no calendar.

**No key, ID, or address rendered as visible text — PASS.**
`grep -rn 'formspree' --include='*.html' dist/` → 2 hits, both the `action` attribute value
`https://formspree.io/f/PENDING_FOUNDER` (contact + builders); no ID appears as text.
`grep -rc 'contact@tai42.ai\|builders@tai42.ai' --include='*.html' dist/` → the only hit is
`dist/terms/index.html:1` — the pre-existing legal-contact `mailto:` in Terms §8 "Contact",
which is not a form destination and is outside this change. Neither form page renders an
address in any form.

**BLOCKED-ON-FOUNDER.** Both forms post to the sentinel
`https://formspree.io/f/PENDING_FOUNDER` and will stay dead until the two real form IDs
exist. The founder creates the account under `contact@tai42.ai` and two forms delivering to
`contact@tai42.ai` and `builders@tai42.ai`; the swap is one constant per file —
`FORMSPREE_CONTACT_ID` (`src/pages/contact.astro:14`) and `FORMSPREE_BUILDERS_ID`
(`src/pages/builders.astro`). No live submission was run, because there is no live endpoint
to run one against.

### Live end-to-end test procedure (run once the IDs exist)

1. Create the Formspree account registered to `contact@tai42.ai`; create **two** forms —
   one delivering to `contact@tai42.ai`, one to `builders@tai42.ai`. Note the two form IDs.
2. Replace `FORMSPREE_CONTACT_ID` in `src/pages/contact.astro` and
   `FORMSPREE_BUILDERS_ID` in `src/pages/builders.astro` with those IDs. One constant per
   file; change nothing else.
3. `npm run build && npm run preview`. Open `/contact/`, fill the three questions plus
   name, company, email, and submit.
4. Confirm the mail arrives at `contact@tai42.ai` with subject
   `[tai42] Readiness report request — <company>` and with the `source` field present in
   the body.
5. Confirm the redirect landed on **`/thank-you/`** with a working "Pick a time." calendar
   button. If it landed on a Formspree-branded success page instead, the `_next` custom
   redirect requires a paid plan — decide and upgrade, because the analytics event and the
   calendar hand-off both live on our page.
6. Repeat for `/builders/` → mail to `builders@tai42.ai`, subject
   `[tai42] Founding builder — <company>`, redirect to `/thank-you-builders/` (which must
   show **no** calendar).
7. Check the Plausible dashboard (once the `tai42.ai` site is registered there) for
   `qualified_form_submission` with the `page` and `source` props on both submissions.
8. Verify both Google Groups (`contact@tai42.ai`, `builders@tai42.ai`) accept **external**
   senders — Formspree delivers from its own domain, and a members-only group will silently
   drop every submission.

## 5. Redirects · PASS (doc paths client-side by necessity)

**Four legacy 301 targets — verified in the build.** `astro.config.mjs` declares them and
the build emits a redirect stub for each; the target of every one exists in `dist/`:

| Requested | Stub emitted in `dist/` | Target exists |
| --- | --- | --- |
| `/pricing` | `<meta http-equiv="refresh" content="0;url=/platform/">` | `dist/platform/index.html` ✓ |
| `/product/nexus` | `…url=/platform/` | ✓ |
| `/product/babelfish` | `…url=/platform/` | ✓ |
| `/how-it-works` | `…url=/method/` | `dist/method/index.html` ✓ |

(Also present from the same config, unchanged: `/babelfish`, `/babelfish/agentic-to-flow`
→ `/platform/`, `/company/about` → `/about/`, `/company/contact` → `/contact/`.)
Local: `curl -D - http://localhost:4399/pricing` → `200 text/html` serving the stub — that
is the GitHub Pages shape: a meta-refresh stub, not a server 301. Each stub also carries
`<meta name="robots" content="noindex">` and a canonical to the target.

**Doc paths are CLIENT-SIDE, by platform constraint.** GitHub Pages cannot issue a
server-side 301, so `/getting-started/*`, `/concepts/*`, `/guides/*`, `/reference/*` are
redirected from `dist/404.html`, which Pages serves at every unknown URL. The script,
verbatim from the built `dist/404.html`:

```js
(function () {
  var docPaths = /^\/(getting-started|concepts|guides|reference)(\/|$)/;
  var path = window.location.pathname;
  if (docPaths.test(path)) {
    window.location.replace(
      "https://docs.tai42.ai" + path + window.location.search + window.location.hash
    );
  }
})();
```

Regex behaviour, executed under `node -e`:

```
/getting-started/installation -> https://docs.tai42.ai/getting-started/installation
/concepts/layering            -> https://docs.tai42.ai/concepts/layering
/guides/x                     -> https://docs.tai42.ai/guides/x
/reference/y                  -> https://docs.tai42.ai/reference/y
/getting-started              -> https://docs.tai42.ai/getting-started
/agents                       no redirect
/platform/                    no redirect
/getting-startedfoo           no redirect
```

Path, query, and hash are all preserved; the prefix is anchored, so `/getting-startedfoo`
is not swept up. Local: `curl http://localhost:4399/getting-started/installation` → `404`
serving `<title>Page not found — tai42</title>` with the redirect script present (2 hits for
`docPaths`) — exactly what Pages will serve.

**Both targets resolve live** (curl above): `https://docs.tai42.ai/getting-started/installation`
→ 200 and `https://docs.tai42.ai/concepts/layering` → 200.

**Stated plainly:** the tai42.ai side of this check — that a visitor hitting
`https://tai42.ai/getting-started/installation` lands on the docs — can only be confirmed
**after the founder deploys**, because the redirect runs from the 404 page GitHub Pages
serves. Nothing further is verifiable from this branch.

## 6. `/llms.txt` · PASS

Local: `curl -D - http://localhost:4399/llms.txt` → `HTTP/1.1 200 OK`,
`Content-Type: text/plain`, `Content-Length: 546`.
Docs line filled: `- Docs: https://docs.tai42.ai`. No agents line:
`grep -c "agents" public/llms.txt` → `0` (the only "…ers" entry is
`- Builders (founding waitlist): https://tai42.ai/builders`). Live 200 is post-deploy.

## 7. `/agents` 404 · PASS

404 by absence, which is the strongest form of it:

```
ls dist/agents                                   → No such file or directory
grep -rn '/agents' --include='*.html' dist/      → 0   (zero links anywhere, nav and footer included)
grep -c "agents" public/llms.txt                 → 0
src/pages/_agents.astro                          (renamed from src/pages/agents.astro — underscore prefix = not routed)
```

Local: `curl -o /dev/null -w "%{http_code}" http://localhost:4399/agents` → **404**.
Live 404 confirmable post-deploy.

## 8. `/blog` · N/A

No blog has ever existed in this repository. `grep -rin "blog" src/ public/` → 0;
`grep -rin "blog" --include='*.html' dist/` → 0;
`git log --all --diff-filter=A -- 'src/pages/blog*'` → 0 commits.
Local: `/blog` → 404. There is nothing to preserve and nothing to unlink.

## 9. `/security` · PASS

Rendered body (`dist/security/index.html`): H1 "Security by architecture", intro, then four
sentence-case blocks — "Open and auditable" · "Your infrastructure, or your tenant" ·
"Deterministic where it matters" · "No outbound calls from the self-hosted runtime" — the
last one two paragraphs. Text matches the approved copy.

```
grep -n "VERIFY" src/pages/security.astro
102:  <!-- VERIFY: engineering -->
107:  <!-- VERIFY: engineering -->
```

Both comments sit immediately above the two unverified sentences ("The open-source runtime
you self-host makes no outbound calls back to us and has no required cloud dependency." and
"Nothing about your workloads is reported to tai42."). Being HTML comments they also ship in
the page source (`grep -c VERIFY dist/security/index.html` → 2); they are invisible to
visitors and are removed once engineering signs off.

## 10. `/platform` — 7j · PASS

`dist/platform/index.html` renders in order: H1 "BabelFish — one engine for business
functions in production." → sub → "What it runs" → "What you get" with the six cards in
the specified order (1 Deterministic where it matters, generative where it's wanted ·
2 Private tenant — or your own infrastructure · 3 Always on our open-source runtime
(→ /open-source · → Docs) · 4 The visual builder · 5 Audit and observability, by
construction · 6 Live in weeks, not quarters (→ /method)) → "Getting started" → the honest
line → actions "Get your readiness report" → `/contact/` and "Talk to us about a tenant" →
`/contact/`. Copy verbatim.

**Three hidden slots — present, rendering nothing:**

```
src/pages/platform.astro:89   <ScreenshotSlot src="/images/platform/example-flow.png"          (card 1)
src/pages/platform.astro:139  <ScreenshotSlot src="/images/platform/visual-builder.png"        (card 4)
src/pages/platform.astro:158  <ScreenshotSlot src="/images/platform/audit-observability.png"   (card 5)
```

`src/components/ScreenshotSlot.astro` gates on `show = false` by default and emits
**nothing** — no `<img>`, no empty frame, no placeholder text. `public/images/` does not
exist yet. The only two `<img>` tags on the built page are the nav and footer logos
(`/logos/tai42-logo.png`).

**Removed items — zero hits on the built page:** `grep -io "technical overview"` → 0,
`grep -io "mock"` → 0, `Nexus` → 0 (see check 13), `€` → 0. The Observe→Identify→Compile
block is gone as a separate section; its content lives in card 1 ("the optimizer watches
live behavior and compiles repeated model work into deterministic flows").

## 11. `/method` capitalization · PASS

Absorbed into the 7h rebuild, whose copy embeds the capitalized forms and is what renders:
"**Your** people at the decisions you name; ours on call for the hard cases…" and
"**You** already have a demo. You've written down what it should achieve…" (both read from
`dist/method/index.html`).

## 12. `/privacy` + `/terms` zero-hit · PASS

Case-insensitive `grep -io` per term, per page:

| Term | privacy | terms |
| --- | --- | --- |
| Nexus | 0 | 0 |
| gateway | 0 | 0 |
| Request access | 0 | 0 |
| No credit card | 0 | 0 |
| SOC 2 | 0 | 0 |
| certified | 0 | 0 |

## 13. Sitewide zero-hit · PASS

`grep -rio --include='*.html' -- "<term>" dist/` and `grep -rio -- "<term>" src/ public/`:

| Term | dist | src+public |
| --- | --- | --- |
| Nexus | 1 † | 0 |
| Text-to-Flow | 0 | 0 |
| Text to Flow | 0 | 0 |
| Request access | 0 | 0 |
| No credit card | 0 | 0 |
| AGENTIC GATEWAY | 0 | 0 |
| autopilot | 0 | 0 |
| disrupt | 0 | 0 |
| SOC 2 | 0 | 0 |
| SOC2 | 0 | 0 |
| certified | 0 | 0 |
| € | 0 | 0 |
| 3,500 | 0 | 0 |
| base_url | 0 | 0 |
| frontier prices | 0 | 0 |

† The single hit is **case-insensitive only** — `grep -ro 'Nexus' dist/ --include='*.html'`
(case-sensitive) → **0**. It is the legacy URL path in the redirect stub
`dist/product/nexus/index.html` (`<meta http-equiv="refresh" content="0;url=/platform/">`),
i.e. the old URL being retired, not the retired brand name in copy. No visible text
anywhere says "Nexus".

## 14. No new dependencies, colors, fonts · PASS (3 components added, listed)

```
git diff --stat e821a2a..HEAD -- package.json package-lock.json astro.config.mjs   → (empty)
```

No dependency, no config change — `astro.config.mjs` including its redirect map is
untouched from base. `git diff e821a2a..HEAD -- src/ | grep '^+' | grep -oE
'#[0-9a-fA-F]{3,8}|rgb\(…\)|font-family:…'` → **0 hits**: no new color literal and no new
font declaration was introduced. The only arbitrary-value Tailwind class added anywhere is
`text-[10px]` (`src/components/StepLine.astro:69`, the "you can leave here" pill) — a size,
not a color; every color used is an existing token (`crimson`, `burgundy`, `charcoal`,
`gray-*`).

**Three components added**, all composed from existing tokens and idioms:
`src/components/StepLine.astro`, `src/components/ScreenshotSlot.astro`,
`src/components/FormSubmissionEvent.astro` (renders no markup — inline script only).
Other new files: `src/pages/404.astro`, `src/pages/thank-you-builders.astro`,
`CHANGELOG-website-hotfix.md`; `src/pages/agents.astro` → `src/pages/_agents.astro` (rename,
unroutes the page).

## 15. Homepage hero + head · PASS

From `dist/index.html`:

```
<title>AI, from demo to production. — tai42</title>
<meta property="og:title"      content="AI, from demo to production. — tai42">
<meta name="twitter:title"     content="AI, from demo to production. — tai42">
<meta name="description"       content="tai42 takes AI into production — turning your working demo into a production application: deterministic where money moves, AI where judgment is needed, humans at the decisions you name.">
<meta property="og:description"  content="…" (identical)
<meta name="twitter:description" content="…" (identical)
```

H1 renders "AI, from demo to production."; the sub-line renders the 7b text verbatim,
ending "…against acceptance criteria you sign."
Old H1 zero hits: `"Your AI demo works"` → 0 in `dist/` and 0 in `src/`+`public/`;
`"Production is where it dies"` → 0 / 0.

### 15x — "Three things, one company" · PASS

The card renders inside "How it works", **after** the four-step line and **before** "What we
build" (heading order below), carrying the 7i copy verbatim and the "→ About" link
(`/about/`). `/about` matches 7i — see check 3.

### 15y — Nav order + `/method` per 7h · PASS

Desktop nav, mobile menu, and footer Site list all render the same order:

```
Home /  ·  How it works /method/  ·  Platform /platform/  ·  Open Source /open-source/
·  Docs https://docs.tai42.ai  ·  About /about/  ·  Contact /contact/  ·  [CTA] /contact/
```

"Method" as a label or title: `grep -rno --include='*.html' '>Method<\|Method — tai42\|Method</title>' dist/` → **0**.
`dist/method/index.html` `<title>` = "How it works — tai42"; H1 = "How it works".
Six sections render in order: the five steps (The production readiness review (free, entry).
· Stage 0 — the readiness gate. · The build. · Acceptance (your verification). · Run (the
license).) → What's in the readiness report → Where humans stay → What we ask of you →
What you keep → Who we work with (the honest filter). Exactly **two** "you can leave here"
stop-point labels render. "production readiness review" appears on `/method` (2 hits) and in
Home step 1 ("Production readiness review (free)."). Route stayed `/method`; `/how-it-works`
remains a redirect (check 5).

### 15z — Evidence placement · PASS

`/about` carries the 7g evidence through the 7i opening paragraph, each source named:
Carnegie Mellon's benchmark ("the best agents completed under a third"), MIT ("most
enterprise pilots never touched the P&L"), Anthropic's Project Vend. On Home:
`grep -io "Carnegie\|MIT \|Project Vend\|benchmark\|study\|%" dist/index.html` → **0 hits** —
no third-party statistic and no named study.

### 15a — Home structure · PASS

Rendered heading order in `<main>` of `dist/index.html`:

```
AI, from demo to production.  →  How it works  →  [step line: 1 Production readiness review
(free). · 2 Build. · 3 Acceptance. · 4 Run.]  →  Three things, one company.  →  What we build
→  Why it works  →  [Gates, not promises. · Speed with receipts. · The AI can't touch your
money.]  →  Two other doors.  →  CTA
```

Zero hits (dist / src+public): "The problem" 0/0 · "Why it holds" 0/0 · "under a third of
real workplace tasks" 0/0 · "travel-tech marketplace" 0/0 · "Two further engagements" 0/0.
Hero = H1 · sub · CTA only, no proof strip. The doors block ("Two other doors." → "For
builders → join the founding waitlist" → `/builders/`) sits **below** "Why it works", not in
the hero, and shows the builders door alone (no agents door — `/agents` is not live).
Every link in Home's `<main>`: `/about/`, `/builders/`, `/contact/`, `/method/` — the step
line resolves to `/method/`.

### 15b — Primary CTA · PASS

Every "Get your readiness report" anchor in the built site — **33 instances across 14 pages**
(header + mobile menu on each page, plus hero/bottom CTAs) — has `href="/contact/"`. Zero
exceptions; no instance points at the calendar. The `/contact` submit button reads
"Get your readiness report" (`<button type="submit">`, so it is not in the anchor list).

Calendar URL: `grep -rc 'appointments/schedules' --include='*.html' dist/` → exactly **one**
file, `dist/thank-you/index.html`, one occurrence, rendered as the button "Pick a time."
`src/consts.ts` has the single definition and `src/pages/thank-you.astro` is its only
consumer.

Zero hits: "production audit" 0/0 · "Book a production audit" 0/0.

**Remaining "audit*" hits — all product-property, 5 total, listed:**

| Page | Text |
| --- | --- |
| `/about` | "Permissions, **audit**, and delegated access are part of the open core" |
| `/builders` | "deterministic flows where money moves, verified payments, full **audit**, humans at the named decisions" |
| `/open-source` | "Permissions, **audit**, and delegated access are part of the open core" |
| `/platform` | "**Audit** and observability, by construction." (card 5 title) |
| `/security` | "Open and **auditable**" (block heading) |

## 16. Docs in navigation · PASS

Position: immediately after "Open Source" and before "About", in the desktop nav, the mobile
menu, and the footer Site list (order table under 15y). Target: `https://docs.tai42.ai`
(DOCS_HOST), **live 200** (curl, check 2). Same tab — no `target` attribute on any of the
three anchors. Same styling — the desktop Docs anchor carries a class string identical to
Platform's and Open Source's:

```html
<a href="https://docs.tai42.ai" class="px-3 py-2 text-sm font-medium text-charcoal/70 hover:text-crimson rounded-lg transition-colors">
```

---

## Still open

Mirrors the consolidated pending list in `CHANGELOG-website-hotfix.md` — 10 items, all
founder- or engineering-side.

1. **The two Formspree form IDs.** `FORMSPREE_CONTACT_ID` (`src/pages/contact.astro`) and
   `FORMSPREE_BUILDERS_ID` (`src/pages/builders.astro`) hold the sentinel `PENDING_FOUNDER`.
   Forms are wired but dead until swapped.
2. **Formspree paid-plan check for the `_next` custom redirect** — on the free tier a
   submission may land on Formspree's branded success page instead of our thank-you pages,
   which is where the analytics event and the calendar hand-off live.
3. **Three `/platform` screenshot files plus their flag flips** — drop `example-flow.png`,
   `visual-builder.png`, `audit-observability.png` into `/public/images/platform/`, **then**
   set `show` on each `ScreenshotSlot` (file first: the flag, not the file, gates the markup).
4. **`/open-source` boundary table** — founder confirms the open/commercial split, then
   `SHOW_BOUNDARY_TABLE = true`.
5. **`/about` agent roster content** — founder supplies entries (agent + owner role, never a
   person's name), then `SHOW_AGENT_ROSTER = true`.
6. **`/security` engineering sign-off on the two sentences** marked
   `<!-- VERIFY: engineering -->`; remove both comments once signed.
7. **`/platform` contract instance (7j)** — founder confirms whether Change Order v1.5 §4.4
   still requires the one-sentence contract in the `/platform` body; today it reaches the
   page through the footer only.
8. **"Read the technical overview" returns to `/platform` card 1** once engineering signs the
   overview off.
9. **Enable GitHub Discussions on a `tai42ai` repo** — the org Discussions URL 404s until
   then (check 2); the URL in the repo is correct and needs no change.
10. **The live end-to-end form test** — blocked on item 1; procedure under check 4.

## Deliverables

- Branch **`website-hotfix-1`** — 28 commits on base `e821a2a`, HEAD `f485690`.
- **`CHANGELOG-website-hotfix.md`** — per-step record, resolved values, and the single
  consolidated pending list.
- **`HOTFIX-REPORT.md`** — this report.
- Cold review: **3 cycles, 4 fix waves, final pass clean.**
- **NOT deployed.** Nothing pushed. The founder publishes.
