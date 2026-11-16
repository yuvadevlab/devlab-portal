# DevLab Portal — Cloud Deployment Guide

**Author:** `yuva.devlab@gmail.com`
**Scope:** Production Deployment, Containerization & SSO Infrastructure
**Stack:** Next.js 15 Web, NestJS 11 API Control Plane, PostgreSQL 16, Redis 7

---

## 1. Architectural Topology

DevLab Portal serves as the centralized Identity, Authentication, and Single Sign-On (SSO) Authority across the entire DevLab ecosystem:

```mermaid
flowchart TD
    Client["User Browser / Client"]
    Web["Frontend: DevLab Portal Web<br/>Next.js 15 Standalone<br/>(Vercel / Cloud Run / Container)"]
    API["Control Plane: DevLab Portal API<br/>NestJS 11 Application<br/>(Google Cloud Run / Render / Container)"]
    DB["Database: PostgreSQL 16<br/>Identity & Tenancy Storage<br/>(Neon / Supabase / Managed Postgres)"]
    Redis["Cache: Redis 7<br/>Session & Token Blacklist<br/>(Upstash / Managed Redis)"]
    Apps["Ecosystem Consumers<br/>(FinAI, OrchestraI, Logs)<br/>JWKS Token Verification"]

    Client -->|HTTPS| Web
    Web -->|REST / GraphQL| API
    API -->|Pooled TLS| DB
    API -->|TLS| Redis
    Apps -.->|Verify JWT via JWKS| API
```

---

## 2. Infrastructure Requirements

| Component      | Specification                        | Deployment Targets                      |
| :------------- | :----------------------------------- | :-------------------------------------- |
| **Portal Web** | Next.js 15 (Node.js 24 / Standalone) | Vercel, Google Cloud Run, Docker        |
| **Portal API** | NestJS 11 (Node.js 24 / Container)   | Google Cloud Run, Render, Koyeb, Docker |
| **Database**   | PostgreSQL 16 (`devlab_portal` db)   | Neon, Supabase, Managed PostgreSQL      |
| **Cache**      | Redis 7 (or Upstash Serverless)      | Upstash Redis, Redis Cloud, Docker      |

---

## 3. Step-by-Step Deployment Instructions

### Step 1: Database Migration

Apply the Portal Prisma schema to your target PostgreSQL database:

```bash
export DATABASE_URL="postgresql://user:password@host:5432/devlab_portal?sslmode=require"
pnpm db:push
```

---

### Step 2: Deploy Backend API Control Plane

#### Option A: Container Deployment (Google Cloud Run / Docker)

Build and deploy the backend container using [Dockerfile.api](file:///Users/yuvarajpattabi/Yuva/yuva-devlab/repos/devlab-portal/Dockerfile.api):

```bash
# 1. Build container image
docker build -t devlab-portal-api -f Dockerfile.api .

# 2. Deploy to Google Cloud Run
gcloud run deploy devlab-portal-api \
  --image gcr.io/YOUR_PROJECT_ID/devlab-portal-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 4000 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars "\
NODE_ENV=production,\
DATABASE_URL=your-neon-portal-db-url,\
REDIS_URL=rediss://default:your-token@your-redis.upstash.io:6379,\
SESSION_SECRET=your-random-64char-secret,\
PORTAL_ORIGIN=https://portal.yourdomain.com,\
OIDC_ISSUER=https://portal-api.yourdomain.com,\
CORS_ORIGIN=https://portal.yourdomain.com,https://finai.yourdomain.com"
```

#### Option B: Deploy via Render Blueprint

Deploy directly using the [render.yaml](file:///Users/yuvarajpattabi/Yuva/yuva-devlab/repos/devlab-portal/render.yaml) specification in the repository root.

---

### Step 3: Deploy Frontend Web

#### Option A: Vercel Monorepo Deployment

1. Import the repository into Vercel.
2. The project automatically uses [apps/web/vercel.json](file:///Users/yuvarajpattabi/Yuva/yuva-devlab/repos/devlab-portal/apps/web/vercel.json):
   - **Framework Preset**: `Next.js`
   - **Build Command**: `pnpm --filter @devlab/portal-web... build`
   - **Install Command**: `pnpm install`
3. Configure environment variable:
   - `NEXT_PUBLIC_DEVLAB_PORTAL_API_URL`: Your deployed Portal API URL (e.g. `https://portal-api-xyz.a.run.app`)
4. Click **Deploy**.

---

### Step 4: Verification & Health Probes

1. **API Readiness Probe**:

   ```bash
   curl -I https://portal-api.yourdomain.com/health
   # Expected: HTTP 200 OK
   ```

2. **OIDC JWKS Public Key Discovery**:

   ```bash
   curl https://portal-api.yourdomain.com/api/v1/auth/jwks.json
   # Expected: JSON object with "keys" array for consumer token verification
   ```

3. **Web Frontend Health Probe**:
   ```bash
   curl -I https://portal.yourdomain.com/api/health
   # Expected: HTTP 200 OK
   ```

---

## 4. Local Production Simulation

To run and validate the complete containerized Portal stack locally before deploying:

```bash
# Boot complete production stack (PostgreSQL + Redis + API + Web)
docker compose -f docker-compose.prod.yml up --build -d

# Check service logs
docker compose -f docker-compose.prod.yml logs -f api
```
