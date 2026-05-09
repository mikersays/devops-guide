---
title: Maturity model
type: assessment
summary: A 5-level maturity model across the 12 DevOps domains, with a quick self-assessment.
---

This is a tool for honest self-assessment, not a leaderboard. Most healthy organizations sit at Level 2 or 3 across most domains, with one or two reaching Level 4 because the business has demanded it. Aiming for Level 5 everywhere is a waste of money. The point of the model is to surface where you are uneven, decide which one or two domains to invest in next, and have a shared vocabulary with leadership when you ask for funding.

## The five levels

| Level | Name        | Description                                                                            |
| ----- | ----------- | -------------------------------------------------------------------------------------- |
| 1     | Initial     | Ad-hoc, person-dependent. Things work because specific people make them work.          |
| 2     | Managed     | Documented and repeatable for the common cases. Edge cases still require heroics.      |
| 3     | Defined     | Standardized across the org. New teams onboard onto an established way of working.     |
| 4     | Measured    | Instrumented end-to-end. Decisions are driven by metrics, not opinion.                 |
| 5     | Optimized   | Continuous improvement is the default mode. The system improves itself.                |

## Domain by level

| Domain               | Level 1 (Initial)               | Level 2 (Managed)                  | Level 3 (Defined)                   | Level 4 (Measured)                       | Level 5 (Optimized)                       |
| -------------------- | ------------------------------- | ---------------------------------- | ----------------------------------- | ---------------------------------------- | ----------------------------------------- |
| Team structure       | No clear ownership              | Squads named, RACI informal        | RACI documented, platform vs product split | Team topologies measured, friction tracked | Self-balancing teams, regular reshapes    |
| Source control       | Long-lived branches, force pushes | Branch protection on main         | Trunk-based, CODEOWNERS enforced    | Merge metrics tracked, review SLAs       | Auto-merge with policy, signed commits    |
| CI/CD                | Manual deploys, snowflakes      | CI green required to merge         | Standard pipeline template per stack | Pipeline metrics, flaky tests tracked    | Progressive delivery, auto rollback       |
| IaC                  | Click-ops, screenshots          | Some Terraform, manual applies     | All envs in IaC, modules reused     | Drift detection, plan/apply metrics      | GitOps reconciliation, policy-gated apply |
| Cloud platform       | One account, shared creds       | Per-env accounts, baseline VPC     | Landing zone, identity federated    | Account vending automated, guardrails measured | Self-service workloads, blast radius modeled |
| Observability        | Logs only, grep-driven          | Dashboards exist, alerts noisy     | Metrics, logs, traces unified       | SLOs defined, error budgets tracked      | SLO-driven release gates, alert quality scored |
| Incident response    | Whoever notices                 | On-call rotation, severity scale   | Runbooks per alert, IC role defined | MTTR tracked, postmortem actions closed  | Chaos exercises, prevention metrics       |
| Security             | Periodic pentest                | SAST in CI, secrets in vault       | DevSecOps gates, SBOM produced      | Vuln SLAs measured, exposure tracked     | Continuous control validation, threat modeling |
| Docs & knowledge     | Tribal, in heads and Slack      | Wiki exists, partly stale          | ADRs, runbooks linked from alerts   | Doc freshness measured, search ranked    | Internal portal, golden paths self-serve  |
| Cost                 | Bill is a surprise              | Budget alerts per account          | Tagging enforced, showback reports  | FinOps reviews, unit cost tracked        | Cost SLOs per service, automated rightsizing |
| Compliance           | Reactive to audits              | Controls listed, evidence manual   | Policy-as-code, evidence collected automatically | Continuous control monitoring          | Audit-ready any day, controls drift-checked |
| Roadmap & investment | Whatever is loudest             | Quarterly planning, mostly kept    | Themed bets, capacity modelled      | Outcome metrics per bet, kill criteria   | Continuous reprioritization on signal     |

## How to use this model

- **Run a quarterly self-assessment** with the platform leads and a few staff engineers. Score each of the 12 rows on a 1–5 scale. Disagreement is the point; the conversation surfaces where the org is operating differently than people think.
- **Share the heatmap with leadership**, not the average. The shape matters more than the number. A team at 4-3-3-3-3-2-2-2-3-3-2-3 has very different problems than one at 3-3-3-3-3-3-3-3-3-3-3-3 with the same average.
- **Use it to pick the next one or two investments.** Aim to lift your two weakest domains by one level over the next two quarters. Do not try to lift everything at once, and do not push any single domain past Level 4 unless the business has explicitly asked for it.
