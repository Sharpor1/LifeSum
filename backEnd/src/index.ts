import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import projectsRouter from "./routes/projects.js";
import stickersRouter from "./routes/stickers.js";
import completionsRouter from "./routes/completions.js";
import customStickersRouter from "./routes/customStickers.js";
import backgroundsRouter from "./routes/backgrounds.js";
import authRouter, { authMiddleware, cleanupExpiredUsers } from "./routes/auth.js";
import apiDocsRouter from "./apiDocs.js";
import { runMigrations } from "./migrate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

const app = express();
const PORT = process.env.PORT ?? 3001;

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173",
];

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean))
  ?? DEFAULT_ALLOWED_ORIGINS;

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));
app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar migraciones del esquema al arrancar (crea columnas/tablas faltantes)
runMigrations();

app.use("/api", apiLimiter);
app.use("/api/projects", authMiddleware, projectsRouter);
app.use("/api/stickers", authMiddleware, stickersRouter);
app.use("/api/completions", authMiddleware, completionsRouter);
app.use("/api/custom-stickers", authMiddleware, customStickersRouter);
app.use("/api/backgrounds", authMiddleware, backgroundsRouter);
app.use("/api/auth", loginLimiter, authRouter);
app.use("/api", apiDocsRouter);

app.use("/uploads", express.static(UPLOADS_DIR, {
  dotfiles: "deny",
  index: false,
  fallthrough: true,
}));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(`[LifeSum] ❌ Unhandled error:`, err);
  if (err instanceof multer.MulterError || err.message === "Unsupported file type") {
    const status = err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    res.status(status).json({ error: "Invalid file upload" });
    return;
  }
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ error: "Invalid JSON payload" });
    return;
  }
  const message = err.message && err.message.includes("Not allowed by CORS")
    ? "Not allowed by CORS"
    : "Internal server error";
  res.status(500).json({ error: message });
});

const server = app.listen(PORT, () => {
  console.log(`LifeSum backend running at http://localhost:${PORT}`);
});

// Limpia periódicamente las cuentas temporales inactivas (se borran a los
// GUEST_TIMEOUT_SECONDS después de que el cliente abandone la página).
const cleanupInterval = setInterval(() => {
  try {
    const removed = cleanupExpiredUsers();
    if (removed > 0) console.log(`[LifeSum] Limpieza automática: ${removed} cuenta(s) temporal(es) eliminadas.`);
  } catch (err) {
    console.error("[LifeSum] Error en limpieza automática:", err);
  }
}, 5000);

server.on("close", () => clearInterval(cleanupInterval));

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[LifeSum] ❌ Port ${PORT} is already in use. Close the other process or change PORT.`);
  } else {
    console.error(`[LifeSum] ❌ Failed to start server:`, err.message);
  }
});

process.on("unhandledRejection", (reason) => {
  console.error(`[LifeSum] ❌ Unhandled rejection:`, reason);
});
