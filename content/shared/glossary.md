---
title: Glossary
type: reference
summary: Plain-English definitions of common DevOps and platform-engineering terms.
---

Plain-English definitions for the terms used across this guide. Where a term has a vendor-specific meaning and a generic one, the generic meaning is listed first. If a term is missing, open an issue.

## A

**ADR (Architecture Decision Record)** — A short document capturing a single technical decision, the alternatives considered, and the reason for the choice. Lives next to the code.

## B

**Backstage** — Open-source framework from Spotify for building an internal developer portal. Often used as the UI layer of an internal developer platform.

**Bastion** — A hardened host used as the single ingress point for SSH or RDP into a private network. Increasingly replaced by zero-trust access tools.

**Blast Radius** — The scope of damage if a given component, account, or credential fails or is compromised. A core IaC and cloud-platform design metric.

**Blue/Green** — A deploy strategy where two identical production environments exist; traffic cuts over from one to the other on release. Easy rollback, double the infra cost during cutover.

**Branch Protection** — Source-control rules that prevent direct pushes to a branch and require reviews, status checks, or signed commits before merge.

## C

**Canary** — A deploy strategy where a new version receives a small fraction of traffic before a full rollout. Pairs well with automated metric-based rollback.

**Cardinality** — In observability, the number of unique label combinations on a metric. High cardinality kills metric backends and budgets.

**Change Failure Rate** — A DORA metric: the percentage of deploys to production that result in degraded service requiring remediation (rollback, hotfix, patch).

**Chaos Engineering** — The practice of deliberately injecting faults into a system to validate resilience assumptions.

**Chargeback** — A FinOps model where cloud spend is billed back to the consuming team's budget. Stronger incentive than showback, harder to set up.

**CODEOWNERS** — A file in a repo that maps paths to required reviewers. Used to enforce domain ownership at merge time.

## D

**DAST (Dynamic Application Security Testing)** — Security scanning that probes a running application for vulnerabilities, typically over HTTP.

**Deploy Frequency** — A DORA metric: how often an organization successfully releases to production.

**DevSecOps** — The practice of integrating security work into the developer workflow rather than treating it as a gate at the end.

**Distributed Tracing** — A telemetry approach where a single request is followed across multiple services using a shared trace ID. The third pillar of observability after metrics and logs.

**DORA Metrics** — The four delivery-performance metrics from the DORA research program: Deploy Frequency, Lead Time for Changes, Change Failure Rate, and Mean Time to Restore.

**Drift** — Divergence between what your IaC declares and what actually exists in the cloud account. Caused by manual changes, failed applies, or out-of-band tooling.

## E

**Error Budget** — The amount of unreliability an SLO permits over a time window. Spent by incidents, recovered by reliable operation. Used to gate risky changes.

## F

**Feature Flag** — A runtime switch that toggles a code path without a redeploy. Enables progressive delivery, A/B testing, and decoupling deploy from release.

**FedRAMP** — A US federal program that authorizes cloud services for use by federal agencies. Heavyweight; typically only relevant if you sell to the US government.

**FinOps** — The discipline of managing cloud spend as a cross-functional concern between engineering, finance, and product.

## G

**GitOps** — An operating model where the desired state of infrastructure and applications is declared in Git and reconciled automatically by an agent in the cluster.

## H

**HIPAA** — US healthcare privacy and security regulation. Applies if you handle protected health information.

## I

**IaC (Infrastructure as Code)** — Managing infrastructure via declarative or imperative code under version control, rather than clicking in a console.

**Incident** — An unplanned event that degrades or threatens to degrade a service. Typically classified by severity.

**Internal Developer Platform (IDP)** — The set of self-service tools, golden paths, and abstractions a platform team provides to product teams.

**ISO 27001** — An international standard for information security management systems. Common alongside or instead of SOC 2 outside the US.

## L

**Landing Zone** — A pre-configured, opinionated cloud account or set of accounts that new workloads are deployed into. Enforces baseline networking, identity, and guardrails.

**Lead Time for Changes** — A DORA metric: time from code commit to code running in production.

## M

**MTTR (Mean Time to Restore)** — A DORA metric: average time to restore service after a production incident. Some sources use MTTR for "repair"; "restore" is the DORA definition.

**Multi-tenant** — A single deployment serves multiple customers, typically with logical isolation. Cheaper to run, requires careful blast-radius design.

## N

**NIST 800-53** — A US federal catalog of security and privacy controls. Foundation for FedRAMP and many other regimes.

## O

**Observability** — The ability to ask new questions of a running system without shipping new code. Operationally: metrics, logs, and traces, plus the discipline to use them.

**On-call** — A rotation where engineers are responsible for responding to alerts outside business hours. Should be paid, bounded, and reviewed.

**OpenTelemetry (OTel)** — A vendor-neutral standard and SDK for emitting metrics, logs, and traces. Reduces lock-in to a specific observability backend.

**OPA (Open Policy Agent)** — A general-purpose policy engine. Used to enforce policy-as-code over Kubernetes, Terraform, CI, and APIs.

## P

**Pager** — Shorthand for whatever paging system wakes the on-call engineer. Use of a noun ("the pager") implies an SLA on response time.

**PCI-DSS** — Payment Card Industry Data Security Standard. Applies if you store, process, or transmit cardholder data.

**Platform Engineering** — The discipline of building internal products (the platform) that product teams consume to ship faster and more safely.

**Policy-as-Code** — Expressing organizational policy as machine-checkable code, typically run in CI or admission controllers.

**Postmortem** — A written review after an incident covering timeline, contributing factors, and follow-up actions. Should be blameless.

## R

**RACI** — A responsibility-assignment matrix labelling each task as Responsible, Accountable, Consulted, or Informed. Useful for shared platform work.

**Reserved Instance (RI)** — A cloud commitment to use a given instance type for 1 or 3 years in exchange for a discount. Largely superseded by Savings Plans on AWS.

**Runbook** — A short, opinionated document describing how to handle a specific operational scenario. Should be linked from the alert that triggers it.

## S

**SAST (Static Application Security Testing)** — Security scanning that analyzes source code or build artifacts without executing them.

**SBOM (Software Bill of Materials)** — A machine-readable inventory of the components and dependencies in a piece of software. Increasingly required for supply-chain compliance.

**SCA (Software Composition Analysis)** — Scanning of third-party dependencies for known vulnerabilities and license issues.

**Secrets Management** — The practice of storing, rotating, and auditing access to credentials separately from code and config.

**Severity** — A classification (commonly Sev1–Sev4) describing the customer impact of an incident. Drives response cadence and escalation.

**Showback** — A FinOps model where cloud spend is reported back to teams without actually moving budget. Less friction than chargeback, weaker incentive.

**Single-tenant** — A separate deployment per customer. Higher operational cost, simpler blast-radius story, often required in regulated B2B.

**SLA (Service Level Agreement)** — A contractual commitment to a customer about reliability or performance, with consequences for breach.

**SLI (Service Level Indicator)** — A measured property of the service, like request success rate or latency at a percentile.

**SLO (Service Level Objective)** — A target for an SLI over a time window. Internal commitment, looser than an SLA, drives the error budget.

**SOC 2** — A US audit framework covering controls around security, availability, confidentiality, processing integrity, and privacy. Common B2B SaaS requirement.

**Spot Instance** — A discounted cloud VM that can be reclaimed by the provider at short notice. Good for fault-tolerant batch workloads.

**SRE (Site Reliability Engineering)** — The Google-originated discipline of applying software engineering to operational problems. Often co-exists with platform engineering.

**Subnet** — A subdivision of a VPC's IP address range, typically per availability zone and per tier (public/private).

## T

**Toil** — Manual, repetitive operational work that scales linearly with usage and produces no lasting value. SRE practice aims to cap it at ~50% of an engineer's time.

**Trunk-based Development** — A branching model where all developers integrate to a single main branch at least daily, using short-lived feature branches and feature flags for incomplete work.

## V

**Vault** — Generic term for a secrets store; often a reference to HashiCorp Vault specifically.

**VPC (Virtual Private Cloud)** — An isolated virtual network in a cloud account, with its own IP space, subnets, and routing.
