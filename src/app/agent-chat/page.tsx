"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgentChatRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/agent");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center text-sm opacity-50">Redirecting to Agent...</div>
    </div>
  );
}
