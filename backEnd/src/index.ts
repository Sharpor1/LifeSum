import express from "express";
import cors from "cors";
import projectsRouter from "./routes/projects.js";
import stickersRouter from "./routes/stickers.js";
import completionsRouter from "./routes/completions.js";
import customStickersRouter from "./routes/customStickers.js";
import backgroundsRouter from "./routes/backgrounds.js";
import adminRouter from "./routes/admin.js";
import authRouter, { authMiddleware, cleanupExpiredUsers } from "./routes/auth.js";
import apiDocsRouter from "./apiDocs.js";
import { runMigrations } from "./migrate.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Aplicar migraciones del esquema al arrancar (crea columnas/tablas faltantes)
runMigrations();

app.use("/api/projects", authMiddleware, projectsRouter);
app.use("/api/stickers", authMiddleware, stickersRouter);
app.use("/api/completions", authMiddleware, completionsRouter);
app.use("/api/custom-stickers", authMiddleware, customStickersRouter);
app.use("/api/backgrounds", authMiddleware, backgroundsRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api", apiDocsRouter);

app.use("/uploads", express.static("uploads"));

app.get("/", (_req, res) => {
  res.redirect("/api/admin");
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(`[LifeSum] ❌ Unhandled error:`, err);
  res.status(500).json({ error: "Internal server error", message: err.message });
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
