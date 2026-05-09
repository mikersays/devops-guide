---
title: Source Control
track: enterprise
order: 2
summary: Source control as the system of record for change authorization, with branch protection, signed commits, CODEOWNERS, and evidence retention.
---

In a regulated environment, the Git repository is not just a developer tool. It is the authoritative record of who proposed which change, who reviewed it, and when it became eligible for production. Auditors will read your branch protection settings the way they read your access control matrix.

## Why it matters

If you cannot prove, at any point in the past seven years, that a specific change to a regulated system was reviewed by someone other than its author, you have a control gap. If you can produce that evidence in seconds with a query, you have a control. The difference is almost entirely a matter of how source control is configured. Most enterprises already have GitHub Enterprise or GitLab; most fail to use those tools as the systems of record they could be.

Beyond audit, the business risk of weak source control is supply-chain compromise. Unsigned commits, missing branch protection, and overly broad write permissions are the entry points for the breaches that show up in the SEC filings of your peers.

## What "good" looks like

- The default branch is protected: required reviews, required status checks, no force pushes, no deletions, no admin bypass without an audit event.
- Every commit reaching the default branch is signed with a verified key tied to a corporate identity.
- CODEOWNERS files define mandatory reviewers for sensitive paths (IaC, pipelines, schema, IAM policies). Reviewers from CODEOWNERS cannot be the change author.
- Repository creation, archival, and permission changes flow through automation; ad-hoc admin actions trigger alerts to AppSec.
- Evidence (PR metadata, review approvals, status check results) is retained for the longer of seven years or your contractual obligation, in a tamper-evident store.
- Service accounts and bots have scoped, short-lived tokens; no long-lived personal access tokens for automation.

## Recommended default

**GitHub Enterprise Cloud with Enterprise Managed Users (EMU)** or **GitHub Enterprise Server** for air-gapped scenarios. Configure the org as follows:

- SSO via your IdP (Okta, Entra ID, Ping); SCIM provisioning; no local accounts.
- Branch protection rulesets applied at the org level, scoped by repo topic, so new repos inherit the right policy.
- Required signed commits via SSH or GPG keys issued through the IdP; rotate annually.
- Required pull request reviews: minimum two approvers, at least one from CODEOWNERS, dismiss stale reviews on push, require resolution of conversations.
- Required status checks: SAST, SCA, secret scan, IaC policy scan, build, unit tests. See [Security](./08-security.md) for the full list.
- GitHub Advanced Security enabled: secret scanning with push protection, code scanning, Dependabot.
- Audit log streaming to your SIEM. See [Observability](./06-observability.md).

For the monorepo vs polyrepo question at scale: prefer a small number of well-bounded repos per business domain. A single global monorepo is feasible (Bazel/Pants tooling required) but creates blast-radius and access-control challenges in regulated contexts. Pure polyrepo sprawl is worse: you cannot enforce consistent CODEOWNERS, and dependency management becomes an audit finding. Aim for one repo per service-aligned team, with shared libraries in a small number of platform repos.

## Alternatives

> **Alternatives:**
> - **GitLab Ultimate (self-managed or Dedicated)**: pick this when you need built-in CI, container registry, and security scanning in one product, or when SaaS is contractually impossible and GitHub Enterprise Server is undesirable. Strong in FedRAMP-adjacent environments via GitLab Dedicated for Government.
> - **Azure DevOps**: pick this when your org is deeply standardized on Microsoft and Entra ID, and you accept that the product roadmap lags GitHub. Still defensible for regulated workloads.
> - **Bitbucket Data Center**: pick this only when an existing Atlassian footprint and self-hosting requirements make migration costlier than the friction. Increasingly hard to defend for new builds.

## Compliance mapping

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Code review enforcement | CC8.1 | A.8.32 | CM-3, SA-11 |
| Segregation of duties (author != approver) | CC1.4 | A.5.3 | AC-5 |
| Signed commits and provenance | CC7.1 | A.8.28 | SA-10, SI-7 |
| Audit log retention | CC7.2 | A.8.15 | AU-2, AU-11 |
| Access provisioning via IdP | CC6.1, CC6.2 | A.5.16, A.5.18 | AC-2 |

## Common pitfalls

- Allowing organization owners to bypass branch protection "for emergencies"; this single setting becomes the audit finding.
- CODEOWNERS files that list teams nobody is on, or individuals who left two years ago.
- Long-lived personal access tokens stored in CI; rotate to short-lived OIDC federation.
- Treating "approved" PRs as evidence without retaining the underlying review metadata; export and retain it.
- Letting one repo per microservice grow to thousands of repos with no consistent ruleset; use rulesets and repo topics.
- Permitting force-push on any branch in regulated repos, including feature branches that touch production paths.

## Quick checklist

- [ ] Default branch protection is on for every repo classified as in-scope.
- [ ] CODEOWNERS coverage is measured and reported; gaps have owners.
- [ ] Signed commits are required on the default branch.
- [ ] All write access is mediated by SSO and reviewed quarterly.
- [ ] Audit logs stream to the SIEM with retention defined in policy.
- [ ] No long-lived PATs for automation; OIDC or short-lived tokens only.
- [ ] Repo creation is automated and applies the correct ruleset by classification.
- [ ] A query can produce the full review history of any production change in under five minutes.
