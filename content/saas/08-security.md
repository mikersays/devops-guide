---
title: Security
track: saas
order: 8
summary: Shift-left DevSecOps with SAST/DAST/SCA, managed secrets, least-privilege IAM, and SOC 2 as a continuous control posture.
---

# Security

## Why it matters

Security buyers want answers in days, not quarters. A SaaS startup that can credibly produce a SOC 2 report and a clean **Software Bill of Materials** (**SBOM**) closes enterprise deals faster — and avoids the kind of breach that ends companies. The key is to embed security into the existing dev flow rather than bolting on a gate that engineers route around.

## What "good" looks like

- Security checks live in the PR pipeline; engineers see findings while the code is fresh
- 100% of secrets in a managed store; zero credentials in code, env files, or CI variables
- Least-privilege IAM with no human standing access to prod data
- Vulnerability SLAs: critical < 7 days, high < 30 days, with measured compliance
- SOC 2 controls automated by tooling, not hand-collected screenshots
- Annual third-party pen test; quarterly internal reviews
- Every employee can answer "where do I report a security concern?"

## Recommended default

### Shift-left tooling

- **SAST (static analysis)**: GitHub Advanced Security CodeQL, or Semgrep, on every PR
- **SCA (dependencies)**: Dependabot + Snyk Open Source — alert on CVEs and license risk
- **Secret scanning**: GitHub secret scanning + push protection turned on org-wide
- **IaC scanning**: tfsec or Checkov (see [IaC](./04-iac.md))
- **Container scanning**: ECR image scanning or Trivy on push; block deploys on critical findings
- **DAST**: OWASP ZAP or StackHawk against staging on a schedule (nightly or per-PR for sensitive apps)

Treat findings like flaky tests: triage weekly, suppress them consciously with an expiry date, and fix them on a clock.

### Supply chain

The 2024 npm and PyPI compromises put dependency confusion and typosquatting back on the agenda — package-name squatting and internal-package shadowing are now routine attacks. The minimum bar:

- **Lock and pin** dependencies (lockfiles in CI, deterministic installs); scope private packages to your own registry namespace so a public-registry typo cannot shadow them
- **Sign and attest builds**: turn on **GitHub artifact attestations** (GA 2024) for container images and release artifacts, or run **Sigstore cosign** directly; verify at deploy time
- **Enforce at admission**: a **Sigstore policy-controller** (or Kyverno with Sigstore) rule on the cluster that rejects unsigned or untrusted images
- Aim for **SLSA Level 3** for production build pipelines — hermetic, signed, provenance-tracked. Below that, you're trusting your CI to not be your weakest link.

### Runtime detection (eBPF)

Once you're past basic image scanning, runtime visibility into syscalls and network behavior closes the loop. **Falco** and **Tetragon** both use eBPF to detect things like a container suddenly spawning a shell, reading `/etc/shadow`, or making egress to an unfamiliar endpoint. Start with a small, high-signal rule set; tune before alerting, or you'll teach the team to ignore Falco.

### AI / LLM ops

If product surfaces use LLMs, treat the prompt boundary as an untrusted input. Threat-model against the **OWASP LLM Top 10** (prompt injection, training-data poisoning, sensitive-info disclosure); add prompt-injection filters and output validation in the same place you'd validate any other user input. Track third-party models and their training data in an **MLBOM / AIBOM** alongside your software SBOM — auditors are starting to ask, and the standards (CycloneDX ML-BOM) are stable enough to adopt.

### Secrets management

- **AWS Secrets Manager** for application secrets (rotate where possible — RDS supports it natively)
- **AWS Systems Manager Parameter Store** for non-sensitive config
- **HashiCorp Vault** when you need dynamic secrets, multi-cloud, or strong PKI
- Apps fetch secrets at runtime via SDK or sidecar; never bake into images
- CI uses **GitHub OIDC → AWS IAM role**, no long-lived access keys

### Identity & access

- **SSO** (Okta, Google Workspace, or AWS Identity Center) for every tool that supports it
- Hardware-key MFA for admin roles; TOTP minimum for everyone else
- AWS access via SSO + permission sets; zero IAM users
- Production data access requires break-glass workflow with logging and time bounds (e.g. Teleport, AWS Session Manager + ChatOps approval)

### Network & data

- Default-deny security groups; private subnets for compute and data tiers (see [Cloud Platform](./05-cloud-platform.md))
- Encryption at rest (KMS) and in transit (TLS 1.2+); per-tenant keys where contractually required
- Backups tested quarterly — an untested backup is a wish

### SOC 2 without slowing teams

- Adopt a compliance automation platform — **Drata** is our pick for the SaaS track (its larger-SaaS footprint pulled ahead in 2024-2025), with **Vanta** and **Secureframe** as solid alternatives. All three map your existing AWS, GitHub, HRIS into evidence; the differentiator is workflow polish, not capability.
- Treat policies as living docs in a wiki, not PDFs in a SharePoint
- Bake controls into tooling: branch protection = change management; SSO + role review = access control
- Type I in 3 months is realistic; Type II requires 3–6 months of operating evidence

> **Alternatives:**
> - **Snyk full suite vs. GitHub Advanced Security**: GHAS is cheaper if you're already on GitHub Enterprise; Snyk is stronger on SCA breadth.
> - **Doppler / 1Password Secrets Automation**: pick when developer ergonomics matter more than tight AWS integration.
> - **Wiz / Orca / Lacework** for CSPM: pick once you have ≥ 5 AWS accounts and meaningful production data.

## Common pitfalls

- **Security as a separate team that says no** — engineers route around the friction
- **Ignored vulnerability alerts** piling into the thousands, all the same severity
- **Long-lived AWS access keys in CI** instead of OIDC federation
- **Standing prod access** for "convenience" — until it shows up in your audit or your breach
- **Compliance theater**: screenshots, spreadsheets, and a person whose full-time job is hunting evidence
- **Secrets rotated never** — the API key you set at seed stage is still in prod
- **No incident response plan for a *security* incident** specifically — the security playbook differs from the ops playbook

## Quick checklist

- [ ] SAST / SCA / secret scanning on every PR
- [ ] Container and IaC scans block deploys on criticals
- [ ] Secrets in a managed store; no .env files in repos
- [ ] OIDC federation from CI to cloud; zero static keys
- [ ] SSO + MFA for every tool; hardware keys for admins
- [ ] No standing human write access to prod
- [ ] Vulnerability SLAs documented and measured
- [ ] Annual pen test scheduled
- [ ] Compliance automation platform in place if pursuing SOC 2
- [ ] Security incident playbook distinct from ops [Incident Response](./07-incident-response.md)
- [ ] Encryption at rest and in transit verified end-to-end
- [ ] Quarterly access review automated where possible
