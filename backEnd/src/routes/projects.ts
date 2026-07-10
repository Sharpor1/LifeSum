import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

// Convierte una fila de la BD (con sus relaciones) al formato JSON del frontend
function rowToProject(row: any, links: any[], activities: any[], logros: any[]) {
  const projectLogros = logros
    .filter((l: any) => l.owner_type === "project" && l.owner_id === row.id)
    .map(mapLogro);

  return {
    id: row.id,
    name: row.name,
    color: row.color,
    emoji: row.emoji,
    description: row.description,
    links: links.filter((l: any) => l.project_id === row.id).map((l: any) => ({
      id: l.id, label: l.label, url: l.url,
    })),
    activities: activities
      .filter((a: any) => a.project_id === row.id)
      .map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        hours: a.hours,
        day: a.day ?? undefined,
        startHour: a.start_hour ?? undefined,
        regularity: a.regularity,
        priority: a.priority,
        projectId: a.project_id,
        noteColor: a.note_color,
        schedWeek: a.sched_week ?? undefined,
        semiWeeks: a.semi_weeks ?? undefined,
        semiTarget: a.semi_target ?? undefined,
        semiCompletions: a.semi_completions ?? undefined,
        logros: logros
          .filter((l: any) => l.owner_type === "activity" && l.owner_id === a.id)
          .map(mapLogro),
      })),
    logros: projectLogros,
  };
}

// Mapea una fila de logros de la BD al formato del frontend
function mapLogro(l: any) {
  return {
    id: l.id,
    title: l.title,
    icon: l.icon,
    completed: Boolean(l.completed),
    current: l.current ?? undefined,
    target: l.target ?? undefined,
    triggerActivityId: l.trigger_activity_id ?? undefined,
    triggerCount: l.trigger_count ?? undefined,
  };
}

// GET /api/projects — lista todos los proyectos con sus relaciones
router.get("/", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  const projects = db.prepare("SELECT * FROM projects WHERE user_id = ?").all(userId);
  const links = db.prepare("SELECT * FROM project_links").all();
  const activities = db.prepare("SELECT * FROM activities").all();
  const logros = db.prepare("SELECT * FROM logros").all();

  const result = projects.map((p: any) => rowToProject(p, links, activities, logros));
  res.json(result);
});

// GET /api/projects/:id — obtiene un proyecto específico
router.get("/:id", (req, res) => {
  const db = getDb();
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!project) { res.status(404).json({ error: "Project not found" }); return; }

  const links = db.prepare("SELECT * FROM project_links WHERE project_id = ?").all(req.params.id);
  const activities = db.prepare("SELECT * FROM activities WHERE project_id = ?").all(req.params.id);
  const activityIds = (activities as any[]).map((a: any) => a.id);
  let logros: any[] = [];
  if (activityIds.length > 0) {
    const placeholders = activityIds.map(() => "?").join(",");
    logros = db.prepare(`SELECT * FROM logros WHERE (owner_type = 'project' AND owner_id = ?) OR (owner_type = 'activity' AND owner_id IN (${placeholders}))`).all(req.params.id, ...activityIds);
  } else {
    logros = db.prepare("SELECT * FROM logros WHERE owner_type = 'project' AND owner_id = ?").all(req.params.id);
  }

  res.json(rowToProject(project, links, activities, logros));
});

// POST /api/projects — crea un proyecto con actividades, logros y links (transaccional)
router.post("/", (req, res) => {
  const db = getDb();
  const userId = (req as any).userId;
  const p = req.body;
  if (!p.id || !p.name) { res.status(400).json({ error: "id and name are required" }); return; }

  const txn = db.transaction(() => {
    db.prepare("INSERT INTO projects (id, user_id, name, color, emoji, description) VALUES (?, ?, ?, ?, ?, ?)").run(p.id, userId, p.name, p.color || "#a855f7", p.emoji || "📦", p.description || "");

    if (p.links?.length) {
      const ins = db.prepare("INSERT INTO project_links (id, project_id, label, url) VALUES (?, ?, ?, ?)");
      for (const link of p.links) {
        ins.run(link.id, p.id, link.label, link.url);
      }
    }

    if (p.logros?.length) {
      const ins = db.prepare("INSERT INTO logros (id, owner_type, owner_id, title, icon, completed, current, target, trigger_activity_id, trigger_count) VALUES (?, 'project', ?, ?, ?, ?, ?, ?, ?, ?)");
      for (const l of p.logros) {
        ins.run(l.id, p.id, l.title, l.icon || "🏆", l.completed ? 1 : 0, l.current ?? null, l.target ?? null, l.triggerActivityId ?? null, l.triggerCount ?? null);
      }
    }

    if (p.activities?.length) {
      const insAct = db.prepare("INSERT INTO activities (id, project_id, title, description, hours, day, start_hour, regularity, priority, note_color, sched_week, semi_weeks, semi_target, semi_completions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      const insLogro = db.prepare("INSERT INTO logros (id, owner_type, owner_id, title, icon, completed, current, target, trigger_activity_id, trigger_count) VALUES (?, 'activity', ?, ?, ?, ?, ?, ?, ?, ?)");
      for (const a of p.activities) {
        insAct.run(a.id, p.id, a.title, a.description || "", a.hours, a.day ?? null, a.startHour ?? null, a.regularity, a.priority, a.noteColor, a.schedWeek ?? 0, a.semiWeeks ?? null, a.semiTarget ?? null, a.semiCompletions ?? 0);
        if (a.logros?.length) {
          for (const l of a.logros) {
            insLogro.run(l.id, a.id, l.title, l.icon || "🏆", l.completed ? 1 : 0, l.current ?? null, l.target ?? null, l.triggerActivityId ?? null, l.triggerCount ?? null);
          }
        }
      }
    }
  });

  txn();

  // Devolver el proyecto recién creado con todas sus relaciones
  const links = db.prepare("SELECT * FROM project_links WHERE project_id = ?").all(p.id);
  const activities = db.prepare("SELECT * FROM activities WHERE project_id = ?").all(p.id);
  const activityIds = (activities as any[]).map((a: any) => a.id);
  let logros: any[] = [];
  if (activityIds.length > 0) {
    const placeholders = activityIds.map(() => "?").join(",");
    logros = db.prepare(`SELECT * FROM logros WHERE (owner_type = 'project' AND owner_id = ?) OR (owner_type = 'activity' AND owner_id IN (${placeholders}))`).all(p.id, ...activityIds);
  } else {
    logros = db.prepare("SELECT * FROM logros WHERE owner_type = 'project' AND owner_id = ?").all(p.id);
  }

  res.status(201).json(rowToProject(db.prepare("SELECT * FROM projects WHERE id = ?").get(p.id), links, activities, logros));
});

// PUT /api/projects/:id — actualiza un proyecto completo (borra y reinserta relaciones)
router.put("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM projects WHERE id = ?").get(req.params.id);
  if (!existing) { res.status(404).json({ error: "Project not found" }); return; }

  const p = req.body;
  const txn = db.transaction(() => {
    db.prepare("UPDATE projects SET name = ?, color = ?, emoji = ?, description = ? WHERE id = ?")
      .run(p.name, p.color, p.emoji, p.description, req.params.id);

    // Reemplazar links
    db.prepare("DELETE FROM project_links WHERE project_id = ?").run(req.params.id);
    if (p.links?.length) {
      const ins = db.prepare("INSERT INTO project_links (id, project_id, label, url) VALUES (?, ?, ?, ?)");
      for (const link of p.links) {
        ins.run(link.id, req.params.id, link.label, link.url);
      }
    }

    // Reemplazar actividades y sus logros
    const oldActivityIds = (db.prepare("SELECT id FROM activities WHERE project_id = ?").all(req.params.id) as any[]).map((a: any) => a.id);
    if (oldActivityIds.length) {
      const placeholders = oldActivityIds.map(() => "?").join(",");
      db.prepare(`DELETE FROM logros WHERE owner_type = 'activity' AND owner_id IN (${placeholders})`).run(...oldActivityIds);
    }
    db.prepare("DELETE FROM logros WHERE owner_type = 'project' AND owner_id = ?").run(req.params.id);
    db.prepare("DELETE FROM activities WHERE project_id = ?").run(req.params.id);

    if (p.logros?.length) {
      const ins = db.prepare("INSERT INTO logros (id, owner_type, owner_id, title, icon, completed, current, target, trigger_activity_id, trigger_count) VALUES (?, 'project', ?, ?, ?, ?, ?, ?, ?, ?)");
      for (const l of p.logros) {
        ins.run(l.id, req.params.id, l.title, l.icon || "🏆", l.completed ? 1 : 0, l.current ?? null, l.target ?? null, l.triggerActivityId ?? null, l.triggerCount ?? null);
      }
    }

    if (p.activities?.length) {
      const insAct = db.prepare("INSERT INTO activities (id, project_id, title, description, hours, day, start_hour, regularity, priority, note_color, sched_week, semi_weeks, semi_target, semi_completions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      const insLogro = db.prepare("INSERT INTO logros (id, owner_type, owner_id, title, icon, completed, current, target, trigger_activity_id, trigger_count) VALUES (?, 'activity', ?, ?, ?, ?, ?, ?, ?, ?)");
      for (const a of p.activities) {
        insAct.run(a.id, req.params.id, a.title, a.description || "", a.hours, a.day ?? null, a.startHour ?? null, a.regularity, a.priority, a.noteColor, a.schedWeek ?? 0, a.semiWeeks ?? null, a.semiTarget ?? null, a.semiCompletions ?? 0);
        if (a.logros?.length) {
          for (const l of a.logros) {
            insLogro.run(l.id, a.id, l.title, l.icon || "🏆", l.completed ? 1 : 0, l.current ?? null, l.target ?? null, l.triggerActivityId ?? null, l.triggerCount ?? null);
          }
        }
      }
    }
  });

  txn();

  // Devolver el proyecto actualizado
  const links = db.prepare("SELECT * FROM project_links WHERE project_id = ?").all(req.params.id);
  const activities = db.prepare("SELECT * FROM activities WHERE project_id = ?").all(req.params.id);
  const activityIds = (activities as any[]).map((a: any) => a.id);
  let logros: any[] = [];
  if (activityIds.length > 0) {
    const placeholders = activityIds.map(() => "?").join(",");
    logros = db.prepare(`SELECT * FROM logros WHERE (owner_type = 'project' AND owner_id = ?) OR (owner_type = 'activity' AND owner_id IN (${placeholders}))`).all(req.params.id, ...activityIds);
  } else {
    logros = db.prepare("SELECT * FROM logros WHERE owner_type = 'project' AND owner_id = ?").all(req.params.id);
  }

  res.json(rowToProject(db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id), links, activities, logros));
});

// DELETE /api/projects/:id — elimina un proyecto (CASCADE se encarga de relaciones)
router.delete("/:id", (req, res) => {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM projects WHERE id = ?").get(req.params.id);
  if (!existing) { res.status(404).json({ error: "Project not found" }); return; }

  db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

export default router;
