---
title: Infrastructure as Code
track: enterprise
order: 4
summary: Terraform Enterprise with policy-as-code, golden modules, drift detection, and strict environment isolation.
---

Infrastructure as Code in a regulated organization is not about reproducibility for its own sake. It is the mechanism that puts cloud configuration under change control, enforces policy before resources exist, and produces evidence that production infrastructure matches an approved state. If your cloud configuration drifts from code, your control framework drifts with it.

## Why it matters

Most cloud-related audit findings are not about missing controls. They are about controls that existed in policy, were implemented manually once, and then silently decayed. IaC, run through a controlled pipeline with policy-as-code gates, converts a written policy into an enforced control. IaC also produces the artifact auditors increasingly ask for: a deterministic description of what production should look like, with a Git history of every approved change.

In a regulated org, the cost asymmetry of catching IaC defects late is what makes policy-as-code worth the friction. A misconfigured S3 bucket, an over-permissive security group, a forgotten public RDS instance, or a workload that landed in a non-FedRAMP region all start as fifteen-line diffs that a Sentinel or OPA policy would have rejected in ten seconds at PR time. Caught in a pen test, they are a remediation ticket; caught in a customer breach disclosure, they are a Form 8-K Item 1.05 filing and a year of customer-trust repair.

## What "good" looks like

- All cloud infrastructure of any consequence is defined in code; the cloud console is read-only for engineers in production.
- A small set of golden modules, owned by Platform, encode the controls (encryption, logging, tagging, network placement). Product teams compose modules; they do not write low-level resources for regulated workloads.
- Policy-as-code runs in pre-merge CI and again at apply time. Violations block the apply, not just warn.
- State is centrally managed, encrypted, access-controlled, and versioned. No state files in repos or laptops.
- Drift between code and reality is detected daily and either reconciled or treated as an incident.
- Environments (prod, non-prod, regulated, public) are isolated by separate state, separate credentials, and separate accounts. A stray apply cannot cross the boundary.

## Recommended default

**Terraform Enterprise (or HCP Terraform for Business)** as the orchestrator, with the following layout:

- **Workspaces** organized by environment and domain: `payments-prod`, `payments-nonprod`, `platform-shared-prod`, etc. Workspace-level RBAC mirrors team ownership.
- **Sentinel policies** at the organization level for hard controls: no public S3 buckets in regulated workspaces, mandatory KMS encryption, mandatory tagging, region allow-lists for FedRAMP/data-residency, no IAM wildcards in production.
- **Golden modules** in a private module registry: `vpc`, `eks-cluster`, `rds-postgres`, `s3-regulated-bucket`, `iam-role-with-boundary`. Modules pin provider versions and bake in the controls.
- **VCS-driven workflow**: PRs to the IaC repo trigger speculative plans; merges trigger applies via Terraform Enterprise agents inside the cloud account. No local applies to production.
- **Drift detection**: Terraform Enterprise drift detection runs daily on production workspaces; results post to the SIEM and to the responsible team. Persistent drift is a Sev 3 incident.
- **State isolation**: each workspace has its own remote state, encrypted with a workspace-scoped KMS key. Cross-workspace data passes through published outputs, not direct state reads.

For shops that prefer open tooling: **OpenTofu + Spacelift** or **OpenTofu + Atlantis + OPA** is a defensible alternative, particularly where Terraform Enterprise licensing is contested.

## Alternatives

> **Alternatives:**
> - **OpenTofu + Spacelift**: pick this when you want a managed orchestrator without HashiCorp Terraform licensing, and OPA-based policy is acceptable to your auditors.
> - **Pulumi Business Critical**: pick this when your engineers strongly prefer general-purpose languages and you need policy-as-code (CrossGuard) plus secrets integration. Stronger for application-adjacent infra.
> - **AWS CDK + CDK Pipelines**: pick this only for AWS-monoculture shops; weaker for multi-cloud and harder to defend as the central control plane.
> - **Crossplane**: pick this when Kubernetes is already your control plane and you want infrastructure reconciled like application state.

## Compliance mapping

> Framework versions per [Overview](./00-overview.md): Annex A clauses reference ISO/IEC 27001:2022; NIST controls reference 800-53 Rev 5; SOC 2 TSC references are the 2017 criteria with the 2022 points-of-focus update.

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Configuration management baseline | CC7.1, CC8.1 | A.8.9, A.8.32 | CM-2, CM-3, CM-6 |
| Policy enforcement before deployment | CC6.6, CC7.1 | A.8.9 | CM-7, SA-15 |
| Drift detection and reconciliation | CC7.2 | A.8.16 | CM-2, CM-6, SI-7 |
| Encryption configuration enforcement | CC6.1, CC6.7 | A.8.24 | SC-13, SC-28 |
| Network segmentation as code | CC6.6 | A.8.22 | SC-7 |

## Common pitfalls

- Letting "ClickOps" persist for "small" changes; small changes are how baselines decay.
- Golden modules that are too rigid; product teams will fork them and you lose the control surface. Make composition flexible and defaults strict.
- Running Terraform from local machines or unmanaged CI runners; you lose the audit trail and the credential isolation.
- Using a single state file for the entire org; blast radius and access control become unmanageable.
- Treating Sentinel/OPA policies as advisory; if they do not block, they are documentation, not controls.
- Long-lived cloud credentials in Terraform Cloud workspaces; use dynamic credentials/OIDC.

## Quick checklist

- [ ] Production cloud accounts are read-only for humans; writes only via IaC pipelines.
- [ ] Policy-as-code blocks (not warns) on critical violations: encryption, public exposure, region, IAM wildcards.
- [ ] Golden modules exist for VPC, compute, data stores, IAM, and are versioned.
- [ ] State is centralized, encrypted, and access-controlled per workspace.
- [ ] Drift detection runs at least daily in production and surfaces in the SIEM.
- [ ] No local `terraform apply` is possible against production credentials.
- [ ] Module changes require Platform and AppSec review in CODEOWNERS.
- [ ] Terraform Enterprise/orchestrator credentials are short-lived (OIDC or dynamic provider credentials).
