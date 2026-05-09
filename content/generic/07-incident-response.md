---
title: Incident Response
track: generic
order: 7
summary: On-call rotations, severity levels, runbooks, and blameless postmortems that actually change behavior.
---

## Why it matters

Incidents are inevitable. What separates competent orgs from chronically-on-fire orgs is how quickly they detect, respond, and learn. A working incident process turns a 4-hour outage into a 20-minute blip, and turns the postmortem into your team's most useful meeting of the quarter.

## What "good" looks like

- Every Tier 1 service has a 24/7 on-call rotation owned by the team that wrote the code.
- On-call burden is sustainable: roughly one week per 6-8 weeks, fewer than 2 actionable pages per shift.
- Severity levels are defined and used consistently.
- Every Sev 1/Sev 2 gets a written postmortem within a week.
- Runbooks exist for the top failure modes of each Tier 1 service.
- Action items from postmortems are tracked, prioritized, and completed.

## Recommended default

**PagerDuty** for paging, a documented severity matrix, runbooks in your wiki, and a blameless postmortem template.

### Severity matrix

| Sev | Definition | Response | Comms |
|---|---|---|---|
| **Sev 1** | Major user-facing impact, revenue at risk, or data integrity threatened | Page immediately, all-hands incident, IC assigned | Public status page, exec notify |
| **Sev 2** | Partial impact, workaround exists, or limited customer subset | Page on-call, business-hours-OK if not actively degrading | Internal #incidents, status page if customer-visible |
| **Sev 3** | Degraded performance, no immediate user impact | Ticket, fix in next business day | Internal only |
| **Sev 4** | Minor issue, no impact | Backlog | None |

Make this visible in the runbook and in the on-call onboarding doc.

### On-call structure

- **Primary** acks within 5 minutes; **Secondary** is paged after 10. Manager/IC pool for Sev 1 coordination.
- Pay engineers for being on-call. The amount matters less than the principle.
- Weekly 15-min handoff meeting: active incidents, pending action items, noisy alerts.

### Incident process

1. **Detect** — alert fires or someone reports it.
2. **Acknowledge and triage** — assign severity. If unclear, default up.
3. **Assemble** — Sev 1: IC, comms lead, scribe, responders. Dedicated channel like `#inc-2026-05-09-checkout-down`.
4. **Mitigate first, diagnose second.** Roll back, scale up, fail over. Investigate after the bleeding stops.
5. **Communicate** every 30 min for Sev 1, even if "no change."
6. **Resolve and downgrade** when user impact is gone.
7. **Postmortem** within one week. Blameless. Timeline, contributing factors, owned action items.

### Runbooks

Every alert that pages must link to a runbook. A runbook is a checklist, not documentation: what the alert means, how to confirm it's real in 60 seconds, mitigation steps in priority order, who to escalate to, and links to dashboards and recent change history.

> **Alternatives:**
> - **Opsgenie** — pick if you're already in Atlassian. Functionally similar to PagerDuty.
> - **Grafana OnCall / Better Stack / Incident.io** — pick if PagerDuty pricing has become painful, or you want tighter observability integration.
> - **Self-hosted (Alertmanager + custom routing)** — only if you have specific compliance requirements; the operational cost is real.

For incident coordination, **Incident.io** or **Rootly** are worth their cost once you're handling a Sev 1 a month.

## Postmortems

Templates matter — use one. Include: summary, impact, duration; timestamped timeline; contributing factors (plural — there is no single "root cause" in a complex system); what went well, what did not, where you got lucky; and concrete, owned action items with dates.

**Blameless** means focusing on systems and processes, not individuals. "Why did the engineer push the bad config?" becomes "Why did our process allow a bad config to reach production without a check?"

## Common pitfalls

- **No severity definitions** — every incident becomes Sev 1, on-call burns out, and real Sev 1s lose urgency.
- **Postmortems without owned action items.** Pure theater.
- **Stale runbooks.** Test them during game days.
- **One person on-call every week** because nobody else knows the system. Cross-train aggressively.
- **Punishing engineers for incidents.** You will get fewer reports, not fewer incidents.
- **Skipping postmortems for "small" incidents.** Small incidents teach big lessons cheaply.

## Quick checklist

- [ ] Every Tier 1 service has a documented on-call rotation in PagerDuty (or equivalent).
- [ ] Severity levels are defined, written down, and used.
- [ ] Every page links to a runbook.
- [ ] You have a blameless postmortem template.
- [ ] Postmortem action items are tracked in your normal backlog.
- [ ] On-call hand-off happens weekly with a structured agenda.
- [ ] Engineers are compensated for being on-call.
- [ ] Status page exists and is updated during customer-facing incidents.
- [ ] You have run at least one game day in the last quarter.
