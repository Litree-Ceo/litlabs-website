"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function useClerkAuth() {
  // Always call unconditionally — Rules of Hooks.
  // Returns isLoaded:false while Clerk JS is initialising (~300ms).
  const clerk = useAuth();

  const [sessionUser, setSessionUser] = useState<{
    id: string;
    name: string | null;
    email: string;
  } | null>(null);
  // Tracks whether the custom-session fallback fetch has settled.
  // Starts true — if Clerk itself says isLoaded:true we don't need this.
  // Only set to false while we're mid-fetch for the fallback session.
  const [sessionCheckDone, setSessionCheckDone] = useState(true);

  useEffect(() => {
    // Only run the custom-session fallback when Clerk has loaded but has no session
    if (!clerk.isLoaded || clerk.isSignedIn) return;

    setSessionCheckDone(false);
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
      })
      .finally(() => {
        setSessionCheckDone(true);
      });
  }, [clerk.isLoaded, clerk.isSignedIn]);

  // isLoaded is true when Clerk has resolved AND our fallback session check is done.
  // While Clerk is still initialising (clerk.isLoaded=false), we report isLoaded:true
  // so pages don't block — auth state (isSignedIn) will update once Clerk resolves.
  const isLoaded = !clerk.isLoaded ? true : sessionCheckDone;
  const isSignedIn = clerk.isSignedIn || !!sessionUser;
  const userId = clerk.userId || sessionUser?.id || null;
  const sessionClaims =
    clerk.sessionClaims ||
    (sessionUser
      ? { name: sessionUser.name, username: sessionUser.email }
      : undefined);

  return { ...clerk, isLoaded, isSignedIn, userId, sessionClaims };
}
