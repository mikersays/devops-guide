---
title: Team Structure
track: enterprise
order: 1
summary: How Platform Engineering, SRE, AppSec, and Compliance Engineering split responsibilities and modernize the CAB.
---

In a regulated org of 200+ engineers, "DevOps" is not a team. It is a contract between four groups: Platform Engineering, **Site Reliability Engineering** (**SRE**), Application Security (AppSec), and Compliance Engineering. The structure exists to enforce segregation of duties, distribute on-call load, and produce auditable evidence as a side effect of normal work.

## Why it matters

Auditors and regulators look hard at who can change what. Concentrating change authority in a single team is a control weakness even when it feels efficient. Spreading it across four functions with clear interfaces gives you defensible segregation, resilience under headcount loss, and a credible answer when someone asks "who reviewed this production change at 2 a.m.?"

The business risk is twofold. A poorly-bounded platform team becomes the single chokepoint for every product team's roadmap, and engineering velocity collapses across the org. An under-resourced compliance function cannot keep up with engineering change, and undetected control failures accumulate and surface during audit fieldwork.

## What "good" looks like

- Platform Engineering owns the developer-facing platform: golden paths, IaC modules, CI/CD templates, internal developer portal. They are not on the production deploy path for product teams.
- SRE owns reliability standards, on-call rotations, incident command, SLO frameworks, and the privileged access path for break-glass.
- AppSec owns the security tooling that runs in pipelines (SAST, DAST, SCA, secret scanning), threat modeling, and the vulnerability management SLA.
- Compliance Engineering (sometimes called GRC Engineering) owns control automation, evidence collectors, and the mapping between engineering practices and the control framework.
- A modernized Change Advisory Board reviews policy and exceptions, not every deploy. Standard changes are pre-approved by virtue of running through the controlled pipeline.
- Product engineers own their services end-to-end, including on-call, but operate inside guardrails set by the four functions above.

## Recommended default

Org chart, for a 200-engineer regulated org:

- **Platform Engineering** (8-15 engineers): an internal product team. Their customers are product engineers. Output: paved roads, templates, the developer portal.
- **SRE** (6-10 engineers): embedded or federated against critical product lines. Output: SLOs, runbooks, incident response capability.
- **AppSec** (4-8 engineers, often dotted-lined to CISO): security engineers who write code, not auditors. Output: pipeline controls, threat models, vuln triage.
- **Compliance Engineering** (3-5 engineers, dotted-lined to CISO or Internal Audit): the bridge between framework language and engineering reality. Output: evidence pipelines, control narratives, audit response.

For the **CAB**, replace the weekly meeting with a tiered model:

- **Standard changes**: pre-approved change types that flow through the pipeline with no human CAB review. This should cover 80%+ of changes within a year.
- **Normal changes**: reviewed asynchronously in the ticketing system by named approvers from CODEOWNERS plus a peer from another team for SoD.
- **Emergency changes**: post-hoc review by the CAB chair within 24 hours, with full evidence pack.

## Alternatives

> **Alternatives:**
> - **Embedded model** (Spotify-style squads with embedded SRE/AppSec): pick this when product lines are independent enough to support their own specialists and you have the headcount.
> - **Centralized model** (one large Platform org with internal sub-teams): pick this when you need tight control over a single platform and product teams are not yet mature enough to own production.
> - **Hybrid federated model**: a central Platform team plus embedded SRE/AppSec champions in each product group, meeting weekly. Most common at the 500-engineer scale.

## Compliance mapping

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Segregation of duties between author and approver | CC1.4, CC8.1 | A.5.3, A.8.2 | AC-5 |
| Defined roles and responsibilities | CC1.3 | A.5.2 | PS-2 |
| Change advisory / authorization process | CC8.1 | A.8.32 | CM-3 |
| Personnel screening for privileged access | CC1.4 | A.6.1 | PS-3 |

Mappings are conservative; your auditor will have opinions on which controls map cleanly.

## Common pitfalls

- Naming a "DevOps team" that absorbs Platform, SRE, and AppSec; you lose segregation of duties and the ability to scale specialists.
- Letting the CAB meeting persist as the de facto deploy gate; this incentivizes batching and large risky releases.
- Putting Compliance Engineering inside the Internal Audit function; auditors cannot build the systems they audit.
- Hiring Platform engineers who want to operate everything; the goal is to enable product teams, not to be the bottleneck.
- Ignoring the on-call burden on the platform team itself; their pager load grows with platform adoption.

## Quick checklist

- [ ] Each of the four functions has a named leader and a written charter.
- [ ] CODEOWNERS files exist and reflect actual ownership, not historical.
- [ ] At least 50% of production changes are classified as standard and bypass CAB meetings.
- [ ] Emergency change procedure is documented and was used in a tabletop in the last 12 months.
- [ ] Platform team has a public roadmap and intake process for product teams.
- [ ] On-call rotations meet your jurisdiction's working-time requirements.
- [ ] No single engineer is the only person who can perform any privileged production action.
