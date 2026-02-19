Adopt the agent defined in `agents/ui-designer.md`. Read it now before proceeding.

Read these context files before proceeding:
- BRD: `docs/brd.md` — use the **Page Manifest** (from User Stories) as the definitive page list
- Architecture: `docs/architecture.md` — route map for data shape awareness

## Design Reference Images

Before proceeding, check `docs/design-references/` for any image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`). Read every image found there.

If images are found, analyze them and extract:
- Color palette (primary, secondary, accent, background, surface, text colors)
- Typography (font families, sizes, weights, line heights)
- Spacing system (padding, margins, gaps)
- Border radius, shadows, and elevation patterns
- Component styles (buttons, inputs, cards, tables, navigation)
- Layout patterns (sidebar, top nav, grid system)

Apply these extracted styles consistently across all page designs. If images conflict with each other, prefer the most common pattern.

**IMPORTANT:** Only extract **visual style** from reference images (colors, typography, spacing, layout patterns, component styling). Do NOT extract or imitate features, functionality, or content from the images. The BRD is the sole source of truth for what the app does — images are only a style reference.

If no images are found in `docs/design-references/`, fall back to sensible defaults.

## Input: $ARGUMENTS

`$ARGUMENTS` contains **design rules only** — custom directives like `"mobile first"`, `"dark mode default"`, `"minimal sidebar"`, etc.

If design rules are provided, treat them as hard constraints that override both extracted image styles and defaults.

---

## Output: `docs/ui-design.md`

Save everything below into a single file. Downstream phases (pages, E2E, review) all reference this one file.

### 1. Style Guide
The code-ready style system. Every rule must include **exact values** — no vague descriptions. The project uses Tailwind CSS and shadcn/ui.

Extracted from `docs/design-references/` images (if present) or derived from design rules and sensible defaults:

- **Color palette** — exact hex values for primary, secondary, accent, background, surface, text colors, mapped to Tailwind classes
- **Typography scale** — font families, exact sizes, weights, line heights — with Tailwind classes
- **Spacing system** — base unit, exact scale values — with Tailwind classes
- **Component styling** — buttons, inputs, cards, modals, tables — with exact Tailwind classes and shadcn variants
- **Border radius and shadows** — with exact Tailwind classes
- **Animation/transition standards** — exact durations and easing
- **Dark mode rules** — if applicable
- **Accessibility** — contrast ratios, focus states, ARIA patterns

Every rule must be specific enough to produce identical results across independently prompted pages. "Use a muted color" is too vague — "use `text-slate-500`" is correct.

### 2. Page Inventory
Pull directly from the BRD's **Page Manifest** table. Do not invent pages — every page must trace back to a user story.

### 3. Wireframe Descriptions
For each page in the manifest:
- Layout structure (header, sidebar, content area, footer)
- Component placement and hierarchy
- Content zones and data display patterns
- Interactive elements (buttons, forms, dropdowns)

### 4. User Flow Diagrams
Mermaid syntax showing how users navigate between pages. One diagram per major flow (auth, main workflow, admin, etc.).

### 5. Component Inventory
Reusable UI components identified across pages:
- Component name, description, variants
- Which pages use each component

### 6. Responsive Behavior
- Breakpoint strategy (mobile, tablet, desktop)
- How each page layout adapts per breakpoint
- Navigation changes (hamburger menu, collapsible sidebar, etc.)

### 7. State Designs
For each page: loading, empty, error, and populated states.

---

📋 REVIEW GATE:
1. Does every page in the Page Manifest have a wireframe?
2. Do extracted styles match the images in `docs/design-references/` (if any were provided)?
3. Is every style guide rule specific enough to produce identical results across independently prompted pages?
4. Are the user flows complete? Are error/empty states accounted for?

## Mark Downstream Phases as Stale

If this phase is being **re-run** (i.e., a row for phase 7 already exists in `docs/progress.md`), scan for any `✅ Complete` rows in `docs/progress.md` for these downstream phases:

- Phase 9 — all pages
- Phase 10 — all pages
- Phase 11

For each found row, update the Status cell from `✅ Complete` to `⚠️ Stale` and append to its Notes cell: `| Stale: phase 7 re-run YYYY-MM-DD`

This signals that pages and tests built against the previous style guide or wireframes may no longer match the updated design.

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Notes |
   |-------|------|-------|--------|------|-------|
   ```
2. Append this row (fill in today's date and a one-line summary):
   `| 7 | UI Design | — | ✅ Complete | YYYY-MM-DD | {summary} |`
