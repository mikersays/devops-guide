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

Borrow the **DevOps Research and Assessment** (**DORA**) metrics as your North Star. The DORA 2024 elite thresholds:

- **Deploy frequency**: on-demand (multiple deploys per day)
- **Lead time for changes**: < 1 day from commit to production
- **Change failure rate**: < 5%
- **Mean Time to Restore** (**MTTR**): < 1 hour
- Every engineer can ship to production on day 5, behind a feature flag, without paging anyone
- Infrastructure is code; clicking in consoles for production is a bug, not a workflow
- One person on-call can diagnose any service via dashboards and traces in under 10 minutes

(Source: DORA 2024 *State of DevOps* report.)

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

This stack is the smallest set we'd run for a 5-person team chasing DORA elite — additions add ops cost faster than they add throughput. The same shape works on GCP (Cloud Run + Cloud Build + Artifact Registry, especially if BigQuery is already your data plane) or Azure (Container Apps + GitHub Actions + Bicep, useful when you're selling into Microsoft-heavy verticals). Under five engineers, a PaaS like Render or Fly.io is often the right starting point — AWS complexity isn't yet earned.

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
