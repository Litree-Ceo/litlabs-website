import bcrypt from "bcryptjs";
import { getUserByEmail, createUser as createDbUser } from "@/lib/database";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

export interface User {
  id: string;
  email: string;
  name: string | null;
}

function dbUserToUser(u: {
  id: string;
  email: string;
  name: string | null;
}): User {
  return { id: u.id, email: u.email, name: u.name };
}

/**
 * Verify credentials against the database.
 * Falls back to env-var admin if no DB user is found (backward compat).
 * Returns the user object on success, null on failure.
 */
export async function verifyPassword(
  email: string,
  password: string
): Promise<User | null> {
  // Primary: look up user in the database
  const dbUser = await getUserByEmail(email);
  if (dbUser) {
    const valid = await bcrypt.compare(password, dbUser.password_hash);
    if (valid) {
      return dbUserToUser(dbUser);
    }
    return null;
  }

  // Fallback: env-var admin (for first-run before DB is seeded)
  if (ADMIN_EMAIL && ADMIN_PASSWORD_HASH) {
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return null;
    const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!valid) return null;
    return { id: "admin", email: ADMIN_EMAIL, name: ADMIN_NAME };
  }

  return null;
}

/**
 * Look up user by email. Database is the source of truth.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const dbUser = await getUserByEmail(email);
  if (dbUser) {
    return dbUserToUser(dbUser);
  }

  // Fallback: env-var admin
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && ADMIN_EMAIL) {
    return { id: "admin", email: ADMIN_EMAIL, name: ADMIN_NAME };
  }

  return null;
}

/**
 * Create a new user in the database from registration data.
 * Returns the created user.
 */
export async function createUserFromRegister(
  email: string,
  password: string,
  name?: string
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 12);
  const dbUser = await createDbUser({ email, passwordHash, name });
  return dbUserToUser(dbUser);
}
