# NiveshIQ Deployment Manifest (v4.0)

This document outlines the high-fidelity deployment protocol for the NiveshIQ ecosystem. To maintain the **"Cinematic Intelligence"** experience, we will leverage **Vercel** for the React/Next.js frontend and **Render** for the TypeScript/Express backend.

---

## 1. Prerequisites (Vault Setup)

Before initiating the deployment, ensure the following infrastructure is provisioned:

- **Database**: [MongoDB Atlas Cluster](https://www.mongodb.com/atlas/database) (Provision a free tier or dedicated cluster).
- **Environment Cluster**: Collect all secrets and access tokens.
- **Repository**: Ensure your `main` branch is pushed to GitHub.

---

## 2. Backend Orchestration (Render)

The **NiveshIQ API** (Node.js/TypeScript) should be deployed as a **Web Service** on Render.

### Configuration Protocol:
- **Project Structure**: Set the `Root Directory` to `apps/api`.
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node dist/index.js`
- **Plan**: `Starter` (or higher for production performance).

### Environment Variables (Vault):
| Variable | Description |
|---|---|
| `MONGO_URI` | Your full Atlas connection string (ensure IP whitelist is set to `0.0.0.0/0` or Render's outbound IPs). |
| `JWT_SECRET` | A cryptographically secure random string for user authentication. |
| `PORT` | Set to `8000` (Render will override but it's good practice). |
| `GROQ_API_KEY` | (If applicable) for LangChain/Groq analytical agents. |

> [!IMPORTANT]
> Ensure **IP Whitelisting** in MongoDB Atlas is configured to allow Render's traffic. Since Render outbound IPs are dynamic on the free tier, you may need to allow `0.0.0.0/0` temporarily.

---

## 3. Frontend Deployment (Vercel)

The **NiveshIQ Web Terminal** (Next.js) is optimized for Vercel's Edge network.

### Configuration Protocol:
- **Framework Preset**: `Next.js`
- **Root Directory**: `apps/web`
- **Build Command**: `next build`
- **Install Command**: `npm install`

### Environment Variables (Production Console):
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | The **Render Web Service URL** (e.g., `https://niveshiq-api.onrender.com`). |
| `NEXT_PUBLIC_SUPABASE_URL` | (If applicable) your auth provider endpoint. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your public auth key. |

---

## 4. CORS & Security Synchronization

To allow the frontend to communicate with the analytical backplane, you must update the CORS configuration in the backend.

### Required Code Adjustment (`apps/api/src/index.ts`):
Replace the static `localhost` origin with a dynamic environment check:

```typescript
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL // Add this to Render Env Vars
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
```

---

## 5. Post-Deployment Verification

Once pushed, verify the terminal status via the diagnostic endpoint:
- **Status Check**: `https://your-api-url.render.com/api/status`
- **Expected Outcome**: `{ "status": "ok", "dbState": "connected" }`

---

## 6. Known Architecture Discrepancy

**Note**: The current `Readme.md` in the project root lists the tech stack as **FastAPI/Python**. However, the implementation is **Express/TypeScript**. Ensure your deployment settings reflect the **Node.js** environment rather than Python.

---
