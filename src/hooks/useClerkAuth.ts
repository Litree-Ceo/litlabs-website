"use client";

import { useAuth } from "@clerk/nextjs";

export function useClerkAuth() {
  const auth = useAuth();
  return auth;
}
