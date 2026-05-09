---
title: DevOps Org Setup Guide
type: landing
summary: A practical playbook for standing up a DevOps organization in your business.
---

## What this is

This guide is a working playbook for standing up a DevOps organization inside a real business. It targets engineering leaders, platform leads, and senior individual contributors who have been handed the job of "go fix our delivery" and want a structured starting point instead of a stack of vendor blog posts. The outcome is a defensible operating model: how your team is shaped, how code reaches production, how incidents are handled, and how you prove all of it to whoever needs to be convinced.

## The three tracks

The same 12 domains are covered three times, because the right answer depends on your context. Pick one track and stay in it. Cross-reference only when you have a specific reason to.

| Dimension              | Generic                       | Cloud-native SaaS                    | Enterprise / regulated                |
| ---------------------- | ----------------------------- | ------------------------------------ | ------------------------------------- |
| Team size              | 5–50 engineers                | 20–200 engineers                     | 200+ engineers, multiple BUs          |
| Deploy cadence         | Weekly to daily               | Multiple times per day               | Scheduled windows, change-managed     |
| Compliance posture     | Light — internal policy       | SOC 2, ISO 27001, GDPR               | HIPAA, PCI-DSS, FedRAMP, SOX, NIST    |
| Recommended start      | Source control + CI/CD        | Platform + observability             | Landing zone + governance             |

## What you'll get

- A 90-day rollout plan tailored to your track, with weekly milestones.
- A reference team structure, including a starter RACI for shared platform work.
- An opinionated CI/CD blueprint covering branching, gates, and deploy strategy.
- An IaC and cloud-platform layout you can adapt without starting from scratch.
- An incident-response model: severities, on-call, runbooks, postmortems.
- A maturity self-assessment so you can show leadership where you are and where you're going.

## The 12 domains

Every track walks the same 12 domains, in the same order:

1. **Overview** — the operating model and what "done" looks like for your track.
2. **Team structure** — squad shapes, platform vs product split, RACI.
3. **Source control** — branching, CODEOWNERS, branch protection, repo strategy.
4. **CI/CD** — pipelines, gates, environments, deploy strategies.
5. **IaC** — Terraform/Pulumi layout, modules, state, drift control.
6. **Cloud platform** — landing zones, networking, accounts, identity.
7. **Observability** — metrics, logs, traces, SLOs, dashboards.
8. **Incident response** — severities, on-call, runbooks, postmortems.
9. **Security** — DevSecOps, SAST/DAST/SCA, secrets, supply chain.
10. **Docs & knowledge** — ADRs, runbooks, internal portals.
11. **Cost** — FinOps, showback, rightsizing, commitments.
12. **Roadmap (90 day)** — sequenced rollout for the first quarter.

## How to use this guide

1. **Pick your track.** If unsure, work through [Choose your track](choose-your-track.md). Don't try to merge tracks.
2. **Walk the 12 domains in order.** They build on each other; source control before CI/CD, CI/CD before IaC rollout, platform before observability targets.
3. **Adapt the 90-day rollout.** The plan at the end of each track is a default sequence, not a contract. Reorder it for your constraints, but keep the dependencies intact.
