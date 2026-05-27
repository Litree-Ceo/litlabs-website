"use client";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="card border-red-500/30">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="font-heading text-xl font-bold text-red-400 mb-2">
          Something went wrong
        </h2>
        <p className="text-text-secondary text-sm mb-4">
          {error.message || "An unexpected error occurred."}
        </p>
        <button className="btn-secondary" onClick={reset}>
          Try Again
        </button>
      </div>
    </div>
  );
}
