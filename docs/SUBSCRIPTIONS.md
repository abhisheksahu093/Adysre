# Subscriptions and Feature Access

> How entitlement is stored, decided and enforced. The database is the source of
> truth; no limit is hardcoded in a component.

---

## 1. Two concepts that must not be merged

**A plan is what you buy. A tier is what you get.**

```
plans (SKU)                    tier          limits
────────────────────────────────────────────────────────
free        $0                 free      ─┐
annual      $X / year          premium   ─┼─►  tier_features
lifetime    $Y once            premium   ─┤    (one row per limit)
team        $Z / year          enterprise─┘
```

Keeping them apart is what makes pricing changes safe. `annual` and `lifetime`
differ in how they are billed and in nothing else, so they must not each carry
their own copy of "5 collections". A seasonal promotion, a price change or a new
SKU is then a row in `plans` and touches no entitlement logic at all.

This is also what `apps/web/src/lib/checkout.ts` already assumes: the client
sends only a plan id and the server resolves the price, never trusting the
request body for money.

**Consequence for the code:** nothing outside the subscription service should
ever ask "which plan is this?". It asks "what is this workspace entitled to?".

---

## 2. Entitlement is per workspace, not per user

A subscription belongs to an `Organization` (the tenant). Every member inherits
it.

That follows the data rather than the other way round: collections, QR codes,
resumes, design projects and scans all carry `tenant_id` and are visible to the
whole workspace. If quotas were per user, a ten-person free workspace could
create fifty collections that everyone can see, and the limit would mean
nothing.

`feature_usage_events` still records **which user** performed each action, because
"who used the last scan" is a real support question. The count that matters is
per tenant.

---

## 3. Stock and flow: the distinction the limits depend on

Two of your limits look alike and behave completely differently.

| | **Stock** | **Flow** |
|---|---|---|
| Means | how many may exist at once | how many may happen in a period |
| Example | 5 API Studio collections | 5 QR downloads |
| Counted from | the owning table (`SELECT count(*)`) | `feature_usage_events` |
| Deleting frees a slot | **yes** | **no** |
| Window | none, it is a ceiling | day, week, month, rolling, lifetime |

"Max 5 collections" is a ceiling: delete one and you may create another. "5
downloads" is consumption: deleting the QR code does not give the download back.

Treating a stock limit as a flow is the mistake that produces the worst support
ticket in this system, where a user deletes everything, still cannot create, and
is told they are at their limit of zero things.

`meterKind` on each feature records which it is, and the two are counted by
different code paths.

---

## 4. Windows

`tier_features` carries a window per limit, so one feature can have several.

| `windowKind` | Meaning | Resets |
|---|---|---|
| `none` | stock ceiling, no time component | never |
| `day` / `week` / `month` | calendar period, UTC | at the period boundary |
| `rolling` | the last N seconds, always | continuously |
| `lifetime` | since the workspace was created | never |

**Website Intelligence needs two limits at once**: 3 per 24 hours *and* 5 per
rolling week. So `tier_features` is a LIST of limits per (tier, feature), not one
row. A request must satisfy every limit; the one that denies is the one reported,
and the one with the soonest reset is the one shown to the user.

**Rolling, not calendar, is why usage is an event log.** A counter row can
express "3 today" but cannot express "3 in the last 24 hours", because that
answer changes every second without anything being written. Storing one row per
event answers both, and lets the UI say exactly when the next slot frees up.
Volumes make this easy: the largest quota here is five per week.

Calendar windows are evaluated in **UTC**. A tenant-local day would need a
timezone per workspace and would make "resets at" ambiguous during DST. Worth
revisiting when tenants ask for it; not before.

---

## 5. The feature catalogue

Seeded, not hardcoded. Changing a number is a seed edit and a migration-free
deploy.

| Feature key | Meter | Free limit | Notes |
|---|---|---|---|
| `api-studio.collections` | stock | 5 | delete to free a slot |
| `design-playground.projects` | stock | 5 | |
| `builder.pages` | stock | 1 | "Customize Project": one page |
| `builder.generate-code` | flow / lifetime | **0** | premium-only, prompts upgrade |
| `tools.qr.download` | flow / lifetime | 5 | |
| `tools.barcode.download` | flow / lifetime | 5 | |
| `tools.invoice.generate` | flow / lifetime | 5 | |
| `tools.salary-slip.generate` | flow / lifetime | 5 | |
| `tools.signature.generate` | flow / lifetime | 5 | |
| `tools.resume.generate` | flow / lifetime | 5 | |
| `tools.ats.scan` | flow / lifetime | 5 | |
| `ai-tools.phase2.generate` | flow / lifetime | 2 | upscaler, enhancer, face-blur, smart-crop |
| `website-intel.scan` | flow / rolling 24h | 3 | **and** the row below |
| `website-intel.scan` | flow / rolling 7d | 5 | both must pass |

Premium and Enterprise are **unlimited on every feature**, stored as
`limitValue = NULL`. Enterprise differentiates on seats, support and SSO rather
than on counters.

Three values with distinct meanings, and the difference matters:

```
limitValue = NULL   unlimited
limitValue = 0      not available on this tier at all (upgrade to unlock)
limitValue = N      metered
```

Phase-1 AI tools are absent from the table on purpose. They run entirely in the
browser, cost nothing to serve, and a limit on them would be unenforceable
anyway.

**`lifetime` on the tool quotas is a decision, not a law.** "5 downloads" with no
stated period reads as five ever, which is what is seeded. If that proves too
tight, changing it to monthly is one seed row, because nothing in the UI knows
the number.

---

## 6. Enforcement

### Both sides, and only one of them is a control

The frontend gates for **experience**: it shows what is left, disables what is
spent, and explains why. The backend gates for **correctness**. A client that
skips the modal and posts directly must still be refused, so every metered
action is enforced in its route handler. The UI check is never the thing
standing between a free workspace and unlimited use.

### `check` and `consume` are not the same operation

Your spec has `POST /usage/check` followed by `POST /usage/increment`. That
sequence is a time-of-check-to-time-of-use race: two concurrent requests both
read "4 of 5", both pass, both increment, and the workspace ends with 6. It is
the same fault the rate limiter had before its counter became a single
statement, and a parallel test is what caught it there.

So:

| Endpoint | Purpose | May be used to authorise? |
|---|---|---|
| `POST /api/usage/check` | advisory, for UI | **No** |
| `POST /api/usage/consume` | check and record, atomically | Yes |

`consume` takes a Postgres **transaction-scoped advisory lock** on
`(tenant, feature)`, counts inside the lock, and inserts only if the count still
permits it. Concurrent consumers for the same key serialise; different keys do
not block each other.

```
BEGIN
  pg_advisory_xact_lock(hash(tenantId, featureKey))
  count = current usage in window          -- nobody else can be inside here
  if count + quantity > limit  →  ROLLBACK, denied
  INSERT feature_usage_events
COMMIT
```

For **stock** features the same lock wraps the count and the create, so two
simultaneous "create collection" calls cannot both see four.

### Refunds

A flow event that fails after being consumed (a generation that errored) should
be released, or a user pays for our failure. `consume` returns a handle, and
`release` deletes that row. Handlers consume *then* do the work, and release on
failure: consuming afterwards would let a caller take the work without ever
being counted.

---

## 7. API

All same-origin under `/api`, all authenticated by the session cookie.

```
GET  /api/subscription           current tier, plan, status, renewal
GET  /api/usage                  every feature, limit, used, remaining, resetsAt
POST /api/usage/check            {featureKey, quantity?} → advisory allowed
POST /api/usage/consume          {featureKey, quantity?} → allowed + handle
POST /api/subscription/upgrade   {planKey} → checkout session or direct change
```

`GET /api/usage` returns the whole picture in one call so a page renders every
badge without a request per feature.

Denials answer **402 Payment Required**, not 403. The caller is authenticated and
permitted; they have simply run out. Distinguishing the two lets the client show
an upgrade prompt for one and an access error for the other without parsing
prose.

```jsonc
{
  "success": false,
  "code": "QUOTA_EXCEEDED",
  "message": "You have used all 5 QR downloads on the Free plan.",
  "data": {
    "featureKey": "tools.qr.download",
    "limit": 5, "used": 5, "remaining": 0,
    "windowKind": "lifetime", "resetsAt": null,
    "tier": "free"
  }
}
```

The body carries everything the upgrade modal renders, so the client never
maintains a second copy of the limits.

---

## 8. Frontend

| Piece | Job |
|---|---|
| `useEntitlement()` | one cached query behind `GET /api/usage`; every component reads it |
| `<FeatureGate feature>` | renders children, or the locked state, from real data |
| `<UsageBadge feature>` | "3 of 5 left" beside the control |
| `<UsageCounter feature>` | the fuller form, with reset time |
| `<UpgradeBanner>` | persistent nudge when a workspace is near a limit |
| `<PremiumModal>` | ONE modal, opened by any denial |

**One modal, not one per feature.** It takes the feature key and the denial
payload and renders the name, the usage, the comparison and the CTA from that.
A second copy is a second place to update when a limit changes.

Everything shown comes from the API. A component that knows the number 5 is a
component that will one day disagree with the server, and the user will believe
the component.

---

## 9. What replaces the development toggle

`apps/web/src/lib/access-server.ts` currently reads the `adysre_access` cookie
and says so in its own comment: a browser-settable value, deliberately insecure,
to be replaced when auth landed. Auth has landed.

It becomes a read of the tenant's subscription, resolved from the verified
session. `AccessSwitcher` is deleted along with the cookie, and `AccessLevel`
grows a third value.

**Failure stays closed.** Any error resolving entitlement returns the free tier.
A bug then denies access rather than giving the product away, which is the right
direction to fail in.

---

## 10. Existing workspaces

Two things could go wrong on the day this ships.

**Every tenant needs a subscription row.** Anything without one would resolve to
no entitlement at all. The migration backfills a free subscription for every
existing organization, and the resolver treats a missing row as free rather than
as an error.

**Some workspaces may already exceed the new free limits.** Nothing is ever
deleted or hidden: stock limits are enforced on **creation only**, so a
workspace with seven collections keeps all seven and cannot add an eighth. The
alternative, hiding data someone already made, would be indefensible.

---

## 11. Deliberately not in this phase

| Item | Why |
|---|---|
| Real payment capture | needs a provider account and webhook verification; `upgrade` records intent and returns a checkout URL |
| Proration and refunds | follows the provider |
| Per-seat billing for Enterprise | needs seat counting, which needs invitations |
| Usage analytics dashboards | the event log makes them possible later |
