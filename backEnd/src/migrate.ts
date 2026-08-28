import crypto from "crypto";
import { getDb } from "./db.js";

function uuid(): string {
  return crypto.randomUUID();
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function runMigrations() {
  const db = getDb();

  // 1. Add missing columns to users table
  const userCols = new Set(
    (db.pragma("table_info(users)") as any[]).map((c: any) => c.name)
  );
  if (!userCols.has("email")) {
    db.exec("ALTER TABLE users ADD COLUMN email TEXT");
  }
  if (!userCols.has("password_hash")) {
    db.exec("ALTER TABLE users ADD COLUMN password_hash TEXT");
  }
  if (!userCols.has("auth_type")) {
    db.exec("ALTER TABLE users ADD COLUMN auth_type TEXT DEFAULT 'test' CHECK(auth_type IN ('real','test'))");
  }
  if (!userCols.has("expires_at")) {
    db.exec("ALTER TABLE users ADD COLUMN expires_at TEXT");
  }

  // 2. Add missing user_id column to projects
  const projCols = new Set(
    (db.pragma("table_info(projects)") as any[]).map((c: any) => c.name)
  );
  if (!projCols.has("user_id")) {
    db.exec("ALTER TABLE projects ADD COLUMN user_id TEXT REFERENCES users(id) ON DELETE CASCADE");
  }

  // 3. Add missing columns to activities (note_color, sched_week, etc.)
  const actCols = new Set(
    (db.pragma("table_info(activities)") as any[]).map((c: any) => c.name)
  );
  if (!actCols.has("note_color")) {
    db.exec("ALTER TABLE activities ADD COLUMN note_color TEXT DEFAULT '#fef08a'");
  }
  if (!actCols.has("sched_week")) {
    db.exec("ALTER TABLE activities ADD COLUMN sched_week INTEGER DEFAULT 0");
  }
  if (!actCols.has("semi_weeks")) {
    db.exec("ALTER TABLE activities ADD COLUMN semi_weeks INTEGER");
  }
  if (!actCols.has("semi_target")) {
    db.exec("ALTER TABLE activities ADD COLUMN semi_target INTEGER");
  }
  if (!actCols.has("semi_completions")) {
    db.exec("ALTER TABLE activities ADD COLUMN semi_completions INTEGER DEFAULT 0");
  }
  if (!actCols.has("regularity")) {
    db.exec("ALTER TABLE activities ADD COLUMN regularity TEXT DEFAULT 'regular' CHECK(regularity IN ('regular','semi','única'))");
  }
  if (!actCols.has("priority")) {
    db.exec("ALTER TABLE activities ADD COLUMN priority TEXT DEFAULT 'media' CHECK(priority IN ('alta','media','baja'))");
  }

  // 4. Seed admin user + reassign orphan data
  let adminId: string | null = null;
  const existingAdmin = db.prepare("SELECT id FROM users WHERE auth_type = 'real' LIMIT 1").get() as { id: string } | undefined;
  if (existingAdmin) {
    adminId = existingAdmin.id;
  } else {
    adminId = uuid();
    const pwHash = hashPassword("admin123");
    db.prepare(`
      INSERT INTO users (id, username, email, password_hash, auth_type)
      VALUES (?, 'Admin', 'admin@lifesum.app', ?, 'real')
    `).run(adminId, pwHash);
  }

  // 5. Reassign orphan projects (user_id is NULL or empty) to admin
  const orphanProjects = db.prepare("SELECT id FROM projects WHERE user_id IS NULL OR user_id = ''").all() as { id: string }[];
  if (orphanProjects.length > 0) {
    const upd = db.prepare("UPDATE projects SET user_id = ? WHERE user_id IS NULL OR user_id = ''");
    upd.run(adminId);
  }

  return { adminId, demoId: null };
}

export function getAdminUserId(): string {
  const db = getDb();
  const admin = db.prepare("SELECT id FROM users WHERE auth_type = 'real' LIMIT 1").get() as { id: string } | undefined;
  if (admin) return admin.id;
  // fallback: run migration again
  const result = runMigrations();
  return result.adminId!;
}
