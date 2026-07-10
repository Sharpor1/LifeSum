import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

// GET /api/stickers — listar stickers del usuario
router.get("/", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  res.json(db.prepare("SELECT id, sticker_id as stickerId, x, y FROM stickers WHERE user_id = ?").all(userId));
});

// POST /api/stickers — crear un sticker
router.post("/", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  const { id, stickerId, x, y } = req.body;
  if (!id || !stickerId) { res.status(400).json({ error: "id and stickerId are required" }); return; }
  db.prepare("INSERT INTO stickers (id, user_id, sticker_id, x, y) VALUES (?, ?, ?, ?, ?)").run(id, userId, stickerId, x ?? 0, y ?? 0);
  res.status(201).json({ ok: true });
});

// PUT /api/stickers/batch — reemplazar TODOS los stickers del usuario
router.put("/batch", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  const stickers = req.body as { id: string; stickerId: string; x: number; y: number }[];
  const txn = db.transaction(() => {
    db.prepare("DELETE FROM stickers WHERE user_id = ?").run(userId);
    if (stickers?.length) {
      const ins = db.prepare("INSERT INTO stickers (id, user_id, sticker_id, x, y) VALUES (?, ?, ?, ?, ?)");
      for (const s of stickers) ins.run(s.id, userId, s.stickerId, s.x, s.y);
    }
  });
  txn();
  res.json({ ok: true });
});

// DELETE /api/stickers/:id — eliminar un sticker
router.delete("/:id", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  db.prepare("DELETE FROM stickers WHERE id = ? AND user_id = ?").run(req.params.id, userId);
  res.json({ ok: true });
});

export default router;
