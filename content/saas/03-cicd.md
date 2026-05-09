---
title: CI/CD
track: saas
order: 3
summary: GitHub Actions with ephemeral preview envs per PR, progressive delivery, and feature flags as the unit of release.
---

# CI/CD

## Why it matters

Your CI/CD pipeline is the single biggest lever on lead-time-for-changes and change-failure-rate. A pipeline that takes 45 minutes turns engineers into multitaskers; a flaky pipeline makes every red signal ignorable. Treat CI/CD as a product, owned by the platform function (or guild), with SLOs.

## What "good" looks like

- PR pipeline: < 10 minutes from push to all checks green
- Every PR gets an ephemeral preview environment with a shareable URL
- Deploys to production happen on merge to `main`, multiple times per day
- Production rollouts are progressive: canary → stage → full, with automatic rollback on SLO breach
- Feature flags decouple deploy from release; "dark launches" are routine
- One-click rollback (or one-command) on every service
- Pipeline-as-code lives next to the application code it builds

## Recommended default

**GitHub Actions** as the orchestrator. Job graph in YAML, reusable workflows for shared steps, self-hosted runners (on EC2 spot or EKS) once usage justifies the cost.

**Pipeline shape (per service):**

1. **PR pipeline**: lint, type-check, unit tests, build container, push to ECR with PR-tagged image, deploy ephemeral preview env (e.g., on ECS Fargate or a per-PR Kubernetes namespace), comment URL on the PR
2. **Main pipeline**: re-run tests, run integration/E2E suite, build & sign image, deploy to staging, smoke tests, gated promotion to prod
3. **Prod deploy**: progressive rollout — canary 5% → 25% → 100%, watching key SLOs in [observability](./06-observability.md). Automatic rollback if error budget burns.

**Progressive delivery:**
- **Blue/green** for stateful or risky changes (DB migrations).
- **Canary** for typical service deploys; AWS App Mesh, Argo Rollouts, or LaunchDarkly's targeting for traffic split.
- **Feature flags**: LaunchDarkly, Unleash, or Statsig. Treat the flag as the release boundary; deploys become non-events.

**Ephemeral preview environments:**
A preview environment per PR is the highest-leverage CI investment. Stand up a namespaced ECS service or Kubernetes namespace with seeded data, expose it via ALB + dynamic DNS, and tear it down on PR close. This kills "works on my machine" and makes design review concrete.

**Image & artifact policy:**
- One image, promoted across environments — never rebuild for prod
- Sign images with cosign; verify on deploy
- ECR image scanning on push; block deploys on critical CVEs

> **Alternatives:**
> - **CircleCI**: faster cold-start, better caching primitives. Pick if Actions is too coarse for your build matrix.
> - **Buildkite**: best for self-hosted, high-throughput orgs at 100+ engineers.
> - **GitLab CI**: pick if you're already on GitLab; tightly integrated.
> - **ArgoCD / Flux** for GitOps deployment: pick when you're on Kubernetes and want pull-based deploys with full audit trail.

## Common pitfalls

- **Shared "staging" env** as a bottleneck — fix with ephemeral previews
- **Rebuilding the artifact per environment** — creates promotion ambiguity and supply-chain risk
- **No automatic rollback** — humans page each other to revert at 2am
- **Slow flaky test suite** that becomes background noise; treat flakes as P1 bugs
- **Conflating deploy and release** — deploy continuously, release behind flags
- **Secrets in CI as plain env vars** — use OIDC federation to AWS instead

## Quick checklist

- [ ] PR pipeline < 10 min p95
- [ ] Every PR auto-creates a preview environment
- [ ] One artifact promoted across stage → prod (no rebuilds)
- [ ] OIDC from GitHub Actions to AWS (no long-lived keys)
- [ ] Image signing (cosign) and verification at deploy time
- [ ] Progressive rollout with auto-rollback on SLO breach
- [ ] Feature flag platform adopted org-wide
- [ ] Rollback documented and rehearsed (game-day at least quarterly)
- [ ] CI/CD treated as a product with SLOs and an owner
- [ ] Flaky tests tracked, quarantined, fixed within 1 sprint
