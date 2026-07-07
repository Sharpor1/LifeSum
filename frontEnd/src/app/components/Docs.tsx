import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { ha } from "../utils";

interface DocsProps {
  dark: boolean;
  acc: string;
  tp: string;
  ts: string;
  gc: string;
  gs: React.CSSProperties;
}

const ENDPOINTS = [
  { method: "GET", path: "/api/projects", desc: "Lista todos los proyectos con actividades, logros y links" },
  { method: "GET", path: "/api/projects/:id", desc: "Obtiene un proyecto específico por ID" },
  { method: "POST", path: "/api/projects", desc: "Crea un nuevo proyecto" },
  { method: "PUT", path: "/api/projects/:id", desc: "Actualiza un proyecto existente" },
  { method: "DELETE", path: "/api/projects/:id", desc: "Elimina un proyecto" },
  { method: "GET", path: "/api/stickers", desc: "Lista todos los stickers" },
  { method: "POST", path: "/api/stickers", desc: "Crea un sticker" },
  { method: "PUT", path: "/api/stickers/batch", desc: "Reemplaza todos los stickers" },
  { method: "DELETE", path: "/api/stickers/:id", desc: "Elimina un sticker" },
  { method: "GET", path: "/api/completions", desc: "Lista todos los completados" },
  { method: "POST", path: "/api/completions", desc: "Registra actividad completada" },
  { method: "GET", path: "/api/completions/today", desc: "Completados de hoy" },
  { method: "GET", path: "/api/completions/streak", desc: "Racha de días completados" },
  { method: "DELETE", path: "/api/completions/:id", desc: "Elimina un completado" },
  { method: "GET", path: "/api/custom-stickers", desc: "Stickers personalizados" },
  { method: "POST", path: "/api/custom-stickers", desc: "Crea sticker personalizado" },
  { method: "DELETE", path: "/api/custom-stickers/:id", desc: "Elimina sticker personalizado" },
  { method: "GET", path: "/api/backgrounds", desc: "Fondos personalizados" },
  { method: "POST", path: "/api/backgrounds/upload", desc: "Sube un fondo" },
  { method: "DELETE", path: "/api/backgrounds/:id", desc: "Elimina un fondo" },
  { method: "GET", path: "/api/admin", desc: "Panel de administración" },
  { method: "GET", path: "/api/json", desc: "Estado del servidor en JSON" },
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

const methodColors: Record<string, string> = {
  GET: "#4ade80", POST: "#60a5fa", PUT: "#c084fc", DELETE: "#f87171",
};

export default function Docs({ dark, acc, tp, ts, gc, gs }: DocsProps) {
  return (
    <motion.div key="docs"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full overflow-y-auto p-5">
      <h1 className={`text-2xl font-bold mb-1 ${tp}`}>🧬 LifeSum API</h1>
      <p className={`text-sm mb-4 ${ts}`}>
        Backend RESTful — {" "}
        <a href="/api" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors" style={{ color: acc }}>
          Ver documentación interactiva <ExternalLink size={12} className="inline" />
        </a>
      </p>

      <section className={`mb-5 rounded-2xl ${gc} p-5`} style={gs}>
        <h2 className={`font-semibold mb-3 ${tp}`}>📡 Endpoints disponibles</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b border-white/10 ${ts}`}>
                <th className="text-left py-2 pr-3 font-medium text-[11px] uppercase">Método</th>
                <th className="text-left py-2 pr-3 font-medium text-[11px] uppercase">Ruta</th>
                <th className="text-left py-2 font-medium text-[11px] uppercase">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((ep, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="py-2 pr-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: ha(methodColors[ep.method], 0.2), color: methodColors[ep.method] }}>
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-2 pr-3 font-mono text-xs" style={{ color: dark ? "#e0e0e0" : "#333" }}>
                    {ep.path}
                  </td>
                  <td className="py-2 text-xs" style={{ color: dark ? "#aaa" : "#666" }}>{ep.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`mb-5 rounded-2xl ${gc} p-5`} style={gs}>
        <h2 className={`font-semibold mb-3 ${tp}`}>🗄️ Esquema de base de datos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b border-white/10 ${ts}`}>
                <th className="text-left py-2 pr-3 font-medium text-[11px] uppercase">Tabla</th>
                <th className="text-left py-2 font-medium text-[11px] uppercase">Columnas</th>
              </tr>
            </thead>
            <tbody>
              {DB_TABLES.map((t, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="py-2 pr-3 text-xs font-semibold" style={{ color: dark ? "#e0e0e0" : "#333" }}>{t.name}</td>
                  <td className="py-2">
                    <div className="flex gap-1 flex-wrap">
                      {t.cols.map((c, j) => (
                        <span key={j} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: ha(acc, 0.12), color: dark ? "#ccc" : "#555" }}>{c}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`rounded-2xl ${gc} p-5`} style={gs}>
        <h2 className={`font-semibold mb-2 ${tp}`}>🔧 Tecnologías</h2>
        <div className="flex gap-2 flex-wrap">
          {["Express", "SQLite (better-sqlite3)", "TypeScript", "Multer (uploads)", "CORS", "tsx (dev)"].map((t, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full border border-white/15" style={{ color: dark ? "#ccc" : "#555" }}>{t}</span>
          ))}
        </div>
        <p className={`text-xs mt-3 ${ts}`}>
          Base URL: <code className="px-2 py-0.5 rounded" style={{ backgroundColor: ha(acc, 0.15), color: acc }}>http://localhost:3001</code>
        </p>
      </section>
    </motion.div>
  );
}
