---
title: Security
track: enterprise
order: 8
summary: "DevSecOps inside a controls framework: SAST, DAST, SCA, secrets, SBOM, vuln SLAs, mapped to NIST 800-53, SOC 2 CC, and ISO 27001 Annex A."
---

In a regulated organization, "shift left" is not a slogan. It is the recognition that the cheapest place to enforce a security control is in CI, the second-cheapest is at deploy time, and everything after that is incident response. The job of AppSec and the platform team together is to put as many controls as possible into the pipeline so that those controls run on every change without anyone choosing to run them.

## Why it matters

Auditors test whether your security controls are designed and operating. "Designed" means written down. "Operating" means demonstrably running on every relevant change for the audit period. A pipeline that runs SAST on every PR and refuses to merge on critical findings demonstrates both, every day, automatically. A quarterly scan run by a security engineer satisfies neither test well.

A near-universal pattern across the breach disclosures filed under the SEC cyber rule since December 2023: the technical root cause is one (or more) of three things. A supply-chain compromise — a malicious or unverified dependency, a poisoned build, a substituted artifact — that a SLSA-style provenance check would have rejected. A leaked credential — a personal access token, a long-lived service principal, a static cloud key — that short-lived OIDC federation would have prevented. An unpatched known vulnerability — a CVE published months earlier, a transitive dependency nobody had inventoried — that an SCA gate and an enforceable SLA would have closed before exploitation. The DevSecOps controls in this section address all three directly. The cost of running them is low; the cost of not running them is the next 8-K filing.

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
- **Container scanning**: Trivy or Snyk Container in CI; Wiz, Prisma Cloud, or AWS Inspector at runtime for the registry and the cluster. (Vendor-risk note on Wiz: Google's pending $32B acquisition, announced March 2025, introduces integration risk and a multi-year roadmap question. Defensible to continue with Wiz; reasonable to evaluate Prisma Cloud, Sysdig Secure, or Orca Security if you are committing on a multi-year contract this year.)
- **DAST**: OWASP ZAP automated baseline scans against staging; commercial DAST (Invicti, Burp Suite Enterprise) for deeper authenticated scans on critical apps.
- **SBOM and signing**: Syft for SBOM generation, Cosign for signing, stored in OCI registry alongside the image; verified at admission via Kyverno or Sigstore policy controller.
- **Secrets management**: HashiCorp Vault Enterprise or cloud-native (AWS Secrets Manager / Azure Key Vault / GCP Secret Manager) for application secrets; cloud KMS for keys; OIDC federation for CI-to-cloud.
- **Vulnerability management platform**: a single pane (Wiz, Snyk, or a custom data warehouse) aggregating findings from all the above, with SLA dashboards and ticket integration.

The pipeline-integrated stack above is table stakes. The next six paragraphs cover the security work that is reshaping enterprise AppSec roadmaps in 2025-2026; treat them as recommended additions to the controls matrix rather than aspirational extras.

**Supply-chain integrity beyond signing.** Cosign-without-attestation is half the control. Pair signing with **SLSA Level 3 build provenance** generated by the official `slsa-github-generator` workflows (or equivalent GitLab/Buildkite tooling) and **GitHub artifact attestations** for in-toto-formatted statements binding artifacts to source commits and builder identities. Use the **Sigstore policy-controller** (or Kyverno) as an admission controller that rejects unsigned or unattested images at the cluster boundary. Add defenses for **dependency confusion** (registry scoping, namespace claims, internal-name allowlists) and **typosquatting** (Socket, Phylum, or comparable behavioral analysis on new dependencies entering the build). Run **reachability analysis** (Snyk, Endor Labs, Semgrep Supply Chain) so the CVE backlog reflects exploitable paths and not just transitive dependency presence — this is what makes critical-finding gates survivable.

**Post-quantum cryptography readiness.** **NIST finalized FIPS 203 (ML-KEM), 204 (ML-DSA), and 205 (SLH-DSA) in August 2024**, and **CNSA Suite 2.0** mandates PQC migration for national-security systems on a published schedule (CNSSP 15 timelines tighten through 2030-2033). For enterprises this is now a planning item, not a research topic. Three concrete actions: maintain a **cryptographic inventory** (where TLS terminates, where keys live, what algorithms each system supports — `mayhem-x`, `pqc-scan`, or in-house tooling against your CMDB); enable **hybrid KEMs** in TLS where your terminators support them (CloudFront, Akamai, OpenSSL 3.5+, AWS KMS hybrid post-quantum); design for **crypto agility** in new systems (algorithm pluggability, no hard-coded primitives, key-length parameterization). FedRAMP and NIST 800-53 Rev 5 do not yet *require* PQC, but agencies and large customers are starting to ask.

**AI workload security.** If your deploy path produces or hosts ML/LLM workloads, the threat model is materially different. Cover **prompt injection** (direct and indirect, including tool-use and retrieval-augmented contexts) following the **OWASP Top 10 for LLM Applications**; generate and retain an **MLBOM/AIBOM** (per CycloneDX 1.6 or SPDX 3.0) describing models, training data provenance, and dataset licenses; treat model weights as production artifacts (signed, scanned for serialization vulnerabilities — e.g., pickle-based attacks — and stored in a controlled registry). The **EU AI Act**'s high-risk-system obligations apply from August 2026, with phased General-Purpose AI obligations already in effect since August 2025; if your product touches the EU market and falls in scope, the conformity-assessment, transparency, and post-market-monitoring requirements need a place in the controls matrix now.

**SDLC reference frameworks.** Two converging anchor documents to map your SDLC against. The **CISA Secure by Design** pledge (introduced May 2024, signed by 250+ vendors as of 2025) commits to memory-safe-language adoption, default MFA, default-on logging, and CVE elimination targets — useful as both a product-security north star and a procurement signal. **NIST SP 800-218 (SSDF v1.1)** is the federal supply-chain reference and the most common "what does secure development look like?" question on FedRAMP, CMMC 2.0, and federal procurement questionnaires. The pipeline controls in this section map cleanly to SSDF PO/PS/PW/RV practice groups; document the mapping in your controls matrix so an SSDF self-attestation is one query away.

**Regulatory horizon.** The **HIPAA Security Rule NPRM** (published December 2024) proposes removing the "addressable" vs "required" distinction, mandating specific encryption (at-rest and in-transit), MFA, vulnerability scanning, penetration testing, and 72-hour disaster-recovery RTOs. Final rule is not yet in force but the direction is clear — design new healthcare workloads to the proposed standard rather than the 2013 version of the rule.

## Alternatives

> **Alternatives:**
> - **GitLab Ultimate's built-in security**: pick this when GitLab is your platform; SAST/DAST/SCA/secret scanning are integrated and licensed together. Reduces tool sprawl.
> - **Veracode or Checkmarx for SAST/SCA**: pick these when an existing enterprise license, professional services relationship, or a FedRAMP-authorized SaaS offering is required (e.g., Veracode at FedRAMP Moderate). "FedRAMP-authorized scanner" is shorthand worth unpacking with your sponsoring agency — what matters is that the SaaS itself holds a current authorization at the right impact level.
> - **Sysdig Secure or Aqua Security for runtime**: pick these as alternatives to Wiz/Prisma when runtime threat detection on Kubernetes is the priority and CSPM is secondary.

## Compliance mapping

> Framework versions per [Overview](./00-overview.md): Annex A clauses reference ISO/IEC 27001:2022; NIST controls reference 800-53 Rev 5; SOC 2 TSC references are the 2017 criteria with the 2022 points-of-focus update.

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Secure development lifecycle | CC8.1 | A.8.25, A.8.27 | SA-3, SA-8, SA-15 |
| Vulnerability management | CC7.1 | A.8.8 | RA-5, SI-2 |
| Static and dynamic analysis | CC8.1 | A.8.28, A.8.29 | SA-11 |
| Software supply chain (SBOM, signing, attestation) | CC7.1, CC8.1 | A.8.30, A.5.21 | SR-3, SR-4, SR-11 |
| Secrets management | CC6.1, CC6.7 | A.8.24 | IA-5, SC-12 |
| Threat modeling | CC3.2, CC7.1 | A.8.27 | RA-3, SA-8, SA-15(4) |

These mappings are common interpretations; the specific control language and which Trust Services Criteria apply depends on your audit scope. SA-15(4) is the Rev 5 control enhancement specific to Threat Modeling and Vulnerability Analysis and is the closest 800-53 fit for an enterprise STRIDE/PASTA practice; pair it with SA-8 for security/privacy architecture and RA-3 for the upstream risk-assessment linkage.

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
- [ ] SLSA Level 3 provenance / in-toto attestations are generated for production artifacts.
- [ ] Image admission policy verifies signatures, attestations, and SBOM presence.
- [ ] Reachability analysis filters the CVE backlog so SLAs target exploitable findings.
- [ ] Vulnerability SLAs are defined, measured, and reported to leadership.
- [ ] Secrets manager is the only legitimate source of runtime secrets.
- [ ] Threat models exist for all Tier 1 services and are reviewed annually.
- [ ] A cryptographic inventory exists and a PQC migration plan has named owners.
- [ ] If AI workloads are in scope, MLBOM/AIBOM and prompt-injection defenses are in place.
- [ ] Controls matrix maps every engineering practice in this guide to your primary framework and to NIST SSDF (SP 800-218).
