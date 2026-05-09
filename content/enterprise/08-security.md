---
title: Security
track: enterprise
order: 8
summary: "DevSecOps inside a controls framework: SAST, DAST, SCA, secrets, SBOM, vuln SLAs, mapped to NIST 800-53, SOC 2 CC, and ISO 27001 Annex A."
---

In a regulated organization, "shift left" is not a slogan. It is the recognition that the cheapest place to enforce a security control is in CI, the second-cheapest is at deploy time, and everything after that is incident response. The job of AppSec and the platform team together is to put as many controls as possible into the pipeline so that those controls run on every change without anyone choosing to run them.

## Why it matters

Auditors test whether your security controls are designed and operating. "Designed" means written down. "Operating" means demonstrably running on every relevant change for the audit period. A pipeline that runs SAST on every PR and refuses to merge on critical findings demonstrates both, every day, automatically. A quarterly scan run by a security engineer satisfies neither test well.

The business risk is concrete: every regulated breach in recent years has involved at least one of supply-chain compromise, leaked credentials, or unpatched known vulnerabilities. The DevSecOps controls in this section directly address all three. The cost of running them is low. The cost of not running them is the next breach.

## What "good" looks like

- Every PR runs SAST, SCA, secret scanning, IaC scanning, container scanning, and license checks. Critical findings block merge; high findings require justification; medium findings open tracked issues.
- DAST runs against staging on a defined cadence (weekly minimum) and on significant releases.
- An SBOM is generated for every artifact, signed, and stored alongside the artifact for provenance and vulnerability reachability analysis.
- Secrets are not in source control, not in CI environment variables, and not in container images. Secrets are short-lived and pulled at runtime from a secrets manager.
- Vulnerability management has SLAs by severity tied to data classification: critical/regulated systems patched in days, others in weeks. SLAs are reported monthly and breaches are visible to leadership.
- Threat modeling happens for every Tier 1 service at design time and on significant change. Threat models live in the repo, are reviewed by AppSec, and are referenced by tests.
- A controls matrix maps each engineering practice to the relevant framework controls, owned by Compliance Engineering and updated as practices evolve.

## Recommended default

**A pipeline-integrated security stack with one tool per concern**, driven by reusable workflows from [CI/CD](./03-cicd.md):

- **SAST**: GitHub Advanced Security CodeQL or Semgrep (Pro/Enterprise). CodeQL for deep analysis of supported languages; Semgrep for fast rules and custom policies.
- **SCA**: Snyk Open Source or GitHub Dependabot + GitHub Advisory Database. Block merge on critical CVEs in production-bound dependencies; auto-PR for upgrades.
- **Secret scanning**: GitHub secret scanning with push protection enabled organization-wide; supplement with TruffleHog in CI for custom patterns.
- **IaC scanning**: Checkov or tfsec in pre-merge CI; Sentinel/OPA at apply time (see [IaC](./04-iac.md)). Pre-merge for fast feedback, apply-time for enforcement.
- **Container scanning**: Trivy or Snyk Container in CI; Wiz, Prisma Cloud, or AWS Inspector at runtime for the registry and the cluster.
- **DAST**: OWASP ZAP automated baseline scans against staging; commercial DAST (Invicti, Burp Suite Enterprise) for deeper authenticated scans on critical apps.
- **SBOM and signing**: Syft for SBOM generation, Cosign for signing, stored in OCI registry alongside the image; verified at admission via Kyverno or Sigstore policy controller.
- **Secrets management**: HashiCorp Vault Enterprise or cloud-native (AWS Secrets Manager / Azure Key Vault / GCP Secret Manager) for application secrets; cloud KMS for keys; OIDC federation for CI-to-cloud.
- **Vulnerability management platform**: a single pane (Wiz, Snyk, or a custom data warehouse) aggregating findings from all the above, with SLA dashboards and ticket integration.

## Alternatives

> **Alternatives:**
> - **GitLab Ultimate's built-in security**: pick this when GitLab is your platform; SAST/DAST/SCA/secret scanning are integrated and licensed together. Reduces tool sprawl.
> - **Veracode or Checkmarx for SAST/SCA**: pick these when an existing enterprise license, professional services relationship, or specific compliance certification (e.g., FedRAMP-authorized scanner) is required.
> - **Sysdig Secure or Aqua Security for runtime**: pick these as alternatives to Wiz/Prisma when runtime threat detection on Kubernetes is the priority and CSPM is secondary.

## Compliance mapping

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Secure development lifecycle | CC8.1 | A.8.25, A.8.27 | SA-3, SA-8, SA-15 |
| Vulnerability management | CC7.1 | A.8.8 | RA-5, SI-2 |
| Static and dynamic analysis | CC8.1 | A.8.28, A.8.29 | SA-11 |
| Software supply chain (SBOM, signing) | CC7.1, CC8.1 | A.8.30, A.5.21 | SR-3, SR-4, SR-11 |
| Secrets management | CC6.1, CC6.7 | A.8.24 | IA-5, SC-12 |
| Threat modeling | CC3.2, CC7.1 | A.8.27 | RA-3, SA-15 |

These mappings are common interpretations; the specific control language and which Trust Services Criteria apply depends on your audit scope.

## Common pitfalls

- Tooling sprawl with no aggregation; engineers see four scanners' findings in four UIs and act on none of them.
- Critical-finding gates that everyone learns to bypass via the "exception" workflow; track exception volume and treat it as a leading indicator of control failure.
- Secrets management that requires application changes nobody makes, so `.env` files persist; provide drop-in libraries and SDK helpers as part of the platform.
- DAST against production "for accuracy"; the legal and operational cost is rarely worth it — run DAST against a high-fidelity staging environment.
- Vulnerability SLAs that are tracked but never enforced; if a 30-day SLA is breached without consequence, it is a target, not a control.
- Treating the controls matrix as a compliance artifact; it is an engineering artifact owned by Compliance Engineering and reviewed by Internal Audit.

## Quick checklist

- [ ] SAST, SCA, secret scan, IaC scan, container scan run on every PR; critical findings block merge.
- [ ] Push protection for secrets is enabled at the org level.
- [ ] SBOMs are generated, signed, and stored for every production artifact.
- [ ] Image admission policy verifies signatures and SBOM presence.
- [ ] Vulnerability SLAs are defined, measured, and reported to leadership.
- [ ] Secrets manager is the only legitimate source of runtime secrets.
- [ ] Threat models exist for all Tier 1 services and are reviewed annually.
- [ ] Controls matrix maps every engineering practice in this guide to your primary framework.
