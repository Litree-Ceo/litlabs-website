"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";

export function useClerkAuth() {
  // Always call unconditionally — Rules of Hooks.
  const clerk = useAuth();

  const [sessionUser, setSessionUser] = useState<{
    id: string;
    name: string | null;
    email: string;
  } | null>(null);

  const fetchedRef = useRef(false);

  useEffect(() => {
    // Only run once when Clerk is loaded but has no session
    if (!clerk.isLoaded || clerk.isSignedIn || fetchedRef.current) return;
    fetchedRef.current = true;

    // Silent background check — never causes a loading state
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

  // While Clerk is initialising (clerk.isLoaded=false), report isLoaded:true
  // so pages render immediately. Auth state updates ~300ms later when Clerk resolves.
  const isLoaded = clerk.isLoaded || true;
  const isSignedIn = clerk.isSignedIn || !!sessionUser;
  const userId = clerk.userId || sessionUser?.id || null;
  const sessionClaims =
    clerk.sessionClaims ||
    (sessionUser
      ? { name: sessionUser.name, username: sessionUser.email }
      : undefined);

  return { ...clerk, isLoaded, isSignedIn, userId, sessionClaims };
}
