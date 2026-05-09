---
title: Team Structure
track: generic
order: 1
summary: Roles, ownership models, and how to staff DevOps from your first hire through a 50-engineer org.
---

## Why it matters

Tooling decisions are reversible in months. Org design decisions take years to reverse. Get the ownership model right early and your DevOps practice compounds; get it wrong and you will spend the next two years untangling a "DevOps team" that became a ticket queue for the rest of engineering.

## What "good" looks like

- Product engineers own their services in production, including alerts and on-call.
- A small platform/ops function owns the shared substrate (CI, cloud accounts, observability stack, secrets).
- There is exactly one team accountable for any given system. No "shared ownership."
- Engineers can self-serve common changes (new service, new environment, new secret) without filing a ticket.
- The platform team has product-engineer customers, a roadmap, and SLAs — not a help desk.

## Recommended default

Adopt the **"You build it, you run it"** model with a thin platform team. Specifically:

- **0-15 engineers:** No dedicated DevOps role. One or two engineers spend ~30% of their time on infra. CTO or tech lead owns the practice.
- **15-40 engineers:** Hire your first **Platform/DevOps engineer**. Their job is to build paved paths, not to run deploys for other teams. Resist the "let's centralize all ops" instinct.
- **40-100 engineers:** A platform team of 2-4. Introduce an **SRE** function (or an SRE-minded platform engineer) to own SLOs, incident process, and reliability tooling.
- **100-200 engineers:** Split platform from SRE. Platform owns developer experience and infra primitives. SRE embeds with product teams or operates as a consultative function.

Define ownership explicitly with a service catalog. Every service has: a team owner, a tech lead, an on-call rotation, a runbook link, and a tier (T1/T2/T3) that drives SLO and on-call expectations.

> **Alternatives:**
> - **Centralized Ops team** — one team deploys everything. Picks itself when product engineers genuinely cannot or should not touch production (some regulated environments). Scales poorly.
> - **SRE pairing model** (Google-style) — SREs embed with product teams under a formal engagement contract. Picks itself at 100+ engineers with mature service ownership.
> - **DevOps as a guild** — no dedicated team; rotating champions across product teams. Works under ~20 engineers, breaks above.

## When to hire your first DevOps engineer

Hire when **two or more** of these are true:

- Deploys are blocked weekly because no one knows the pipeline.
- Cloud spend is climbing and no one can explain why.
- You have had two incidents whose root cause was infra config drift.
- Engineers are copy-pasting Terraform between repos.
- You are about to start a SOC 2 audit.

Hire a **generalist** first. Specialists (Kubernetes wizard, security engineer, FinOps lead) come later.

## Common pitfalls

- Naming a team "DevOps" and putting all the unwanted ops work in it. You have recreated the ops team you were trying to escape.
- Hiring a senior platform engineer with no peer and no mandate. That engineer will either burn out or build a snowflake nobody else can operate.
- Letting product teams opt out of on-call. The feedback loop between "writing code" and "getting paged" is the entire point of DevOps.
- Treating the platform team as a cost center instead of a product team. The platform team needs a roadmap, customer feedback, and the ability to say no.
- Org structures that imply ownership without naming a person. "The backend team owns it" is not ownership.

## Quick checklist

- [ ] Every production service has a named owning team in a service catalog.
- [ ] On-call responsibility lives with the team that wrote the code.
- [ ] You have written down what the platform team does and does not do.
- [ ] Your first DevOps hire has at least one peer or a clear sponsor.
- [ ] There is a documented escalation path for when product teams are blocked on infra.
- [ ] A new service can be created without a ticket to the platform team.
- [ ] Platform team work is tracked in a backlog with priorities, not Slack DMs.
