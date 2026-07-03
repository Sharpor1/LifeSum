import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "lifesum.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      is_dark INTEGER DEFAULT 1,
      bg_type TEXT DEFAULT 'image' CHECK(bg_type IN ('image','color')),
      bg_image TEXT DEFAULT '',
      bg_color TEXT DEFAULT '#1a0533',
      accent_color TEXT DEFAULT '#a855f7',
      card_color TEXT DEFAULT '#ffffff',
      card_alpha REAL DEFAULT 0.09,
      notifications INTEGER DEFAULT 1,
      print_bg TEXT DEFAULT 'white' CHECK(print_bg IN ('white','solid')),
      font_size INTEGER DEFAULT 16
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      emoji TEXT NOT NULL,
      description TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS project_links (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      hours INTEGER NOT NULL DEFAULT 1,
      day INTEGER,
      start_hour INTEGER,
      regularity TEXT NOT NULL DEFAULT 'regular' CHECK(regularity IN ('regular','semi','única')),
      priority TEXT NOT NULL DEFAULT 'media' CHECK(priority IN ('alta','media','baja')),
      note_color TEXT NOT NULL DEFAULT '#fef08a',
      sched_week INTEGER DEFAULT 0,
      semi_weeks INTEGER,
      semi_target INTEGER,
      semi_completions INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS logros (
      id TEXT PRIMARY KEY,
      owner_type TEXT NOT NULL CHECK(owner_type IN ('project','activity')),
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      icon TEXT DEFAULT '🏆',
      completed INTEGER DEFAULT 0,
      current INTEGER,
      target INTEGER,
      trigger_activity_id TEXT,
      trigger_count INTEGER
    );

    CREATE TABLE IF NOT EXISTS activity_completions (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
      completed_at TEXT NOT NULL DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS stickers (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      sticker_id TEXT NOT NULL,
      x REAL NOT NULL DEFAULT 0,
      y REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS custom_stickers (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      data_url TEXT NOT NULL,
      label TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS custom_backgrounds (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      file_path TEXT NOT NULL,
      label TEXT DEFAULT ''
    );

    CREATE INDEX IF NOT EXISTS idx_project_links_project ON project_links(project_id);
    CREATE INDEX IF NOT EXISTS idx_activities_project ON activities(project_id);
    CREATE INDEX IF NOT EXISTS idx_logros_owner ON logros(owner_id);
    CREATE INDEX IF NOT EXISTS idx_activity_completions_user ON activity_completions(user_id);
    CREATE INDEX IF NOT EXISTS idx_activity_completions_activity ON activity_completions(activity_id);
    CREATE INDEX IF NOT EXISTS idx_stickers_user ON stickers(user_id);
    CREATE INDEX IF NOT EXISTS idx_custom_stickers_user ON custom_stickers(user_id);
    CREATE INDEX IF NOT EXISTS idx_custom_backgrounds_user ON custom_backgrounds(user_id);
  `);
}
