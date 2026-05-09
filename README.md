# The DevOps Field Manual

A practical, opinionated guide to standing up a DevOps organization inside a real business — from a first Git repo to a 200-engineer platform team. Three audience tracks (Generic, Cloud-native SaaS, Enterprise/regulated), each walking the same twelve domains in the same order.

The site is built with [Astro](https://astro.build) and deploys as a static site to GitHub Pages.

## What's in here

```
content/                  # 41 markdown files — the actual guide
  shared/                 # landing copy, glossary, maturity model, choose-your-track, contributing
  generic/                # 12 sections — industry-agnostic playbook
  saas/                   # 12 sections — cloud-native SaaS playbook
  enterprise/             # 12 sections — regulated / compliance-aware playbook
src/
  pages/                  # Astro routes (landing, [track]/, [track]/[section], glossary, …)
  layouts/                # BaseLayout, DocsLayout, PageLayout
  components/             # Nav, Sidebar, Toc, CrossTrack, EditionMark, …
  lib/                    # tracks metadata + rehype plugin
  styles/global.css       # design tokens + prose styling
.github/workflows/        # GitHub Pages deployment workflow
```

The 12 canonical domains: overview, team structure, source control, CI/CD, IaC, cloud platform, observability, incident response, security, docs & knowledge, cost, and a 90-day roadmap. Each track answers the same questions for a different business context.

## Local development

```bash
npm install
npm run dev          # starts http://127.0.0.1:4321
npm run build        # builds dist/ + Pagefind search index
npm run preview      # serves the built site
```

`npm run build` runs `astro build` followed by `pagefind --site dist` to generate a client-side search index. The dev server does not include the search index — run `build` to test search.

### Editing content

The 41 markdown files under `content/` are the source of truth. They use this frontmatter shape:

```yaml
---
title: CI/CD
track: saas               # generic | saas | enterprise (track sections only)
order: 3                  # 0–11 (track sections only)
summary: One-line summary.
---
```

Every track section is structured around the same seven H2 sections:

1. Why it matters
2. What "good" looks like
3. Recommended default
4. Alternatives — written as a `> **Alternatives:**` blockquote, transformed into a side-rule callout at build time.
5. Compliance mapping — enterprise track only.
6. Common pitfalls
7. Quick checklist — task-list checkboxes (`- [ ]`) styled as a "field log" with localStorage-backed state.

A small rehype plugin (`src/lib/rehype-content.ts`) does the structural transforms (Alternatives callout, Quick-checklist class). Layout-level concerns (the title H1, edition mark, sidebar, in-page TOC, cross-track marginalia, prev/next) live in `src/layouts/DocsLayout.astro`.

## Deploying to GitHub Pages

A workflow at `.github/workflows/pages.yml` builds and deploys on every push to `main` (or `master`). To enable it:

1. Push this repository to GitHub.
2. In repository **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The next push to `main` triggers the workflow. Once it finishes, your site is live at:
   - `https://<user>.github.io/<repo>/` for a project page, or
   - `https://<user>.github.io/` if the repo is named `<user>.github.io`.

The workflow auto-detects which case applies and configures the `SITE` / `BASE` build env vars accordingly. No manual edits needed for most cases. If you want to override (custom domain, etc.), edit `astro.config.mjs` or set `SITE` / `BASE` directly.

### Custom domain

1. Add a `CNAME` file to `public/` containing your domain (e.g. `manual.example.com`).
2. In GitHub Pages settings, enter the same domain.
3. Set `SITE=https://manual.example.com` and `BASE=/` (e.g. as workflow env, or in `astro.config.mjs`).

## Editing for your business

This guide is written to be forked. If you want a private internal version:

1. Fork the repo (or clone and push to your own).
2. Edit `content/` — the markdown is plain English; replace recommendations, callouts, and checklists to match your stack and policies.
3. Adjust `src/lib/tracks.ts` if you want to rename or add tracks.
4. Update brand & accents in `src/styles/global.css`:
   - `--accent` (house oxide-rust)
   - `--track-generic` / `--track-saas` / `--track-enterprise`
5. Replace `public/favicon.svg` and the brand-mark text in `src/components/Nav.astro`.

## Stack

- **Astro 5** — static-site generation, content collections, minimal client JS.
- **Fraunces** (display) + **IBM Plex Sans** (body) + **IBM Plex Mono** (code & metadata), self-hosted via `@fontsource`.
- **Pagefind** — client-side search, generated at build time.
- **Shiki** — syntax highlighting (built into Astro).
- **rehype-slug** + **rehype-autolink-headings** — `§` permalinks on every heading.

## License

CC BY-SA 4.0 unless your fork says otherwise. Compliance and control-mapping content is illustrative — verify with a qualified subject-matter expert before relying on it for audit purposes.
