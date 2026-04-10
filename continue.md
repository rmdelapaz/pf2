# PF2 Guide — Continuation Notes

## Project
- **Location:** `\\wsl$\Ubuntu\home\practicalace\projects\pf2`
- **Live site:** https://rays-pf2.netlify.app/
- **Shared CSS:** `styles/main.css`
- **Pages:** 21 content pages + `index.html` (table of contents)

## What Was Done (Last Session)

### 1. Inline SVG Dark Mode (4 files, 8 SVGs)
- Added `class="inline-svg"` to all 8 inline SVGs across `pf2_actions.html` (5), `pf2_adv_char_creation.html` (1), `pf2_character_examples.html` (1), `pf2_intro.html` (1)
- Added 18 CSS rules to `styles/main.css` under `[data-theme="dark"] .inline-svg` using attribute selectors to override:
  - Default text fill (black → `#cbd5e1`), white text preserved
  - Neutral structural strokes (`#333` → `#94a3b8`, `#666` → `#475569`, `#ccc` → `#334155`, `#ddd` → `#475569`)
  - Brown text/fills for character example SVG (`#654321`, `#8B4513` → warm lighter variants)
  - Skin tone, armor, body fills adjusted for dark backgrounds

### 2. pf2_names.html Dark Mode
- Added full `[data-theme="dark"]` inline style overrides for the parchment-themed names page
- Dark parchment aesthetic: deep browns/warm golds replacing light browns/cream
- Covers: body gradient, container, headings, name-cards, tips/example/analogy/pathfinder boxes, location tags, region items, canvas border

### 3. Dice Roller Mobile Responsiveness (`pf2_dice_roller.html`)
- Added `@media (max-width: 768px)` breakpoint: smaller title/headings, tighter padding, narrower grid columns, smaller roll button and result display
- Added `@media (max-width: 480px)` breakpoint: further shrunk title, 2-column preset grid, smaller dice grid/buttons/results

### 4. Fixed `isDark` Redeclaration Across All Pages
- All 21 pages (index.html + 20 pf2_*.html) had `const isDark` in both a `<script type="module">` (mermaid init) and a bottom `<script>` (theme toggle). Module scope prevents runtime errors, but linters flag it and non-module scripts sharing global scope DO conflict.
- Renamed bottom theme script's `const isDark` → `const savedDark` across all 21 pages
- **`pf2_adv_char_creation.html`** (special case — 3 declarations): also renamed canvas chart's `const isDark` (arrow fn) → `const checkDark` and its call site `isDark()` → `checkDark()`
- `pf2_dice_roller.html` only had 1 declaration (no mermaid), no fix needed

## Page Order (matching index.html TOC)
1. pf2_intro.html — Introduction
2. pf2_char.html — Character Creation
3. pf2_adv_char_creation.html — Advanced Character Creation
4. pf2_character_examples.html — Character Examples
5. pf2_100.html — 100 Characters
6. pf2_names.html — Character Names
7. pf2_groups.html — Group Dynamics
8. pf2_actions.html — Core Mechanics
9. pf2_dice_roller.html — Dice Roller
10. pf2_skills.html — Skills
11. pf2_magic.html — Magic
12. pf2_items.html — Items
13. pf2_adv_combat.html — Advanced Combat
14. pf2_char_adv.html — Character Advancement
15. pf2_player_collab.html — Player Collaboration
16. pf2_horror.html — Horror
17. pf2_campaign.html — Campaign
18. pf2_gm.html — Game Mastery
19. pf2_worldbuilding.html — Worldbuilding
20. pf2_digital_tools.html — Digital Tools
21. pf2_community.html — Community

## Known Issues / Remaining TODO
- **`pf2_actions.html` canvas chart** — The Action Economy Efficiency Comparison `<canvas>` uses hardcoded `#333` text and `#eee` grid lines. Needs dark-mode-aware JS (like the weapon scaling chart in adv_char_creation).
- **`pf2_names.html` canvas** — If there's a canvas chart, it may also need dark mode JS treatment.
- **Cross-browser testing** — Not yet tested outside of Chromium-based browsers.
- If new pages are added, update the prev/next nav links in the adjacent pages and `index.html`.
