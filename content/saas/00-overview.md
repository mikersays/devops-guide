---
title: Overview
track: saas
order: 0
summary: Cloud-native SaaS DevOps for fast-moving 5–50 person startups optimizing for ship-speed and DORA elite performance.
---

# Cloud-native SaaS Track

## Why it matters

If you are a Series A–C SaaS company, your competitive advantage is the rate at which you turn ideas into shipped, observable, reversible changes in production. Every DevOps decision you make either compounds that velocity or taxes it. This track is opinionated for teams who would rather move fast and recover quickly than move slowly and "be safe" — because in cloud-native SaaS, slow is not safe.

## What "good" looks like

Borrow the **DevOps Research and Assessment** (**DORA**) metrics from *Accelerate* as your North Star. Elite performers hit:

- **Deploy frequency**: on-demand, multiple times per day per service
- **Lead time for changes**: < 1 hour from commit to production
- **Change failure rate**: 0–15%
- **Mean Time to Restore** (**MTTR**): < 1 hour
- Every engineer can ship to production on day 5, behind a feature flag, without paging anyone
- Infrastructure is code; clicking in consoles for production is a bug, not a workflow
- One person on-call can diagnose any service via dashboards and traces in under 10 minutes

If your numbers are an order of magnitude off, you have a process or platform problem, not a people problem.

## Recommended default

A modern SaaS stack centered on AWS, with Kubernetes treated as optional rather than mandatory:

- **Source control & CI**: GitHub + GitHub Actions
- **Infra**: Terraform (or OpenTofu) on AWS, with Fargate/Lambda before EKS
- **Runtime**: ECS Fargate or Lambda for most services; EKS only when you outgrow them
- **Observability**: OpenTelemetry SDKs feeding Datadog (or Grafana Cloud)
- **Incidents**: PagerDuty or incident.io with blameless postmortems
- **Security**: GitHub Advanced Security + Snyk + AWS Secrets Manager
- **Docs**: Notion for prose, ADRs in-repo, Backstage when service count > 15

This stack gets a 5-person team to elite DORA performance in 60–90 days without an army of platform engineers.

> **Alternatives:**
> - **GCP-native**: Cloud Run + Cloud Build + Artifact Registry + Cloud Logging. Pick if your team has deep GCP fluency or you're using BigQuery as your data plane.
> - **Azure-native**: Container Apps + Azure DevOps or GitHub Actions + Bicep. Pick if you're enterprise-adjacent or selling into Microsoft-heavy verticals.
> - **Heroku/Render/Fly.io**: PaaS-first. Pick under 5 engineers when AWS complexity is not yet justified.

## Tradeoffs vs. other tracks

| Dimension | SaaS (this track) | [Generic](../generic/00-overview.md) | [Enterprise](../enterprise/00-overview.md) |
|---|---|---|---|
| Optimization | Velocity, reversibility | Balance | Compliance, blast-radius control |
| Change advisory | None — peer review + tests | Light | CAB / change windows |
| Compliance | SOC 2 Type II as a stretch goal | Varies | HIPAA/PCI/FedRAMP |
| Ops model | You build it, you run it | Mixed | Separate ops org common |
| Tool consolidation | Aggressive | Pragmatic | Vendor-driven, slow |

## Common pitfalls

- **Premature Kubernetes**: adopting EKS when ECS Fargate would have shipped 4 months earlier
- **Skipping observability** until the first big outage — by then retrofitting it costs 5x more
- **Building a "platform team" of one** before there are enough product teams to serve
- **Treating SOC 2 as a project**: it must be a continuous control posture, not a sprint
- **Manual production access** that never gets clawed back, blowing audit and incident scope

## Quick checklist

- [ ] DORA metrics instrumented and visible to leadership
- [ ] Trunk-based dev with PR + green CI as the only path to production
- [ ] One-click rollback on every service
- [ ] On-call rotation with documented runbooks
- [ ] Terraform-managed prod (zero ClickOps)
- [ ] Centralized logs, metrics, traces with retention policies
- [ ] Secrets in a managed store, never in env files in repos
- [ ] 90-day platform roadmap shared and tracked
