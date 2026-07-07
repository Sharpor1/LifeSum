import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

// GET /api/completions — listar todos los completados
router.get("/", (_req, res) => {
  const db = getDb();
  res.json(db.prepare("SELECT * FROM activity_completions").all());
});

// POST /api/completions — registrar una actividad como completada
router.post("/", (req, res) => {
  const db = getDb();
  const { id, activityId, completedAt } = req.body;
  if (!id || !activityId) { res.status(400).json({ error: "id and activityId are required" }); return; }
  const date = completedAt ?? new Date().toISOString().slice(0, 10);
  db.prepare("INSERT INTO activity_completions (id, activity_id, completed_at) VALUES (?, ?, ?)").run(id, activityId, date);
  res.status(201).json({ ok: true });
});

// GET /api/completions/today — completados del día de hoy
router.get("/today", (_req, res) => {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  res.json(db.prepare("SELECT * FROM activity_completions WHERE completed_at = ?").all(today));
});

// GET /api/completions/streak — calcular racha de días consecutivos con completados
router.get("/streak", (_req, res) => {
  const db = getDb();
  const rows = db.prepare("SELECT DISTINCT completed_at FROM activity_completions ORDER BY completed_at DESC").all() as { completed_at: string }[];
  let streak = 0;
  const d = new Date();
  const today = d.toISOString().slice(0, 10);
  const dates = rows.map((r: any) => r.completed_at);
  if (!dates.includes(today)) d.setDate(d.getDate() - 1);
  for (let i = 0; i < 365; i++) {
    if (dates.includes(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  res.json({ streak });
});

// DELETE /api/completions/:id — eliminar un registro de completado
router.delete("/:id", (req, res) => {
  const db = getDb();
  db.prepare("DELETE FROM activity_completions WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

export default router;
