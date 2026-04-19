# NoRog — Proactive Disease Monitoring

**NoRog** is a full-stack health intelligence web app that combines **symptom tracking**, **family and lifestyle context**, and **Groq-powered AI** to surface **risk signals**, **seasonal awareness**, **what-if lifestyle simulations**, and **medicine interaction checks**—with a **floating assistant** that learns from conversation. It is designed as **decision support**, not a substitute for a clinician.

<p align="center">
  <sub>React · Vite · Express · Firebase (Firestore) · Groq LLM · PDF reports</sub>
</p>

---

## Why NoRog?

Traditional care often reacts after something goes wrong. NoRog helps you **monitor patterns early**: log how you feel, let AI connect dots across your profile and history, and get **plain-language summaries** with **urgency-style cues** so you know when to seek professional care.

---

## Feature tour

### Public experience

| Feature | What it does |
|--------|----------------|
| **Landing page** | Hero, value proposition, feature grid, stats strip, and CTAs to sign up. Includes a **medical disclaimer**: AI insights are not a diagnosis. |
| **Authentication** | **Register** and **login** with email; session **Bearer token** stored for API calls. New users get an empty health profile until onboarding completes. |

### Onboarding & profile

| Feature | What it does |
|--------|----------------|
| **Multi-step onboarding** | Captures **age**, **gender**, **city/country** (for seasonal logic), **current symptoms**, **medical conditions** (preset list + custom), **family history** (relation + condition for genetic context), **lifestyle** (smoking, alcohol, exercise, sleep, diet), and **medicines** (name, dosage, frequency). |
| **Profile API** | Loads and updates the full health profile; supports **updating medicines** independently (`PUT /api/profile/medicines`). |
| **Onboarding gate** | If onboarding is incomplete, the app routes you to **finish setup** before using the main dashboard. |

### Dashboard (`/dashboard`)

| Feature | What it does |
|--------|----------------|
| **Personalized welcome** | Greets you by first name. |
| **Health score & trend** | Shows the latest **AI health score** (0–100) and **improving / stable / declining** trend from the most recent analysis. |
| **Score sparkline** | Mini **trend chart** (last runs, cached locally for quick display). |
| **Early warning banner** | Surfaces **AI-triggered warnings** from recent symptom logs (with reason and urgency). |
| **Seasonal alert card** | **Location- and month-aware** heads-up for diseases common in your area, with optional **recommendations**. |
| **Top risk factors** | Highlights leading **disease risk cards** from your latest prediction. |
| **Recent symptom logs** | Snapshot of the latest entries with **severity bars** and warning icons. |
| **Quick actions** | One-tap navigation to **Log Symptoms**, **AI Analysis**, and **What-If**. |
| **AI Life Insights** | **“User Patterns”** (e.g. moods, goals, stress triggers) and **Family Tracking** populated from the assistant’s structured memory—shown when data exists. |

### Symptom logging (`/symptoms`)

| Feature | What it does |
|--------|----------------|
| **Searchable symptom chips** | Pick from a broad list of common symptoms. |
| **Severity slider** | 1–10 with visual emphasis for higher severity. |
| **Free-text notes** | Add context for you (and the AI) later. |
| **Optional photo upload** | Attach an image; the backend can run **vision-assisted AI** to describe what the image may show and flag concerns. |
| **Automatic early-warning pass** | After each log, AI compares **new + recent history + conditions** and may **flag the log** with a **warning reason** and urgency tier. |

### AI risk analysis (`/analysis`)

| Feature | What it does |
|--------|----------------|
| **One-click “Run Analysis”** | Calls the prediction pipeline with **no manual symptom payload**—the server pulls your **profile**, **demographics**, **medicines**, and **recent symptom logs**. |
| **Structured output** | **Per-disease risks** with confidence, contributing symptoms, **urgency band**, and whether **genetic/family factors** were considered; **health score**; **trend**; **symptom correlations**; and a **short summary**. |
| **Local cache** | Latest runs are cached in the browser for dashboard sparkline/history-style use. |

### What-if simulator (`/whatif`)

| Feature | What it does |
|--------|----------------|
| **Custom scenarios** | Ask “what if I changed X?” in natural language. |
| **Preset scenarios** | Quick buttons (e.g. sleep, exercise, smoking, diet, medicines). |
| **Projected timelines** | Compares impact at **1 month**, **6 months**, and **1 year** with score deltas, summaries, worsening conditions, new risks, and improvements. |
| **Chart** | Line chart of projected **health score** across timepoints. |
| **Session history** | Keeps a stack of recent simulations in the UI for comparison. |

### Medicine interaction checker (`/medicines`)

| Feature | What it does |
|--------|----------------|
| **Profile-aware** | Pulls **medicines from your profile** automatically. |
| **Add temporary drugs** | Include one-off meds you’re considering. |
| **Interaction scan** | Reports **drug–drug** interactions (with severity), **drug–disease** warnings against your conditions, an overall **safe / caution** style verdict, and **recommendations**. Requires **at least two** medicine names to run the check in the UI. |

### Health history (`/history`)

| Feature | What it does |
|--------|----------------|
| **Timeline** | Chronological **symptom logs** with date/time. |
| **Filters** | Chip filters to view **everything** or **only warning-flagged** entries from the early-warning system. |
| **Rich entries** | Severity visualization, tags, notes, **AI photo analysis** blurbs, and **warning explanations** when present. |

### NoRog Assistant (floating chat)

| Feature | What it does |
|--------|----------------|
| **Always-available panel** | Opens from a **floating control** when you’re signed in. |
| **Persistent history** | Loads prior messages from the server; **clear history** with confirmation. |
| **Smart reply chips** | When the model returns **options**, tap to send the next message quickly. |
| **Context-rich answers** | Uses your **profile**, **insights**, **family tracking**, and **recent chat** for grounded replies. |
| **Quiet insight extraction** | Updates **behavioral traits** and **family-related notes** in the background for the **AI Life Insights** panel—without turning every chat into an interrogation. |
| **Safety posture** | System prompt emphasizes **no definitive diagnosis** and concise, supportive tone. |

### PDF health report (API + optional UI)

| Feature | What it does |
|--------|----------------|
| **`GET /api/report/generate`** | Builds a **downloadable PDF** combining user demographics, profile, recent symptom logs, latest prediction, and medicine check logs (server-side via **PDFKit**). |
| **`DoctorReport.jsx`** | A ready-made page component that triggers the download (you can **add a route** in the router if you want it in the nav). |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router 7, Vite 8, Tailwind CSS 4, Framer Motion, Recharts, Lucide icons, React Hot Toast, Axios |
| **Backend** | Express 5, Firebase Admin + **Firestore**, Multer (uploads), PDFKit, Axios |
| **AI** | **Groq** OpenAI-compatible chat API (`GROQ_API_KEY`, optional `GROQ_MODEL`) |

---

## Hosting (Vercel)

Deploy the API and the React app as **two Vercel projects** (root directories `Backend` and `Frontend/frontend`), with env vars for Groq, Firebase, and `VITE_API_BASE_URL`. Full steps, variable list, and caveats (timeouts, uploads) are in **[DEPLOY.md](./DEPLOY.md)**.

---

## Repository layout

```
├── Backend/                 # Express API (Firebase, Groq, PDF)
│   ├── routes/              # auth, profile, symptoms, ai, medicines, report, chat
│   ├── services/            # firebaseDB, groqService, assistantService, pdfService
│   ├── middleware/          # Bearer session validation
│   └── firebaseServiceAccount.json   # place your Firebase service account here
│
└── Frontend/frontend/       # Vite + React SPA
    └── src/
        ├── pages/           # Landing, Auth, Onboarding, Dashboard, SymptomLogger, AIAnalysis, WhatIf, MedicineChecker, HealthHistory, …
        ├── components/      # Navbar, ChatAssistant, charts, panels, …
        ├── context/         # Auth (localStorage session)
        └── services/        # api.js → proxied /api
```

---

## Prerequisites

- **Node.js** (LTS recommended)
- A **Firebase** project with **Firestore** enabled
- **Service account JSON** downloaded as `Backend/firebaseServiceAccount.json`
- A **Groq API key** for LLM features

---

## Environment variables (Backend)

Create `Backend/.env`:

```env
# Required for AI features
GROQ_API_KEY=your_groq_api_key

# Optional (default shown in code)
GROQ_MODEL=llama-3.3-70b-versatile

# Server port — match the Vite proxy (see below)
PORT=5000
```

> **Port note:** `Backend/index.js` defaults to **5001** if `PORT` is unset, while `Frontend/frontend/vite.config.js` proxies `/api` to **5000**. Set `PORT=5000` in `.env`, **or** change the Vite proxy target to `http://localhost:5001` so the SPA can reach the API.

---

## Run locally

### 1. Backend

```bash
cd Backend
npm install
npm start
# or: npm run dev   (with nodemon)
```

Confirm `http://localhost:<PORT>/` returns the NoRog API JSON health payload.

### 2. Frontend

```bash
cd Frontend/frontend
npm install
npm run dev
```

Open **http://localhost:5173** (Vite dev server). The app calls **`/api`** which is **proxied** to your backend.

---

## API overview (authenticated unless noted)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth/register` | Create account + session token |
| `POST` | `/api/auth/login` | Login + session token |
| `GET` | `/api/profile` | User + health profile |
| `POST` | `/api/profile` | Save onboarding / profile |
| `PUT` | `/api/profile/medicines` | Update medicines list |
| `POST` | `/api/symptoms/log` | Multipart symptom log (+ optional photo) |
| `GET` | `/api/symptoms/history` | Symptom history |
| `POST` | `/api/ai/predict` | Full disease-risk prediction |
| `POST` | `/api/ai/whatif` | Lifestyle what-if simulation |
| `POST` | `/api/ai/seasonal` | Seasonal / regional risk context |
| `POST` | `/api/medicines/check` | Interaction check |
| `GET` | `/api/report/generate` | PDF download |
| `GET` | `/api/chat/history` | Assistant transcript |
| `POST` | `/api/chat` | Send assistant message |
| `GET` | `/api/chat/insights` | Insights + family tracking for dashboard |
| `DELETE` | `/api/chat/history` | Clear assistant history |

Send `Authorization: Bearer <token>` on protected routes (token from register/login).

---

## Security & privacy notes

- Passwords are stored **in plaintext** in the current codebase (`auth.js`). **Do not use production real passwords** until you add proper hashing (e.g. bcrypt) and secret management.
- **Firestore** holds user data, sessions, logs, predictions, and chat—protect your **service account** and Firebase rules.
- Uploaded symptom photos are stored under **`Backend/uploads`** and referenced by URL; cap size and secure this path in production.

---

## Medical disclaimer

**NoRog is an AI-assisted health intelligence tool, not a medical device and not a substitute for professional diagnosis or treatment.** Always consult a **qualified healthcare professional** for medical decisions, emergencies, and medication changes.

---

## Credits

Built for proactive health awareness — **NoRog**: *your health, predicted—not just treated.*
