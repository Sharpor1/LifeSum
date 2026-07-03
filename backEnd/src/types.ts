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
  id: string;
  title: string;
  description: string;
  hours: number;
  day?: number;
  startHour?: number;
  regularity: "regular" | "semi" | "única";
  priority: "alta" | "media" | "baja";
  projectId: string;
  noteColor: string;
  logros: Logro[];
  schedWeek?: number;
  semiWeeks?: number;
  semiTarget?: number;
  semiCompletions?: number;
}

export interface PLink {
  id: string;
  label: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  emoji: string;
  description: string;
  links: PLink[];
  activities: Activity[];
  logros: Logro[];
}

export interface Sticker {
  id: string;
  stickerId: string;
  x: number;
  y: number;
}

export interface ActivityCompletion {
  id: string;
  activityId: string;
  completedAt: string;
}

export interface CustomSticker {
  id: string;
  dataUrl: string;
  label: string;
}

export interface CustomBackground {
  id: string;
  filePath: string;
  label: string;
}
