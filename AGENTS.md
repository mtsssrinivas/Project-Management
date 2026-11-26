# AGENTS.md — Development & Architectural Guidelines for ProjectFlow

This document sets the working protocols, engineering standards, and quality gates for AI agents and engineers working on **ProjectFlow**.

## 1. Core Principles
- **No shortcuts or fake implementations**: Build real, robust SaaS components. Never leave broken imports or unaddressed TODOs.
- **Phase discipline**: Work strictly on the phase explicitly requested. Never jump ahead to future phases without user approval.
- **Design system adherence**: All UI elements must strictly honor `docs/DESIGN_SYSTEM.md` and `DESIGN_PHILOSOPHY.md` (inspired by Linear, Raycast, Notion, and Asana).
  - Warm off-white canvas (`#FAFAFA`), subtle borders (`#E4E4E7`), charcoal sidebar (`#18181B`), muted indigo accent (`#4F46E5`).
  - No random gradients, no heavy shadows, no oversized corner radii, no emoji navigation.

## 2. Directory Layout & Layer Boundaries
- `client/`: React + Vite + JavaScript single-page application.
  - `components/ui/`: Reusable, atomic design system components (Button, Input, Modal, Dropdown, Table, Badge, etc.).
  - `components/layout/`: AppShell, Sidebar, TopNav, Breadcrumbs, UserMenu, WorkspaceSwitcher.
  - `components/{dashboard,projects,tasks,calendar,notifications,workspace}/`: Feature-specific UI units.
  - `pages/`: Route-level views.
  - `services/`: Axios/Fetch API client and service modules.
  - `contexts/`: React state contexts (AuthContext, WorkspaceContext, ToastContext).
- `server/`: Node.js + Express backend with 4-layer architecture (Routes -> Controllers -> Services -> Prisma ORM).
- `docs/`: Comprehensive architecture, database schema, API specification, PRD, and security audits.

## 3. Quality & Verification Gates
Before reporting any phase complete:
1. Verify spacing, typography hierarchy, and color tokens.
2. Verify responsive layout on Desktop, Tablet, and Mobile.
3. Test all interactive controls (hover, active, focus, disabled).
4. Run automated builds and tests (`npm run build`, `npm test`).
5. Document all created/modified files, architectural decisions, and remaining issues.
