"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase-client";

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

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState({
          isLoaded: true,
          isSignedIn: true,
          userId: session.user.id,
          sessionClaims: {
            name: session.user.user_metadata?.name,
            email: session.user.email,
          },
        });
      } else {
        setState({
          isLoaded: true,
          isSignedIn: false,
          userId: null,
          sessionClaims: undefined,
        });
      }
    }).catch(() => {
      setState({
        isLoaded: true,
        isSignedIn: false,
        userId: null,
        sessionClaims: undefined,
      });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setState({
          isLoaded: true,
          isSignedIn: true,
          userId: session.user.id,
          sessionClaims: {
            name: session.user.user_metadata?.name,
            email: session.user.email,
          },
        });
      } else {
        setState({
          isLoaded: true,
          isSignedIn: false,
          userId: null,
          sessionClaims: undefined,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
