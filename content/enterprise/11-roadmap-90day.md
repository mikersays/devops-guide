---
title: 90-Day Roadmap
track: enterprise
order: 11
summary: "A phased plan for an enterprise platform team: foundations and controls, pipelines and evidence, then scale and audit-readiness."
---

This roadmap is for the platform leader walking into a regulated organization with a mandate to modernize. It assumes you have buy-in from the CISO and the head of Engineering, a small starter team, and a calendar that already includes audit fieldwork. Ninety days is not enough to finish the program; it is enough to establish the foundations and earn the next nine months of runway.

## Why it matters

Regulated organizations rarely fail at DevOps because they cannot identify the right work. They fail because they tackle it in the wrong order: tools before structure, pipelines before identity, automation before evidence. This roadmap sequences the work so that each phase produces a defensible artifact and unblocks the next phase. By day 90 you should have a controls foundation, a working pipeline pattern with one product team on it, and a credible plan to scale.

The business risk of a poorly sequenced first quarter is concrete: you spend the political capital of a new mandate on visible-but-shallow wins, the audit shows up, and the program loses credibility before the deeper work lands.

## What "good" looks like

- Day 30: identity, accounts, source-control baseline are done. Auditors can see who has access to what.
- Day 60: one product team is shipping to production through the controlled pipeline; evidence flows automatically.
- Day 90: the second and third product teams are onboarding. The pattern is documented. The CISO and head of Internal Audit have signed off on the approach.
- Throughout: weekly progress visible to leadership; risks logged and triaged; no surprises.

## Recommended default

### Days 0-30: Foundations and Controls

Goal: put the controls foundation in place. Nothing fancy. Boring, defensible, documented.

- **Identity** (week 1-2): consolidate human access through the corporate IdP. SSO + SCIM into source control, cloud, and CI/CD. Eliminate local accounts and long-lived cloud keys for humans. See [Cloud Platform](./05-cloud-platform.md).
- **Account/landing zone** (week 2-3): if Control Tower / Landing Zones is not deployed, deploy it now. If it is, audit it: SCPs, log archive, security tooling account. Do not migrate workloads yet.
- **Source control baseline** (week 1-3): branch protection, signed commits, CODEOWNERS coverage measurement, audit log streaming. See [Source Control](./02-source-control.md).
- **Controls matrix** (week 2-4): with Compliance Engineering, draft the mapping of in-scope engineering practices to your primary framework. This is the document that drives everything else.
- **Team charter** (week 1-4): publish charters for Platform, SRE, AppSec, Compliance Engineering. Define the CAB modernization plan. See [Team Structure](./01-team-structure.md).
- **Day 30 deliverable**: an audit-credible baseline plus a one-page roadmap signed by CISO, VP Eng, and Internal Audit.

### Days 31-60: Pipelines and Evidence

Goal: build the controlled pipeline pattern, prove it on one product team, capture evidence automatically.

- **Reusable workflows** (week 5-6): Platform writes the build/scan/sign/deploy reusable workflows in a shared `.github` (or GitLab equivalent) repo. Includes the security scans from [Security](./08-security.md) and the evidence capture from [CI/CD](./03-cicd.md).
- **OIDC federation** (week 5-6): replace long-lived CI cloud credentials with OIDC. Ephemeral runners deployed.
- **Golden modules** (week 6-8): minimum viable module library for VPC, compute, data store, IAM. Sentinel/OPA policies for the top 10 controls. See [IaC](./04-iac.md).
- **Pilot product team** (week 6-9): pick one Tier 2 service in a willing team. Migrate them to the controlled pipeline. Capture every friction point.
- **Evidence pipeline** (week 7-9): pipeline runs write evidence bundles to immutable storage; SIEM ingests them; first dashboard for control coverage exists.
- **Observability baseline** (week 8-10): audit log streaming to SIEM working end-to-end for source control, CI/CD, IdP, cloud control plane. See [Observability](./06-observability.md).
- **Day 60 deliverable**: one product team in production through the controlled pipeline, with end-to-end evidence retrievable in one query.

### Days 61-90: Scale and Audit-Readiness

Goal: prove the pattern scales, prepare for the next audit, set the next-quarter agenda.

- **Onboard 2-3 more teams** (week 11-12): apply lessons from the pilot. Document the onboarding playbook. Measure time-to-onboard.
- **Incident response** (week 10-12): publish severity matrix, on-call rotation policy, postmortem template. Run one tabletop. See [Incident Response](./07-incident-response.md).
- **Vulnerability management SLAs** (week 11-12): publish, instrument, dashboard. Hold the first SLA review.
- **Documentation discipline** (week 11-13): policy repo live, ADR template adopted, service catalog populated for in-scope services. See [Docs and Knowledge](./09-docs-knowledge.md).
- **Cost foundations** (week 12-13): tagging policy enforced for all new resources; first showback dashboards published. See [Cost](./10-cost.md).
- **Audit dry run** (week 13): pick a control area (change management or access provisioning). Run an internal audit dry run with Internal Audit. Fix what fails.
- **Day 90 deliverable**: 2-3 teams in production on the platform, audit dry run passed, 6-month roadmap committed.

## Alternatives

> **Alternatives:**
> - **120-day plan with a heavier Day 0-30**: pick this when the existing identity and account hygiene is so weak that 30 days is not realistic; do not skip the foundations.
> - **Parallel-track plan with Compliance Engineering working independently**: pick this when you have headcount; Compliance Engineering can build the evidence pipeline in parallel with Platform building the deploy pipeline, meeting in the middle.
> - **Audit-first plan**: pick this when an audit is in the next 60 days and the priority is not failing it; sequence the controls matrix and evidence work first, take the velocity hit, recover later.

## Compliance mapping

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Risk assessment and remediation planning | CC3.1, CC3.2 | A.5.4, A.5.7 | RA-3, PM-9 |
| System development lifecycle planning | CC8.1 | A.5.8 | SA-3 |
| Project management oversight | CC1.3 | A.5.2 | PM-7 |

The roadmap itself is not directly an audit control, but the artifacts produced (controls matrix, evidence pipeline, documented team charters) are.

## Common pitfalls

- Trying to migrate every team in the first quarter; one team done well beats five done badly.
- Letting the pilot team be one of your strongest engineering teams, who would have succeeded on any platform; pick a representative team instead.
- Skipping the audit dry run because "we'll be ready by the real audit"; the dry run is the calibration.
- Buying tooling before the controls matrix is drafted; you will end up with tools that do not map to the controls you must demonstrate.
- Publishing scoreboards of team adoption; healthy peer pressure is good, but onboarding speed is a Platform metric, not a product-team metric.
- Forgetting to invest in the platform team's own runbooks and on-call before the platform itself becomes critical infrastructure.

## Quick checklist

- [ ] Day 30 deliverable signed by CISO, VP Eng, Internal Audit.
- [ ] OIDC federation live; long-lived cloud keys removed from CI.
- [ ] Reusable workflows published, versioned, owned by Platform + AppSec CODEOWNERS.
- [ ] At least one product team in production via the controlled pipeline by day 60.
- [ ] Evidence bundles retrievable for every production deploy in the last 30 days.
- [ ] Incident response process documented and exercised once.
- [ ] Audit dry run completed with Internal Audit before day 90.
- [ ] 6-month roadmap committed with measurable adoption targets.
