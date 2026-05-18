---
title: Source Control
track: saas
order: 2
summary: GitHub-first, trunk-based development with short-lived branches, fast PRs, and Conventional Commits.
---

# Source Control

## Why it matters

Branching strategy is the load-bearing decision for your delivery flow. *Accelerate* and the State of DevOps reports are unambiguous: trunk-based development with short-lived branches correlates strongly with elite DORA performance. Long-lived branches and GitFlow are a velocity tax dressed up as discipline.

## What "good" looks like

- Trunk (`main`) is always shippable; CI is green or nobody merges
- Branch lifetime: hours, not days. Median PR < 200 lines changed.
- Time-to-merge for a typical PR: < 24 hours, ideally < 4 hours
- Every PR runs full CI (lint, type-check, unit, integration) and produces a preview environment
- One required reviewer; CODEOWNERS handles routing automatically
- Conventional Commits drive changelogs and (optionally) semantic versioning
- Force-push to `main` is impossible; protected branches with required status checks

## Recommended default

**GitHub** for everything. Integrated identity, Actions, Advanced Security, and Projects mean one auth model and one place to wire everything together — the integration savings show up in every PR.

**Branching: trunk-based.** Feature branches off `main`, merged via squash PR. No `develop`, no `release/*` branches. Use feature flags (see [CI/CD](./03-cicd.md)) for in-flight work.

**Repo strategy: start polyrepo, graduate selectively to monorepo.**
- 1–10 services: polyrepo. Low coordination cost, clear ownership.
- 10–30 services with shared libraries causing pain: extract a small monorepo for libs and platform code; keep service repos separate.
- 30+ services with heavy cross-cutting changes: consider a Turborepo / Nx / Bazel monorepo. The tooling investment is non-trivial — don't do it prematurely.

**PR norms** (codify in `CONTRIBUTING.md` and a PR template):
- Title in Conventional Commits (`feat(billing): add proration`)
- One logical change per PR; refactors land separately
- PR description answers: *what*, *why*, *how to verify*, *rollback plan*
- Draft PRs allowed and encouraged for early feedback
- Required: green CI, one approval, signed commits (DCO or GPG)

**Required GitHub config:**
- Branch protection on `main`: require PR, required checks, dismiss stale reviews, require linear history
- CODEOWNERS file mapping paths to teams
- Auto-merge enabled for green PRs
- Dependabot + Renovate for dependency updates

> **Alternatives:**
> - **GitLab**: pick if you want CI/CD, registry, and SCA in one tool, or you need self-hosted for compliance.
> - **Bitbucket + Jira**: pick only if Atlassian lock-in is non-negotiable; otherwise GitHub's network effects win.
> - **Sapling / Phabricator-style stacked diffs**: pick at 50+ engineers when stacked changes become a daily workflow; Graphite is the easiest on-ramp on GitHub.

## Common pitfalls

- **Long-lived feature branches** that diverge for weeks; merges become integration nightmares
- **Big-bang PRs** of 2,000+ lines that nobody really reviews
- **Premature monorepo** — you have taken on Bazel before you have a Bazel-sized problem
- **No CODEOWNERS** — review requests pile on the same two senior engineers
- **Unprotected `main`** — force-pushes, direct commits, or hotfixes that skip CI
- **Conventional Commits enforced as theater** — bot rejects PRs but no one reads the changelog

## Quick checklist

- [ ] `main` is protected with required status checks and PR review
- [ ] Branch protection enforces linear history (squash or rebase merges only)
- [ ] CODEOWNERS file routes reviews to owning teams
- [ ] PR template with what/why/verify/rollback
- [ ] Conventional Commits enforced in CI (commitlint or similar)
- [ ] Dependabot or Renovate enabled for all repos
- [ ] PR median lifetime measured and tracked < 24h
- [ ] Documented monorepo-vs-polyrepo decision rubric
- [ ] Auto-merge enabled for green low-risk PRs
