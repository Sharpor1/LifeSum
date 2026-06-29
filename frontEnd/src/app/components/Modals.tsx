import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";
import type { Activity, AppCfg, Logro, ModalKind, Priority, Project, Regularity } from "../types";
import { ha, uid } from "../utils";
import { DAYS, EMOJIS, HOURS, LOGRO_ICONS, NOTE_COLORS, PROJ_COLORS } from "../constants";

interface ModalsProps {
  modal: ModalKind;
  setModal: (m: ModalKind) => void;
  mForm: Record<string, unknown>;
  setMForm: (f: Record<string, unknown> | ((prev: Record<string, unknown>) => Record<string, unknown>)) => void;
  editActTarget: Activity | null;
  setEditActTarget: (act: Activity | null) => void;
  projects: Project[];
  setProjects: (ps: Project[] | ((prev: Project[]) => Project[])) => void;
  weekOff: number;
  acc: string;
}

export default function Modals({ modal, setModal, mForm, setMForm, editActTarget, setEditActTarget, projects, setProjects, weekOff, acc }: ModalsProps) {
  function submitModal() {
    const baseAct = {
      title: mForm.title as string,
      description: (mForm.description as string) || "",
      hours: Number(mForm.hours),
      day: mForm.scheduleNow ? Number(mForm.day) : undefined,
      startHour: mForm.scheduleNow ? Number(mForm.startHour) : undefined,
      regularity: mForm.regularity as Regularity,
      priority: mForm.priority as Priority,
      projectId: mForm.projectId as string,
      noteColor: mForm.noteColor as string,
      logros: (mForm.mLogros as Logro[]) || [],
      schedWeek: mForm.scheduleNow ? weekOff : undefined,
      semiWeeks: (mForm.regularity as string) === "semi" ? Number(mForm.semiWeeks) : undefined,
      semiTarget: (mForm.regularity as string) === "semi" && Number(mForm.semiTarget) > 0 ? Number(mForm.semiTarget) : undefined,
    };

    if (modal === "addActivity" && mForm.title) {
      const act: Activity = { id: uid(), ...baseAct, semiCompletions: 0 };
      setProjects(ps => ps.map(p =>
        p.id === act.projectId ? { ...p, activities: [...p.activities, act] } : p
      ));
    } else if (modal === "editActivity" && mForm.title && editActTarget) {
      setProjects(ps => ps.map(p => p.id === baseAct.projectId ? {
        ...p, activities: p.activities.map(a => a.id === editActTarget.id
          ? { ...a, ...baseAct, id: a.id, semiCompletions: a.semiCompletions ?? 0 }
          : a)
      } : p));
    } else if (modal === "addProject" && mForm.name) {
      setProjects(ps => [...ps, {
        id: uid(), name: mForm.name as string, emoji: (mForm.emoji as string) || "📦",
        color: (mForm.projColor as string) || PROJ_COLORS[0], description: (mForm.projDesc as string) || "",
        links: [], activities: [], logros: [],
      }]);
    }
    setModal(null);
    setEditActTarget(null);
  }

  return (
    <AnimatePresence>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setModal(null); setEditActTarget(null); }} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className={`relative w-full rounded-2xl p-5 z-10 bg-gray-900/95 backdrop-blur-xl border border-white/15 max-h-[90vh] overflow-y-auto ${(modal === "addActivity" || modal === "editActivity") ? "max-w-3xl" : "max-w-md"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-white">
                {modal === "addActivity" ? "Nueva actividad" : modal === "editActivity" ? `Editar: ${(mForm.title as string) || "actividad"}` : "Nuevo proyecto"}
              </h2>
              <button onClick={() => { setModal(null); setEditActTarget(null); }} className="text-white/50 hover:text-white cursor-pointer"><X size={18} /></button>
            </div>

            <div className="space-y-3">
              {(modal === "addActivity" || modal === "editActivity") && (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-white/55 block mb-1">Proyecto</label>
                      <select value={mForm.projectId as string} onChange={e => setMForm(f => ({ ...f, projectId: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-sm bg-white/10 text-white outline-none cursor-pointer border border-white/15">
                        {projects.map(p => <option key={p.id} value={p.id} className="bg-gray-900 text-white">{p.emoji} {p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-white/55 block mb-1">Título *</label>
                      <input value={mForm.title as string} onChange={e => setMForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-sm bg-white/10 text-white outline-none border border-white/15" placeholder="Nombre de la actividad..." />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/55 block mb-1">Descripción</label>
                      <textarea value={mForm.description as string} onChange={e => setMForm(f => ({ ...f, description: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-sm bg-white/10 text-white outline-none resize-none border border-white/15"
                        rows={2} placeholder="Detalles..." />
                    </div>
                    <div>
                      <label className="text-[11px] text-white/55 block mb-1">Color post-it</label>
                      <div className="flex gap-2 flex-wrap">
                        {NOTE_COLORS.map(c => (
                          <button key={c} onClick={() => setMForm(f => ({ ...f, noteColor: c }))}
                            className="w-7 h-7 rounded-lg cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: c, outline: (mForm.noteColor as string) === c ? "2px solid white" : "none", outlineOffset: 2 }} />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-white/55 block mb-1">Regularidad</label>
                        <div className="flex flex-col gap-1">
                          {(["regular", "semi", "única"] as Regularity[]).map(r => (
                            <button key={r} onClick={() => setMForm(f => ({ ...f, regularity: r }))}
                              className={`py-1.5 rounded-xl text-[11px] font-medium cursor-pointer border transition-all ${(mForm.regularity as string) === r ? "text-white border-transparent" : "text-white/50 border-white/20"}`}
                              style={(mForm.regularity as string) === r ? { backgroundColor: acc } : {}}>
                              {r === "regular" ? "🔄 Regular" : r === "semi" ? "📅 Semi" : "⭐ Única"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] text-white/55 block mb-1">Prioridad</label>
                        <div className="flex flex-col gap-1">
                          {(["alta", "media", "baja"] as Priority[]).map(p => {
                            const c = { alta: "#ef4444", media: "#f59e0b", baja: "#22c55e" }[p];
                            return (
                              <button key={p} onClick={() => setMForm(f => ({ ...f, priority: p }))}
                                className={`py-1.5 rounded-xl text-[11px] font-medium cursor-pointer border transition-all ${(mForm.priority as string) === p ? "text-white border-transparent" : "text-white/50 border-white/20"}`}
                                style={(mForm.priority as string) === p ? { backgroundColor: c } : {}}>{p}</button>
                            );
                          })}
                        </div>
                        <div className="mt-2">
                          <label className="text-[11px] text-white/55 block mb-1">Duración (h)</label>
                          <input type="number" min="1" max="12" value={mForm.hours as number}
                            onChange={e => setMForm(f => ({ ...f, hours: Number(e.target.value) }))}
                            className="w-full px-2 py-2 rounded-xl text-xs bg-white/10 text-white outline-none border border-white/15" />
                        </div>
                      </div>
                    </div>

                    {(mForm.regularity as string) === "semi" && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <p className="text-[11px] text-white/70 font-semibold">Configuración semi-regular</p>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-white/50 flex-shrink-0">Semanas:</label>
                          <input type="number" min="1" max="52" value={mForm.semiWeeks as number}
                            onChange={e => setMForm(f => ({ ...f, semiWeeks: Number(e.target.value) }))}
                            className="flex-1 px-2 py-1.5 rounded-lg text-xs bg-white/10 text-white outline-none border border-white/15" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] text-white/50 flex-shrink-0">Completar tras (0=sin límite):</label>
                          <input type="number" min="0" max="99" value={mForm.semiTarget as number}
                            onChange={e => setMForm(f => ({ ...f, semiTarget: Number(e.target.value) }))}
                            className="flex-1 px-2 py-1.5 rounded-lg text-xs bg-white/10 text-white outline-none border border-white/15" />
                        </div>
                      </div>
                    )}

                    <div className="p-3 rounded-xl border border-white/15 space-y-2"
                      style={{ backgroundColor: mForm.scheduleNow ? ha(acc, 0.15) : "rgba(255,255,255,0.04)" }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/80 font-medium">Programar en calendario</span>
                        <button onClick={() => setMForm(f => ({ ...f, scheduleNow: !f.scheduleNow }))}
                          className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer"
                          style={{ backgroundColor: mForm.scheduleNow ? acc : "rgba(255,255,255,0.2)", justifyContent: mForm.scheduleNow ? "flex-end" : "flex-start" }}>
                          <div className="w-4 h-4 rounded-full bg-white shadow" />
                        </button>
                      </div>
                      {mForm.scheduleNow && (
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Día</label>
                            <select value={mForm.day as number} onChange={e => setMForm(f => ({ ...f, day: Number(e.target.value) }))}
                              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/10 text-white outline-none cursor-pointer border border-white/15">
                              {DAYS.map((d, i) => <option key={i} value={i} className="bg-gray-900 text-white">{d.slice(0, 3)}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-white/50 block mb-1">Hora</label>
                            <select value={mForm.startHour as number} onChange={e => setMForm(f => ({ ...f, startHour: Number(e.target.value) }))}
                              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/10 text-white outline-none cursor-pointer border border-white/15">
                              {HOURS.map(h => <option key={h} value={h} className="bg-gray-900 text-white">{h}:00</option>)}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 h-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-white/70 font-semibold">Metas de la actividad</span>
                        <button
                          onClick={() => setMForm(f => ({
                            ...f, mLogros: [...(f.mLogros as Logro[]), { id: uid(), title: "Nueva meta", icon: "🎯", completed: false }]
                          }))}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white cursor-pointer"
                          style={{ backgroundColor: ha(acc, 0.6) }}><Plus size={10} /></button>
                      </div>
                      <div className="space-y-1.5 max-h-[52vh] overflow-y-auto pr-0.5">
                        {(mForm.mLogros as Logro[]).map((l, i) => (
                          <div key={l.id} className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <select value={l.icon}
                                onChange={e => setMForm(f => ({ ...f, mLogros: (f.mLogros as Logro[]).map((x, xi) => xi === i ? { ...x, icon: e.target.value } : x) }))}
                                className="w-8 px-0.5 py-0.5 rounded text-sm bg-white/10 text-white outline-none border border-white/15 cursor-pointer">
                                {LOGRO_ICONS.map(ic => <option key={ic} value={ic} className="bg-gray-900">{ic}</option>)}
                              </select>
                              <input value={l.title}
                                onChange={e => setMForm(f => ({ ...f, mLogros: (f.mLogros as Logro[]).map((x, xi) => xi === i ? { ...x, title: e.target.value } : x) }))}
                                className="flex-1 px-2 py-0.5 rounded text-[11px] bg-white/10 text-white outline-none border border-white/15" />
                              <button onClick={() => setMForm(f => ({ ...f, mLogros: (f.mLogros as Logro[]).filter((_, xi) => xi !== i) }))}
                                className="text-white/40 hover:text-red-400 cursor-pointer"><X size={11} /></button>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-white/40">Meta:</span>
                              <input type="number" min="0" placeholder="numérica (opcional)"
                                value={l.target ?? ""}
                                onChange={e => setMForm(f => ({ ...f, mLogros: (f.mLogros as Logro[]).map((x, xi) => xi === i ? { ...x, target: e.target.value ? Number(e.target.value) : undefined, current: x.current ?? 0 } : x) }))}
                                className="flex-1 px-2 py-0.5 rounded text-[11px] bg-white/10 text-white outline-none border border-white/15" />
                            </div>
                          </div>
                        ))}
                        {(mForm.mLogros as Logro[]).length === 0 && (
                          <div className="text-center py-6">
                            <p className="text-[10px] text-white/25">Sin metas aún</p>
                            <p className="text-[10px] text-white/25">Pulsa + para agregar</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {modal === "addProject" && (
                <>
                  <div>
                    <label className="text-[11px] text-white/55 block mb-1">Nombre *</label>
                    <input value={mForm.name as string} onChange={e => setMForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl text-sm bg-white/10 text-white outline-none border border-white/15" placeholder="Nombre del proyecto..." />
                  </div>
                  <div>
                    <label className="text-[11px] text-white/55 block mb-1">Emoji</label>
                    <div className="flex gap-2 flex-wrap">
                      {EMOJIS.map(em => (
                        <button key={em} onClick={() => setMForm(f => ({ ...f, emoji: em }))}
                          className={`text-xl p-1.5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors ${(mForm.emoji as string) === em ? "bg-white/20 ring-2 ring-white/40" : ""}`}>
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/55 block mb-1">Color</label>
                    <div className="flex gap-2">
                      {PROJ_COLORS.map(c => (
                        <button key={c} onClick={() => setMForm(f => ({ ...f, projColor: c }))}
                          className="w-7 h-7 rounded-full cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: c, outline: (mForm.projColor as string) === c ? "2px solid white" : "none", outlineOffset: 2 }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/55 block mb-1">Descripción</label>
                    <textarea value={mForm.projDesc as string} onChange={e => setMForm(f => ({ ...f, projDesc: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl text-sm bg-white/10 text-white outline-none resize-none border border-white/15"
                      rows={2} placeholder="Descripción del proyecto..." />
                  </div>
                </>
              )}
            </div>

            <button onClick={submitModal}
              disabled={(modal === "addActivity" || modal === "editActivity") ? !mForm.title : !mForm.name}
              className="w-full mt-4 py-2.5 rounded-xl text-white font-semibold cursor-pointer hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: acc }}>
              {modal === "editActivity" ? "Guardar cambios" : "Crear"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
