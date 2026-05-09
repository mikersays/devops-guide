---
title: Incident Response
track: enterprise
order: 7
summary: ITIL-aligned incident management with severity matrices, blameless postmortems, runbook discipline, and regulator-aware notification paths.
---

In a regulated environment, incidents have two parallel timelines. One is operational: detect, mitigate, recover, learn. The other is regulatory: assess, classify, notify, report. Most enterprises make the mistake of treating these as the same process. The rest let the regulatory timeline dominate the operational one. The goal is to run both well, with clear handoffs and no contamination of the engineering postmortem by legal posture.

## Why it matters

Regulators (HHS for HIPAA, card brands for PCI, state AGs for breach notification, sectoral regulators for finance) impose strict notification windows — often 72 hours or less from discovery. Missing those windows is itself a violation. Meanwhile, the engineering organization needs psychological safety to learn from incidents and prevent recurrence, and legal-driven processes erode that safety. A mature program holds both lines simultaneously.

The business risk is concrete: a Sev 1 outage that was handled well operationally but missed a notification window becomes a regulatory matter. A breach where the postmortem turned into a blame exercise produces no learning, and the same class of incident recurs.

## What "good" looks like

- A documented severity matrix with objective criteria (customer impact, data exposure, regulated-system involvement) and named decision authority for each level.
- An incident commander role that is rotated, trained, and authoritative during an incident; the IC is not the most senior engineer by default.
- A clear escalation path that triggers Legal, Privacy, and Communications for incidents touching regulated data, in parallel with operational response.
- Runbooks for the top 20 incident types, kept current via tabletop exercises and real-incident retros. Runbooks live in the same source control as the systems they describe.
- Blameless postmortems with a written template, a 5-business-day SLA from incident close, and action items tracked to completion in the engineering backlog.
- Regulator notification decisions made by Legal/Privacy with input from Security, on facts established by the engineering response - not the other way around.

## Recommended default

**PagerDuty for on-call orchestration**, **a dedicated incident management surface (FireHydrant or Rootly)**, and **a documented playbook governing the engineering/legal interface**:

- **Severity matrix** (sample, adjust to your regulatory posture):

  | Sev | Trigger | Response | Postmortem |
  |---|---|---|---|
  | Sev 0 | Confirmed breach of regulated data | IC, Exec, Legal, Privacy, CISO immediately; regulator clock starts | Mandatory, executive review |
  | Sev 1 | Major outage; Tier 1 service unavailable | IC, on-call, leadership notified | Mandatory, 5 business days |
  | Sev 2 | Significant degradation; SLO breach imminent | On-call, team lead | Required if customer-impacting |
  | Sev 3 | Minor; workaround available | On-call during business hours | Optional |

- **On-call**: PagerDuty schedules per service; primary and secondary; max 25% of any engineer's time on call; comp time or shift differentials in line with local labor law.
- **Incident channel**: auto-created in Slack or Teams via FireHydrant/Rootly; status page updated from the incident tool; transcript retained as evidence.
- **Escalation triggers**: data classification + system classification determines whether Legal/Privacy is auto-paged. AppSec is paged for any incident with a confirmed security dimension.
- **Postmortems**: written from a template (timeline, contributing factors, action items, customer impact, regulatory assessment). Reviewed in a weekly forum across Platform/SRE/AppSec; archived in a controlled location for audit.
- **Tabletops**: quarterly, rotating scenarios (ransomware, insider, cloud-region failure, supplier breach). Findings feed roadmap.
- **Break-glass**: a documented privileged access path (e.g. AWS IAM Identity Center emergency role + Just-in-Time approval) that auto-pages SecOps and triggers a mandatory post-use review.

## Alternatives

> **Alternatives:**
> - **Opsgenie + Jira Service Management**: pick this in Atlassian-standardized shops; reasonable on-call orchestration and ITSM, weaker on the incident-channel automation.
> - **ServiceNow ITOM with on-call modules**: pick this when ServiceNow is the corporate ITSM standard and integrating with CMDB/CAB is non-negotiable; expect heavier configuration burden.
> - **Incident.io**: pick this as a modern alternative to FireHydrant/Rootly; strong Slack-native workflow.
> - **PagerDuty + Statuspage + Confluence postmortems**: pick this for shops where you accept manual stitching between tools to avoid another vendor.

## Compliance mapping

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Incident response plan and procedures | CC7.3, CC7.4 | A.5.24, A.5.26 | IR-1, IR-4, IR-8 |
| Incident classification and escalation | CC7.3 | A.5.25 | IR-4 |
| Lessons learned / postmortem | CC7.5 | A.5.27 | IR-4, IR-8 |
| Regulator/customer notification | CC2.3, CC7.4 | A.5.5, A.5.6 | IR-6 |
| Tabletop exercises | CC7.3 | A.5.24 | IR-3 |

Note: HIPAA Breach Notification Rule (45 CFR 164.400-414), PCI-DSS Req 12.10, and state breach notification laws each have their own definitions of "breach" and timelines; the framework mapping does not replace specific regulatory analysis.

## Common pitfalls

- Letting the most senior engineer in the room default into the IC role; the IC needs to coordinate, not solve, and seniority biases toward solving.
- Postmortems that name individuals; the template should describe systems and decisions, not people.
- Conflating "customer impact" with "regulatory event"; a regulatory event has a clock and a notification authority, and the determination is not the IC's call to make.
- No tabletops, or tabletops only for the security team; the engineering response is the one that needs the practice.
- Runbooks in a wiki nobody updates; co-locate runbooks with code and review them when the system changes.
- Treating the break-glass path as legitimate routine access; it must trigger a review every time, with no exceptions.

## Quick checklist

- [ ] Severity matrix is published and named decision authorities are current.
- [ ] On-call rotations have primary, secondary, and exec escalation defined.
- [ ] Incident channel automation creates a record retained for the audit period.
- [ ] Top-20 runbooks exist, are versioned, and were touched in the last 12 months.
- [ ] Tabletop exercises run quarterly and include Legal/Privacy at least annually.
- [ ] Postmortem SLA is met for Sev 0/1 in 90%+ of cases.
- [ ] Break-glass access is logged, reviewed, and rare.
- [ ] Regulator notification playbook is owned by Legal, exercised, and current.
