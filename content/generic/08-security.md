---
title: Security
track: generic
order: 8
summary: "DevSecOps baseline: secrets, scanning, identity, and the hygiene that gets you through your first audit."
---

## Why it matters

Security debt compounds silently until it does not. The first time a customer asks for your SOC 2 report or an attacker finds the AWS key you committed in 2023, you will wish you had put 5% engineering effort into security from day one. 80% of real-world wins come from boring hygiene, not bespoke detection engineering.

## What "good" looks like

- No secrets in source control. Pre-commit and CI checks enforce this.
- Every human access to production is via SSO + MFA. No shared accounts.
- Every CI workload uses short-lived, scoped credentials (OIDC, IAM roles).
- Dependencies and container images are scanned automatically; findings have SLAs.
- Audit logs from cloud, identity, and source control flow to a central immutable store.
- A documented response plan exists for common security incident types.
- Security is shared responsibility, not "the security team's problem."

## Recommended default

A layered, mostly automated baseline you can stand up in 4-6 weeks:

- **Identity:** Okta / Google Workspace / Entra as the IDP. SSO + MFA enforced everywhere. SCIM for provisioning. Quarterly access reviews.
- **Secrets:** AWS Secrets Manager or Vault. Apps read at runtime. No `.env` in source control. Rotate quarterly minimum.
- **Pre-commit + CI scanning:** `gitleaks` or GitHub Secret Scanning for committed secrets; **Dependabot** or **Renovate** for dependencies; **Trivy** for container images; **Semgrep** for SAST.
- **Cloud posture:** **AWS Security Hub** + **GuardDuty** (or equivalents). For multi-cloud or deeper coverage, **Wiz** or **Orca** are worth it at 50+ engineers.
- **Endpoint:** managed fleet (Jamf / Kandji / Intune). Disk encryption enforced. EDR (CrowdStrike, SentinelOne) above 30 employees.
- **Audit logging:** CloudTrail to a separate, write-only S3 bucket in a security account. IDP and source-control audit logs to the same destination.

> **Alternatives:**
> - **HashiCorp Vault** for secrets — pick if multi-cloud, hybrid, or you need dynamic secrets (DB credentials minted on demand). Operationally heavier.
> - **Doppler / Infisical** for secrets — pick if you want a developer-friendly UX and don't need cloud-native integration depth.
> - **Snyk** — pick over Dependabot/Trivy/Semgrep if you want one vendor for SCA + SAST + container with better triage UX. Costs more.
> - **Tailscale / Cloudflare Access** for network-layer access — pick over a traditional VPN. Far better UX.

## Vulnerability management

Without a **service level agreement** (**SLA**), scan results are decoration. Pick something like: critical within 7 days, high within 30, medium within 90, low tracked with no SLA. Findings flow into your normal backlog (Jira, Linear). Someone reviews weekly. Accept risks explicitly — write them down with an owner and an expiry date.

## Compliance posture

If you sell to anyone bigger than yourself, you will eventually need SOC 2 Type II. Most of this section already gets you there. **Vanta / Drata / Secureframe** automate evidence collection across cloud, identity provider, ticketing, and HR — they save hundreds of hours in your first audit. Designate a security owner, even part-time, to run the audit and answer customer questionnaires.

For HIPAA, PCI-DSS, FedRAMP — see the [Enterprise track](../enterprise/00-overview.md).

## Common pitfalls

- **Long-lived AWS access keys** — they end up in dotfiles and screenshots. Use SSO + OIDC.
- **Security as a launch gate** instead of a continuous practice. The end-of-project review becomes a rubber stamp.
- **Scanner output with no triage** — 4,000 findings, ignored, still there at audit time.
- **Broad production access** because roles were too much trouble. Least privilege is much harder to retrofit.
- **Skipping MFA on service accounts** — service accounts should not use human credentials in the first place.
- **No incident response for security events.** A security incident is an incident (see [Incident Response](./07-incident-response.md)).
- **Buying tools instead of building habits.** A scanner nobody acts on is worse than no scanner.

## Quick checklist

- [ ] SSO + MFA enforced for every business and infrastructure tool.
- [ ] No long-lived cloud access keys exist for humans or CI.
- [ ] Secret scanning is enabled in CI and as a pre-commit hook.
- [ ] Dependencies are scanned and updates are reviewed weekly.
- [ ] Container images are scanned in CI; criticals block the pipeline.
- [ ] Cloud audit logs flow to a separate, write-protected account.
- [ ] You have an inventory of who has production access and review it quarterly.
- [ ] You have a written, tested security incident response plan.
- [ ] Vulnerability findings have SLAs and are tracked in your normal backlog.
- [ ] A named person owns security, even if part-time.
