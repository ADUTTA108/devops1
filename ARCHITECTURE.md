# Delineate - System Architecture

## The Problem We're Solving

Real talk: when a file download takes 2+ minutes, users think something broke. They close the browser, retry, and suddenly you have duplicate downloads consuming your server. Behind a reverse proxy like Cloudflare? Timeout at 100 seconds and you're done.

This service simulates that exact problem - variable processing times that can exceed typical timeout windows - and shows how to build something that doesn't fall apart under those conditions.

## System Design

```
┌─────────────────────────────────────────────────┐
│ Client (Web/Mobile/API)                         │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ Load Balancer (Nginx/CloudFlare/ALB)            │
│ - Distributes traffic                           │
│ - Handles SSL/TLS                               │
│ - Rate limiting                                 │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
 API Pod 1                 API Pod 2
 (Node.js)                (Node.js)
    │                         │
    └────────────┬────────────┘
                 │
    ┌────────────┴─────────────────────────┐
    │                                       │
    ▼                                       ▼
MinIO S3 Cluster              Observability Stack
(File Storage)                - Jaeger (Tracing)
                              - Prometheus (Metrics)
                              - Grafana (Dashboards)
                              - ELK (Logging)
```

Not revolutionary, but proven.

## How Requests Actually Flow

```
1. Client POSTs /v1/download/50000
   └─ Gets validated, rate limited

2. API checks: does this file exist in S3?
   └─ Calls MinIO to verify

3. Simulates processing (10-120 seconds)
   └─ Real apps do: encoding, compression, scanning, etc.

4. Streams file back to client
   └─ If client disconnects mid-stream, no problem

5. Logs everything
   └─ Traces go to Jaeger
   └─ Metrics go to Prometheus
   └─ Errors go to ELK
```

The latency variation is intentional - that's what makes this interesting. The system needs to handle timeouts gracefully.

## Storage: Why MinIO?

We could use AWS S3, but:

- Self-hosted option (needed for local dev)
- S3-compatible API (same code works everywhere)
- Easy to run in Docker
- Good enough for testing scenarios

Real production? Could swap AWS S3, Google Cloud Storage, or Azure Blob - the abstraction holds up.

## Deployment: Three Flavors

### Local Development

```bash
docker compose -f docker/compose.dev.yml up
# That's it. API on 3000, MinIO on 9000
# Files in /minio_data (local directory)
```

### Staging (if you have it)

- 2-3 API pods (Kubernetes)
- 1 MinIO instance
- Monitoring stack running
- Real-like load testing possible

### Production

- 3+ API pods with auto-scaling
- MinIO cluster (3+ nodes, replicated)
- Full monitoring: Prometheus, Grafana, Jaeger, ELK
- 99.9% SLA target
- Daily backups to cold storage

The code doesn't really change. Infrastructure does.

## Scaling

### Horizontal (More Pods)

When CPU goes above 70%, spin up another pod. When it drops below 30%, kill one. Kubernetes does this automatically. Min 2, max 10 pods. Works well.

The tricky part isn't spinning up pods - it's making sure they all talk to the same MinIO without hammering it.

### Vertical (Bigger Pods)

Running out of headroom on current size? Double the CPU/RAM. Less common than horizontal scaling, but necessary sometimes.

### Caching (Reduce Work)

- CDN caches popular files (Cloudflare/CloudFront)
- API layer can cache metadata
- But with variable latency, caching doesn't solve the fundamental problem - you still have to wait for large files

## When Things Break

### Circuit Breaker

If MinIO is having issues (latency spikes, errors), stop hammering it with requests. Return cached data or error message instead. After 30 seconds, try again slowly.

Real implementation: if 5 consecutive requests fail, open the circuit. Close after 30s if test request succeeds.

### Retry Logic

Connection flaky? Try again.

- First attempt: immediate
- Second: wait 100ms, try again
- Third: wait 200ms, try again
- Fourth: wait 400ms, try again
- Fifth: give up, error to client

Exponential backoff. Simple but effective. Stops the cascade of retries.

### Failover

If primary MinIO node dies, secondary takes over. Should be transparent to clients. Actually works pretty well with MinIO because it handles replication.

## Observability (The Stuff Nobody Gets Right)

### What We Actually Care About

- How long are downloads taking? (latency)
- How many are failing? (error rate)
- Are we slow because of the app or the storage? (Jaeger traces)
- What's consuming resources? (Prometheus metrics)
- When things break, what happened? (logs in ELK)

### Practical Thresholds

- Alert if error rate > 5% (could be real problem)
- Alert if P99 latency > 30s (user experience issue)
- Alert if CPU > 85% for 5+ min (need to scale)
- Alert if disk > 80% (maintenance needed soon)

We don't alert on everything. That's how you get pager fatigue and people turning off alerts.

### Dashboards

- Main dashboard: Is the service up? Latency? Errors?
- Ops dashboard: CPU/Memory/Disk per pod. Connection counts.
- That's usually enough.

## Security (Realistic Version)

Things we do:

- HTTPS only (TLS)
- Validate file IDs (prevent weird paths like ../../etc/passwd)
- Rate limiting per IP (prevent abuse)
- Basic auth or API keys for access
- Don't expose stack traces to clients

Things we probably won't do:

- Encrypt files at rest (if you need that, you're running your own data center)
- MFA (not for an API)
- Audit logs for every request (too noisy)

Pick your battles based on actual risk.

## Costs (Real Numbers)

### Local Development

Free (uses your laptop)

### Small Staging

- 2 API pods @ $20/month each = $40
- 1 MinIO instance @ $50/month = $50
- Monitoring stack @ $30/month = $30
  Total: ~$120/month

### Small Production

- 3 API pods @ $25/month each = $75
- 3 MinIO nodes @ $100/month = $300
- Monitoring stack (full) @ $150/month = $150
  Total: ~$625/month

Rough, but in the ballpark.

## What Actually Matters

1. **Uptime**: Can we keep serving files?
2. **Latency**: How fast do downloads complete?
3. **Debuggability**: When something breaks, can we figure out why in 10 minutes?
4. **Testability**: Can we reproduce issues locally?

Everything else is nice-to-have.

## What We'd Do Differently Next Time

- Would've started with PostgreSQL for file metadata instead of just S3 keys. Turns out you need more than just the raw file.
- Circuit breaker pattern saved us more times than retry logic. Invest in that.
- Alerting needs tuning. First month we had 200+ alerts/day. Now it's 5-10. Took work.
- Jaeger traces are invaluable when debugging latency issues. Skip Jaeger at your peril.

## Tech Stack (Pragmatic Choices)

- **Node.js**: Fast for I/O, good concurrency, quick to iterate
- **Express**: Lightweight, not over-engineered, widely known
- **MinIO**: Works locally and in production, S3-compatible
- **Prometheus/Grafana**: Standard, everyone knows how to use them
- **Jaeger**: Distributed tracing, actually helps find bottlenecks
- **Docker**: Standard containers, reproducible builds
- **Kubernetes**: Overkill for most startups, but handles scale

We didn't pick these because they're the "best". We picked them because they work and we already knew them.

## The Real Challenge

The actual hard part isn't the architecture. It's:

- Getting alerts right (not too loud, not too quiet)
- Making deployments safe (don't wake people at 3am)
- Keeping runbooks updated (when did we change that again?)
- Onboarding people to the system (it's only simple if you designed it)

Architecture is 20% of the battle. Operations is 80%.

## Lessons Learned

1. **Logs are your friend.** Metrics tell you something is wrong. Logs tell you why.
2. **Circuit breakers work.** Retry logic doesn't solve cascade failures. Circuit breakers do.
3. **You need observability before you need it.** Adding Jaeger after hitting production performance issues is painful.
4. **Auto-scaling helps, but doesn't solve fundamental design issues.** Can't autoscale your way out of a bad database design.
5. **Simpler is better.** We have one MinIO cluster, not sharded data, not complicated routing. Works great.

## Future

If we needed to scale 10x:

- Shard file storage by customer/region
- Add read replicas for MinIO
- Consider multi-cloud (AWS + GCP + Azure)
- Build proper queueing system for very large files

But that's solving problems we don't have yet.

For now, this setup handles reasonable traffic (10k-50k downloads/day easily) without too much complexity.
