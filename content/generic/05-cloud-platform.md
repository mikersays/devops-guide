---
title: Cloud Platform
track: generic
order: 5
summary: Picking a cloud, account structure, networking basics, and when to reach for Kubernetes (and when not to).
---

## Why it matters

The cloud platform is the floor your stack stands on. Switching providers later is a multi-quarter project most companies never finish. Picking the wrong abstraction — Kubernetes when you needed App Runner, multi-cloud when you needed one — burns engineering capacity for years. For most small-to-mid orgs, the right answer is one cloud, one account structure, and the simplest compute primitive that fits.

## What "good" looks like

- One primary cloud provider. A second only for explicit, justified reasons (data residency, customer demand, specific service).
- Multiple accounts/projects/subscriptions, separating prod from non-prod by hard cloud-account boundaries — not just IAM rules.
- Networking is private by default. Public exposure is deliberate.
- Compute matches the workload: managed services for stateful and bursty things, container platforms for fleets of services.
- Identity flows from your IDP (Okta / Google / Entra) into the cloud via SSO. No long-lived IAM users for humans.
- Every resource is tagged with owner, environment, cost center, and service.

## Recommended default

**AWS** as the primary cloud, **AWS Organizations** for account structure, **Terraform/OpenTofu** for provisioning (see [IaC](./04-iac.md)).

Concrete setup:

- **Account structure:** one AWS Organization. Separate accounts for `management`, `prod`, `staging`, `dev`, `shared-services` (CI, registries), `security` (logs, audit), plus a sandbox per team.
- **Identity:** IAM Identity Center federated to your IDP. No IAM users for humans. CI uses OIDC + IAM roles.
- **Networking:** one VPC per account per region. Private subnets for compute, public only for load balancers. NAT gateway for egress; VPC endpoints to avoid the bill. Transit Gateway only when you have something to connect.
- **DNS:** Route 53 with a public zone per environment.
- **Secrets:** AWS Secrets Manager or SSM Parameter Store.

For compute, pick the simplest primitive that fits:

| Workload | Reach for |
|---|---|
| Static site / SPA | CloudFront + S3, or Vercel/Netlify |
| Single web service | App Runner, ECS Fargate, Cloud Run, Render, Railway, Northflank |
| 2-10 services | ECS Fargate, Cloud Run |
| 10+ services with platform team | EKS / GKE |
| Background jobs | Lambda, Cloud Functions, ECS scheduled tasks |
| Stateful (DBs, caches) | Managed services. RDS, ElastiCache, Aurora — never self-host. |

On the "single web service" row: **Render**, **Railway**, and **Northflank** are the current contenders for the "AWS is too much, just run my container" slot. Fly.io was here too, but the 2023-2024 control-plane and networking incidents knocked it out of the default position; pick it deliberately for the edge-compute workloads it's good at, not as a general PaaS.

**Reach for Kubernetes only when** you have 10+ services, a person who can own the cluster, and you have felt the pain of not having it. Most orgs under 50 engineers do not need it.

> **Alternatives:**
> - **GCP** — pick if your team is data/ML-heavy (BigQuery is genuinely better than Redshift for analytics workloads), or if you want Cloud Run as a default. Smaller talent pool than AWS.
> - **Azure** — pick if your customers or org are Microsoft-aligned, or you have Entra-based identity already. Strong for hybrid scenarios.
> - **Hetzner / OVH / dedicated providers** — pick if cost is the dominant constraint and you have ops capacity. You will rebuild a lot of what hyperscalers give you for free.

## Common pitfalls

- **Single AWS account for everything.** An IAM mistake in dev affects prod.
- **Kubernetes too early.** A four-person team on EKS pays a tax for capabilities they do not use.
- **Multi-cloud as a hedge.** This doubles the platform surface for capabilities you would rarely exercise. Do it for concrete reasons, not anxiety.
- **Long-lived access keys.** Switch to OIDC + IAM roles for CI. Use SSO for humans.
- **No tagging strategy.** Six months in, no one knows who owns the $4k/month Aurora cluster.
- **Public S3 buckets, public databases.** Default deny. Public is explicit.
- **Prod and dev in the same VPC** to save on NAT. False economy.

## Quick checklist

- [ ] You have chosen a primary cloud and written down why.
- [ ] Prod is in its own account/project, separate from dev and staging.
- [ ] Human access is via SSO; no IAM users for humans.
- [ ] CI uses OIDC-based federation, not long-lived keys.
- [ ] Every resource is tagged with owner, env, and cost center.
- [ ] Databases are managed services, not self-hosted EC2.
- [ ] You can articulate why you are (or aren't) running Kubernetes.
- [ ] All compute lives in private subnets unless deliberately public.
- [ ] Cloud account billing rolls up to a single dashboard you check monthly.
