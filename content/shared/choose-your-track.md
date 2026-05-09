---
title: Choose your track
type: navigator
summary: A short decision flow to pick the track that fits your business context.
---

The three tracks cover the same 12 domains but make different default assumptions about deploy cadence, compliance, and team scale. Picking the wrong track is recoverable but wastes weeks, because the recommended tooling and sequencing diverge early. Run through the questions below in order and stop at the first one that gives you a clear answer.

## Decision flow

1. **Are you subject to a named regulatory regime today (HIPAA, PCI-DSS, FedRAMP, SOX, NIST 800-53, or a comparable national standard)?**
   If yes, go to **Enterprise / regulated**. The other tracks will not produce evidence your auditors accept.
2. **Do you ship a multi-tenant SaaS product where customers expect daily-or-better updates and your contracts reference SOC 2 or ISO 27001?**
   If yes, go to **Cloud-native SaaS**.
3. **Is your engineering org larger than ~200 people, or do you operate across multiple business units with separate P&Ls?**
   If yes, go to **Enterprise / regulated**, even if you are not yet regulated. The coordination cost dominates.
4. **Do you deploy multiple times per day, run on Kubernetes or serverless, and treat the cloud account as the unit of isolation?**
   If yes, go to **Cloud-native SaaS**.
5. **Are you 5–50 engineers, shipping weekly or faster, with no formal compliance program?**
   If yes, go to **Generic**.
6. **Are you an internal IT or shared-services team supporting a non-software business?**
   Go to **Generic**, and pull from **Enterprise** for change management and access control.

## When in doubt

Default to **Generic**. It assumes the least and produces the most portable artifacts. You can graduate to SaaS or Enterprise once you know which constraints actually bind. Picking Enterprise too early bakes in process weight that will slow a small team to a crawl.

## I'm in transition

Most real organizations live between tracks. A few common patterns:

- **SaaS preparing for SOC 2 or ISO 27001** — start in **SaaS**, then layer in the **Enterprise** sections on Security and Source Control (specifically: change evidence, access reviews, separation of duties).
- **Generic team picking up a regulated customer** — stay **Generic** for team structure and CI/CD, adopt **Enterprise** for IaC, cloud platform, and security.
- **Enterprise BU spinning out a cloud-native product** — run that BU on the **SaaS** track even if the parent is on Enterprise. Wrap a thin governance layer around it.
- **Post-acquisition integration** — keep both tracks running side by side for the first two quarters. Merging operating models on day one fails predictably.

If you are mid-transition, mark the sections where you are deliberately deviating from your chosen track. Your future self and your next auditor will thank you.
