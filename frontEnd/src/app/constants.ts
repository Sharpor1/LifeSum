import type { Logro, Project } from "./types";

function uid() { return Math.random().toString(36).slice(2, 9); }

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

// Devuelve una copia de los proyectos por defecto con IDs únicos. Esto evita
// que dos usuarios compartan los mismos IDs globales (claves primarias), de
// modo que cada usuario tenga sus propias tareas ancladas a su cuenta.
export function getDefaultProjects(): Project[] {
  const newId = () => `d_${uid()}${uid()}`;
  const logger = () => `lg_${uid()}${uid()}`;
  const projectIdMap = new Map<string, string>();
  const activityIdMap = new Map<string, string>();
  const logroIdMap = new Map<string, string>();

  function remap<T extends string, V>(map: Map<string, V>, oldId: string, make: () => V): V {
    const existing = map.get(oldId);
    if (existing) return existing;
    const fresh = make();
    map.set(oldId, fresh);
    return fresh;
  }

  const remapLogro = (l: Logro): Logro => ({
    ...l,
    id: remap(logroIdMap, l.id, logger),
    triggerActivityId: l.triggerActivityId
      ? (activityIdMap.get(l.triggerActivityId) ?? l.triggerActivityId)
      : undefined,
  });

  const clone = (p: Project): Project => {
    const pId = remap(projectIdMap, p.id, newId);
    const activities = p.activities.map((a) => ({
      ...a,
      id: remap(activityIdMap, a.id, newId),
      projectId: pId,
      logros: a.logros.map(remapLogro),
    }));
    return {
      ...p,
      id: pId,
      activities,
      logros: p.logros.map(remapLogro),
      links: p.links.map((l) => ({ ...l, id: newId() })),
    };
  };

  return INIT_PROJECTS.map(clone);
}

export const INIT_PROJECTS: Project[] = [
  {
    id: "p1", name: "Rutina diaria", color: "#a855f7", emoji: "🌅",
    description: "Hábitos y pequeñas tareas para llevar el día al día",
    links: [],
    logros: [
      { id: "lg1", title: "30 días seguidos de hábitos", icon: "🌟", completed: false, current: 12, target: 30 },
      { id: "lg2", title: "Primera semana completa", icon: "✅", completed: true },
      { id: "lg3", title: "Completar 20 hábitos este mes", icon: "🔁", completed: false, current: 8, target: 20, triggerActivityId: "a1", triggerCount: 20 },
    ],
    activities: [
      {
        id: "a1", title: "Pasear al perro", description: "Media hora por el parque", hours: 1, startHour: 8, day: 1,
        regularity: "regular", priority: "alta", projectId: "p1", noteColor: "#c4b5fd", schedWeek: 0,
        logros: [
          { id: "al1", title: "Completar 5 paseos", icon: "🐕", completed: false, current: 3, target: 5 },
          { id: "al2", title: "Probar una ruta nueva", icon: "🗺️", completed: false },
        ],
      },
      {
        id: "a2", title: "Regar las plantas", description: "", hours: 1, startHour: 19, day: 3,
        regularity: "regular", priority: "media", projectId: "p1", noteColor: "#ddd6fe", schedWeek: 0,
        logros: [{ id: "al3", title: "Mantener vivas todas", icon: "🌿", completed: false }],
      },
      {
        id: "a3", title: "Ordenar la casa", description: "Limpieza semanal general", hours: 2,
        regularity: "semi", priority: "media", projectId: "p1", noteColor: "#a5b4fc",
        schedWeek: 0, semiWeeks: 2,
        logros: [
          { id: "al4", title: "Reciclar todo", icon: "♻️", completed: false, current: 0, target: 1 },
          { id: "al5", title: "Despejar una estancia", icon: "🧹", completed: false },
        ],
      },
      {
        id: "a9", title: "Hacer la compra semanal", description: "Lista de la despensa", hours: 2,
        regularity: "única", priority: "media", projectId: "p1", noteColor: "#ede9fe",
        schedWeek: 0, logros: [],
      },
    ],
  },
  {
    id: "p2", name: "Hobbies", color: "#06b6d4", emoji: "🎨",
    description: "Tiempo para las aficiones y el aprendizaje",
    links: [],
    logros: [
      { id: "lg4", title: "50 horas de práctica", icon: "⏱️", completed: false, current: 22, target: 50 },
      { id: "lg5", title: "Asistir a 8 clases", icon: "🎹", completed: false, current: 2, target: 8, triggerActivityId: "a4", triggerCount: 8 },
    ],
    activities: [
      {
        id: "a5", title: "Repasar apuntes", description: "Repaso de lo aprendido", hours: 1, startHour: 10, day: 0,
        regularity: "regular", priority: "media", projectId: "p2", noteColor: "#a5f3fc", schedWeek: 0,
        logros: [{ id: "al6", title: "Tomar notas claras", icon: "📓", completed: false }],
      },
      {
        id: "a4", title: "Clases de piano", description: "Lección semanal con el profesor", hours: 2,
        regularity: "semi", priority: "alta", projectId: "p2", noteColor: "#67e8f9",
        schedWeek: 0, semiWeeks: 4, semiTarget: 4,
        logros: [
          { id: "al7", title: "Dominar la pieza nueva", icon: "🎶", completed: false },
          { id: "al8", title: "Practicar 20 minutos al día", icon: "✳️", completed: false },
        ],
      },
      {
        id: "a6", title: "Practicar guitarra", description: "", hours: 1,
        regularity: "semi", priority: "media", projectId: "p2", noteColor: "#cffafe",
        schedWeek: 0, semiWeeks: 3,
        logros: [{ id: "al9", title: "Aprender un acorde nuevo", icon: "🎸", completed: false }],
      },
    ],
  },
  {
    id: "p3", name: "Vida y ocio", color: "#22c55e", emoji: "🌿",
    description: "Bienestar, ejercicio y tiempo de calidad",
    links: [],
    logros: [
      { id: "lg6", title: "Primer mes de entrenamiento", icon: "💪", completed: true },
      { id: "lg7", title: "10 sesiones de ejercicio", icon: "🏃", completed: false, current: 4, target: 10 },
    ],
    activities: [
      {
        id: "a8", title: "Salir a correr", description: "", hours: 1, startHour: 7, day: 6,
        regularity: "regular", priority: "baja", projectId: "p3", noteColor: "#bbf7d0", schedWeek: 0,
        logros: [],
      },
      {
        id: "a7", title: "Hora de lectura", description: "Leer un rato al aire libre", hours: 1,
        regularity: "única", priority: "media", projectId: "p3", noteColor: "#86efac",
        schedWeek: 0, logros: [{ id: "al10", title: "Terminar un capítulo", icon: "📖", completed: false }],
      },
    ],
  },
];
