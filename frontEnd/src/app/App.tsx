import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Home, Calendar, Settings, Plus, X, Trash2, ExternalLink,
  Sun, Moon, ChevronLeft, ChevronRight, Clock, Bell,
  User, Pencil, Printer, Palette, Check, Flag,
  Trophy, Target, Upload, Timer, ChevronDown, ChevronUp,
  SkipForward, Minus, GripVertical, Info, Type,
} from "lucide-react";

// ── SVG Sticker Illustrations ─────────────────────────────────────────

function StickerStar() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <path d="M22 4L26.5 15.5H39L28.8 22.8L32.7 34.5L22 27.5L11.3 34.5L15.2 22.8L5 15.5H17.5L22 4Z" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M22 9L25.3 17.8H34.5L27.2 23L29.8 32L22 27L14.2 32L16.8 23L9.5 17.8H18.7L22 9Z" fill="#fbbf24" opacity="0.6" />
    </svg>
  );
}
function StickerHeart() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <path d="M22 36C22 36 5 25 5 14C5 9.6 8.6 6 13 6C16.4 6 19.4 8 21 11C22.6 8 25.6 6 29 6C33.4 6 37 9.6 37 14C37 25 22 36 22 36Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.2" />
      <path d="M22 30C22 30 10 22 10 15C10 12.2 12.2 10 15 10C17.2 10 19.1 11.3 20.1 13.2C21.1 11.3 23 10 25 10C27.8 10 30 12.2 30 15C30 22 22 30 22 30Z" fill="#fda4af" opacity="0.6" />
    </svg>
  );
}
function StickerSparkle() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <path d="M22 3L24.5 19.5L41 22L24.5 24.5L22 41L19.5 24.5L3 22L19.5 19.5L22 3Z" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="3" fill="#c4b5fd" />
      <circle cx="34" cy="10" r="2.5" fill="#ddd6fe" />
      <circle cx="10" cy="34" r="2.5" fill="#ddd6fe" />
      <circle cx="34" cy="34" r="3" fill="#c4b5fd" />
    </svg>
  );
}
function StickerMoon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <path d="M25 5C16 5 9 12 9 21C9 30 16 37 25 37C29.5 37 33.6 35.2 36.5 32.2C33.8 33 30.7 32.5 28 30.8C22 27 20 20 22.5 14C23.5 11 25 8 25 5Z" fill="#818cf8" stroke="#6366f1" strokeWidth="1.2" />
      <circle cx="32" cy="11" r="2.5" fill="#e0e7ff" />
      <circle cx="38" cy="18" r="1.8" fill="#e0e7ff" />
      <circle cx="35" cy="7" r="1.2" fill="#e0e7ff" />
    </svg>
  );
}
function StickerRainbow() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <path d="M5 30C5 17.8 12.6 8 22 8C31.4 8 39 17.8 39 30" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M8 30C8 19.2 14.4 11 22 11C29.6 11 36 19.2 36 30" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M11 30C11 20.5 16.2 14 22 14C27.8 14 33 20.5 33 30" stroke="#eab308" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M14 30C14 22 17.8 17 22 17C26.2 17 30 22 30 30" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M17 30C17 23.6 19.3 20 22 20C24.7 20 27 23.6 27 30" stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="7" cy="31" rx="4" ry="3.5" fill="white" opacity="0.95" />
      <ellipse cx="37" cy="31" rx="4" ry="3.5" fill="white" opacity="0.95" />
    </svg>
  );
}
function StickerCloud() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <circle cx="14" cy="26" r="8" fill="#93c5fd" />
      <circle cx="28" cy="25" r="9" fill="#93c5fd" />
      <circle cx="21" cy="21" r="9" fill="#bfdbfe" />
      <ellipse cx="21" cy="28" rx="14" ry="7" fill="#dbeafe" />
      <circle cx="21" cy="21" r="8" fill="#eff6ff" />
    </svg>
  );
}
function StickerLightning() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <circle cx="22" cy="22" r="18" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
      <path d="M26 6L14 23H22L18 38L32 19H23L26 6Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
function StickerFlower() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <ellipse cx="22" cy="9" rx="5.5" ry="9" fill="#fda4af" />
      <ellipse cx="22" cy="9" rx="5.5" ry="9" fill="#fb7185" transform="rotate(72 22 22)" />
      <ellipse cx="22" cy="9" rx="5.5" ry="9" fill="#fda4af" transform="rotate(144 22 22)" />
      <ellipse cx="22" cy="9" rx="5.5" ry="9" fill="#fb7185" transform="rotate(216 22 22)" />
      <ellipse cx="22" cy="9" rx="5.5" ry="9" fill="#fda4af" transform="rotate(288 22 22)" />
      <circle cx="22" cy="22" r="7" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.2" />
    </svg>
  );
}
function StickerGem() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <path d="M22 5L38 15V29L22 39L6 29V15L22 5Z" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M22 5L38 15H6L22 5Z" fill="#67e8f9" />
      <path d="M22 5L6 15L22 24L38 15L22 5Z" fill="#a5f3fc" opacity="0.6" />
    </svg>
  );
}
function StickerCrown() {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <path d="M6 31L11 13L22 23L33 8L38 22L42 13L39 31H5Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
      <rect x="5" y="29" width="34" height="8" rx="2.5" fill="#d97706" />
      <circle cx="22" cy="16" r="3.5" fill="#ef4444" stroke="#dc2626" strokeWidth="0.8" />
      <circle cx="11" cy="22" r="2.5" fill="#ec4899" />
      <circle cx="33" cy="18" r="2.5" fill="#22c55e" />
    </svg>
  );
}

const STICKER_DEFS = [
  { id: "star", label: "Estrella", Component: StickerStar },
  { id: "heart", label: "Corazón", Component: StickerHeart },
  { id: "sparkle", label: "Brillo", Component: StickerSparkle },
  { id: "moon", label: "Luna", Component: StickerMoon },
  { id: "rainbow", label: "Arcoíris", Component: StickerRainbow },
  { id: "cloud", label: "Nube", Component: StickerCloud },
  { id: "lightning", label: "Rayo", Component: StickerLightning },
  { id: "flower", label: "Flor", Component: StickerFlower },
  { id: "gem", label: "Gema", Component: StickerGem },
  { id: "crown", label: "Corona", Component: StickerCrown },
];

// ── Types ─────────────────────────────────────────────────────────────

type Screen = "dashboard" | "calendar" | "settings";
type Regularity = "regular" | "semi" | "única";
type Priority = "alta" | "media" | "baja";
type ModalKind = "addActivity" | "editActivity" | "addProject" | null;

interface Logro {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
  current?: number;   // for numeric progress
  target?: number;
  // auto-complete trigger
  triggerActivityId?: string;
  triggerCount?: number;
}

interface Activity {
  id: string; title: string; description: string;
  hours: number;
  day?: number;
  startHour?: number;
  regularity: Regularity; priority: Priority; projectId: string;
  noteColor: string;
  logros: Logro[];          // goals for this activity
  schedWeek?: number;       // weekOff when scheduled (for semi/única)
  semiWeeks?: number;       // how many weeks to repeat (semi)
  semiTarget?: number;      // stop after N completions (semi, optional)
  semiCompletions?: number; // how many completions done so far
}

interface PLink { id: string; label: string; url: string; }

interface Project {
  id: string; name: string; color: string; emoji: string;
  description: string; links: PLink[]; activities: Activity[];
  logros: Logro[];
}

interface AppCfg {
  username: string;
  isDark: boolean;
  bgType: "image" | "color";
  bgImage: string;
  bgColor: string;
  accentColor: string;
  cardColor: string;
  cardAlpha: number;
  notifications: boolean;
  printBg: "white" | "solid";
  fontSize: number;
}

// ── Constants ─────────────────────────────────────────────────────────

const DEFAULT_BG = "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1920&h=1080&fit=crop&auto=format";
const HOURS = Array.from({ length: 17 }, (_, i) => i + 7);
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const DAYS_S = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const ROW_H = 58;
const NOTE_COLORS = ["#fef08a", "#86efac", "#93c5fd", "#fda4af", "#fed7aa", "#c4b5fd", "#67e8f9", "#bbf7d0"];
const PROJ_COLORS = ["#a855f7", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#3b82f6", "#f97316"];
const EMOJIS = ["🎮", "🎙️", "🛍️", "🎨", "📚", "💼", "🎵", "🌟", "💻", "📸", "🎬", "🏋️"];
const LOGRO_ICONS = ["🏆", "⭐", "🎯", "🔥", "💎", "🚀", "👑", "✅", "🎖", "💫", "📈", "🥇", "📄", "🎬", "🎨", "🎙️"];
const TIPS = [
  "¡La constancia hace al maestro! Cada día que apareces suma. 🌟",
  "Pequeños pasos construyen las metas más grandes. ✨",
  "¿Todo listo para hoy? Revisa tu setup y empieza con energía. 🎯",
  "La hidratación es clave en sesiones largas. ¡Bebe agua! 💧",
  "¡Tu comunidad te espera! Gran día para crear. 🎮",
  "Una actividad a la vez. La multitarea es el enemigo del flujo. 🧠",
  "Descansar también es productivo. 5 min cada hora marcan la diferencia. 🌿",
  "¡El progreso no siempre se ve, pero siempre está ocurriendo! 📈",
  "Celebra los pequeños logros — son los ladrillos de los grandes. 🏆",
  "¡Hoy puede ser el mejor stream / video que hayas hecho! Sal y compruébalo. 🚀",
];

function computeStreak(days: string[]): number {
  if (days.length === 0) return 0;
  let streak = 0;
  const d = new Date();
  const today = d.toISOString().slice(0, 10);
  if (!days.includes(today)) d.setDate(d.getDate() - 1);
  for (let i = 0; i < 365; i++) {
    if (days.includes(d.toISOString().slice(0, 10))) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

const INIT_PROJECTS: Project[] = [
  {
    id: "p1", name: "Stream", color: "#a855f7", emoji: "🎮",
    description: "Contenido en vivo, gaming y entretenimiento",
    links: [
      { id: "l1", label: "Twitch", url: "https://twitch.tv" },
      { id: "l2", label: "StreamLabs", url: "https://streamlabs.com" },
    ],
    logros: [
      { id: "lg1", title: "Alcanzar 500 viewers", icon: "👁", completed: false, current: 230, target: 500 },
      { id: "lg2", title: "Primer suscriptor especial", icon: "⭐", completed: true },
      { id: "lg3", title: "Completar 8 streams gaming", icon: "🎮", completed: false, current: 3, target: 8, triggerActivityId: "a1", triggerCount: 8 },
    ],
    activities: [
      {
        id: "a1", title: "Stream gaming", description: "Con lluvia de metal", hours: 3, startHour: 20, day: 1,
        regularity: "regular", priority: "alta", projectId: "p1", noteColor: "#c4b5fd", schedWeek: 0,
        logros: [
          { id: "al1", title: "Llegar a 50 viewers", icon: "👁", completed: false, current: 45, target: 50 },
          { id: "al2", title: "Hacer clip del stream", icon: "🎬", completed: false },
        ],
      },
      {
        id: "a2", title: "Stream variedades", description: "", hours: 2, startHour: 19, day: 3,
        regularity: "regular", priority: "media", projectId: "p1", noteColor: "#ddd6fe", schedWeek: 0,
        logros: [{ id: "al3", title: "Subir highlight a YouTube", icon: "📹", completed: false }],
      },
      {
        id: "a3", title: "Stream especial", description: "Aniversario del canal", hours: 4,
        regularity: "semi", priority: "alta", projectId: "p1", noteColor: "#a5b4fc",
        schedWeek: 0, semiWeeks: 3,
        logros: [
          { id: "al4", title: "Llegar a 200 viewers", icon: "🔥", completed: false, current: 0, target: 200 },
          { id: "al5", title: "Hacer sorteo en directo", icon: "🎁", completed: false },
        ],
      },
      {
        id: "a9", title: "Preparar overlay", description: "Nuevo overlay para el canal", hours: 1,
        regularity: "única", priority: "media", projectId: "p1", noteColor: "#ede9fe",
        schedWeek: 0, logros: [],
      },
    ],
  },
  {
    id: "p2", name: "ASMR", color: "#06b6d4", emoji: "🎙️",
    description: "Videos ASMR para YouTube y otras plataformas",
    links: [
      { id: "l3", label: "YouTube", url: "https://youtube.com" },
      { id: "l4", label: "Patreon", url: "https://patreon.com" },
    ],
    logros: [
      { id: "lg4", title: "100k vistas en ASMR", icon: "🎙", completed: false, current: 45000, target: 100000 },
      { id: "lg5", title: "Subir 4 videos ASMR", icon: "📹", completed: false, current: 2, target: 4, triggerActivityId: "a4", triggerCount: 4 },
    ],
    activities: [
      {
        id: "a5", title: "Revisar ASMR", description: "Control de calidad", hours: 1, startHour: 10, day: 0,
        regularity: "regular", priority: "media", projectId: "p2", noteColor: "#a5f3fc", schedWeek: 0,
        logros: [{ id: "al6", title: "Verificar audio 48kHz", icon: "🎧", completed: false }],
      },
      {
        id: "a4", title: "Grabar ASMR", description: "Con buen micrófono", hours: 2,
        regularity: "semi", priority: "alta", projectId: "p2", noteColor: "#67e8f9",
        schedWeek: 0, semiWeeks: 4, semiTarget: 4,
        logros: [
          { id: "al7", title: "Audio sin ruido de fondo", icon: "✅", completed: false },
          { id: "al8", title: "Video de +20 minutos", icon: "⏱", completed: false },
        ],
      },
      {
        id: "a6", title: "Editar y subir video", description: "", hours: 2,
        regularity: "semi", priority: "media", projectId: "p2", noteColor: "#cffafe",
        schedWeek: 0, semiWeeks: 4,
        logros: [{ id: "al9", title: "Thumbnail personalizado", icon: "🖼", completed: false }],
      },
    ],
  },
  {
    id: "p3", name: "Merch", color: "#22c55e", emoji: "🛍️",
    description: "Diseño y venta de merchandise oficial",
    links: [{ id: "l5", label: "Tienda", url: "https://example.com" }],
    logros: [
      { id: "lg6", title: "Primera venta", icon: "💰", completed: true },
      { id: "lg7", title: "10 diseños publicados", icon: "🎨", completed: false, current: 4, target: 10 },
    ],
    activities: [
      {
        id: "a8", title: "Revisar pedidos", description: "", hours: 1, startHour: 12, day: 6,
        regularity: "regular", priority: "baja", projectId: "p3", noteColor: "#bbf7d0", schedWeek: 0,
        logros: [],
      },
      {
        id: "a7", title: "Nuevo diseño de merch", description: "Ideas para nueva colección", hours: 2,
        regularity: "única", priority: "media", projectId: "p3", noteColor: "#86efac",
        schedWeek: 0, logros: [{ id: "al10", title: "Usar paleta de marca", icon: "🎨", completed: false }],
      },
    ],
  },
];

// ── Utilities ─────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 9); }

function getWeekDates(off = 0) {
  const now = new Date();
  const dow = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1) + off * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon); d.setDate(mon.getDate() + i); return d;
  });
}

function ha(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function todayIdx() { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; }
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDow(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

function isActivityVisibleInWeek(act: Activity, week: number): boolean {
  if (act.day === undefined) return false;
  if (act.regularity === "regular") return true;
  const base = act.schedWeek ?? 0;
  if (act.regularity === "única") return base === week;
  // semi
  const elapsed = week - base;
  if (elapsed < 0) return false;
  const maxWeeks = act.semiWeeks ?? 4;
  if (act.semiTarget !== undefined) {
    return elapsed < maxWeeks && (act.semiCompletions ?? 0) < act.semiTarget;
  }
  return elapsed < maxWeeks;
}

function formatMins(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m > 0 ? m + "min" : ""}`;
  return `${m}min`;
}

// ── App ───────────────────────────────────────────────────────────────

export default function App() {
  const now = new Date();

  const [screen, setScreen] = useState<Screen>("dashboard");
  const [cfg, setCfg] = useState<AppCfg>({
    username: "Valy",
    isDark: true,
    bgType: "image",
    bgImage: DEFAULT_BG,
    bgColor: "#1a0533",
    accentColor: "#a855f7",
    cardColor: "#ffffff",
    cardAlpha: 0.09,
    notifications: true,
    printBg: "white",
    fontSize: 16,
  });
  const [projects, setProjects] = useState<Project[]>(INIT_PROJECTS);
  const [stickerList, setStickerList] = useState<{ id: string; stickerId: string; x: number; y: number }[]>([]);
  const [customStickers, setCustomStickers] = useState<{ id: string; dataUrl: string; label: string }[]>([]);
  const [stickerPanelOpen, setStickerPanelOpen] = useState(false);

  // Calendar
  const [weekOff, setWeekOff] = useState(0);
  const [calFilter, setCalFilter] = useState<string | null>(null);
  const [calView, setCalView] = useState<"week" | "month">("week");
  const [showTray, setShowTray] = useState(true);
  const [mYear, setMYear] = useState({ y: now.getFullYear(), m: now.getMonth() });

  // Dashboard
  const [tipOpen, setTipOpen] = useState(true);
  const [tipIdx, setTipIdx] = useState(Math.floor(Math.random() * TIPS.length));
  const [dragStickerId, setDragStickerId] = useState<string | null>(null);
  const [extendedMins, setExtendedMins] = useState(0);
  const [activityDone, setActivityDone] = useState<Record<string, boolean>>({});
  const [completionLog, setCompletionLog] = useState<Record<string, number>>({});
  const [completedDays, setCompletedDays] = useState<string[]>([
    new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10),
  ]);
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));

  // Calendar drag-move & resize
  const [dragActId, setDragActId] = useState<string | null>(null);
  const [dragCalActId, setDragCalActId] = useState<string | null>(null);
  const [dropSlot, setDropSlot] = useState<{ day: number; hour: number } | null>(null);
  const resizeRef = useRef<{ actId: string; projId: string; startY: number; startHours: number } | null>(null);
  const [trayExpanded, setTrayExpanded] = useState(true);
  const [detailAct, setDetailAct] = useState<Activity | null>(null);
  const [celebrateAct, setCelebrateAct] = useState<{ title: string; emoji: string; color: string } | null>(null);
  const [celebrateLogro, setCelebrateLogro] = useState<string | null>(null);

  // Modal
  const [modal, setModal] = useState<ModalKind>(null);
  const [mForm, setMForm] = useState<Record<string, unknown>>({});
  const [editActTarget, setEditActTarget] = useState<Activity | null>(null);

  // Settings
  const [newLL, setNewLL] = useState("");
  const [newLU, setNewLU] = useState("");
  const [bgInput, setBgInput] = useState(cfg.bgImage);

  // Logros panel
  const [logrosProjId, setLogrosProjId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live clock + tip rotation
  useEffect(() => {
    const clock = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
    }, 60000);
    const tips = setInterval(() => {
      setTipIdx(i => (i + 1) % TIPS.length);
    }, 8000);
    return () => { clearInterval(clock); clearInterval(tips); };
  }, []);

  // Derived
  const weekDates = getWeekDates(weekOff);
  const tIdx = todayIdx();
  const allActs = projects.flatMap(p => p.activities);
  const visActs = (calFilter ? projects.filter(p => p.id === calFilter) : projects)
    .flatMap(p => p.activities)
    .filter(a => isActivityVisibleInWeek(a, weekOff));
  const trayItems = allActs.filter(a => a.day === undefined || a.regularity === "regular");

  // Current activity (from current week, today, current hour)
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

  // Theme helpers
  const dark = cfg.isDark;
  const acc = cfg.accentColor;
  const gc = "backdrop-blur-xl border border-white/[0.13]";
  const gs = { backgroundColor: ha(cfg.cardColor, cfg.cardAlpha) };
  const tp = dark ? "text-white" : "text-gray-900";
  const ts = dark ? "text-white/55" : "text-gray-500";
  const sb = dark ? "bg-black/45 backdrop-blur-xl" : "bg-white/65 backdrop-blur-xl";
  const printBgColor = cfg.printBg === "white" ? "#ffffff" : cfg.bgColor;

  function upCfg(patch: Partial<AppCfg>) { setCfg(s => ({ ...s, ...patch })); }

  const streak = computeStreak(completedDays);

  function openModal(k: ModalKind, preset: Record<string, unknown> = {}) {
    setEditActTarget(null);
    setMForm({
      title: "", description: "", hours: 1, startHour: 9, day: 0,
      regularity: "regular" as Regularity, priority: "media" as Priority,
      projectId: projects[0]?.id ?? "",
      noteColor: NOTE_COLORS[0],
      scheduleNow: false,
      semiWeeks: 4, semiTarget: 0,
      mLogros: [] as Logro[],
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
    setProjects(ps => ps.map(p => p.id !== projId ? p : {
      ...p, activities: p.activities.map(a => a.id !== actId ? a : {
        ...a, logros: a.logros.map(l => {
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

  function moveCalendarActivity(actId: string, day: number, hour: number) {
    setProjects(ps => ps.map(p => ({
      ...p, activities: p.activities.map(a => a.id === actId ? { ...a, day, startHour: hour } : a)
    })));
  }

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
        id: uid(), name: mForm.name as string, emoji: mForm.emoji as string,
        color: mForm.projColor as string, description: (mForm.projDesc as string) || "",
        links: [], activities: [], logros: [],
      }]);
    }
    setModal(null);
    setEditActTarget(null);
  }

  function dropActivityOnSlot(actId: string, day: number, hour: number) {
    const proj = projects.find(p => p.activities.some(a => a.id === actId));
    if (!proj) return;
    const act = proj.activities.find(a => a.id === actId);
    if (!act) return;
    if (act.regularity === "regular") {
      const copy: Activity = { ...act, id: uid(), regularity: "única", day, startHour: hour, schedWeek: weekOff, logros: [] };
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
      // Update activity completions
      const updatedActivities = p.activities.map(a =>
        a.id === actId && a.regularity === "semi"
          ? { ...a, semiCompletions: (a.semiCompletions ?? 0) + 1 }
          : a
      );
      // Auto-complete project logros
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

  function toggleActivityLogro(projId: string, actId: string, logroId: string) {
    setProjects(ps => ps.map(p => p.id !== projId ? p : {
      ...p, activities: p.activities.map(a => a.id !== actId ? a : {
        ...a, logros: a.logros.map(l => {
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
    setProjects(ps => ps.map(p => p.id === projId ? {
      ...p,
      logros: p.logros.map(l => l.id === logroId ? { ...l, completed: !l.completed } : l)
    } : p));
  }

  function handleStickerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setCustomStickers(s => [...s, { id: uid(), dataUrl, label: file.name.replace(/\.[^/.]+$/, "") }]);
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = "";
  }

  // ── Render ──────────────────────────────────────────────────────────

  const focusedAct = currentAct ?? nextAct;
  const focusedProj = focusedAct ? projects.find(p => p.id === focusedAct.projectId) : null;
  const isCurrentlyActive = !!currentAct;

  return (
    <div className={`h-screen w-screen overflow-hidden flex ${dark ? "dark" : ""}`} style={{ fontSize: cfg.fontSize }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body, #root { background: ${printBgColor} !important; }
          .print-bg-hidden { display: none !important; }
        }
      ` }} />

      {/* Background */}
      {cfg.bgType === "image" ? (
        <div className="fixed inset-0 z-0 print-bg-hidden"
          style={{ backgroundImage: `url(${cfg.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      ) : (
        <div className="fixed inset-0 z-0 print-bg-hidden" style={{ backgroundColor: cfg.bgColor }} />
      )}
      <div className={`fixed inset-0 z-0 print-bg-hidden ${dark ? "bg-black/50" : "bg-white/20"}`} />

      {/* ── Sidebar ── */}
      <nav className={`no-print relative z-20 w-[70px] flex flex-col items-center py-5 gap-1 ${sb} border-r border-white/10 flex-shrink-0`}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 select-none"
          style={{ backgroundColor: acc }}>
          {cfg.username.slice(0, 2).toUpperCase()}
        </div>
        {([
          { id: "dashboard" as Screen, icon: Home, label: "Inicio" },
          { id: "calendar" as Screen, icon: Calendar, label: "Cal" },
          { id: "settings" as Screen, icon: Settings, label: "Config" },
        ] as const).map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setScreen(id)}
            className={`w-14 h-14 flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-all cursor-pointer ${screen === id ? "text-white" : `${ts} hover:text-white hover:bg-white/10`}`}
            style={screen === id ? { backgroundColor: ha(acc, 0.32) } : {}}>
            <Icon size={18} /><span className="text-[9px] font-semibold tracking-wide">{label}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => upCfg({ isDark: !dark })}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${ts} hover:text-white hover:bg-white/10 transition-all cursor-pointer`}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>

      {/* ── Main ── */}
      <main className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">

          {/* ══ DASHBOARD ══ */}
          {screen === "dashboard" && (
            <motion.div key="dash"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full overflow-y-auto p-5 relative"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                if (!dragStickerId) return;
                const rect = e.currentTarget.getBoundingClientRect();
                setStickerList(s => [...s, { id: uid(), stickerId: dragStickerId, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
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

              {/* ─ ACTIVIDAD ACTUAL (big card) ─ */}
              {focusedAct && focusedProj ? (
                <motion.div
                  key={focusedAct.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-5 rounded-3xl overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${ha(focusedProj.color, 0.85)} 0%, ${ha(focusedProj.color, 0.55)} 100%)`, border: `1px solid ${ha(focusedProj.color, 0.9)}` }}>
                  {/* Header */}
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
                      {/* Time info + live clock */}
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

                  {/* Logros / goals with counters */}
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
                              {/* Counter mode for numeric logros */}
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
                                /* Checkbox mode */
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

                  {/* Action buttons */}
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
          )}

          {/* ══ CALENDAR ══ */}
          {screen === "calendar" && (
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
                          const isT = date.toDateString() === new Date().toDateString();
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
                                      {/* drag handle */}
                                      <div className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-60 text-white pointer-events-none">
                                        <GripVertical size={10} />
                                      </div>
                                      {/* action buttons */}
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
                                      {/* content */}
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
                                      {/* resize handle */}
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
                          // Calculate weekOff for this date
                          const dateObj = new Date(mYear.y, mYear.m, dayNum);
                          const todayMon = getWeekDates(0)[0];
                          const dateMon = getWeekDates(Math.round((dateObj.getTime() - todayMon.getTime()) / (7 * 24 * 60 * 60 * 1000)))[0];
                          const wOff = Math.round((dateMon.getTime() - todayMon.getTime()) / (7 * 24 * 60 * 60 * 1000));
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

                {/* Activity tray */}
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
                                {/* Logros preview */}
                                {act.logros.length > 0 && (
                                  <div className="flex gap-1 mb-1 flex-wrap">
                                    {act.logros.map(l => (
                                      <span key={l.id} className={`text-xs ${l.completed ? "opacity-100" : "opacity-35"}`} title={l.title}>{l.icon}</span>
                                    ))}
                                  </div>
                                )}
                                {/* Expanded logro details */}
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
          )}

          {/* ══ SETTINGS ══ */}
          {screen === "settings" && (
            <motion.div key="set"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full overflow-y-auto p-5">
              <h1 className={`text-2xl font-bold mb-5 ${tp}`}>Ajustes</h1>

              {/* Profile */}
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

              {/* Appearance */}
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

              {/* Notifications */}
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

              {/* Projects + Logros */}
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

                        {/* Logros panel */}
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
                                {/* Add logro */}
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
          )}

        </AnimatePresence>
      </main>

      {/* ── Floating sticker panel (fixed) ── */}
      <div className="no-print fixed bottom-5 right-5 z-30">
        <AnimatePresence>
          {stickerPanelOpen && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute bottom-12 right-0 w-56 rounded-2xl p-3 ${gc} shadow-2xl`}
              style={{ ...gs, backgroundColor: dark ? "rgba(15,10,35,0.95)" : "rgba(255,255,255,0.95)" }}>
              <p className={`text-[11px] font-semibold ${tp} mb-2`}>Stickers — arrastra al dashboard</p>
              <div className="grid grid-cols-5 gap-1.5 mb-3">
                {STICKER_DEFS.map(({ id, label, Component }) => (
                  <div key={id} draggable onDragStart={() => { setDragStickerId(id); setStickerPanelOpen(false); }}
                    className="w-9 h-9 cursor-grab hover:scale-125 transition-transform select-none" title={label}>
                    <Component />
                  </div>
                ))}
                {customStickers.map(cs => (
                  <div key={cs.id} draggable onDragStart={() => { setDragStickerId(cs.id); setStickerPanelOpen(false); }}
                    className="w-9 h-9 cursor-grab hover:scale-125 transition-transform select-none" title={cs.label}>
                    <img src={cs.dataUrl} className="w-full h-full object-contain rounded" alt={cs.label} />
                  </div>
                ))}
              </div>
              <button onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs border border-dashed border-white/30 ${ts} hover:text-white hover:border-white/60 cursor-pointer transition-all`}>
                <Upload size={12} /> Subir sticker
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleStickerUpload} className="hidden" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setStickerPanelOpen(s => !s)}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg cursor-pointer transition-all hover:scale-110"
          style={{ backgroundColor: stickerPanelOpen ? acc : ha(acc, 0.7) }}
          title="Stickers">
          {stickerPanelOpen ? <X size={18} /> : <span className="text-xl">🎨</span>}
        </button>
      </div>

      {/* ── Activity celebration ── */}
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

      {/* ── Logro mini-toast ── */}
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

      {/* ── Activity detail overlay ── */}
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

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)} />
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

                    {/* Semi config */}
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

                    {/* Schedule toggle */}
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
    </div>
  );
}

// ── Add Logro Form (isolated component to avoid hook issues) ──────────

interface AddLogroFormProps {
  projId: string;
  allActs: Activity[];
  acc: string; gc: string; gs: React.CSSProperties; tp: string; ts: string;
  onAdd: (l: Logro) => void;
}

function AddLogroForm({ projId, allActs, acc, gc, gs, tp, ts, onAdd }: AddLogroFormProps) {
  const projActs = allActs.filter(a => a.projectId === projId);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("🏆");
  const [hasTarget, setHasTarget] = useState(false);
  const [target, setTarget] = useState(100);
  const [triggerActId, setTriggerActId] = useState("");
  const [triggerCount, setTriggerCount] = useState(1);
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {!expanded ? (
        <button onClick={() => setExpanded(true)}
          className={`w-full py-1.5 rounded-xl text-[11px] border border-dashed border-white/20 ${ts} hover:text-white hover:border-white/40 cursor-pointer transition-all flex items-center justify-center gap-1`}>
          <Plus size={11} /> Agregar logro
        </button>
      ) : (
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex gap-1.5">
            <select value={icon} onChange={e => setIcon(e.target.value)}
              className="px-1 py-1 rounded-lg text-sm bg-white/10 text-white outline-none border border-white/15 cursor-pointer">
              {LOGRO_ICONS.map(i => <option key={i} value={i} className="bg-gray-900">{i}</option>)}
            </select>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título del logro..."
              className={`flex-1 px-2 py-1 rounded-lg text-xs bg-white/10 text-white outline-none border border-white/15`} />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setHasTarget(!hasTarget)}
              className={`text-[10px] px-2 py-1 rounded-lg cursor-pointer border ${hasTarget ? "text-white border-transparent" : "text-white/40 border-white/15"}`}
              style={hasTarget ? { backgroundColor: ha(acc, 0.4) } : {}}>
              {hasTarget ? "✓" : "+"} Meta numérica
            </button>
            {hasTarget && (
              <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} min="1"
                className="w-20 px-2 py-1 rounded-lg text-xs bg-white/10 text-white outline-none border border-white/15" placeholder="Meta..." />
            )}
          </div>
          {projActs.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/40 flex-shrink-0">Auto al completar:</span>
              <select value={triggerActId} onChange={e => setTriggerActId(e.target.value)}
                className="flex-1 px-2 py-1 rounded-lg text-[10px] bg-white/10 text-white outline-none border border-white/15 cursor-pointer">
                <option value="" className="bg-gray-900">— ninguna —</option>
                {projActs.map(a => <option key={a.id} value={a.id} className="bg-gray-900">{a.title}</option>)}
              </select>
              {triggerActId && (
                <input type="number" value={triggerCount} onChange={e => setTriggerCount(Number(e.target.value))} min="1" max="99"
                  className="w-12 px-1 py-1 rounded-lg text-xs bg-white/10 text-white outline-none border border-white/15" />
              )}
            </div>
          )}
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                if (!title.trim()) return;
                onAdd({
                  id: `lg${Date.now()}`, title: title.trim(), icon, completed: false,
                  current: hasTarget ? 0 : undefined,
                  target: hasTarget ? target : undefined,
                  triggerActivityId: triggerActId || undefined,
                  triggerCount: triggerActId ? triggerCount : undefined,
                });
                setTitle(""); setHasTarget(false); setTriggerActId(""); setExpanded(false);
              }}
              className="flex-1 py-1.5 rounded-xl text-[11px] text-white font-medium cursor-pointer"
              style={{ backgroundColor: acc }}>Agregar</button>
            <button onClick={() => setExpanded(false)}
              className={`px-3 py-1.5 rounded-xl text-[11px] cursor-pointer border border-white/15 ${ts}`}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
