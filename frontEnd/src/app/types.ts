export type Screen = "dashboard" | "calendar" | "settings";
export type Regularity = "regular" | "semi" | "única";
export type Priority = "alta" | "media" | "baja";
export type ModalKind = "addActivity" | "editActivity" | "addProject" | null;

export interface Logro {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
  current?: number;
  target?: number;
  triggerActivityId?: string;
  triggerCount?: number;
}

export interface Activity {
  id: string; title: string; description: string;
  hours: number;
  day?: number;
  startHour?: number;
  regularity: Regularity; priority: Priority; projectId: string;
  noteColor: string;
  logros: Logro[];
  schedWeek?: number;
  semiWeeks?: number;
  semiTarget?: number;
  semiCompletions?: number;
}

export interface PLink { id: string; label: string; url: string; }

export interface Project {
  id: string; name: string; color: string; emoji: string;
  description: string; links: PLink[]; activities: Activity[];
  logros: Logro[];
}

export interface AppCfg {
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
