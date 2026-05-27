import * as fs from "fs";
import * as path from "path";
import { existsSync, mkdirSync } from "fs";
import initSqlJs, { Database } from "sql.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  avatar: string;
  bio: string | null;
  plan: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface Preferences {
  user_id: string;
  theme: string;
  accent_color: string;
  notifications: number;
  language: string;
}

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  personality: string | null;
  skills: string | null;
  avatar: string;
  is_public: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  likes: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DB_DIR = path.resolve(__dirname, "../data");
const DB_PATH = path.join(DB_DIR, "litlabs.db");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let dbInstance: Database | null = null;
let initPromise: Promise<Database> | null = null;

function saveDatabase(db: Database): void {
  const data = db.export();
  const buffer = Buffer.from(data);
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, buffer);
}

// ---------------------------------------------------------------------------
// CREATE TABLE statements
// ---------------------------------------------------------------------------

const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  avatar TEXT DEFAULT '🤖',
  bio TEXT,
  plan TEXT DEFAULT 'free',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS preferences (
  user_id TEXT PRIMARY KEY,
  theme TEXT DEFAULT 'dark',
  accent_color TEXT DEFAULT 'cyan',
  notifications INTEGER DEFAULT 1,
  language TEXT DEFAULT 'en',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  personality TEXT,
  skills TEXT,
  avatar TEXT DEFAULT '🤖',
  is_public INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const SQL = await initSqlJs();

      if (!existsSync(DB_DIR)) {
        mkdirSync(DB_DIR, { recursive: true });
      }

      let db: Database;
      if (existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(new Uint8Array(buffer));
      } else {
        db = new SQL.Database();
      }

      dbInstance = db;
      return db;
    } catch (err) {
      const msg = (err as Error)?.message || "Unknown";
      throw new Error(`Failed to initialise database: ${msg}`);
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export async function initDatabase(): Promise<Database> {
  const db = await getDatabase();

  try {
    db.run(CREATE_TABLES);
    saveDatabase(db);

    // Seed admin user if the users table is empty
    const countResult = db.exec("SELECT COUNT(*) as cnt FROM users");
    const count = countResult[0]?.values[0]?.[0] ?? 0;

    if (count === 0 && ADMIN_EMAIL && ADMIN_PASSWORD_HASH) {
      const adminId = crypto.randomUUID();
      const stmt = db.prepare(
        "INSERT INTO users (id, email, password_hash, name, plan) VALUES (?, ?, ?, ?, ?)"
      );
      stmt.run([adminId, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, ADMIN_NAME, "admin"]);
      stmt.free();

      // Create default preferences for admin
      const prefStmt = db.prepare(
        "INSERT INTO preferences (user_id) VALUES (?)"
      );
      prefStmt.run([adminId]);
      prefStmt.free();

      saveDatabase(db);
    }
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    throw new Error(`Failed to initialise database schema: ${msg}`);
  }

  return db;
}

// -- Users ------------------------------------------------------------------

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    stmt.bind([email]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as User;
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    throw new Error(`getUserByEmail failed: ${msg}`);
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDatabase();
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    stmt.bind([id]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as User;
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    throw new Error(`getUserById failed: ${msg}`);
  }
}

export async function createUser({
  email,
  passwordHash,
  name,
}: {
  email: string;
  passwordHash: string;
  name?: string;
}): Promise<User> {
  const db = await getDatabase();
  try {
    const id = crypto.randomUUID();
    const stmt = db.prepare(
      "INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)"
    );
    stmt.run([id, email, passwordHash, name ?? null]);
    stmt.free();

    // Create default preferences
    const prefStmt = db.prepare(
      "INSERT INTO preferences (user_id) VALUES (?)"
    );
    prefStmt.run([id]);
    prefStmt.free();

    saveDatabase(db);

    const user = await getUserById(id);
    if (!user) throw new Error("User creation failed: could not fetch new user");
    return user;
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    throw new Error(`createUser failed: ${msg}`);
  }
}

export async function updateUser(
  id: string,
  updates: { name?: string; avatar?: string; bio?: string; plan?: string }
): Promise<void> {
  const db = await getDatabase();
  try {
    const sets: string[] = [];
    const values: (string | null)[] = [];

    if (updates.name !== undefined) {
      sets.push("name = ?");
      values.push(updates.name);
    }
    if (updates.avatar !== undefined) {
      sets.push("avatar = ?");
      values.push(updates.avatar);
    }
    if (updates.bio !== undefined) {
      sets.push("bio = ?");
      values.push(updates.bio);
    }
    if (updates.plan !== undefined) {
      sets.push("plan = ?");
      values.push(updates.plan);
    }

    if (sets.length === 0) return;

    sets.push("updated_at = datetime('now')");
    values.push(id);

    const sql = `UPDATE users SET ${sets.join(", ")} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(values);
    stmt.free();

    saveDatabase(db);
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    throw new Error(`updateUser failed: ${msg}`);
  }
}

// -- Sessions ---------------------------------------------------------------

export async function createSession(
  userId: string,
  token: string,
  expiresAt: string
): Promise<void> {
  const db = await getDatabase();
  try {
    const id = crypto.randomUUID();
    const stmt = db.prepare(
      "INSERT INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)"
    );
    stmt.run([id, userId, token, expiresAt]);
    stmt.free();
    saveDatabase(db);
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    throw new Error(`createSession failed: ${msg}`);
  }
}

export async function getSessionByToken(token: string): Promise<Session | null> {
  const db = await getDatabase();
  try {
    const stmt = db.prepare(
      "SELECT * FROM sessions WHERE token = ? AND expires_at > datetime('now')"
    );
    stmt.bind([token]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as Session;
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    throw new Error(`getSessionByToken failed: ${msg}`);
  }
}

export async function deleteSession(token: string): Promise<void> {
  const db = await getDatabase();
  try {
    const stmt = db.prepare("DELETE FROM sessions WHERE token = ?");
    stmt.run([token]);
    stmt.free();
    saveDatabase(db);
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    throw new Error(`deleteSession failed: ${msg}`);
  }
}

// -- Preferences ------------------------------------------------------------

export async function getPreferences(userId: string): Promise<Preferences> {
  const db = await getDatabase();
  try {
    const stmt = db.prepare("SELECT * FROM preferences WHERE user_id = ?");
    stmt.bind([userId]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as unknown as Preferences;
      stmt.free();
      return row;
    }
    stmt.free();

    // Return defaults if no row exists
    return {
      user_id: userId,
      theme: "dark",
      accent_color: "cyan",
      notifications: 1,
      language: "en",
    };
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    throw new Error(`getPreferences failed: ${msg}`);
  }
}

export async function updatePreferences(
  userId: string,
  prefs: { theme?: string; accent_color?: string; notifications?: number; language?: string }
): Promise<void> {
  const db = await getDatabase();
  try {
    const sets: string[] = [];
    const values: (string | number)[] = [];

    if (prefs.theme !== undefined) {
      sets.push("theme = ?");
      values.push(prefs.theme);
    }
    if (prefs.accent_color !== undefined) {
      sets.push("accent_color = ?");
      values.push(prefs.accent_color);
    }
    if (prefs.notifications !== undefined) {
      sets.push("notifications = ?");
      values.push(prefs.notifications);
    }
    if (prefs.language !== undefined) {
      sets.push("language = ?");
      values.push(prefs.language);
    }

    if (sets.length === 0) return;

    // Upsert (insert or update) preferences for this user
    const existing = db.exec(
      "SELECT user_id FROM preferences WHERE user_id = ?",
      [userId]
    );

    if (existing.length > 0 && existing[0].values.length > 0) {
      values.push(userId);
      const sql = `UPDATE preferences SET ${sets.join(", ")} WHERE user_id = ?`;
      const stmt = db.prepare(sql);
      stmt.run(values);

      stmt.free();
    } else {
      const allCols = ["user_id", ...sets.map((s) => s.split(" = ")[0])];
      const placeholders = allCols.map(() => "?").join(", ");
      const insertSql = `INSERT INTO preferences (${allCols.join(", ")}) VALUES (${placeholders})`;
      const stmt = db.prepare(insertSql);
      stmt.run([userId, ...values]);
      stmt.free();
    }

    saveDatabase(db);
  } catch (err) {
    const msg = (err as Error)?.message || "Unknown";
    throw new Error(`updatePreferences failed: ${msg}`);
  }
}
