"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Widget layout persistence hook.
 * Stores the order and visibility of dashboard widgets in localStorage
 * so users can rearrange their dashboard and it stays that way.
 */

export type WidgetId = string;

export interface WidgetLayoutState {
  order: WidgetId[];
  hidden: WidgetId[];
}

const STORAGE_KEY = "litlabs-widget-layout";

/**
 * Default widget order — must match the IDs used in DashboardWidgets.
 */
export const DEFAULT_WIDGET_ORDER: WidgetId[] = [
  "profile",
  "radio",
  "agents",
  "reward",
  "creators",
  "system",
  "stats",
];

function loadLayout(): WidgetLayoutState {
  if (typeof window === "undefined") {
    return { order: DEFAULT_WIDGET_ORDER, hidden: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { order: DEFAULT_WIDGET_ORDER, hidden: [] };
    const parsed = JSON.parse(raw) as WidgetLayoutState;
    // Ensure all default widgets are present (handles new widgets added later)
    const known = new Set(DEFAULT_WIDGET_ORDER);
    const order = [
      ...parsed.order.filter((id) => known.has(id)),
      ...DEFAULT_WIDGET_ORDER.filter((id) => !parsed.order.includes(id)),
    ];
    const hidden = (parsed.hidden || []).filter((id) => known.has(id));
    return { order, hidden };
  } catch {
    return { order: DEFAULT_WIDGET_ORDER, hidden: [] };
  }
}

export function useWidgetLayout() {
  const [layout, setLayout] = useState<WidgetLayoutState>(() =>
    loadLayout(),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Persist on change (only after mount to avoid SSR mismatch)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    }
  }, [layout, mounted]);

  const reorder = useCallback((from: number, to: number) => {
    setLayout((prev) => {
      const order = [...prev.order];
      const [moved] = order.splice(from, 1);
      order.splice(to, 0, moved);
      return { ...prev, order };
    });
  }, []);

  const moveUp = useCallback((id: WidgetId) => {
    setLayout((prev) => {
      const idx = prev.order.indexOf(id);
      if (idx <= 0) return prev;
      const order = [...prev.order];
      [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
      return { ...prev, order };
    });
  }, []);

  const moveDown = useCallback((id: WidgetId) => {
    setLayout((prev) => {
      const idx = prev.order.indexOf(id);
      if (idx < 0 || idx >= prev.order.length - 1) return prev;
      const order = [...prev.order];
      [order[idx], order[idx + 1]] = [order[idx + 1], order[idx]];
      return { ...prev, order };
    });
  }, []);

  const toggleVisibility = useCallback((id: WidgetId) => {
    setLayout((prev) => {
      const hidden = prev.hidden.includes(id)
        ? prev.hidden.filter((h) => h !== id)
        : [...prev.hidden, id];
      return { ...prev, hidden };
    });
  }, []);

  const reset = useCallback(() => {
    setLayout({ order: DEFAULT_WIDGET_ORDER, hidden: [] });
  }, []);

  return {
    layout: mounted ? layout : { order: DEFAULT_WIDGET_ORDER, hidden: [] },
    reorder,
    moveUp,
    moveDown,
    toggleVisibility,
    reset,
  };
}
