# Hosting NoRog (Vercel: frontend + backend)

Deploy the **API** and the **React app** as **two separate Vercel projects** (recommended). The frontend calls the backend using `VITE_API_BASE_URL`.

---

## What you need

- A [Vercel](https://vercel.com) account (GitHub login is fine).
- Your repo pushed to GitHub (e.g. [NoRog-AI-for-bharat-hackathon](https://github.com/kanha077/NoRog-AI-for-bharat-hackathon)).
- **Groq** API key (`GROQ_API_KEY`).
- **Firebase** project with Firestore; service account JSON for Admin SDK.

---

## Part 1 — Deploy the backend (API)

1. In Vercel: **Add New Project** → import your GitHub repo.
2. **Root Directory**: set to `Backend` (click “Edit” next to Root Directory).
3. **Framework Preset**: Other (or “Other” / no framework). Vercel will detect Node from `package.json`.
4. **Build & Output** (defaults are usually fine):
   - Install: `npm install`
   - Build: leave empty or `echo "no build"` (Express has no build step).
   - Output: not used for serverless API-only deploy.

5. **Environment variables** (Settings → Environment Variables), add:

   | Name | Value |
   |------|--------|
   | `GROQ_API_KEY` | Your Groq secret key |
   | `GROQ_MODEL` | Optional. Default in code: `llama-3.3-70b-versatile` |
   | `FIREBASE_SERVICE_ACCOUNT` | **Entire** contents of your Firebase service account JSON, as **one line** (minified JSON). In Vercel, paste the JSON; if it fails, stringify/minify to one line. |
   | `FRONTEND_URL` | After you deploy the frontend, set this to your frontend URL, e.g. `https://norog-web.vercel.app` (comma-separate multiple URLs if needed). |

6. Deploy. When it finishes, note the **production URL**, e.g. `https://norog-api.vercel.app`.

7. Open `https://<your-api>.vercel.app/` in a browser — you should see JSON with `"name": "NoRog API"` and `"status": "running"`.

### Troubleshooting: `Cannot read properties of undefined (reading 'fsPath')`

That message usually comes from **Vercel’s older Node builder**, not from your Express routes. Fix:

1. Use the **current** `Backend/vercel.json` in this repo (only a **rewrite** to `/api`, no legacy `"builds"` / `"routes"` with `@vercel/node`).
2. In the Vercel project, set **Root Directory** to **`Backend`** (not the monorepo root).
3. **Redeploy** after pushing the updated `vercel.json`.

If it still fails, set **Node.js Version** to **20.x** under Project → Settings → General, then redeploy.

### Backend notes (important)

- **Secrets**: Never commit `firebaseServiceAccount.json`. On Vercel use `FIREBASE_SERVICE_ACCOUNT` only.
- **Timeouts**: AI routes can take several seconds. On the Hobby plan, serverless functions have a **10s** limit; long Groq calls may time out. If that happens, upgrade Vercel or host the API on [Railway](https://railway.app), [Render](https://render.com), or a VPS where Node runs continuously.
- **Symptom photo files**: On serverless, uploads go to `/tmp` and are **not durable** across invocations. Photo **AI text** still saves to Firestore; persistent image hosting would need Firebase Storage or similar (future improvement).
- **CORS**: The API allows `localhost` dev URLs, any `*.vercel.app` preview/production URL, and anything listed in `FRONTEND_URL`.

---

## Part 2 — Deploy the frontend (React + Vite)

1. **Add New Project** again (second Vercel project) → same repo.
2. **Root Directory**: `Frontend/frontend`.
3. **Framework Preset**: Vite (auto-detected).
4. **Build command**: `npm run build` (default).
5. **Output directory**: `dist` (default for Vite).

6. **Environment variables**:

   | Name | Value |
   |------|--------|
   | `VITE_API_BASE_URL` | Your **backend** public URL with `/api` at the end. Example: `https://norog-api.vercel.app/api` |

   Vite bakes this in at **build time**, so after changing it, **redeploy** the frontend.

7. Deploy, then open your frontend URL (e.g. `https://norog-web.vercel.app`).

8. Go back to the **backend** project on Vercel and set `FRONTEND_URL` to this frontend URL (if you did not already), then **redeploy** the backend so CORS allows your production site.

---

## Part 3 — Order of operations (checklist)

1. Deploy **backend** → copy API URL.
2. Deploy **frontend** with `VITE_API_BASE_URL=https://<api>.vercel.app/api`.
3. Set **`FRONTEND_URL`** on the backend to `https://<frontend>.vercel.app`.
4. Redeploy backend (if needed).
5. Test: register, login, onboarding, one AI action.

---

## Local development (unchanged)

- Backend: `cd Backend && npm start` (default port **5001** unless `PORT` is set).
- Frontend: `cd Frontend/frontend && npm run dev` — uses `VITE_API_BASE_URL` if set in `.env`, otherwise proxies `/api` (see `vite.config.js`; align proxy port with your local API).

Example local `.env` in `Frontend/frontend`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## Alternative: backend not on Vercel

If serverless limits are a problem, keep the **frontend on Vercel** and run the **Express API** on Railway, Render, or Fly.io with the same env vars (`GROQ_*`, `FIREBASE_SERVICE_ACCOUNT`, `FRONTEND_URL`). Set `VITE_API_BASE_URL` to that server’s public URL + `/api`.
