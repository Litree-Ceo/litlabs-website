import type { SupabaseClient } from "@supabase/supabase-js";
import { getAdminSupabase } from "./supabase-admin";
import { getSupabase } from "./supabase";

let _admin: SupabaseClient | null = null;
let _anon: SupabaseClient | null = null;

function getDb(): SupabaseClient | null {
  if (typeof window === "undefined") {
    try {
      if (!_admin) _admin = getAdminSupabase();
      return _admin;
    } catch {}
    try {
      if (!_anon) _anon = getSupabase();
      return _anon;
    } catch {
      return null;
    }
  }
  try {
    if (!_anon) _anon = getSupabase();
    return _anon;
  } catch {
    return null;
  }
}

export type UserProfile = {
  id: string;
  auth_id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
};

export type UserPreferences = {
  id: string;
  user_id: string;
  theme_mode: string;
  theme_skin: string;
  theme_accent: string;
  crt_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type Wallet = {
  id: string;
  user_id: string;
  balance: number;
  last_claim_date: string | null;
  created_at: string;
  updated_at: string;
};

export async function getOrCreateUser(userId: string, email: string, name?: string | null) {
  const db = getDb();
  if (!db) {
    return { user: null as unknown as UserProfile, isNew: true };
  }

  const { data: existing } = await db.from("users").select("*").eq("auth_id", userId).single();
  if (existing) return { user: existing as UserProfile, isNew: false };

  const { data: user, error: createError } = await db
    .from("users")
    .insert({ auth_id: userId, email, name: name || email.split("@")[0], username: email.split("@")[0] })
    .select()
    .single();

  if (createError || !user) {
    return { user: null as unknown as UserProfile, isNew: false };
  }

  await db.from("user_preferences").insert({ user_id: user.id });
  await db.from("wallets").insert({ user_id: user.id, balance: 500 });

  return { user: user as UserProfile, isNew: true };
}

export async function getUserByAuthId(userId: string): Promise<UserProfile | null> {
  const db = getDb();
  if (!db) return null;
  const { data, error } = await db.from("users").select("*").eq("auth_id", userId).single();
  if (error || !data) return null;
  return data as UserProfile;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, "id" | "auth_id" | "email" | "created_at" | "updated_at">>
) {
  const db = getDb();
  if (!db) throw new Error("Database not configured");
  const user = await getUserByAuthId(userId);
  if (!user) throw new Error("User not found");
  const { data, error } = await db.from("users").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", user.id).select().single();
  if (error) throw new Error(`Failed to update profile: ${error.message}`);
  return data as UserProfile;
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const db = getDb();
  if (!db) return null;
  const user = await getUserByAuthId(userId);
  if (!user) return null;
  const { data, error } = await db.from("user_preferences").select("*").eq("user_id", user.id).single();
  if (error || !data) return null;
  return data as UserPreferences;
}

export async function updateUserPreferences(
  userId: string,
  updates: Partial<Omit<UserPreferences, "id" | "user_id" | "created_at" | "updated_at">>
) {
  const db = getDb();
  if (!db) throw new Error("Database not configured");
  const user = await getUserByAuthId(userId);
  if (!user) throw new Error("User not found");
  const { data, error } = await db.from("user_preferences").upsert({ user_id: user.id, ...updates, updated_at: new Date().toISOString() }).select().single();
  if (error) throw new Error(`Failed to update preferences: ${error.message}`);
  return data as UserPreferences;
}

export async function getUserWallet(userId: string): Promise<Wallet> {
  const db = getDb();
  if (db) {
    try {
      const user = await getUserByAuthId(userId);
      if (user) {
        const { data } = await db.from("wallets").select("*").eq("user_id", user.id).single();
        if (data) return data as Wallet;
        const { data: created } = await db
          .from("wallets")
          .insert({ user_id: user.id, balance: 500 })
          .select()
          .single();
        if (created) return created as Wallet;
      }
    } catch {}
  }

  const storageKey = `litlabs-wallet-${userId}`;
  let stored: string | null = null;
  try {
    stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
  } catch {}

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        id: "local",
        user_id: userId,
        balance: parsed.balance ?? 9999,
        last_claim_date: parsed.last_claim_date ?? null,
        created_at: parsed.created_at ?? new Date().toISOString(),
        updated_at: parsed.updated_at ?? new Date().toISOString(),
      };
    } catch {}
  }

  return {
    id: "fallback",
    user_id: userId,
    balance: 9999,
    last_claim_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function updateWalletBalance(
  userId: string,
  amount: number,
  options?: { absolute?: boolean; lastClaimDate?: string }
) {
  const { absolute = false, lastClaimDate } = options || {};
  const db = getDb();

  if (!db) {
    const storageKey = `litlabs-wallet-${userId}`;
    let currentBalance = 9999;
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        currentBalance = parsed.balance ?? 9999;
      }
    } catch {}

    const newBalance = absolute ? amount : currentBalance + amount;
    const walletData = {
      balance: Math.max(0, newBalance),
      last_claim_date: lastClaimDate || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(walletData));
      }
    } catch {}

    return {
      id: "local",
      user_id: userId,
      ...walletData,
    } as Wallet;
  }

  const user = await getUserByAuthId(userId);
  if (!user) {
    const storageKey = `litlabs-wallet-${userId}`;
    let currentBalance = 9999;
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        currentBalance = parsed.balance ?? 9999;
      }
    } catch {}

    const newBalance = absolute ? amount : currentBalance + amount;
    const walletData = {
      balance: Math.max(0, newBalance),
      last_claim_date: lastClaimDate || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(walletData));
      }
    } catch {}

    return {
      id: "local",
      user_id: userId,
      ...walletData,
    } as Wallet;
  }

  let targetBalance = amount;
  if (!absolute) {
    const { data: wallet } = await db.from("wallets").select("balance").eq("user_id", user.id).single();
    targetBalance = (wallet?.balance ?? 0) + amount;
    if (targetBalance < 0) throw new Error("Insufficient balance");
  }

  const { data, error } = await db.from("wallets").update({ balance: targetBalance, ...(lastClaimDate && { last_claim_date: lastClaimDate }), updated_at: new Date().toISOString() }).eq("user_id", user.id).select().single();
  if (error) throw new Error(`Failed to update wallet: ${error.message}`);
  return data as Wallet;
}

export async function claimDailyBonus(userId: string, bonusAmount: number = 50) {
  const wallet = await getUserWallet(userId);
  const today = new Date().toISOString().split("T")[0];
  if (wallet.last_claim_date === today) throw new Error("Daily bonus already claimed");
  return updateWalletBalance(userId, wallet.balance + bonusAmount, { absolute: true, lastClaimDate: today });
}
