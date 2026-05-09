---
title: Contributing
type: meta
summary: How to suggest edits, propose new content, or fork the guide for your business.
---

This guide is open source and improves through use. Pull requests are welcome — small typo fixes, clarifications, and entirely new sections all help. The bar is "would a practitioner trust this?", not "is the prose perfect?".

## Suggest an edit

Every page has an "Edit this page" link in the footer that points to the markdown source on GitHub. Click it, edit in place, and GitHub will fork the repo and open a pull request for you. For anything larger than a paragraph, clone the repo locally and run the site so you can preview your changes. Keep PRs scoped to one section; reviewers will ask you to split mixed PRs.

## Propose a section

If you want to add a new section, page, or track, **open an issue first**. The structure of the site (three tracks, twelve domains, shared content) is deliberately constrained, and new top-level content usually belongs inside an existing domain rather than alongside it. Opening an issue first saves you the work of writing a page that gets rejected on shape rather than substance.

## Fork for your business

Companies are encouraged to fork this guide and adapt it as internal documentation. That is the highest-value use case. A few notes:

- Treat the content as **CC BY-SA** unless your fork says otherwise — verify against the `LICENSE` file in the repo, which is the source of truth.
- If you redistribute publicly, keep an attribution link to the upstream guide.
- If you make improvements that are not company-specific, please consider opening a PR back. Sanitized contributions from real organizations are the best content this guide can carry.

## Style notes

- **File naming** — kebab-case markdown files (`incident-response.md`), one page per file, no spaces.
- **Frontmatter** — every page has `title`, `type`, and `summary` keys. The `type` controls layout selection; valid values live in the theme config.
- **Hybrid tooling stance** — name specific tools when it sharpens the advice (Terraform, GitHub Actions, Datadog), but flag where the principle is tool-agnostic. Avoid vendor evangelism.
- **Voice** — second person ("you"), active voice, present tense. Mild opinions are good; hedging on every claim is not.
- **Length** — pages should be readable in under ten minutes. If a page is longer, split it.
- **No emojis, no marketing language, no exclamation points** in body text.
