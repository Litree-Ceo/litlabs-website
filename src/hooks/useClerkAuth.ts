"use client";

import { useState, useEffect, useRef } from "react";

export function useClerkAuth() {
  const [state, setState] = useState<{
    isLoaded: boolean;
    isSignedIn: boolean;
    userId: string | null;
    sessionClaims: Record<string, unknown> | undefined;
  }>({
    isLoaded: true,
    isSignedIn: false,
    userId: null,
    sessionClaims: undefined,
  });

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setState({
            isLoaded: true,
            isSignedIn: true,
            userId: data.user.id,
            sessionClaims: { name: data.user.name, email: data.user.email },
          });
        }
      })
      .catch(() => {});
  }, []);

  return state;
}
