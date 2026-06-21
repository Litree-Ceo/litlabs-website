'use client';

import { useState, useEffect } from 'react';
import { Layout, Youtube, Music, Bot, Eye, EyeOff, ExternalLink, X } from 'lucide-react';

const WIDGETS_CONFIG = [
  {
    id: 'youtube',
    label: 'YouTube Player',
    icon: Youtube,
    desc: 'Watch & listen to YouTube videos',
    color: '#ff0000',
    storageKey: 'litlabs_youtube_widget',
  },
  {
    id: 'spotify',
    label: 'Music Player',
    icon: Music,
    desc: 'Spotify, synthwave & custom streams',
    color: '#1DB954',
    storageKey: 'litlabs_spotify_widget',
  },
  {
    id: 'jarvis',
    label: 'J.A.R.V.I.S. AI',
    icon: Bot,
    desc: 'Personal AI assistant',
    color: '#00f0ff',
    storageKey: 'litlabs_jarvis',
  },
];

function getWidgetEnabled(storageKey: string): boolean {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    return parsed.enabled !== false;
  } catch { return true; }
}

function setWidgetEnabled(storageKey: string, enabled: boolean) {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed.enabled = enabled;
    localStorage.setItem(storageKey, JSON.stringify(parsed));
  } catch {}
}

export default function WidgetPanel() {
  const [open, setOpen] = useState(false);
  const [states, setStates] = useState<Record<string, boolean>>({});

  const refresh = () => {
    const s: Record<string, boolean> = {};
    WIDGETS_CONFIG.forEach(w => { s[w.id] = getWidgetEnabled(w.storageKey); });
    setStates(s);
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const toggleWidget = (widgetId: string) => {
    const widget = WIDGETS_CONFIG.find(w => w.id === widgetId);
    if (!widget) return;
    const current = states[widgetId];
    const next = !current;
    setWidgetEnabled(widget.storageKey, next);
    setStates(prev => ({ ...prev, [widgetId]: next }));
    window.dispatchEvent(new CustomEvent('widgetToggle', { detail: { widgetId, enabled: next } }));
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-2 py-1 text-[10px] border hover:opacity-80"
        style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
        <Layout size={12} /> Widgets
      </button>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(false)}
        className="flex items-center gap-1 px-2 py-1 text-[10px] border"
        style={{ borderColor: '#00f0ff', color: '#00f0ff' }}>
        <Layout size={12} /> Widgets
      </button>

      <div className="absolute right-0 top-full mt-2 w-64 border-2 z-50 shadow-2xl"
        style={{ backgroundColor: '#0a0a12', borderColor: 'rgba(255,255,255,0.15)' }}>
        <div className="px-3 py-2 border-b text-[10px] font-bold uppercase opacity-50 flex items-center justify-between"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <span>Widget Dashboard</span>
          <button onClick={() => setOpen(false)} className="p-0.5 hover:opacity-70"><X size={10} /></button>
        </div>

        <div className="p-2 space-y-1">
          {WIDGETS_CONFIG.map(widget => {
            const enabled = states[widget.id] !== false;
            return (
              <div key={widget.id}
                className="flex items-center gap-3 p-2 border cursor-pointer hover:opacity-80 transition-all"
                style={{ borderColor: enabled ? widget.color + '30' : 'rgba(255,255,255,0.06)', backgroundColor: enabled ? widget.color + '05' : 'transparent' }}
                onClick={() => toggleWidget(widget.id)}>
                <div className="w-8 h-8 border flex items-center justify-center" style={{ borderColor: widget.color + '40' }}>
                  <widget.icon size={14} style={{ color: enabled ? widget.color : 'rgba(255,255,255,0.2)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold" style={{ color: enabled ? '#e0e0e0' : 'rgba(255,255,255,0.3)' }}>
                    {widget.label}
                    {enabled && <span className="ml-1.5 text-[8px] px-1 py-0.5 rounded" style={{ backgroundColor: widget.color + '20', color: widget.color }}>ON</span>}
                  </div>
                  <div className="text-[9px] opacity-40 truncate">{widget.desc}</div>
                </div>
                <div className="p-1">
                  {enabled ? <Eye size={12} style={{ color: widget.color }} /> : <EyeOff size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-3 py-2 border-t text-[8px] opacity-30 text-center"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          Click any widget to toggle. Changes save automatically.
        </div>
      </div>
    </div>
  );
}
