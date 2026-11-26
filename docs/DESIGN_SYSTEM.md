# ProjectFlow — Design System & Component Guidelines

Inspired by **Linear**, **Notion**, **Asana**, and **Raycast**, ProjectFlow emphasizes high information density, calm typography, subdued contrast, and rapid keyboard-first navigation.

---

## 1. Design Tokens & Color Palette

### 1.1 Surfaces & Canvas
| Token Name | Light Mode Value | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| `bg-canvas` | `#FAFAFA` (Warm Off-White) | `#09090B` (Deep Neutral) | Main viewport canvas |
| `bg-surface` | `#FFFFFF` (Pure White) | `#121215` (Elevated Zinc) | Cards, panels, dropdowns |
| `bg-surface-secondary` | `#F4F4F5` (Subtle Neutral) | `#18181B` (Zinc-900) | Inactive tabs, hover states |
| `bg-sidebar` | `#18181B` (Charcoal) | `#121215` (Deep Charcoal) | Persistent navigation sidebar |

### 1.2 Text & Typography
| Token Name | Light Mode Value | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| `text-primary` | `#09090B` (Charcoal) | `#F4F4F5` (Off-white) | Headings, active labels, body |
| `text-secondary` | `#71717A` (Muted Grey) | `#A1A1AA` (Zinc-400) | Secondary metadata, dates |
| `text-muted` | `#A1A1AA` (Subtle Grey) | `#71717A` (Zinc-500) | Placeholder, shortcut hints |

### 1.3 Borders & Dividers
| Token Name | Light Mode Value | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| `border-subtle` | `#E4E4E7` (Zinc-200) | `#27272A` (Zinc-800) | Default card and row divider |
| `border-hover` | `#D4D4D8` (Zinc-300) | `#3F3F46` (Zinc-700) | Hovered inputs, focused cards |

### 1.4 Accents & Statuses (Strictly Semantic)
| Role | Token Name | Light Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | `indigo-primary` | `#4F46E5` / `#6366F1` | Primary CTA, active nav state, focus ring |
| **Success** | `status-success` | `#10B981` | Completed tasks, active accounts |
| **In Progress** | `status-info` | `#3B82F6` | In-progress tasks, current sprint |
| **Warning** | `status-warning` | `#F59E0B` | In-review, due today, pending invite |
| **Urgent / Error** | `status-danger` | `#EF4444` | Urgent priority, blocker, destructive |

---

## 2. Typography Scale

Fonts: `Inter` or `Geist Sans` for UI text; `Geist Mono` or `JetBrains Mono` for task keys and keyboard shortcuts.

| Level | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Title** | 20px (`1.25rem`) | SemiBold (600) | 28px | `-0.02em` | Main page heading (Dashboard, Projects) |
| **Section Title** | 15px (`0.9375rem`)| Medium (500) | 22px | `-0.01em` | Panel header, column title |
| **Body (Default)**| 13px (`0.8125rem`)| Regular (400) | 20px | Normal | Task title, table cells, form labels |
| **Caption / Meta** | 12px (`0.75rem`) | Medium (500) | 16px | Normal | Assignee name, due dates, timestamps |
| **Badge / Kbd** | 11px (`0.6875rem`)| SemiBold (600) | 14px | `+0.02em` | Task IDs (`PROJ-12`), keyboard tags |

---

## 3. Spacing System (8px Baseline)

All spacing values are multiples of 4px and 8px:
- `4px` (`0.25rem` / `p-1`): Gap between compact badge items, icon padding.
- `8px` (`0.5rem` / `p-2`): Standard button horizontal padding, card internal gap.
- `12px` (`0.75rem` / `p-3`): Standard card interior padding, list row vertical height.
- `16px` (`1rem` / `p-4`): Container padding, modal interior padding.
- `24px` (`1.5rem` / `p-6`): Page gutter, section separation.
- `32px` (`2rem` / `p-8`): Major layout boundary separation.

---

## 4. Component Standards

### 4.1 Buttons
- **Heights**: Compact `h-8` (32px), Standard `h-9` (36px).
- **Radius**: `rounded-md` (6px).
- **Variants**:
  - `primary`: Background `#4F46E5`, white text, subtle shadow-sm.
  - `secondary`: Background white/zinc-900, 1px border `#E4E4E7`, text charcoal.
  - `ghost`: Transparent background, hover background neutral-100/zinc-800.
  - `destructive`: Red text/background with safe confirm step.
- **Focus Indicator**: `focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:outline-none`.

### 4.2 Inputs & Forms
- Standard height `h-9`, subtle 1px border, neutral placeholder text, `rounded-md`.
- Active focus smoothly highlights border to `indigo-500` with zero layout shift.

### 4.3 Task Cards (Kanban)
- Flat surface `#FFFFFF`, 1px border `#E4E4E7`, padding `p-3`, `rounded-md`.
- Layout:
  1. Top line: Task Key (e.g. `PF-42`) in mono 11px + Priority icon.
  2. Middle line: Task Title in 13px medium, 2-line max ellipsis.
  3. Bottom line: Due date pill + Assignee avatar (20x20px circle).
- Zero heavy drop shadows. On hover: subtle border darkening (`border-zinc-300`).

### 4.4 Data Tables & Lists
- Low-profile headers (`text-xs uppercase text-zinc-500 font-semibold tracking-wider`).
- Alternating subtle rows or clean 1px divider lines.
- Row hover highlight (`hover:bg-zinc-50/50`).

### 4.5 Modals & Slide-over Drawers
- Dimmed backdrop blur (`backdrop-blur-sm bg-black/30`).
- Modal card centered with `rounded-lg`, 1px border, max width 560px for forms.
- Slide-over drawer anchors to right edge with 480px width for task detail inspect.

---

## 5. Prohibited Anti-Patterns
- ❌ No rainbow/bubble status badges.
- ❌ No floating neon shadows or neon glow rings.
- ❌ No oversized `rounded-2xl` / `rounded-3xl` cards.
- ❌ No emojis as main sidebar icons.
- ❌ No gratuitous bouncy animations; all transitions bounded to 150ms–200ms ease-out.
