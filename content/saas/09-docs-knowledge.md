---
title: Docs & Knowledge
track: saas
order: 9
summary: Notion or Confluence for prose, ADRs in-repo for decisions, and Backstage as a developer portal once service count makes it pay off.
---

# Docs & Knowledge

## Why it matters

In a fast-moving SaaS, the half-life of tribal knowledge is roughly the tenure of your most senior engineer. Without deliberate knowledge capture, every onboarding restarts from zero, every architectural debate gets re-fought, and every incident response depends on whoever happens to be awake. Docs are not bureaucracy — they are the substrate on which a team scales.

## What "good" looks like

- A new engineer can deploy a "hello world" service to staging on day 2 by following docs alone
- Every architectural decision worth disagreeing about has an ADR
- "Where does X live?" has one obvious answer for every X
- Runbooks are linked from alerts and tested during incidents
- Service ownership, dashboards, on-call, and dependencies are queryable in one place
- Docs are reviewed, dated, and pruned — old docs are worse than no docs

## Recommended default

A **three-tier** model. Each tier has a clear job; don't mix them.

### Tier 1 — Prose & process: Notion (or Confluence)

For: company handbook, team charters, onboarding, meeting notes, RFCs, postmortems.
- **Notion** for the modern startup default — fast, search-friendly, low-bureaucracy
- **Confluence** if you're Atlassian-shop or enterprise-adjacent

Discipline: every page has an owner and a "last reviewed" date. Run a quarterly archive sweep.

### Tier 2 — Decisions: ADRs in-repo

[Architecture Decision Records](https://adr.github.io/) live next to the code they describe, in `docs/adr/NNNN-title.md`. Format:

- **Context** — what problem and constraints
- **Decision** — what we chose
- **Consequences** — what we now have to live with
- **Status** — proposed / accepted / superseded by ADR-NNNN

Why in-repo? Decisions and code drift together; reviewing an ADR is a PR like any other; and old decisions stay readable forever via git.

### Tier 3 — Service catalog & runbooks: Backstage

Trigger to adopt: **15+ services**, or "I don't know who owns this" said in standup more than once a week.

Run **Spotify's Backstage** (open source) self-hosted on ECS/Fargate, or use **Roadie** (managed Backstage) to skip the ops. Wire it to:

- GitHub for service ownership (`catalog-info.yaml` per repo)
- PagerDuty for on-call
- Datadog or Grafana for dashboards
- Tech docs (MkDocs-flavored) generated from each repo

Below 15 services, a markdown table in your team wiki listing service / owner / repo / dashboard / runbook is enough.

### Runbooks

Every paging alert links to a runbook. Runbooks live in the service repo (`docs/runbooks/`) so they version with the code. Minimum content:

- Symptoms (what the alert looks like)
- Likely causes
- Diagnostic queries (with links to dashboards)
- Mitigations (in order of safety)
- Escalation (who, how)

Test runbooks during game days; stale runbooks are worse than no runbooks.

### Information architecture

Settle on a single home page that points to the engineering handbook, the service catalog, on-call and incident docs, the ADR index, and onboarding paths by role. A search experience that finds the right doc within 30 seconds is worth more than a third Notion admin.

> **Alternatives:**
> - **GitBook / Docusaurus / MkDocs** for public-facing docs: pick over Notion when you need versioned, code-adjacent product docs.
> - **OpsLevel** or **Cortex** as Backstage alternatives: managed, opinionated, faster to value.
> - **Slab** as a Notion alternative when you want a docs-first (not workspace-first) tool.

## Common pitfalls

- **Docs in 5 places** — Notion, Confluence, GitHub wikis, Google Docs, Slack pins — none of them authoritative
- **Stale runbooks** that point to deleted dashboards — discovered at 3am
- **Setup-only onboarding docs**, then nothing — engineers stall after week 1
- **ADRs nobody reads** because they are written for posterity rather than for review; keep them short
- **Adopting Backstage too early** — you have taken on a platform-team-sized maintenance project to catalog 4 services
- **No doc owners** — every page is "the team's" and therefore nobody's

## Quick checklist

- [ ] One canonical engineering home page with linked indexes
- [ ] ADR template in every service repo and at least one written ADR
- [ ] Runbook linked from every paging alert
- [ ] Service ownership recorded somewhere queryable
- [ ] Onboarding doc tested with the last 2 hires; gaps logged
- [ ] Quarterly doc archive / review sweep on the calendar
- [ ] Backstage (or equivalent) decision documented with trigger criteria
- [ ] Public status page and customer changelog (if applicable) wired to release flow
