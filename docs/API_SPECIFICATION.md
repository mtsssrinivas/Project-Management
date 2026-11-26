# ProjectFlow — REST API Specification

All API endpoints are prefixed with `/api`.
All JSON request bodies must include `Content-Type: application/json`.
Responses adhere to a standardized envelope format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable confirmation"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [ ... ]
  }
}
```

---

## 1. Authentication & Session Management

### 1.1 Register
- **Endpoint**: `POST /api/auth/register`
- **Auth**: Public (Rate-limited: 10 req/15min)
- **Request Body (Zod)**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (201 Created)**:
  - Sets HTTP-only secure cookie `token`.
  - Body returns sanitized user:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "usr_948f...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "avatarUrl": null,
        "createdAt": "2026-11-25T12:00:00.000Z"
      }
    }
  }
  ```

### 1.2 Login
- **Endpoint**: `POST /api/auth/login`
- **Auth**: Public (Rate-limited: 5 req/15min)
- **Request Body (Zod)**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK)**:
  - Sets HTTP-only secure cookie `token`.
  - Returns sanitized user object and default active workspace.

### 1.3 Logout
- **Endpoint**: `POST /api/auth/logout`
- **Auth**: Required
- **Response (200 OK)**:
  - Clears `token` cookie and revokes session.

### 1.4 Get Current User (Session Me)
- **Endpoint**: `GET /api/auth/me`
- **Auth**: Required
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "usr_948f...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "avatarUrl": null
      },
      "workspaces": [
        {
          "id": "ws_1a2b...",
          "name": "Acme Engineering",
          "role": "OWNER"
        }
      ]
    }
  }
  ```

---

## 2. Workspace Management

### 2.1 List Workspaces
- **Endpoint**: `GET /api/workspaces`
- **Auth**: Required
- **Response (200 OK)**: Array of workspaces where the user is a member or owner.

### 2.2 Create Workspace
- **Endpoint**: `POST /api/workspaces`
- **Auth**: Required
- **Request Body (Zod)**:
  ```json
  {
    "name": "Acme Corp",
    "description": "Primary product workspace"
  }
  ```
- **Response (201 Created)**: Workspace created, user assigned as `OWNER`.

### 2.3 Get Workspace Details
- **Endpoint**: `GET /api/workspaces/:workspaceId`
- **Auth**: Required (Workspace Member/Admin/Owner)
- **Response (200 OK)**: Workspace metadata, member counts, project counts.

### 2.4 Update Workspace
- **Endpoint**: `PATCH /api/workspaces/:workspaceId`
- **Auth**: Required (`ADMIN` or `OWNER`)
- **Request Body**: `{ "name": "New Name", "description": "Updated" }`

### 2.5 Delete Workspace
- **Endpoint**: `DELETE /api/workspaces/:workspaceId`
- **Auth**: Required (`OWNER` only)

---

## 3. Workspace Members & Invitations

### 3.1 List Members
- **Endpoint**: `GET /api/workspaces/:workspaceId/members`
- **Auth**: Required (Workspace Member)
- **Response (200 OK)**: Array of members with role, user details, and `joinedAt`.

### 3.2 Invite Member
- **Endpoint**: `POST /api/workspaces/:workspaceId/invitations`
- **Auth**: Required (`ADMIN` or `OWNER`)
- **Request Body (Zod)**:
  ```json
  {
    "email": "teammate@example.com",
    "role": "MEMBER"
  }
  ```
- **Response (201 Created)**: Generates invitation token and logs activity.

### 3.3 Accept Invitation
- **Endpoint**: `POST /api/invitations/:token/accept`
- **Auth**: Required (Authenticated User)
- **Response (200 OK)**: Binds user to workspace with assigned role.

### 3.4 Remove Member / Change Role
- **Endpoint**: `DELETE /api/workspaces/:workspaceId/members/:userId`
- **Auth**: Required (`ADMIN` or `OWNER`)
- **Endpoint**: `PATCH /api/workspaces/:workspaceId/members/:userId/role`
- **Auth**: Required (`OWNER` only for Admin promotion/demotion)

---

## 4. Project Management

### 4.1 List Workspace Projects
- **Endpoint**: `GET /api/workspaces/:workspaceId/projects`
- **Auth**: Required (Workspace Member)
- **Query Params**: `?status=ACTIVE&search=web`
- **Response (200 OK)**: List of projects with completion stats and assignee avatars.

### 4.2 Create Project
- **Endpoint**: `POST /api/workspaces/:workspaceId/projects`
- **Auth**: Required (Workspace Member)
- **Request Body (Zod)**:
  ```json
  {
    "name": "Design System 2.0",
    "description": "Revamp component library",
    "status": "ACTIVE",
    "startDate": "2026-12-01T00:00:00.000Z",
    "dueDate": "2027-01-15T00:00:00.000Z"
  }
  ```
- **Response (201 Created)**

### 4.3 Get Project Details
- **Endpoint**: `GET /api/projects/:projectId`
- **Auth**: Required (Project Member or Workspace Admin)
- **Response (200 OK)**: Full project info, member list, task progress counters.

### 4.4 Update Project
- **Endpoint**: `PATCH /api/projects/:projectId`
- **Auth**: Required (Project Lead or Workspace Admin)

### 4.5 Delete / Archive Project
- **Endpoint**: `DELETE /api/projects/:projectId`
- **Auth**: Required (`OWNER` or `ADMIN`)

---

## 5. Task Management & Kanban Board

### 5.1 List Tasks in Project
- **Endpoint**: `GET /api/projects/:projectId/tasks`
- **Auth**: Required
- **Query Params**: `?status=TODO&priority=HIGH&assigneeId=...&search=header`
- **Response (200 OK)**: Tasks ordered by `position ASC`.

### 5.2 Create Task
- **Endpoint**: `POST /api/projects/:projectId/tasks`
- **Auth**: Required
- **Request Body (Zod)**:
  ```json
  {
    "title": "Refactor Navigation Bar",
    "description": "Align with Linear keyboard navigation model",
    "status": "TODO",
    "priority": "HIGH",
    "assigneeId": "usr_948f...",
    "dueDate": "2026-12-10T18:00:00.000Z"
  }
  ```
- **Response (201 Created)**: Automatically assigns calculated `position` at end of column.

### 5.3 Get Task Details
- **Endpoint**: `GET /api/tasks/:taskId`
- **Auth**: Required
- **Response (200 OK)**: Task record, assignee object, comments list, and activity events.

### 5.4 Update Task (Metadata)
- **Endpoint**: `PATCH /api/tasks/:taskId`
- **Auth**: Required
- **Request Body**: Partial task payload (`title`, `description`, `priority`, `assigneeId`, `dueDate`).

### 5.5 Move Task (Kanban Drag-and-Drop)
- **Endpoint**: `PATCH /api/tasks/:taskId/move`
- **Auth**: Required
- **Request Body (Zod)**:
  ```json
  {
    "status": "IN_PROGRESS",
    "prevTaskId": "task_111",
    "nextTaskId": "task_222"
  }
  ```
- **Logic**:
  - If placed between two tasks: `newPosition = (prevTask.position + nextTask.position) / 2`.
  - If placed at top: `newPosition = nextTask.position / 2`.
  - If placed at bottom: `newPosition = prevTask.position + 1000.0`.
  - If single item: `newPosition = 1000.0`.
  - Persisted within a Prisma transaction; logs `TASK_MOVED` activity.
- **Response (200 OK)**: Updated task with new `status` and `position`.

### 5.6 Delete Task
- **Endpoint**: `DELETE /api/tasks/:taskId`
- **Auth**: Required

---

## 6. Comments, Activity & Notifications

### 6.1 Add Comment
- **Endpoint**: `POST /api/tasks/:taskId/comments`
- **Auth**: Required
- **Request Body**: `{ "content": "Updated design tokens in Figma." }`

### 6.2 Get Workspace Activity Log
- **Endpoint**: `GET /api/workspaces/:workspaceId/activity`
- **Auth**: Required
- **Query Params**: `?page=1&limit=20`

### 6.3 User Notifications
- **Endpoint**: `GET /api/notifications`
- **Endpoint**: `PATCH /api/notifications/:id/read`
- **Endpoint**: `PATCH /api/notifications/read-all`
