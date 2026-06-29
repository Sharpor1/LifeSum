import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Palette, Bell, Trophy, Plus, Trash2, X, Check, Type,
  ChevronDown, ChevronUp
} from "lucide-react";
import type { Activity, AppCfg, Logro, Project } from "../types";
import { ha } from "../utils";
import { PROJ_COLORS, EMOJIS } from "../constants";
import AddLogroForm from "./AddLogroForm";

interface SettingsProps {
  cfg: AppCfg;
  upCfg: (patch: Partial<AppCfg>) => void;
  projects: Project[];
  setProjects: (ps: Project[] | ((prev: Project[]) => Project[])) => void;
  allActs: Activity[];
  openModal: (k: "addProject" | null, preset?: Record<string, unknown>) => void;
  toggleProjectLogro: (projId: string, logroId: string) => void;
  dark: boolean; acc: string; tp: string; ts: string; gc: string; gs: React.CSSProperties;
}

export default function Settings({
  cfg, upCfg, projects, setProjects, allActs, openModal, toggleProjectLogro,
  dark, acc, tp, ts, gc, gs,
}: SettingsProps) {
  const [bgInput, setBgInput] = useState(cfg.bgImage);
  const [logrosProjId, setLogrosProjId] = useState<string | null>(null);

  return (
    <motion.div key="set"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full overflow-y-auto p-5">
      <h1 className={`text-2xl font-bold mb-5 ${tp}`}>Ajustes</h1>

      <section className={`mb-4 rounded-2xl ${gc} p-5`} style={gs}>
        <div className="flex items-center gap-2 mb-4"><User size={15} style={{ color: acc }} /><h2 className={`font-semibold ${tp}`}>Perfil</h2></div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: acc }}>
            {cfg.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <label className={`text-[11px] ${ts} block mb-1`}>Nombre de usuario</label>
            <input value={cfg.username} onChange={e => upCfg({ username: e.target.value })}
              className={`w-full px-3 py-1.5 rounded-xl text-sm ${gc} ${tp} outline-none`} style={gs} placeholder="Tu nombre..." />
          </div>
        </div>
      </section>

      <section className={`mb-4 rounded-2xl ${gc} p-5`} style={gs}>
        <div className="flex items-center gap-2 mb-4"><Palette size={15} style={{ color: acc }} /><h2 className={`font-semibold ${tp}`}>Apariencia</h2></div>
        <div className="flex items-center justify-between mb-5">
          <div><p className={`text-sm font-medium ${tp}`}>Modo oscuro</p></div>
          <button onClick={() => upCfg({ isDark: !dark })}
            className="w-11 h-6 rounded-full flex items-center px-0.5 transition-all cursor-pointer"
            style={{ backgroundColor: dark ? acc : "rgba(200,200,200,0.4)", justifyContent: dark ? "flex-end" : "flex-start" }}>
            <div className="w-5 h-5 rounded-full bg-white shadow" />
          </button>
        </div>
        <div className="mb-5">
          <p className={`text-sm font-medium ${tp} mb-2`}>Color de acento</p>
          <div className="flex gap-2 flex-wrap items-center">
            {["#a855f7", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#3b82f6", "#f97316"].map(c => (
              <button key={c} onClick={() => upCfg({ accentColor: c })}
                className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110"
                style={{ backgroundColor: c, outline: acc === c ? "3px solid white" : "none", outlineOffset: 2 }} />
            ))}
            <input type="color" value={acc} onChange={e => upCfg({ accentColor: e.target.value })}
              className="w-7 h-7 rounded-full cursor-pointer border-0 p-0" />
          </div>
        </div>
        <div className="mb-5">
          <p className={`text-sm font-medium ${tp} mb-2`}>Color de cuadros</p>
          <div className="flex items-center gap-3 flex-wrap">
            {["#ffffff", "#1a1a2e", "#0d1b2a", "#1e1b4b", "#064e3b", "#1c1917"].map(c => (
              <button key={c} onClick={() => upCfg({ cardColor: c })}
                className="w-7 h-7 rounded-lg cursor-pointer transition-transform hover:scale-110 border border-white/30"
                style={{ backgroundColor: c, outline: cfg.cardColor === c ? "3px solid white" : "none", outlineOffset: 2 }} />
            ))}
            <input type="color" value={cfg.cardColor} onChange={e => upCfg({ cardColor: e.target.value })}
              className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0" />
            <div className="flex items-center gap-2">
              <span className={`text-xs ${ts}`}>Opacidad</span>
              <input type="range" min="0.04" max="0.98" step="0.02" value={cfg.cardAlpha}
                onChange={e => upCfg({ cardAlpha: Number(e.target.value) })}
                className="w-20 cursor-pointer" style={{ accentColor: acc }} />
              <span className={`text-xs font-mono ${ts} w-8`}>{Math.round(cfg.cardAlpha * 100)}%</span>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <p className={`text-sm font-medium ${tp} mb-2`}>Fondo</p>
          <div className="flex gap-1.5 mb-3">
            {(["image", "color"] as const).map(t => (
              <button key={t} onClick={() => upCfg({ bgType: t })}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer border border-white/20 ${cfg.bgType === t ? "text-white" : ts}`}
                style={cfg.bgType === t ? { backgroundColor: ha(acc, 0.5) } : {}}>
                {t === "image" ? "🖼 Imagen" : "🎨 Color sólido"}
              </button>
            ))}
          </div>
          {cfg.bgType === "image" ? (
            <>
              <div className="flex gap-2 mb-2">
                <input value={bgInput} onChange={e => setBgInput(e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-xl text-xs ${gc} ${tp} outline-none`} style={gs} placeholder="URL..." />
                <button onClick={() => upCfg({ bgImage: bgInput })}
                  className="px-3 py-1.5 rounded-xl text-xs text-white font-medium cursor-pointer" style={{ backgroundColor: acc }}>Aplicar</button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  ["https://images.unsplash.com/photo-1464802686167-b939a6910659", "Galaxia"],
                  ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a", "Nebulosa"],
                  ["https://images.unsplash.com/photo-1534796636912-3b95b3ab5986", "Espacio"],
                  ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4", "Montañas"],
                  ["https://images.unsplash.com/photo-1519681393784-d120267933ba", "Noche"],
                  ["https://images.unsplash.com/photo-1520034475321-cbe63696469a", "Aurora"],
                ].map(([base, label]) => (
                  <button key={base}
                    onClick={() => { const u = `${base}?w=1920&h=1080&fit=crop&auto=format`; setBgInput(u); upCfg({ bgImage: u }); }}
                    className="h-14 rounded-xl overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-white"
                    style={{ backgroundImage: `url(${base}?w=400&h=200&fit=crop&auto=format)`, backgroundSize: "cover" }} title={label} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {["#0d0b1e", "#1a0533", "#0a1628", "#0f172a", "#1a1a1a", "#fafafa", "#f0f4ff"].map(c => (
                <button key={c} onClick={() => upCfg({ bgColor: c })}
                  className="w-8 h-8 rounded-xl cursor-pointer hover:scale-110 transition-transform border border-white/30"
                  style={{ backgroundColor: c, outline: cfg.bgColor === c ? "3px solid white" : "none", outlineOffset: 2 }} />
              ))}
              <input type="color" value={cfg.bgColor} onChange={e => upCfg({ bgColor: e.target.value })}
                className="w-8 h-8 rounded-xl cursor-pointer border-0 p-0" />
            </div>
          )}
        </div>
        <div className="mb-5">
          <p className={`text-sm font-medium ${tp} mb-2`}>Tamaño de fuente</p>
          <div className="flex items-center gap-3">
            <Type size={13} className={ts} />
            <input type="range" min="12" max="22" step="1" value={cfg.fontSize}
              onChange={e => upCfg({ fontSize: Number(e.target.value) })}
              className="flex-1 cursor-pointer" style={{ accentColor: acc }} />
            <span className={`text-xs font-mono ${ts} w-8`}>{cfg.fontSize}px</span>
          </div>
        </div>
        <div>
          <p className={`text-sm font-medium ${tp} mb-2`}>Fondo al imprimir</p>
          <div className="flex gap-1.5">
            {([["white", "⬜ Blanco"], ["solid", "🎨 Color sólido"]] as const).map(([v, label]) => (
              <button key={v} onClick={() => upCfg({ printBg: v })}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer border border-white/20 ${cfg.printBg === v ? "text-white" : ts}`}
                style={cfg.printBg === v ? { backgroundColor: ha(acc, 0.5) } : {}}>{label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className={`mb-4 rounded-2xl ${gc} p-5`} style={gs}>
        <div className="flex items-center gap-2 mb-4"><Bell size={15} style={{ color: acc }} /><h2 className={`font-semibold ${tp}`}>Notificaciones</h2></div>
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium ${tp}`}>Recordatorios de actividades</p>
          <button onClick={() => upCfg({ notifications: !cfg.notifications })}
            className="w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer"
            style={{ backgroundColor: cfg.notifications ? acc : "rgba(200,200,200,0.3)", justifyContent: cfg.notifications ? "flex-end" : "flex-start" }}>
            <div className="w-5 h-5 rounded-full bg-white shadow" />
          </button>
        </div>
      </section>

      <section className={`mb-4 rounded-2xl ${gc} p-5`} style={gs}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Trophy size={15} style={{ color: acc }} /><h2 className={`font-semibold ${tp}`}>Proyectos & Logros</h2></div>
          <button onClick={() => openModal("addProject")}
            className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs text-white font-medium cursor-pointer"
            style={{ backgroundColor: acc }}><Plus size={11} /> Nuevo</button>
        </div>
        <div className="space-y-3">
          {projects.map(proj => {
            const isExpanded = logrosProjId === proj.id;
            const completedLogros = proj.logros.filter(l => l.completed).length;
            return (
              <div key={proj.id}>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{proj.emoji}</span>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: proj.color }} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${tp}`}>{proj.name}</p>
                    <p className={`text-[10px] ${ts}`}>{proj.activities.length} act · {completedLogros}/{proj.logros.length} logros</p>
                  </div>
                  <button onClick={() => setLogrosProjId(isExpanded ? null : proj.id)}
                    className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg cursor-pointer transition-all ${isExpanded ? "text-white" : ts}`}
                    style={isExpanded ? { backgroundColor: ha(acc, 0.4) } : {}}>
                    <Trophy size={11} />
                    {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  </button>
                  <button onClick={() => { if (window.confirm(`¿Eliminar "${proj.name}"?`)) { setProjects(ps => ps.filter(p => p.id !== proj.id)); if (logrosProjId === proj.id) setLogrosProjId(null); } }}
                    className="text-red-400 hover:text-red-300 cursor-pointer"><Trash2 size={13} /></button>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-2">
                      <div className="p-3 rounded-xl space-y-2" style={{ backgroundColor: ha(proj.color, 0.1) }}>
                        <p className={`text-[11px] font-semibold ${tp} mb-2`}>Logros del proyecto</p>
                        {proj.logros.map(l => (
                          <div key={l.id} className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                            <span className="text-lg">{l.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium ${l.completed ? "line-through opacity-60" : ""} ${tp}`}>{l.title}</p>
                              {l.triggerActivityId && (
                                <p className={`text-[9px] ${ts}`}>
                                  Auto: {allActs.find(a => a.id === l.triggerActivityId)?.title} × {l.triggerCount}
                                </p>
                              )}
                              {l.target !== undefined && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <div className="flex-1 h-1 rounded-full bg-white/20">
                                    <div className="h-full rounded-full transition-all"
                                      style={{ width: `${Math.min(100, ((l.current ?? 0) / l.target) * 100)}%`, backgroundColor: acc }} />
                                  </div>
                                  <span className={`text-[9px] font-mono ${ts}`}>{(l.current ?? 0).toLocaleString()}/{l.target.toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                            <button onClick={() => toggleProjectLogro(proj.id, l.id)}
                              className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all ${l.completed ? "bg-green-500 text-white" : "border border-white/30 hover:border-white/60"}`}>
                              {l.completed && <Check size={11} />}
                            </button>
                            <button onClick={() => setProjects(ps => ps.map(p => p.id === proj.id ? { ...p, logros: p.logros.filter(x => x.id !== l.id) } : p))}
                              className={`${ts} hover:text-red-400 cursor-pointer`}><X size={11} /></button>
                          </div>
                        ))}
                        <AddLogroForm projId={proj.id} allActs={allActs} acc={acc} gc={gc} gs={gs} tp={tp} ts={ts}
                          onAdd={(l) => setProjects(ps => ps.map(p => p.id === proj.id ? { ...p, logros: [...p.logros, l] } : p))} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
