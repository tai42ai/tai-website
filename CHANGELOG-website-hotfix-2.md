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
