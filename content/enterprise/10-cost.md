---
title: Cost and FinOps
track: enterprise
order: 10
summary: Showback and chargeback, cost governance, reserved capacity and Enterprise Discount Programs, and a central FinOps function.
---

In an enterprise of 200+ engineers, cloud spend is rarely a runaway problem and rarely a non-problem. It tends to be merely opaque: a number that grows in line with the business, with nobody able to explain the slope or defend the next year's commitment. The job of FinOps in this track is to make spend understandable, predictable, and accountable to the teams that drive it — without turning every architectural decision into a budget meeting.

## Why it matters

Cloud spend in regulated organizations is constrained by financial controls, not just engineering preferences. **Enterprise Discount Programs** (**EDPs**), reserved instances, and savings plans involve multi-year financial commitments that finance leadership signs off on. Misallocated spend creates intercompany accounting issues. Untagged resources create audit findings around asset inventory. A FinOps function that sits on top of well-tagged, well-bounded accounts produces accurate showback and credible forecasts. One that sits on top of a tagging mess produces guesses.

The business risk is concrete: missing the EDP target by 10% costs millions; over-committing on reserved capacity costs millions in a different direction; and when per-team cost visibility is absent, engineering decisions are made without economic context.

## What "good" looks like

- Every cloud resource carries mandatory tags (owner, service, environment, cost center, data classification) enforced by IaC policy. Untagged resources are blocked at apply or auto-quarantined.
- A central FinOps function, embedded with Finance and Platform, owns the cost model, the EDP relationship, and the chargeback methodology. They are not the people who optimize individual workloads - they enable engineers to do so.
- Showback is real-time and self-service. Every team has a dashboard showing their spend, trend, and forecast. Chargeback (where used) is monthly, predictable, and disputable.
- Reserved capacity (RIs, Savings Plans, Azure Reservations, GCP CUDs) is managed centrally, with a strategy reviewed quarterly. Coverage and utilization targets are published.
- Cost anomaly detection runs continuously and pages the responsible team for spikes above a threshold; it does not page on every minor variance.
- Architectural decisions include a cost section. ADRs for significant systems carry an estimated unit-economic projection.

## Recommended default

**A central FinOps function using a third-party platform plus native cloud tools**, with the following operating model:

- **Tagging**: mandatory tags enforced via Sentinel/OPA at IaC apply (see [IaC](./04-iac.md)). Tag schema is owned by FinOps and Platform jointly. AWS-native: AWS Organizations tag policies + Config rules. Azure: Azure Policy. GCP: Org Policy and labels.
- **Cost platform**: **Apptio Cloudability** or **CloudHealth by VMware** as the cross-cloud showback/chargeback engine; ingests CUR/EA/Billing exports, applies the allocation model, produces team-level dashboards.
- **Native cloud cost tools**: AWS Cost Explorer + AWS Budgets + Compute Optimizer; Azure Cost Management; GCP Billing + Recommender. Used for fine-grained engineering analysis, not as the primary chargeback surface.
- **Reserved capacity**: managed centrally by FinOps with a quarterly strategy review. Convertible RIs and Savings Plans for flexibility; commitment levels backed by 12-month forecast and reviewed against EDP minimums.
- **Anomaly detection**: AWS Cost Anomaly Detection, Azure cost alerts, GCP recommender, plus the third-party platform's anomaly engine. Tuned to suppress noise; pages only on material anomalies tied to a service.
- **Engineering integration**: cost dashboards embedded in Backstage per service. Pull request templates for new services include an estimated monthly cost. Quarterly business reviews include a cost-per-customer or cost-per-transaction metric per Tier 1 service.
- **Governance**: a monthly FinOps council with Engineering, Finance, and Platform, reviewing trend, anomalies, EDP burn, and the 30-day forecast.

## Alternatives

> **Alternatives:**
> - **Vantage**: pick this for a lighter, engineer-friendly cost platform; strong UX, less heavy on chargeback automation.
> - **Native cloud tools only (AWS Cost Explorer + Azure Cost Management + GCP Billing)**: pick this if you are predominantly single-cloud and your tagging is genuinely clean; lowest cost, weakest cross-cloud story.
> - **CloudZero or Finout**: pick these for cost-per-customer or cost-per-feature analysis; stronger unit economics, lighter on classic chargeback.
> - **In-house data warehouse (CUR + dbt + Looker/Tableau)**: pick this only if you have the analytics engineering capacity and want full control; significant ongoing investment.

## Compliance mapping

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Asset inventory and tagging | CC6.1 | A.5.9 | CM-8 |
| Resource ownership identification | CC6.1 | A.5.9 | CM-8, PM-5 |
| Capacity planning | A1.1 | A.8.6 | SC-5, CP-2 |
| Budget and financial controls | CC1.3 | A.5.1 | PM-3 |

Cost and FinOps controls map less directly to security frameworks than other sections; the strongest mappings are around asset inventory and capacity. Sarbanes-Oxley implications around significant financial commitments (EDPs) are out of scope here but should be reviewed with Finance and Internal Audit.

## Common pitfalls

- Tag enforcement that warns instead of blocks; tag coverage will plateau at 70% and audit findings will follow.
- Chargeback before showback; teams need months of self-service visibility before you can charge them for what they consume.
- A FinOps function that becomes the team that says "no" instead of the team that makes cost legible; engineers will route around it.
- EDP commitments based on flat-line projections of recent spend; model the actual roadmap, including planned consolidations and migrations.
- Cost anomaly alerts that fire on every minor blip; engineers learn to ignore them, and the real anomaly gets ignored too.
- Treating reserved-instance / savings-plan management as a one-time exercise; coverage decays as workloads change.

## Quick checklist

- [ ] Mandatory tagging is enforced at IaC apply for all in-scope accounts.
- [ ] Tag coverage is measured weekly and reported as a platform KPI.
- [ ] Every team has a cost dashboard they can self-serve.
- [ ] Reserved capacity strategy is documented, reviewed quarterly, and tied to forecast.
- [ ] Anomaly detection routes to service owners, not to a central inbox.
- [ ] FinOps council meets monthly with Engineering and Finance representation.
- [ ] EDP burn-rate vs commitment is tracked and visible to leadership.
- [ ] Significant new services include a cost projection in their ADR.
