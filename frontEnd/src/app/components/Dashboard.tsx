import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Plus, ExternalLink, ChevronRight, X, Clock,
  Check, Target, Minus, SkipForward, Timer
} from "lucide-react";
import type { Activity, AppCfg, Logro, Project, Priority, Screen } from "../types";
import { ha, todayIdx, isActivityVisibleInWeek, formatMins, computeStreak } from "../utils";
import { HOURS, DAYS, DAYS_S, TIPS } from "../constants";
import { STICKER_DEFS } from "../stickers";

interface DashboardProps {
  cfg: AppCfg;
  projects: Project[];
  setProjects: (ps: Project[] | ((prev: Project[]) => Project[])) => void;
  allActs: Activity[];
  weekOff: number;
  calFilter: string | null;
  setCalFilter: (f: string | null) => void;
  setScreen: (s: Screen) => void;
  openModal: (k: "addActivity" | "addProject" | "editActivity" | null, preset?: Record<string, unknown>) => void;
  openEditModal: (act: Activity) => void;
  activityDone: Record<string, boolean>;
  setActivityDone: (d: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  completionLog: Record<string, number>;
  setCompletionLog: (l: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  completedDays: string[];
  setCompletedDays: (d: string[] | ((prev: string[]) => string[])) => void;
  setCelebrateAct: (a: { title: string; emoji: string; color: string } | null) => void;
  setCelebrateLogro: (t: string | null) => void;
  updateLogroCounter: (projId: string, actId: string, logroId: string, delta: number) => void;
  toggleActivityLogro: (projId: string, actId: string, logroId: string) => void;
  stickerList: { id: string; stickerId: string; x: number; y: number }[];
  setStickerList: (s: { id: string; stickerId: string; x: number; y: number }[] | ((prev: { id: string; stickerId: string; x: number; y: number }[]) => { id: string; stickerId: string; x: number; y: number }[])) => void;
  customStickers: { id: string; dataUrl: string; label: string }[];
  dragStickerId: string | null;
  setDragStickerId: (id: string | null) => void;
  dark: boolean; acc: string; tp: string; ts: string; gc: string; gs: React.CSSProperties; sb: string;
}

export default function Dashboard({
  cfg, projects, setProjects, allActs, calFilter, setCalFilter, setScreen, openModal, openEditModal,
  activityDone, setActivityDone, completionLog, setCompletionLog, completedDays, setCompletedDays,
  setCelebrateAct, setCelebrateLogro, updateLogroCounter, toggleActivityLogro,
  stickerList, setStickerList, customStickers,
  dragStickerId, setDragStickerId,
  dark, acc, tp, ts, gc, gs,
}: DashboardProps) {
  const [tipOpen, setTipOpen] = useState(true);
  const [tipIdx, setTipIdx] = useState(Math.floor(Math.random() * TIPS.length));
  const [extendedMins, setExtendedMins] = useState(0);
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));

  const tIdx = todayIdx();

  const now = new Date();
  const nowH = now.getHours();
  const currentAct = allActs.find(a =>
    isActivityVisibleInWeek(a, 0) && a.day === tIdx &&
    a.startHour !== undefined &&
    a.startHour <= nowH && (a.startHour + a.hours) > nowH
  ) ?? null;
  const nextAct = !currentAct ? allActs
    .filter(a => isActivityVisibleInWeek(a, 0) && a.day === tIdx && a.startHour !== undefined && a.startHour > nowH)
    .sort((a, b) => (a.startHour ?? 0) - (b.startHour ?? 0))[0] ?? null
    : null;

  const focusedAct = currentAct ?? nextAct;
  const focusedProj = focusedAct ? projects.find(p => p.id === focusedAct.projectId) : null;
  const isCurrentlyActive = !!currentAct;
  const streak = computeStreak(completedDays);

  useEffect(() => {
    const clock = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
    }, 60000);
    return () => clearInterval(clock);
  }, []);

  function completeActivity(actId: string) {
    const proj = projects.find(p => p.activities.some(a => a.id === actId));
    if (!proj) return;
    const act = proj.activities.find(a => a.id === actId);
    if (!act) return;

    const newCount = (completionLog[actId] ?? 0) + 1;
    setCompletionLog(l => ({ ...l, [actId]: newCount }));
    setActivityDone(d => ({ ...d, [actId]: true }));
    const today = new Date().toISOString().slice(0, 10);
    setCompletedDays(days => days.includes(today) ? days : [...days, today]);
    const cProj = projects.find(p => p.activities.some(a => a.id === actId));
    const cAct = cProj?.activities.find(a => a.id === actId);
    if (cAct && cProj) {
      setCelebrateAct({ title: cAct.title, emoji: cProj.emoji, color: cProj.color });
      setTimeout(() => setCelebrateAct(null), 3500);
    }

    setProjects(ps => ps.map(p => {
      if (p.id !== proj.id) return p;
      const updatedActivities = p.activities.map(a =>
        a.id === actId && a.regularity === "semi"
          ? { ...a, semiCompletions: (a.semiCompletions ?? 0) + 1 }
          : a
      );
      const updatedLogros = p.logros.map(l => {
        if (!l.triggerActivityId || l.triggerActivityId !== actId) return l;
        const newCurrent = newCount;
        const needed = l.triggerCount ?? 1;
        return { ...l, current: newCurrent, completed: newCurrent >= needed };
      });
      return { ...p, activities: updatedActivities, logros: updatedLogros };
    }));
    setExtendedMins(0);
  }

  return (
    <motion.div key="dash"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full overflow-y-auto p-5 relative"
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        if (!dragStickerId) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setStickerList(s => [...s, { id: Math.random().toString(36).slice(2, 9), stickerId: dragStickerId, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
        setDragStickerId(null);
      }}>

      {/* Tip + streak */}
      <div className="flex gap-3 mb-4 items-stretch">
        <AnimatePresence mode="wait">
          {tipOpen && (
            <motion.div key={tipIdx} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className={`flex-1 px-4 py-3 rounded-2xl ${gc} flex items-center gap-3`} style={gs}>
              <span style={{ color: acc }} className="text-lg flex-shrink-0">✨</span>
              <p className={`flex-1 text-sm ${tp}`}><strong>¡Buenos días, {cfg.username}!</strong> {TIPS[tipIdx]}</p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setTipIdx(i => (i + 1) % TIPS.length)} className={`${ts} hover:text-white cursor-pointer p-0.5 rounded`} title="Siguiente mensaje"><ChevronRight size={14} /></button>
                <button onClick={() => setTipOpen(false)} className={`${ts} hover:text-white cursor-pointer`}><X size={14} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {streak > 0 && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className={`px-4 py-3 rounded-2xl ${gc} flex items-center gap-2 flex-shrink-0 min-w-[90px]`} style={gs}>
            <span className="text-2xl">🔥</span>
            <div>
              <p className={`text-2xl font-black leading-none ${tp}`}>{streak}</p>
              <p className={`text-[10px] ${ts}`}>{streak === 1 ? "día" : "días"} racha</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Current / Next Activity */}
      {focusedAct && focusedProj ? (
        <motion.div
          key={focusedAct.id}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-3xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${ha(focusedProj.color, 0.85)} 0%, ${ha(focusedProj.color, 0.55)} 100%)`, border: `1px solid ${ha(focusedProj.color, 0.9)}` }}>
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{focusedProj.emoji}</span>
                  <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">{focusedProj.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isCurrentlyActive ? "bg-green-400/30 text-green-200" : "bg-white/20 text-white/70"}`}>
                    {isCurrentlyActive ? "● EN CURSO" : "◎ PRÓXIMA"}
                  </span>
                </div>
                <h2 className="text-white text-3xl font-black leading-tight truncate">{focusedAct.title}</h2>
                {focusedAct.description && (
                  <p className="text-white/60 text-sm mt-1">{focusedAct.description}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-white/40 text-xs font-mono mb-0.5 flex items-center justify-end gap-1">
                  <Clock size={10} /> Ahora: {liveTime}
                </div>
                <div className="text-white text-xl font-mono font-bold tabular-nums">
                  {(focusedAct.startHour ?? 0).toString().padStart(2, "0")}:00 –{" "}
                  {((focusedAct.startHour ?? 0) + focusedAct.hours + Math.floor(extendedMins / 60)).toString().padStart(2, "0")}:{(extendedMins % 60).toString().padStart(2, "0")}
                </div>
                <div className="text-white/60 text-xs mt-0.5">{focusedAct.hours}h{extendedMins > 0 ? ` + ${formatMins(extendedMins)} extra` : ""}</div>
                <div className="text-white/50 text-[10px] mt-0.5">
                  {focusedAct.regularity === "regular" ? "🔄 Regular" : focusedAct.regularity === "semi" ? `📅 Semi (${focusedAct.semiCompletions ?? 0}/${focusedAct.semiWeeks}sem)` : "⭐ Única"}
                  {" · "}
                  <span style={{ color: { alta: "#fca5a5", media: "#fcd34d", baja: "#86efac" }[focusedAct.priority] }}>
                    ● {focusedAct.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {focusedAct.logros.length > 0 && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Target size={12} className="text-white/60" />
                <span className="text-white/60 text-[11px] font-semibold uppercase tracking-wide">Metas de esta actividad</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {focusedAct.logros.map(l => (
                  <div key={l.id}
                    className={`px-3 py-2 rounded-xl transition-all ${l.completed ? "bg-white/25" : "bg-black/20"}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg flex-shrink-0 ${l.completed ? "" : "opacity-50"}`}>{l.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-tight ${l.completed ? "text-white line-through opacity-70" : "text-white"}`}>{l.title}</p>
                      </div>
                      {l.target !== undefined ? (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => updateLogroCounter(focusedProj.id, focusedAct.id, l.id, -1)}
                            disabled={(l.current ?? 0) === 0}
                            className="w-6 h-6 rounded-lg bg-black/30 hover:bg-black/50 text-white flex items-center justify-center cursor-pointer disabled:opacity-30 transition-all">
                            <Minus size={10} />
                          </button>
                          <span className="text-white font-mono font-bold text-sm min-w-[44px] text-center">{l.current ?? 0}/{l.target}</span>
                          <button onClick={() => updateLogroCounter(focusedProj.id, focusedAct.id, l.id, 1)}
                            disabled={l.completed}
                            className="w-6 h-6 rounded-lg bg-white/25 hover:bg-white/40 text-white flex items-center justify-center cursor-pointer disabled:opacity-30 transition-all">
                            <Plus size={10} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => toggleActivityLogro(focusedProj.id, focusedAct.id, l.id)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 transition-all ${l.completed ? "bg-white/40 text-white" : "border border-white/40 hover:border-white"}`}>
                          {l.completed && <Check size={12} />}
                        </button>
                      )}
                    </div>
                    {l.target !== undefined && (
                      <div className="mt-1.5 h-1.5 rounded-full bg-white/20">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, ((l.current ?? 0) / l.target) * 100)}%`, backgroundColor: l.completed ? "#4ade80" : "rgba(255,255,255,0.7)" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="px-6 pb-5 flex items-center gap-2 flex-wrap">
            {isCurrentlyActive && !activityDone[focusedAct.id] && (
              <button
                onClick={() => completeActivity(focusedAct.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white cursor-pointer transition-all hover:opacity-90"
                style={{ backgroundColor: "rgba(34,197,94,0.8)" }}>
                <Check size={16} /> Completar actividad
              </button>
            )}
            {activityDone[focusedAct.id] && (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-green-500/40">
                <Check size={16} /> ¡Completada! 🎉
              </div>
            )}
            {isCurrentlyActive && (
              <div className="flex items-center gap-1.5">
                <Timer size={14} className="text-white/70" />
                {[15, 30, 60].map(m => (
                  <button key={m}
                    onClick={() => setExtendedMins(e => e + m)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white/80 bg-white/15 hover:bg-white/25 cursor-pointer transition-all">
                    +{m}min
                  </button>
                ))}
                {extendedMins > 0 && (
                  <button onClick={() => setExtendedMins(0)}
                    className="px-2 py-1.5 rounded-xl text-xs text-white/50 hover:text-white cursor-pointer">
                    <X size={11} />
                  </button>
                )}
              </div>
            )}
            {!isCurrentlyActive && (
              <span className="text-white/50 text-xs">
                <SkipForward size={12} className="inline mr-1" />
                Comienza a las {focusedAct.startHour}:00
              </span>
            )}
          </div>
        </motion.div>
      ) : (
        <div className={`mb-5 rounded-3xl p-6 ${gc} flex items-center gap-4`} style={gs}>
          <div className="text-4xl opacity-30">😴</div>
          <div>
            <p className={`font-semibold ${tp}`}>Sin actividades hoy</p>
            <p className={`text-sm ${ts}`}>Disfruta tu descanso o agrega actividades al calendario.</p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className={`mb-5 rounded-2xl ${gc} overflow-hidden`} style={gs}>
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center gap-2">
          <Calendar size={13} style={{ color: acc }} />
          <span className={`text-xs font-semibold ${tp}`}>Itinerario — {DAYS[tIdx]}</span>
        </div>
        <div className="overflow-x-auto p-3">
          <div className="flex gap-3 min-w-max">
            {HOURS.slice(0, 15).map(h => {
              const acts = allActs.filter(a =>
                isActivityVisibleInWeek(a, 0) && a.day === tIdx &&
                a.startHour !== undefined && a.startHour <= h && (a.startHour + a.hours) > h
              );
              const isNow = h === nowH;
              const isFocused = focusedAct?.startHour !== undefined && focusedAct.startHour <= h && (focusedAct.startHour + focusedAct.hours) > h;
              const proj = acts[0] ? projects.find(p => p.id === acts[0].projectId) : null;
              return (
                <div key={h} className="flex flex-col items-center gap-1.5 w-[68px]">
                  <span className="text-[10px] font-mono"
                    style={{ color: isNow ? acc : dark ? "rgba(255,255,255,0.4)" : "#888", fontWeight: isNow ? 700 : 400 }}>
                    {h}:00
                  </span>
                  <div className="rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all relative"
                    style={{
                      width: 68, height: 80,
                      backgroundColor: proj ? ha(proj.color, isFocused ? 0.9 : 0.65) : ha("#ffffff", 0.06),
                      outline: isNow ? `2.5px solid ${acc}` : isFocused ? `2px solid ${ha(focusedProj?.color ?? acc, 0.8)}` : "none",
                      transform: isNow ? "scale(1.08)" : "scale(1)",
                    }}>
                    {acts[0] ? (
                      <>
                        <span className="text-xl mb-0.5">{proj?.emoji}</span>
                        <span className="text-white text-[9px] font-semibold text-center px-1.5 leading-tight">{acts[0].title.slice(0, 14)}</span>
                        <span className="text-white/60 text-[8px] mt-0.5">{acts[0].hours}h</span>
                      </>
                    ) : isNow ? (
                      <span className="text-2xl">⏱</span>
                    ) : (
                      <span className={`text-xs ${ts} opacity-30`}>—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
        {projects.map(proj => {
          const upcoming = proj.activities
            .filter(a => a.day !== undefined && a.day >= tIdx)
            .sort((a, b) => (a.day ?? 0) - (b.day ?? 0) || (a.startHour ?? 0) - (b.startHour ?? 0))
            .slice(0, 3);
          const completedLogros = proj.logros.filter(l => l.completed).length;
          return (
            <motion.div key={proj.id} whileHover={{ scale: 1.02, y: -3 }}
              className={`rounded-2xl ${gc} overflow-hidden cursor-pointer`} style={gs}
              onClick={() => { setScreen("calendar"); setCalFilter(proj.id); }}>
              <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: ha(proj.color, 0.35) }}>
                <span className="text-2xl">{proj.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold truncate ${tp}`}>{proj.name}</p>
                  <p className={`text-xs truncate ${ts}`}>{proj.description}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: proj.color }} />
                  {proj.logros.length > 0 && (
                    <span className="text-[9px] text-white/60 font-mono">{completedLogros}/{proj.logros.length} 🏆</span>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 space-y-1.5">
                {upcoming.length === 0 ? (
                  <p className={`text-xs italic ${ts}`}>Sin actividades próximas</p>
                ) : upcoming.map(act => (
                  <div key={act.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: proj.color }} />
                    <span className={`text-xs flex-1 truncate ${tp}`}>{act.title}</span>
                    <span className={`text-[10px] font-mono ${ts} flex-shrink-0`}>{DAYS_S[act.day!]} {act.startHour}h</span>
                    <span className="text-[10px]">{act.regularity === "regular" ? "🔄" : act.regularity === "semi" ? "📅" : "⭐"}</span>
                  </div>
                ))}
              </div>
              {proj.links.length > 0 && (
                <div className="px-4 pb-3 flex gap-1.5 flex-wrap">
                  {proj.links.map(lnk => (
                    <a key={lnk.id} href={lnk.url} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-white/20 ${ts} hover:text-white transition-colors`}>
                      <ExternalLink size={8} />{lnk.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
        <motion.button whileHover={{ scale: 1.02, y: -3 }} onClick={() => openModal("addProject")}
          className={`rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center gap-2 py-10 ${ts} hover:text-white transition-all cursor-pointer min-h-[140px]`}>
          <Plus size={22} /><span className="text-sm font-medium">Nuevo proyecto</span>
        </motion.button>
      </div>

      {/* Floating stickers */}
      {stickerList.map(s => {
        const def = STICKER_DEFS.find(d => d.id === s.stickerId);
        const custom = customStickers.find(c => c.id === s.stickerId);
        return (
          <div key={s.id} className="absolute select-none cursor-pointer hover:scale-125 transition-transform z-40"
            style={{ left: s.x - 22, top: s.y - 22, width: 44, height: 44 }}
            onDoubleClick={() => setStickerList(ss => ss.filter(x => x.id !== s.id))}
            title="Doble clic para eliminar">
            {def ? <def.Component /> : custom ? <img src={custom.dataUrl} className="w-full h-full object-contain" alt={custom.label} /> : null}
          </div>
        );
      })}
    </motion.div>
  );
}
