# CHANGELOG — website hotfix 2

Branch: `website-hotfix-2`, based on live `main` (`d266de4`). This is a
completion pass, not a redeploy: the cause analysis below comes first, because
most of what the deploy-completion prompt lists is **not a defect in the repo or
in the deployed artifact**. Two items are real and are fixed here.

No new dependencies, colors, fonts, or components. **No site copy was changed —
not one sentence.** The diff is a tag/class change on one heading, a spacing
change on one list item, and two new markdown files.

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
