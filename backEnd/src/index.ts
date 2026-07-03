import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import projectsRouter from "./routes/projects.js";
import stickersRouter from "./routes/stickers.js";
import completionsRouter from "./routes/completions.js";
import customStickersRouter from "./routes/customStickers.js";
import backgroundsRouter from "./routes/backgrounds.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/projects", projectsRouter);
app.use("/api/stickers", stickersRouter);
app.use("/api/completions", completionsRouter);
app.use("/api/custom-stickers", customStickersRouter);
app.use("/api/backgrounds", backgroundsRouter);

const uploadsPath = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsPath));

const frontendDist = path.join(__dirname, "..", "..", "frontEnd", "dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`LifeSum backend running at http://localhost:${PORT}`);
});
