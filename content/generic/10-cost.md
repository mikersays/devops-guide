---
title: Cost & FinOps
track: generic
order: 10
summary: Cost visibility, attribution, and the optimization patterns that recover 20-40% without slowing the team down.
---

## Why it matters

Cloud spend is the second-largest engineering expense after salaries, and the only one that can quietly double overnight. Most cost problems are not bad architecture — they are a missing feedback loop. Engineers ship, the bill goes up, no one connects the two. A working **Financial Operations** (**FinOps**) practice closes the loop without turning every architecture review into a budget meeting.

## What "good" looks like

- Every dollar of cloud spend can be attributed to a team, environment, and service within 24 hours.
- Engineers see the cost impact of their changes in the same week they ship them.
- Forecasts exist and are accurate to within 10% month over month.
- A monthly review identifies the top 3 cost movers and assigns owners.
- "Wasted" spend (idle resources, oversized instances, untagged orphans) is below 15% of total.
- Cost is treated as a non-functional requirement alongside latency and availability — not as an afterthought.

## Recommended default

A **tag-driven attribution model** with the cloud's native cost tooling and one third-party visibility layer once you cross ~$30k/month.

Concrete setup:

- **Tagging policy** — every resource has `team`, `service`, `env`, `cost-center`. Enforced via IaC modules (see [IaC](./04-iac.md)). Untagged resources fail provisioning or get auto-tagged for sweeping.
- **Cloud-native tooling** — AWS Cost Explorer + Budgets + CUR, or GCP equivalents. Anomaly and threshold alerts on.
- **Third-party visibility** — past ~$30k/month or multi-cloud, **Vantage**, **CloudZero**, or **OpenCost** (Kubernetes) pays for itself.
- **Monthly cost review** — 30-min standing meeting with engineering leadership, platform lead, and finance.
- **Per-team dashboards** — every team sees their slice of the bill.

> **Alternatives:**
> - **Pure cloud-native (Cost Explorer + Budgets)** — pick if you're under ~$20k/month and single-cloud. Free, sufficient.
> - **Vantage / CloudZero / Finout** — pick once attribution complexity exceeds what Cost Explorer can model. Strong for unit-economics work.
> - **Kubecost / OpenCost** — pick if Kubernetes is dominant in your spend. Required for accurate per-namespace/per-pod attribution.
> - **Spreadsheet + manual export** — fine at 5 engineers, untenable at 25.

## Optimization patterns (in order of ROI)

1. **Right-size compute.** Most fleets run at 10-20% utilization. Scale down. Use ARM/Graviton — typically 20% cheaper for equivalent performance.
2. **Kill dev/staging at night.** Weekday-only schedules save ~70% on non-prod compute.
3. **Savings Plans / RIs.** For steady-state baseline (bottom 60-70% of usage), 1-year commits save 30-40%. Don't over-commit.
4. **Storage tiering.** S3 Intelligent-Tiering is the lazy default and usually correct.
5. **Egress.** Cross-AZ and cross-region traffic is a stealth budget killer. Co-locate chatty services. Use VPC endpoints.
6. **Idle resources.** Orphaned EBS volumes, unused load balancers, forgotten NAT gateways, dev DBs untouched for 90 days. Sweep monthly.
7. **Observability cardinality.** A single high-cardinality tag can 10x your bill (see [Observability](./06-observability.md)).
8. **Database overprovisioning.** RDS instances are commonly 2-3x larger than needed.

## Unit economics

Once attribution is in place and easy wins are taken, graduate to **unit economics**: cost per request, per active user, per tenant. Unit economics let product and finance make real decisions and pull engineering into pricing conversations.

## Common pitfalls

- **Tagging that nobody enforces.** Attribution becomes fiction.
- **Hunting savings only after a budget surprise.** By then a quarter is burned.
- **Reserved Instance (RI) over-commitment.** Buying for projected growth that does not happen. Buy in tranches.
- **Treating FinOps as finance's job.** Engineers make the spending decisions; finance only reports.
- **Cost reviews without action items.** "Spend went up 12%" means nothing without a name and a date.
- **Optimizing dev while prod waste continues.** Spend the budget where the spend is.
- **Penny-wise on observability.** Cutting telemetry usually costs more on the next outage. Optimize cardinality first.

## Quick checklist

- [ ] Every cloud resource has required tags enforced via IaC or policy.
- [ ] Cost is attributable to team and service within 24 hours.
- [ ] Monthly cost review meeting exists and produces action items.
- [ ] Budgets and anomaly alerts are set per major service.
- [ ] Dev/staging environments shut down outside business hours.
- [ ] Right-sizing has been reviewed in the last 6 months.
- [ ] Savings Plan or RI coverage is set for steady-state baseline.
- [ ] Untagged or orphaned resources are swept at least monthly.
- [ ] Engineering leadership knows the top 3 cost drivers by name.
- [ ] You have unit economics for at least one core product flow (cost per request, per tenant, etc.).
