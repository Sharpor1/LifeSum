import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

const DB_TABLES = [
  "users", "projects", "project_links", "activities", "logros",
  "activity_completions", "stickers", "custom_stickers", "custom_backgrounds",
];

router.get("/stats", (_req, res) => {
  const db = getDb();
  const counts: Record<string, number> = {};
  for (const t of DB_TABLES) {
    counts[t] = (db.prepare(`SELECT COUNT(*) as c FROM ${t}`).get() as any).c;
  }
  res.json({ name: "LifeSum API", version: "1.0.0", status: "online", uptime: process.uptime(), database: counts });
});

router.get("/table/:name", (req, res) => {
  const db = getDb();
  const name = req.params.name;
  if (!DB_TABLES.includes(name)) {
    res.status(404).json({ error: "Table not found" });
    return;
  }
  const rows = db.prepare(`SELECT * FROM ${name} LIMIT 500`).all();
  const cols = (db.pragma(`table_info(${name})`) as any[]).map((c: any) => c.name);
  res.json({ table: name, columns: cols, rows, count: rows.length });
});

router.post("/query", (req, res) => {
  const db = getDb();
  const { sql } = req.body;
  if (!sql || typeof sql !== "string") {
    res.status(400).json({ error: "sql query required" });
    return;
  }
  const upper = sql.trim().toUpperCase();
  if (!upper.startsWith("SELECT") && !upper.startsWith("PRAGMA")) {
    res.status(403).json({ error: "Only SELECT and PRAGMA allowed" });
    return;
  }
  try {
    const rows = db.prepare(sql).all();
    res.json({ rows, count: rows.length });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", (_req, res) => {
  res.type("html").send(renderAdminPage());
});

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LifeSum Admin</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#0d0b1e;color:#f0eeff;padding:2rem;font-size:14px}
h1{font-size:1.8rem;margin-bottom:0.3rem}
.subtitle{color:#9d8fd4;margin-bottom:1.5rem}
.nav{display:flex;gap:0.75rem;margin:1rem 0 1.5rem;flex-wrap:wrap}
.nav a{padding:0.5rem 1rem;border-radius:8px;background:#2d2448;text-decoration:none;color:#f0eeff;font-size:0.85rem;transition:background 0.2s}
.nav a:hover{background:#3d3468}
.nav a.active{background:#a855f7}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.75rem;margin-bottom:1.5rem}
.card{background:#1a1530;border-radius:10px;padding:1rem;border:1px solid rgba(255,255,255,0.06)}
.card h3{font-size:0.7rem;text-transform:uppercase;color:#9d8fd4;letter-spacing:0.05em;margin-bottom:0.4rem}
.card .value{font-size:1.5rem;font-weight:800}
.status-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:0.4rem}
.online{background:#4ade80;box-shadow:0 0 8px rgba(74,222,128,0.5)}
h2{font-size:1.2rem;margin:1.5rem 0 0.8rem;color:#a855f7}
.tab-btns{display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap}
.tab-btns button{padding:0.4rem 0.8rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:#9d8fd4;font-size:0.8rem;cursor:pointer;transition:all 0.2s}
.tab-btns button:hover{background:rgba(168,85,247,0.15);color:#fff}
.tab-btns button.active{background:#a855f7;color:#fff;border-color:#a855f7}
.table-wrap{overflow-x:auto;background:#1a1530;border-radius:10px;border:1px solid rgba(255,255,255,0.06)}
table{width:100%;border-collapse:collapse;font-size:0.8rem}
th,td{text-align:left;padding:0.5rem 0.75rem;border-bottom:1px solid rgba(255,255,255,0.06);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
th{background:#2d2448;font-size:0.7rem;text-transform:uppercase;color:#9d8fd4;position:sticky;top:0}
tr:hover td{background:rgba(168,85,247,0.08)}
code{background:rgba(255,255,255,0.08);padding:0.15rem 0.4rem;border-radius:4px;font-size:0.8rem;word-break:break-all}
.count-badge{font-size:0.7rem;color:#9d8fd4;margin-left:0.5rem}
.query-area{display:flex;gap:0.5rem;margin-bottom:1rem}
.query-area input{flex:1;padding:0.5rem 0.75rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:#1a1530;color:#f0eeff;font-family:monospace;font-size:0.85rem;outline:none}
.query-area input:focus{border-color:#a855f7}
.query-area button{padding:0.5rem 1rem;border-radius:8px;background:#a855f7;color:#fff;border:none;cursor:pointer;font-size:0.85rem}
.query-area button:hover{background:#9333ea}
.query-error{color:#f87171;font-size:0.85rem;margin-bottom:0.5rem}
.empty-state{text-align:center;padding:2rem;color:#9d8fd4;font-size:0.9rem}
@media(max-width:768px){body{padding:1rem;font-size:13px}}
</style>
</head>
<body>
<h1>🧬 LifeSum Admin</h1>
<p class="subtitle">Panel de administración del backend</p>

<div class="nav">
  <a href="/api">📡 API Docs</a>
  <a href="/api/json">📄 API JSON</a>
</div>

<h2>📊 Estado del servidor</h2>
<div class="grid" id="stats-grid">
  <div class="card"><h3>Estado</h3><div><span class="status-dot online"></span><span class="value">Operativo</span></div></div>
  <div class="card"><h3>Tiempo activo</h3><div class="value" id="uptime">-</div></div>
  <div class="card"><h3>Versión</h3><div class="value">1.0.0</div></div>
</div>

<h2>🗄️ Base de datos</h2>
<div class="grid" id="db-grid"></div>

<h2>🔍 Explorar tablas</h2>
<div class="tab-btns" id="table-tabs"></div>
<div id="table-content"><div class="empty-state">Selecciona una tabla para ver sus datos</div></div>

<h2>⚡ Query personalizada</h2>
<div class="query-area">
  <input id="sql-input" type="text" placeholder="SELECT * FROM projects WHERE ..." spellcheck="false" />
  <button onclick="runQuery()">Ejecutar</button>
</div>
<div id="query-result"></div>

<script>
async function loadStats() {
  try {
    const r = await fetch('/api/admin/stats');
    const d = await r.json();
    document.getElementById('uptime').textContent = formatUptime(d.uptime);
    const grid = document.getElementById('db-grid');
    grid.innerHTML = Object.entries(d.database).map(([k,v]) =>
      '<div class="card"><h3>'+k.replace(/_/g,' ')+'</h3><div class="value">'+v+'</div></div>'
    ).join('');
  } catch {}
}

function formatUptime(s) {
  const d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60);
  return d>0?d+'d '+h+'h '+m+'m':h>0?h+'h '+m+'m':m+'m';
}

const TABLES = ${JSON.stringify(DB_TABLES)};
let currentTable = '';

function renderTabs() {
  const container = document.getElementById('table-tabs');
  container.innerHTML = TABLES.map(t =>
    '<button class="'+(t===currentTable?'active':'')+'" onclick="loadTable(\\''+t+'\\')">'+t+'</button>'
  ).join('');
}

async function loadTable(name) {
  currentTable = name;
  renderTabs();
  const container = document.getElementById('table-content');
  container.innerHTML = '<div class="empty-state">Cargando...</div>';
  try {
    const r = await fetch('/api/admin/table/'+name);
    const d = await r.json();
    if (!d.rows || d.rows.length===0) {
      container.innerHTML = '<div class="empty-state">📭 Tabla vacía</div>';
      return;
    }
    let html = '<div class="table-wrap"><table><thead><tr>';
    d.columns.forEach(c => { html += '<th>'+c+'</th>'; });
    html += '</tr></thead><tbody>';
    d.rows.forEach(row => {
      html += '<tr>';
      d.columns.forEach(c => {
        let val = row[c];
        if (val===null) val = '<span style="color:#666">NULL</span>';
        else if (typeof val==='string' && val.length>80) val = '<code title="'+escapeHtml(val)+'">'+escapeHtml(val.slice(0,80))+'…</code>';
        else val = '<code>'+escapeHtml(String(val))+'</code>';
        html += '<td>'+val+'</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    html += '<p style="margin-top:0.5rem;font-size:0.75rem;color:#9d8fd4">'+d.count+' filas</p>';
    container.innerHTML = html;
  } catch(e) {
    container.innerHTML = '<div class="empty-state">❌ Error: '+e.message+'</div>';
  }
}

async function runQuery() {
  const input = document.getElementById('sql-input');
  const container = document.getElementById('query-result');
  const sql = input.value.trim();
  if (!sql) return;
  container.innerHTML = '<div class="empty-state">Ejecutando...</div>';
  try {
    const r = await fetch('/api/admin/query', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({sql})
    });
    const d = await r.json();
    if (d.error) {
      container.innerHTML = '<div class="query-error">❌ '+escapeHtml(d.error)+'</div>';
      return;
    }
    if (!d.rows || d.rows.length===0) {
      container.innerHTML = '<div class="empty-state">📭 Sin resultados</div>';
      return;
    }
    const cols = Object.keys(d.rows[0]);
    let html = '<div class="table-wrap"><table><thead><tr>';
    cols.forEach(c => { html += '<th>'+c+'</th>'; });
    html += '</tr></thead><tbody>';
    d.rows.forEach(row => {
      html += '<tr>';
      cols.forEach(c => {
        let val = row[c];
        if (val===null) val = '<span style="color:#666">NULL</span>';
        else if (typeof val==='string' && val.length>80) val = '<code title="'+escapeHtml(val)+'">'+escapeHtml(val.slice(0,80))+'…</code>';
        else val = '<code>'+escapeHtml(String(val))+'</code>';
        html += '<td>'+val+'</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    html += '<p style="margin-top:0.5rem;font-size:0.75rem;color:#9d8fd4">'+d.count+' filas</p>';
    container.innerHTML = html;
  } catch(e) {
    container.innerHTML = '<div class="query-error">❌ Error: '+escapeHtml(e.message)+'</div>';
  }
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.getElementById('sql-input').addEventListener('keydown', e => { if(e.key==='Enter') runQuery(); });

loadStats();
renderTabs();
</script>
</body>
</html>`;
}

export default router;
