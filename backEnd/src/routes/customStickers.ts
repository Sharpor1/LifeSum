import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

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
  db.prepare("INSERT INTO custom_stickers (id, user_id, data_url, label) VALUES (?, ?, ?, ?)").run(id, userId, dataUrl, label ?? "");
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
