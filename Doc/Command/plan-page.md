# plan-page.md

## Instruction Set for Generating Page Plans

This file defines the permanent logic Cursor or Claude should follow when generating a `*-PLAN.md` file from a user prompt.

---

## Purpose

From any prompt provided by the user (e.g., “Create a page about review velocity across locations”), generate a page planning document that defines:

- What the page is about (narrative + strategic intent)
- The Hero Section (Badge, Title, Subtitle, Metrics)
- Key Content Items (insights, visuals, action items)
- Data and visual needs (table, graph, screenshot, infographic)
- Design notes to maintain consistency with brand tone and layout

---

## Always Reference the Following Documents:

You MUST integrate design, structural, and content guidance from the following Markdown files:

1. `context-goals.md`  
   Located at:  
   `E:\OneDrive\LHD\HLS Template\Hurwitz HLS\Report\Doc\Command\context-goals.md`  
   Use this to understand the overall goal of the project, the audience (executives), and how each page should contribute to a larger narrative arc.

2. `design-theme.md`  
   Located at:  
   `E:\OneDrive\LHD\HLS Template\Hurwitz HLS\Report\Doc\Command\design-theme.md`  
   Use this to ensure the visual and written tone is minimalist, Apple-inspired, and consistent across all pages (white space, typography, layout).

3. `additional-guidelines.md`  
   Located at:  
   `E:\OneDrive\LHD\HLS Template\Hurwitz HLS\Report\Doc\Command\additional-guidelines.md`  
   Use this to comply with additional content rules, tone of voice, and client preferences.

4. `page-element.md`  
   Located at:  
   `E:\OneDrive\LHD\HLS Template\Hurwitz HLS\Report\Doc\Command\page-element.md`  
   Use this to follow the correct structure for each page: Header, Hero, Items, Sidebar, Footer. All `*-PLAN.md` outputs must follow this architecture.

---

## Output Format (for each plan)

Your response should output a complete Markdown file named like:  
`[page-topic]-PLAN.md` (e.g., `reviews-velocity-PLAN.md`, `conversion-growth-PLAN.md`)

The output must include the following sections:

---

### 1. Page Purpose
- Short description of the page’s narrative and strategic focus.
- What issue/strategy/opportunity this page addresses.
- Why this matters for the client.

---

### 2. Hero Section
- **Hero Badge** – broader strategy or initiative this page falls under  
- **Hero Title** – punchy one-line summary of the insight  
- **Hero Subtitle** – 1–2 sentence explanation of why this matters  
- **Hero Metric(s)** (1–3):  
  - Label  
  - Value  
  - Note (explain significance)

---

### 3. Content Items  
Each item must include:

- **Item Title** – issue, opportunity, or advantage  
- **Description** – insight or supporting detail  
- **Visual/Data Element** – choose at least one:
  - Table  
  - Line Graph  
  - Screenshot  
  - Infographic  
  - Statistic  
  - Embedded reference or citation  
- **Action Item** – clear, concise recommendation in a callout block

Repeat this structure for 1–3 content items per page.

---

### 4. Visual Summary
- List any visuals needed on the page (table, line graph, screenshot, infographic)
- Describe briefly what data or concept they should communicate

---

### 5. Footer Note
- List any known issues/concerns this page should log
- Include a summary of action items that reinforce the content above

---

## Final Note

DO NOT include placeholder syntax like `[Insert Subtitle]`. All fields must be populated with relevant text based on the prompt AND the referenced `.md` documents.

Once generated, this `*-PLAN.md` is subject to user review. After approval, the user will request a full execution of the page content.

---

