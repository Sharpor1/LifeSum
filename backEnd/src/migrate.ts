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
    db.exec("ALTER TABLE users ADD COLUMN auth_type TEXT DEFAULT 'test' CHECK(auth_type IN ('google','demo','email','real','test'))");
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

  // 6. Ensure demo user exists with reference to admin data
  let demoId: string | null = null;
  const existingDemo = db.prepare("SELECT id FROM users WHERE auth_type = 'demo' LIMIT 1").get() as { id: string } | undefined;
  if (existingDemo) {
    demoId = existingDemo.id;
  } else {
    demoId = uuid();
    db.prepare("INSERT INTO users (id, username, auth_type) VALUES (?, 'Demo', 'demo')").run(demoId);
  }

  // 7. Copy ALL admin data to demo user so demo sees everything
  // First, delete any existing demo-owned data
  db.prepare("DELETE FROM stickers WHERE user_id = ?").run(demoId);
  db.prepare("DELETE FROM custom_stickers WHERE user_id = ?").run(demoId);
  db.prepare("DELETE FROM custom_backgrounds WHERE user_id = ?").run(demoId);
  db.prepare("DELETE FROM activity_completions WHERE user_id = ?").run(demoId);
  db.prepare("DELETE FROM projects WHERE user_id = ?").run(demoId);

  // Copy projects from admin to demo
  const adminProjects = db.prepare("SELECT * FROM projects WHERE user_id = ?").all() as any[];
  for (const p of adminProjects) {
    const newProjId = uuid();
    db.prepare("INSERT INTO projects (id, user_id, name, color, emoji, description) VALUES (?, ?, ?, ?, ?, ?)")
      .run(newProjId, demoId, p.name, p.color, p.emoji, p.description || "");

    // Copy activities
    const acts = db.prepare("SELECT * FROM activities WHERE project_id = ?").all() as any[];
    for (const a of acts) {
      const newActId = uuid();
      db.prepare(`
        INSERT INTO activities (id, project_id, title, description, hours, day, start_hour, regularity, priority, note_color, sched_week, semi_weeks, semi_target, semi_completions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(newActId, newProjId, a.title, a.description || "", a.hours, a.day, a.start_hour, a.regularity, a.priority, a.note_color || "#fef08a", a.sched_week || 0, a.semi_weeks, a.semi_target, a.semi_completions || 0);

      // Copy logros for this activity
      const logros = db.prepare("SELECT * FROM logros WHERE owner_type = 'activity' AND owner_id = ?").all() as any[];
      for (const l of logros) {
        db.prepare("INSERT INTO logros (id, owner_type, owner_id, title, icon, completed, current, target, trigger_activity_id, trigger_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
          .run(uuid(), 'activity', newActId, l.title, l.icon || '🏆', l.completed || 0, l.current, l.target, l.trigger_activity_id, l.trigger_count);
      }
    }

    // Copy project links
    const links = db.prepare("SELECT * FROM project_links WHERE project_id = ?").all() as any[];
    for (const l of links) {
      db.prepare("INSERT INTO project_links (id, project_id, label, url) VALUES (?, ?, ?, ?)")
        .run(uuid(), newProjId, l.label, l.url);
    }

    // Copy project-level logros
    const projLogros = db.prepare("SELECT * FROM logros WHERE owner_type = 'project' AND owner_id = ?").all() as any[];
    for (const l of projLogros) {
      db.prepare("INSERT INTO logros (id, owner_type, owner_id, title, icon, completed, current, target, trigger_activity_id, trigger_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(uuid(), 'project', newProjId, l.title, l.icon || '🏆', l.completed || 0, l.current, l.target, l.trigger_activity_id, l.trigger_count);
    }
  }

  // Copy stickers
  const adminStickers = db.prepare("SELECT * FROM stickers WHERE user_id = ?").all() as any[];
  for (const s of adminStickers) {
    db.prepare("INSERT INTO stickers (id, user_id, sticker_id, x, y) VALUES (?, ?, ?, ?, ?)")
      .run(uuid(), demoId, s.sticker_id, s.x, s.y);
  }

  // Copy custom stickers
  const adminCStickers = db.prepare("SELECT * FROM custom_stickers WHERE user_id = ?").all() as any[];
  for (const s of adminCStickers) {
    db.prepare("INSERT INTO custom_stickers (id, user_id, data_url, label) VALUES (?, ?, ?, ?)")
      .run(uuid(), demoId, s.data_url, s.label);
  }

  // Copy custom backgrounds
  const adminBgs = db.prepare("SELECT * FROM custom_backgrounds WHERE user_id = ?").all() as any[];
  for (const b of adminBgs) {
    db.prepare("INSERT INTO custom_backgrounds (id, user_id, file_path, label) VALUES (?, ?, ?, ?)")
      .run(uuid(), demoId, b.file_path, b.label);
  }

  // Copy completions
  const adminComps = db.prepare("SELECT * FROM activity_completions WHERE user_id = ?").all() as any[];
  for (const c of adminComps) {
    db.prepare("INSERT INTO activity_completions (id, user_id, activity_id, completed_at) VALUES (?, ?, ?, ?)")
      .run(uuid(), demoId, c.activity_id, c.completed_at);
  }

  return { adminId, demoId };
}

export function getAdminUserId(): string {
  const db = getDb();
  const admin = db.prepare("SELECT id FROM users WHERE auth_type = 'real' LIMIT 1").get() as { id: string } | undefined;
  if (admin) return admin.id;
  // fallback: run migration again
  const result = runMigrations();
  return result.adminId!;
}
