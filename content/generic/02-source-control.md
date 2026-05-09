---
title: Source Control
track: generic
order: 2
summary: VCS choice, branching strategy, code review norms, and the monorepo vs polyrepo decision.
---

## Why it matters

Source control is the substrate everything else sits on: CI, deploys, audit, code review, security scanning, even incident archaeology. Boring choices here pay off for a decade. Clever choices here cost you for a decade.

## What "good" looks like

- One VCS, one identity provider, one canonical source of truth per repo.
- Trunk-based or short-lived branches; nothing lives unmerged for more than a few days.
- Every change to production goes through a pull request with at least one reviewer.
- Required status checks block merges that fail tests, lint, or security scans.
- Branch protection on default branches; force-push and direct commits disabled.
- Repos have a clear naming convention, a CODEOWNERS file, and a README that explains how to run the thing.

## Recommended default

**GitHub** with a **trunk-based development** model and **short-lived feature branches**.

Concrete setup:

- **Default branch:** `main`. Protected. No direct pushes. Require PR + 1 reviewer minimum (2 for high-risk repos).
- **Branch naming:** `<author>/<short-description>` or `<ticket-id>/<short-description>`. Pick one.
- **Merge strategy:** **Squash merge** by default. Keeps `main` history linear and readable; preserves detail in the PR itself.
- **CODEOWNERS:** required for every production repo. Drives review routing and downstream ownership audits.
- **Required checks:** unit tests, linter, dependency scan, SAST. Configured as GitHub branch protection rules.
- **Conventional commits** if you want automated changelogs and semantic versioning. Optional but pays off in libraries.

For repo strategy, default to **polyrepo with conventions**: one repo per deployable unit or per coherent library. Use a monorepo only if you have the tooling investment to support it.

> **Alternatives:**
> - **GitLab** — pick if you want CI, container registry, and issue tracking from one vendor, or if self-hosting matters (compliance, air-gapped).
> - **Bitbucket** — pick if you're already in the Atlassian ecosystem and Jira integration is non-negotiable. Smaller community, fewer integrations.
> - **Azure DevOps Repos** — pick in heavily Microsoft-aligned shops. Otherwise no.

### Monorepo vs polyrepo

| Factor | Polyrepo (default) | Monorepo |
|---|---|---|
| Tooling needed | Minimal | Significant (Bazel, Nx, Turborepo, Pants) |
| Cross-cutting refactors | Painful | Easy |
| CI complexity | Per-repo, simple | Affected-graph, complex |
| Onboarding | Easier | Harder |
| Best for | Most teams under 50 engineers | Teams that have made a deliberate platform investment |

If you are asking "should we go monorepo?", the answer is usually no. Adopt one when cross-repo coordination is your top engineering pain — not before.

## Common pitfalls

- **Long-lived feature branches** that diverge from `main` for weeks. Merges become archaeology.
- **GitFlow** in a deploy-frequently shop. It is heavy, it is confusing, and the tooling assumes release branches you do not need.
- **No CODEOWNERS.** Reviews route by tribal knowledge. Audit becomes guesswork.
- **Merging your own PRs without review** because "it's a small change." This is how secrets get committed and prod gets broken.
- **Letting `main` be broken.** A red `main` blocks every deploy and trains the team to ignore CI signals.
- **Mirroring repos across providers.** One canonical source, always.

## Quick checklist

- [ ] All production code lives in a single VCS provider tied to SSO.
- [ ] `main` is protected: no force push, PR required, status checks required.
- [ ] Every repo has a CODEOWNERS file and a README with setup steps.
- [ ] Squash merge is the default; merge commits are disabled or rare.
- [ ] Secret scanning is enabled at the org level.
- [ ] You have a documented branching convention everyone follows.
- [ ] Stale branches are auto-deleted on merge.
- [ ] You have decided — and written down — your monorepo vs polyrepo policy.
