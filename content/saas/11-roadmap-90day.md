---
title: 90-Day Roadmap
track: saas
order: 11
summary: Phased rollout — Foundations (0-30), Reliability (31-60), Scale (61-90) — to take a SaaS team from chaos to elite DORA.
---

# 90-Day Roadmap

## Why it matters

Adopting all of this at once is how DevOps initiatives die. Sequence matters: you cannot meaningfully measure reliability without observability; you cannot do progressive delivery without IaC; and you cannot do FinOps without tagging. This roadmap is a defensible order of operations that compounds — each phase makes the next easier.

## What "good" looks like

- A new platform initiative that ships in 90 days, not 9 months
- Each phase has measurable exit criteria, not vibes
- Leadership and engineering align on what we *won't* do this quarter
- DORA metrics improve visibly inside the window
- The 90-day plan ends with the team ready to *operate*, not still *setting up*

## Days 0–30: Foundations

**Goal: stop the bleeding, establish the substrate.**

Pick the simplest defaults from each section. Resist scope creep.

- [ ] AWS Organizations with prod isolated in its own account ([Cloud Platform](./05-cloud-platform.md))
- [ ] SSO + MFA on every tool; no AWS IAM users
- [ ] GitHub branch protection on `main`; CODEOWNERS in every repo ([Source Control](./02-source-control.md))
- [ ] GitHub Actions baseline pipeline: lint, test, build, deploy to a single environment ([CI/CD](./03-cicd.md))
- [ ] OIDC federation from GitHub to AWS — kill all long-lived keys
- [ ] Terraform repo scaffold; one production stack imported to code ([IaC](./04-iac.md))
- [ ] Mandatory tags policy defined and enforced on new resources
- [ ] Secrets moved from env files to AWS Secrets Manager ([Security](./08-security.md))
- [ ] Service catalog v0: a markdown table with service / owner / repo
- [ ] Severity matrix and on-call rotation set up in PagerDuty / incident.io ([Incident Response](./07-incident-response.md))

**Exit criteria:**
- Zero ClickOps changes to prod for 7 consecutive days
- No long-lived AWS access keys in CI
- Every service has a named owner and an on-call rotation
- A new engineer can deploy a code change to staging via PR

## Days 31–60: Reliability

**Goal: see what's happening, recover faster, reduce surprise.**

Now that you have the substrate, instrument it.

- [ ] OpenTelemetry SDKs in every service; logs/metrics/traces flowing to Datadog or Grafana ([Observability](./06-observability.md))
- [ ] At least one SLO per user-facing service; error-budget policy documented
- [ ] Every paging alert links to a runbook ([Docs](./09-docs-knowledge.md))
- [ ] PR pipeline < 10 minutes p95
- [ ] Ephemeral preview environments per PR for the top 3 services
- [ ] Progressive rollout (canary or blue/green) on at least one production service
- [ ] One-click rollback rehearsed in a game day
- [ ] Blameless postmortem template + tracker in place; first one written
- [ ] SAST + SCA + secret scanning on every PR; vulnerability SLAs published
- [ ] Cost dashboards live; monthly FinOps review on calendar ([Cost](./10-cost.md))
- [ ] Drift detection running daily on all Terraform stacks

**Exit criteria:**
- MTTR for SEV-2s halved from baseline
- DORA deploy frequency at least daily for top 3 services
- 100% of SEV-1/2 in window have a published postmortem
- Lead time for changes < 1 day p50

## Days 61–90: Scale

**Goal: turn the foundations into a paved road; remove bottlenecks before they bite.**

You're now investing in *leverage*, not basics.

- [ ] Reusable Terraform modules with pinned versions; new service bootstraps from a template
- [ ] Reusable GitHub Actions workflows; "new service" scaffold deploys end-to-end
- [ ] Feature flag platform adopted org-wide; deploys decoupled from releases
- [ ] All user-facing services on progressive delivery with auto-rollback
- [ ] DORA metrics dashboard visible to engineering leadership
- [ ] Architecture decision records (ADRs) for the top 5 decisions of the quarter
- [ ] Backstage (or equivalent) evaluated; decision recorded with a trigger date if not yet adopted
- [ ] Quarterly access review automated
- [ ] Compliance automation (Vanta / Drata / Secureframe) wired in if pursuing SOC 2
- [ ] Dedicated platform team formed *or* a documented threshold for when it will be ([Team Structure](./01-team-structure.md))
- [ ] Telemetry costs and AWS Savings Plans reviewed; first commitments made if appropriate
- [ ] Game day / chaos drill executed; findings logged into the action-item tracker

**Exit criteria:**
- Top three DORA metrics match elite-performer thresholds for at least one service
- A new service can go from idea to production behind a flag in < 1 week
- The team is *operating* the platform, not still *building* it

## After day 90

This roadmap ends with a posture, not a finish line. Keep a quarterly platform-OKR cadence and re-baseline the DORA metrics each cycle. Most importantly: prune. The engineering org at 80 people needs a different platform than the one at 30 — be willing to retire tools and patterns that earned their keep but are now drag.

> **Alternatives:**
> - **30/60/90 vs. 6-month plan**: pick a 6-month phasing if you're under-resourced (one platform engineer, zero budget); the principles still apply.
> - **Compliance-first sequencing**: if you have a contractual SOC 2 deadline, swap order of phases 2 and 3.
> - **Greenfield vs. retrofit**: greenfield can compress to 60 days; retrofit on a 5-year-old codebase often needs 120.

## Common pitfalls

- **Doing all 12 sections in parallel** — none reach exit criteria and all stall
- **Skipping observability** to "get to features" — and then fighting incidents blind
- **Treating the roadmap as a project to finish** rather than a posture to maintain
- **No leadership buy-in on tradeoffs** — engineering invests, then product demands shift back to feature factory
- **Over-investing in tooling** that nobody adopts because the paved road is harder than the dirt road

## Quick checklist

- [ ] 90-day roadmap published with named owners per workstream
- [ ] Weekly platform standup with progress and blockers
- [ ] Monthly DORA metrics review with engineering leadership
- [ ] Each phase has explicit, measurable exit criteria
- [ ] Quarterly retrospective on the platform program itself
- [ ] Day-90 review scheduled with leadership before day 0 begins
