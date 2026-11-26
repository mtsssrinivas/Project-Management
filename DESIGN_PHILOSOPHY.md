# ProjectFlow — UI/UX Design Philosophy & Design System

ProjectFlow is designed as a professional, premium enterprise SaaS application.

## Design Inspiration
- **Linear**: Speed, keyboard-first clarity, ultra-crisp borders, high density without clutter, restrained monochrome canvas with purposeful accents.
- **Notion**: Calm typography, whitespace balance, structural hierarchy, content-first readability.
- **Asana**: Clear work-item structuring, legible meta-data tags, robust list/board/timeline views.
- **Raycast**: Precision, dark-mode elegance, micro-interactions, subtle borders, instant feedback.

*Note: These serve as visual and experiential benchmarks, not templates to clone.*

---

## 1. Visual Principles
1. **Minimalism over decoration**: Every element serves an operational purpose.
2. **Functionality over visual gimmicks**: No gratuitous animations, floating orbs, or distracting elements.
3. **Strong typography hierarchy**: Clear distinction between page titles, section headers, item titles, body copy, and metadata.
4. **Consistent spacing & alignment**: Strict 4px/8px grid system for spacing, padding, margins, and component alignments.
5. **Restrained color palette**: Low-saturation surfaces, neutral greys, deep charcoal text, muted indigo primary action accent.
6. **Clear information hierarchy**: Primary metadata (status, assignee, due date, priority) immediately scannable.
7. **Pixel-consistent components**: Standardized heights, radii, paddings, and font sizes across inputs, buttons, and badges.
8. **Professional enterprise SaaS appearance**: Built for daily focus, productivity, and clarity.

---

## 2. Design Tokens & Styling Foundations

### Typography
- **Primary Fonts**: `Inter`, `Geist Sans`, or system fallback stacks.
- **Monospace Font**: `Geist Mono` or `JetBrains Mono` for IDs, shortcuts, timestamps, and code tags.
- **Scale**:
  - Display / Page Titles: `20px` to `24px` (font-semibold, tracking-tight)
  - Section Headers: `14px` to `16px` (font-medium or font-semibold)
  - Body / Primary UI: `13px` to `14px` (font-normal or font-medium)
  - Metadata / Badges / Captions: `11px` to `12px` (font-medium, uppercase tracking-wider where appropriate)
- **Rules**: Avoid oversized headings; keep scale tight and information density balanced.

### Color Palette
- **Surfaces & Backgrounds**:
  - Warm white / clean light canvas: `#FAFAFA` / `#FFFFFF`
  - Subtle secondary surface: `#F4F4F5` / `#F8FAFC`
  - Dark mode surfaces: Deep neutral charcoal `#09090B`, elevated surface `#121215`, popover/card surface `#18181B`
- **Borders & Dividers**:
  - Light mode: `#E4E4E7` / `#E2E8F0` (subtle 1px solid)
  - Dark mode: `#27272A` / `#1F242F`
- **Primary Accent**:
  - Muted Indigo (`#6366F1` / `#4F46E5` / `#818CF8`) for focused states, active indicators, and primary CTAs.
- **Semantic Colors** (Reserved strictly for statuses, priorities, and alerts):
  - **Success / Completed**: Muted Emerald (`#10B981` / `#059669`)
  - **In Progress / Active**: Muted Sky / Blue (`#3B82F6` / `#0284C7`)
  - **Warning / Urgent**: Warm Amber (`#F59E0B` / `#D97706`)
  - **Critical / Blocker / Danger**: Muted Rose / Crimson (`#EF4444` / `#DC2626`)
  - **Backlog / Cancelled**: Neutral Zinc (`#71717A` / `#64748B`)

---

## 3. Component Standards

- **Buttons**:
  - Strict sizing (`h-8` compact, `h-9` standard, `h-10` prominent).
  - Subtle 1px borders, smooth 150ms transitions, clear keyboard focus ring (`ring-2 ring-indigo-500/20`).
- **Borders & Dividers**:
  - Crisp 1px subtle lines. Avoid heavy outlines or thick shadows.
- **Data Tables**:
  - Low-profile headers with muted uppercase labels (`text-xs font-medium text-muted-foreground`).
  - Row hover states (`hover:bg-muted/50`), aligned tabular numbers, and direct inline actions.
- **Dropdowns & Menus**:
  - Elevated clean surfaces with subtle border, shadow-md, keyboard arrow-key navigation, and shortcut indicators.
- **Task Cards & Lists**:
  - Compact layout, high scannability, status pill, assignee avatar/initials, priority icon, and identifier (e.g., `PROJ-102`).
- **Modals & Dialogs**:
  - Centered or slide-over, clear backdrop blur (restrained), explicit escape key / close triggers, primary CTA positioned logically.
- **Empty States**:
  - Helpful, quiet, structured: concise title, one-sentence instruction, and a single prominent call to action.
- **Loading Skeletons**:
  - Geometric pulse skeletons mirroring actual element layouts to avoid layout shifts.

---

## 4. Micro-Interactions & Usability
- **Hover States**: Subtle opacity or background shifts (100–150ms ease).
- **Transitions**: Controlled, snappy (150ms–200ms cubic-bezier). Never sluggish.
- **Focus Rings**: Accessible, high-contrast, outline-offset rings for full keyboard accessibility.
- **Tooltips**: Fast display on hover for truncated text, badge meanings, and shortcuts.
- **Keyboard Shortcuts**: First-class navigation (e.g. `⌘K` / `Ctrl+K` command palette, `C` create, `J`/`K` list traversal).

---

## 5. Strictly Prohibited
- ❌ Generic AI-generated dashboard tropes (purple glow gradients, cosmic blobs).
- ❌ Heavy or unmotivated gradients on cards or backgrounds.
- ❌ Random uncoordinated colors across cards.
- ❌ Excessive pill/bubble radii (e.g., `rounded-3xl` on square dashboards). Maintain crisp `rounded-md` (4px–6px) or `rounded-lg` (8px).
- ❌ Unnecessary glassmorphism with excessive blurs and high transparency.
- ❌ Decorative illustrations or graphics without functional purpose.
- ❌ Repeated card grids for tabular data when lists or tables are superior.
- ❌ Emoji-based navigation or cluttered iconography.

---

## 6. Phase Completion Quality Checklist
Before finishing any UI phase, verify:
- [ ] Spacing consistency across padding and margins (4/8/12/16/24/32px scale).
- [ ] Typography scale and hierarchy (no disproportionate headings).
- [ ] Color consistency (all colors bound to design system tokens).
- [ ] Full responsiveness across mobile, tablet, and desktop viewports.
- [ ] Interactive states for all controls (default, hover, active, focus-visible, disabled).
- [ ] Comparison against Linear/Raycast/Notion quality benchmarks.
- [ ] Elimination of redundant visual decoration or clutter.
