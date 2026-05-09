---
title: Infrastructure as Code
track: generic
order: 4
summary: Picking an IaC tool, structuring environments for parity, and managing state without losing weekends.
---

## Why it matters

If your infrastructure is not in code, it is not reviewed, not repeatable, and not recoverable. The first time someone deletes a VPC by hand at 2 a.m., you will wish every resource had a `terraform apply` behind it. IaC also satisfies auditors, makes onboarding tractable, and turns "rebuild this environment in a new region" from a six-week project into a routine Tuesday.

## What "good" looks like

- Every cloud resource that matters is defined in code and reviewed via PR.
- Environments (dev/staging/prod) are described by the same modules with different inputs.
- State is stored remotely with locking. No one runs IaC from a laptop with local state.
- Drift between code and reality is detected automatically and treated as a bug.
- Bootstrapping a new environment from scratch is a documented, exercised procedure — not a legend.
- Secrets do not live in IaC repos. Resource references do.

## Recommended default

**OpenTofu** (or Terraform if your org has no concerns about the BSL license shift) with remote state in your cloud's object storage and a state-locking mechanism.

Concrete setup:

- **Tool:** OpenTofu 1.7+ or Terraform 1.5+. Still interchangeable for new projects.
- **State backend:** S3 + DynamoDB for locking on AWS (equivalents on GCP/Azure). Encrypted, versioned.
- **Repo layout:** one repo for shared modules, one repo or directory per environment. Each environment owns its state file. Avoid one giant state file — blast radius is the whole company.
- **Modules:** thin wrappers around cloud resources for custom needs; vetted public modules (e.g., `terraform-aws-modules`) for VPC, EKS, RDS.
- **Pipeline:** `plan` on PR (posted as a comment), `apply` on merge to `main`. Apply runs in CI with scoped credentials.
- **Drift detection:** daily scheduled `plan` against production; non-zero diff alerts.

Recommended layout:

```
infra/
  modules/        # reusable building blocks
  envs/
    dev/
    staging/
    prod/
  global/         # IAM, DNS, org-level resources
```

> **Alternatives:**
> - **Pulumi** — pick if your team genuinely prefers writing infra in TypeScript/Python/Go and you have the discipline to keep it from turning into application code. Smaller community than Terraform.
> - **AWS CDK / CDKTF** — pick if you're AWS-only and your engineers are TypeScript-fluent. CDK synthesizes CloudFormation, which has its own constraints (slower rollbacks, drift handling).
> - **Crossplane** — pick if you're already heavily Kubernetes-native and want to manage cloud resources via the Kubernetes API. Higher operational complexity.

For Kubernetes-specific config, layer **Helm** or **Kustomize** on top — IaC tools manage the cluster, app config tools manage what runs in it.

## Environment parity

Use the same module code for every environment. Differ only in:

- Input variables (instance sizes, replica counts, whether a thing exists at all).
- Account/project boundaries (use separate cloud accounts per environment — see [Cloud Platform](./05-cloud-platform.md)).

Resist the urge to make staging "cheaper" by removing components that prod has. The point of staging is that bugs surface there, not in prod.

## Common pitfalls

- **One monolithic state file** for everything. A typo in a dev module rolls back prod.
- **Manual changes in the console** that are not reflected back in code. Drift compounds. Within a year, your IaC is fiction.
- **Storing secrets in `.tfvars`** committed to the repo. Use a secrets manager and reference by ARN or path.
- **Letting modules evolve without versioning.** Pin module versions; update deliberately.
- **Running `apply` from laptops.** Credentials leak, state corrupts, audits fail.
- **Auto-applying on merge with no review of the plan.** A human (or a policy engine) should look at the plan before destructive changes hit prod.

## Quick checklist

- [ ] All production cloud resources are defined in IaC.
- [ ] State is stored remotely with locking and versioning enabled.
- [ ] Each environment has its own state file.
- [ ] `terraform plan` runs on every PR and is posted as a comment.
- [ ] `apply` runs in CI with scoped, short-lived credentials.
- [ ] Drift detection runs at least weekly against production.
- [ ] Module versions are pinned; upgrades are intentional.
- [ ] You have rebuilt staging from scratch in the last 6 months as a fire drill.
- [ ] Your IaC repo has a README explaining how to bootstrap a new environment.
