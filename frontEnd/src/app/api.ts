import type { Project } from "./types";

//── Errores tipados para la API ──

// Error cuando el servidor responde con un código HTTP de error
export class ApiResponseError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiResponseError";
    this.status = status;
  }
}

// Error cuando no se puede conectar con el servidor
export class ConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConnectionError";
  }
}

//── Tipos de respuesta de la API ──

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

//── ApiManager: wrapper de fetch con tipado genérico ──

export class ApiManager {
  constructor(public baseUrl: string = "/api") {}

  // Petición HTTP genérica con tipado
  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        headers:
          options.body instanceof FormData
            ? undefined  // El navegador pone el Content-Type automático con FormData
            : { "Content-Type": "application/json", ...(options.headers as Record<string, string>) },
        ...options,
      });
    } catch (err) {
      // TypeError("Failed to fetch") = no hay conexión
      const msg = err instanceof TypeError && err.message === "Failed to fetch"
        ? `No se puede conectar con el servidor (${this.baseUrl}). Asegúrate de que el backend esté corriendo en http://localhost:3001`
        : `Error de conexión: ${(err as Error).message}`;
      throw new ConnectionError(msg);
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiResponseError(text || `Request failed (${res.status})`, res.status);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  }

  //── Projects ──

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

  // Sincronización completa: crea, actualiza y elimina según la diferencia con el servidor
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

  //── Stickers ──

  fetchStickers(): Promise<Sticker[]> {
    return this.request<Sticker[]>("/stickers");
  }

  syncStickers(stickers: Sticker[]): Promise<void> {
    return this.request<void>("/stickers/batch", {
      method: "PUT",
      body: JSON.stringify(stickers),
    });
  }

  //── Completions ──

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

  //── Backgrounds ──

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

  //── Custom Stickers ──

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

//── Singleton: exportamos funciones sueltas con .bind() para evitar perder el this ──

const api = new ApiManager();

export const fetchProjects = api.fetchProjects.bind(api);
export const fetchProject = api.fetchProject.bind(api);
export const createProject = api.createProject.bind(api);
export const updateProject = api.updateProject.bind(api);
export const deleteProject = api.deleteProject.bind(api);
export const syncAllProjects = api.syncAllProjects.bind(api);
export const fetchStickers = api.fetchStickers.bind(api);
export const syncStickers = api.syncStickers.bind(api);
export const createCompletion = api.createCompletion.bind(api);
export const fetchCompletions = api.fetchCompletions.bind(api);
export const fetchStreak = api.fetchStreak.bind(api);
export const uploadBackground = api.uploadBackground.bind(api);
export const fetchBackgrounds = api.fetchBackgrounds.bind(api);
export const deleteBackground = api.deleteBackground.bind(api);
export const syncCustomStickers = api.syncCustomStickers.bind(api);

export default api;
