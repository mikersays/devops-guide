---
title: CI/CD
track: enterprise
order: 3
summary: Pipelines as the system of record for production change, with approval gates, tagged artifact promotion, and evidence capture.
---

The pipeline is the control. In a regulated organization, CI/CD is not just how code reaches production; it is the mechanism that enforces every change-management control your auditor will test. Designed correctly, the pipeline generates evidence as a side effect of every deploy. Designed poorly, it generates audit findings.

## Why it matters

If a human can put code into production without a pipeline run, you have no change management. If a pipeline can deploy without recording who approved what, you have no evidence. Most enterprise CI/CD failures are not technical; they are about trust boundaries. The control objective is simple to state and hard to implement: production changes happen only via pipeline, the pipeline itself is under change control, and every run produces durable evidence.

Three concrete failure modes drive most enterprise CI/CD findings. A breach traceable to an unreviewed deploy ends up in your incident-response timeline. For SOX-in-scope issuers, missing approval evidence in financial-reporting systems becomes a Section 404 ITGC deficiency, which (depending on aggregation with other deficiencies) escalates to a significant deficiency or material weakness. A deploy that ships PHI to a non-production region or a non-BAA processor becomes a HIPAA Security Rule violation or reportable breach under 45 CFR 164.400-414. All three are preventable with disciplined pipelines.

## What "good" looks like

- No human has standing write access to production. Deploys happen only via pipeline using short-lived, scoped credentials (OIDC federation).
- Promotions to production require an explicit approval from a named approver who is not the change author, captured in the pipeline run record.
- Artifacts are built once, tagged with an immutable identifier, signed, and promoted unchanged across environments. Re-builds for production are forbidden.
- Pipeline definitions live in source control, are reviewed like application code, and changes to them require CODEOWNERS approval from Platform and AppSec.
- Each deploy produces an evidence bundle: who, what, when, which approvers, which controls passed, which artifact hash. The bundle is retained for the audit period.
- Private/self-hosted runners are used for any job that touches production secrets or regulated data; runners are ephemeral, hardened, and patched centrally.

## Recommended default

**GitHub Actions on self-hosted ephemeral runners** for the regulated path, with the following architecture:

- **Runners**: ephemeral runners on a hardened OS image, brought up per-job via Actions Runner Controller (ARC) on a dedicated Kubernetes cluster, or via the official EC2/ECS scale set. Runners have no inbound access, pull jobs over outbound HTTPS only.
- **Identity**: GitHub OIDC federated to AWS IAM / Azure AD / GCP Workload Identity Federation. No long-lived cloud keys in CI.
- **Reusable workflows**: Platform team owns a `.github` repo with reusable workflows for build, scan, sign, attest, deploy. Product teams call them; they cannot edit them.
- **Approval gates**: GitHub Environments with required reviewers for `staging` and `prod`. Reviewers are pulled from CODEOWNERS-linked teams. Self-approval blocked.
- **Artifact promotion**: build once into a regulated container registry (ECR with image signing via Cosign, plus SBOM via Syft). Promote by re-tagging, not rebuilding. Generate **SLSA Level 3 build provenance** and **in-toto attestations** alongside the signature — Cosign-without-attestation only proves "someone signed this image," not "this image came from this commit through this builder." GitHub artifact attestations and the official `slsa-github-generator` workflows produce SLSA v1.0-compliant provenance natively; verify on admission (see [Security](./08-security.md)).
- **Evidence capture**: a final `evidence` job per deploy writes a JSON record to an immutable store (S3 with Object Lock, or a dedicated evidence pipeline into the SIEM). Includes commit SHA, artifact digest, approver IDs, scan results, and timestamp.

For high-side or air-gapped environments, mirror this on **GitHub Enterprise Server** with self-hosted runners inside the enclave and the artifact registry inside the boundary.

## Alternatives

> **Alternatives:**
> - **GitLab Ultimate with self-managed runners**: pick this when GitLab is the source-control standard or when you want CI, registry, and security scanning in one product. Strong policy controls via Compliance Frameworks.
> - **Azure DevOps Pipelines**: pick this in Microsoft-aligned shops with strong Entra ID integration; mature approval workflow.
> - **Jenkins (CloudBees CI)**: pick this only where existing Jenkins investment is too costly to migrate; expect higher operational burden and harder evidence capture.
> - **Argo Workflows + Argo CD** for the deploy half: pick this when Kubernetes is the deploy target and you want GitOps-style continuous reconciliation as the deployment control.

## Compliance mapping

> Framework versions per [Overview](./00-overview.md): Annex A clauses reference ISO/IEC 27001:2022; NIST controls reference 800-53 Rev 5; SOC 2 TSC references are the 2017 criteria with the 2022 points-of-focus update.

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Authorized change deployment | CC8.1 | A.8.32 | CM-3, CM-5 |
| Segregation of duties on approval | CC5.1, CC6.3 | A.5.3 | AC-5 |
| Build integrity and artifact signing | CC7.1 | A.8.28, A.8.30 | SA-10, SR-4 |
| Use of short-lived credentials | CC6.1 | A.5.17 | IA-5, AC-2 |
| Evidence retention for changes | CC7.2 | A.8.15, A.5.33 | AU-2, AU-11 |

## Common pitfalls

- Letting product teams write their own deploy jobs that bypass platform-provided reusable workflows; controls only hold if the controlled path is the only path.
- Storing approver lists in pipeline YAML where the change author can edit them; pull approvers from CODEOWNERS or a system of record outside the repo.
- Treating "the build passed" as the evidence; you need the artifact digest, the scan results, and the approver identity tied together.
- Using long-lived service principal credentials in CI because OIDC setup felt hard; this is the most common privileged-access finding.
- Allowing manual `kubectl apply` or `terraform apply` from laptops to production "for emergencies"; design a documented break-glass path instead (see [Incident Response](./07-incident-response.md)).
- Self-hosted runners that are persistent VMs with cached secrets; use ephemeral runners or nothing.

## Quick checklist

- [ ] No human IAM principal has standing deploy permissions to production.
- [ ] Every production deploy in the last 90 days has an evidence record retrievable in under one minute.
- [ ] Pipeline definitions require CODEOWNERS approval from Platform and AppSec to change.
- [ ] Artifacts are built once and promoted by digest; rebuilds for prod are blocked.
- [ ] SLSA Level 3 build provenance is generated and verified at admission for production images.
- [ ] Self-approval of production deploys is technically prevented, not just discouraged.
- [ ] Approver lists are sourced from CODEOWNERS or an external system of record, not from in-repo YAML the author can edit.
- [ ] Runners are ephemeral, patched centrally, and have no inbound network access.
- [ ] Break-glass deploy path exists, is documented, and triggers an automatic post-incident review.
- [ ] OIDC federation is in use; cloud admin keys are not stored in CI.
