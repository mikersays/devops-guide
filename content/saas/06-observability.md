---
title: Observability
track: saas
order: 6
summary: OpenTelemetry-instrumented services feeding Datadog or Grafana, with SLOs, error budgets, and structured everything.
---

# Observability

## Why it matters

You cannot operate what you cannot see. In a microservice-based SaaS, a 200ms p99 regression in service C can be the *cause* of a 5s checkout failure in service A — and you will never find it without distributed tracing. Observability done right cuts MTTR by an order of magnitude and turns "the site feels slow" into "service X's database connection pool is saturated."

## What "good" looks like

- Every service emits structured logs, RED metrics (Rate, Errors, Duration), and traces by default — not as a per-team project
- A new engineer can answer "why is this request slow?" via a trace in < 5 minutes
- SLOs defined for every user-facing service; error budget burn drives release decisions
- Alerts page humans only on user-impacting symptoms, not internal causes (e.g. CPU > 80% should not page)
- Dashboards are owned, named, and discoverable — not graveyards from past incidents
- Logs, metrics, and traces correlate by `trace_id` and `request_id` across services
- Cardinality and retention costs are tracked monthly (see [Cost](./10-cost.md))

## Recommended default

**Instrumentation: OpenTelemetry.** Use the OTel SDK and auto-instrumentation for your language. Avoid vendor-proprietary agents — OTel keeps your data portable.

**Backend: Datadog** for the all-in-one experience, or **Grafana Cloud** (Loki + Mimir + Tempo) when cost or open-source posture matters more than convenience.

**The three signals:**

- **Logs**: structured JSON, one event per line, including `trace_id`, `span_id`, `service`, `env`, `request_id`, `user_id` (hashed). Ship via **Vector** or the **OTel Collector** itself; Fluent Bit is the alternative if you already run it. Sample debug logs aggressively in prod.
- **Metrics**: RED for every service endpoint; USE (Utilization, Saturation, Errors) for resources. Prometheus exposition format via OTel.
- **Traces**: default to **tail sampling** (Refinery, or the Grafana / OTel tail-sampling processor) so you keep the slow and erroring traces and drop the boring ones. Head sampling at a flat 1–10% is fine only if you're very cost-constrained — don't apply both at the same span. Propagate W3C trace context across all hops, including async (SQS, Kafka, EventBridge).

**SLOs and error budgets:**

- Every user-facing service has at least one **availability SLO** (e.g. 99.9% of requests succeed) and one **latency SLO** (e.g. 99% of requests < 300ms) over a 28-day rolling window
- Error budget = (1 - SLO) × time. When you're burning budget, the team prioritizes reliability work over features
- Use Datadog SLO widgets / Grafana SLO / **Nobl9** / **Sloth** to define and track them as code

**Alerting philosophy:**

- Page on **symptoms** (SLO burn, customer-visible errors), not causes
- Two tiers: **page** (wake someone up, action required now) vs. **ticket** (notice, deal with in business hours)
- Every page must point to a runbook (see [Incident Response](./07-incident-response.md))
- Quarterly alert review: kill anything that fired and didn't lead to action

## Naming and tagging

Standardize tags across logs, metrics, and traces: `service`, `env`, `version`, `region`, `team`. Without this, correlation is brittle.

> **Alternatives:**
> - **Grafana Cloud** (Loki + Mimir + Tempo + Pyroscope): pick when Datadog cost projections look ugly at scale, or you want OSS-aligned tooling.
> - **New Relic**: strong APM, simpler pricing model than Datadog at certain scales.
> - **Honeycomb**: pick when high-cardinality debugging and BubbleUp-style exploration matter more than dashboards. Excellent for trace-first cultures.
> - **Self-hosted Prometheus + Loki + Tempo**: pick only if you have the platform team to babysit it; the savings rarely pencil out below 50 engineers.

## Common pitfalls

- **Logs as the only signal** — you will grep your way through outages forever
- **Vendor agents instead of OTel** — vendor-locked telemetry is a switching-cost trap
- **Page-on-cause** alerts (CPU, memory) that do not correlate with user pain
- **Cardinality explosions** from putting `user_id` or `request_id` in metric labels — bill shock incoming
- **Dashboards nobody owns** — graveyard of past incidents nobody trusts
- **No SLOs**, just gut-feel reliability conversations
- **Sampling traces at 100%** in prod — cost will eat you alive

## Quick checklist

- [ ] OpenTelemetry SDK in every service, auto-instrumented where possible
- [ ] Structured JSON logs with `trace_id` correlation
- [ ] RED metrics on every service; dashboard auto-generated from a template
- [ ] At least one SLO per user-facing service; tracked in code
- [ ] Error-budget policy documented and respected
- [ ] All alerts link to a runbook
- [ ] Quarterly alert hygiene review
- [ ] Trace propagation tested across async boundaries
- [ ] Telemetry cost tracked and budgeted monthly
- [ ] Service catalog cross-references dashboards (see [Docs](./09-docs-knowledge.md))
