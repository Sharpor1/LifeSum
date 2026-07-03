import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

router.get("/", (_req, res) => {
  const db = getDb();
  res.json(db.prepare("SELECT * FROM custom_stickers").all());
});

router.post("/", (req, res) => {
  const db = getDb();
  const { id, dataUrl, label } = req.body;
  if (!id || !dataUrl) { res.status(400).json({ error: "id and dataUrl are required" }); return; }
  db.prepare("INSERT INTO custom_stickers (id, data_url, label) VALUES (?, ?, ?)").run(id, dataUrl, label ?? "");
  res.status(201).json({ ok: true });
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  db.prepare("DELETE FROM custom_stickers WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

export default router;
