---
title: Infrastructure as Code
track: saas
order: 4
summary: Terraform/OpenTofu by default, with modular reuse, remote state, drift detection, and environment parity.
---

# Infrastructure as Code

## Why it matters

ClickOps in AWS is technical debt with compounding interest: undocumented, un-reviewable, un-replayable. The first time you need to spin up a new region, rotate an IAM role at scale, or recover from a deletion, IaC pays for itself ten times over. IaC is also a hard requirement for any non-trivial compliance posture.

## What "good" looks like

- 100% of production cloud resources declared in code; ClickOps changes are flagged within 24h
- Three (or more) environments — dev, staging, prod — defined by the same modules with parameter differences
- Remote state with locking; no `terraform.tfstate` in repos, ever
- Drift detection runs daily and creates a ticket for any divergence
- Module changes tested in dev → staging before prod
- IAM, networking, and data layers separated so a teammate can't blow them up by accident
- A new engineer can spin up a full dev environment with one command

## Recommended default

**Terraform** (or **OpenTofu** if you want to hedge against HashiCorp's BSL license). Both are fine; they share the HCL ecosystem.

**Repo & module layout:**
- A dedicated `infrastructure/` repo (or top-level dir in monorepo)
- Composable modules: `vpc/`, `eks/`, `ecs-service/`, `rds/`, `iam-role/`, `dns/`
- Stacks per environment: `envs/dev`, `envs/staging`, `envs/prod` — each calls modules with parameters
- Use [Terragrunt](https://terragrunt.gruntwork.io/) when DRY across environments becomes painful

**Remote state**: S3 bucket + DynamoDB lock table per environment, encrypted with KMS, access-controlled. Or use **HCP Terraform** / **Spacelift** / **env0** for managed state + run pipelines.

**Pipeline:**
- PR runs `terraform fmt`, `validate`, `plan`; plan output is posted as a PR comment
- `tflint`, `tfsec`/`checkov` for policy checks
- `terraform apply` runs only after PR merge, gated by env (manual approval for prod)
- Use OIDC from GitHub Actions to AWS — no static credentials

**Drift detection:**
- `terraform plan` runs nightly across all stacks; non-empty plans alert the platform channel
- Or use **driftctl** / **Spacelift drift detection**

**Environment parity:**
- Same modules, different inputs. Differences are explicit (instance sizes, replica counts, retention days).
- No "we'll just disable that in dev" — disable it via input variable so the difference is reviewable.

## Naming, tagging, and policy
- Mandatory tags: `Environment`, `Service`, `Owner`, `CostCenter` (see [Cost](./10-cost.md))
- AWS Service Control Policies + IAM Permission Boundaries to keep blast radius small
- Sentinel/OPA policies for "no public S3", "no 0.0.0.0/0 SG ingress on prod"

> **Alternatives:**
> - **Pulumi**: pick when your team prefers TypeScript/Python/Go over HCL and wants real loops, types, and tests.
> - **AWS CDK**: pick if you're 100% AWS and want tight integration with AWS-specific patterns; harder to multi-cloud later.
> - **Crossplane**: pick when you're heavily on Kubernetes and want IaC reconciled by controllers, GitOps-style.

## Common pitfalls

- **Local state files** committed to git or living on someone's laptop
- **One giant Terraform root module** — every plan touches everything and blast radius is huge
- **Snowflake environments** — dev was hand-built once and is never re-derivable
- **Long-lived IAM users** for Terraform instead of OIDC roles
- **No drift detection** — console changes accumulate silently and IaC becomes fiction
- **Modules with too many inputs** trying to be all things to all callers; refactor into smaller composable modules

## Quick checklist

- [ ] Remote state with locking, encrypted at rest, access-logged
- [ ] OIDC federation from CI to AWS — no static cloud creds
- [ ] `plan` posted to every PR; `apply` requires merge + (for prod) manual approval
- [ ] Mandatory tag policy enforced via SCP or pre-apply check
- [ ] Daily drift detection with alerting
- [ ] Modules versioned (git tags or registry), pinned in callers
- [ ] `tfsec` or `checkov` runs on every PR
- [ ] No human has standing write access to prod cloud APIs
- [ ] One command to bootstrap a fresh dev account
- [ ] Disaster recovery runbook references IaC for re-creation
