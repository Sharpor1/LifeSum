import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, ChevronRight, Plus, Printer, Flag, X,
  Pencil, Info, Check, Trash2, Clock, GripVertical
} from "lucide-react";
import type { Activity, Project, AppCfg } from "../types";
import { ha, getWeekDates, isActivityVisibleInWeek, daysInMonth, firstDow } from "../utils";
import { HOURS, DAYS_S, ROW_H } from "../constants";

interface CalendarProps {
  cfg: AppCfg;
  projects: Project[];
  setProjects: (ps: Project[] | ((prev: Project[]) => Project[])) => void;
  allActs: Activity[];
  visActs: Activity[];
  trayItems: Activity[];
  weekOff: number;
  setWeekOff: (n: number | ((prev: number) => number)) => void;
  calFilter: string | null;
  setCalFilter: (f: string | null) => void;
  openModal: (k: "addActivity" | "editActivity" | null, preset?: Record<string, unknown>) => void;
  openEditModal: (act: Activity) => void;
  setDetailAct: (act: Activity | null) => void;
  activityDone: Record<string, boolean>;
  dark: boolean; acc: string; tp: string; ts: string; gc: string; gs: React.CSSProperties; sb: string;
}

export default function Calendar({
  cfg, projects, setProjects, allActs, visActs, trayItems,
  weekOff, setWeekOff, calFilter, setCalFilter,
  openModal, openEditModal, setDetailAct, activityDone,
  dark, acc, tp, ts, gc, gs, sb,
}: CalendarProps) {
  const now = new Date();
  const [calView, setCalView] = useState<"week" | "month">("week");
  const [showTray, setShowTray] = useState(true);
  const [mYear, setMYear] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [dragActId, setDragActId] = useState<string | null>(null);
  const [dragCalActId, setDragCalActId] = useState<string | null>(null);
  const [dropSlot, setDropSlot] = useState<{ day: number; hour: number } | null>(null);
  const [trayExpanded, setTrayExpanded] = useState(true);
  const resizeRef = useRef<{ actId: string; projId: string; startY: number; startHours: number } | null>(null);

  const weekDates = getWeekDates(weekOff);

  function moveCalendarActivity(actId: string, day: number, hour: number) {
    setProjects(ps => ps.map(p => ({
      ...p, activities: p.activities.map(a => a.id === actId ? { ...a, day, startHour: hour } : a)
    })));
  }

  function dropActivityOnSlot(actId: string, day: number, hour: number) {
    const proj = projects.find(p => p.activities.some(a => a.id === actId));
    if (!proj) return;
    const act = proj.activities.find(a => a.id === actId);
    if (!act) return;
    if (act.regularity === "regular") {
      const copy: Activity = { ...act, id: Math.random().toString(36).slice(2, 9), regularity: "única", day, startHour: hour, schedWeek: weekOff, logros: [] };
      setProjects(ps => ps.map(p => p.id === proj.id ? { ...p, activities: [...p.activities, copy] } : p));
    } else {
      setProjects(ps => ps.map(p => p.id === proj.id ? {
        ...p, activities: p.activities.map(a => a.id === actId ? { ...a, day, startHour: hour, schedWeek: weekOff } : a)
      } : p));
    }
  }

  function unscheduleActivity(projId: string, actId: string) {
    const act = projects.find(p => p.id === projId)?.activities.find(a => a.id === actId);
    if (!act) return;
    if (act.regularity === "única") {
      setProjects(ps => ps.map(p => p.id === projId ? { ...p, activities: p.activities.filter(a => a.id !== actId) } : p));
    } else {
      setProjects(ps => ps.map(p => p.id === projId ? {
        ...p, activities: p.activities.map(a => a.id === actId ? { ...a, day: undefined, startHour: undefined } : a)
      } : p));
    }
  }

  function deleteActivity(projId: string, actId: string) {
    setProjects(ps => ps.map(p => p.id === projId ? { ...p, activities: p.activities.filter(a => a.id !== actId) } : p));
  }

  return (
    <motion.div key="cal"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full flex flex-col overflow-hidden">

      <div className={`no-print px-4 py-3 flex items-center gap-3 border-b border-white/10 ${sb} flex-shrink-0 flex-wrap gap-y-2`}>
        <div className="flex items-center gap-1">
          <button onClick={() => calView === "week" ? setWeekOff(o => o - 1) : setMYear(my => { const m = my.m - 1; return m < 0 ? { y: my.y - 1, m: 11 } : { ...my, m }; })}
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${ts} hover:text-white hover:bg-white/10 cursor-pointer`}><ChevronLeft size={16} /></button>
          <span className={`text-sm font-semibold min-w-[160px] text-center ${tp}`}>
            {calView === "week"
              ? `${weekDates[0].getDate()} — ${weekDates[6].getDate()} ${weekDates[6].toLocaleDateString("es-ES", { month: "short", year: "numeric" })}`
              : new Date(mYear.y, mYear.m).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </span>
          <button onClick={() => calView === "week" ? setWeekOff(o => o + 1) : setMYear(my => { const m = my.m + 1; return m > 11 ? { y: my.y + 1, m: 0 } : { ...my, m }; })}
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${ts} hover:text-white hover:bg-white/10 cursor-pointer`}><ChevronRight size={16} /></button>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-white/20">
          {(["week", "month"] as const).map(v => (
            <button key={v} onClick={() => setCalView(v)}
              className={`px-3 py-1 text-xs font-medium transition-all cursor-pointer ${calView === v ? "text-white" : `${ts} hover:bg-white/10`}`}
              style={calView === v ? { backgroundColor: ha(acc, 0.45) } : {}}>
              {v === "week" ? "Semana" : "Mes"}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap flex-1">
          <button onClick={() => setCalFilter(null)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium cursor-pointer border border-white/20 transition-all ${calFilter === null ? "text-white bg-white/20" : ts}`}>
            Todos
          </button>
          {projects.map(p => (
            <button key={p.id} onClick={() => setCalFilter(calFilter === p.id ? null : p.id)}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium cursor-pointer border transition-all"
              style={{ borderColor: p.color, backgroundColor: calFilter === p.id ? ha(p.color, 0.5) : ha(p.color, 0.15), color: calFilter === p.id ? "white" : dark ? "rgba(255,255,255,0.6)" : "#555" }}>
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={() => openModal("addActivity")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white cursor-pointer"
            style={{ backgroundColor: acc }}><Plus size={13} /> Actividad</button>
          <button onClick={() => window.print()}
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${ts} hover:text-white hover:bg-white/10 cursor-pointer`}><Printer size={14} /></button>
          <button onClick={() => setShowTray(s => !s)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${showTray ? "text-white bg-white/20" : ts}`}><Flag size={14} /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto">
          {calView === "week" ? (
            <div className="min-w-[640px]">
              <div className="flex sticky top-0 z-10"
                style={{ backgroundColor: dark ? "rgba(8,5,20,0.93)" : "rgba(240,240,255,0.93)" }}>
                <div className="w-14 flex-shrink-0" />
                {weekDates.map((date, di) => {
                  const isT = date.toDateString() === now.toDateString();
                  return (
                    <div key={di} className="flex-1 py-2 text-center border-l border-white/10"
                      style={isT ? { borderBottom: `2px solid ${acc}` } : {}}>
                      <div className={`text-[10px] font-semibold ${ts}`}>{DAYS_S[di]}</div>
                      <div className="text-base font-bold mt-0.5"
                        style={isT ? { color: acc } : { color: dark ? "white" : "#111" }}>
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="relative">
                {HOURS.map(h => (
                  <div key={h} className="flex" style={{ height: ROW_H }}>
                    <div className={`w-14 flex-shrink-0 flex items-start pt-1.5 pr-2 justify-end text-[10px] font-mono ${ts}`}>{h}:00</div>
                    {weekDates.map((_, di) => {
                      const isTarget = dropSlot?.day === di && dropSlot.hour === h;
                      return (
                        <div key={di}
                          className={`flex-1 border-l border-t border-white/[0.06] cursor-pointer transition-colors ${isTarget ? "bg-white/25" : "hover:bg-white/[0.04]"}`}
                          onDragOver={e => { e.preventDefault(); setDropSlot({ day: di, hour: h }); }}
                          onDragLeave={() => setDropSlot(null)}
                          onDrop={e => {
                            e.preventDefault();
                            if (dragCalActId) { moveCalendarActivity(dragCalActId, di, h); setDragCalActId(null); setDropSlot(null); }
                            else if (dragActId) { dropActivityOnSlot(dragActId, di, h); setDragActId(null); setDropSlot(null); }
                          }}
                          onClick={() => openModal("addActivity", { day: di, startHour: h, scheduleNow: true })}
                        />
                      );
                    })}
                  </div>
                ))}
                <div className="absolute inset-0 pointer-events-none flex">
                  <div className="w-14 flex-shrink-0" />
                  {weekDates.map((_, di) => {
                    const dActs = visActs.filter(a => a.day === di);
                    return (
                      <div key={di} className="flex-1 relative border-l border-white/[0.06]">
                        {dActs.map(act => {
                          const proj = projects.find(p => p.id === act.projectId);
                          if (act.startHour === undefined) return null;
                          const top = (act.startHour - 7) * ROW_H;
                          const height = act.hours * ROW_H - 3;
                          const pDot = { alta: "#ef4444", media: "#f59e0b", baja: "#22c55e" }[act.priority];
                          const logrosDone = act.logros.filter(l => l.completed).length;
                          const isDone = activityDone[act.id];
                          return (
                            <div key={act.id}
                              draggable
                              onDragStart={e => { e.stopPropagation(); setDragCalActId(act.id); }}
                              onDragEnd={() => setDragCalActId(null)}
                              className={`absolute left-0.5 right-0.5 rounded-xl overflow-hidden pointer-events-auto group select-none ${isDone ? "opacity-60" : ""} ${dragCalActId === act.id ? "opacity-40 cursor-grabbing" : "cursor-grab"}`}
                              style={{ top, height, backgroundColor: ha(proj?.color ?? "#888", 0.82), border: `1px solid ${ha(proj?.color ?? "#888", 0.95)}` }}
                              onDoubleClick={e => { e.stopPropagation(); unscheduleActivity(act.projectId, act.id); }}
                              title="Arrastra para mover · Doble clic para devolver al tray">
                              <div className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-60 text-white pointer-events-none">
                                <GripVertical size={10} />
                              </div>
                              <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button className="w-5 h-5 rounded bg-black/30 hover:bg-black/60 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
                                  onClick={e => { e.stopPropagation(); setDetailAct(act); }}>
                                  <Info size={9} />
                                </button>
                                <button className="w-5 h-5 rounded bg-black/30 hover:bg-black/60 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
                                  onClick={e => { e.stopPropagation(); openEditModal(act); }}>
                                  <Pencil size={9} />
                                </button>
                                <button className="w-5 h-5 rounded bg-black/30 hover:bg-red-500/60 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
                                  onClick={e => { e.stopPropagation(); if (window.confirm(`¿Eliminar "${act.title}"?`)) deleteActivity(act.projectId, act.id); }}>
                                  <X size={9} />
                                </button>
                              </div>
                              <div className="px-2 pt-1 pb-3">
                                <div className="flex items-start gap-1 pr-16">
                                  <span className="w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: pDot }} />
                                  <span className="text-white text-[10px] font-semibold leading-tight">{act.title}</span>
                                  {isDone && <Check size={9} className="text-green-300 flex-shrink-0" />}
                                </div>
                                {act.description && <p className="text-white/60 text-[9px] mt-0.5 leading-tight">{act.description}</p>}
                                <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                  <span className="text-white/50 text-[9px]">{act.startHour}:00 · {act.hours}h</span>
                                  <span className="text-[9px]">{act.regularity === "regular" ? "🔄" : act.regularity === "semi" ? "📅" : "⭐"}</span>
                                  {act.logros.length > 0 && <span className="text-[9px] text-white/60">{logrosDone}/{act.logros.length}🏆</span>}
                                  {act.regularity === "semi" && <span className="text-[9px] text-white/50">{act.semiCompletions ?? 0}/{act.semiWeeks}sem</span>}
                                </div>
                              </div>
                              <div
                                className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize flex items-center justify-center hover:bg-white/20 transition-colors"
                                onPointerDown={e => {
                                  e.stopPropagation();
                                  e.currentTarget.setPointerCapture(e.pointerId);
                                  resizeRef.current = { actId: act.id, projId: act.projectId, startY: e.clientY, startHours: act.hours };
                                }}
                                onPointerMove={e => {
                                  if (!resizeRef.current || resizeRef.current.actId !== act.id) return;
                                  const delta = Math.round((e.clientY - resizeRef.current.startY) / ROW_H);
                                  const newH = Math.max(1, resizeRef.current.startHours + delta);
                                  if (newH === act.hours) return;
                                  setProjects(ps => ps.map(p => p.id === resizeRef.current!.projId ? {
                                    ...p, activities: p.activities.map(a => a.id === act.id ? { ...a, hours: newH } : a)
                                  } : p));
                                }}
                                onPointerUp={e => { e.currentTarget.releasePointerCapture(e.pointerId); resizeRef.current = null; }}>
                                <div className="w-8 h-0.5 rounded bg-white/40 group-hover:bg-white/80 transition-colors" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_S.map(d => <div key={d} className={`text-center text-[10px] font-semibold py-1.5 ${ts}`}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDow(mYear.y, mYear.m) }).map((_, i) => <div key={`e${i}`} className="h-20" />)}
                {Array.from({ length: daysInMonth(mYear.y, mYear.m) }, (_, i) => {
                  const dayNum = i + 1;
                  const dayOfWeek = (firstDow(mYear.y, mYear.m) + i) % 7;
                  const isT = now.getFullYear() === mYear.y && now.getMonth() === mYear.m && now.getDate() === dayNum;
                  const dateObj = new Date(mYear.y, mYear.m, dayNum);
                  const todayMon = getWeekDates(0)[0];
                  const wOff = Math.round((dateObj.getTime() - todayMon.getTime()) / (7 * 24 * 60 * 60 * 1000));
                  const dActs = visActs.filter(a => a.day === dayOfWeek && isActivityVisibleInWeek(a, wOff));
                  return (
                    <div key={dayNum} className={`h-20 rounded-xl p-1.5 ${gc} overflow-hidden`}
                      style={{ ...gs, outline: isT ? `2px solid ${acc}` : "none" }}>
                      <div className="text-[10px] font-bold mb-0.5"
                        style={isT ? { color: acc } : { color: dark ? "rgba(255,255,255,0.6)" : "#555" }}>{dayNum}</div>
                      {dActs.slice(0, 3).map(act => {
                        const proj = projects.find(p => p.id === act.projectId);
                        return <div key={act.id} className="text-[8px] px-1 py-0.5 rounded-md text-white truncate mb-0.5"
                          style={{ backgroundColor: ha(proj?.color ?? "#888", 0.75) }}>{act.title}</div>;
                      })}
                      {dActs.length > 3 && <div className={`text-[8px] ${ts}`}>+{dActs.length - 3}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showTray && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: trayExpanded ? 340 : 270, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`no-print flex-shrink-0 border-l border-white/10 ${sb} overflow-hidden`}>
              <div className="h-full flex flex-col p-3" style={{ width: trayExpanded ? 340 : 270 }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${tp}`}>Actividades</span>
                    <button onClick={() => setTrayExpanded(e => !e)}
                      className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all ${ts} hover:text-white hover:bg-white/10`}
                      title={trayExpanded ? "Colapsar" : "Expandir"}>
                      {trayExpanded ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                    </button>
                  </div>
                  <button onClick={() => openModal("addActivity")}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white cursor-pointer"
                    style={{ backgroundColor: acc }}><Plus size={11} /></button>
                </div>
                <p className={`text-[10px] ${ts} mb-2 leading-snug`}>Arrastra al calendario · 🔄 plantilla · doble clic en cal = quitar</p>
                <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                  {trayItems.length === 0 ? (
                    <div className={`text-center ${ts} text-[11px] py-6`}>
                      <p className="text-2xl mb-2">📋</p><p>Todo programado</p>
                    </div>
                  ) : trayItems.map(act => {
                    const proj = projects.find(p => p.id === act.projectId);
                    const isTemplate = act.regularity === "regular";
                    return (
                      <div key={act.id} draggable
                        onDragStart={() => { setDragActId(act.id); setTrayExpanded(false); }}
                        onDragEnd={() => setDragActId(null)}
                        className="rounded-xl p-2.5 cursor-grab active:cursor-grabbing shadow group relative"
                        style={{ backgroundColor: act.noteColor, border: isTemplate ? `2px dashed ${ha(proj?.color ?? "#888", 0.6)}` : "none" }}>
                        <div className="flex items-start gap-1.5 mb-1">
                          <span className="text-sm flex-shrink-0">{proj?.emoji}</span>
                          <p className="text-gray-800 font-semibold leading-snug flex-1"
                            style={{ fontFamily: "'Caveat', cursive", fontSize: trayExpanded ? 18 : 16 }}>{act.title}</p>
                          <button onClick={e => { e.stopPropagation(); openEditModal(act); }}
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-800 cursor-pointer flex-shrink-0">
                            <Pencil size={10} />
                          </button>
                        </div>
                        {act.logros.length > 0 && (
                          <div className="flex gap-1 mb-1 flex-wrap">
                            {act.logros.map(l => (
                              <span key={l.id} className={`text-xs ${l.completed ? "opacity-100" : "opacity-35"}`} title={l.title}>{l.icon}</span>
                            ))}
                          </div>
                        )}
                        {trayExpanded && act.logros.length > 0 && (
                          <div className="space-y-0.5 mb-1.5">
                            {act.logros.slice(0, 3).map(l => (
                              <div key={l.id} className="flex items-center gap-1">
                                <span className={`text-[10px] ${l.completed ? "" : "opacity-50"}`}>{l.icon}</span>
                                <span className="text-gray-700 text-[10px] flex-1 truncate">{l.title}</span>
                                {l.target !== undefined && (
                                  <span className="text-gray-600 text-[9px] font-mono">{l.current ?? 0}/{l.target}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-600 text-[9px] flex items-center gap-0.5"><Clock size={8} />{act.hours}h</span>
                            <span className="text-[9px]">{act.regularity === "regular" ? "🔄" : act.regularity === "semi" ? `📅${act.semiWeeks ?? 4}w` : "⭐"}</span>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: { alta: "#ef4444", media: "#f59e0b", baja: "#22c55e" }[act.priority] }} />
                          </div>
                          {!isTemplate && (
                            <button onClick={() => deleteActivity(act.projectId, act.id)}
                              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-600 transition-all cursor-pointer">
                              <Trash2 size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
