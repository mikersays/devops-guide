---
title: Incident Response
track: saas
order: 7
summary: PagerDuty or incident.io with humane on-call, blameless postmortems, and a published severity matrix.
---

# Incident Response

## Why it matters

Incidents are inevitable; chaos is not. A team that responds to outages with shared vocabulary, clear roles, and learning rituals improves every quarter. A team without those things repeats the same failure modes and burns out its best people. MTTR is a leadership metric, not just an ops one.

## What "good" looks like

- A documented severity matrix everyone can quote: SEV-1 / 2 / 3 with concrete examples
- Page → human eyes on it in < 5 minutes, 24/7
- Incident Commander role assigned within minutes, even if it's the only responder
- Incidents have a dedicated channel, real-time timeline, and a single source of status truth
- Customer comms (status page) updated within 15 minutes for SEV-1
- 100% of SEV-1/2 get a blameless postmortem within 5 business days; action items tracked to closure
- On-call rotation is humane: ≥ 1 week off between weeks on, comp exists, secondary covers primary

## Recommended default

**Paging: PagerDuty or incident.io.** Both are excellent; incident.io bundles incident management with paging if you don't already have one.
**Status page: Statuspage (Atlassian) or incident.io status pages.**
**Coordination: Slack** with a dedicated `#incident-XYZ` channel per incident.

### Severity matrix

| Severity | Definition | Examples | Response |
|---|---|---|---|
| **SEV-1** | Major customer impact; revenue or trust at risk | Auth down; checkout broken; data loss | Page IC + on-call; status page within 15min; exec notified |
| **SEV-2** | Significant degradation, partial impact | One region down; a tier of customers affected; severe latency | Page on-call; status page within 30min |
| **SEV-3** | Minor or internal impact; no customer pain | Background job lag; flaky non-critical endpoint | Ticket; address in business hours |

### Roles (even on a small team)

- **Incident Commander (IC)**: drives the response, makes calls, delegates. Not the hands-on-keyboard.
- **Tech Lead / Subject Matter Expert**: actually fixes things.
- **Communications Lead**: external status page + internal stakeholder updates.

On a 3-person on-call, one person can wear multiple hats — but the roles must be explicit.

### On-call rotation

- Default rotation: **1 week primary + 1 week secondary**, then 2 weeks off (so 1-in-4)
- Minimum rotation size: 4 people. Below that, you're burning your team out.
- **Compensation**: pay it. A flat per-week stipend or a per-page bonus. Free pizza is not compensation.
- **Hand-off ritual**: 15-minute meeting at start of shift to walk through open incidents, recent deploys, known weirdness
- **Follow-the-sun** once you have engineers in 2+ time zones — eliminate night pages where possible

### LLM-assisted tooling

The current crop of incident copilots — **Rootly Copilot**, **PagerDuty AIOps**, **incident.io Copilot** — are useful for the boring parts: summarizing a noisy Slack channel into a draft timeline, reconstructing what happened from logs and chat, generating a first-pass postmortem skeleton. Use them there. Do **not** let them drive severity calls, comms decisions, or remediation choices — those still need a human who owns the outcome. Treat their output the way you'd treat a junior engineer's first draft: helpful, never authoritative.

### Blameless postmortems

- Within 5 business days of any SEV-1/2
- Standard template: timeline, impact, root causes, contributing factors, what went well, what did not, action items with owners and due dates
- "Blameless" means: focus on the system that allowed the human action, not the human. Cite *The Field Guide to Understanding 'Human Error'* (Dekker) if anyone pushes back.
- Action items tracked in a board with the same rigor as feature work; aged ones surface in monthly leadership review
- Quarterly **incident review**: trends, recurring themes, systemic investments

> **Alternatives:**
> - **Opsgenie**: pick if you're an Atlassian shop; integration tax is lower.
> - **FireHydrant / Rootly**: pick if incident.io is too pricey or you want deeper Slack-native flows.
> - **Self-built on Slack + Google Docs**: works at < 10 engineers; graduate to a real tool by then.

## Common pitfalls

- **No IC role** — five engineers on a call all typing in production at once
- **Severity drift** — everything becomes SEV-2 because nobody wants to escalate
- **Postmortems that blame people** — engineers stop being honest, and you stop learning
- **Action items go to a graveyard backlog** — the same incident recurs in 6 months
- **No on-call comp** — your best engineers leave; juniors get the pager
- **Status page lags reality** — customers find out from social media first
- **No game days or chaos drills** — your runbooks are aspirational

## Quick checklist

- [ ] Severity matrix published and known by every engineer
- [ ] Paging tool wired to alerts (PagerDuty / incident.io)
- [ ] On-call schedule visible 90 days out
- [ ] On-call comp policy in writing
- [ ] IC role and runbook documented
- [ ] Status page automated where possible
- [ ] Postmortem template + tracked action items
- [ ] Quarterly incident review on calendar
- [ ] Game day / chaos drill at least twice a year
- [ ] Runbooks linked from every alert (see [Observability](./06-observability.md))
