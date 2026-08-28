import { Router, type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";
import { getDb } from "../db.js";

function uuid(): string {
  return crypto.randomUUID();
}

const router = Router();

// Segundos de inactividad antes de borrar una cuenta temporal (coincide con el
// mensaje "3 minutos" de la pantalla de inicio de sesión)
export const GUEST_TIMEOUT_SECONDS = 180;
const GUEST_TIMEOUT_MS = GUEST_TIMEOUT_SECONDS * 1000;

function hasExpired(db: any, userId: string): boolean {
  const row = db.prepare("SELECT expires_at FROM users WHERE id = ?").get(userId) as { expires_at: string | null } | undefined;
  if (!row || row.expires_at === null) return false; // cuentas permanentes (admin) nunca expiran
  return row.expires_at < new Date().toISOString();
}

function createSession(db: any, userId: string, expiresInHours: number): string {
  const token = uuid();
  const expiresAt = new Date(Date.now() + expiresInHours * 3600000).toISOString();
  db.prepare("INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)").run(uuid(), userId, token, expiresAt);
  return token;
}

// Renueva la "marca de actividad" de un usuario temporal. Mientras el cliente
// haga heartbeat (página abierta), la cuenta no expira; al cerrarla, se borra
// pasados GUEST_TIMEOUT_SECONDS de inactividad.
function touchUser(db: any, userId: string) {
  db.prepare("UPDATE users SET expires_at = ? WHERE id = ?").run(
    new Date(Date.now() + GUEST_TIMEOUT_MS).toISOString(),
    userId
  );
}

// Borra las cuentas temporales inactivas (llevan más de GUEST_TIMEOUT_SECONDS
// sin actividad). El ON DELETE CASCADE elimina todos sus datos asociados.
export function cleanupExpiredUsers(): number {
  const db = getDb();
  const cutoff = new Date(Date.now()).toISOString();
  const res = db.prepare("DELETE FROM users WHERE auth_type = 'test' AND expires_at IS NOT NULL AND expires_at < ?").run(cutoff);
  // Elimina también las sesiones huérfanas
  const userIds = db.prepare("SELECT DISTINCT user_id FROM sessions").all() as { user_id: string }[];
  const valid = new Set((db.prepare("SELECT id FROM users").all() as { id: string }[]).map((u: any) => u.id));
  const txn = db.transaction(() => {
    for (const s of userIds) {
      if (!valid.has(s.user_id)) {
        db.prepare("DELETE FROM sessions WHERE user_id = ?").run(s.user_id);
      }
    }
  });
  txn();
  return res.changes;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  const db = getDb();
  const session = db.prepare("SELECT s.user_id, u.auth_type FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?").get(token) as { user_id: string; auth_type: string } | undefined;
  if (!session) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  // Si la cuenta temporal expiró por inactividad, la sesión deja de ser válida
  if (!session.auth_type || session.auth_type !== "real") {
    if (hasExpired(db, session.user_id)) {
      cleanupExpiredUsers();
      res.status(401).json({ error: "Sesión expirada por inactividad" });
      return;
    }
    // Mantener viva la cuenta mientras el cliente sigue haciendo peticiones
    touchUser(db, session.user_id);
  }
  (req as any).userId = session.user_id;
  (req as any).authType = session.auth_type;
  next();
}

// Inicio de sesión por nombre: crea (o reutiliza) una cuenta temporal cuyo
// progreso queda anclado a esa sesión y se borra tras abandonar la página.
router.post("/login", (req: Request, res: Response) => {
  const { username } = req.body || {};
  if (!username || !String(username).trim()) {
    res.status(400).json({ error: "Ingresa tu nombre para iniciar sesión" });
    return;
  }
  const name = String(username).trim().slice(0, 60);
  const db = getDb();
  let user = db.prepare("SELECT id FROM users WHERE username = ? AND auth_type = 'test' AND expires_at IS NOT NULL AND expires_at > ? LIMIT 1")
    .get(name, new Date().toISOString()) as { id: string } | undefined;

  if (!user) {
    const id = uuid();
    db.prepare("INSERT INTO users (id, username, auth_type, expires_at) VALUES (?, ?, 'test', ?)")
      .run(id, name, new Date(Date.now() + GUEST_TIMEOUT_MS).toISOString());
    user = { id };
  }

  touchUser(db, user.id);
  const token = createSession(db, user.id, 720); // sesión amplia; la expiración real la marca la inactividad
  res.json({ token, user: { id: user.id, username: name, authType: "test" } });
});

// Heartbeat: el cliente lo llama periódicamente mientras la página está abierta
// para renovar la expiración de su cuenta temporal.
router.post("/heartbeat", (req: Request, res: Response) => {
  const db = getDb();
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  const session = db.prepare("SELECT user_id FROM sessions WHERE token = ?").get(token) as { user_id: string } | undefined;
  if (!session) {
    res.status(401).json({ error: "Invalid session" });
    return;
  }
  const row = db.prepare("SELECT expires_at FROM users WHERE id = ?").get(session.user_id) as { expires_at: string | null } | undefined;
  if (row && row.expires_at !== null) {
    touchUser(db, session.user_id);
  }
  res.json({ ok: true });
});

router.post("/verify", (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: "Token required" });
    return;
  }
  const db = getDb();
  const session = db.prepare("SELECT s.user_id, u.username, u.auth_type, u.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?").get(token) as { user_id: string; username: string; auth_type: string; expires_at: string | null } | undefined;
  if (!session) {
    res.json({ valid: false });
    return;
  }
  // Cuentas temporales que expiraron por inactividad dejan de ser válidas
  if (session.auth_type !== "real" && session.expires_at !== null && session.expires_at < new Date().toISOString()) {
    cleanupExpiredUsers();
    res.json({ valid: false });
    return;
  }
  if (session.auth_type !== "real") {
    touchUser(db, session.user_id);
  }
  res.json({ valid: true, user: { id: session.user_id, username: session.username, authType: session.auth_type } });
});

export default router;
