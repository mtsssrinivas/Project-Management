# ProjectFlow — Collaborative Project Management Platform

ProjectFlow is a production-grade, collaborative project and task management SaaS application engineered for high-velocity software engineering and product teams. Inspired by the speed, minimalism, and precision of **Linear, Notion, Asana, and Raycast**, ProjectFlow combines a handcrafted user experience with an enterprise-grade backend architecture.

---

## 1. Core Problem Statement

Most modern project management tools are bogged down by sluggish interfaces, noisy visual decorations, and convoluted configuration overhead. ProjectFlow delivers:
- **Instant Responsiveness**: 60fps keyboard-first navigation and optimistic UI updates.
- **Strict Multi-Tenancy**: Complete workspace and project isolation enforced at the middleware layer.
- **Production Security**: Strict input validation using Zod, secure JWTs delivered in HTTP-only cookies, and bcrypt credential hashing.
- **Design Discipline**: A restrained palette (warm off-white canvas, charcoal sidebar, muted indigo accent) with zero unmotivated gradients or decorative fluff.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript (ESNext), Tailwind CSS, React Router v6, Lucide React, `@dnd-kit`, Recharts |
| **Backend** | Node.js (LTS), Express.js, Prisma ORM, PostgreSQL |
| **Security & Auth** | JSON Web Tokens (JWT), HTTP-only cookies, bcryptjs, Zod, Helmet, Express Rate Limit, CORS |
| **Testing** | Vitest, Supertest |
| **Deployment** | Vercel (Frontend), Render / Railway (Backend), Managed PostgreSQL (Neon / Supabase) |

---

## 3. Architecture & Directory Structure

```text
ProjectFlow/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Atomic design system components (Button, Input, Modal, Badge, etc.)
│   │   │   ├── layout/         # AppShell, Sidebar, TopNav, Breadcrumbs, UserMenu, WorkspaceSwitcher
│   │   │   ├── dashboard/      # MetricsSummary, RecentProjects, ActivityFeed, AnalyticsCharts
│   │   │   ├── projects/       # ProjectCard, ProjectFormModal
│   │   │   ├── tasks/          # KanbanBoard, TaskCard, TaskDetailDrawer
│   │   │   └── workspace/      # InviteMemberModal
│   │   ├── contexts/           # WorkspaceContext, ToastContext
│   │   ├── data/               # Realistic Linear-style mock state
│   │   ├── pages/              # 12 Route Views (Dashboard, Projects, Board, Calendar, Team, etc.)
│   │   └── utils/              # cn.js class name utility
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json
│
├── server/                     # Backend Application (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # 11 Relational PostgreSQL models
│   │   └── seed.js             # Initial seeding routine
│   ├── src/
│   │   ├── config/             # Database client & environment setup
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth, RBAC, Validation, Error Handler, Rate Limiter
│   │   ├── routes/             # REST endpoint routers
│   │   ├── services/           # Domain business logic & transactions
│   │   ├── validators/         # Zod request payload schemas
│   │   ├── utils/              # JWT, password, AppError, response envelope
│   │   ├── __tests__/          # Automated test suite (Vitest + Supertest)
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server entry point & graceful shutdown
│   ├── package.json
│   └── .env.example
│
├── docs/                       # Technical Specifications & Reports
│   ├── PRD.md                  # Product Requirements Document
│   ├── ARCHITECTURE.md         # Full System Architecture
│   ├── DATABASE_SCHEMA.md      # PostgreSQL Schema & ER Diagram
│   ├── API_SPECIFICATION.md    # REST API Specification
│   ├── DESIGN_SYSTEM.md        # UI Tokens & Typography Scale
│   ├── IMPLEMENTATION_PLAN.md  # 13-Phase Execution Roadmap
│   ├── REFERENCE_ANALYSIS.md   # Reference video teardown & analysis
│   ├── SECURITY_AUDIT.md       # Security review & vulnerability audit
│   ├── TESTING_REPORT.md       # Automated testing report
│   └── DEPLOYMENT_REPORT.md    # Vercel & Render deployment guide
│
├── AGENTS.md                   # Engineering protocol and standards
├── README.md                   # Repository documentation
└── .env.example                # Global environment variables template
```

---

## 4. Key Features & Route Architecture

- **Authentication (`/login`, `/register`)**:
  - Secure credential registration and login with bcrypt hashing.
  - HTTP-only cookie session handling with CSRF and rate-limiting safeguards.
- **Workspaces (`/workspaces`)**:
  - Multi-tenant workspace switcher and creation modal.
  - Role-based access control (`OWNER`, `ADMIN`, `MEMBER`).
- **Dashboard & Analytics (`/dashboard`)**:
  - 4-card metric summary (Active Projects, Completed Tasks, Pending Work, Team Capacity).
  - Status and Priority distribution charts + Weekly completion velocity curve powered by **Recharts**.
  - Live activity stream.
- **Projects (`/projects`, `/projects/:projectId`)**:
  - Grid and tabular views with search, status filters, and progress calculation.
  - Dedicated project overview with team roster and task progress metrics.
- **Kanban Board (`/projects/:projectId/board`)**:
  - 4 columns: To Do, In Progress, In Review, Done.
  - Smooth drag-and-drop powered by **`@dnd-kit`** with optimistic updates.
  - Fractional positioning (`Float` position field) enabling $O(1)$ single-row reorder updates.
- **Slide-over Task Details Drawer**:
  - Markdown descriptions, priority and status selector, assignee dropdown, due date picker.
  - Threaded comment section with real-time posting.
- **Calendar (`/calendar`)**:
  - Month view displaying tasks scheduled by due date with clickable detail inspection.
- **Global Search (`⌘K` / `Ctrl+K`)**:
  - Raycast/Linear-style command palette for instant navigation across projects and tasks.

---

## 5. Local Setup & Installation

### Prerequisites
- Node.js (v18+ LTS recommended)
- npm or pnpm

### 1. Clone & Configure
```bash
git clone https://github.com/your-username/projectflow.git
cd projectflow
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npx prisma generate
npm run start
```
*Server starts on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` with proxying to backend.*

---

## 6. Running Automated Tests

Run the backend integration test suite:
```bash
cd server
npm test
```

Expected output:
```text
✓ src/__tests__/api.test.js (11 tests)
Test Files  1 passed (1)
Tests       11 passed (11)
```

Run production build validation:
```bash
cd client
npm run build
```

---

## 7. Documentation Index

- [Product Requirements Document (PRD)](file:///d:/resume%20projects/ProjectFlow-Project%20management%20platform/docs/PRD.md)
- [Design System & UI Tokens](file:///d:/resume%20projects/ProjectFlow-Project%20management%20platform/docs/DESIGN_SYSTEM.md)
- [System Architecture](file:///d:/resume%20projects/ProjectFlow-Project%20management%20platform/docs/ARCHITECTURE.md)
- [Database Schema (Prisma)](file:///d:/resume%20projects/ProjectFlow-Project%20management%20platform/docs/DATABASE_SCHEMA.md)
- [API Specification](file:///d:/resume%20projects/ProjectFlow-Project%20management%20platform/docs/API_SPECIFICATION.md)
- [Security & Architectural Audit](file:///d:/resume%20projects/ProjectFlow-Project%20management%20platform/docs/SECURITY_AUDIT.md)
- [Testing & Quality Assurance Report](file:///d:/resume%20projects/ProjectFlow-Project%20management%20platform/docs/TESTING_REPORT.md)
- [Deployment Guide](file:///d:/resume%20projects/ProjectFlow-Project%20management%20platform/docs/DEPLOYMENT_REPORT.md)
