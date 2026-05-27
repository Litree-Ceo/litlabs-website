"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="card">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="font-heading text-xl font-bold mb-2">Page Not Found</h2>
        <p className="text-text-secondary text-sm mb-4">
          This page doesn't exist in the workspace.
        </p>
        <Link href="/dashboard" className="btn-primary text-sm">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
