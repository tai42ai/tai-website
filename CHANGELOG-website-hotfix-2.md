# CHANGELOG — website hotfix 2

Branch: `website-hotfix-2`, based on live `main` (`d266de4`). The file records
two rounds of work, in the order they happened.

**Steps 1–3 — the deploy-completion pass.** The cause analysis comes first,
because most of what that prompt listed was **not a defect in the repo or in the
deployed artifact**: the live site was already entirely the new generation, and
the fix was a hard refresh, not a redeploy. Two items were real and were fixed —
the homepage's "Two other doors." line became the section heading it reads as,
and the StepLine stop-point marker stopped reading as a connector on mobile.

**Steps 4–14 — the 20-Aug decision set.** A larger set of founder decisions that
does change site copy, page by page: both forms torn out and replaced by
`mailto:` (there is no form backend any more); `/contact` and `/builders`
rebuilt around three questions and one button each; the primary CTA renamed to
"Get your production readiness report"; `/method` redesigned into an overview
strip, one gate line and five detail blocks; internal working labels stopped
rendering; `/about` given a new h1 and a rewritten layers paragraph; sitewide
sweeps for the Tai42/tai42 casing rule and for alignment, band rhythm and em
dashes; and `/terms` and `/privacy` rewritten — the provider is the brand, and
the policy describes a site that only has an inbox.

No new dependencies, colors, fonts, or components, and no new pages; the two
thank-you pages went out with the forms in step 4.

**Gates.** `npx astro check` is clean and `npm run build` builds 12 pages
(`_agents.astro` is unrouted), at each wave gate — steps 4–7, 8–10, 11–14 — and
after the cold-review fix wave at the end of this file. Each gate's command
output and its sitewide regex sweeps are the tables under those headings.
`HOTFIX-2-REPORT.md` carries the verification evidence for the
deploy-completion pass, steps 1–3: the cache-busted live checks, the
diagnosis table row by row, and the zero-hit sweeps as of 2026-08-20. It was
written before the 20-Aug decision set and describes the site as it was then.

Not deployed from here. Never pushed by the implementer.

---

## Step 1 — Cause analysis — "the live site is half old"

**It is not.** The repo and the deployed artifact are both, entirely, the new
generation. The observation matches the *pre-deploy* pages held in a browser or
CDN cache, not what tai42.ai serves today.

### 1. There is only one artifact, and it is the new one

`main` is `d266de4`. GitHub Pages deploys a **single atomic artifact** per run —
the whole of `dist/` replaces the whole of the site; there is no per-file merge
and therefore no mechanism by which some pages could stay on an older build
while others move forward.

The `deploy-pages` workflow run for `d266de4` **completed successfully on
2026-08-19** (`21:18:34Z`, conclusion `success`), and it is the most recent run
on the repository. The run before it was `e821a2a` on 2026-08-18. Nothing has
been deployed since, and nothing failed.

### 2. Cache-busted live checks — every page is new (2026-08-20)

Fetched with a unique `?cb=<timestamp>` query and `Cache-Control: no-cache`,
so neither the browser nor the Pages CDN could answer from cache:

| URL | HTTP | Live `<h1>` | Old-generation markers |
| --- | --- | --- | --- |
| `https://tai42.ai/platform/` | 200 | "BabelFish — one engine for business functions in production." | 0 (`mock` = 0) |
| `https://tai42.ai/about/` | 200 | "The self-driving company, the honest way" | 0 (bracket placeholders = 0) |
| `https://tai42.ai/builders/` | 200 | "Your clients. Our engine." | 0 (`WEB3FORMS` = 0) |
| `https://tai42.ai/security/` | 200 | "Security by architecture" | 0 |

Each of those H1s exists **only** in the new generation. The bracket-placeholder
regex `\[[A-Z_]+[^\]]*\]` returns **zero** hits across all four live pages and on the separately fetched live `/contact/` (200, zero brackets, action=formspree sentinel) —
including the four `[WEB3FORMS_ACCESS_KEY]` chips that the previous generation
rendered on `/contact` and `/builders`. (The only `placeholder` substring on the
live `/builders` is the Tailwind `placeholder:text-charcoal/30` utility class on
the form inputs — a CSS class name, not content.)

**Remedy: a hard refresh.** Ctrl/Cmd-Shift-R, or a private window. **No redeploy
is needed, and none should be run** to "fix" this — a redeploy of the same
commit would produce a byte-identical artifact and would change nothing.

### 3. `/concepts/layering` and friends return 404 to `curl` — by design

`curl -I https://tai42.ai/concepts/layering` returns **HTTP 404**, and that is
the intended, documented behaviour, not a broken redirect:

* GitHub Pages **cannot perform server-side redirects** — there is no rule file,
  no wildcard support, and no way to emit a 301 for a path that has no file.
* So the doc paths are redirected **client-side**: Pages serves `dist/404.html`
  for every unknown route, and that file carries a path-preserving inline
  redirect — `/^\/(getting-started|concepts|guides|reference)(\/|$)/` →
  `https://docs.tai42.ai` + the same path + search + hash
  (`src/pages/404.astro:22–31`; the regex is present verbatim in
  `dist/404.html`).
* The HTTP status on the wire is therefore 404 with a redirecting body. **In a
  browser it works** — verified live on 2026-08-20:
  `https://docs.tai42.ai/getting-started/installation` → **200** and
  `https://docs.tai42.ai/concepts/layering` → **200**, so the destination of
  every redirected path resolves.
* **True 301s require a hosting move** (Cloudflare Pages/Workers, Netlify,
  Vercel, or any origin with a redirect rule file). That is a hosting decision
  for the founder, not a code change — nothing in this repo can produce a 301 on
  GitHub Pages.

### 4. Reported design bugs 4a and 4b are not present in the build

* **4a — duplicate list numbers on the step lines.** Not present. Tailwind's
  preflight sets `ol,ul,menu{list-style:none}` and that rule is in the shipped
  stylesheet (`dist/_astro/*.css`, matched literally), so the `<ol>` in
  `StepLine.astro` renders **no** marker of its own. The only numbers on screen
  are the crimson circle nodes the component draws itself. There is no second
  number to duplicate.
* **4b — oversized step titles.** Not present. The step titles in
  `StepLine.astro` are `text-base font-bold` (16px); a section heading on the
  same pages is `text-3xl sm:text-4xl font-bold`. The step titles are the
  *smallest* headings in the band, by design — they are `h3` (or `h2` on
  `/method`, via `headingLevel`) chosen for heading order, not for size.

No change was made for either. Changing them would have been a regression.

### 5. The shared header cannot go stale — it is architecture, not discipline

There is one `NavBar.astro` with **one** `NAV_LINKS` array
(`src/components/NavBar.astro:19–27`) that feeds **both** the desktop row
(`:40`) and the mobile panel (`:72`). There is one `Footer.astro`, imported by
all 15 routed pages. No page holds its own copy of a link list, so no page can
carry a stale nav or footer. A nav change is a one-array change, everywhere at
once.

### 6. Forms — unchanged, and still blocked on the founder

Re-checked, chain intact: the site is on **GitHub Pages**, which has **no
host-native form handling**; there is **no working Web3Forms key** anywhere in
the repo (Web3Forms is gone from `src/` entirely); therefore **FORM_BACKEND =
Formspree**, and the Formspree account under `contact@tai42.ai` must be created
by the founder.

Both forms carry one clearly-named constant holding the sentinel
`PENDING_FOUNDER` — `FORMSPREE_CONTACT_ID` (`src/pages/contact.astro:14`) and
`FORMSPREE_BUILDERS_ID` (`src/pages/builders.astro:13`) — composed into
`https://formspree.io/f/${…_ID}`. The sentinel has no square brackets and is
never rendered as visible text; it appears only inside the `action` URL. The
forms are **wired but dead** until the two IDs are swapped in.

Consequence: the **end-to-end live test, including the Google Groups check**
(both groups must accept *external* senders, because Formspree delivers from its
own domain and a members-only group drops every submission silently), **stays
blocked** on those two IDs. Procedure: `CHANGELOG-website-hotfix.md`, step 20,
and `HOTFIX-REPORT.md` check 4, steps 1–8.

---

## Step 2 — the homepage "Two other doors." line becomes the section heading

`src/pages/index.astro`, "The other doors" section. The line was marked up as
body copy — `<p class="text-lg text-charcoal/70 leading-relaxed mb-6">` — while
functioning as the heading of its own band, which left the section headless in
the document outline and rendered its one sentence in muted grey at body size.

It is now an `<h2>` in the site's section-heading style, copied character for
character from the neighbouring home sections ("How it works" `:96`, "What we
build" `:140`):

```
<h2 class="text-3xl sm:text-4xl font-bold text-black mb-6">
  Two other doors.
</h2>
```

The text is byte-identical — `Two other doors.` — and the heading order is
unbroken (it is an `h2` under the page `h1`, like every other home band). Only
the tag and the class list changed.

## Step 3 — the StepLine stop-point marker reads as a connector on mobile

`src/components/StepLine.astro`. The `<ol>` is `flex flex-col … gap-8` on mobile
and `lg:flex-row lg:gap-0` on desktop. On mobile that gave the
`role="presentation"` stop-point marker ("you can leave here") a **full slot in
the vertical flow** — 32px of gap above it and 32px below, the same rhythm as a
real step card, plus the 36px node-height spacer and its 16px margin that the
marker only needs to line up with the numbered nodes in the desktop rail. It
read as an extra step rather than as a label sitting *between* two cards.

Two class changes, both scoped below `lg`:

| | Before | After |
| --- | --- | --- |
| marker `<li>` | `reveal flex flex-col lg:shrink-0 lg:px-3` | `reveal flex flex-col -my-6 lg:my-0 lg:shrink-0 lg:px-3` |
| its inner row | `flex h-9 items-center justify-center mb-4` | `flex items-center justify-center lg:h-9 lg:mb-4` |

`-my-6` (−24px block margin) cancels most of the 32px flex gap on each side, so
the mobile spacing around the marker is **8px above and 8px below** against
**32px** between two step cards — 4× tighter, and visibly subordinate. Dropping
`h-9`/`mb-4` below `lg` removes the 52px of rail-alignment box the stacked
layout has no rail to align to.

Unchanged: the desktop rendering (`lg:my-0 lg:h-9 lg:mb-4` restore the previous
box model exactly — at `lg` the computed margins and heights are identical),
`role="presentation"`, the dashed crimson pill styling, the label text, and the
`stopAfter`/`stopLabel`/`headingLevel` API. The component doc comment gained one
sentence explaining the mobile spacing.

**Verified in the built markup** (`dist/method/index.html`, both markers):

```
<li class="reveal flex flex-col -my-6 lg:my-0 lg:shrink-0 lg:px-3" … role="presentation">
  <div class="flex items-center justify-center lg:h-9 lg:mb-4">
```

and in the shipped stylesheet: `.-my-6{margin-block:calc(var(--spacing) * -6)}`,
`.lg\:my-0`, `.lg\:h-9`, `.lg\:mb-4` all emitted. The homepage passes no
`stopAfter`, so its four-step line is unaffected.

---

## Step 4 — forms teardown: the site has no form backend any more

Decision of 20 Aug (deploy-completion prompt v2, "Step 3 forms — SUPERSEDED …
NO FORMS"): `/contact` and `/builders` stop POSTing anywhere. The two pages keep
their copy and their questions, and their primary button becomes a `mailto:`
with the subject and the questions pre-filled (steps 5 and 6 below). This step
removes everything the form machinery needed.

**Deleted (`git rm`):**

| File | Why it existed | Why it goes |
| --- | --- | --- |
| `src/pages/thank-you.astro` | the contact form's `_next` landing page; the only page that rendered the calendar link | no form, no redirect target |
| `src/pages/thank-you-builders.astro` | the waitlist form's `_next` landing page | same |
| `src/components/FormSourceScript.astro` | stamped the referrer-derived `source` tag and the live company into the Formspree `_subject`/`_next` | no form fields left to stamp |
| `src/components/FormSubmissionEvent.astro` | fired the one custom Plausible event, `qualified_form_submission` | the event ceases to exist |
| `src/consts.ts` | held exactly one export, `CALENDAR_URL` | its only importer was `thank-you.astro`; the file is now empty of purpose, so it goes rather than lingering as an unused constant. Verified before deleting: `CALENDAR_URL` was imported in one place and `consts` in no other. |

**Changed:** `src/layouts/BaseLayout.astro` — the Plausible **script stays**
(page views are still collected). What goes is the inline `window.plausible`
queue shim, whose only job was to buffer custom events fired before the script
loaded, and the comment naming `qualified_form_submission`. The comment now
reads "Page views only: the site has no forms and fires no custom events" — a
description the build can be checked against.

**No calendar URL anywhere on the site.** `calendar.google.com` returns zero
hits in `src/` and in `dist/`. The booking link now travels in the human reply
to an email, which is the point: *we'll read this before we meet.*

**Repealed rule.** The earlier rule "never render an email address on the site"
is repealed for exactly two lines: `contact@tai42.ai` on `/contact` and
`builders@tai42.ai` on `/builders`. Both addresses are now **deliberately
public** — they are the intake path, and Google Workspace group-level spam
filtering is the spam layer that the honeypot used to be.

**Founder action — deliverability (added by the cold review):** before publish,
verify that both `contact@tai42.ai` and `builders@tai42.ai` Google Groups accept
mail from **external** senders, and send one test email to each from an outside
address. A members-only group drops outside mail silently, and with the forms
gone there is no backend, bounce surface, or analytics event left to notice a
lost message — the mailto buttons are the site's only intake path.

**Removed routes.** `/thank-you/` and `/thank-you-builders/` no longer exist and
will 404. Both were `noindex`ed and were reachable only as a form redirect
target — nothing on the site, and nothing off it, ever linked to them.
**Accepted**, deliberately, rather than adding redirects for URLs no one holds.

**Roadmap note:** the future intake flow reads the contact@ / builders@ Group
mailboxes — no public endpoint needed.

**Supersession — `CHANGELOG-website-hotfix.md`.** That file's *Pending —
founder / engineering* list opens with two Formspree items: (1) supply the two
form IDs replacing the `PENDING_FOUNDER` sentinel, and (2) verify whether
Formspree's `_next` custom redirect needs a paid plan. **Both are void.** There
are no forms, no form IDs, no `_next`, and no thank-you pages to redirect to;
`PENDING_FOUNDER` returns zero hits in `src/`. Its history stands as written and
is not rewritten — this paragraph is the pointer. A pointer line was added to
that file at the head of its pending list.

---

## Step 5 — `/contact` becomes three questions and one mailto button

`src/pages/contact.astro`. The H1 is untouched: *"Three questions. They save us
both a meeting."* Everything below it — the `<form>`, its five fields, the two
hidden Formspree inputs, the honeypot, and the `FormSourceScript` import — is
gone.

**Layout call.** The three questions render as a plain numbered list (`<ol>`,
left-aligned, `text-lg`), each with a small crimson numeral in the marker column
— the same crimson-dot marker idiom `/method` already uses for its report list,
with a numeral instead of a dot, because the page's own H1 counts them. The
demo helper — *"Paste a link, a video, or a sentence — anything that shows what
you've built."* — sits as the first question's **sub-line**, verbatim, in the
`text-sm text-charcoal/60` size the form's helper text used. It reads naturally
there: it explains what an answer to question 1 looks like.

**One deletion of copy, stated plainly:** the form label read "Do you have a
working demo today? **(optional)**". "(optional)" was a form affordance — it
told you that you could submit with the field empty. With no fields to leave
empty it means nothing, so the question renders as "Do you have a working demo
today?" The encouragement it carried survives in the sub-line and in the mailto
body, where the prompt is spelled "Do you have a working demo today? (paste a
link, a video, or a sentence)".

**The button** uses the site's primary button classes, unchanged
(`btn-hover inline-flex … bg-crimson text-white hover:bg-burgundy rounded-lg
px-8 py-3.5 font-semibold transition-colors`), and reads **"Get your production
readiness report"**. Its `href` is built in the frontmatter from a `PROMPTS`
array, so the encoding is `encodeURIComponent`'s and not hand-written:

```
mailto:contact@tai42.ai?subject=Production%20readiness%20report&body=…
```

decoded body:

```
Do you have a working demo today? (paste a link, a video, or a sentence)

What breaks — or what's stopping you from putting it in front of real users?

How will you measure success in production?

Name / Company:

```

Each prompt on its own line with a blank line after it — including the last, so
there is room to type under "Name / Company:". Line breaks are `\r\n`, which
encode to `%0D%0A`.

Under the button, one plain line, verbatim: *"or write to contact@tai42.ai — we
read everything and reply with a time to talk."* The address is a `mailto:` link
in the site's standard inline-link classes (`font-medium text-crimson
hover:text-burgundy transition-colors`, no underline — matching every other
inline link on the site).

**No calendar link anywhere on the page**, and no analytics event: the page now
loads no page-specific script at all.

---

## Step 6 — `/builders` becomes three prompts and one mailto button

`src/pages/builders.astro`. **Body copy is verbatim and untouched** — the hero,
the founding-partner paragraph, and the honest-line paragraph are byte-identical.
Only the waitlist form changes: the `<form>`, the four fields, the two hidden
Formspree inputs, the honeypot, and the `FormSourceScript` import are gone.

The three field prompts render as plain text lines inside the same card the form
sat in (`rounded-xl border border-gray-200 bg-white p-6 lg:p-8` on the gray
band — the established card style, unchanged), with the crimson-dot marker
`/method` uses for its lists:

* Company
* What you deliver today (agency / dev shop / service firm / operator)
* Roughly how many clients

The four `<select>` options survive as that parenthesis. `DELIVERS` stays a
frontmatter array and is joined into both the rendered line and the mailto body,
so the two cannot drift apart.

**The button**, in the site's primary button classes, still reads **"Join the
founding waitlist"**, and is now:

```
mailto:builders@tai42.ai?subject=Founding%20builder&body=…
```

decoded body:

```
Company:

What you deliver today (agency / dev shop / service firm / operator):

Roughly how many clients:

```

Same layout as `/contact`: one prompt per line, blank line after each, `\r\n`
encoded as `%0D%0A`.

Under it, verbatim: *"or write to builders@tai42.ai."* — the address a `mailto:`
link in the standard inline-link classes.

**Dropped from both pages: the Email field.** It was there because a form POST
carries no sender. An email does: the reply address is the From header. Nothing
else was dropped.

**No calendar link on the page.**

---

## Step 7 — the primary CTA reads "Get your production readiness report"

Decision 20 Aug. The button label gains one word, in all eight places it
appears, and the `href` is unchanged everywhere (`/contact/` — the page, not the
mailto):

| File | Where |
| --- | --- |
| `src/components/NavBar.astro` | desktop CTA, mobile-menu CTA |
| `src/pages/index.astro` | hero CTA, bottom CTA |
| `src/pages/method.astro` | bottom CTA |
| `src/pages/about.astro` | bottom CTA |
| `src/pages/platform.astro` | actions row (the primary of the pair; the secondary "Talk to us about a tenant" is untouched) |
| `src/pages/contact.astro` | the mailto button (Step 5) |

"Get your readiness report" returns **zero hits** in `src/` and in `dist/`.

### First-mention upgrades — every changed sentence

The rule: the **first** time a page names the report it says *production
readiness report*; "the report" is fine thereafter. Two sentences changed:

1. `src/pages/platform.astro`, "Getting started":
   "…talk to us. The **readiness report** is free: we assess your demo…" →
   "…talk to us. The **production readiness report** is free: we assess your
   demo…" (the sentence's own later "a written report" stays — that is the
   thereafter case).
2. `src/pages/method.astro`, section-2 heading:
   "What's in the **readiness report**" → "What's in the **production readiness
   report**". *Judgment call, stated:* the page's literally-first occurrence of
   the two words is inside step 1's locked paragraph ("You leave with a written
   readiness report and a proposal"), which spec 4e locks verbatim — and it sits
   two sentences under the step title "The production readiness review (free,
   entry).", so the qualifier is already carried by its own context. The heading
   is the page's first *standalone* naming of the artefact, and a heading is
   where the full name earns its place. So: heading upgraded, locked paragraph
   untouched.

**Deliberately not changed:**

* `/method` step 1's title and the page intro say "production readiness
  **review**" — the review, not the report. Left as written (spec is explicit).
* `/about`'s "the readiness review" in the OG/summary sentence — the review
  again.
* `/index`'s "Production readiness review (free)." — the review.
* `/method`'s locked step-1 paragraph, as argued above.
* Later mentions of "the report" and "a written report" anywhere.

One comment also updated for accuracy: `NavBar.astro`'s header comment described
the CTA as "form first, calendar second" — there is no form and no calendar, so
it now reads "→ /contact/ — the page, not its mailto button".

---

## Steps 4–7 — verification (wave A gates)

`npx astro check` — **22 files, 0 errors, 0 warnings, 0 hints.**
`npm run build` — **12 pages built** (was 14; the two thank-you pages are gone),
plus the 8 redirect pages, for 20 HTML files in `dist/`.

| Check | Result |
| --- | --- |
| `Get your readiness report` | 0 in `src/`, 0 in `dist/` |
| `Get your production readiness report` | 30 rendered instances across `dist/` |
| `calendar.google.com` | 0 in `src/`, 0 in `dist/` |
| `PENDING_FOUNDER` | 0 in `src/`, 0 in `dist/` |
| `qualified_form_submission` | 0 in `src/`, 0 in `dist/` |
| `FormSourceScript` / `FormSubmissionEvent` / `CALENDAR_URL` / `../consts` | 0 references in `src/` |
| `thank-you` in `dist/` | 0 files, 0 hits |
| `<form>` / `formspree.io` endpoints in `dist/` | 0 |
| Bracket-placeholder regex `\[[A-Z_]{3,}\]` in `dist/` | 0 |
| Both mailto hrefs decoded from the built HTML | addresses, subjects and bodies exactly as specified (bodies printed above) |
| Addresses rendered | `contact@tai42.ai` ×3 on `/contact` (button href, inline link href, visible text), `builders@tai42.ai` ×3 on `/builders` — deliberate |

**One known remaining hit, deferred by design:** `Formspree` still appears once
in `src/pages/privacy.astro` (and so once in `dist/privacy/index.html`), along
with the session-storage entry, the source tag and the thank-you pages it
describes. `/privacy` is rewritten in wave C (spec 4f); it is left untouched
here rather than half-edited. The build does not depend on it — the page has no
imports from the removed files.

---

## Step 8 — `/method` becomes an overview strip, one gate line, five detail blocks

Decision of 20 Aug (spec 4e, which supersedes 4a–4c for this page). The page no
longer renders its five steps through `StepLine`; it renders them twice, in two
registers, inside one section:

1. **The overview strip** — one compact horizontal line of five nodes, number
   badge + short title only, connected by a thin `w-6 h-px bg-gray-200` rule
   (`aria-hidden`, it is decoration): `1 Readiness review · 2 Readiness gate ·
   3 Build · 4 Acceptance · 5 Run`. Left-aligned, an `<ol>` so the order is
   semantic. Below `sm` it is `w-max` inside an `overflow-x-auto` wrapper
   bled to the band edges (`-mx-4 sm:mx-0`), so it scrolls sideways rather than
   breaking a node in half; from `sm` up it is `flex-wrap` and wraps normally.
2. **The gate line** — one plain sentence directly under the strip, verbatim:
   "Every phase ends at a written gate. You can stop at any of them — which is
   exactly why clients don't." Body copy, not a heading. This is the only place
   the leave-idea appears on the page.
3. **The detail blocks** — the same five steps stacked, left-aligned, in the
   established card (`bg-white rounded-xl border border-gray-200` on the gray
   band): number badge, full title, locked paragraph. One number per step — the
   badge — and the titles carry no numbering of their own.

The five step bodies are **byte-identical**; only the `STEPS` entries gained a
`short` field for the strip. The `Step` type is now local to the page (it no
longer imports `StepLine`).

**Heading-outline call.** The step titles must not be `<h2>` (4e) and the outline
must not skip a level, so the strip and the blocks now live in a section with
its own heading — `<h2>The five steps</h2>`, in the site's standard section
style — and the five titles are `<h3 class="text-base font-bold text-black">`,
the same small title style they had as cards. Rendered outline of `/method`:

```
h1 How it works
h2 The five steps
   h3 The production readiness review (free, entry).
   h3 Stage 0 — the readiness gate.
   h3 The build.
   h3 Acceptance (your verification).
   h3 Run (the license).
h2 What's in the production readiness report
h2 Where humans stay
h2 What we ask of you
h2 What you keep
h2 Who we work with
```

One `h1`, section `h2`s, step titles one level under their own section, no skip,
and the titles are visibly subordinate (16px bold against a 30–36px section
heading).

### The StepLine API loses its stop-points

`/method` was the only caller passing `stopAfter` — so with the stop-point idea
gone from the page, the marker had no user left. `src/components/StepLine.astro`
therefore drops:

* the `stopAfter` and `stopLabel` props (and the `"you can leave here"` default),
* the whole `Item` union and the flattening loop that interleaved markers with
  steps — the component now maps `steps` directly,
* the marker `<li>` (the `role="presentation"` dashed crimson pill), which is
  what Step 3 above had been tuning. Step 3's mobile-spacing fix is superseded:
  there is no marker to space.

`headingLevel` stays (the homepage relies on its `h3` default, and it is the
knob that keeps a caller's heading order unbroken), as do `Step`, the rail, the
card, the link variant and the `.reveal` delays. **The homepage's four-step line
renders byte-identically**: its `<ol>…</ol>` region in `dist/index.html` is
character-for-character the same as in the pre-change build (2,893 bytes,
diffed). Without the stop branch, the `i * 60ms` reveal delays are the same
numbers they always were for a caller that passed no `stopAfter`.

## Step 9 — internal working labels stop rendering

Spec 4d: every heading has to pass "would a reader write this?".

| Page | Before | After |
| --- | --- | --- |
| `/` | `<h2>Two other doors.</h2>` above the doors card | heading removed; the card with the builders link stands alone, left-aligned, in its own band |
| `/method` | `<h2>Who we work with (the honest filter)</h2>` | `<h2>Who we work with</h2>` |
| `/builders` | `<h2>The honest line</h2>` above its paragraph | heading removed; the paragraph stands alone |
| `/platform` | `<h2>What you get</h2>` | unchanged — 4d allows it as a plain section heading, and it is one |
| `/open-source` | contract label was never a heading | unchanged |

This supersedes Step 2 of this changelog, which had promoted the homepage
"Two other doors." line to a heading; 20 Aug removes the label outright.

**Astro emits HTML comments into the build.** The section comments carrying the
same working labels were therefore rendered text as far as the verification
greps are concerned, and are renamed:

* `src/pages/builders.astro` — `<!-- The honest line -->` → `<!-- How founding partners come in -->`
* `src/pages/platform.astro` — `<!-- The honest line -->` → `<!-- Where else to start -->`
* `src/pages/open-source.astro` — `<!-- The one-sentence contract -->` → `<!-- The contract, as one sentence -->`
* `src/pages/method.astro` — the section comment lost "(the honest filter)" with the heading

## Step 10 — `/about`: new h1, and the layers paragraph replaced

Spec 7i.

* **H1 and metadata.** `The self-driving company, the honest way` →
  `The self-driving company, in production.`; the page `title` →
  `The self-driving company, in production. — tai42`. `BaseLayout` derives
  `og:title` and `twitter:title` from `title`, so all three change with the one
  edit (verified in `dist/about/index.html`). "the honest way" now returns zero
  hits sitewide.
* **The "Why the layers are separate." paragraph.** The bold lead is **kept**:
  it is descriptive, reader-facing copy — a reader would write "Why the layers
  are separate." — so it passes the 4d test, and 7i's replacement text is the
  paragraph body only. Everything after the `<strong>` is replaced with the
  spec's text verbatim: "So each one can make you a promise the others don't
  depend on. You can verify the engine without trusting us — the code is public.
  You can run your operations without sharing them — your tenant is private. And
  you can start without committing — engagements are short and end at gates you
  verify. Three layers, three independent guarantees." The old
  trust/keep/proof sentences are gone, so "earns its keep" returns zero hits.
* The `description` meta, the three layer cards and the rest of the page are
  untouched.

## Steps 8–10 — verification (wave B gates)

`npx astro check` — **22 files, 0 errors, 0 warnings, 0 hints.**
`npm run build` — **12 pages built**, build clean.

| Check | Result |
| --- | --- |
| `you can leave here` | 0 in `src/`, 0 in `dist/` |
| `honest line` (case-insensitive) | 0 in `dist/` |
| `honest filter` | 0 in `dist/` |
| `Two other doors` | 0 in `dist/` |
| `doors line` | 0 in `dist/` |
| `proof strip` | 0 in `dist/` |
| `the one-sentence contract` | 0 as a label; **1 remaining hit** — see below |
| `the honest way` | 0 in `src/`, 0 in `dist/` |
| `earns its keep` | 0 in `src/`, 0 in `dist/` |
| `/method` renders strip → gate line → five blocks | yes (rendered text order verified in `dist/method/index.html`) |
| one number per step on `/method` | yes — the badge; no numeral in any title |
| five locked step paragraphs | byte-identical to the pre-change build (each of the five matched exactly against the old `dist`) |
| homepage step line | `<ol>` region byte-identical to the pre-change `dist/index.html` |
| homepage, only intended change | whole-page diff shows exactly one removal: the `Two other doors.` `<h2>` |

**The one remaining hit, flagged not fixed:** `dist/about/index.html` still
contains the words "The one-sentence contract:" — inside the locked body of the
"The open-source runtime." layer card, as an in-sentence lead-in to the contract
sentence, not as a heading or a standalone label. 4d's instruction ("Open
Source: … never render it (already correct; keep)") is about the `/open-source`
page, which is clean. Rewriting the `/about` card body is not in wave B's scope
and that sentence is due to change anyway under 4b(2) (the contract sentence's
casing sweep), so it is left for that wave to settle.

## Step 11 — the name-casing rule: Tai42 at a sentence start, tai42 everywhere else

Spec 4b(2). (The wave-C prompt said "ends at Step 10"; wave B already ended
there, so the instruction to continue the numbering wins and wave C runs 11–14.)

**The rule.** The mark is lowercase `tai42` everywhere except at the start of a
sentence or on a standalone heading line, where it is `Tai42`. Mid-sentence it
stays lowercase ("…we run inside tai42 —", "…reported to tai42.", "the platform
every tai42 application runs on"). The domain, the two email addresses, the
logo `alt` text, the GitHub org path and the `— tai42` title suffix are
untouched.

**Every sentence swept:**

| Where | Now reads |
| --- | --- |
| `/` hero sub + `description` | "Tai42 takes AI into production — …" |
| `/about` opening paragraph + `description` | "…workflows. Tai42 introduces the self-driving company — …" |
| `/builders` hero paragraph + `description` | "Tai42's platform will open to a small group of founding partners — …" |
| Footer line | "Tai42 — we take AI from demo to production." |
| Footer contract, `/open-source` blockquote, `/about` layer card | "Tai42 builds and runs its business on this runtime; …" |
| `BaseLayout` default `title`/`description` | "Tai42 — we take AI from demo to production" / "Tai42 turns fragile AI demos…" |
| `public/llms.txt` | `# Tai42` and "> Tai42 takes AI from demo to production: …" |

**The `/about` lead-in, removed (ruled).** The layer card read "…not the
paywall. The one-sentence contract: tai42 builds and runs its business…".
"The one-sentence contract" is a working label, and 4d says a working label
never renders — that beats the locked 7i card copy, which was written before
4d existed. The lead-in is deleted; the contract sentence now stands alone at
the end of the card, opening "Tai42 builds…" like the other two instances. This
closes the one hit wave B flagged and left ("The one-sentence contract" is now
zero in `dist`).

**The three contract instances are byte-identical**, and each is still kept on a
single source line so they stay that way:

> Tai42 builds and runs its business on this runtime; the code is open; the company sells the hosted platform and enterprise layer on top — never a different core.

**Judgment calls, stated:**

* **`llms.txt` `# tai42` → `# Tai42`.** The file's copy was spec-verbatim, and
  the parent asked for a ruling. The casing rule names "a standalone heading
  line" as a `Tai42` case, and a heading that is only the mark is the *only*
  thing that phrase can mean — a heading like "tai42 builds…" is already covered
  by "start of a sentence". The exemption list is closed and specific (domain,
  emails, package names, code identifiers, the `— tai42` title suffix); an H1 is
  on none of it. So the H1 is capitalised, and the blockquote line under it
  becomes "Tai42 takes AI from demo to production:" as the parent ruled. The
  contrary reading — that a bare H1 is a mark like the title suffix — is
  defensible; it was not taken.
* **`BaseLayout`'s default `title`/`description`** are dead code today (all 12
  built pages pass both), but they were swept anyway so the fallback cannot
  reintroduce a violation.
* **Page `<title>`s were not touched.** "— tai42" is a mark, not a sentence, per
  the spec. `/terms`' title changed in step 13, but for sentence case, not
  casing of the mark.
* **The footer's HTML comment** `<!-- The one-sentence open-source contract -->`
  renders into `dist` (Astro keeps HTML comments). It is now
  `<!-- The open-source contract, as one sentence -->`, the same treatment wave
  B gave the `/open-source` comment.

**Outside this repo — supersession note for `CHANGELOG-website-correction.md`.**
That file's "Outside this repo" instructions (docs landing §3, GitHub org
README §2) tell the founder to publish the contract sentence verbatim in its
old casing. Those two instructions are superseded by 4b(2). The old file is not
rewritten; the corrected instruction text is recorded here and is what should be
published:

> **Docs landing (was §3):** Add the one-sentence contract verbatim to the docs
> landing page:
> "Tai42 builds and runs its business on this runtime; the code is open; the
> company sells the hosted platform and enterprise layer on top — never a
> different core."

> **GitHub org README (was §2):** Open the org README with the one-sentence
> contract, verbatim, as the first line:
> "Tai42 builds and runs its business on this runtime; the code is open; the
> company sells the hosted platform and enterprise layer on top — never a
> different core."

Only the first word changes in each; the rest of both instructions stands. The
docs landing line in §2 of that file ("the tai42 runtime — the open runtime
behind the tai42 platform") is mid-line and stays lowercase.

## Step 12 — alignment and styling sweep

Spec 4c(2). Everything reads from the left; one card style, one button style,
one link style, one section-spacing scale. Nothing new was invented — every
straggler was pulled onto an idiom that already existed on the site.

**The spacing scale, stated:** heroes are `py-20 lg:py-28`; every other band is
`py-20 lg:py-24`; a section that closes the band above it carries only
`pb-20 lg:pb-24` (the `/platform` "What it runs" pattern). The `sm:` breakpoint
variants on the legal pages are gone.

**Every element changed:**

| Page | Element | Change |
| --- | --- | --- |
| `/` | hero container | `text-center` removed |
| `/` | hero sub-paragraph | `mx-auto` removed (`max-w-2xl` kept) |
| `/` | hero CTA row | `justify-center` removed |
| `/` | "Why it works" `<h2>` | `text-center` removed |
| `/` | doors band | `py-16 lg:py-20` → `py-20 lg:py-24` |
| `/` | bottom CTA container | `text-center` removed |
| `/about` | bottom CTA container | `text-center` removed |
| `/method` | hero container | `text-center` removed |
| `/method` | bottom CTA container | `text-center` removed |
| `/platform` | hero container | `text-center` removed |
| `/platform` | actions row | `items-center justify-center` → `items-start sm:items-center` |
| `/open-source` | contract band | `py-16 lg:py-20` → `py-20 lg:py-24` |
| `/open-source` | gated boundary-table band | `py-16 lg:py-24` → `py-20 lg:py-24` |
| `/open-source` | actions row | `items-center justify-center` → `items-start sm:items-center` |
| `/builders` | body band, partners band | `py-16 lg:py-20` → `py-20 lg:py-24` |
| `/builders` | waitlist band | `py-16 lg:py-24` → `py-20 lg:py-24` |
| `/builders` | waitlist card | class order normalised to the card idiom |
| `/404` | content container | `text-center` removed |
| NavBar | mobile CTA | `block w-full text-center` → `inline-flex items-center … btn-hover` — it joins the one button style instead of being a full-width centred block |
| `/security` | hero container | `text-center` removed |
| `/security` | `<h1>` | `tracking-tight` → `leading-[1.1]` (the sitewide h1 idiom) |
| `/security` | hero sub | `text-xl text-charcoal/60 max-w-2xl mx-auto` → `text-lg text-charcoal/70 max-w-2xl leading-relaxed` |
| `/security` | card band | `py-20 lg:py-28` → `py-20 lg:py-24` |
| `/security` | 4 card headings | `text-lg` → `text-xl` (card-title idiom) |
| `/security` | 5 card paragraphs | `text-charcoal/60 text-sm` → `text-charcoal/70` (card-body idiom) |
| `/company/careers` | `<h1>` | "Build the Open Agent Runtime." → "Build the open agent runtime."; `tracking-tight mb-8` → `leading-[1.1] mb-6` |
| `/company/careers` | open-roles band | `py-20 lg:py-28` → `py-20 lg:py-24` |
| `/company/careers` | open-roles card | `text-center` removed; `p-8 lg:p-10` → `p-6 lg:p-8` |
| `/company/careers` | card paragraph | `mx-auto` removed |
| `/company/careers` | "Get in touch →" | `text-base font-semibold` → `font-medium` (the sitewide link idiom) |
| `/terms` | header band | `py-20 sm:py-24` → `py-20 lg:py-28`; container `text-center` removed |
| `/terms` | content band | `pb-20 sm:pb-28` → `pb-20 lg:pb-24` |
| `/privacy` | header band | `py-20 sm:py-24` → `py-20 lg:py-28`; container `text-center` removed |
| `/privacy` | three content bands | `py-16 sm:py-20` → `py-20 lg:py-24` |

`/terms` and `/privacy` also needed heading case, em dashes and card style; those
landed with the rewrites in steps 13 and 14 rather than being done twice.

**Two of those `/privacy` bands moved again in step 14**, so the row above is
this step's end state, not the page's. "What this site collects" dropped its
fill and its top padding — it is now `pb-20 lg:pb-24` with no `bg-` class at
all, closing the white header band rather than starting a band of its own — and
"The runtime you self-host, the platform we host" flipped `bg-white` →
`bg-gray-50`, which keeps the white/grey alternation running to the foot of the
page. The third of them, "When you contact us" — now "When you write to us" —
kept `bg-gray-50 py-20 lg:py-24`, and step 14's new "Who is responsible & your
rights" band took `bg-white py-20 lg:py-24` between them.

**`text-center` is now zero** in `src/pages` and `src/components` — no sanctioned
survivors. The remaining `justify-center` occurrences are all inside
shrink-to-fit `inline-flex` buttons or fixed-size round number/icon badges,
where they centre a glyph inside its own box and have no effect on text
alignment.

**Em dashes.** The founder's "never ` - `" now supersedes the task-2
page-internal ruling. The eight remaining hyphen dashes in rendered copy were
all on the two legal pages (`/terms` §§2, 3, 5; `/privacy` in four places) and
became em dashes with the rewrites below. ` - ` is now zero in rendered text
sitewide.

**Sentence-case headings.** Every rendered `<h1>`–`<h3>` on all 12 built pages was
listed and checked. Only careers' h1 (this step) and the `/terms` and
`/privacy` headings (steps 13–14) were Title Case. The footer's `Site` /
`Doors` / `Legal` column labels are single words already in sentence case (the
all-caps look is `uppercase` in CSS, an existing idiom, not copy).

## Step 13 — `/terms`: the provider is the brand, plus Trademarks and Provider

Spec 4f.

* **"TAI42, Inc." is gone from every section.** §1 now reads "…any services
  provided by tai42 ("tai42," "we," "us"), including the tai42 open-source
  runtime, BabelFish…". `TAI42` and `Inc.` both return zero in `src` and in
  `dist`.
* **§2–§4** are substantively unchanged: only `TAI42` → `tai42` (or `Tai42`
  where the sentence opens on it, in §4 and §7) and the hyphen dashes → em
  dashes.
* **§5's forms sentence** is replaced with the email reality: "This website's
  analytics are aggregate and set no cookies, and the site has no forms: what
  you write to contact@tai42.ai or builders@tai42.ai arrives in a group mailbox
  and is used only to reply to you and to schedule a conversation." The rest of
  §5 (self-hosting, the tenant, the link to the privacy policy) is unchanged.
* **Two sections added, and only two:**
  * **8. Trademarks** — "Tai42, the tai42 logo, and BabelFish are marks of
    tai42. The Apache-2.0 license covering the runtime grants no rights to these
    marks; you may not use them except to accurately describe the origin of the
    software."
  * **9. Provider** — "Tai42 is currently operated by its founders. A corporate
    entity will be designated upon incorporation, and these terms will be
    updated to name it. Questions: contact@tai42.ai."
* **No governing-law section, no Aviso Legal, no registered address, no
  registry number.** The Contact section still points at contact@tai42.ai and is
  otherwise unchanged.
* **Numbering.** §§1–7 keep their numbers so the spec's own §-references still
  resolve; the two new sections are appended as 8 and 9, and Contact moves from
  8 to 10.
* **Headings sentence-cased**, including the page `<title>` and `<h1>`
  ("Terms of Service." → "Terms of service."), so the title matches the h1.

**Judgment call — the verbatim copy vs. the casing rule.** Both spec sections
open on the mark: "tai42, the tai42 logo, …" and "tai42 is currently operated
by its founders." 4b(2) is the later decision, it sweeps *every page*, and its
verification gate is a hard zero for sentence-initial lowercase `tai42` in
rendered copy. The gate wins: both sentences open "Tai42". Nothing else in
either sentence is altered — the mid-sentence marks ("the tai42 logo", "marks of
tai42") stay lowercase, as the rule requires.

## Step 14 — `/privacy`: rewritten for a site that only has an inbox

Spec 4f.

**Removed entirely** — because none of it exists any more after step 4's forms
teardown: Formspree, the two contact forms, the thank-you pages, the source tag
recording how a visitor arrived, the session-storage entry, and the Plausible
form-submission event. `Formspree` returns zero in `src`, `public` and `dist`.

**Analytics — kept, exactly as scoped, minus the form event.** Plausible *is*
loaded: `BaseLayout.astro` renders
`<script is:inline defer data-domain="tai42.ai" src="https://plausible.io/js/script.js">`
on every page, and the built HTML carries it. The page therefore still says:

> We use Plausible, which counts page views in aggregate — which pages are read,
> how often, and other aggregate dimensions such as country and device type.
> Like any web request, the analytics request carries standard technical data
> (such as your IP address and browser type); Plausible sets no cookies, and
> what reaches us are aggregate totals, not individual visitors. Page views are
> the only measurement: the site fires no other events.

The last sentence replaces the old "There is one event beyond page views…"
passage. The claim now matches the build exactly.

**Added — "When you write to us":** there is no form to fill in; writing to
contact@tai42.ai or builders@tai42.ai sends an ordinary email, received in a
Google Workspace group inbox; what you send is used only to reply and to
schedule a conversation — no CRM, no automated sequence, nothing sold and
nothing passed on; ask us to delete it and we delete it.

**Added — "Who is responsible & your rights":** the site is operated by tai42,
write to contact@tai42.ai; you can ask at any time what we hold about you and
have it corrected or deleted; GitHub hosts the site and receives standard
request data, and Google carries our mail and our calendar, each processing it
under its own terms. **No entity, registry, or address is named.**

**Kept:** no cookies, no accounts, the GitHub Pages hosting-logs paragraph, and
the runtime/platform scoping section (this policy covers the website only;
self-hosting phones home to nobody; the hosted tenant is governed by its own
agreement) — all substantively as they were.

**Styling, per step 12:** headings sentence-cased ("Your Data is Yours. Here Is
Exactly What This Site Collects." → "Your data is yours. Here is exactly what
this site collects.", "What This Site Collects" → "What this site collects", and
so on); five hyphen dashes → em dashes; the `bg-crimson/5 border-crimson/20`
callout and the three icon-decorated cards are replaced by the site's one card
style (`bg-gray-50 rounded-xl border border-gray-200` on the white band); the
red-X / green-check icon chrome is dropped as the only instance of that pattern
on the site; the `description` meta no longer promises a form. The page now runs
white (header + collects) → gray → white → gray, on the standard rhythm.

## Steps 11–14 — verification (wave C gates)

`npx astro check` — **22 files, 0 errors, 0 warnings, 0 hints.**
`npm run build` — **12 pages built**, build clean.

| Check | Result |
| --- | --- |
| `(^\|[.!?]\s+)tai42\b` over rendered text, all 20 built HTML files | **0** |
| same regex over every `description` / `og:description` / `twitter:description` | **0** |
| `TAI42` | 0 in `src`, 0 in `dist` |
| `Inc.` | 0 in `src`, 0 in `dist` |
| `Formspree` (case-insensitive) | 0 in `src`, 0 in `public`, 0 in `dist` |
| `The one-sentence contract` | **0 in `dist`** (wave B's flagged hit is closed) |
| contract sentence opening "Tai42 builds" | present in all three places, byte-identical (footer on every page, `/open-source` blockquote, `/about` layer card) |
| `text-center` in `src/pages` + `src/components` | **0** — no sanctioned survivors |
| ` - ` in rendered text, all pages | **0** |
| analytics claim vs. build | Plausible script present in every built page; the policy describes page views only |
| `/terms` Trademarks + Provider sections | both render (§8, §9) |
| governing law / Aviso Legal / address on legal pages | none |
| rendered headings, all 12 built pages | all sentence case |

## Cold-review fix wave — five findings, all verified before fixing

A fresh-context review of the finished branch. Five findings, no copy changes
beyond the two sentences named below.

**1. `/privacy` under-disclosed its processors (`privacy.astro:129`).** The
rights paragraph said "**Two** providers handle data on the way" and then named
GitHub and Google — while the same page, two sections earlier, discloses that
Plausible receives a request from every page view. Two counted, three do the
work. The count word is dropped and the third processor is named, in the
sentence's own dash-and-comma shape:

> Providers that handle data on the way: GitHub hosts the site and receives
> standard request data, Plausible receives the analytics request, and Google
> carries our mail and our calendar — each processing it under its own terms.

**2. The two question lists were presented differently.** `/contact` rendered
its three questions as a bare `<ol>` with crimson numeral badges, straight on
the band; `/builders` rendered its three prompts as a `<ul>` with crimson dots
inside a card. Same job on two doors, two presentations. Both are now
card-wrapped, each keeping its own list style — numerals stay numerals, dots
stay dots, and **no text changed on either page**. The fill follows the band, as
everywhere else on the site: `/builders`' card sits on a `bg-gray-50` band and
stays `bg-white`; `/contact`'s single band is `bg-white`, so its card is
`bg-gray-50 rounded-xl border border-gray-200 p-6 lg:p-8` — the same card, the
inverted fill, exactly as `/`'s "For builders" card already does on its white
band. A `bg-white` card on a `bg-white` band would have had only its border to
show for itself, and the site has no such instance.

**3. `index.astro`'s step-line comment described the old design.** It claimed
the home line was `/method`'s "same component" with "no stop-point labels here"
— but the redesign in step 8 rebuilt `/method` around an overview strip and five
detail blocks, and step 9 removed stop-point labels from the site entirely, so
both halves were false. The comment now says only what is true: the home page's
compact four-step line, rendered by `StepLine`, every step linking to `/method/`
where the full five-step sequence lives.

**4. `/security`'s `description` was 207 characters** — pre-existing, and a
regression: the 91903a8 fix wave trimmed this same meta once, and the step-12
rewrite reintroduced the long form. Trimmed to **150**, keeping both halves of
the claim and the page intro's own words: "Open source, deterministic, and yours
to run — self-host the open-source runtime, or run the hosted BabelFish platform
in a private, EU-hosted tenant." (The intro paragraph keeps the full sentence;
only the meta is shortened.)

**5. This file's own header block was false.** It still declared that **no site
copy had been changed, not a single one**, and described the whole diff as a
tag/class change on one heading, a spacing change on one list item and two new
markdown files — accurate when steps 1–3 were the whole branch, flatly untrue
after steps 4–14 rewrote both door pages, `/method`, `/terms` and `/privacy`
(and deleted two pages outright). The header now summarises what
the file actually contains: the steps 1–3 deploy-completion pass, the steps 4–14
decision set, the gates state, and what `HOTFIX-2-REPORT.md` does and does not
cover. Two further accuracy fixes went in with it:

* **The page count, in step 11's judgment calls and in the wave-C gate table.**
  Both said thirteen; both now say **all 12 built pages**. The build emits 12
  pages; `src/pages/_agents.astro` is underscore-prefixed and therefore
  unrouted, so it is not one of them. (The
  gate row reading "all 20 built HTML files" is correct as written and was left
  — `dist/` holds 20 HTML files, the 12 pages plus the legacy redirect stubs.)
* **The `/privacy` band row in step 12's changed-elements table** said "three
  content bands `py-16 sm:py-20` → `py-20 lg:py-24`", which was that step's end
  state but has not been the page's since step 14. A note under the table now
  states it precisely: "What this site collects" carries no `bg-` class at all
  and is `pb-20 lg:pb-24`, closing the white header band; "The runtime you
  self-host, the platform we host" flipped `bg-white` → `bg-gray-50`; the third
  band kept its classes, and step 14's new "Who is responsible & your rights"
  band took `bg-white py-20 lg:py-24`.

### Verification (fix-wave gates)

`npx astro check` — **22 files, 0 errors, 0 warnings, 0 hints.**
`rm -rf dist && npm run build` — **12 pages built**, build clean.

| Check | Result |
| --- | --- |
| `/privacy` processors sentence in `dist` | renders with GitHub, Plausible and Google, one sentence |
| `/contact` question list wrapper in `dist` | `bg-gray-50 rounded-xl border border-gray-200 p-6 lg:p-8` around the `<ol>` |
| `/builders` prompt list wrapper in `dist` | `bg-white rounded-xl border border-gray-200 p-6 lg:p-8` around the `<ul>` |
| `/security` `description` length | **150** chars (was 207) |
| the old header's no-copy-was-changed claim, verbatim, in this file | **0 hits** |
| the thirteen-page count, verbatim, in this file | **0 hits** |
| `Formspree` / `Web3Forms` / `TAI42` / `Inc.` | 0 in `src`, `public`, `dist` |
| bracket regex `\[[A-Z_]+[^\]]*\]` | 0 in `src`, `public`, `dist` |
| `(^\|[.!?]\s+)tai42\b` over rendered text, all 20 built HTML files | **0** |
| same regex over every `description` / `og:description` / `twitter:description` | **0** |
| ` - ` in rendered text, all pages | **0** |
| contract sentence "Tai42 builds…" | 3 instances intact — footer on all 12 built pages, `/open-source` blockquote, `/about` layer card |


## Cold-review fix wave 2 (2026-08-21)

- The Google-Groups external-sender check was carried forward into this file
  (above, under step 4) after the review found it had been lost when the old
  Formspree pending items were voided; `CHANGELOG-website-hotfix.md` item 10 is
  now explicitly void with a pointer here.
- `/privacy` meta description trimmed 174 → 136 characters (step 14 had pushed
  it past the ~160 search-snippet window; same rule applied to `/security` in
  fix wave 1).
- Gates re-run after these edits: `npx astro check` 0/0/0; `npm run build` 12
  pages, green.
