import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

const clientsDir = path.join(process.cwd(), "clients");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(clientsDir, slug, "brand.md");
  let title = slug;
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(/^# Client Brand: (.+)$/m);
    if (match) title = match[1];
  }
  return { title: `${title} — Client Brand | LiTTree Lab Studios` };
}

export default async function ClientBrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(clientsDir, slug, "brand.md");

  if (!fs.existsSync(filePath)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#08080c" }}>
        <div className="text-center p-12" style={{
          background: "rgba(18, 18, 26, 0.7)",
          border: "1px solid #26262e",
          borderRadius: "12px",
          maxWidth: "480px",
        }}>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "#f8fafc" }}>Client not found</h1>
          <p className="mb-6" style={{ color: "#8e8e9f" }}>
            No brand profile exists for <code className="font-mono text-sm" style={{ color: "#38bdf8" }}>{slug}</code>
          </p>
          <Link
            href="/clients"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: "#6366f1", color: "#fff" }}
          >
            Back to clients
          </Link>
        </div>
      </div>
    );
  }

  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#08080c", color: "#e2e2e9" }}>
      <div className="max-w-4xl mx-auto">
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-80"
          style={{ color: "#6366f1" }}
        >
          All Clients
        </Link>

        <div className="rounded-xl p-8 md:p-12" style={{
          background: "rgba(18, 18, 26, 0.7)",
          border: "1px solid #26262e",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}>
          <article
            style={{
              "--tw-prose-body": "#e2e2e9",
              "--tw-prose-headings": "#f8fafc",
              "--tw-prose-links": "#6366f1",
              "--tw-prose-bold": "#f8fafc",
              "--tw-prose-code": "#38bdf8",
              "--tw-prose-pre-bg": "#12121a",
              "--tw-prose-pre-code": "#e2e2e9",
              "--tw-prose-td-borders": "#26262e",
              "--tw-prose-th-borders": "#26262e",
            } as React.CSSProperties}
          >
            <ReactMarkdown
              components={{
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full text-sm" style={{
                      borderCollapse: "collapse",
                      border: "1px solid #26262e",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}>
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th style={{
                    background: "#12121a",
                    color: "#f8fafc",
                    fontWeight: 600,
                    padding: "10px 16px",
                    textAlign: "left",
                    borderBottom: "1px solid #26262e",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid #26262e",
                    color: "#e2e2e9",
                  }}>
                    {children}
                  </td>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code style={{
                        background: "rgba(99, 102, 241, 0.1)",
                        color: "#38bdf8",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.85em",
                        fontFamily: "var(--font-jetbrains), JetBrains Mono, monospace",
                      }} {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <pre style={{
                      background: "#12121a",
                      border: "1px solid #26262e",
                      borderRadius: "8px",
                      padding: "16px",
                      overflow: "auto",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-jetbrains), JetBrains Mono, monospace",
                    }}>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                h1: ({ children }) => (
                  <h1 style={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "#f8fafc",
                    margin: "0 0 1.5rem",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid #26262e",
                  }}>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 style={{
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "#f8fafc",
                    margin: "2rem 0 1rem",
                  }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    color: "#f8fafc",
                    margin: "1.5rem 0 0.75rem",
                  }}>
                    {children}
                  </h3>
                ),
                a: ({ href, children }) => (
                  <a href={href} target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{ color: "#6366f1", textDecoration: "none", fontWeight: 500 }}
                    className="hover:underline">
                    {children}
                  </a>
                ),
                hr: () => (
                  <hr style={{ border: "none", borderTop: "1px solid #26262e", margin: "2rem 0" }} />
                ),
                blockquote: ({ children }) => (
                  <blockquote style={{
                    borderLeft: "3px solid #6366f1",
                    padding: "8px 16px",
                    margin: "1rem 0",
                    background: "rgba(99, 102, 241, 0.05)",
                    borderRadius: "0 8px 8px 0",
                    color: "#8e8e9f",
                    fontStyle: "italic",
                  }}>
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
