import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getDb } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "backgrounds");
const UPLOAD_DIR_RESOLVED = path.resolve(UPLOAD_DIR);

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
    const allowedExt = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    const allowedMime = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"];
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeOk = allowedMime.includes(file.mimetype);
    if (allowedExt.includes(ext) && mimeOk) cb(null, true);
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
  const label = String(req.body.label ?? "Fondo personalizado").slice(0, 200);
  const relativePath = `/uploads/backgrounds/${req.file.filename}`;
  db.prepare("INSERT INTO custom_backgrounds (id, user_id, file_path, label) VALUES (?, ?, ?, ?)").run(id, userId, relativePath, label);
  res.status(201).json({ id, filePath: relativePath, label });
});

// DELETE /api/backgrounds/:id — eliminar un fondo (archivo + BD)
router.delete("/:id", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  const bg = db.prepare("SELECT * FROM custom_backgrounds WHERE id = ? AND user_id = ?").get(req.params.id, userId) as any;
  if (bg) {
    const filePath = path.resolve(path.join(UPLOAD_DIR_RESOLVED, path.basename(bg.file_path)));
    if (filePath.startsWith(UPLOAD_DIR_RESOLVED + path.sep)) {
      try { fs.unlinkSync(filePath); } catch {}
    }
  }
  db.prepare("DELETE FROM custom_backgrounds WHERE id = ? AND user_id = ?").run(req.params.id, userId);
  res.json({ ok: true });
});

export default router;
