# ProjectFlow — Production Deployment Guide & Report

## 1. Production Architecture Overview

```mermaid
graph LR
    User[Web Client] -->|HTTPS| Vercel[Vercel Frontend CDN]
    Vercel -->|API Calls / Cookies| Render[Render / Node.js Express Backend]
    Render -->|Pooled Connections| Neon[(Managed PostgreSQL / Neon)]
```

---

## 2. Frontend Deployment (Vercel)

### 2.1 Configuration (`client/vercel.json`)
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://api.projectflow.dev/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2.2 Environment Variables (Vercel)
- `VITE_API_BASE_URL`: `https://api.projectflow.dev/api`

### 2.3 Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 3. Backend Deployment (Render / Railway)

### 3.1 Environment Variables
| Variable | Production Example | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | HTTP port assigned by host |
| `NODE_ENV` | `production` | Enforces production error masking |
| `CLIENT_URL` | `https://projectflow.dev` | Allowed CORS origin for cookies |
| `DATABASE_URL` | `postgresql://user:pass@ep-cool-db.neon.tech/projectflow?sslmode=require` | Managed PostgreSQL connection |
| `JWT_SECRET` | `prod_secure_random_hex_64_bytes` | Cryptographic key for JWT signatures |
| `JWT_EXPIRES_IN`| `7d` | Session expiration window |

### 3.2 Build & Start Commands
- **Root Directory**: `server`
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `node src/server.js`
- **Health Check Endpoint**: `/api/health`

---

## 4. Managed PostgreSQL (Neon / Supabase)

### 4.1 Migration Execution
Run Prisma migrations against the production database:
```bash
npx prisma migrate deploy
```

### 4.2 Seed Initial Data (Optional)
```bash
node prisma/seed.js
```

---

## 5. Verification Checklist

- [x] CORS origin configured with `credentials: true`.
- [x] JWT cookies configured with `httpOnly: true`, `secure: true`, and `sameSite: 'lax'`.
- [x] Rate limiting active on `/api/auth/*` and global endpoints.
- [x] Health check endpoint `/api/health` responding with 200 OK.
- [x] SPA client handles client-side route refreshes via rewrite rule.
