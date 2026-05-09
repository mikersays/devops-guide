---
title: Observability
track: generic
order: 6
summary: Logs, metrics, traces, SLOs, and alerts that wake the right person for the right reason.
---

## Why it matters

You cannot operate what you cannot see. Observability is the difference between "we will know the site is down when customers tweet" and "error rate on `/checkout` jumped 30 seconds ago, here is the trace, here is the deploy that caused it." Get it right and incidents shrink from hours to minutes. Get it wrong and you live in war rooms reading dashboards that do not answer the question.

## What "good" looks like

- Every service emits structured logs, RED metrics (Rate, Errors, Duration), and distributed traces.
- One place to search logs across all services. One place for metrics. Ideally one place for both, plus traces.
- Dashboards exist for every Tier 1 service and answer the question "is this service healthy right now?" in under 10 seconds.
- SLOs exist for user-facing services with defined error budgets.
- Alerts page humans only when humans need to act. Everything else is a ticket or a dashboard.
- Telemetry is correlated: a log line links to its trace, a trace links to its metrics, a deploy event annotates the dashboard.

## Recommended default

**Datadog** for orgs that prefer a managed all-in-one and have the budget; **Grafana Cloud** (with Prometheus / Loki / Tempo) for orgs that want lower per-host cost or more open-source flexibility.

Instrumentation:

- **OpenTelemetry SDKs** in every service. Vendor-neutral; swap backends without re-instrumenting.
- **Structured JSON logs.** One event per line. Include `service`, `env`, `trace_id`, `request_id`, `user_id` where relevant.
- **RED metrics** from your HTTP framework or service mesh. Add USE metrics for infrastructure.
- **Trace sampling:** 100% in dev, 1-10% in prod. Always sample errors.

Pillars to build, in order:

1. **Centralized logging** — every service's logs queryable in one tool. Resolves half of "I don't know what happened" incidents.
2. **Metrics + dashboards** — RED dashboard per service. One org overview.
3. **Alerting on symptoms** — user-visible pain (error rate, p99, queue depth), not causes (CPU > 80%).
4. **Tracing** — start with the request path through your top 5 services.
5. **SLOs and error budgets** — once 1-3 are stable, add SLOs for Tier 1 services and budget-based alerts.

> **Alternatives:**
> - **Self-hosted Prometheus + Loki + Grafana + Tempo (LGTM stack)** — pick if you have platform engineering capacity and want to control cost at scale. Operationally non-trivial.
> - **New Relic** — pick if you want a strong APM-first vendor with predictable per-user pricing.
> - **Honeycomb** — pick if you are tracing-first, do high-cardinality debugging, and have engineers who will use BubbleUp. Great for complex distributed systems.
> - **AWS CloudWatch + X-Ray** — pick only if cost is paramount and you're AWS-only. The UX is a meaningful step down.

## SLOs and alerting

For each Tier 1 service: define 1-3 SLOs (typically availability and latency), set an error budget from the target, and alert on **burn rate** rather than raw thresholds. Page only when burn rate threatens to exhaust the budget within hours.

Alerting hygiene: every page must be actionable, urgent, and real. Use three categories: page (wakes someone), ticket (business hours), info (dashboard only). Every page links to a [runbook](./07-incident-response.md). A page that fires weekly without triggering action is broken — tune it or delete it.

## Common pitfalls

- **Cause-based alerts** (CPU high, disk filling) instead of symptom alerts. These page constantly without correlating to user pain.
- **Dashboards as decoration.** If no one looks at a dashboard in an incident, it is wallpaper.
- **Logs without structure.** Unsearchable `printf` debugging at scale.
- **Sampling out errors.** Always keep 100% of error traces.
- **One mega-dashboard with 80 panels.** Nobody can read it. Build per-service overviews.
- **Observability budget surprises.** Cardinality can 10x your bill overnight.
- **No ownership of the observability platform.** It rots. Dashboards drift and alerts bit-rot.

## Quick checklist

- [ ] All services emit structured JSON logs to a central destination.
- [ ] OpenTelemetry SDKs are in place for new services as a standard.
- [ ] Each Tier 1 service has a RED dashboard.
- [ ] At least one user-facing service has a defined SLO.
- [ ] Every alert that pages a human links to a runbook.
- [ ] You can find a request across logs, metrics, and traces using a shared `trace_id`.
- [ ] Alert volume is reviewed monthly; noisy alerts are tuned or deleted.
- [ ] Deploys annotate dashboards so you can correlate changes to incidents.
- [ ] Telemetry costs are tracked and budgeted.
