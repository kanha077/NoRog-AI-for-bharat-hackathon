import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import { getUploadsDir } from "./uploadPaths.js";

// Initialize Firebase first
import "./services/firebaseDB.js";

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import symptomRoutes from "./routes/symptoms.js";
import aiRoutes from "./routes/ai.js";
import medicineRoutes from "./routes/medicines.js";
import reportRoutes from "./routes/report.js";
import chatRoutes from "./routes/chat.js";

const app = express();

const uploadsDir = getUploadsDir();
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const extraOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const defaults = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000"
  ];
  if ([...defaults, ...extraOrigins].includes(origin)) return true;
  if (/^https:\/\/[a-z0-9.-]+\.vercel\.app$/i.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(uploadsDir));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.json({
    name: "NoRog API",
    version: "5.0.0",
    storage: "firebase-firestore",
    status: "running",
    endpoints: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET  /api/profile",
      "POST /api/profile",
      "POST /api/symptoms/log",
      "GET  /api/symptoms/history",
      "POST /api/ai/predict",
      "POST /api/ai/whatif",
      "POST /api/ai/seasonal",
      "POST /api/medicines/check",
      "GET  /api/report/generate"
    ]
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, error: "Internal server error" });
});

export default app;
