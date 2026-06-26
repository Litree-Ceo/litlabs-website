"use client";

import JarvisTerminal from "@/components/dashboard/JarvisTerminal";

export default function AgentPage() {
  return (
    <div
      className="flex flex-col w-full"
      style={{ height: "calc(100vh - 3.5rem)" }}
    >
      <JarvisTerminal />
    </div>
  );
}
