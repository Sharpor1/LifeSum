import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

// GET /api/stickers — listar todos los stickers
router.get("/", (_req, res) => {
  const db = getDb();
  res.json(db.prepare("SELECT * FROM stickers").all());
});

// POST /api/stickers — crear un sticker
router.post("/", (req, res) => {
  const db = getDb();
  const { id, stickerId, x, y } = req.body;
  if (!id || !stickerId) { res.status(400).json({ error: "id and stickerId are required" }); return; }
  db.prepare("INSERT INTO stickers (id, sticker_id, x, y) VALUES (?, ?, ?, ?)").run(id, stickerId, x ?? 0, y ?? 0);
  res.status(201).json({ ok: true });
});

// PUT /api/stickers/batch — reemplazar TODOS los stickers (sincronización completa)
router.put("/batch", (req, res) => {
  const db = getDb();
  const stickers = req.body as { id: string; stickerId: string; x: number; y: number }[];
  const txn = db.transaction(() => {
    db.prepare("DELETE FROM stickers").run();
    if (stickers?.length) {
      const ins = db.prepare("INSERT INTO stickers (id, sticker_id, x, y) VALUES (?, ?, ?, ?)");
      for (const s of stickers) ins.run(s.id, s.stickerId, s.x, s.y);
    }
  });
  txn();
  res.json({ ok: true });
});

// DELETE /api/stickers/:id — eliminar un sticker
router.delete("/:id", (req, res) => {
  const db = getDb();
  db.prepare("DELETE FROM stickers WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

export default router;
