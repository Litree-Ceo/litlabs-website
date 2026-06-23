"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

// Safe wrapper — useAuth() throws when ClerkProvider isn't mounted (SSG without key)
function useSafeAuth(): ReturnType<typeof useAuth> {
  try {
    return useAuth();
  } catch {
    return {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      sessionClaims: undefined,
    } as unknown as ReturnType<typeof useAuth>;
  }
}

export function useClerkAuth() {
  const clerk = useSafeAuth();
  const [sessionUser, setSessionUser] = useState<{
    id: string;
    name: string | null;
    email: string;
  } | null>(null);

  // Start as true so pages never block on this —
  // Clerk's own isLoaded drives auth state once it resolves.
  const [sessionLoaded, setSessionLoaded] = useState(true);

  useEffect(() => {
    // Only check custom session when Clerk is loaded but NOT signed in
    if (!clerk.isLoaded || clerk.isSignedIn) return;

    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setSessionUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          });
        }
      })
      .catch(() => {
        // Session check failed — treat as unauthenticated
      });
  }, [clerk.isLoaded, clerk.isSignedIn]);

  // isLoaded: true once Clerk resolves OR immediately (sessionLoaded=true by default)
  const isLoaded = clerk.isLoaded || sessionLoaded;
  const isSignedIn = clerk.isSignedIn || !!sessionUser;
  const userId = clerk.userId || sessionUser?.id || null;
  const sessionClaims =
    clerk.sessionClaims ||
    (sessionUser
      ? { name: sessionUser.name, username: sessionUser.email }
      : undefined);

  return { ...clerk, isLoaded, isSignedIn, userId, sessionClaims };
}
