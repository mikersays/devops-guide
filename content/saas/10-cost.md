---
title: Cost & FinOps
track: saas
order: 10
summary: FinOps from day one with cost allocation tags, anomaly alerts, and unit economics tracked per customer or tenant.
---

# Cost & FinOps

## Why it matters

Cloud bills are unfounded liabilities until you can attribute them. At Series A you can get away with a rough monthly burn number; by Series B your investors will ask about gross margin and infrastructure cost-per-customer, and "I don't know" is the wrong answer. FinOps practiced from day one is dramatically cheaper than retrofitting cost discipline after a year of unmanaged growth.

## What "good" looks like

- Every dollar on the AWS bill maps to a service and an owning team
- Engineers see cost dashboards as casually as they see latency dashboards
- Anomaly alerts catch a 50% week-over-week jump within 24 hours
- Unit economics — cost per active user, per tenant, per transaction — calculated and trended monthly
- A documented commitment strategy (Savings Plans / Reserved Instances) reviewed quarterly
- Non-prod auto-scales down nights and weekends
- Cost is a column in every architecture decision

## Recommended default

### Tag everything, enforce on day one

Mandatory tags on every resource (Terraform-enforced, see [IaC](./04-iac.md)):

- `Environment` (prod / staging / dev)
- `Service` (e.g. `billing-api`)
- `Owner` (team or person)
- `CostCenter` (engineering / customer-success / etc.)
- `Tenant` (when multi-tenant per-resource)

Activate cost allocation tags in the AWS Billing console — tags do not aggregate retroactively, so do this *now*.

### Visibility tooling

- **Native**: AWS Cost Explorer + AWS Budgets with email + Slack alerts. Free, sufficient for the first year.
- **Vantage** or **CloudHealth**: pick when you want better cross-service breakdowns, Kubernetes cost allocation, or multi-cloud.
- **CloudZero** or **Kubecost** (for k8s specifically): pick when unit economics matter and you've outgrown spreadsheets.

Set anomaly detection on Cost Explorer; pipe to a `#finops` Slack channel.

### Cost dashboards

Build a dashboard with:
- Total spend, this month vs. last
- Top 10 services by cost
- Cost per environment
- Cost per service, sorted by largest delta
- Estimated month-end based on run rate

Review in a monthly **FinOps standup**: 30 minutes, engineering + finance, action items tracked.

### Commitments & discounts

- **Compute Savings Plans** (1-year, no upfront) once steady-state spend is stable — typically 20–30% savings
- **Reserved Instances** for RDS, OpenSearch — same idea, less flexible
- **S3 Intelligent-Tiering** by default for new buckets
- **Graviton** (ARM) for ECS/Lambda where supported — ~20–40% cheaper on Graviton4 vs. comparable x86, often faster too
- **Spot** for non-critical batch and CI runners

Do not over-commit early. Underutilized commits are worse than on-demand.

### Engineering hygiene

- Auto-stop non-prod compute outside business hours (Lambda + EventBridge schedule, or instance scheduler)
- Right-size by default with regular reviews; AWS Compute Optimizer flags candidates
- Lifecycle policies on S3 and CloudWatch Logs — log retention costs add up fast
- Egress is the silent killer; use VPC endpoints and CloudFront where applicable
- Telemetry has a cost (see [Observability](./06-observability.md)) — track Datadog / Grafana spend like AWS

### Unit economics

Once you have meaningful usage:
- **Cost per active user (DAU/MAU)** — basic gross margin signal
- **Cost per tenant** — surfaces noisy-neighbor or pricing-tier problems
- **Cost per million requests** for key APIs — engineering efficiency over time

Wire these into your finance metrics, not just engineering. They drive pricing decisions.

> **Alternatives:**
> - **Vantage**: best cost UX for AWS, growing GCP/Azure support; great for engineers.
> - **CloudHealth (VMware)**: enterprise-grade, more rigid, often a slower workflow but strong for multi-account governance.
> - **CloudZero**: pick when unit cost / per-customer cost is the key narrative for your board.
> - **Kubecost / OpenCost**: required if you're on Kubernetes and need pod/namespace-level allocation.

## Common pitfalls

- **Tagging starts late** — historical data is forever unallocated
- **No owner per service** for cost — everyone assumes someone else is watching
- **Idle non-prod resources** running 24/7 because turning them off is "annoying"
- **Over-committing Savings Plans** based on growth forecasts that did not materialize
- **Datadog bill blindsides** the team — cardinality explosion, retention defaults
- **Egress fees ignored** until the cross-region or cross-AZ traffic shows up at $30k/mo
- **Treating FinOps as finance's job** — without engineering ownership, nothing changes

## Quick checklist

- [ ] Mandatory tag policy enforced in Terraform and AWS SCPs
- [ ] Cost allocation tags activated in Billing
- [ ] AWS Budgets + anomaly detection wired to Slack
- [ ] Monthly FinOps review on the calendar
- [ ] Non-prod auto-stops nights and weekends
- [ ] Savings Plan strategy documented and reviewed quarterly
- [ ] S3 lifecycle policies and log retention defaults set
- [ ] Telemetry vendor cost tracked alongside AWS
- [ ] Unit economics (cost per user / tenant) reported monthly
- [ ] Cost is part of design review for any new service
