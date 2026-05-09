---
title: 90-Day Roadmap
track: generic
order: 11
summary: A phased 90-day rollout plan for setting up DevOps from scratch — Days 0-30, 31-60, 61-90.
---

## Why it matters

If you have just been handed DevOps and need a defensible 90-day plan by tomorrow, this is it. It assumes a small team, no existing platform investment, and the appetite to make boring choices fast. Adapt it; do not follow it literally.

## What "good" looks like at day 90

- Every production change goes through CI, code review, and an automated pipeline.
- Each Tier 1 service has a dashboard, an alert, a runbook, and an owner.
- Cloud spend is attributable to teams.
- A paged on-call rotation exists for at least the most critical service.
- A documented incident process has been used at least once.
- You know what the next 90 days look like, and so does the team.

## Recommended default: phased rollout

### Days 0-30: Stop the bleeding

Goal: visibility, version control, and basic guardrails. No major rebuilds.

- **Week 1 — Inventory.** List every production system, owner, and dependency. Document current deploy processes. Audit production access; cut anyone who doesn't need it.
- **Week 2 — Source control hygiene.** SSO + MFA on VCS (see [Source Control](./02-source-control.md)). Branch protection on `main`. Org-wide secret scanning. CODEOWNERS on top 5 repos.
- **Week 3 — Identity and secrets.** SSO + MFA on cloud, observability, deploy tooling. Inventory long-lived credentials. Stand up a secrets manager for one critical service.
- **Week 4 — Observability baseline.** Centralized logging for every Tier 1 service. One overview dashboard. One real, actionable alert paging one real human (see [Incident Response](./07-incident-response.md)).

### Days 31-60: Build the conveyor belt

Goal: pipelines, IaC, and on-call.

- **Weeks 5-6 — CI/CD foundations.** One CI tool (default: GitHub Actions; see [CI/CD](./03-cicd.md)). Top 3 services get PR + main pipelines, immutable artifacts, auto staging deploy. One-click prod deploy for one service. Document rollback.
- **Weeks 7-8 — IaC.** Remote state with locking (see [IaC](./04-iac.md)). Codify VPC, IAM, and one production service. `plan` on PR, `apply` in CI. Bootstrap a sandbox from code as a fire drill.
- **Week 9 — On-call.** PagerDuty for the most critical service. Severity levels documented. Runbooks for top 5 failure modes. Schedule a game day.

### Days 61-90: Compounding investments

Goal: extend coverage, formalize practice, set up the next quarter.

- **Weeks 10-11 — Security baseline.** Dependency and container scanning in CI (see [Security](./08-security.md)). Vulnerability SLA defined. Audit logs to a write-protected destination. Quarterly access review scheduled.
- **Weeks 12-13 — Cost visibility.** Tagging policy enforced via IaC (see [Cost & FinOps](./10-cost.md)). Monthly cost review held. Per-team dashboards. First orphan resource sweep.
- **Week 14 — Documentation.** README template on top 10 repos. First 3 ADRs written. Service catalog listing every service and owner.
- **Week 15 — Reflection.** Retro with the team. Write the next 90-day roadmap. Communicate progress to leadership.

> **Alternatives:**
> - **"Compliance-first" sequencing** — pick if you're chasing a SOC 2 deadline. Reorder to put audit-relevant work (access reviews, audit logs, vulnerability SLA) into Days 0-30. See [SaaS track](../saas/00-overview.md).
> - **"Reliability-first" sequencing** — pick if you're already on fire with incidents. Spend the first 30 days on observability and on-call instead of CI/CD.
> - **"Cost-first" sequencing** — pick if your runway depends on cutting cloud spend in the next quarter. Move tagging, attribution, and right-sizing into Days 0-30.

## Common pitfalls

- **Trying to do all 12 sections in 90 days.** You cannot. Pick 3-4 to do well.
- **Big-bang rewrites.** This roadmap is incremental on purpose.
- **Not communicating progress.** Leadership thinks nothing is happening. Write a weekly update.
- **Buying tools to skip work.** A tool without an owner is shelfware in 6 months.
- **Hiring before you know the problem shape.** Wait until day 60 to write the job description.
- **Perfect process for a team that does not exist yet.** Calibrate to your actual size.

## Quick checklist (review at day 90)

- [ ] All production changes go through CI and code review.
- [ ] At least one service has fully automated CI/CD with rollback.
- [ ] Core infrastructure is in IaC, not the console.
- [ ] One service has SLOs, dashboards, alerts, and a paged on-call.
- [ ] Severity levels and an incident process are documented and have been used.
- [ ] Secrets are out of source control and in a secrets manager.
- [ ] Cost is attributable to teams; monthly review is happening.
- [ ] You have a written next-quarter plan informed by what you learned.
- [ ] Leadership has a clear-eyed view of where you are and what's next.
