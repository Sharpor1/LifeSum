import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

const MAX_DATA_URL_BYTES = 700 * 1024; // ~700 KB en base64 (dentro del límite de 1MB del body JSON)

function isValidImageDataUrl(dataUrl: string): boolean {
  if (typeof dataUrl !== "string") return false;
  if (dataUrl.length > MAX_DATA_URL_BYTES) return false;
  if (!dataUrl.startsWith("data:image/")) return false;
  const match = /^data:image\/(png|jpeg|jpg|gif|webp|bmp);base64,/.exec(dataUrl);
  return Boolean(match);
}

// GET /api/custom-stickers — listar stickers personalizados del usuario
router.get("/", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  res.json(db.prepare("SELECT id, data_url as dataUrl, label FROM custom_stickers WHERE user_id = ?").all(userId));
});

// POST /api/custom-stickers — crear un sticker personalizado (base64)
router.post("/", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  const { id, dataUrl, label } = req.body;
  if (!id || !dataUrl) { res.status(400).json({ error: "id and dataUrl are required" }); return; }
  if (!isValidImageDataUrl(dataUrl)) { res.status(400).json({ error: "Invalid image data URL or too large (max 2MB)" }); return; }
  db.prepare("INSERT INTO custom_stickers (id, user_id, data_url, label) VALUES (?, ?, ?, ?)").run(id, userId, dataUrl, String(label ?? "").slice(0, 100));
  res.status(201).json({ ok: true });
});

// DELETE /api/custom-stickers/:id — eliminar un sticker personalizado
router.delete("/:id", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  db.prepare("DELETE FROM custom_stickers WHERE id = ? AND user_id = ?").run(req.params.id, userId);
  res.json({ ok: true });
});

export default router;
