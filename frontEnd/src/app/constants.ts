import type { Project } from "./types";

export const DEFAULT_BG = "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1920&h=1080&fit=crop&auto=format";
export const HOURS = Array.from({ length: 17 }, (_, i) => i + 7);
export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
export const DAYS_S = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
export const ROW_H = 58;
export const NOTE_COLORS = ["#fef08a", "#86efac", "#93c5fd", "#fda4af", "#fed7aa", "#c4b5fd", "#67e8f9", "#bbf7d0"];
export const PROJ_COLORS = ["#a855f7", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#3b82f6", "#f97316"];
export const EMOJIS = ["🎮", "🎙️", "🛍️", "🎨", "📚", "💼", "🎵", "🌟", "💻", "📸", "🎬", "🏋️"];
export const LOGRO_ICONS = ["🏆", "⭐", "🎯", "🔥", "💎", "🚀", "👑", "✅", "🎖", "💫", "📈", "🥇", "📄", "🎬", "🎨", "🎙️"];
export const TIPS = [
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

export const INIT_PROJECTS: Project[] = [
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
