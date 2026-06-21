'use client';

import { useState, useEffect } from 'react';
import { X, Minimize, Maximize, Youtube, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'litlabs_youtube_widget';

interface YoutubeState {
  url: string;
  enabled: boolean;
  minimized: boolean;
}

function parseYoutubeId(url: string): { videoId: string | null; playlistId: string | null } {
  const videoMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return {
    videoId: videoMatch ? videoMatch[1] : null,
    playlistId: playlistMatch ? playlistMatch[1] : null,
  };
}

export default function YoutubeWidget() {
  const [state, setState] = useState<YoutubeState>({ url: '', enabled: true, minimized: false });
  const [inputUrl, setInputUrl] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
        if (parsed.url) setInputUrl(parsed.url);
      }
    } catch {}
    setLoaded(true);
  }, []);

  const saveState = (newState: YoutubeState) => {
    setState(newState);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)); } catch {}
  };

  const { videoId, playlistId } = parseYoutubeId(state.url);
  const embedSrc = videoId
    ? `https://www.youtube.com/embed/${videoId}${playlistId ? `?list=${playlistId}` : '?autoplay=1&enablejsapi=1'}`.replace('?', playlistId ? '?' : '?').replace(/(\?.*)\?/, '$1&')
    : null;

  if (!loaded || !state.enabled) return null;

  return (
    <div className="border-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
      <div className="flex items-center justify-between px-3 py-2 border-b cursor-pointer select-none" style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        onClick={() => saveState({ ...state, minimized: !state.minimized })}>
        <div className="flex items-center gap-2">
          <Youtube size={14} style={{ color: '#ff0000' }} />
          <span className="text-xs font-bold" style={{ color: '#e0e0e0' }}>YouTube</span>
          {videoId && <span className="text-[8px] px-1 py-0.5 rounded" style={{ backgroundColor: '#ff000015', color: '#ff0000' }}>LIVE</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); saveState({ ...state, minimized: !state.minimized }); }} className="p-1 hover:opacity-70">
            {state.minimized ? <Maximize size={12} /> : <Minimize size={12} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); saveState({ ...state, enabled: false }); }} className="p-1 hover:opacity-70">
            <X size={12} />
          </button>
        </div>
      </div>

      {!state.minimized && (
        <div className="p-2">
          {embedSrc ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedSrc}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="p-3">
              <div className="text-[10px] opacity-50 mb-2">Paste a YouTube URL to start playing:</div>
              <div className="flex gap-2">
                <input
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && inputUrl.trim()) saveState({ ...state, url: inputUrl.trim() }); }}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 px-2 py-1.5 text-[11px] bg-transparent border outline-none"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#e0e0e0' }}
                />
                <button
                  onClick={() => { if (inputUrl.trim()) saveState({ ...state, url: inputUrl.trim() }); }}
                  className="px-2 py-1.5 text-[10px] font-bold border"
                  style={{ borderColor: '#ff0000', color: '#ff0000' }}
                >
                  Load
                </button>
              </div>
              <div className="mt-2 flex gap-2">
                {[{ label: 'Music Mix', url: 'https://youtube.com/watch?v=jfKfPfyJRdk' }, { label: 'Lofi Hip Hop', url: 'https://youtube.com/watch?v=jfKfPfyJRdk&list=PL6NdkXsPL07LkM9pMqxJzO6Z5P6P6P6P6' }, { label: 'Synthwave', url: 'https://youtube.com/watch?v=MV3Ix8WqKjM' }].map(preset => (
                  <button key={preset.label} onClick={() => { setInputUrl(preset.url); saveState({ ...state, url: preset.url }); }}
                    className="px-2 py-1 text-[9px] border hover:opacity-70" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
