---
title: Docs & Knowledge
track: generic
order: 9
summary: "Documentation strategy that survives turnover: ADRs, runbooks, service catalogs, and the discipline to keep them current."
---

## Why it matters

Documentation is one of the largest leverage points for an engineering org under 200 people, and the most consistently underinvested. Every month-long onboarding, every postmortem where "no one knew that service existed," every senior engineer who is a single point of failure — these are documentation problems in disguise. Good docs are not a deliverable; they are a side effect of working in a way that captures decisions where they happen.

## What "good" looks like

- A new engineer can ship to production in week one using only written docs.
- Architectural decisions are recorded — alternatives and reasoning, not just the conclusion.
- Every service has a README, a runbook, an owner, and a recent diagram.
- Tribal knowledge is treated as a bug, not a feature of seniority.
- Docs live close to the code or in a single canonical wiki — not scattered across five tools.
- Stale docs are a known problem with a documented review cadence.

## Recommended default

Two-tier structure:

1. **In the repo** — anything that changes with the code: READMEs, ADRs, diagrams, runbooks, API references.
2. **In a single wiki** — onboarding, org info, policies, "how we work." Pick **Notion** or **Confluence**; not both.

Concrete artifacts to standardize:

- **Service README** — what the service does, how to run locally, how to deploy, who owns it, where dashboards and runbooks live.
- **ADRs** — short markdown docs (1-2 pages) capturing significant decisions. Numbered, immutable once accepted, superseded rather than edited. Live in `docs/adr/`. Use the Michael Nygard template.
- **Runbooks** — one per Tier 1 service plus per known failure mode (see [Incident Response](./07-incident-response.md)). Linked from every alert.
- **Service catalog** — at 30+ services. **Backstage**, **Cortex**, **OpsLevel**, or a Markdown file in a `service-catalog` repo.
- **Onboarding doc** — a checklist new engineers follow in weeks 1-2. Owned by engineering management. Reviewed quarterly.
- **Diagrams as code** — **Mermaid**, **Structurizr**, or **D2**. Updated when the system changes.

> **Alternatives:**
> - **Confluence** — pick if you're already in Atlassian. Strong for policy docs, weaker for engineering markdown.
> - **GitBook / Docusaurus / Hugo** — pick for public-facing docs (developer portals, API references) generated from the code repo.
> - **Backstage** — pick once you have 30+ services and a platform engineer to own it. Powerful but operationally non-trivial.
> - **READMEs only** — under 15 engineers, a `docs/` directory and a shared drive is enough.

## ADR culture

ADRs are high-leverage. Each one costs an hour to write and saves weeks of "why did we do it this way" debates. Write one for any decision that meets two of these criteria: costs more than a person-week to reverse, affects more than one team, locks in a vendor or technology, or establishes a pattern others will follow. Keep them short — three paragraphs is fine.

## Documentation maintenance

Docs rot. Plan for it: every doc has a named owner (no owner = delete). Hold a quarterly "doc review" day per team, covering 10 stale pages each. Stamp wiki pages with a "last reviewed" date. Postmortems often reveal stale runbooks — fix them in the action items. Onboard new hires by having them update the docs they found wrong; it is the best forcing function in the industry.

## Common pitfalls

- **Documentation as a launch milestone** instead of an ongoing practice. It rots within a quarter.
- **Five tools for documentation.** Engineers cannot find anything. Consolidate.
- **No ownership.** Wiki pages with no last-modified date are noise.
- **ADRs that turn into book reports.** Three paragraphs is fine. If an ADR is longer than two pages, you are rationalizing, not deciding.
- **Diagrams in Lucidchart** that nobody can edit because the original author left and the license expired. Use diagrams-as-code.
- **Onboarding docs written once.** Have new hires improve them in their first week.
- **README says "see Confluence."** Confluence says "see README." Pick one.

## Quick checklist

- [ ] Every production repo has a README that follows a standard template.
- [ ] You have an ADR template and at least 5 ADRs written in the last 6 months.
- [ ] Every Tier 1 service has a runbook linked from its alerts.
- [ ] There is one canonical wiki tool, not three.
- [ ] Architecture diagrams exist and are version-controlled.
- [ ] Onboarding docs are followed by new hires and updated by them.
- [ ] You have a service catalog (or a flat file masquerading as one) listing every service and its owner.
- [ ] Stale docs are reviewed at least quarterly per team.
- [ ] Docs are searchable from one place.
