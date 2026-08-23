# HOTFIX-3-REPORT — website-rename-babeldag

Branch `website-rename-babeldag` · base `3205b76` (live `main`) · pure rename pass:
`BabelFish` → `BabelDag`, nothing else. Verified 2026-08-23 against a fresh build
(`npx astro check` 0 errors / 0 warnings / 0 hints; `npm run build` 12 pages, green).

**Not deployed.** The founder reads this report and gives the word.

## What was found and replaced

The rendered surfaces (`src/` + `public/`) contained exactly **24 occurrences of `BabelFish`**; the repo-root changelogs/reports hold the rest as historical record, untouched (no `Babelfish`,
`babelfish`, or `BABELFISH` variants existed in any rendered surface), all replaced
case-preservingly with `BabelDag`. **Files touched (9):**

| File | Occurrences |
| --- | --- |
| `src/pages/terms.astro` | 8 (meta description, §1, §3 heading + body, §4, §5, Trademarks, section comment) |
| `src/pages/security.astro` | 4 (meta description, hero paragraph, tenant block, deterministic block) |
| `src/pages/platform.astro` | 4 (title prop, H1, "What it runs", card 3) |
| `src/pages/company/careers.astro` | 2 (meta description + body) |
| `public/llms.txt` | 2 (summary line + Platform page line) |
| `src/pages/index.astro` | 1 ("Three things, one company" block) |
| `src/pages/about.astro` | 1 (platform layer card) |
| `src/pages/open-source.astro` | 1 (hidden boundary table, commercial column) |
| `src/pages/privacy.astro` | 1 (runtime/platform scoping section) |

## Deliberately untouched (per instruction 2)

- `astro.config.mjs` legacy redirect **URL paths**: `/product/babelfish`, `/babelfish`,
  `/babelfish/agentic-to-flow` (all → `/platform/`). These are URLs, not copy, and
  removing them would break inbound links from the old site generation.
- `public/logos/babel-fish-logo.png` — an asset filename (URL); **referenced by nothing**
  (`grep -rn 'babel-fish-logo' src/` → 0), so it never renders anywhere. Candidate for
  deletion in a future housekeeping pass if desired.
- Package names, code identifiers, changelogs, and this report.

## Verification

1. **Case-insensitive `babelfish` in rendered output:** the only hits in `dist/` are the
   three legacy redirect stubs' own URL paths inside Astro's generated body text
   ("Redirecting from `/babelfish/` to `/platform/`") — URL strings, same sanctioned
   class as the standing `/product/nexus` exclusion. **Zero hits in any page copy, title,
   meta, alt text, or `llms.txt`.** `src/` + `public/`: zero outside `astro.config.mjs`.
2. **`BabelDag` present in every required place** (fresh build):
   - `/platform` H1: `BabelDag — one engine for business functions in production.` and
     `<title>`/`og:title`/`twitter:title`: `…— tai42` variant — **6 rendered hits on the page** (three title metas + H1 + "A BabelDag application" + card 3)
   - Home "Three things, one company" block: `BabelDag, the platform built on that
     runtime…` — **1 hit**
   - `/about` platform paragraph (`BabelDag, the platform.` card) — **1 hit**
   - `/terms` §3 (+ §1, §4, §5, Trademarks) — **10 rendered hits** (three description metas + 6 body + a preserved section comment)
   - `/security` deterministic block ("BabelDag runs explicit, deterministic flows…") —
     **6 rendered hits** (three description metas + 3 body)
   - `llms.txt` — **2 hits** (summary + `- Platform (BabelDag): https://tai42.ai/platform`)
3. **Nothing else changed:** the branch is one commit; `git show --stat` lists exactly the
   9 files above; no structural, copy, class, or config change beyond the token swap.
   `package.json`, redirects, and all other pages byte-identical to `main`.
4. Standing gates re-run and clean: bracket-placeholder regex 0 · sentence-initial-tai42
   casing regex 0 · `" - "` 0 rendered · contract sentence ×3 intact (now "…sells the
   hosted platform and enterprise layer…" — unchanged, it never named the product).

## Note for the founder

The **trademark clause in `/terms` §8 now claims "BabelDag" as a mark** — if the rename
reflects a real product renaming, no action; if BabelDag is provisional, remember the
terms page asserts it publicly on deploy. GitHub-side surfaces (org README, docs) that
mention BabelFish are outside this repo and need the same rename — the outside-repo
instruction set in `CHANGELOG-website-correction.md` §§docs/README should be executed
with "BabelDag" when you run it.
