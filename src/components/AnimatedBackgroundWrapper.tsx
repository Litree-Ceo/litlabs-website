"use client";

import AnimatedBackground from "@/components/AnimatedBackground";
import { useTheme } from "@/context/ThemeContext";

export default function AnimatedBackgroundWrapper() {
  const { theme } = useTheme();
  return <AnimatedBackground mode={theme.backgroundMode} />;
}
