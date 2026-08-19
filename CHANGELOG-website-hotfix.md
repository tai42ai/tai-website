# CHANGELOG — website hotfix 1

Branch: `website-hotfix-1`, based on live `main` (e821a2a). Implements the
post-launch hotfix: fill the values that resolved, hide (never delete) the
sections that are still unconfirmed, and stop the known 404s. No new
dependencies, colors, fonts, or components.

Not deployed from here. Never pushed by the implementer.

## Resolved values used in this hotfix

- `DOCS_HOST` = `https://docs.tai42.ai` — **verified live before use**: the host
  returns 200, and both deep paths spot-checked (`/getting-started/installation`
  and `/concepts/layering`) return 200. The CNAME is live, so no
  "domain flip pending" note is needed anywhere on the site.
- GitHub org = `https://github.com/tai42ai`
- GitHub Discussions = `https://github.com/orgs/tai42ai/discussions`

## Parked — NOT touched by this hotfix (founder values still pending)

1. **Web3Forms access key wiring** in `/contact` and `/builders`. Both pages
   still carry `const WEB3FORMS_ACCESS_KEY = "[WEB3FORMS_ACCESS_KEY]"` and a
   visible `<Placeholder label="WEB3FORMS_ACCESS_KEY" />` chip. Forms do not
   submit successfully until the founder supplies the key.
2. **`/platform` visual-builder mock replacement.** The mock stays exactly as
   built until the founder supplies the real asset.

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
