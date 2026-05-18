---
title: Docs & Knowledge
track: enterprise
order: 9
summary: Controlled documentation, ADRs as evidence, version-controlled policies, and training records that satisfy audit requirements.
---

## Why it matters

In a regulated organization, documentation is a control surface, not a courtesy. The auditor will sample policies and ask whether they were approved, whether engineers acknowledged them, and whether reality matches them. Most organizations make the mistake of putting policy in one system (a GRC platform), procedure in another (a wiki), runbooks in a third (Confluence pages decaying since 2019), and design records nowhere at all. The result is a documentation debt that surfaces during every audit. Documentation that auditors trust shares three properties: it is version-controlled, it is approved through a defined process, and it is reachable from the systems it describes. Documentation that engineers trust shares those same properties, plus one more: it is current. The same disciplines satisfy both audiences when designed once.

Weak documentation accumulates as a tax on every adjacent function. Engineers cannot safely operate systems they do not understand, so runbook gaps become incident-duration multipliers. Auditors cannot grant opinions on processes they cannot verify, so policy gaps become qualified opinions and management-letter comments. New hires take months rather than weeks to become productive, and the cost is denominated in fully-loaded engineering time. Knowledge concentrates in a handful of senior engineers, and their departures turn into recoverable-but-painful incidents that the org has to learn from for two quarters.

## What "good" looks like

- Policies (the "what" and "why") are version-controlled in a separate repo from code, with formal approval workflow, annual review, and an attestation system that records who acknowledged each version.
- Standards and procedures (the "how") live alongside code where possible, in repos owned by the team that operates the system. They are reviewed when the system changes, not on a calendar.
- Architecture Decision Records (ADRs) are committed alongside code, follow a template, and are referenced from PRs that implement them. Significant changes require an ADR.
- Runbooks are co-located with the service they describe, link to dashboards and alerts, and are exercised during tabletops and onboarding.
- A service catalog (Backstage or equivalent) is the entry point: every service has an owner, a tier, a runbook link, an SLO link, and a recent on-call test.
- Training records exist in a system of record (LMS), are reviewed at hire and annually, and feed into the controls matrix as evidence for security awareness, secure coding, and privacy training.

## Recommended default

**Policies in a dedicated `policies` Git repo, technical docs in MkDocs/Backstage, training in a corporate LMS**, with a defined publication pipeline:

- **Policy repo**: Markdown files, a CODEOWNERS list of the policy owners (CISO, General Counsel, CFO depending on policy), required two-party approval, signed commits. Each policy carries front matter with version, effective date, owner, last review, next review. A CI job rejects merges where the next-review date is in the past.
- **Policy publication**: a static site generator (MkDocs Material or Docusaurus) renders the policies into an internal portal. Acknowledgement is captured in an attestation system (GRC platform like Drata/Vanta/Hyperproof, or a homegrown tool that signs attestations into a tamper-evident log).
- **ADRs**: each repo has a `docs/adr/` directory; ADRs are numbered, follow the Nygard template (Context, Decision, Consequences), and are reviewed in PRs. Significant ADRs are linked from the service catalog.
- **Service catalog**: Backstage as the canonical inventory. Every service registered with `catalog-info.yaml`. Catalog data feeds into the in-scope-systems registry consumed by [Observability](./06-observability.md) and [Security](./08-security.md).
- **Runbooks**: in the service repo under `docs/runbooks/`, linked from PagerDuty alerts. Runbook drift is caught by a quarterly "did anyone touch this?" report.
- **Training records**: two adjacent categories that are often conflated. **Security awareness platforms** (KnowBe4, Proofpoint Security Awareness, Hoxhunt) handle phishing simulation, security/privacy/HIPAA refreshers, and the role-based security curriculum that maps to SOC 2 CC1.4, ISO A.6.3, and 800-53 AT-2/AT-3. **General corporate LMS** (Workday Learning, Cornerstone, Docebo, SAP SuccessFactors Learning) handles code-of-conduct, manager training, technical certifications, and the broader compliance curriculum (anti-bribery, harassment prevention, export controls). Run them as separate systems integrated to the same identity source rather than expecting one platform to cover both well. Both export quarterly into the controls matrix.

## Alternatives

> **Alternatives:**
> - **Confluence + Jira + a GRC platform**: pick this where Atlassian is the corporate standard; expect more manual work to keep policy, procedure, and code in sync. Strong if your auditors already accept Confluence as a controlled document store.
> - **Notion as the primary docs surface**: pick this only if your auditors accept it as a controlled system; the access controls and version history are weaker than Git for policy purposes.
> - **SharePoint + Microsoft Purview**: pick this in Microsoft-aligned shops; mature for policy lifecycle and attestation, weaker for engineer-facing technical docs.
> - **Read the Docs Business / GitBook for technical docs**: pick these as alternatives to MkDocs when hosted-platform features outweigh self-hosting simplicity.

## Compliance mapping

> Framework versions per [Overview](./00-overview.md): Annex A clauses reference ISO/IEC 27001:2022; NIST controls reference 800-53 Rev 5; SOC 2 TSC references are the 2017 criteria with the 2022 points-of-focus update.

| Practice | SOC 2 (TSC) | ISO 27001 (Annex A) | NIST 800-53 |
|---|---|---|---|
| Documented policies and procedures | CC1.1, CC2.2 | A.5.1, A.5.10 | PL-1, PL-2 |
| Policy review and approval | CC1.3 | A.5.1 | PM-1 |
| Acknowledgement / attestation | CC2.2 | A.6.3 | PL-4, PS-6 |
| Security awareness training | CC1.4 | A.6.3 | AT-2, AT-3 |
| Records management and retention | CC2.1 | A.5.33 | AU-11, MP-6 |
| Architecture documentation | CC8.1 | A.8.27 | SA-3, SA-5 |

## Common pitfalls

- Three sources of truth for the same information; engineers will pick the one that is wrong, and so will auditors.
- Annual policy review treated as a calendar exercise; policies that have not changed in five years probably should have.
- ADRs only for new projects; the highest-leverage ADRs document why an existing system is the way it is.
- Runbooks written once during launch and never touched; tie runbook review to the service's deploy frequency or incident frequency.
- Treating training as a checkbox; role-specific training for engineers handling regulated data is a real control and should be measurable.
- A service catalog with stale ownership; require ownership re-attestation quarterly, and treat "no current owner" as a Sev 3 incident.

## Quick checklist

- [ ] Policies are version-controlled, approved, and have current effective dates.
- [ ] Acknowledgement is captured per version per employee in a tamper-evident system.
- [ ] Every Tier 1 service has a current runbook, an owner, and an ADR for its core design choices.
- [ ] Service catalog coverage is at or near 100% of in-scope systems.
- [ ] ADR template exists and recent significant changes have ADRs.
- [ ] Annual policy review is scheduled, owned, and tracked to completion.
- [ ] Training records export cleanly into the controls evidence pipeline.
- [ ] Documentation drift has a measurable signal (last-touched date, broken links, ownership gaps) and a triage process.
