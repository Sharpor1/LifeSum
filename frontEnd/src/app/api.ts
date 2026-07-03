import type { Project } from "./types";

/* ───────── Typed API Error ───────── */

export class ApiResponseError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiResponseError";
    this.status = status;
  }
}

/* ───────── API Types ───────── */

export interface Sticker {
  id: string;
  stickerId: string;
  x: number;
  y: number;
}

export interface Completion {
  id: string;
  activityId: string;
  completedAt: string;
}

export interface Streak {
  streak: number;
}

export interface Background {
  id: string;
  filePath: string;
  label: string;
}

export interface CustomSticker {
  id: string;
  dataUrl: string;
  label: string;
}

/* ───────── API Manager ───────── */

export class ApiManager {
  constructor(public baseUrl: string = "/api") {}

  /* ── core request ── */

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers:
        options.body instanceof FormData
          ? undefined
          : { "Content-Type": "application/json", ...(options.headers as Record<string, string>) },
      ...options,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiResponseError(text || `Request failed (${res.status})`, res.status);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  }

  /* ── Projects ── */

  fetchProjects(): Promise<Project[]> {
    return this.request<Project[]>("/projects");
  }

  fetchProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  createProject(p: Project): Promise<Project> {
    return this.request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(p),
    });
  }

  updateProject(p: Project): Promise<void> {
    return this.request<void>(`/projects/${p.id}`, {
      method: "PUT",
      body: JSON.stringify(p),
    });
  }

  deleteProject(id: string): Promise<void> {
    return this.request<void>(`/projects/${id}`, { method: "DELETE" });
  }

  async syncAllProjects(projects: Project[]): Promise<void> {
    const existing = await this.fetchProjects().catch(() => null);
    if (!existing) return;

    const existingMap = new Map(existing.map((p) => [p.id, p]));
    const currentMap = new Map(projects.map((p) => [p.id, p]));

    const toDelete = existing.filter((p) => !currentMap.has(p.id));
    const toUpdate = projects.filter((p) => existingMap.has(p.id));
    const toCreate = projects.filter((p) => !existingMap.has(p.id));

    await Promise.all([
      ...toDelete.map((p) => this.deleteProject(p.id).catch(() => {})),
      ...toUpdate.map((p) => this.updateProject(p).catch(() => {})),
      ...toCreate.map((p) => this.createProject(p).catch(() => {})),
    ]);
  }

  /* ── Stickers ── */

  fetchStickers(): Promise<Sticker[]> {
    return this.request<Sticker[]>("/stickers");
  }

  syncStickers(stickers: Sticker[]): Promise<void> {
    return this.request<void>("/stickers/batch", {
      method: "PUT",
      body: JSON.stringify(stickers),
    });
  }

  /* ── Completions ── */

  createCompletion(id: string, activityId: string, completedAt?: string): Promise<void> {
    return this.request<void>("/completions", {
      method: "POST",
      body: JSON.stringify({ id, activityId, completedAt }),
    });
  }

  fetchCompletions(): Promise<Completion[]> {
    return this.request<Completion[]>("/completions");
  }

  fetchStreak(): Promise<Streak> {
    return this.request<Streak>("/completions/streak");
  }

  /* ── Backgrounds ── */

  uploadBackground(file: File, label?: string): Promise<Background> {
    const formData = new FormData();
    formData.append("background", file);
    if (label) formData.append("label", label);
    return this.request<Background>("/backgrounds/upload", {
      method: "POST",
      body: formData,
    });
  }

  fetchBackgrounds(): Promise<Background[]> {
    return this.request<Background[]>("/backgrounds");
  }

  deleteBackground(id: string): Promise<void> {
    return this.request<void>(`/backgrounds/${id}`, { method: "DELETE" });
  }

  /* ── Custom Stickers ── */

  async syncCustomStickers(stickers: CustomSticker[]): Promise<void> {
    const existing = await this.request<CustomSticker[]>("/custom-stickers").catch(() => null);
    if (!existing) return;
    const existingMap = new Map(existing.map((s) => [s.id, s]));
    const currentMap = new Map(stickers.map((s) => [s.id, s]));
    const toDelete = existing.filter((s) => !currentMap.has(s.id));
    const toCreate = stickers.filter((s) => !existingMap.has(s.id));
    await Promise.all([
      ...toDelete.map((s) => this.request<void>(`/custom-stickers/${s.id}`, { method: "DELETE" }).catch(() => {})),
      ...toCreate.map((s) => this.request<void>("/custom-stickers", { method: "POST", body: JSON.stringify(s) }).catch(() => {})),
    ]);
  }
}

/* ───────── Singleton & re-exports (backward‑compatible) ───────── */

const api = new ApiManager();

export const {
  fetchProjects,
  fetchProject,
  createProject,
  updateProject,
  deleteProject,
  syncAllProjects,
  fetchStickers,
  syncStickers,
  createCompletion,
  fetchCompletions,
  fetchStreak,
  uploadBackground,
  fetchBackgrounds,
  deleteBackground,
  syncCustomStickers,
} = api;

export default api;
