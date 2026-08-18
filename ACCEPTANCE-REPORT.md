# ACCEPTANCE REPORT — website correction v1.5

Branch: `website-correction-v1.5` · HEAD `bf43e0c` · base `fbb50ca` (20 commits)
Date: 2026-08-18 · Astro 5.17.3 · Node v24.13.1

Build run fresh before every test:

```
rm -rf dist && npm run build
→ 13 page(s) built in 636ms · [build] Complete!  (13 pages + 8 redirect stubs, 0 errors)
```

Search scope for all string tests: `src/`, `public/`, `astro.config.mjs`, and the
rendered build output `dist/`. Excluded per spec §6: the change order itself,
`CHANGELOG-website-correction.md`, and this report.

Rendered text was extracted from `dist/**/*.html` with `<script>`, `<style>`,
`<svg>` and `<head>` stripped and tags removed, into a page-tagged text index
(referred to below as `rendered.txt`).

**Verdict summary**

| # | Test | Verdict |
|---|---|---|
| 1 | Banned-string sweep | PASS-WITH-NOTE |
| 2 | No numeric durations / no "fixed-price" | PASS |
| 3 | "free" scoped to audit / agent door / open source | PASS |
| 4 | Exactly one primary CTA label | PASS-WITH-NOTE |
| 5 | Open-source contract verbatim in 3 site places | PASS |
| 6 | No-tools card (Home) + rule block (Platform) | PASS |
| 7 | Builders door present; agents door absent | PASS-WITH-NOTE |
| 8 | "Read the technical overview" absent | PASS |
| 9 | No trust-badge row or certification claim | PASS |
| 10 | Redirects, blog URLs, nav and footer | PASS-WITH-NOTE |
| 11 | `/llms.txt` at root with the spec content | PASS-WITH-NOTE |
| 12 | Forms render, validate, route; thank-you carries calendar | PASS-WITH-NOTE |
| 13 | Design system untouched | PASS |

No test failed. Five carry sanctioned deviations, each recorded below.

---

## Test 1 — Repo-wide search returns zero hits for the banned strings

**Verdict: PASS-WITH-NOTE** (one sanctioned survival: `Nexus` as a redirect
source path, mandated by spec §5.1)

```
for t in 'Nexus' 'Text-to-Flow' 'Text to Flow' 'Request access' 'No credit card' \
         'AGENTIC GATEWAY' 'autopilot' 'disrupt' 'SOC 2' 'SOC2' 'certified' \
         '€' '3,500' 'base_url' 'frontier prices'; do
  grep -rniI -- "$t" src/ public/ astro.config.mjs; done
# same loop repeated over dist/
```

| String | src/ + public/ + astro.config.mjs | dist/ |
|---|---|---|
| Nexus | 1 | 1 |
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

**NOTE — the two `Nexus` hits.** `Nexus` survives ONLY as the source path of the
redirect that spec §5.1 mandates (`/product/nexus` → `/platform`), plus the
redirect stub that path generates. It appears in no page copy, no navigation, no
metadata, and no product naming.

```
astro.config.mjs:9:    "/product/nexus": "/platform/",

dist/product/nexus/index.html:
<!doctype html><title>Redirecting to: /platform/</title>
<meta http-equiv="refresh" content="0;url=/platform/">
<meta name="robots" content="noindex">
<link rel="canonical" href="https://tai42.ai/platform/">
```

The stub is `noindex` and canonicalises to `/platform/`. Documented in the
changelog (Step 1). Removing the string would mean deleting a redirect the spec
requires.

---

## Test 2 — No numeric durations in page copy; no "fixed-price"

**Verdict: PASS**

```
grep -rniIE '\b[0-9]+\s*(–|-)?\s*[0-9]*\s*(hour|hours|day|days|week|weeks)\b' src/ public/
→ 0 hits
grep -niIE '\b[0-9]+\s*(–|-)?\s*[0-9]*\s*(hour|hours|day|days|week|weeks)\b' rendered.txt
→ 0 hits
grep -rniI 'fixed-price\|fixed price' src/ public/ dist/
→ 0 hits
```

Sanity check that the words themselves do occur, un-numbered — the allowed
"weeks, not quarters" form:

```
rendered.txt:110  index.html   ... Live with real users in weeks, not quarters ...
rendered.txt:128  index.html   Speed with receipts. Weeks, not quarters — on our own platform ...
rendered.txt:139  method/      Weeks, not quarters, to a working system.
rendered.txt:141  method/      ... instrumented everywhere — weeks, not quarters.
```

---

## Test 3 — "free" appears only in the permitted three contexts

**Verdict: PASS**

```
grep -rniI 'free' src/ public/    # 6 hits
grep -niI 'free' rendered.txt     # 5 rendered locations
```

| Location | Context | Permitted category |
|---|---|---|
| `src/pages/method.astro:12` → `/method` step 1 | "The production audit (free, entry)." | production audit |
| `src/pages/platform.astro:188` → `/platform` | "The **production audit is free**: we assess your demo…" | production audit |
| `src/pages/platform.astro:209` → `/platform` | "Looking for something free to try? Our open-source runtime is public" | open source |
| `src/pages/open-source.astro:101` → `/open-source` | "Open (the runtime, free forever)" boundary table | open source |
| `src/pages/agents.astro:17` (meta) and `:33` (body) → `/agents` | "Free to connect and evaluate; machine-facing only." | agent door |

No occurrence outside those three categories. No instance of "free" attached to
human self-serve. (Home carries no "free" at all — the agents-door phrase
"connect free via our MCP gateway" is gated out; see Test 7.)

---

## Test 4 — Exactly one primary CTA label sitewide

**Verdict: PASS-WITH-NOTE**

```
grep -rniI 'Book a production audit' src/
grep -i 'Book a production audit' rendered.txt | cut -f1 | sort | uniq -c
grep -rniI 'Talk to us about a tenant' src/
grep -rniI 'Join the founding waitlist' src/
```

Primary CTA label — rendered instance count per route:

```
2 about/    2 agents/   2 builders/  2 company/careers/  2 contact/
3 index.html  3 method/  2 open-source/  2 platform/  2 privacy/
2 security/   2 terms/   3 thank-you/
```

The baseline 2 per page is the NavBar rendering the CTA twice (desktop bar +
mobile menu) — one visible control at any viewport. The three routes with 3 are
Home (hero CTA), Method (page-foot CTA) and the thank-you page (the calendar
link). Sources: `src/components/NavBar.astro:50,82`, `src/pages/index.astro:58`,
`src/pages/method.astro:129`, `src/pages/thank-you.astro:34`. No other primary
CTA label exists.

Secondary, page-specific actions stay on their own pages:

| Label | Source | Rendered on |
|---|---|---|
| Talk to us about a tenant | `src/pages/platform.astro:198` | `/platform` only (1×) |
| Join the founding waitlist (button) | `src/pages/builders.astro:131` | `/builders` only (1×) |

The lowercase phrase "join the founding waitlist" also appears inside body copy
on Home (doors line, §4.1) and Platform (honest line, §4.3) — spec-verbatim
prose, not a button.

The contact submit button reads "Book your production audit"
(`src/pages/contact.astro:103`, 1× on `/contact`) — the §4.6 verbatim submit
label, distinct from the primary CTA label.

**NOTE — CTA destination.** The primary CTA points at `CALENDAR_URL`, per the
spec's "day one" state (§4.1: "**[CALENDAR_URL]** on day one (existing booking
link); switch to `/contact` when the form flow is live"). All four primary CTA
anchors resolve to the calendar:

```
src/components/NavBar.astro:45,77   href={CALENDAR_URL}
src/pages/index.astro:53            href={CALENDAR_URL}
src/pages/method.astro:124          href={CALENDAR_URL}
```

The changelog's activation section documents the switch to `/contact/` once the
Web3Forms key exists and forms are live.

**Sub-floor note for the founder (not an acceptance failure).** Those same four
anchors carry `target="_blank" rel="noopener noreferrer"` — correct while the
href is the external Google Calendar page, but it should be dropped at the same
time the href is switched to the internal `/contact/`, since an internal page
should not open in a new tab. Locations: `src/components/NavBar.astro:46-47`
and `78-79`, `src/pages/index.astro:54-55`, `src/pages/method.astro:125-126`.
(The fifth `target="_blank"` anchor, `src/pages/thank-you.astro:30-31`, stays as
is — it is permanently the calendar link.)

---

## Test 5 — The one-sentence open-source contract, verbatim

**Verdict: PASS**

Whitespace-normalised exact-string count of the full sentence across every built
page (HTML stripped, entities unescaped, runs of whitespace collapsed):

```
CONTRACT = "tai42 builds and runs its business on this runtime; the code is open;
the company sells the hosted platform and enterprise layer on top — never a
different core."
```

| Page | Instances |
|---|---|
| `/open-source/` | 2 (page body + footer) |
| `/platform/` | 2 (honest-line block + footer) |
| every other built page (`/`, `/method/`, `/about/`, `/contact/`, `/builders/`, `/agents/`, `/thank-you/`, `/security/`, `/privacy/`, `/terms/`, `/company/careers/`) | 1 each (footer) |
| the 8 redirect stubs | 0 (stubs carry no chrome) |
| **Total** | **15** |

Source: `src/pages/open-source.astro`, `src/pages/platform.astro`,
`src/components/Footer.astro` (the footer instance, hence its presence on every
page). Em dash preserved; semicolons preserved.

The GitHub org README and docs-landing instances are outside this repo and are
delivered as written instructions in the changelog (Steps for §5.6 and §5.7).

---

## Test 6 — The no-tools card on Home and the rule block on Platform

**Verdict: PASS**

Home, third "Why it holds" card (`rendered.txt:128`, route `index.html`):

> **The AI can't touch your money.** In our platform the AI has no tools — it
> writes and interprets; it cannot fetch data, quote a price, or take an action.
> Bookings, payments, and prices run as deterministic steps the model never
> sees. A wrong sentence stays a wrong sentence; it can't become a wrong charge.

Platform block (`dist/platform/index.html`, normalised):

> **The rule that makes it safe** — The AI has no tools. Models write, interpret,
> and propose; only deterministic flows touch data, systems, and money. Routing
> between steps is a fixed rule, never the model's choice, and unsafe structure
> is rejected before it can run.

Both render verbatim per §4.1 and §4.3. The Platform block's trailing "Read the
technical overview" link is absent by gate — see Test 8.

---

## Test 7 — Builders door present; agents door and all `/agents` links absent

**Verdict: PASS-WITH-NOTE** (gate not cleared — the expected state)

```
grep -rn '/agents' src/ public/ | grep -v 'pages/agents.astro'   → 0 hits
grep -rn 'href="/agents' dist/                                    → 0 hits
grep -niI 'For AI agents' rendered.txt                            → 1 hit
```

- Home carries the builders door alone (`rendered.txt:116`, `index.html`):
  `For builders → join the founding waitlist` → `/builders/`.
- Footer "Doors" column contains exactly one entry, `For builders →`
  (`src/components/Footer.astro`), on every page.
- The only "For AI agents" string in the whole build is the H1 of `/agents`
  itself (`rendered.txt:30`).
- Platform's honest-line block omits the `/agents` clause.
- No `href="/agents"` exists anywhere in `dist/`.

**NOTE.** `/agents` is built (`dist/agents/index.html`) and reachable only by
typing the URL. It is linked from nowhere and carries
`<meta name="robots" content="noindex, nofollow">`. This is the spec §4.8 gated
state: the page is built but unpublished until `[MCP_ENDPOINT]`, `[TOOL_LIST]`
and `[TRIAL_KEY_INSTRUCTIONS]` are filled and the gateway endpoint answers. The
gate has not cleared. No sitemap is generated, so the page is not enumerated
anywhere either.

---

## Test 8 — The "Read the technical overview" link is absent

**Verdict: PASS**

```
grep -rniI 'technical overview\|WHITE_PAPER' src/ public/ dist/   → 0 hits
```

Neither the link text nor the `[WHITE_PAPER_URL]` placeholder appears anywhere —
omitted entirely per §4.3, pending engineering sign-off on the white paper. The
Platform "rule that makes it safe" block ends at "…rejected before it can run."
(see Test 6 excerpt).

---

## Test 9 — No trust-badge row or certification claim anywhere

**Verdict: PASS**

```
grep -rniIE 'SOC ?2|ISO ?27001|certif|compliance badge|trust badge|GDPR-certified|attestation|accredit|HIPAA|PCI DSS' src/ public/
→ 0 hits
```

The base site's badge components were deleted, not hidden — `git diff --name-status
fbb50ca..HEAD -- src/components/` shows `D src/components/SecurityStrip.astro`
and `D src/components/FinalCTA.astro`. `/security`, `/privacy` and `/terms` were
reviewed and rewritten to factual, unbadged statements (changelog Steps 15, 17,
18). No commented-out badge markup remains.

---

## Test 10 — Redirects, blog URLs, nav and footer

**Verdict: PASS-WITH-NOTE** (GitHub Pages cannot emit HTTP 301s — see note)

**NOTE — redirect mechanism.** The site deploys to GitHub Pages, which serves
static files only and cannot emit true HTTP 301 responses. Per the spec's
Appendix ruling 3, the redirects are Astro static `redirects` in
`astro.config.mjs`, which build to meta-refresh redirect pages with a canonical
link and `noindex`. Test 10 is reported against that reality: each redirect is
verified as its generated page in the build output.

```
grep -o 'url=[^"]*"' dist/<route>/index.html
grep -o '<link rel="canonical" href="[^"]*"' dist/<route>/index.html
```

All 8 redirect stubs verified in `dist/`:

| Source route | `meta refresh` target | Canonical | Source |
|---|---|---|---|
| `/product/babelfish/` | `/platform/` | `https://tai42.ai/platform/` | spec §5.1 |
| `/product/nexus/` | `/platform/` | `https://tai42.ai/platform/` | spec §5.1 |
| `/how-it-works/` | `/method/` | `https://tai42.ai/method/` | spec §5.1 |
| `/pricing/` | `/platform/` | `https://tai42.ai/platform/` | spec §5.1 |
| `/babelfish/` | `/platform/` | `https://tai42.ai/platform/` | Appendix 3 (real route) |
| `/babelfish/agentic-to-flow/` | `/platform/` | `https://tai42.ai/platform/` | Appendix 3 (kept) |
| `/company/about/` | `/about/` | `https://tai42.ai/about/` | Appendix 3 (real route) |
| `/company/contact/` | `/contact/` | `https://tai42.ai/contact/` | Appendix 3 (real route) |

The reverse entries `/about` → `/company/about` and `/contact` → `/company/contact`
were removed, per Appendix 3 — never both directions, no loops. Confirmed: the
`redirects` map in `astro.config.mjs` contains exactly the 8 rows above.

**Blog: no-op.** `grep -rniI 'blog' src/ public/ astro.config.mjs dist/` → 0 hits,
and `git ls-tree -r fbb50ca --name-only | grep -i blog` → 0 hits. `/blog` never
existed in this repo, so "unlink from nav/footer; keep URLs alive" has nothing to
act on. No blog URL was broken because none exists (Appendix 5 anticipates this).

**Full built route list** (13 pages + 8 redirect stubs):

```
/  /about/  /agents/  /builders/  /company/careers/  /contact/  /method/
/open-source/  /platform/  /privacy/  /security/  /terms/  /thank-you/
/babelfish/  /babelfish/agentic-to-flow/  /company/about/  /company/contact/
/how-it-works/  /pricing/  /product/babelfish/  /product/nexus/
```

**Navigation** — extracted from the rendered `<nav>` of `dist/index.html`:

```
links: / · /method/ · /platform/ · /open-source/ · /about/ · /contact/
labels: Home · Method · Platform · Open Source · About · Contact
CTA:   "Book a production audit" → CALENDAR_URL
```

(The set appears twice — desktop bar and mobile menu.) Matches §3 exactly.

**Footer** — extracted from the rendered `<footer>` of `dist/index.html`:

```
Site:   / · /method/ · /platform/ · /open-source/ · /about/ · /contact/
Doors:  /builders/          ("For builders →"; no agents entry — gate not cleared)
Legal:  /security/ · /privacy/ · /terms/
Contract sentence: present verbatim (Test 5)
Footer line: "tai42 — we take AI from demo to production."  → present
```

Matches §3 exactly, including the instruction to omit the `/agents` link entirely
while the gate is closed. `/company/careers` stays unlinked from nav and footer
and carries `noindex` (Appendix 6 keeps the page; changelog Steps 15 and 18
record the decision).

---

## Test 11 — `/llms.txt` served at root with the spec content

**Verdict: PASS-WITH-NOTE** (one ruled omission: the `## For agents` heading)

```
ls -la dist/llms.txt          → present, 529 bytes
diff public/llms.txt dist/llms.txt → IDENTICAL (copied verbatim to the site root)
diff <spec §5.5 text> public/llms.txt
```

Diff against the spec block — the only difference:

```
11,12d10
< ## For agents
< - MCP gateway: [MCP_ENDPOINT — omit this line until live]
```

Lines 1-10 (the `# tai42` title, the `>` summary, the `## Pages` heading and all
seven page/docs entries including `- Docs: [DOCS_URL]`) match the spec byte for
byte.

**NOTE.** The spec itself instructs "omit this line until live" for the MCP
gateway entry, and the gate has not cleared. The `## For agents` heading was
omitted along with it, since a section heading with no content under it is a
dangling heading in a machine-readable index. This is the ruled omission,
documented in the changelog (Step 14). Both lines are restored together when the
gateway endpoint answers.

---

## Test 12 — Forms render, validate, and route; thank-you carries the calendar

**Verdict: PASS-WITH-NOTE** (destination address is configured at the Web3Forms
key, not in code — see note)

**Backend.** Per Appendix ruling 1: Web3Forms, plain HTML `<form>` POST, no npm
dependency added (Test 13 confirms `package.json` is unchanged).

```
grep -o 'action="https://api.web3forms.com/submit"' dist/contact/index.html dist/builders/index.html
dist/contact/index.html:action="https://api.web3forms.com/submit"
dist/builders/index.html:action="https://api.web3forms.com/submit"
```

**Contact form** (`/contact`, `src/pages/contact.astro`) — three questions plus
name, company, email, all `required`:

```
grep -o ' required' dist/contact/index.html | wc -l   → 6
```

Fields: "Do you have a working demo today?" (textarea) · "What breaks, or what's
stopping you from putting it in front of real users?" (textarea) · "How will you
measure success in production?" (textarea) · name (`type=text`) · company
(`type=text`) · email (`type=email`, browser-validated). Submit button label:
"Book your production audit".

**Builders form** (`/builders`, `src/pages/builders.astro`) — company · what you
deliver today (`<select>`, agency / dev shop / service firm / operator) ·
roughly how many clients · email, all `required`:

```
grep -o ' required' dist/builders/index.html | wc -l  → 4
```

Submit button label: "Join the founding waitlist".

**Hidden plumbing, both forms** (rendered):

```
name="access_key" value="[WEB3FORMS_ACCESS_KEY]"
name="redirect"   value="https://tai42.ai/thank-you/?page=contact"   (contact)
name="redirect"   value="https://tai42.ai/thank-you/?page=builders"  (builders)
name="source"     value=""
name="botcheck"   (Web3Forms honeypot, display:none, tabindex=-1, aria-hidden)
```

`src/components/FormSourceScript.astro` fills the hidden `source` input from
UTM params → cross-host referrer → `"direct"`, and appends
`&source=<encoded>` to the redirect value (derived from `defaultValue`, so a
bfcache re-run cannot double-append). `/thank-you` reads `page` and `source`
from the query string and fires exactly one `qualified_form_submission` event
via `window.plausible`, deduped through `sessionStorage`.

**Thank-you page carries CALENDAR_URL:**

```
grep -o 'href="https://calendar.google.com[^"]*' dist/thank-you/index.html
→ 3 hits: the page CTA (src/pages/thank-you.astro:29) + the two NavBar instances
```

`CALENDAR_URL` is the repo's existing booking link, resolved per Appendix ruling 4
and now centralised in `src/consts.ts`.

**NOTE — where the destination address lives.** Web3Forms delivers to the address
the access key was created for; there is no recipient field in the markup. So
`FOUNDER_EMAIL` (`balin.miki@tai42.ai`, resolved by Appendix ruling 1) is **not**
in the code — it is a configuration step recorded in the changelog's activation
instructions ("Create a Web3Forms access key for **balin.miki@tai42.ai**"). The
access key itself remains the visible placeholder `[WEB3FORMS_ACCESS_KEY]`,
rendered both as the hidden input value and as a visible dashed
`<Placeholder>` chip beneath each submit button, so the unconfigured state cannot
ship unnoticed. **Until the founder creates that key, both forms POST with an
invalid access key and will not deliver.** This is flagged, not hidden.

(The one `mailto:balin.miki@tai42.ai` in the codebase is a deliberate contact link
in `/terms` §8, unrelated to form routing — see changelog Step 17/18.)

---

## Test 13 — Existing design system untouched

**Verdict: PASS**

**No dependency change:**

```
git diff fbb50ca..HEAD -- package.json package-lock.json   → empty
```

No new npm package of any kind — no form library, no animation library, no icon
package. Fonts remain the two pre-existing `@fontsource-variable` imports (Inter,
Geist Mono) in `src/layouts/BaseLayout.astro`; no `font-family` was introduced
anywhere else.

**No new colors:**

```
git diff --quiet fbb50ca..HEAD -- src/styles/globals.css   → UNCHANGED
```

The design tokens file is byte-identical to the base commit. The only hex values
outside it are in the Platform page's inline diagram SVG — `#DC143C`, `#10B981`,
`#E5E7EB`, `#F9FAFB` — which is the exact same set carried by the base
`/babelfish` page the diagram was moved from:

```
git show fbb50ca:src/pages/babelfish/index.astro | grep -oE '#[0-9A-Fa-f]{6}' | sort -u
→ #10B981 #DC143C #E5E7EB #F9FAFB
grep -oE '#[0-9A-Fa-f]{6}' src/pages/platform.astro | sort -u
→ #10B981 #DC143C #E5E7EB #F9FAFB
```

**Components created — two, both minimal and in-style:**

| Component | Purpose |
|---|---|
| `src/components/Placeholder.astro` | Visible dashed-border chip marking an unfilled founder value. Uses only existing tokens (`gray-300`, `gray-50`, `charcoal/50`, the site mono face). Nothing else fit — the requirement is that placeholders be visible, never invented. |
| `src/components/FormSourceScript.astro` | Inline `<script>` that stamps the `source` value onto the Web3Forms hidden fields. No markup, no styling. |

**Components deleted (removed, not hidden):** `src/components/FinalCTA.astro`,
`src/components/SecurityStrip.astro`.

**Layout change** — `src/layouts/BaseLayout.astro`, +18/-2 lines, all of it
non-visual: the default title/description swapped to the corrected copy, an
optional `noindex` prop, `og:image:alt` / `twitter:image:alt`, and the Plausible
script tag plus its event-queue stub (Appendix ruling 2). No visual change.

---

## Placeholder list

Every `[…]` still open, with its exact location. None was ever filled with an
invented value.

| Placeholder | Exact locations | State |
|---|---|---|
| `WEB3FORMS_ACCESS_KEY` | `src/pages/contact.astro:15` (const) → rendered as hidden `access_key` input + visible chip at `:107`; `src/pages/builders.astro:12` (const) → hidden input + visible chip at `:135`. Renders 4× in `dist/` (2 per form page). | **Open — blocks both forms.** Founder creates the key for `balin.miki@tai42.ai`. |
| `DOCS_URL` | `src/pages/open-source.astro:43` (body) and `:81` (links row); `src/pages/agents.astro:55`; `public/llms.txt:10` → `dist/llms.txt:10`. Renders 4× in `dist/`. | Open. `docs.tai42.ai` once the CNAME is live; `tai42.mintlify.app` until then. |
| `GITHUB_ORG_URL` | `src/pages/open-source.astro:73` (org link) and `:77` (Discussions link, note "Discussions tab of the org"). Renders 2× in `dist/`. | Open. |
| `OPEN_COMMERCIAL_BOUNDARY` | `src/pages/open-source.astro:93`, note "founder confirms before publish". The provisional two-column boundary table from §4.4 is built beneath it. | Open — founder confirms the line before publish. |
| `FOUNDER_CREDIBILITY_LINE` | `src/pages/about.astro:48`, rendered as "[FOUNDER_CREDIBILITY_LINE — founder supplies; do not write one]". | Open — gated on the founder. Deliberately not written. |
| `TEAM_AND_AGENT_ROSTER` | `src/pages/about.astro:66`, rendered as "[TEAM_AND_AGENT_ROSTER — founder supplies; list only agents that run today]". Component built, roster empty. | Open — gated on the founder. |
| `MCP_ENDPOINT` | `src/pages/agents.astro:40`. Also the omitted `/llms.txt` line (Test 11). | Open — gate: the gateway endpoint responds. |
| `TOOL_LIST` | `src/pages/agents.astro:44`. | Open — same gate. |
| `TRIAL_KEY_INSTRUCTIONS` | `src/pages/agents.astro:48`. | Open — same gate. |
| `WHITE_PAPER_URL` | **No location — absent from the codebase by design.** `grep -rniI 'WHITE_PAPER\|technical overview' src/ public/ dist/` → 0 hits. | Gated-absent. §4.3 says omit the link entirely until engineering signs off; when it does, the link is added to the Platform "rule that makes it safe" block. |

**Resolved — no longer placeholders:**

| Value | Resolution | Where it lives |
|---|---|---|
| `CALENDAR_URL` | The repo's existing booking link (Appendix ruling 4) — the Google Calendar appointment schedule previously in `FinalCTA.astro`. | `src/consts.ts:4`, imported by `NavBar.astro`, `index.astro`, `method.astro`, `thank-you.astro`. |
| `FOUNDER_EMAIL` | `balin.miki@tai42.ai` (Appendix ruling 1). | **Not in code** — Web3Forms delivers to the address its access key was created for, so this is a configuration step, recorded in the changelog's activation instructions. |

---

## Deliverables

- **Branch `website-correction-v1.5`** — 20 commits on base `fbb50ca`, HEAD
  `bf43e0c`. Steps 1-16 implement the correction; four further commits are
  cold-review fix waves.
- **`CHANGELOG-website-correction.md`** — maintained per step, including the
  placeholder list, the gate results, the activation instructions (Web3Forms key
  creation for `balin.miki@tai42.ai`, the Plausible site, the CTA switch from
  `CALENDAR_URL` to `/contact/`), and the two outside-repo work items: the docs
  CNAME + landing-line change (§5.6) and the GitHub org README opening +
  Discussions (§5.7).
- **`ACCEPTANCE-REPORT.md`** — this file.
- **Cold review completed** — four fix waves (privacy/terms factual accuracy and
  careers noindex; legal truth scoping and trailing-slash links; runtime
  vocabulary unification and claim scoping; careers positioning, spacing, and
  changelog completeness). The final holistic pass came back clean.
- **NOT deployed.** Publishing is blocked on three founder/counsel actions, per
  the top block of `CHANGELOG-website-correction.md`:
  1. the **founder voice pass** over the new copy;
  2. **filling the open placeholders** above — `WEB3FORMS_ACCESS_KEY` in
     particular, without which neither form delivers;
  3. **legal sign-off** — `/privacy`, `/terms` and `/security` were rewritten by
     engineering for plain-language accuracy, which is not approved legal copy;
     counsel must read all three and add the controller identity, retention
     statement, and data-subject-rights section that `/privacy` still lacks.

  The two gated items (`/agents` and the "Read the technical overview" link) stay
  unlinked and absent respectively until their gates clear.
