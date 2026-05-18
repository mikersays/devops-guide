---
title: CI/CD
track: generic
order: 3
summary: Pipeline architecture, environment promotion, gates, and the operating discipline that makes deploys boring.
---

## Why it matters

CI/CD is the conveyor belt between "code written" and "value delivered." When it is fast and trustworthy, every other engineering practice gets cheaper: reviews are faster, rollbacks are safer, on-call is calmer. When it is slow or flaky, you pay a tax on every change forever.

## What "good" looks like

- Every commit to `main` produces a deployable artifact, automatically.
- Pipelines complete in under 10 minutes for the common case.
- Deploys to staging are automatic. Deploys to production are one click (or automatic with safeguards).
- Failed deploys roll back automatically or in one command.
- The same artifact is promoted across environments — you never rebuild for prod.
- Pipeline definitions live in the repo they build.

## Recommended default

**GitHub Actions** for CI, **Argo CD** or your platform's native deploy mechanism for CD on Kubernetes, or direct deploy via Actions for non-K8s targets.

Pipeline architecture:

1. **PR pipeline** — lint, type-check, unit tests, dependency scan, SAST. Target: under 7 minutes. Green required to merge.
2. **Main pipeline** — re-test, build one immutable artifact, SHA-tag, push, deploy to staging.
3. **Staging smoke tests** — block promotion on failure.
4. **Production deploy** — promote the staging artifact unchanged. Auto with progressive rollout, or one-click.
5. **Post-deploy verification** — health checks, error-rate watch, auto-rollback trigger.

Key decisions:

- Artifacts are immutable and SHA-tagged. Never `:latest`.
- Secrets injected at deploy time from a secrets manager (see [Security](./08-security.md)).
- Environments: at minimum `dev`, `staging`, `production`. Each costs ongoing maintenance.
- Strategy: rolling for stateless, blue/green for stateful or risky, canary once observability can detect a bad canary.
- CI authenticates to your cloud via **OIDC federation** — the CI provider (GitHub, GitLab, Buildkite) signs a short-lived token that the cloud trusts via a configured identity provider, so no long-lived access keys live in CI secrets. This is the only credential pattern worth standardizing on for new pipelines; later sections cross-reference here.
- Once your container builds cross 5 minutes, push them onto a build cache service — **BuildKit remote cache** in your own registry, or a managed runner with persistent cache like **Depot**, **Namespace**, or **Blacksmith**. The difference is usually 3-10x on cold-cache rebuilds.

> **Alternatives:**
> - **GitLab CI** — pick if you're on GitLab. Excellent integrated experience; the runners are easy to self-host.
> - **CircleCI / Buildkite** — pick if you have heavy build matrixes, need self-hosted agents at scale, or have outgrown GitHub Actions' macOS / large-runner pricing.
> - **Jenkins** — pick only if you have an existing investment. Don't start here in 2026. Operationally expensive.

For CD specifically:

- **Argo CD / Flux** — GitOps for Kubernetes. Declarative state in Git, controllers reconcile.
- **AWS CodeDeploy / Cloud Deploy** — pick when you're committed to a single cloud and want managed deploy primitives.
- **Direct from GitHub Actions** — fine for small orgs and non-K8s targets. The boundary blurs between CI and CD; that's OK at small scale.

## Common pitfalls

- **Building twice.** Building once for staging and a second time for prod means you shipped a different artifact than you tested.
- **Slow pipelines you have stopped fighting.** Past 15 minutes, engineers context-switch and never come back. Cache aggressively, parallelize tests, split pipelines.
- **Flaky tests treated as normal.** A pipeline that is red 20% of the time is a pipeline nobody trusts. Quarantine flaky tests within a day.
- **Manual approval gates that nobody actually reads.** If the human always clicks approve, delete the gate and replace it with automated checks.
- **Deploying directly from a developer's laptop** "just this once." This is how production drifts from source control.
- **No rollback plan.** "Forward fix" is not a rollback plan.

## Quick checklist

- [ ] Pipeline definitions live in the repo and are reviewed like code.
- [ ] One artifact is built per commit and promoted unchanged to production.
- [ ] PR pipelines complete in under 10 minutes for the median PR.
- [ ] Staging deploys are fully automatic on merge to `main`.
- [ ] Production deploys are one-click or automatic with health-gated rollout.
- [ ] You can roll back the last deploy in under 5 minutes.
- [ ] Secrets are injected at runtime, never built into artifacts.
- [ ] Failed deploys page someone or auto-rollback — never silently fail.
- [ ] You measure deploy frequency, lead time, and change failure rate.
