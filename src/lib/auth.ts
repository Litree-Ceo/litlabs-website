import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function auth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {}
        },
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id ?? null;
  return { userId };
}
