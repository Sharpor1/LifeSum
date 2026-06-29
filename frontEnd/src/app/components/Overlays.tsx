import { motion, AnimatePresence } from "motion/react";
import { X, Check, Pencil } from "lucide-react";
import type { Activity, Project, Logro } from "../types";
import { ha } from "../utils";

interface OverlaysProps {
  celebrateAct: { title: string; emoji: string; color: string } | null;
  celebrateLogro: string | null;
  detailAct: Activity | null;
  setDetailAct: (act: Activity | null) => void;
  projects: Project[];
  openEditModal: (act: Activity) => void;
}

export function CelebrationOverlay({ celebrateAct }: { celebrateAct: { title: string; emoji: string; color: string } | null }) {
  return (
    <AnimatePresence>
      {celebrateAct && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.4, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 1.3, opacity: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="text-center px-10 py-8 rounded-3xl shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${ha(celebrateAct.color, 0.92)}, ${ha(celebrateAct.color, 0.65)})`, border: `2px solid ${ha(celebrateAct.color, 1)}` }}>
            <div className="text-7xl mb-3">{celebrateAct.emoji}</div>
            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-1">¡Actividad completada!</p>
            <p className="text-white text-3xl font-black leading-tight">{celebrateAct.title}</p>
            <div className="flex justify-center gap-2 mt-4 text-2xl">
              {"🎉🌟✨🏆🎊".split("").map((e, i) => (
                <motion.span key={i} animate={{ y: [0, -10, 0] }} transition={{ delay: i * 0.08, repeat: 3, duration: 0.4 }}>{e}</motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LogroToast({ celebrateLogro }: { celebrateLogro: string | null }) {
  return (
    <AnimatePresence>
      {celebrateLogro && (
        <motion.div
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
          className="fixed bottom-20 right-5 z-[70] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl pointer-events-none"
          style={{ backgroundColor: "rgba(34,197,94,0.92)", backdropFilter: "blur(12px)" }}>
          <span className="text-xl">🏆</span>
          <div>
            <p className="text-white text-xs font-bold">¡Logro completado!</p>
            <p className="text-white/80 text-[11px]">{celebrateLogro}</p>
          </div>
          <Check size={16} className="text-white ml-1" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ActivityDetailOverlay({ detailAct, setDetailAct, projects, openEditModal }: OverlaysProps) {
  return (
    <AnimatePresence>
      {detailAct && (() => {
        const dProj = projects.find(p => p.id === detailAct.projectId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailAct(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl p-5 z-10 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${ha(dProj?.color ?? "#888", 0.9)}, ${ha(dProj?.color ?? "#888", 0.6)})`, border: `1px solid ${ha(dProj?.color ?? "#888", 0.9)}` }}>
              <button onClick={() => setDetailAct(null)} className="absolute top-3 right-3 text-white/60 hover:text-white cursor-pointer"><X size={16} /></button>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{dProj?.emoji}</span>
                <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">{dProj?.name}</span>
              </div>
              <h3 className="text-white text-xl font-black mb-1">{detailAct.title}</h3>
              {detailAct.description && <p className="text-white/70 text-sm mb-3">{detailAct.description}</p>}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">{detailAct.startHour !== undefined ? `${detailAct.startHour}:00` : "Sin hora"} · {detailAct.hours}h</span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">{detailAct.regularity === "regular" ? "🔄 Regular" : detailAct.regularity === "semi" ? `📅 Semi ${detailAct.semiCompletions ?? 0}/${detailAct.semiWeeks}sem` : "⭐ Única"}</span>
                <span className="px-2 py-0.5 rounded-full text-white text-xs font-medium" style={{ backgroundColor: { alta: "#ef444466", media: "#f59e0b66", baja: "#22c55e66" }[detailAct.priority] }}>● {detailAct.priority}</span>
              </div>
              {detailAct.logros.length > 0 && (
                <div>
                  <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wide mb-2">Metas</p>
                  <div className="space-y-1.5">
                    {detailAct.logros.map(l => (
                      <div key={l.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${l.completed ? "bg-white/25" : "bg-black/20"}`}>
                        <span className={l.completed ? "" : "opacity-50"}>{l.icon}</span>
                        <span className={`flex-1 text-sm text-white ${l.completed ? "line-through opacity-70" : ""}`}>{l.title}</span>
                        {l.target !== undefined && (
                          <span className="text-white/60 text-xs font-mono">{l.current ?? 0}/{l.target}</span>
                        )}
                        {l.completed && <Check size={12} className="text-white" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => { setDetailAct(null); openEditModal(detailAct); }}
                className="w-full mt-4 py-2 rounded-xl text-white text-sm font-semibold cursor-pointer bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center gap-1.5">
                <Pencil size={14} /> Editar actividad
              </button>
            </motion.div>
          </div>
        );
      })()}
    </AnimatePresence>
  );
}
