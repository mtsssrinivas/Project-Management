# ProjectFlow — Reference Analysis

## Reference Overview
- **Reference Video**: [Build and Deploy Full Stack Project Management App using React js](https://www.youtube.com/watch?v=50NN3d-Ne1U) by GreatStack
- **Reference Repository**: `GreatStackDev/project-management`
- **Reference Nature**: A multi-workspace project management tutorial application implementing organizations, projects, issue tracking, and email alerts.
- **ProjectFlow Objective**: Elevate the reference prototype into a commercial-grade, handcrafted SaaS product inspired by **Linear, Notion, Asana, and Raycast**, with production-grade engineering (custom JWT auth, PostgreSQL + Prisma, Zod validation, dnd-kit Kanban, granular RBAC).

---

## 1. Identified Pages & Application Structure (Reference Baseline)

From the GreatStack reference application and its repository architecture, the following primary views and workflows are identified:

1. **Authentication & Onboarding**:
   - Organization/User onboarding & sign-in (handled via Clerk modal/redirect in reference; ProjectFlow replaces this with handcrafted `/login` and `/register` routes).
2. **Main Application Shell**:
   - Persistent collapsible sidebar with Workspace/Organization switcher.
   - Top navigation bar featuring search, active workspace indicator, notification bell, and user avatar dropdown.
3. **Dashboard / Overview**:
   - Quick-metric summary cards (total projects, tasks in progress, tasks completed, team member count).
   - Recent projects list with progress bars.
   - Task activity feed / recent updates.
4. **Workspace / Organization Switcher & Management**:
   - Organization selector dropdown at top of sidebar.
   - Workspace settings / team member list and invitation modal.
5. **Projects Listing**:
   - Grid/list of projects within the active workspace.
   - Project metadata: title, description snippet, status badge, team avatar stack, due date, completion percentage.
   - "New Project" modal / action button.
6. **Project Detail & Views**:
   - Project header with project title, status indicator, action buttons (edit, archive, add task).
   - Sub-views / tabs:
     - **Board View (Kanban)**: Columns for task states (To Do, In Progress, In Review, Done).
     - **List / Table View**: Structured rows with task ID, title, assignee, priority, status, and deadline.
7. **Task Management & Detail Modal**:
   - Modal/drawer when clicking a task card or row.
   - Fields: Title, description (rich/markdown), status picker, priority selector, assignee dropdown, deadline picker.
   - Activity log and comment stream.
8. **Team & Member Directory**:
   - List of team members in workspace, role indicators (Admin/Member), and pending invitations.

---

## 2. Navigation & Layout Structure

### Sidebar Navigation
- **Workspace Selector**: Top of sidebar, shows current workspace name, avatar/initials, and drop-down menu to switch or create workspaces.
- **Primary Links**:
  - `Dashboard` (Home icon)
  - `Projects` (Folder / Briefcase icon)
  - `My Tasks` (CheckCircle icon)
  - `Calendar` (Calendar icon)
  - `Team` (Users icon)
  - `Settings` (Settings / Sliders icon)
- **Footer Section**:
  - User profile preview, quick settings shortcut, logout trigger.

### Header / Top Bar
- **Breadcrumbs**: Hierarchical pathway (e.g., `Acme Corp / Mobile App / Board`).
- **Global Search**: Command/search input (`⌘K` style in ProjectFlow).
- **Actions Area**: Quick "New Task" or "New Project" button, notifications popover, theme/help toggle.

---

## 3. UI/UX Analysis & Comparison: Reference vs. ProjectFlow Target

| Dimension | Reference Application (GreatStack) | ProjectFlow Target (Linear/Raycast/Notion inspired) |
| :--- | :--- | :--- |
| **Visual Tone** | Standard blue-accented tutorial dashboard, bright cards | Minimal, restrained, dark charcoal sidebar, warm off-white canvas, muted indigo accent |
| **Typography** | Default system sans / standard weights | Crisp `Inter` / `Geist Sans`, strict typographic hierarchy, no oversized headings |
| **Card Usage** | High card density with prominent borders and drop-shadows | Flat subtle borders (`border-border`), minimal shadows (`shadow-sm`), dense high-scannability tabular lists |
| **Kanban Board** | Basic column drag-and-drop | High-precision `dnd-kit` implementation with optimistic updates, drop placeholders, keyboard navigation |
| **Modals & Forms** | Basic form fields with standard inputs | Pixel-consistent inputs (`h-9`), inline validation, shortcut support, focus-visible rings |
| **Empty States** | Minimal or empty screens | Handcrafted empty states with clear iconography, concise explanation, and single action button |
| **State Handling** | Relies on third-party SDK state (Clerk) | Strict backend-driven state with JWT HTTP-only cookies, Prisma transactions, and Zod validation |

---

## 4. Interactions & Micro-Interactions

- **Hover States**:
  - Reference: Standard CSS `:hover` with default browser transitions.
  - ProjectFlow: 150ms subtle background shifts (`hover:bg-neutral-100` / `hover:bg-neutral-800`), explicit cursor pointers, and tooltip previews.
- **Kanban Drag-and-Drop**:
  - Immediate visual elevation (`scale-[1.02] shadow-md`), faint dashed drop target slot, and smooth column transitions.
- **Keyboard Usability**:
  - Focus indicators across all interactive elements (`focus-visible:ring-2 focus-visible:ring-indigo-500/20`).
  - Modal close on `Escape`, form submit on `⌘+Enter`.

---

## 5. Responsive Behavior

- **Desktop (>= 1024px)**: Dual-pane layout with persistent 240px sidebar, full Kanban columns (4 columns side-by-side with horizontal scroll on narrower monitors).
- **Tablet (768px - 1023px)**: Collapsible sidebar into compact icon rail or slide-over drawer; Kanban horizontally scrollable.
- **Mobile (< 768px)**: Hidden sidebar toggled via hamburger sheet; top bar streamlined; Kanban columns switchable via tab buttons or horizontal snap-carousel; full-screen modals.

---

## 6. Inspection Verification & Boundaries

- **Publicly Inspected Assets**: Video overview, chapter marks, repository files from `GreatStackDev/project-management`, and tutorial documentation.
- **User Verification**: If the user desires specific custom screens or UI elements beyond those documented above, screenshots or timestamps may be submitted at any time during development.
