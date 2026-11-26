# ProjectFlow — Security & Backend Architecture Audit

## 1. Executive Summary
This security and architectural audit validates the backend engineering standards, authentication mechanisms, multi-tenant boundaries, and database query optimizations for **ProjectFlow**.

---

## 2. Architectural Layering Review

The backend strictly enforces a 4-layer separation of concerns:
1. **HTTP/Route Layer (`src/routes/`)**: Declares REST endpoints, binds rate-limiters, authenticates tokens, and binds schema validators.
2. **Controller Layer (`src/controllers/`)**: Extracts sanitized request parameters, invokes domain services, formats standardized JSON envelopes (`{ success, data, message }`).
3. **Service Layer (`src/services/`)**: Encapsulates all business logic, enforces multi-tenant rules, coordinates Prisma transactions, records audit actions.
4. **Data Access Layer (`src/config/database.js` & Prisma)**: Typed ORM queries, foreign key constraints, connection pool management.

---

## 3. Security Findings & Implemented Mitigations

| Vulnerability Vector | Threat Assessment | Mitigation Implemented |
| :--- | :--- | :--- |
| **Cross-Site Scripting (XSS) Token Theft** | High | JWTs are delivered in **HTTP-only, SameSite=Lax, Secure** cookies, preventing access by malicious browser scripts. |
| **Insecure Direct Object References (IDOR)** | Critical | `requireWorkspaceMember` middleware validates that the authenticated user belongs to the target workspace before executing any query. Queries include workspace scopes. |
| **Credential Stuffing / Brute Force** | High | `express-rate-limit` enforces rate-limiting on `/api/auth/*` (max 20 attempts per 15 minutes) and global API endpoints (max 200 req/min). |
| **SQL Injection** | Critical | All database operations use **Prisma ORM** with parameterized queries, eliminating SQL injection vulnerabilities. |
| **Unvalidated Payloads** | Medium | Every endpoint validates request bodies and query parameters using **Zod** schemas before executing business logic. |
| **Information Disclosure via Stack Traces** | Low | Centralized error handler captures errors and excludes internal stack traces in production environments. |
| **Plain-text Passwords** | Critical | Passwords are automatically hashed using **bcryptjs** with 10 salt rounds before storage. Plain-text passwords are never stored or returned. |

---

## 4. Database Query Optimization & Indexing

- **Foreign Key Indexes**: High-performance indexes added on `workspaceId`, `projectId`, `userId`, `assigneeId`, and `status`.
- **Fractional Positioning**: `position` on tasks is typed as `Float`, enabling $O(1)$ single-row position updates during drag-and-drop instead of $O(N)$ sequential shifts.
- **Compound Constraints**:
  - `@@unique([workspaceId, userId])` prevents duplicate memberships.
  - `@@unique([projectId, userId])` prevents duplicate project assignments.
- **Selective Projections**: Prisma queries use explicit `select` blocks to prevent querying or returning sensitive fields like `passwordHash`.
