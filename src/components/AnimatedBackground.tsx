"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Orb {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  vx: number;
  vy: number;
  hue: number;
  hueSpeed: number;
  pulse: number;
  pulseSpeed: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
}

interface AuroraRibbon {
  points: { x: number; y: number; offset: number }[];
  amplitude: number;
  speed: number;
  hue: number;
  yBase: number;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  fadeSpeed: number;
  hue: number;
}

export type BackgroundMode =
  | "constellation"
  | "nebula"
  | "waves"
  | "minimal"
  | "holo";

export default function AnimatedBackground({
  mode = "nebula",
}: {
  mode?: BackgroundMode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedColors } = useTheme();
  const colorsRef = useRef(resolvedColors);
  colorsRef.current = resolvedColors;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animId: number;
    let w = 0,
      h = 0;
    let time = 0;
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30; // throttle to 30fps
    const mouse = { x: -1000, y: -1000 };
    let visible = true;

    function onVisChange() {
      visible = !document.hidden;
    }
    document.addEventListener("visibilitychange", onVisChange);

    /* ── Helpers ── */
    function hexToRgb(hex: string) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    }

    /* ── Resize ── */
    function resize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    /* ── State ── */
    let orbs: Orb[] = [];
    let auroras: AuroraRibbon[] = [];
    let sparkles: Sparkle[] = [];

    function initOrbs() {
      orbs = Array.from({ length: mode === "minimal" ? 4 : 10 }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        baseX: Math.random() * w,
        baseY: Math.random() * h,
        radius: Math.random() * 200 + 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 360,
        hueSpeed: (Math.random() - 0.5) * 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.01,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 100,
        orbitSpeed: (Math.random() - 0.5) * 0.002,
      }));
    }

    function initAuroras() {
      auroras = Array.from({ length: mode === "minimal" ? 0 : 2 }).map(
        (_, i) => ({
          points: Array.from({ length: 8 }).map((__, j) => ({
            x: (j / 7) * w,
            y: h * (0.3 + i * 0.4),
            offset: Math.random() * Math.PI * 2,
          })),
          amplitude: 50 + Math.random() * 100,
          speed: 0.001 + Math.random() * 0.002,
          hue: Math.random() * 360,
          yBase: h * (0.3 + i * 0.4),
        }),
      );
    }

    function initSparkles() {
      sparkles = Array.from({ length: mode === "minimal" ? 20 : 60 }).map(
        () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2,
          alpha: 0,
          targetAlpha: Math.random() * 0.5,
          fadeSpeed: 0.005 + Math.random() * 0.01,
          hue: Math.random() * 360,
        }),
      );
    }

    /* ── Draw ── */
    function draw(now: number) {
      if (!visible) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const delta = now - lastFrame;
      if (delta < FRAME_INTERVAL) {
        animId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;
      time += 0.01;

      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw Mesh Orbs (Nebula effect)
      if (mode !== "minimal") {
        orbs.forEach((orb) => {
          orb.pulse += orb.pulseSpeed;
          orb.orbitAngle += orb.orbitSpeed;
          orb.hue += orb.hueSpeed;

          const pulseScale = 1 + Math.sin(orb.pulse) * 0.2;
          const ox = orb.baseX + Math.cos(orb.orbitAngle) * orb.orbitRadius;
          const oy = orb.baseY + Math.sin(orb.orbitAngle) * orb.orbitRadius;

          orb.x += (ox - orb.x) * 0.02;
          orb.y += (oy - orb.y) * 0.02;

          const grad = ctx.createRadialGradient(
            orb.x,
            orb.y,
            0,
            orb.x,
            orb.y,
            orb.radius * pulseScale,
          );
          const rgb = hexToRgb(colorsRef.current.accentColor);
          grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`);
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius * pulseScale, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 2. Draw Auroras
      if (mode === "nebula" || mode === "waves") {
        auroras.forEach((aurora) => {
          ctx.beginPath();
          ctx.moveTo(0, aurora.yBase);

          aurora.points.forEach((p, i) => {
            p.offset += aurora.speed;
            const y =
              aurora.yBase + Math.sin(p.offset + time) * aurora.amplitude;
            if (i === 0) ctx.moveTo(p.x, y);
            else {
              const prev = aurora.points[i - 1];
              const prevY =
                aurora.yBase + Math.sin(prev.offset + time) * aurora.amplitude;
              ctx.bezierCurveTo(
                prev.x + (p.x - prev.x) / 2,
                prevY,
                prev.x + (p.x - prev.x) / 2,
                y,
                p.x,
                y,
              );
            }
          });

          const rgb = hexToRgb(colorsRef.current.linkColor);
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`;
          ctx.lineWidth = 200;
          ctx.lineCap = "round";
          ctx.stroke();
        });
      }

      // 3. Draw Sparkles
      sparkles.forEach((s) => {
        if (s.alpha < s.targetAlpha) s.alpha += s.fadeSpeed;
        else {
          s.alpha -= s.fadeSpeed * 0.5;
          if (s.alpha <= 0) {
            s.x = Math.random() * w;
            s.y = Math.random() * h;
            s.targetAlpha = Math.random() * 0.5;
          }
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onResize() {
      resize();
      initOrbs();
      initAuroras();
      initSparkles();
    }

    resize();
    initOrbs();
    initAuroras();
    initSparkles();
    draw(performance.now());

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVisChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
