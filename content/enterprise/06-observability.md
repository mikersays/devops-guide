---
title: Observability
track: enterprise
order: 6
summary: Centralized logging with compliance-grade retention, SIEM integration, SLOs, and separation of operational and audit telemetry.
---

In a regulated organization, observability serves two distinct customers: engineers debugging production, and auditors testing controls. Those needs overlap but are not the same. A platform that collapses them into one tool optimizes for neither and gets expensive fast. A platform that separates them — operational telemetry for engineers, audit telemetry for compliance and security — serves both well.

## Why it matters

Logs are evidence. Metrics are evidence. Traces are usually not evidence, but they are how you drive MTTR down. The control objectives are to retain audit-relevant logs for the period your framework requires (often seven years for financial systems), protect them from tampering and unauthorized deletion, and make them queryable for both incident response and audit fieldwork. Failing any of these creates a finding that is expensive to remediate.

The business risk is twofold. Insufficient retention means an investigator cannot reconstruct a 90-day-old incident. Insufficient SLO discipline means engineers learn about outages from customers. Both are predictable failures of an unmaintained observability program.

## What "good" looks like

- Audit logs (cloud control plane, IdP, source control, CI/CD, privileged access) flow into an immutable, access-controlled log archive separate from operational telemetry.
- The SIEM correlates audit logs with security events; AppSec writes detections; SecOps responds to them. The platform team consumes SIEM dashboards but does not own them.
- Operational telemetry (application logs, metrics, traces) lives in a separate observability platform tuned for engineer use: fast queries, low retention on hot tier, archive tier for long retention.
- SLOs exist for every Tier 1 and Tier 2 service, with error budgets reviewed monthly. SLO breaches feed into the [incident response](./07-incident-response.md) process.
- Log retention is policy-driven and enforced by configuration: 7 years for financial/audit logs, 1 year for application logs, shorter for high-volume telemetry.
- Sensitive data (PHI, PCI, PII) is classified, redacted at source where possible, and tokenized when it cannot be redacted. Logs are not a side channel for regulated data.

## Recommended default

**Splunk Enterprise (or Splunk Cloud Platform with FedRAMP if applicable) for SIEM and audit logs**, plus **Datadog for operational observability**:

- **Audit/security tier (Splunk)**: receives CloudTrail, Azure Activity Logs, GCP Audit Logs, IdP logs (Okta/Entra), GitHub/GitLab audit logs, Terraform Enterprise audit logs, EDR telemetry, and privileged session recordings. Indexes are role-segregated; SecOps and Internal Audit have read access; nobody has delete access without a documented break-glass procedure.
- **Operational tier (Datadog)**: APM, logs, metrics, RUM. Engineers have broad read access to their service's data; production write access for monitor changes goes through CODEOWNERS-reviewed Terraform.
- **Retention**: Splunk indexes configured for 7-year retention on audit data, with frozen archive to S3 Glacier with Object Lock. Datadog operational logs at 30-90 days hot, archived to S3 for the rest.
- **SLOs**: Datadog SLO objects defined in Terraform per service, derived from a service catalog. Burn-rate alerts page on-call; slow-burn alerts go to the team backlog.
- **Audit log streaming**: every in-scope system streams to Splunk via dedicated forwarders or HEC tokens. AppSec reviews the source list quarterly against the in-scope-systems registry.
- **Tamper protection**: log archive S3 buckets use Object Lock in compliance mode; the account holding them is in the Security OU and unwritable from workload accounts.

## Alternatives

> **Alternatives:**
> - **Datadog Cloud SIEM + Datadog observability**: pick this when you want a single vendor and your auditors accept Datadog's retention and immutability story; reduces integration cost.
> - **Sumo Logic Cloud SIEM**: pick this for shops with an existing Sumo footprint; strong for cloud audit logs and reasonable for operational logs.
> - **Microsoft Sentinel + Azure Monitor / Application Insights**: pick this for Azure-aligned shops; strong Entra and Defender integration, native to the platform.
> - **Elastic Stack (self-managed or Elastic Cloud)**: pick this when sovereignty or cost requires self-hosting and you have the SRE depth to operate it credibly.
> - **Grafana Cloud + Loki/Mimir/Tempo**: pick this for the operational tier when you want OSS-aligned tooling; pair with a separate SIEM for audit telemetry.

## Compliance mapping

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Audit log generation and retention | CC7.2 | A.8.15 | AU-2, AU-11, AU-12 |
| Log integrity protection | CC7.2 | A.8.15 | AU-9 |
| Security monitoring (SIEM) | CC7.2, CC7.3 | A.8.16 | SI-4, AU-6 |
| Capacity and performance monitoring | A1.1 | A.8.6 | SI-4, SC-5 |
| Time synchronization for log correlation | CC7.2 | A.8.17 | AU-8 |

## Common pitfalls

- One tool for everything; you will either pay for SIEM-grade retention on operational logs or under-retain audit logs. Both outcomes are expensive.
- Letting workload accounts retain delete permission on their own logs; the log archive must be a separate trust domain.
- SLOs as vanity metrics that nobody acts on; if a burned error budget does not change behavior, it is not an SLO.
- Sensitive data leaking into logs because nobody enforces structured logging or redaction; treat this as a data-handling control, not a logging convenience.
- "We have CloudTrail enabled" as the audit log strategy; CloudTrail is necessary, not sufficient. IdP, source control, CI/CD, and EDR logs are equally important.
- Forgetting time sync (NTP/chrony); inconsistent timestamps make incident reconstruction and audit correlation painful.

## Quick checklist

- [ ] Audit log archive lives in a dedicated, access-controlled account or tenant.
- [ ] Object Lock or equivalent immutability is enabled on the audit archive.
- [ ] Retention configurations match policy and are tested annually by attempting (and failing) to delete.
- [ ] SIEM detections are written by AppSec/SecOps, not buried in vendor defaults.
- [ ] Every Tier 1/2 service has at least one SLO, defined in code.
- [ ] Sensitive data classification is reflected in log redaction rules.
- [ ] Time sync is verified across all log sources.
- [ ] Engineers and auditors can answer their respective questions without bothering each other.
