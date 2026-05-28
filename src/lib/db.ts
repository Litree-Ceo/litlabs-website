import bcrypt from "bcryptjs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export async function verifyPassword(
  email: string,
  password: string
): Promise<User | null> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) return null;
  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return null;
  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) return null;
  return { id: "admin", email: ADMIN_EMAIL, name: ADMIN_NAME };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  if (!ADMIN_EMAIL) return null;
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return { id: "admin", email: ADMIN_EMAIL, name: ADMIN_NAME };
  }
  return null;
}

export async function createUserFromRegister(
  email: string,
  password: string,
  name?: string
): Promise<User> {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

  // If admin env vars are set, only allow that email
  if (ADMIN_EMAIL && ADMIN_PASSWORD_HASH) {
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      throw new Error("Registration is closed");
    }
    // Admin already exists, just return the admin user
    return { id: "admin", email: ADMIN_EMAIL, name: name || process.env.ADMIN_NAME || "Admin" };
  }

  // No admin configured yet — create one from registration
  // (This path is for initial setup without env vars)
  throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in Vercel environment variables first");
}
