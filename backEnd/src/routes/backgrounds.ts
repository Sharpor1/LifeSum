import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getDb } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "backgrounds");

// Asegurar que el directorio de uploads existe
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Configuración de multer: almacenamiento en disco
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },    // Máx 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Unsupported file type"));
  },
});

const router = Router();

// GET /api/backgrounds — listar fondos personalizados del usuario
router.get("/", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  res.json(db.prepare("SELECT id, file_path as filePath, label FROM custom_backgrounds WHERE user_id = ?").all(userId));
});

// POST /api/backgrounds/upload — subir un fondo (multipart)
router.post("/upload", upload.single("background"), (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  const db = getDb();
  const userId = (req as any).userId;
  const id = Math.random().toString(36).slice(2, 9);
  const relativePath = `/uploads/backgrounds/${req.file.filename}`;
  db.prepare("INSERT INTO custom_backgrounds (id, user_id, file_path, label) VALUES (?, ?, ?, ?)").run(id, userId, relativePath, req.body.label ?? "Fondo personalizado");
  res.status(201).json({ id, filePath: relativePath, label: req.body.label ?? "Fondo personalizado" });
});

// DELETE /api/backgrounds/:id — eliminar un fondo (archivo + BD)
router.delete("/:id", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  const bg = db.prepare("SELECT * FROM custom_backgrounds WHERE id = ? AND user_id = ?").get(req.params.id, userId) as any;
  if (bg) {
    const fullPath = path.join(__dirname, "..", "..", bg.file_path);
    try { fs.unlinkSync(fullPath); } catch {}
  }
  db.prepare("DELETE FROM custom_backgrounds WHERE id = ? AND user_id = ?").run(req.params.id, userId);
  res.json({ ok: true });
});

export default router;
