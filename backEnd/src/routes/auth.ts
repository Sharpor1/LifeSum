import { Router, type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";
import { getDb } from "../db.js";

function uuid(): string {
  return crypto.randomUUID();
}

const router = Router();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const derived = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === derived;
}

function createSession(userId: string, expiresInHours: number): string {
  const db = getDb();
  const token = uuid();
  const expiresAt = new Date(Date.now() + expiresInHours * 3600000).toISOString();
  db.prepare("INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)").run(uuid(), userId, token, expiresAt);
  return token;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  const db = getDb();
  const session = db.prepare("SELECT s.user_id, u.auth_type, u.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > datetime('now')").get(token) as { user_id: string; auth_type: string; expires_at: string | null } | undefined;
  if (!session) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  (req as any).userId = session.user_id;
  (req as any).authType = session.auth_type;
  next();
}

router.post("/google", (_req: Request, res: Response) => {
  const db = getDb();
  const id = uuid();
  db.prepare(`
    INSERT INTO users (id, username, auth_type, expires_at)
    VALUES (?, ?, 'google', datetime('now', '+1 hour'))
  `).run(id, `User_${id.slice(0, 6)}`);
  const token = createSession(id, 1);
  res.json({ token, user: { id, username: `User_${id.slice(0, 6)}`, authType: "google" } });
});

router.post("/demo", (_req: Request, res: Response) => {
  const db = getDb();
  let demo = db.prepare("SELECT id FROM users WHERE auth_type = 'demo' LIMIT 1").get() as { id: string } | undefined;
  if (!demo) {
    const id = uuid();
    db.prepare("INSERT INTO users (id, username, auth_type) VALUES (?, 'Demo', 'demo')").run(id);
    demo = { id };
  }
  const token = createSession(demo.id, 24);
  res.json({ token, user: { id: demo.id, username: "Demo", authType: "demo" } });
});

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  const db = getDb();
  const user = db.prepare("SELECT id, username, password_hash, auth_type FROM users WHERE email = ? AND auth_type IN ('email', 'real')").get(email) as { id: string; username: string; password_hash: string | null; auth_type: string } | undefined;
  if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const expiresH = user.auth_type === "real" ? 720 : 1;
  const token = createSession(user.id, expiresH);
  res.json({ token, user: { id: user.id, username: user.username, authType: user.auth_type } });
});

router.post("/register", (req: Request, res: Response) => {
  const { email, password, username, authType } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  const type = authType === "real" ? "real" : "email";
  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }
  const id = uuid();
  const passwordHash = hashPassword(password);
  const expiresAt = type === "email" ? new Date(Date.now() + 3600000).toISOString() : null;
  db.prepare("INSERT INTO users (id, username, email, password_hash, auth_type, expires_at) VALUES (?, ?, ?, ?, ?, ?)").run(id, username || email.split("@")[0], email, passwordHash, type, expiresAt);
  const expiresH = type === "real" ? 720 : 1;
  const token = createSession(id, expiresH);
  res.json({ token, user: { id, username: username || email.split("@")[0], authType: type } });
});

router.post("/verify", (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: "Token required" });
    return;
  }
  const db = getDb();
  const session = db.prepare("SELECT s.user_id, u.username, u.auth_type FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > datetime('now')").get(token) as { user_id: string; username: string; auth_type: string } | undefined;
  if (!session) {
    res.json({ valid: false });
    return;
  }
  res.json({ valid: true, user: { id: session.user_id, username: session.username, authType: session.auth_type } });
});

export default router;
