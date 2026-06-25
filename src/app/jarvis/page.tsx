import JarvisDashboard from "@/components/JarvisDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JARVIS — Command Center",
  description: "Advanced AI orchestration and system monitoring.",
};

export default function JarvisPage() {
  return <JarvisDashboard />;
}
