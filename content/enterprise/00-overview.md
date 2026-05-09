---
title: Overview
track: enterprise
order: 0
summary: DevOps for regulated organizations of 200+ engineers where every change must be auditable, attributable, and reversible.
---

This track is for platform leadership in a regulated enterprise: banks, insurers, healthcare, public sector, defense suppliers, and large incumbents pursuing or sustaining SOC 2 Type II, ISO 27001, HIPAA, PCI-DSS, FedRAMP Moderate/High, or equivalent regimes. The audience is the VP of Engineering, the head of Platform, the CISO's deputies, and principal engineers who will defend these choices to internal audit, external auditors, and regulators.

## Why it matters

Regulated organizations do not get to choose between velocity and control. Auditors, examiners, and customers contractually require that every production change be authorized, tested, segregated from its author, traceable, and recoverable. Most enterprise platform teams treat those requirements as a tax paid to the compliance function. This track takes the opposite view: well-engineered DevOps is the cheapest, most defensible way to meet those control objectives, and a platform team that owns the controls owns the velocity.

The business risk is concrete. A failed SOC 2 Type II opinion delays enterprise deals. A material weakness in change management triggers a remediation plan that consumes a quarter of platform capacity. A HIPAA breach or a PCI scope expansion triggers notifications, fines, and forensics. Conversely, organizations with mature pipelines and evidence capture routinely close audits in days, not months.

## What "good" looks like

- Every production change is the output of a pipeline that is itself version-controlled, reviewed, and audited; no human has standing write access to production.
- Auditors collect evidence by querying systems (Git, the CI/CD platform, the SIEM, the ticketing system), not by emailing engineers for screenshots.
- Segregation of duties is enforced by tooling: the engineer who writes a change cannot unilaterally approve and deploy it.
- Mean time to detect (MTTD) and mean time to recover (MTTR) for Sev 1 incidents are measured monthly and reported to the risk committee.
- Control coverage is mapped to a framework (NIST 800-53, ISO 27001 Annex A, SOC 2 Trust Services Criteria) and gaps are tracked as engineering work, not policy work.
- A new application onboards onto the platform with controls inherited by default, not bolted on per project.

## North Star outcomes

Track these four numbers; they are what executives and auditors care about.

| Outcome | Definition | Target range |
|---|---|---|
| Audit-readiness | % of in-scope controls with automated evidence | 80%+ |
| Deploy success rate | Deploys reaching prod without rollback | 95%+ |
| MTTR (Sev 1) | Detection to mitigation, rolling 90 days | < 60 minutes |
| Control coverage | % of production systems on the regulated platform path | 90%+ |

## Tradeoffs vs. Generic and SaaS tracks

| Concern | Enterprise (this track) | SaaS track | Generic track |
|---|---|---|---|
| Compliance baseline | HIPAA / PCI / FedRAMP / multi-framework | SOC 2 / ISO 27001 | Reasonable hygiene |
| Deploy cadence | Per release train, with gated promotions | Many per day | Daily-ish |
| Platform team size | 10-50+ across Platform, SRE, AppSec, Compliance Eng | 2-6 | 0-2 |
| Approval model | Multi-party, auditable, often async CAB | Automated checks + light review | Light review |
| Tooling stance | Enterprise tier, private/air-gapped capable | SaaS-first | Pragmatic mix |
| Change lead time | Hours to days | Minutes to hours | Hours |

The honest tradeoff: this track will produce lower raw deploy frequency than the SaaS track, and it should. The win is that a regulated enterprise running this playbook can deploy on Friday afternoon and still pass an audit on Monday morning.

## How to use this track

Read this overview and the [90-day roadmap](./11-roadmap-90day.md) first. Then read [Team Structure](./01-team-structure.md) and [Security](./08-security.md) before any tooling section, because the people and the controls model determine which tools you can defend. Treat each section as a target state to converge on over 12-24 months, not a quarterly deliverable.

## Common pitfalls

- Buying the enterprise tier of every tool before defining the controls each tool is supposed to support.
- Letting the compliance function design the pipeline. Let engineers design it and let compliance review it.
- Modernizing CI/CD while leaving the **Change Advisory Board** (**CAB**) unchanged, so every deploy still queues behind a Wednesday meeting.
- Treating "we have ServiceNow tickets" as evidence; auditors increasingly want machine-generated artifacts.

## Quick checklist

- [ ] You can name the executive accountable for change management.
- [ ] You have a current control matrix mapping engineering practices to your primary framework.
- [ ] No engineer has standing write access to production cloud accounts.
- [ ] You can produce, on demand, the full change history for any production system.
- [ ] Your pipelines are themselves under change control.
- [ ] The platform team has a roadmap reviewed by the CISO and the head of Internal Audit.
