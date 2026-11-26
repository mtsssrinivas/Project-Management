# ProjectFlow — Product Requirements Document (PRD)

## 1. Executive Summary
ProjectFlow is a collaborative, high-performance project and task management platform engineered for modern product teams, engineering squads, and cross-functional organizations. Built with a design ethos inspired by Linear, Notion, Asana, and Raycast, ProjectFlow eliminates bloated enterprise workflows in favor of speed, keyboard efficiency, minimalist aesthetics, and data integrity.

---

## 2. Target Users & Personas

1. **Engineering Leads & Project Managers (Admins/Owners)**:
   - Need clear project visibility, milestone tracking, team workload balance, and auditability.
   - Pain points: Heavy, sluggish tools (Jira), noisy dashboards, complex configuration overhead.
2. **Software Engineers & Designers (Members)**:
   - Need rapid task switching, distraction-free board views, instant task creation, and keyboard-first actions.
   - Pain points: Tedious form submissions, cluttered UIs, confusing navigation.
3. **Cross-functional Collaborators & Stakeholders (Members/Guests)**:
   - Need transparent status updates, due-date scannability, and contextual comments without getting lost in technical minutiae.

---

## 3. Core Problems Solved

1. **UI Bloat & Sluggishness**: Most project management platforms are bogged down by excessive decorative widgets. ProjectFlow maintains an ultra-clean, pixel-consistent UI with near-instant client-side interactions.
2. **Fragmented Workspaces**: Teams struggle to manage multi-tenant environments cleanly. ProjectFlow enforces strict workspace isolation while allowing users to belong to multiple organizations seamlessly.
3. **Cluttered Task Boards**: ProjectFlow introduces an uncluttered, high-precision Kanban board with optimistic UI updates and strict server-side position persistence.
4. **Weak Security & Data Integrity**: Unlike tutorial toys that expose raw IDs or perform security checks only on the client, ProjectFlow enforces strict backend authentication, Zod schema validation, and role-based access control (RBAC) at every endpoint.

---

## 4. User Roles & Permissions

| Role | Workspace Permissions | Project & Task Permissions |
| :--- | :--- | :--- |
| **OWNER** | Full control: delete workspace, transfer ownership, manage billing/settings, invite/remove any user, change roles. | Full CRUD on all projects, tasks, comments, and members. |
| **ADMIN** | Manage workspace settings, invite members, remove regular members, view all projects. | Create/edit/archive projects, assign tasks, manage project members. |
| **MEMBER** | View workspace members, view projects they are assigned to, create new projects (if permitted). | Create/edit/move tasks, post comments, update assigned task statuses. |

---

## 5. User Journeys

### Journey A: User Onboarding & Workspace Setup
1. User lands on `/register`, inputs full name, email, and password.
2. Form submits to `POST /api/auth/register`, sets secure HTTP-only JWT cookie, and navigates to onboarding/workspace creation.
3. User creates their first workspace ("Acme Studio").
4. System provisions workspace, assigns user as `OWNER`, and redirects to `/dashboard`.

### Journey B: Project & Task Lifecycle
1. User navigates to `/projects`, clicks `New Project` (or presses shortcut `C`).
2. Fills in project title, description, target deadline, and clicks `Create`.
3. Navigates into project detail `/projects/:projectId/board`.
4. Adds new tasks to "To Do" column.
5. Drags task card from "To Do" to "In Progress".
6. The board updates optimistically while `PATCH /api/tasks/:id/move` persists new position and status in PostgreSQL.
7. User clicks task card to open detailed drawer, leaves a comment, updates priority to `URGENT`, and assigns a teammate.

### Journey C: Team Collaboration & Invitation
1. Workspace Admin navigates to `/team`, clicks `Invite Member`.
2. Inputs colleague's email address and assigns role (`MEMBER`).
3. System generates cryptographically secure invitation token (`Invitation` record).
4. Invitee accepts via `/invitations/:token/accept`, binds to workspace, and immediately sees shared projects.

---

## 6. Functional Requirements

### 6.1 Authentication & Profile
- **FR-AUTH-1**: User registration with email format validation and password complexity check (minimum 8 characters).
- **FR-AUTH-2**: Password hashing via `bcrypt` with salt rounds = 10.
- **FR-AUTH-3**: Secure session issuance using JSON Web Tokens (JWT) stored in HTTP-only cookies (or secure Authorization header).
- **FR-AUTH-4**: User profile retrieval (`GET /api/auth/me`) and profile update endpoint (`PATCH /api/users/profile`).
- **FR-AUTH-5**: Clean logout clearing session cookies.

### 6.2 Workspace Management
- **FR-WS-1**: Create, read, update, and delete workspaces.
- **FR-WS-2**: Workspace switcher allowing quick toggle between active workspaces.
- **FR-WS-3**: Multi-tenant data isolation: all projects, tasks, and members are hard-scoped to `workspaceId`.
- **FR-WS-4**: Member invitation by email with secure token verification and expiration (7 days).
- **FR-WS-5**: Workspace member role management (`OWNER`, `ADMIN`, `MEMBER`).

### 6.3 Project Management
- **FR-PROJ-1**: Create projects with name, description, status (`PLANNING`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `ARCHIVED`), and due date.
- **FR-PROJ-2**: List projects with search, status filters, and progress calculation (% tasks completed).
- **FR-PROJ-3**: Assign workspace members to specific projects (`ProjectMember`).
- **FR-PROJ-4**: Project detail page with overview, Kanban board, list view, members, and activity log.

### 6.4 Task Management & Kanban Board
- **FR-TASK-1**: Create tasks with title, description, assignee, priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`), due date, and numeric position.
- **FR-TASK-2**: Filter tasks by status, priority, assignee, and search title.
- **FR-TASK-3**: 4-column interactive Kanban board powered by `dnd-kit`.
- **FR-TASK-4**: Smooth drag-and-drop between columns and reordering within columns.
- **FR-TASK-5**: Optimistic client-side updates with instant rollback upon server failure.
- **FR-TASK-6**: Task detail slide-over/modal with markdown description, comment feed, and audit history.

### 6.5 Activity & Notifications
- **FR-ACT-1**: Automatic recording of activity logs upon project creation, task movement, status updates, and member assignments.
- **FR-NOTIF-1**: In-app notifications when a user is assigned a task or mentioned in a comment.

---

## 7. Non-Functional Requirements

### 7.1 Security & Compliance
- **NFR-SEC-1**: All input payloads validated via **Zod** on the backend before hitting service layers.
- **NFR-SEC-2**: Authentication passwords never logged or returned in API responses.
- **NFR-SEC-3**: Strict RBAC middleware verifying both workspace membership and project access on every private route.
- **NFR-SEC-4**: Rate-limiting applied to `/api/auth/*` endpoints to prevent brute-force attacks.
- **NFR-SEC-5**: CORS configured with explicit allowed origins; helmet headers enabled.

### 7.2 Performance & Responsiveness
- **NFR-PERF-1**: Fast page load (< 1s first contentful paint on broadband).
- **NFR-PERF-2**: Drag-and-drop interactions zero-latency feel via optimistic state updates.
- **NFR-PERF-3**: Database indexes on all foreign keys (`workspaceId`, `projectId`, `assigneeId`) and frequently queried fields (`status`, `position`).

### 7.3 Usability & Accessibility
- **NFR-A11Y-1**: WCAG 2.1 AA compliant color contrast across light and dark modes.
- **NFR-A11Y-2**: Full keyboard navigation across all buttons, dropdowns, and modals.
- **NFR-A11Y-3**: Screen-reader friendly aria-labels on icon-only buttons.
