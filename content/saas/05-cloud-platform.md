---
title: Cloud Platform
track: saas
order: 5
summary: AWS by default, with a Lambda → Fargate → EKS decision tree and Kubernetes adopted only when complexity demands it.
---

# Cloud Platform

## Why it matters

Your runtime choice sets the floor on operational complexity for years. Picking Kubernetes too early absorbs a senior engineer's full attention; staying on PaaS too long leaves you stuck when you need fine-grained networking, multi-region, or bring-your-own-VPC. Choose deliberately and bias toward the simplest thing that works.

## What "good" looks like

- A single decision tree the team uses to pick a runtime per service
- Multi-AZ by default; multi-region readiness designed-in even if you're single-region today
- VPC layout you can defend in a security review without hand-waving
- IAM roles per workload (no shared service accounts); zero standing human access to prod
- Cost per environment is visible and tagged
- "New service" goes from idea to production-ready scaffolding in a day

## Recommended default

**AWS** is the default because of breadth, IAM model, and ecosystem. If you have deep GCP or Azure expertise, the principles transfer; the names change.

### Runtime decision tree

| If your service is… | Use |
|---|---|
| Event-driven, infrequent, < 15 min, no warm-state | **Lambda** |
| Long-running HTTP/gRPC, low/medium traffic, container-friendly | **ECS Fargate** |
| Batch / periodic / scheduled | Lambda or **Fargate scheduled tasks** / **AWS Batch** |
| Data plane needing custom networking, sidecars, complex topology | **EKS** |
| Stateful (DB, cache, search) | **RDS / Aurora**, **ElastiCache**, **OpenSearch** — managed services |

**Default for a new microservice: ECS Fargate.** It gives you containers without the EKS operational tax. Move to EKS only when you have ≥3 of:

- 20+ services with shared platform concerns (service mesh, complex traffic policies)
- Need for advanced scheduling, custom controllers, or operators
- A platform team that can own EKS upgrades and node lifecycles
- Multi-tenancy or workload isolation patterns Fargate can't express
- Cost pressure where reserved EC2 / Graviton beats Fargate's premium

### VPC layout

- One VPC per account per region
- Subnets per AZ in three tiers: **public** (ALB/NAT), **private-app** (compute), **private-data** (RDS, ElastiCache)
- VPC endpoints for S3, ECR, Secrets Manager — keep traffic off the internet
- Transit Gateway when account count grows; AWS Organizations + Control Tower from day one if you can

### Account strategy

Use AWS Organizations with at least: `management`, `prod`, `staging`, `dev`, `security/audit`, `shared-services`. Hard isolation between prod and non-prod is the cheapest risk reduction you'll ever buy.

### Multi-region readiness

You do not need to *run* multi-region day one — you need to *not preclude it*. That means:
- Region-agnostic Terraform modules
- DNS via Route 53 with health-check failover designed in
- Stateful stores with cross-region replication understood (Aurora Global, S3 CRR)
- No region IDs hard-coded in app config

> **Alternatives:**
> - **GCP**: Cloud Run for serverless containers (excellent), GKE Autopilot when you need k8s. BigQuery is a strong reason to choose GCP.
> - **Azure**: Container Apps, AKS, Functions. Pick if your buyer is Microsoft-aligned or you need Azure AD integration deep in the product.
> - **Fly.io / Render / Railway**: pick under 5 engineers when AWS is overkill; expect to migrate when you hit compliance or networking limits.

## Common pitfalls

- **Premature EKS** — you have taken on Kubernetes upgrades, node management, and a steep learning curve to run 5 services
- **Single account for everything** — blast radius is the whole company
- **Public subnets running app workloads** instead of keeping workloads in private subnets
- **Missing VPC endpoints** — egress costs and attack surface both balloon
- **Region lock-in via hard-coded IDs** in apps, secrets, or Terraform
- **Manually attaching IAM policies** to users instead of role-based access via SSO

## Quick checklist

- [ ] AWS Organizations with prod isolated in its own account
- [ ] SSO (IAM Identity Center / Okta) for all human access; zero IAM users
- [ ] Documented runtime decision tree shared with engineering
- [ ] Default new service runs on Fargate or Lambda; EKS gated
- [ ] VPC follows public / private-app / private-data tiering
- [ ] VPC endpoints for S3, ECR, Secrets Manager, STS
- [ ] Mandatory tags on all resources (see [IaC](./04-iac.md))
- [ ] No region ID hard-coded outside Terraform inputs
- [ ] Disaster recovery runbook with RTO/RPO targets per service
- [ ] Quarterly review of runtime choices vs. service growth
