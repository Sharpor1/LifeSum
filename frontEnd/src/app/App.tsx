import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";
import type { Screen, AppCfg, Project, Activity, Logro, CustomBg } from "./types";
import { ha, isActivityVisibleInWeek } from "./utils";
import { TIPS, INIT_PROJECTS, DEFAULT_BG } from "./constants";
import * as api from "./api";
import { ConnectionError } from "./api";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import Settings from "./components/Settings";
import Modals from "./components/Modals";
import { CelebrationOverlay, LogroToast, ActivityDetailOverlay } from "./components/Overlays";
import StickerPanel from "./components/StickerPanel";
import Docs from "./components/Docs";

//── Funciones de carga desde localStorage ──

function loadCfg(): AppCfg {
  try {
    const raw = localStorage.getItem("lifesum_cfg");
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    username: "Valy", isDark: true, bgType: "image",
    bgImage: DEFAULT_BG, bgColor: "#1a0533", accentColor: "#a855f7",
    cardColor: "#ffffff", cardAlpha: 0.09, notifications: true,
    printBg: "white", fontSize: 16,
  };
}

function loadStickers(): { id: string; stickerId: string; x: number; y: number }[] {
  try {
    const raw = localStorage.getItem("lifesum_stickers");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function loadCustomStickers(): { id: string; dataUrl: string; label: string }[] {
  try {
    const raw = localStorage.getItem("lifesum_custom_stickers");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function loadCustomBackgrounds(): CustomBg[] {
  try {
    const raw = localStorage.getItem("lifesum_custom_backgrounds");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function loadActivityDone(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem("lifesum_activity_done");
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function loadCompletionLog(): Record<string, number> {
  try {
    const raw = localStorage.getItem("lifesum_completion_log");
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function loadCompletedDays(): string[] {
  try {
    const raw = localStorage.getItem("lifesum_completed_days");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10),
  ];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [cfg, setCfg] = useState<AppCfg>(loadCfg);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stickerList, setStickerList] = useState(loadStickers);
  const [customStickers, setCustomStickers] = useState(loadCustomStickers);
  const [customBackgrounds, setCustomBackgrounds] = useState(loadCustomBackgrounds);
  const [stickerPanelOpen, setStickerPanelOpen] = useState(false);
  const [weekOff, setWeekOff] = useState(0);
  const [calFilter, setCalFilter] = useState<string | null>(null);
  const [activityDone, setActivityDone] = useState(loadActivityDone);
  const [completionLog, setCompletionLog] = useState(loadCompletionLog);
  const [completedDays, setCompletedDays] = useState(loadCompletedDays);
  const [detailAct, setDetailAct] = useState<Activity | null>(null);
  const [celebrateAct, setCelebrateAct] = useState<{ title: string; emoji: string; color: string } | null>(null);
  const [celebrateLogro, setCelebrateLogro] = useState<string | null>(null);
  const [modal, setModal] = useState<"addActivity" | "editActivity" | "addProject" | null>(null);
  const [mForm, setMForm] = useState<Record<string, unknown>>({});
  const [editActTarget, setEditActTarget] = useState<Activity | null>(null);
  const [tipIdx, setTipIdx] = useState(Math.floor(Math.random() * TIPS.length));
  const [dragStickerId, setDragStickerId] = useState<string | null>(null);

  const initialized = useRef(false);
  const lastProjectsJson = useRef("");
  const needsInitSync = useRef(false);

  useEffect(() => {
    api.fetchProjects()
      .then((data) => {
        if (data.length > 0) {
          setProjects(data);
          lastProjectsJson.current = JSON.stringify(data);
        } else {
          setProjects(INIT_PROJECTS);
          lastProjectsJson.current = JSON.stringify(INIT_PROJECTS);
          needsInitSync.current = true;
        }
        initialized.current = true;
      })
      .catch((err) => {
        if (err instanceof ConnectionError) {
          toast.error(err.message, { duration: 6000 });
        } else {
          toast.error("Error al cargar datos del servidor. Usando datos locales.", { duration: 4000 });
        }
        try {
          const cached = localStorage.getItem("lifesum_projects");
          if (cached) {
            const parsed = JSON.parse(cached);
            setProjects(parsed);
            lastProjectsJson.current = cached;
          } else {
            setProjects(INIT_PROJECTS);
            lastProjectsJson.current = JSON.stringify(INIT_PROJECTS);
            needsInitSync.current = true;
          }
        } catch {
          setProjects(INIT_PROJECTS);
          lastProjectsJson.current = JSON.stringify(INIT_PROJECTS);
          needsInitSync.current = true;
        }
        initialized.current = true;
      });
  }, []);

  useEffect(() => {
    const tips = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 8000);
    return () => clearInterval(tips);
  }, []);

  useEffect(() => { localStorage.setItem("lifesum_cfg", JSON.stringify(cfg)); }, [cfg]);
  useEffect(() => { localStorage.setItem("lifesum_stickers", JSON.stringify(stickerList)); }, [stickerList]);
  useEffect(() => { localStorage.setItem("lifesum_custom_stickers", JSON.stringify(customStickers)); }, [customStickers]);
  useEffect(() => { localStorage.setItem("lifesum_custom_backgrounds", JSON.stringify(customBackgrounds)); }, [customBackgrounds]);
  useEffect(() => { localStorage.setItem("lifesum_activity_done", JSON.stringify(activityDone)); }, [activityDone]);
  useEffect(() => { localStorage.setItem("lifesum_completion_log", JSON.stringify(completionLog)); }, [completionLog]);
  useEffect(() => { localStorage.setItem("lifesum_completed_days", JSON.stringify(completedDays)); }, [completedDays]);

  useEffect(() => {
    if (!initialized.current) return;
    const json = JSON.stringify(projects);
    if (json === lastProjectsJson.current && !needsInitSync.current) return;

    localStorage.setItem("lifesum_projects", json);

    const shouldSync = needsInitSync.current;
    needsInitSync.current = false;

    const timer = setTimeout(() => {
      lastProjectsJson.current = json;
      api.syncAllProjects(projects).catch((err) => {
        if (err instanceof ConnectionError) {
          toast.error(err.message, { duration: 4000 });
        }
      });
    }, shouldSync ? 100 : 500);

    return () => clearTimeout(timer);
  }, [projects]);

  useEffect(() => {
    if (!initialized.current) return;
    const timer = setTimeout(() => {
      api.syncStickers(stickerList).catch((err) => {
        if (err instanceof ConnectionError) {
          toast.error(err.message, { duration: 4000 });
        }
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [stickerList]);

  useEffect(() => {
    if (!initialized.current) return;
    const timer = setTimeout(() => {
      api.syncCustomStickers(customStickers).catch((err) => {
        if (err instanceof ConnectionError) {
          toast.error(err.message, { duration: 4000 });
        }
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [customStickers]);

  const dark = cfg.isDark;
  const acc = cfg.accentColor;
  const gc = "backdrop-blur-xl border border-white/[0.13]";
  const gs = { backgroundColor: ha(cfg.cardColor, cfg.cardAlpha) };
  const tp = dark ? "text-white" : "text-gray-900";
  const ts = dark ? "text-white/55" : "text-gray-500";
  const sb = dark ? "bg-black/45 backdrop-blur-xl" : "bg-white/65 backdrop-blur-xl";
  const printBgColor = cfg.printBg === "white" ? "#ffffff" : cfg.bgColor;
  const allActs = projects.flatMap((p) => p.activities);
  const visActs = (calFilter ? projects.filter((p) => p.id === calFilter) : projects)
    .flatMap((p) => p.activities)
    .filter((a) => isActivityVisibleInWeek(a, weekOff));
  const trayItems = allActs.filter((a) => a.day === undefined || a.regularity === "regular");

  function upCfg(patch: Partial<AppCfg>) { setCfg((s) => ({ ...s, ...patch })); }

  function openModal(k: "addActivity" | "editActivity" | "addProject" | null, preset: Record<string, unknown> = {}) {
    setEditActTarget(null);
    setMForm({
      title: "", description: "", hours: 1, startHour: 9, day: 0,
      regularity: "regular" as const, priority: "media" as const,
      projectId: projects[0]?.id ?? "",
      noteColor: "#fef08a", scheduleNow: false,
      semiWeeks: 4, semiTarget: 0, mLogros: [] as Logro[],
      ...preset,
    });
    setModal(k);
  }

  function openEditModal(act: Activity) {
    setEditActTarget(act);
    setMForm({
      title: act.title, description: act.description, hours: act.hours,
      startHour: act.startHour ?? 9, day: act.day ?? 0,
      regularity: act.regularity, priority: act.priority,
      projectId: act.projectId, noteColor: act.noteColor,
      scheduleNow: act.day !== undefined,
      semiWeeks: act.semiWeeks ?? 4, semiTarget: act.semiTarget ?? 0,
      mLogros: act.logros as Logro[],
    });
    setModal("editActivity");
  }

  function updateLogroCounter(projId: string, actId: string, logroId: string, delta: number) {
    setProjects((ps) => ps.map((p) => p.id !== projId ? p : {
      ...p, activities: p.activities.map((a) => a.id !== actId ? a : {
        ...a, logros: a.logros.map((l) => {
          if (l.id !== logroId || l.target === undefined) return l;
          const newCur = Math.max(0, Math.min(l.target, (l.current ?? 0) + delta));
          const justCompleted = newCur >= l.target && (l.current ?? 0) < l.target;
          if (justCompleted) {
            setCelebrateLogro(l.title);
            setTimeout(() => setCelebrateLogro(null), 2500);
          }
          return { ...l, current: newCur, completed: newCur >= l.target };
        })
      })
    }));
  }

  function toggleActivityLogro(projId: string, actId: string, logroId: string) {
    setProjects((ps) => ps.map((p) => p.id !== projId ? p : {
      ...p, activities: p.activities.map((a) => a.id !== actId ? a : {
        ...a, logros: a.logros.map((l) => {
          if (l.id !== logroId) return l;
          if (!l.completed) {
            setCelebrateLogro(l.title);
            setTimeout(() => setCelebrateLogro(null), 2500);
          }
          return { ...l, completed: !l.completed };
        })
      })
    }));
  }

  function toggleProjectLogro(projId: string, logroId: string) {
    setProjects((ps) => ps.map((p) => p.id === projId ? {
      ...p, logros: p.logros.map((l) => l.id === logroId ? { ...l, completed: !l.completed } : l)
    } : p));
  }

  function handleStickerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCustomStickers((s) => [...s, { id: Math.random().toString(36).slice(2, 9), dataUrl, label: file.name.replace(/\.[^/.]+$/, "") }]);
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = "";
  }

  function handleBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCustomBackgrounds((s) => [...s, { id: Math.random().toString(36).slice(2, 9), dataUrl, label: file.name.replace(/\.[^/.]+$/, "") }]);
      upCfg({ bgImage: dataUrl, bgType: "image" });
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = "";
  }

  return (
    <div className={`h-screen w-screen overflow-hidden flex ${dark ? "dark" : ""}`} style={{ fontSize: cfg.fontSize }}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: dark ? "#1f1f2e" : "#fff", color: dark ? "#fff" : "#111", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` },
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body, #root { background: ${printBgColor} !important; }
          .print-bg-hidden { display: none !important; }
        }
      ` }} />

      {cfg.bgType === "image" ? (
        <div className="fixed inset-0 z-0 print-bg-hidden"
          style={{ backgroundImage: `url(${cfg.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      ) : (
        <div className="fixed inset-0 z-0 print-bg-hidden" style={{ backgroundColor: cfg.bgColor }} />
      )}
      <div className={`fixed inset-0 z-0 print-bg-hidden ${dark ? "bg-black/50" : "bg-white/20"}`} />

      <Sidebar screen={screen} setScreen={setScreen} cfg={cfg} upCfg={upCfg} ts={ts} sb={sb} />

      <main className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {screen === "dashboard" && (
            <Dashboard
              cfg={cfg} projects={projects} setProjects={setProjects}
              allActs={allActs} weekOff={weekOff} calFilter={calFilter}
              setCalFilter={setCalFilter} setScreen={setScreen}
              openModal={openModal} openEditModal={openEditModal}
              activityDone={activityDone} setActivityDone={setActivityDone}
              completionLog={completionLog} setCompletionLog={setCompletionLog}
              completedDays={completedDays} setCompletedDays={setCompletedDays}
              setCelebrateAct={setCelebrateAct} setCelebrateLogro={setCelebrateLogro}
              updateLogroCounter={updateLogroCounter} toggleActivityLogro={toggleActivityLogro}
              stickerList={stickerList} setStickerList={setStickerList}
              customStickers={customStickers} handleStickerUpload={handleStickerUpload}
              dragStickerId={dragStickerId} setDragStickerId={setDragStickerId}
              dark={dark} acc={acc} tp={tp} ts={ts} gc={gc} gs={gs} sb={sb}
            />
          )}
          {screen === "calendar" && (
            <Calendar
              cfg={cfg} projects={projects} setProjects={setProjects}
              allActs={allActs} visActs={visActs} trayItems={trayItems}
              weekOff={weekOff} setWeekOff={setWeekOff}
              calFilter={calFilter} setCalFilter={setCalFilter}
              openModal={openModal} openEditModal={openEditModal}
              setDetailAct={setDetailAct}
              activityDone={activityDone}
              dark={dark} acc={acc} tp={tp} ts={ts} gc={gc} gs={gs} sb={sb}
            />
          )}
          {screen === "settings" && (
            <Settings
              cfg={cfg} upCfg={upCfg} projects={projects}
              setProjects={setProjects} allActs={allActs}
              openModal={openModal} toggleProjectLogro={toggleProjectLogro}
              customBackgrounds={customBackgrounds}
              setCustomBackgrounds={setCustomBackgrounds}
              handleBackgroundUpload={handleBackgroundUpload}
              dark={dark} acc={acc} tp={tp} ts={ts} gc={gc} gs={gs}
            />
          )}
          {screen === "docs" && (
            <Docs dark={dark} acc={acc} tp={tp} ts={ts} gc={gc} gs={gs} />
          )}
        </AnimatePresence>
      </main>

      <StickerPanel
        stickerPanelOpen={stickerPanelOpen} setStickerPanelOpen={setStickerPanelOpen}
        setDragStickerId={setDragStickerId}
        customStickers={customStickers} handleStickerUpload={handleStickerUpload}
        dark={dark} acc={acc} gc={gc} gs={gs} ts={ts} tp={tp}
      />

      <CelebrationOverlay celebrateAct={celebrateAct} />
      <LogroToast celebrateLogro={celebrateLogro} />
      <ActivityDetailOverlay
        detailAct={detailAct} setDetailAct={setDetailAct}
        projects={projects} openEditModal={openEditModal}
      />

      <Modals
        modal={modal} setModal={setModal}
        mForm={mForm} setMForm={setMForm}
        editActTarget={editActTarget} setEditActTarget={setEditActTarget}
        projects={projects} setProjects={setProjects}
        weekOff={weekOff} acc={acc}
      />
    </div>
  );
}
