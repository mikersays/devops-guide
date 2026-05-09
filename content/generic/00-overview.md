---
title: Overview
track: generic
order: 0
summary: A pragmatic, industry-agnostic DevOps playbook for small-to-mid engineering orgs (5-200 engineers).
---

This track is the default. If you don't know which track to read, read this one. It targets companies with 5-200 engineers who need a working DevOps practice without overcommitting to a single stack, vendor, or compliance regime.

## Why it matters

Most DevOps content assumes you are either a Silicon Valley SaaS company shipping 50 deploys a day, or a Fortune 500 with a Platform team of 40. Most engineering orgs live in the middle: a handful of repos, a couple of cloud accounts, a small ops function, and not enough time to evaluate every tool. This track gives you defensible defaults that won't embarrass you in 18 months.

## What "good" looks like

- Every production change goes through version control, code review, and an automated pipeline.
- One person can be on-call without it ruining their week.
- You can rebuild any environment from code in under a day.
- Cost, uptime, and security posture are visible to leadership without anyone manually compiling a slide.
- New engineers ship to production in their first week.
- You are not the single point of failure for any system.

## Recommended default posture

Pick boring, widely-adopted tools. Optimize for engineer mobility (people you hire will already know them) and ecosystem depth over raw feature lists. The defaults across this track lean on:

- **GitHub** for source control and CI
- **Terraform / OpenTofu** for infrastructure
- **AWS** as the primary cloud (GCP/Azure are fine substitutes)
- **Kubernetes only when justified** — managed compute (ECS, Cloud Run, Fly, Render) is often enough
- **Datadog or Grafana Cloud** for observability
- **PagerDuty** for on-call

You'll see these defaults reappear across [CI/CD](./03-cicd.md), [IaC](./04-iac.md), and [Cloud Platform](./05-cloud-platform.md).

## Tradeoffs vs. other tracks

| Concern | Generic (this track) | SaaS track | Enterprise track |
|---|---|---|---|
| Compliance baseline | Reasonable hygiene | SOC 2 / ISO 27001 ready | HIPAA / FedRAMP / PCI |
| Deploy frequency | Daily-ish | Many per day | Per-release-train |
| Platform team | 0-2 people | 2-6 people | 10+ people |
| Vendor lock-in tolerance | Medium | Low | Very low |
| Multi-cloud | No | Maybe | Often required |
| Approval gates | Light | Light + automated checks | Heavy + manual |

If you run a regulated SaaS product, read this track first, then layer the SaaS track on top. If you are a regulated incumbent (finance, healthcare, public sector), the Enterprise track is closer to your reality.

## How to use this track

Read [00-Overview](./00-overview.md) and [11-Roadmap](./11-roadmap-90day.md) first. Then skim every section. Then pick the two or three areas where you are weakest and start there. You will not implement all of this in a quarter; do not try to.

## Common pitfalls

- Treating this guide as a checklist to complete instead of a model to adapt.
- Adopting "best practice" tools you don't need (a service mesh on three services, Kafka for two events per second).
- Hiring a "DevOps engineer" before you know what problem they should solve.
- Letting one senior engineer build a snowflake platform nobody else can operate.

## Quick checklist

- [ ] You can name the owner of every production system.
- [ ] You can describe your deploy process in one paragraph.
- [ ] A new hire can deploy to staging on day 2.
- [ ] You have at least two people who can respond to a Sev 1.
- [ ] Cloud spend is reviewed monthly by someone who can change it.
- [ ] You have read the [90-day roadmap](./11-roadmap-90day.md).
