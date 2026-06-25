"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-client";

export default function UserSync() {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetch("/api/account", { method: "GET" }).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  return null;
}
