# Client Action Items Interaction Upgrade – PLAN

## 1. Page Purpose
- Elevate the executive action-items experience by enabling drag-and-drop sequencing and inline priority adjustments directly on `pages/page15.html`.
- Reinforce the narrative that client deliverables remain tightly orchestrated, with the most urgent items surfaced instantly during live reviews.
- Provide presenters with an interactive yet minimalist tool that aligns with the broader Hurwitz Law Group executive storytelling goals described in `Doc/Command/context-goals.md`.

## 2. Hero Section
- **Hero Badge:** Client Engagement Workflow
- **Hero Title:** Drag-and-drop priorities keep the client execution queue sharp.
- **Hero Subtitle:** Real-time reordering and priority controls ensure the team spotlights urgent follow-ups without breaking the clean Apple-inspired presentation defined in `Doc/Command/design-theme.md`.
- **Hero Metrics:**
  - **Metric:** 3 priority tiers live-edited  
    **Note:** Urgent, high, and medium status chips can be toggled mid-call, eliminating offline edits.
  - **Metric:** 0 refreshes required  
    **Note:** DOM updates re-render instantly, keeping presenters focused on the narrative.

## 3. Content Items

### Item 1 – Sequencing Without Friction
- **Description:** Deliver a seamless drag-and-drop experience that lets executives reorganize action items in seconds while preserving the ordered narrative stressed in `Doc/Command/additional-guidelines.md`.
- **Visual/Data Element:** Statistic – “100% items reorderable” badge beside the list to emphasize full coverage.
- **Action Item:** Implement HTML5 drag events with accessibility attributes so every `.action-item` can move within `#actionItemsList` and persists via `saveActionItems()`.

### Item 2 – Priority Controls in Context
- **Description:** Introduce a tap-friendly priority menu that cycles urgent/high/medium with color-coded states matching the minimalist palette documented in `Doc/Command/design-theme.md`.
- **Visual/Data Element:** Inline color legend showing 🔴 urgent, 🟠 high, 🟡 medium swatches rendered by CSS variables.
- **Action Item:** Replace the static badge with a focusable control that opens a choice list, updates `data-priority`, and recalculates metrics.

### Item 3 – Executive Assurance & Persistence
- **Description:** Ensure localStorage logic keeps reordered and re-prioritized items intact so the presenter can rehearse the story flow described in `Doc/Command/page-element.md`.
- **Visual/Data Element:** Table summarizing “Action Item,” “Priority,” “Last Updated” (timestamp) displayed beneath the list when exporting.
- **Action Item:** Extend `saveActionItems()` to store the updated collection immediately after drag or priority edits, aligning with the persistent footer experience.

## 4. Visual Summary
- Drag-handle iconography beside each action item title to communicate movement affordance.
- Priority legend or tooltip reinforcing the urgent/high/medium color associations.
- Optional mini-table or export-ready summary confirming persisted order for follow-up documentation.

## 5. Footer Note
- Track any friction users report with drag targets in the Issues/Concerns textarea.
- Recap final urgent/high/medium distribution in the Action Items textarea after rehearsal, ensuring stakeholders capture next steps in the persistent footer notes.

