---
title: Team Structure
track: saas
order: 1
summary: You build it, you run it. Spin up a platform team only when stream-aligned teams start blocking on shared concerns.
---

# Team Structure

## Why it matters

Conway's Law is undefeated: your architecture mirrors your org chart. In a 5–50 person SaaS, the wrong team topology will silently bottleneck every shipping initiative, regardless of how good your CI is. Get this right and you compound; get it wrong and you will re-org annually.

## What "good" looks like

- Stream-aligned teams own their services end-to-end: design, build, deploy, page, fix
- Mean team size is 4–8; teams are long-lived, not project-based
- No central "ops" team gates production — engineers ship their own code
- A platform team exists only when its absence is a measurable drag (typically once you cross ~20–25 engineers)
- On-call duty is shared by the team that wrote the code, with humane rotation
- Cognitive load per team is bounded — a team owns 1–4 services, not 20

This is the [Team Topologies](https://teamtopologies.com/) model: stream-aligned, platform, enabling, and complicated-subsystem teams.

## Recommended default

**Phase 1 (5–15 engineers): One team, no platform.**
Everyone is stream-aligned. Designate a tech lead who owns "platform health" as 20% of their time. Tooling is bought, not built. The whole team is on-call together.

**Phase 2 (15–30 engineers): Two-pizza product teams + a virtual platform guild.**
Split into 2–3 product-aligned teams. A weekly "platform guild" of one volunteer per team standardizes CI templates, Terraform modules, observability defaults. No dedicated headcount yet.

**Phase 3 (30–50+ engineers): Dedicated platform team of 2–4.**
Form when you observe ≥3 of these signals:
- Engineers ask "how do I deploy a new service?" and there's no clear owner
- CI pipelines fork wildly across repos
- Observability is inconsistent, IR depends on tribal knowledge
- A non-trivial percent of senior IC time goes to infra plumbing
- Multiple teams are independently solving the same auth, secrets, or deployment problem

The platform team's mandate: build a **paved road** (golden path) — opinionated templates, shared modules, internal developer portal — that makes the right thing the easiest thing. Treat the paved road as a product; product teams are your customers.

> **Alternatives:**
> - **Embedded SREs**: rotate one platform engineer into a product team for 1–2 quarters. Pick when a single team is consistently behind on reliability.
> - **DevOps-as-a-service contractor**: a fractional staff engineer setting up the initial paved road. Pick when you have budget but not the right hire yet.
> - **Pure "all engineers do everything" forever**: works up to ~25 engineers; beyond that you're paying a platform tax in fragmentation.

## Common pitfalls

- **Hiring "DevOps engineers" as a silo** — you have recreated the wall between Dev and Ops
- **Platform team becomes a ticket queue**, not a product team — the platform team is now a bottleneck
- **No one owns reliability** because "we all do" — in practice nobody does
- **Cognitive overload**: one team owns 12 microservices and burns out
- **Skipping the enabling team mode** — platform engineers should teach, not gatekeep

## Quick checklist

- [ ] Every service has a named owning team in a service catalog
- [ ] On-call rotation per team, not per company (once > 1 team)
- [ ] Tech lead per stream-aligned team with explicit platform-health time
- [ ] Documented criteria for when to spin up a platform team
- [ ] Platform team (when it exists) tracks DX metrics: time-to-first-deploy, paved-road adoption %
- [ ] Quarterly cognitive-load review per team
- [ ] No "deploy team" or "release engineer" role — see [CI/CD](./03-cicd.md)
- [ ] Org chart published and updated; teams have charters
