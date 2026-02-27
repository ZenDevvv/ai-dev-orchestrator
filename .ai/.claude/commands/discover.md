# Discover — App Concept Refinement

Iterative discovery session that clarifies your app concept before Phase 1. Run it as many times as needed until the concept is solid enough to generate a reliable BRD.

---

## Step 1 — Load Existing Context

Read the following if they exist:
- `docs/concept.md` — full contents (the concept built so far)
- `$ARGUMENTS` — treat as new input, additions, or corrections from the user (may be empty on re-runs)

If neither exists, this is a first run. If `docs/concept.md` exists, this is a refinement run.

---

## Step 2 — Synthesize What Is Known

From everything read, build a mental model of the app. Identify what is **clear** vs. what is **vague or missing** across these six categories:

1. **Users & Roles** — who uses the app, what distinct permission levels or personas exist
2. **Core Problem & Value** — what pain this solves, what the single most important action is
3. **Feature Scope** — what is in the MVP, what is explicitly out of scope
4. **Monetization** — how the app makes money (or if it's internal/free)
5. **Integrations** — third-party services required (payments, auth, email, storage, etc.)
6. **Constraints** — technical, design, timeline, or team constraints that affect architecture

---

## Step 3 — Ask Clarifying Questions

Using the gap analysis from Step 2, ask **2–4 targeted questions** using `AskUserQuestion`. Prioritize the categories with the biggest gaps first.

**Rules for question design:**
- Ask about the most architecturally consequential gaps first (Users & Roles and Feature Scope affect everything downstream)
- Use structured options where the question has predictable answers — always let the user pick "Other" for free text
- Do not ask about things that are already clear from `docs/concept.md` or `$ARGUMENTS`
- Do not ask generic questions. Every question must be derived from a specific gap in the current concept
- Maximum 4 questions per run — if more gaps exist, they will be covered in the next `/discover` run

**Example question areas by category (use only if that category has a gap):**

- *Users & Roles:* "Does [app name] have multiple user types with different permissions, or is it single-role?" → options: Single role (all users equal), Two roles (e.g. admin + member), Multiple roles (3+), Not sure yet
- *Feature Scope:* "For the MVP, which of these should be included?" → options derived from the concept
- *Monetization:* "What is the monetization model?" → Free / Freemium / Subscription (SaaS) / One-time purchase / Internal tool (no monetization)
- *Integrations:* "Which third-party integrations are required at launch?" → multi-select: Stripe or payment gateway / OAuth (Google, GitHub, etc.) / Email (SMTP/transactional) / File storage (S3, etc.) / None yet
- *Constraints:* "Is there a specific deployment target?" → options: Cloud (AWS/GCP/Azure), VPS/self-hosted, Docker only, No preference

---

## Step 4 — Write / Update `docs/concept.md`

After collecting answers, write or update `docs/concept.md` using this exact structure. Preserve all previously confirmed content. Add or replace only the sections touched by this session's answers. Never delete existing content unless the user explicitly contradicted it.

```markdown
# App Concept

> Last updated: {YYYY-MM-DD} — Run {N} of /discover

## Overview
- **App name:** {name or "TBD"}
- **One-line description:** {what it does in one sentence}
- **Problem solved:** {the core pain point this addresses}

## Users & Roles
{list each user type, their key permissions, and distinguishing traits}

## Core Features — Must Have (MVP)
{bullet list of features that must exist for the app to be useful}

## Secondary Features — Should Have
{bullet list of features wanted but not MVP blockers}

## Explicit Out of Scope
{bullet list of things confirmed as NOT in this version}

## Monetization
{how the app makes money, pricing model, or "internal tool / not applicable"}

## Required Integrations
{third-party services confirmed as needed at launch}

## Technical Constraints
{anything that restricts architecture choices: stack preferences, hosting, team size, etc.}

## Design Preferences
{visual style, layout patterns, accessibility needs, device targets}

## Open Questions
{anything still unresolved that a future /discover run or Phase 1 should address}
```

---

## Step 5 — Readiness Assessment

After writing `docs/concept.md`, output a brief readiness summary:

```
=== CONCEPT READINESS ===

Clear:
- [list categories that are well-defined]

Still vague:
- [list categories with remaining gaps — and what specifically is unclear]

Open questions logged:
- [list items written to the Open Questions section]

Ready for Phase 1? [Yes / Not yet]

→ [If not yet]: Run /discover again to resolve: [specific gaps]
→ [If yes]:     Run /phase1-brd when ready
```

A concept is ready for Phase 1 when:
- Users & Roles is defined (even if just one role)
- Core Features MVP scope is defined
- Monetization is confirmed (even if "free" or "internal")
- No critical open questions remain that would force assumptions in the BRD
