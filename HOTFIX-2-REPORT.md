# HOTFIX-2-REPORT — website-hotfix-2

Branch `website-hotfix-2` · 3 commits on base `d266de4` (live `main`), HEAD `88b6c5c` at the
time of verification — this report is the fourth commit.
Verified 2026-08-20, on this branch, working tree clean.

Every check below was re-run from scratch for this report: `rm -rf dist && npm run build`,
then greps over `src/`, `public/`, and the rendered `dist/`, plus **cache-busted live
`curl`** (unique `?cb=<timestamp>` + `Cache-Control: no-cache`, so neither the browser nor
the Pages CDN can answer from cache) wherever the claim is about the live site.

**Build gate.** `npx astro check` → `0 errors, 0 warnings, 0 hints`.
`rm -rf dist && npm run build` → exit 0, `[build] 14 page(s) built in 710ms`,
`[build] Complete!`, no warnings.

> **The two fixes in this branch are NOT live.** Live `main` is `d266de4`; this branch adds
> three commits on top and **nothing has been pushed or deployed**. Confirmed against the
> live site on 2026-08-20: `https://tai42.ai/` still serves
> `<p class="text-lg text-charcoal/70 leading-relaxed mb-6">` before "Two other doors.", and
> `https://tai42.ai/method/` still serves the marker `<li class="reveal flex flex-col
> lg:shrink-0 lg:px-3" … role="presentation">` without the mobile spacing fix. Everything
> else in this report describes the site as it is serving **today**.

Verdicts: **PASS** · **BLOCKED-ON-FOUNDER** (correct as written, cannot complete without a
founder-side action) · **NOT-A-DEFECT** (reported, verified absent).

---

## Summary

| § | Check | Verdict |
| --- | --- | --- |
| a | Diagnosis table — "live site is half old" | **NOT-A-DEFECT** — every page live-verified new |
| b | Bracket placeholders `\[[A-Z_]+[^\]]*\]` in `src/`, `public/`, `dist/` | PASS — 0 |
| c | Forms end-to-end incl. Google Groups | **BLOCKED-ON-FOUNDER** (2 Formspree IDs) |
| d | Redirects — 4 legacy stubs + doc paths | PASS (doc paths client-side by necessity) |
| e | Shared header/footer | PASS — one `NAV_LINKS`, one `Footer` |
| f | `/agents` 404 | PASS — live 404 |
| g | Sitewide zero-hit sweep | PASS |
| h | Design bugs 4a / 4b / 4c / doors heading | 4a, 4b **NOT-A-DEFECT**; 4c + doors **fixed here** |

---

## a. The diagnosis table, row by row, against the live site

All four pages fetched 2026-08-20 with `?cb=<timestamp>` and `Cache-Control: no-cache`.

| Reported | Live evidence (cache-busted) | Verdict |
| --- | --- | --- |
| `/platform` still shows the old page / a mock screenshot | **200**, `<h1>` = "BabelFish — one engine for business functions in production." — the new-generation H1. `mock` → **0** hits. | NOT-A-DEFECT |
| `/about` still shows bracket placeholders | **200**, `<h1>` = "The self-driving company, the honest way". `\[[A-Z_]+[^\]]*\]` → **0** hits. | NOT-A-DEFECT |
| `/builders` still on Web3Forms | **200**, `<h1>` = "Your clients. Our engine." `WEB3FORMS` → **0** hits. (The 4 `placeholder` substrings are the Tailwind `placeholder:text-charcoal/30` utility on the form inputs — a class name, not content.) | NOT-A-DEFECT |
| `/security` still the old page | **200**, `<h1>` = "Security by architecture" — the new page. | NOT-A-DEFECT |
| Some pages new, some old — "half deployed" | Impossible by construction: GitHub Pages publishes **one atomic artifact** per run; the whole of `dist/` replaces the whole site. The `deploy-pages` run for `d266de4` **completed `success` on 2026-08-19 21:18:34Z** and is the newest run on the repo. | NOT-A-DEFECT |
| The old pages seen in the browser | Match the **pre-deploy** cached copies. **Remedy: hard refresh** (Ctrl/Cmd-Shift-R) or a private window. **No redeploy** — republishing `d266de4` would emit a byte-identical artifact. | NOT-A-DEFECT |
| `/concepts/layering` returns 404 — "redirect broken" | **By design.** GitHub Pages cannot emit a server-side 301 for a path with no file. `dist/404.html` (served for every unknown route) carries the path-preserving client-side redirect; see § d. Live: the destination `https://docs.tai42.ai/concepts/layering` → **200**. | NOT-A-DEFECT |
| The nav/footer are stale on some pages | One shared component each; see § e. The seven nav href/label pairs are **byte-identical across all four live pages** (identical hash of the extracted link list). | NOT-A-DEFECT |
| Design bugs 4a, 4b | Verified **absent from the build**; see § h. | NOT-A-DEFECT |
| Design bug 4c (mobile stop-point marker) | **Real — fixed in this branch** (`88b6c5c`), not yet live. | FIXED |
| "Two other doors." marked up as body copy | **Real — fixed in this branch** (`7961ea7`), not yet live. | FIXED |
| Forms not delivering / Google Groups test | **BLOCKED** on the two Formspree IDs; see § c. | BLOCKED-ON-FOUNDER |

## b. Bracket placeholders · PASS

```
$ grep -rEo '\[[A-Z_]+[^]]*\]' src/ public/ dist/ | wc -l
0
```

Zero across source, static assets, and the rendered build — including the unrouted
`src/pages/_agents.astro`. Also zero on all four live pages (§ a).

## c. Forms · BLOCKED-ON-FOUNDER (the two Formspree IDs)

The backend chain, re-checked this pass and unchanged:

1. The site is hosted on **GitHub Pages** → **no host-native form handling** exists.
2. There is **no working Web3Forms key** in the repo — Web3Forms is gone from `src/`
   entirely (0 hits — evidence in § a's live-page sweep; re-verified:
   `grep -rio web3forms src/ public/ dist/` → 0).
3. Therefore **FORM_BACKEND = Formspree**, and the Formspree account under
   **`contact@tai42.ai` must be created by the founder**.

Both forms are wired and hold one clearly-named constant each:

| File | Line | Constant | Value |
| --- | --- | --- | --- |
| `src/pages/contact.astro` | 14 | `FORMSPREE_CONTACT_ID` | `"PENDING_FOUNDER"` |
| `src/pages/builders.astro` | 13 | `FORMSPREE_BUILDERS_ID` | `"PENDING_FOUNDER"` |

Each composes `https://formspree.io/f/${…_ID}`, so **swap-in is one constant per file**.
The sentinel carries no square brackets and **is never rendered as visible text** — no
address, no key, and no form ID appears in the rendered pages; it exists only inside the
`action` URL. Until the IDs land, both forms post to a non-existent endpoint: **wired but
dead.**

**The live end-to-end test — including the Google Groups check — therefore stays blocked.**
Procedure (unchanged, do not re-derive): `HOTFIX-REPORT.md` check 4, steps 1–8, and
`CHANGELOG-website-hotfix.md` step 20. Step 8 is the Google Groups one: both
`contact@tai42.ai` and `builders@tai42.ai` must accept **external** senders, because
Formspree delivers from its own domain and a members-only group drops every submission
silently.

## d. Redirects · PASS (doc paths client-side by necessity)

**Four legacy stubs — one hop, verified in the build and live.** `astro.config.mjs:7–16`
declares them; the build emits a stub for each; the target of each is a real 200 page.

| Requested | Stub in `dist/` | Live (cache-busted) | Target live |
| --- | --- | --- | --- |
| `/pricing/` | `<meta http-equiv="refresh" content="0;url=/platform/">` + `<link rel="canonical" href="https://tai42.ai/platform/">` | **200** | `/platform/` **200** |
| `/product/nexus/` | `…url=/platform/` + canonical `/platform/` | **200** | `/platform/` **200** |
| `/product/babelfish/` | `…url=/platform/` + canonical `/platform/` | **200** | `/platform/` **200** |
| `/how-it-works/` | `…url=/method/` + canonical `/method/` | **200** | `/method/` **200** |

One hop each: every stub points straight at a final page, never at another stub. The
config declares **eight** stubs in total; the other four — `/babelfish/`,
`/babelfish/agentic-to-flow/` → `/platform/`, `/company/about/` → `/about/`,
`/company/contact/` → `/contact/` — were verified the same way: one-hop stubs in the
build, live **200**, targets live **200**.

**Doc paths — client-side mechanism, and it is the only one available.** GitHub Pages has
no redirect rule file and no wildcard support, so a path with no file *must* answer 404.
`src/pages/404.astro:22–31` puts the redirect in the 404 body that Pages serves for every
unknown route:

```js
var docPaths = /^\/(getting-started|concepts|guides|reference)(\/|$)/;
var path = window.location.pathname;
if (docPaths.test(path)) {
  window.location.replace("https://docs.tai42.ai" + path + window.location.search + window.location.hash);
}
```

`dist/404.html` carries that regex verbatim (grep for
`getting-started|concepts|guides|reference` → present). Path, query and hash are all
preserved. Live destination check, 2026-08-20:

| URL | Status |
| --- | --- |
| `https://docs.tai42.ai/getting-started/installation` | **200** |
| `https://docs.tai42.ai/concepts/layering` | **200** |
| `https://tai42.ai/concepts/layering` | **404** on the wire — expected; the body redirects in a browser |

**True 301s require a hosting move** (Cloudflare Pages/Workers, Netlify, Vercel, or any
origin with a rule file). Founder decision, not a code change.

## e. Shared header and footer · PASS

One nav component with **one** link array feeding both viewports —
`src/components/NavBar.astro`:

```
19  const NAV_LINKS = [
20    { href: "/", label: "Home" },
21    { href: "/method/", label: "How it works" },
22    { href: "/platform/", label: "Platform" },
23    { href: "/open-source/", label: "Open Source" },
24    { href: "https://docs.tai42.ai", label: "Docs" },
25    { href: "/about/", label: "About" },
26    { href: "/contact/", label: "Contact" },
27  ];
…
40        {NAV_LINKS.map((link) => (        ← desktop row
…
72      {NAV_LINKS.map((link) => (          ← mobile panel
```

`:40` is the `hidden lg:flex` desktop row and `:72` the `#mobile-menu` panel: the same
array, twice, so the two can never diverge. `NavBar` is imported by **15** files under
`src/pages/` and `Footer` by the same **15** (the 14 built pages plus the unrouted
`_agents.astro`) — e.g. `src/pages/index.astro:4`,
`import Footer from "../components/Footer.astro";`. **No page holds its own copy of a link
list**, so no page can carry a stale nav or footer.

Live confirmation: the extracted `(href, label)` list from `<nav>` on `/platform/`,
`/about/`, `/builders/` and `/security/` is 7 entries on each and hashes identically
(`c095dfbe07eb`) on all four.

## f. `/agents` · PASS

`https://tai42.ai/agents/` → **404** live (cache-busted, 2026-08-20). No `dist/agents/`
directory is emitted — the page source is parked at `src/pages/_agents.astro`, and Astro
does not route a leading-underscore file. `href="/agents"` → **0** hits in `src/` and in
`dist/`.

## g. Sitewide zero-hit sweep · PASS

`grep -rio --include='*.html' -- "<term>" dist/` and `grep -rio -- "<term>" src/ public/`:

| Term | dist | src+public |
| --- | --- | --- |
| production audit | 0 | 0 |
| travel-tech marketplace | 0 | 0 |
| travel-tech | 0 | 0 |
| SOC 2 | 0 | 0 |
| certified | 0 | 0 |
| autopilot | 0 | 0 |
| disrupt | 0 | 0 |
| € | 0 | 0 |
| Nexus | 1 † | 0 |
| base_url | 0 | 0 |
| Request access | 0 | 0 |
| No credit card | 0 | 0 |
| `\[[A-Z_]+[^\]]*\]` (bracket regex) | 0 | 0 |

† Case-insensitive only. `grep -ro 'Nexus' dist/ --include='*.html'` (case-**sensitive**)
→ **0**. The hit is the legacy URL path in the redirect stub `dist/product/nexus/` — the
old URL being retired, not the retired brand name in copy. No visible text anywhere says
"Nexus".

## h. Design bugs

**4a — duplicate list numbers · NOT-A-DEFECT.** Tailwind preflight ships
`ol,ul,menu{list-style:none}` and that exact rule is present in the built stylesheet
(`dist/_astro/*.css`; it is also the file's only `list-style` declaration). The `<ol>` in
`StepLine.astro` therefore renders **no** marker of its own — the only numbers on screen
are the crimson circle nodes the component draws. There is no second number to duplicate.

**4b — oversized step titles · NOT-A-DEFECT.** The step titles render
`class="text-base font-bold text-black mb-2"` (16px); a section heading on the same page is
`text-3xl sm:text-4xl font-bold` (30/36px). The step titles are the smallest headings in
the band by design — their tag (`h3`, or `h2` on `/method` via `headingLevel`) is chosen
for heading order, not for size. Nothing was changed; changing it would have been the
regression.

**4c — the mobile stop-point marker · FIXED in this branch** (`88b6c5c`). On mobile the
`role="presentation"` marker took a full slot in the stacked flow (32px gap above and
below, plus the 36px desktop node-height spacer and its 16px margin), reading as an extra
step. Now `-my-6 lg:my-0` on the marker `<li>` and `lg:h-9 lg:mb-4` (instead of `h-9 mb-4`)
on its inner row cut the mobile spacing around it to **8px** against **32px** between step
cards. Verified in `dist/method/index.html` (both markers):
`<li class="reveal flex flex-col -my-6 lg:my-0 lg:shrink-0 lg:px-3" … role="presentation">`
wrapping `<div class="flex items-center justify-center lg:h-9 lg:mb-4">`, with
`.-my-6`, `.lg\:my-0`, `.lg\:h-9`, `.lg\:mb-4` all emitted in the stylesheet. Desktop box
model, `role="presentation"`, the dashed crimson pill and the component API are unchanged.

**"Two other doors." heading · FIXED in this branch** (`7961ea7`). Was
`<p class="text-lg text-charcoal/70 leading-relaxed mb-6">`, i.e. body copy heading a band
with no heading. Now `<h2 class="text-3xl sm:text-4xl font-bold text-black mb-6">` —
classes copied from the neighbouring home sections. Verified in `dist/index.html`: four
`h2`s now render — "How it works", "What we build", "Why it works", **"Two other doors."**
— the last with `text-3xl sm:text-4xl font-bold text-black mb-6`. The sentence itself is
byte-identical. Founder heads-up (carried forward from the hotfix review): the block still
shows a single door — "For builders →" alone, no agents door while `/agents` is gated —
and this change gives that lone door a full-scale section heading; if that reads too
heavy before the agents door goes live, it is a one-line style call during the voice pass.

**No copy changed anywhere in this branch.** The whole diff is: one tag + class list on
`index.astro`, two class lists + one doc-comment sentence on `StepLine.astro`, and two new
markdown files.

---

## Still open — founder / engineering

1. **The two Formspree form IDs** — `FORMSPREE_CONTACT_ID` (`src/pages/contact.astro:14`)
   and `FORMSPREE_BUILDERS_ID` (`src/pages/builders.astro:13`), both `PENDING_FOUNDER`.
   Both forms are dead until these land, and the **live end-to-end + Google Groups test**
   is blocked behind them.
2. **Enable GitHub Discussions** on a `tai42ai` repo — the org Discussions URL linked from
   `/open-source` 404s until then; the URL in the repo is correct and needs no change.
3. **The three `/platform` screenshots** — drop `example-flow.png`, `visual-builder.png`,
   `audit-observability.png` into `/public/images/platform/`, **then** flip `show` on each
   `ScreenshotSlot` (file first: the flag, not the file, gates the markup).
4. **`/open-source` boundary table** — founder confirms the open/commercial split, then
   `SHOW_BOUNDARY_TABLE = true`.
5. **`/about` agent roster** — founder supplies the entries (agent + owner role, never a
   person's name), then `SHOW_AGENT_ROSTER = true`.
6. **`/security` engineering sign-off** on the two sentences marked
   `<!-- VERIFY: engineering -->`; remove both comments once signed.
7. **Formspree `_next` custom-redirect plan check** — when creating the account, verify
   whether the custom redirect to the site's thank-you pages requires a paid plan; if
   gated, submissions land on Formspree's branded page and both the calendar hand-off and
   the analytics event are lost (see `CHANGELOG-website-hotfix.md`, Activation step 5).
8. **`/platform` contract instance** — founder confirms whether Change Order v1.5 §4.4
   still requires the one-sentence contract in the `/platform` body (the 7j rebuild
   removed it; the footer instance still renders on the page).
9. **"Read the technical overview"** — returns to `/platform` card 1 once engineering
   signs off on the white paper (currently absent everywhere, as gated).

This list mirrors `CHANGELOG-website-hotfix.md`'s canonical pending list in full (its
former item 10, the live end-to-end test, is folded into item 1 above).

Plus, from § a: **a hard refresh** is the whole remedy for the "half old" report, and **a
true 301 for the doc paths needs a hosting move** — neither is a code change.

## Deliverables

- Branch **`website-hotfix-2`** — 3 change commits on base `d266de4` (`88b6c5c`), plus this
  report.
- **`CHANGELOG-website-hotfix-2.md`** — cause analysis first, then the two fixes.
- **`HOTFIX-2-REPORT.md`** — this report.
- **NOT deployed.** Nothing pushed. The founder publishes.
