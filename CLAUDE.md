# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project shape

Astro 5 static site that publishes a multi-track DevOps playbook ("The DevOps Field Manual"). The 41 markdown files under `content/` are the actual product — `src/` is a render layer over them. Editing prose is most of the work in this repo; the framework should rarely need to change.

The site has three audience tracks (`generic`, `saas`, `enterprise`), each walking the same twelve canonical sections (`00-overview` through `11-roadmap-90day`). A reader stays in one track; the right gutter offers a "View this section in [other track]" affordance that depends on **parallel structure being preserved** — see "Track invariants" below.

## Common commands

```bash
npm run dev            # http://127.0.0.1:4321 — fast, no search index
npm run build          # astro build && pagefind --site dist
npm run preview        # serve the built dist
npm run check          # astro check (typescript + content schema)
```

`npm run build` is the one that matters: Pagefind only runs in build, so search is broken in `dev` (the search modal handles this gracefully with a "run npm run build" message). If you only run `astro build`, search is missing — always run the npm script.

## Content collections (non-obvious)

Defined in `src/content.config.ts`. The two collections use the `glob` loader pointed **outside `src/`** at the project-root `content/` folder, so a tech-writer agent can edit prose without touching framework code:

- `tracks` — base `./content`, pattern `{generic,saas,enterprise}/*.md`. Entry IDs are `track/section` (e.g. `saas/03-cicd`). Iterate with `getCollection('tracks')` and split `entry.id` on `/` to get track + section slug.
- `shared` — base `./content/shared`, pattern `*.md`. Entry IDs are bare basenames (e.g. `glossary`). Look up with `getEntry('shared', 'glossary')`. The flattened base is intentional — without it, `getEntry('shared', 'glossary')` would have to be `getEntry('shared', 'shared/glossary')`.

**Frontmatter gotcha**: YAML treats `: ` (colon-space) in unquoted scalars as a mapping separator. Any `summary:` value containing `: ` *must* be wrapped in double quotes — the build will fail otherwise. Several files demonstrate this pattern.

## Track invariants

The canonical 12 sections live in `src/lib/tracks.ts` (`SECTION_KEYS`). Layouts assume:

- All three tracks contain the same 12 `order` values (0–11).
- Sections at the same `order` across tracks cover the same domain (e.g. `order: 3` is always CI/CD).
- Filename prefix `NN-` matches the `order` value.

Cross-track navigation in `src/pages/[track]/[...section].astro` matches by `data.order`, so breaking parity silently breaks the right-gutter "In other tracks" links. Same for Prev/Next.

## The rehype plugin and the H1 trap

`src/lib/rehype-content.ts` runs on every markdown render and does two structural transforms:

- Tags `> **Alternatives:**` blockquotes with `data-callout="alternatives"` (CSS in `global.css` turns this into the side-rule callout with the `ALT` stamp).
- Adds `class="quick-checklist"` to the `<ul>` after `<h2 id="quick-checklist">` (CSS turns this into the FIELD LOG box; `BaseLayout.astro` has the localStorage hydration script).

**About 24 of 36 track section files open with `# <Title>` in the markdown body**, which would duplicate the H1 the layout already renders from frontmatter. *Do not try to strip this with a rehype plugin.* Earlier attempts hit Astro's content-pipeline caching and didn't take effect in dev mode even after restart and `.astro/` clears, despite working in static builds. The duplicate H1 is hidden by CSS instead:

```css
.docs-article .md-body > h1:first-child { display: none; }
```

The slot in `DocsLayout.astro` is wrapped in `<div class="md-body">` to support this selector. If you change the slot wrapper, update the CSS rule too.

## Track accent system

Three accent colors are defined in `global.css` as `--track-generic`, `--track-saas`, `--track-enterprise` (light + dark variants). The `[data-track="..."]` attribute selector on `<body>` (set by `BaseLayout.astro` from the layout's `track` prop) overrides `--accent` and `--accent-soft` for that page. Edition marks, drop caps, sidebar dots, sidebar progress bars, and section rules all consume `--accent`, so they automatically tint to match the track without per-component logic.

## Pagefind integration

Pagefind only indexes elements with `data-pagefind-body`. That attribute lives on:

- `<article class="prose docs-article">` in `DocsLayout.astro`
- `<article class={`page-${variant}`}>` in `PageLayout.astro`

If you create a new top-level layout or page that should be searchable, add the attribute. Search UI is mounted via dynamic import in `BaseLayout.astro` — it loads `${BASE_URL}/pagefind/pagefind-ui.js` only when the modal is opened (or the `/search/` page is visited).

## Deploy

`.github/workflows/pages.yml` reads `GITHUB_REPOSITORY` to decide between user-page (`<owner>.github.io`) and project-page modes, and exports `SITE` and `BASE` for the build. `astro.config.mjs` reads those env vars. If you need a custom domain or a different base path, set `SITE`/`BASE` directly rather than editing the workflow's logic.

The workflow uses `actions/deploy-pages@v4` and the standard Pages permissions block — pushing to `main` or `master` triggers it. The first deploy requires the user to set **Settings → Pages → Source: GitHub Actions** in the repo.

## localStorage keys

The site is fully static but reads/writes a few localStorage keys. Don't change these casually — readers tick checklists across visits.

| Key | Purpose |
| --- | --- |
| `dofm:theme` | `'light'` / `'dark'` — pre-paint script reads this in `BaseLayout.astro` to avoid theme flash. |
| `dofm:compliance-dismissed` | `'1'` once the enterprise compliance banner is dismissed. Banner only appears on enterprise pages. |
| `dofm:check:<pathname>:<listIdx>:<itemIdx>` | Quick-checklist checkbox state per page. |

## Voice and content conventions

The guide is written as if a senior staff engineer is talking over coffee — concrete, opinionated, anti-marketing. When editing or generating new track content, preserve:

- The seven-H2 structure: Why it matters / What "good" looks like / Recommended default / Alternatives / [Compliance mapping — enterprise only] / Common pitfalls / Quick checklist.
- The hybrid tooling stance: name a recommended default per category, list 2–3 alternatives in a `> **Alternatives:**` callout with "pick X when…" guidance.
- No emojis, no marketing voice, no "Welcome!" intros. Drop straight into the substance.

The enterprise track's compliance-mapping tables have known SME-review caveats (recorded in commit history). Don't tighten control-ID claims without verifying — say "supports control X," not "is X-certified."
