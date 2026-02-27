Read the current contents of `docs/decision-log.md` before proceeding (to append correctly without overwriting).

## Input

The user has described a decision to log: $ARGUMENTS

Parse the input using `|` as a delimiter between fields:
- Field 1 — **Phase**: which phase this decision was made in (e.g., "Phase 3", "Phase 4b AUTH")
- Field 2 — **What the AI generated**: brief description of the AI's original output
- Field 3 — **What I changed**: what you manually corrected or overrode
- Field 4 — **Reason**: why you made this change
- Field 5 (optional) — **Pattern to watch for**: if this is a recurring issue worth encoding into a skill doc

If fewer than 4 fields are provided, ask the user for the missing fields before proceeding.

## Append to docs/decision-log.md

If `docs/decision-log.md` does not exist, create it with this header first:

```markdown
# Decision Log

A running log of manual corrections and overrides made during AI-assisted development.
When the same correction appears more than twice, encode it into the relevant skill document.

---
```

Then append a new entry using today's date:

```markdown
## {Phase} — {YYYY-MM-DD}

### What the AI generated:
{Field 2}

### What I changed:
{Field 3}

### Reason:
{Field 4}

### Pattern to watch for:
{Field 5 — or "N/A" if not provided}

---
```

## Output

After appending, confirm to the user:

```
✅ Decision logged to docs/decision-log.md

Phase: {Phase}
Change: {Field 3}
Reason: {Field 4}
```

If this is the second time a similar correction appears in the log, add a note:
> **💡 Tip:** This type of correction has appeared before. Consider encoding it into the relevant skill document (e.g., `skills/MODULE_TEMPLATE.md` or `skills/ARCHITECTURE_STANDARD.md`) to prevent it from recurring.
