import { getDb } from "./db.js";

export function runMigrations() {
  const db = getDb();

  // 1. Add missing columns to users table
  const userCols = new Set(
    (db.pragma("table_info(users)") as any[]).map((c: any) => c.name)
  );
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
}
