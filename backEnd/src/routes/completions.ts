import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

function isValidDateString(s: any): boolean {
  if (typeof s !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00Z"));
}

// GET /api/completions — listar completados del usuario
router.get("/", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  res.json(db.prepare("SELECT * FROM activity_completions WHERE user_id = ?").all(userId));
});

// POST /api/completions — registrar una actividad como completada
router.post("/", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  const { id, activityId, completedAt } = req.body;
  if (!id || !activityId) { res.status(400).json({ error: "id and activityId are required" }); return; }
  if (completedAt !== undefined && !isValidDateString(completedAt)) {
    res.status(400).json({ error: "Invalid completedAt" });
    return;
  }
  const date = isValidDateString(completedAt) ? completedAt : new Date().toISOString().slice(0, 10);
  db.prepare("INSERT INTO activity_completions (id, user_id, activity_id, completed_at) VALUES (?, ?, ?, ?)").run(String(id), userId, String(activityId), date);
  res.status(201).json({ ok: true });
});

// GET /api/completions/today — completados del día de hoy
router.get("/today", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  const today = new Date().toISOString().slice(0, 10);
  res.json(db.prepare("SELECT * FROM activity_completions WHERE user_id = ? AND completed_at = ?").all(userId, today));
});

// GET /api/completions/streak — calcular racha de días consecutivos con completados
router.get("/streak", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  const rows = db.prepare("SELECT DISTINCT completed_at FROM activity_completions WHERE user_id = ? ORDER BY completed_at DESC").all(userId) as { completed_at: string }[];
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
  const userId = (req as any).userId;
  db.prepare("DELETE FROM activity_completions WHERE id = ? AND user_id = ?").run(req.params.id, userId);
  res.json({ ok: true });
});

export default router;
