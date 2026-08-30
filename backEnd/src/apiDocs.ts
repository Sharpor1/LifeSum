import { Router } from "express";
import { getDb } from "./db.js";

const router = Router();

//── Listado de endpoints disponibles ──

const ENDPOINTS = [
  { method: "GET", path: "/api/projects", desc: "Lista todos los proyectos con actividades, logros y links" },
  { method: "GET", path: "/api/projects/:id", desc: "Obtiene un proyecto específico por ID" },
  { method: "POST", path: "/api/projects", desc: "Crea un nuevo proyecto (body: id, name, color, emoji, description, activities[], logros[], links[])" },
  { method: "PUT", path: "/api/projects/:id", desc: "Actualiza un proyecto existente" },
  { method: "DELETE", path: "/api/projects/:id", desc: "Elimina un proyecto" },
  { method: "GET", path: "/api/stickers", desc: "Lista todos los stickers" },
  { method: "POST", path: "/api/stickers", desc: "Crea un sticker (body: id, stickerId, x, y)" },
  { method: "PUT", path: "/api/stickers/batch", desc: "Reemplaza todos los stickers (body: array de stickers)" },
  { method: "DELETE", path: "/api/stickers/:id", desc: "Elimina un sticker" },
  { method: "GET", path: "/api/completions", desc: "Lista todos los completados de actividades" },
  { method: "POST", path: "/api/completions", desc: "Registra una actividad completada (body: id, activityId, completedAt?)" },
  { method: "GET", path: "/api/completions/today", desc: "Obtiene los completados de hoy" },
  { method: "GET", path: "/api/completions/streak", desc: "Obtiene la racha actual de días completados" },
  { method: "DELETE", path: "/api/completions/:id", desc: "Elimina un registro de completado" },
  { method: "GET", path: "/api/custom-stickers", desc: "Lista los stickers personalizados" },
  { method: "POST", path: "/api/custom-stickers", desc: "Crea un sticker personalizado (body: id, dataUrl, label)" },
  { method: "DELETE", path: "/api/custom-stickers/:id", desc: "Elimina un sticker personalizado" },
  { method: "GET", path: "/api/backgrounds", desc: "Lista los fondos personalizados" },
  { method: "POST", path: "/api/backgrounds/upload", desc: "Sube un fondo (multipart: background file, label?)" },
  { method: "DELETE", path: "/api/backgrounds/:id", desc: "Elimina un fondo" },
];

const DB_TABLES = [
  { name: "users", cols: ["id", "username", "is_dark", "bg_type", "bg_image", "bg_color", "accent_color", "card_color", "card_alpha", "notifications", "print_bg", "font_size"] },
  { name: "projects", cols: ["id", "user_id", "name", "color", "emoji", "description"] },
  { name: "project_links", cols: ["id", "project_id", "label", "url"] },
  { name: "activities", cols: ["id", "project_id", "title", "description", "hours", "day", "start_hour", "regularity", "priority", "note_color", "sched_week", "semi_weeks", "semi_target", "semi_completions"] },
  { name: "logros", cols: ["id", "owner_type", "owner_id", "title", "icon", "completed", "current", "target", "trigger_activity_id", "trigger_count"] },
  { name: "activity_completions", cols: ["id", "user_id", "activity_id", "completed_at"] },
  { name: "stickers", cols: ["id", "user_id", "sticker_id", "x", "y"] },
  { name: "custom_stickers", cols: ["id", "user_id", "data_url", "label"] },
  { name: "custom_backgrounds", cols: ["id", "user_id", "file_path", "label"] },
];

function renderPage(): string {
  const rows = ENDPOINTS.map(e => `
    <tr>
      <td class="method method-${e.method.toLowerCase()}">${e.method}</td>
      <td><code>${e.path}</code></td>
      <td>${e.desc}</td>
    </tr>`).join("");

  const tableRows = DB_TABLES.map(t => `
    <tr>
      <td><strong>${t.name}</strong></td>
      <td><code>${t.cols.join(", ")}</code></td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LifeSum API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0d0b1e;
      color: #f0eeff;
      padding: 2rem;
    }
    h1 {
      font-size: 2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    h1 span { font-size: 2rem; }
    .subtitle {
      color: #9d8fd4;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }
    h2 {
      font-size: 1.3rem;
      margin: 2rem 0 1rem;
      color: #a855f7;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #1a1530;
      border-radius: 12px;
      overflow: hidden;
    }
    th, td {
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    th {
      background: #2d2448;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9d8fd4;
    }
    tr:hover td { background: rgba(168,85,247,0.08); }
    code {
      background: rgba(255,255,255,0.08);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
    }
    .method {
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
      text-align: center;
      min-width: 60px;
    }
    .method-get { background: #1a3a2a; color: #4ade80; }
    .method-post { background: #1a2a3a; color: #60a5fa; }
    .method-put { background: #2a1a3a; color: #c084fc; }
    .method-delete { background: #3a1a1a; color: #f87171; }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-top: 1.5rem;
    }
    .status-online { background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
    .status span { font-size: 1.2rem; }
    a { color: #a855f7; }
    a:hover { color: #c084fc; }
    .nav-links { display: flex; gap: 1rem; margin: 1rem 0 2rem; }
    .nav-links a {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      background: #2d2448;
      text-decoration: none;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .nav-links a:hover { background: #3d3468; }
    @media (max-width: 768px) {
      body { padding: 1rem; }
      table { font-size: 0.8rem; }
      th, td { padding: 0.5rem; }
    }
  </style>
</head>
<body>
  <h1><span>🧬</span> LifeSum API</h1>
  <p class="subtitle">Backend de la aplicación LifeSum — Documentación de endpoints</p>

  <div class="nav-links">
    <a href="#endpoints">📡 Endpoints</a>
    <a href="#database">🗄️ Base de datos</a>
    <a href="#status">🔌 Estado</a>
  </div>

  <h2 id="endpoints">📡 Endpoints disponibles</h2>
  <table>
    <thead><tr><th>Método</th><th>Ruta</th><th>Descripción</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <h2 id="database">🗄️ Esquema de base de datos</h2>
  <table>
    <thead><tr><th>Tabla</th><th>Columnas</th></tr></thead>
    <tbody>${tableRows}</tbody>
  </table>

  <h2 id="status">🔌 Estado del servidor</h2>
  <div class="status status-online"><span>🟢</span> Servidor operativo</div>
</body>
</html>`;
}

router.get("/", (_req, res) => {
  res.type("html").send(renderPage());
});

router.get("/json", (_req, res) => {
  const db = getDb();
  const projectCount = (db.prepare("SELECT COUNT(*) as c FROM projects").get() as any).c;
  const activityCount = (db.prepare("SELECT COUNT(*) as c FROM activities").get() as any).c;
  const completionCount = (db.prepare("SELECT COUNT(*) as c FROM activity_completions").get() as any).c;

  res.json({
    name: "LifeSum API",
    version: "1.0.0",
    status: "online",
    endpoints: ENDPOINTS.map(e => ({ ...e })),
    database: {
      tables: DB_TABLES,
      stats: {
        projects: projectCount,
        activities: activityCount,
        completions: completionCount,
      },
    },
  });
});

export default router;
