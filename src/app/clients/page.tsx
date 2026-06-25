import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Brands | LiTTree Lab Studios",
};

const clientsDir = path.join(process.cwd(), "clients");

type ClientInfo = {
  slug: string;
  name: string;
  url: string;
  status: string;
  added: string;
};

function getClients(): ClientInfo[] {
  if (!fs.existsSync(clientsDir)) return [];
  const dirs = fs.readdirSync(clientsDir).filter((f) => {
    const stat = fs.statSync(path.join(clientsDir, f));
    return stat.isDirectory() && f !== "." && f !== ".." && f !== "README.md";
  });

  return dirs.map((slug) => {
    const brandPath = path.join(clientsDir, slug, "brand.md");
    const info: ClientInfo = { slug, name: slug, url: "", status: "Active", added: "Unknown" };
    if (fs.existsSync(brandPath)) {
      const content = fs.readFileSync(brandPath, "utf-8");
      const nameMatch = content.match(/^# Client Brand: (.+)$/m);
      if (nameMatch) info.name = nameMatch[1];
      const urlMatch = content.match(/\| \*\*Client Website\*\* \| \[(.+?)\]\((.+?)\)/);
      if (urlMatch) info.url = urlMatch[2];
      const statusMatch = content.match(/\| \*\*Status\*\* \| (.+)/);
      if (statusMatch) info.status = statusMatch[1];
      const dateMatch = content.match(/\| \*\*Date Added\*\* \| (.+)/);
      if (dateMatch) info.added = dateMatch[1];
    }
    return info;
  });
}

export default function ClientsPage() {
  const clients = getClients();

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#08080c", color: "#e2e2e9" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#f8fafc" }}>Client Brands</h1>
        <p className="mb-8" style={{ color: "#8e8e9f" }}>Brand identity profiles for client projects.</p>

        {clients.length === 0 ? (
          <div className="rounded-xl p-12 text-center" style={{
            background: "rgba(18, 18, 26, 0.7)",
            border: "1px solid #26262e",
          }}>
            <p style={{ color: "#8e8e9f" }}>No client brands yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => (
              <Link key={client.slug} href={`/clients/${client.slug}`}>
                <div className="rounded-xl p-6 transition-all hover:translate-x-1" style={{
                  background: "rgba(18, 18, 26, 0.7)",
                  border: "1px solid #26262e",
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold" style={{ color: "#f8fafc" }}>{client.name}</h2>
                    <span className="text-xs px-3 py-1 rounded-full" style={{
                      background: client.status === "Active" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                      color: client.status === "Active" ? "#10b981" : "#ef4444",
                      border: `1px solid ${client.status === "Active" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                    }}>
                      {client.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: "#8e8e9f" }}>
                    {client.url && <span>{client.url}</span>}
                    <span>Added: {client.added}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
