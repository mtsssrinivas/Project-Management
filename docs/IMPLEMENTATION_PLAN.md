# ProjectFlow — Phased Implementation Plan

This implementation plan outlines the engineering and design execution roadmap across all phases, adhering to the project's quality standards and strict phase gating.

---

## Phase Overview & Roadmap

| Phase | Title | Focus & Core Deliverables | Gate Condition |
| :--- | :--- | :--- | :--- |
| **Phase 0** | **Discovery, Architecture & Documentation** | PRD, reference audit, database schema, API spec, design system tokens, implementation roadmap. | Architecture & specs approved. No code written prior. |
| **Phase 1** | **Design System & Frontend Foundation** | React + Vite + Tailwind setup, component library, AppShell (charcoal sidebar, warm white canvas, topnav), routes, mock preview data. | Full visual inspection, keyboard navigation, responsive checks, design sign-off. |
| **Phase 2** | **Authentication & User Management** | Express backend, PostgreSQL + Prisma User/Session schema, bcrypt, HTTP-only JWT cookies, Zod validation, register/login/me flows. | Auth integration tests pass, unauthorized route protection verified. |
| **Phase 3** | **Database & Workspace Management** | Workspace & WorkspaceMember models, invitation tokens, multi-tenant RBAC middleware, workspace switcher, invite modal. | Tenant isolation verified; users cannot access foreign workspace data. |
| **Phase 4** | **Project Management** | Project & ProjectMember models, project CRUD APIs, project listing table/grid, project details shell, progress calculations. | Project CRUD tests passing, workspace scoping verified. |
| **Phase 5** | **Task Management & Detail Panel** | Task model, full task CRUD APIs, task filters/sorting, slide-over task detail drawer, comments & activity history. | Task CRUD verified, assignee scoping validated. |
| **Phase 6** | **Kanban Board with `dnd-kit`** | 4-column interactive board (To Do, In Progress, In Review, Done), optimistic updates, `PATCH /api/tasks/:id/move`, fractional positioning persistence. | Drag-and-drop between columns & reordering within column with database persistence verified. |

---

## Detailed Phase Breakdown

### Phase 0: Discovery, Architecture & Product Analysis (Current Phase)
- **Status**: Completed documentation stage; awaiting user review.
- **Deliverables**:
  - `docs/REFERENCE_ANALYSIS.md`
  - `docs/PRD.md`
  - `docs/DATABASE_SCHEMA.md`
  - `docs/API_SPECIFICATION.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DESIGN_SYSTEM.md`
  - `docs/IMPLEMENTATION_PLAN.md`
- **Output**: Comprehensive architectural review, risk log, and approval request.

---

### Phase 1: Design System & Frontend Foundation
- **Goal**: Build the complete visual and interactive shell of ProjectFlow in React + Vite + Tailwind CSS.
- **Key Modules**:
  1. Base setup: Vite + React (JavaScript), Tailwind CSS configured with custom color tokens, Geist/Inter font families, Lucide React icons.
  2. UI Component primitives in `src/components/ui/`:
     - `Button`, `Input`, `Textarea`, `Select`, `Dropdown`, `Modal`, `Tooltip`, `Badge`, `Tabs`, `Table`, `Skeleton`, `EmptyState`, `Toast`.
  3. Layout components in `src/components/layout/`:
     - `AppShell`, `Sidebar` (charcoal, collapsible, keyboard-friendly), `TopNav`, `WorkspaceSwitcher`, `Breadcrumbs`, `UserMenu`.
  4. Core routes created with React Router v6:
     - `/login`, `/register`, `/dashboard`, `/workspaces`, `/projects`, `/projects/:projectId`, `/projects/:projectId/board`, `/calendar`, `/my-tasks`, `/team`, `/settings`, `/profile`.
  5. Realistic mock state for visual preview and responsive validation.

---

### Phase 2: Authentication & User Management
- **Goal**: Full backend auth foundation and frontend authentication integration.
- **Key Modules**:
  1. Node.js + Express setup in `server/`, environment validation with Zod.
  2. PostgreSQL connection with Prisma ORM; `User` and `Session` models and migrations.
  3. Bcrypt password hashing + JWT issuance stored in secure HTTP-only cookies.
  4. Rate-limiting middleware on auth endpoints.
  5. Frontend `AuthContext` connected to real `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`.
  6. Protected route guards (`ProtectedRoute.jsx`).

---

### Phase 3: Database & Workspace Management
- **Goal**: Multi-tenant workspace engine and membership management.
- **Key Modules**:
  1. Prisma models: `Workspace`, `WorkspaceMember`, `Invitation`.
  2. Backend REST APIs for workspace CRUD, invitation tokens, and member management.
  3. Strict RBAC middleware: `requireWorkspaceMember`, `requireWorkspaceRole`.
  4. Frontend Workspace Switcher, Workspace Settings view, Member management table, and Invite Modal.

---

### Phase 4: Project Management
- **Goal**: Project lifecycle, progress tracking, and scoping.
- **Key Modules**:
  1. Prisma models: `Project`, `ProjectMember`.
  2. Project CRUD APIs with workspace isolation.
  3. Frontend Projects listing with tabular and grid views, search, status pills, deadline indicators, and progress bars.
  4. Project details overview header, member roster, and tab navigation.

---

### Phase 5: Task Management & Details Drawer
- **Goal**: Task engine, field editing, filtering, and audit history.
- **Key Modules**:
  1. Prisma models: `Task`, `TaskComment`, `ActivityLog`.
  2. Task CRUD APIs with priority, status, assignee, and due-date filters.
  3. Slide-over Task Details drawer with markdown editing, comment stream, and activity timeline.
  4. Task creation modal and inline task creation.

---

### Phase 6: Interactive Kanban Board
- **Goal**: High-performance drag-and-drop board powered by `@dnd-kit`.
- **Key Modules**:
  1. Board layout with 4 status columns (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`).
  2. `@dnd-kit/core` and `@dnd-kit/sortable` integration for card drag, column transitions, and slot reordering.
  3. Optimistic client updates with immediate visual feedback and rollback on failure.
  4. Backend `PATCH /api/tasks/:id/move` endpoint with fractional positioning calculation.
  5. End-to-end integration testing for task board state persistence.
