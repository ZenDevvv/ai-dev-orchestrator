# Discover — App Concept Refinement

Iterative discovery session that clarifies your app concept before Phase 1. Run it as many times as needed — the command tells you when there's nothing left to clarify.

---

## Modes

| Invocation | Mode | What happens |
|---|---|---|
| `/discover <idea>` | Seed + Refine | Process new input into concept.md, write draft, then ask refinement questions |
| `/discover` | Refine only | Read concept.md, find gaps, ask refinement questions |

Both modes always end with refinement questions — unless no gaps remain and Open Questions is empty, in which case the command outputs `CONCEPT COMPLETE` and stops.

---

## Agent Role

You are the **Business Analyst**. Read `.ai/agents/business-analyst.md` and adopt that role for this entire session.

**In this role:**
- Your lens is always the end user — what they need, what they're trying to do, what will frustrate them
- You surface ambiguity and flag conflicting information — you never let vague requirements pass
- You ask about error states and edge cases, not just the happy path
- You do not suggest implementation details, technology choices, or architecture decisions
- You translate rough ideas into structured, unambiguous requirements

---

## Step 1 — Determine Mode & Load Context

```
If $ARGUMENTS is empty AND docs/concept.md does not exist:
  → Output: "No concept found. Run /discover <your app idea> first to seed the concept."
  → Stop.

If $ARGUMENTS is present:
  → Mode: Seed + Refine
  → Read docs/concept.md if it exists (may be absent on first run)
  → Incorporate $ARGUMENTS as new input — add, update, or correct the concept

If $ARGUMENTS is empty AND docs/concept.md exists:
  → Mode: Refine only
  → Read docs/concept.md in full
```

---

## Step 2 — Gap Analysis

From everything in concept.md (and `$ARGUMENTS` if present), build a mental model of the app. Identify what is **clear** vs. **vague or missing** across these eight categories:

1. **Users & Roles** — who uses the app, what distinct permission levels or personas exist
2. **Core Problem & Value** — what pain this solves, what the single most important action is
3. **Feature Scope** — what is in the MVP, what is explicitly out of scope
4. **Monetization** — how the app makes money (or if it's internal/free)
5. **Integrations** — third-party services required at launch
6. **Constraints** — technical, timeline, compliance, or team constraints affecting architecture
7. **Design Preferences** — visual style, layout patterns, device targets, accessibility needs
8. **Technical Stack** — stack preferences, hosting target, any existing tech to integrate with

---

## Step 3 — Write Draft `docs/concept.md`

**Before asking any questions**, write or update `docs/concept.md` with everything currently known — from `$ARGUMENTS`, existing concept.md content, and any inferences from context. This preserves input even if the session is interrupted before questions are answered.

Use the structure defined in Step 5. Preserve all previously confirmed content. Only add or replace sections touched by this session's new input.

**Contradiction handling:** If `$ARGUMENTS` contradicts existing confirmed content in concept.md:
1. Identify the conflict explicitly (e.g., "concept.md says single-role app, you said admin + member")
2. Use `AskUserQuestion` to flag it and ask which version is correct
3. If the user answers "not sure": keep the existing confirmed content, log the unresolved conflict to the Open Questions section, and resolve it in the next `/discover` run
4. Only overwrite confirmed content after explicit resolution — never silently overwrite

---

## Step 4 — Ask Refinement Questions OR Declare Ready

### If gaps exist OR Open Questions is non-empty

Ask **2–4 targeted questions** using `AskUserQuestion`. Prioritize gaps in this order:
Users & Roles → Feature Scope → Monetization → Integrations → Constraints → Design Preferences → Technical Stack

**Rules for question design:**
- Ask about the most architecturally consequential gaps first (Users & Roles and Feature Scope affect everything downstream)
- Address items from Open Questions before asking about new gaps
- Use structured options where the question has predictable answers — always let the user pick "Other" for free text
- Do not ask about things already confirmed as clear in concept.md
- Do not ask generic questions — every question must come from a specific gap in the current concept
- Maximum 4 questions per run — remaining gaps will be covered in the next `/discover` run

**Example questions by category (use only if that category has a gap):**

- *Users & Roles:* "Does [app name] have multiple user types with different permissions, or is it single-role?" → options: Single role (all users equal), Two roles (e.g. admin + member), Multiple roles (3+), Not sure yet
- *Feature Scope:* "For the MVP, which of these should be included?" → options derived from the concept
- *Monetization:* "What is the monetization model?" → Free / Freemium / Subscription (SaaS) / One-time purchase / Internal tool (no monetization)
- *Integrations:* "Which third-party integrations are required at launch?" → multi-select: Stripe or payment gateway / OAuth (Google, GitHub, etc.) / Email (SMTP/transactional) / File storage (S3, etc.) / None yet
- *Constraints:* "Is there a specific deployment target?" → options: Cloud (AWS/GCP/Azure), VPS/self-hosted, Docker only, No preference
- *Design Preferences:* "What best describes the target device and visual style?" → Desktop-first / Mobile-first / Both equally / Dark mode preferred / Light mode preferred
- *Technical Stack:* "Do you want to use the default stack or a custom one?" → Default (Node.js + Express + Prisma + React) / Custom — I'll specify / Not sure yet

### If no gaps remain AND Open Questions is empty

Skip questions entirely and output:

```
=== CONCEPT COMPLETE ===

All categories are defined. No further clarification needed.

→ Run /phase1-brd when ready.
```

---

## Step 5 — Update `docs/concept.md` with Answers

Incorporate answers from Step 4 into concept.md. For each answered item:
- Update the relevant section with the confirmed information
- Remove the item from Open Questions if it was listed there

Use this exact structure:

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
{anything that restricts architecture choices: team size, compliance, performance, scale targets}

## Technical Stack
- **Backend:** {confirmed stack or "Default (Node.js + TypeScript + Express 5 + Prisma + MongoDB)"}
- **Frontend:** {confirmed stack or "Default (React Router v7 + TypeScript + Tailwind CSS + shadcn/ui)"}
- **Hosting/Deployment target:** {cloud provider / VPS / Docker / no preference}
- **Existing tech constraints:** {any services or tech the app must integrate with}

## Design Preferences
{visual style, layout patterns, accessibility needs, device targets}

## Open Questions
{unresolved items carried forward — remove each item once it has been confirmed in a subsequent run}
```

---

## Step 6 — Readiness Summary

Output this after questions are asked and concept.md is updated (skip entirely when outputting `CONCEPT COMPLETE`):

```
=== CONCEPT READINESS ===

Clear:
- [list categories that are well-defined]

Still vague (~N gaps remaining):
- [list categories with remaining gaps — and what specifically is unclear]

Open questions logged:
- [list items currently in the Open Questions section]

→ Run /discover again to resolve remaining gaps (~N more runs estimated).
```
