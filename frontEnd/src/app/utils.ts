import type { Activity } from "./types";

export function uid() { return Math.random().toString(36).slice(2, 9); }

export function getWeekDates(off = 0) {
  const now = new Date();
  const dow = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1) + off * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon); d.setDate(mon.getDate() + i); return d;
  });
}

export function ha(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function todayIdx() { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; }

export function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }

export function firstDow(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

export function computeStreak(days: string[]): number {
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

export function isActivityVisibleInWeek(act: Activity, week: number): boolean {
  if (act.day === undefined) return false;
  if (act.regularity === "regular") return true;
  const base = act.schedWeek ?? 0;
  if (act.regularity === "única") return base === week;
  const elapsed = week - base;
  if (elapsed < 0) return false;
  const maxWeeks = act.semiWeeks ?? 4;
  if (act.semiTarget !== undefined) {
    return elapsed < maxWeeks && (act.semiCompletions ?? 0) < act.semiTarget;
  }
  return elapsed < maxWeeks;
}

export function formatMins(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m > 0 ? m + "min" : ""}`;
  return `${m}min`;
}
