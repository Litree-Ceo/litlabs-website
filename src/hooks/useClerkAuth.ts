"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

const CLERK_CONFIGURED = !!(
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

// Safe wrapper — returns a no-op stub when Clerk is not configured (e.g. during SSG)
function useSafeAuth() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAuth();
  } catch {
    return {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      sessionClaims: undefined,
    } as ReturnType<typeof useAuth>;
  }
}

export function useClerkAuth() {
  const clerk = CLERK_CONFIGURED
    ? useSafeAuth()
    : ({
        isLoaded: true,
        isSignedIn: false,
        userId: null,
        sessionClaims: undefined,
      } as ReturnType<typeof useAuth>);
  const [sessionUser, setSessionUser] = useState<{
    id: string;
    name: string | null;
    email: string;
  } | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    // If Clerk already says signed in, no need to check custom session
    if (clerk.isSignedIn) {
      setSessionLoaded(true);
      return;
    }
    // If Clerk is still loading, wait
    if (!clerk.isLoaded) return;

    // Clerk loaded and not signed in — check custom JWT session
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
        setSessionLoaded(true);
      })
      .catch(() => {
        setSessionLoaded(true);
      });
  }, [clerk.isLoaded, clerk.isSignedIn]);

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
