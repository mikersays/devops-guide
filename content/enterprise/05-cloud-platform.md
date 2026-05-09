---
title: Cloud Platform
track: enterprise
order: 5
summary: Landing zones, account hierarchy, network segmentation, and region selection for regulated and sovereign workloads.
---

The cloud landing zone is the foundation every other control rests on. Get the account structure, identity, and network boundaries right at the start and the rest of the program is achievable. Get them wrong, and every subsequent control is a workaround.

## Why it matters

Account boundaries are blast-radius boundaries. Network segmentation is the difference between "an EC2 instance was compromised" and "the cardholder data environment was breached." Region selection determines whether you are FedRAMP-eligible, GDPR-compliant, and in-scope for HIPAA. These choices are expensive to reverse; an enterprise that decides to consolidate 1,200 AWS accounts into a Control Tower hierarchy after the fact will spend 18-24 months doing it.

The business risk of a poor landing zone is structural. PCI scope creep across a flat account expands every audit. A single shared production VPC means a misconfigured security group is a control failure. A workload accidentally placed in a non-FedRAMP region is a contract breach.

## What "good" looks like

- A formal landing zone with named patterns: management, log archive, security tooling, shared services, and per-workload accounts segmented by environment and sensitivity.
- Identity is centralized in an enterprise IdP. Cloud access uses federation; no IAM users with long-lived keys for humans.
- Network segmentation reflects data classification: regulated workloads are in dedicated VPCs/VNets with explicit egress through inspection, no shared ingress paths with public workloads.
- Region selection is governed. Service Control Policies (or Azure Policy / GCP Org Policy) deny resource creation outside approved regions per workload class. FedRAMP, IL4/5, and data-residency-restricted workloads have their own allow-lists.
- Logging and security telemetry flow into a dedicated, tightly-controlled log archive account. The account that generates logs cannot delete them.
- New accounts are provisioned via automation in minutes, with controls baked in: baseline IAM, baseline networking, mandatory tagging, encryption defaults, vulnerability scanner enrolled, log shipping configured.

## Recommended default

**AWS with Control Tower as the landing zone**, organized as a multi-OU AWS Organization:

- **Core OUs**: `Security` (log archive, audit, security tooling), `Infrastructure` (shared services, networking), `Sandbox`, `Workloads/Prod`, `Workloads/NonProd`, `Workloads/Regulated`.
- **Account-per-workload-environment**: `payments-prod`, `payments-nonprod`, `payments-regulated`. Avoid mega-accounts.
- **Identity**: AWS IAM Identity Center (formerly SSO) federated to your IdP; permission sets aligned to job functions; no IAM users for humans.
- **Network**: a hub-and-spoke topology using AWS Transit Gateway (or Cloud WAN at the largest scale). Egress through centralized firewalls (AWS Network Firewall or third-party) with TLS inspection where regulators require it. Spoke VPCs have no internet gateway in regulated OUs.
- **Region strategy**: SCPs deny all regions except the approved set per OU. FedRAMP workloads pinned to GovCloud (US) or other authorized regions; EU workloads pinned to EU regions for data residency.
- **Guardrails**: Control Tower mandatory and strongly recommended controls enabled; supplemented with custom SCPs (deny root user, deny public S3 in regulated OUs, deny IMDSv1, deny disabling CloudTrail).
- **Logging**: CloudTrail organization trail, VPC Flow Logs, DNS query logs, and Config snapshots all delivered to the log archive account, with Object Lock for retention.

For Azure: **Azure Landing Zones (Cloud Adoption Framework)** with management groups mirroring the OU structure, Azure Policy in place of SCPs, Entra ID for identity, and a hub-spoke topology with Azure Firewall. For GCP: **Google Cloud Foundation Fabric** or the Security Foundations Blueprint, with org policies, folder hierarchy, and VPC Service Controls.

## Alternatives

> **Alternatives:**
> - **Azure Landing Zones**: pick this if Microsoft 365 and Entra ID are the identity backbone; tight integration with enterprise IT. Strong story for sovereign clouds (Azure Government, Azure China via 21Vianet).
> - **GCP Organization Hierarchy + Foundation Fabric**: pick this for data-heavy workloads, BigQuery-centric analytics, or where the engineering org has strong Google fluency. Assured Workloads covers FedRAMP/IL4 needs.
> - **Multi-cloud with a unified abstraction (e.g. HashiCorp Cloud Platform, Anthos)**: pick this only when contractual or sovereignty requirements force it; expect to pay the integration tax in every other section of this guide.

## Compliance mapping

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Account/tenant boundary controls | CC6.1, CC6.6 | A.5.15, A.8.3 | AC-3, AC-4, SC-7 |
| Centralized identity and federation | CC6.1, CC6.2 | A.5.16, A.5.18 | IA-2, AC-2 |
| Network segmentation | CC6.6 | A.8.22 | SC-7, SC-32 |
| Region/data-residency controls | CC6.1 | A.5.34, A.8.10 | AC-4, SC-7 |
| Centralized logging architecture | CC7.2 | A.8.15, A.8.16 | AU-3, AU-6, AU-9 |

## Common pitfalls

- Starting with a flat account and planning to "segment later"; later costs ten times more than now.
- Treating Control Tower / Landing Zones as a one-time install; the value is in continuous enforcement and ongoing OU evolution.
- Allowing developers to bypass the approved-region SCP "for a quick experiment"; sandbox OUs exist for this.
- Centralized egress that becomes a performance and reliability bottleneck because nobody sized it; treat egress as a Tier 1 service with SLOs.
- Putting the security tooling account inside the same OU as workloads it audits; the security tooling account must be peer or above for independence.
- Forgetting that GovCloud, China regions, and other sovereign environments require separate accounts, separate identities, and separate operational processes.

## Quick checklist

- [ ] An OU/management-group hierarchy exists and reflects sensitivity, not org chart.
- [ ] No IAM users (or equivalent) exist for human access to production accounts.
- [ ] SCPs/Azure Policies/Org Policies deny non-approved regions in regulated OUs.
- [ ] Centralized log archive account exists, with Object Lock or equivalent immutability.
- [ ] All accounts are vended via automation; manual account creation is blocked or audited.
- [ ] Egress traffic from regulated workloads passes through inspection.
- [ ] FedRAMP/sovereign workloads, if any, are isolated in their own accounts and identity domain.
- [ ] Network topology is documented and matches the deployed reality (verified quarterly).
