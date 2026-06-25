'use client';

import { useState, useEffect } from 'react';
import { X, Minimize, Maximize, Music, Radio, ExternalLink, Volume2 } from 'lucide-react';

const STORAGE_KEY = 'litlabs_spotify_widget';

interface SpotifyState {
  url: string;
  enabled: boolean;
  minimized: boolean;
  mode: 'spotify' | 'custom' | 'builtin';
  volume: number;
}

const SYNTHWAVE_TRACKS = [
  { id: '1', title: 'Neon Drive', artist: 'Synthwave Radio', duration: '4:32' },
  { id: '2', title: 'Retrowave', artist: 'Outrun FM', duration: '3:58' },
  { id: '3', title: 'Cyber City', artist: 'Darksynth', duration: '5:12' },
  { id: '4', title: 'Pixel Dreams', artist: 'Chill Synth', duration: '4:45' },
  { id: '5', title: 'Midnight Run', artist: 'Neon Nights', duration: '3:22' },
];

function parseSpotifyEmbed(url: string): string | null {
  const match = url.match(/open\.spotify\.com\/(track|playlist|album|artist|episode|show)\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  const type = match[1];
  const id = match[2];
  let width = '100%';
  let height = type === 'track' ? '152' : type === 'episode' || type === 'show' ? '232' : '352';
  return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
}

function parseAnyUrl(url: string): string | null {
  if (parseSpotifyEmbed(url)) return parseSpotifyEmbed(url);
  if (url.match(/soundcloud\.com\//)) return url.replace('/?', '/?visual=true&');
  return null;
}

const CUSTOM_PRESETS = [
  { label: 'Lofi Girl', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
  { label: 'Synthwave', url: 'https://open.spotify.com/playlist/37i9dQZF1DX6xOPeSOGone' },
  { label: 'Chill Beats', url: 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wz7S' },
];

export default function SpotifyWidget() {
  const [state, setState] = useState<SpotifyState>({ url: '', enabled: true, minimized: false, mode: 'builtin', volume: 50 });
  const [inputUrl, setInputUrl] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

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

  const saveState = (newState: SpotifyState) => {
    setState(newState);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newState)); } catch {}
  };

  const embedUrl = state.mode === 'spotify' || state.mode === 'custom'
    ? parseAnyUrl(state.url)
    : null;

  if (!loaded || !state.enabled) return null;

  const renderBuiltinPlayer = () => (
    <div className="p-2 space-y-2">
      <div className="flex items-center justify-between p-2 border" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate" style={{ color: '#1DB954' }}>{SYNTHWAVE_TRACKS[currentTrack].title}</div>
          <div className="text-[9px] opacity-50 truncate">{SYNTHWAVE_TRACKS[currentTrack].artist}</div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={() => setCurrentTrack((currentTrack - 1 + SYNTHWAVE_TRACKS.length) % SYNTHWAVE_TRACKS.length)}
            className="p-1.5 hover:opacity-70"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg></button>
          <button onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full" style={{ backgroundColor: '#1DB95420', color: '#1DB954' }}>
            {isPlaying
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
          </button>
          <button onClick={() => setCurrentTrack((currentTrack + 1) % SYNTHWAVE_TRACKS.length)}
            className="p-1.5 hover:opacity-70"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg></button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Volume2 size={10} style={{ color: 'rgba(255,255,255,0.4)' }} />
        <input type="range" min="0" max="100" value={state.volume}
          onChange={(e) => saveState({ ...state, volume: parseInt(e.target.value) })}
          className="flex-1 h-1 appearance-none cursor-pointer"
          style={{ accentColor: '#1DB954' }} />
        <span className="text-[9px] opacity-50 w-6 text-right">{state.volume}%</span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {SYNTHWAVE_TRACKS.map((track, i) => (
          <button key={track.id} onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
            className={`p-1 text-[8px] border truncate ${i === currentTrack && isPlaying ? 'opacity-100' : 'opacity-50'}`}
            style={{ borderColor: i === currentTrack && isPlaying ? '#1DB954' : 'rgba(255,255,255,0.1)', color: i === currentTrack && isPlaying ? '#1DB954' : 'rgba(255,255,255,0.6)' }}>
            {track.title}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSpotifyPlayer = () => (
    <div className="p-2">
      <iframe
        src={embedUrl || ''}
        width="100%"
        height={state.url.includes('track/') ? '152' : state.url.includes('episode/') || state.url.includes('show/') ? '232' : '352'}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: '4px' }}
      />
    </div>
  );

  const renderUrlInput = () => (
    <div className="p-3">
      <div className="flex gap-1 mb-2">
        {[
          { id: 'builtin', label: 'Synthwave' },
          { id: 'spotify', label: 'Spotify' },
          { id: 'custom', label: 'Custom URL' },
        ].map(tab => (
          <button key={tab.id} onClick={() => saveState({ ...state, mode: tab.id as SpotifyState['mode'], url: tab.id === 'builtin' ? '' : state.url })}
            className="flex-1 py-1.5 text-[9px] font-bold border"
            style={{ borderColor: state.mode === tab.id ? '#1DB954' : 'rgba(255,255,255,0.1)', color: state.mode === tab.id ? '#1DB954' : 'rgba(255,255,255,0.5)', backgroundColor: state.mode === tab.id ? '#1DB95410' : 'transparent' }}>
            {tab.label}
          </button>
        ))}
      </div>
      {state.mode !== 'builtin' && (
        <>
          <div className="flex gap-2">
            <input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && inputUrl.trim()) saveState({ ...state, url: inputUrl.trim() }); }}
              placeholder={state.mode === 'spotify' ? "https://open.spotify.com/track/..." : "https://..."}
              className="flex-1 px-2 py-1.5 text-[11px] bg-transparent border outline-none"
              style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#e0e0e0' }}
            />
            <button
              onClick={() => { if (inputUrl.trim()) saveState({ ...state, url: inputUrl.trim() }); }}
              className="px-2 py-1.5 text-[10px] font-bold border"
              style={{ borderColor: '#1DB954', color: '#1DB954' }}
            >
              Load
            </button>
          </div>
          <div className="mt-2 flex gap-1.5 flex-wrap">
            {CUSTOM_PRESETS.map(p => (
              <button key={p.label} onClick={() => { setInputUrl(p.url); saveState({ ...state, url: p.url, mode: p.url.includes('spotify.com') ? 'spotify' : 'custom' }); }}
                className="px-2 py-1 text-[9px] border hover:opacity-70" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                {p.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="border-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
      <div className="flex items-center justify-between px-3 py-2 border-b cursor-pointer select-none" style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        onClick={() => saveState({ ...state, minimized: !state.minimized })}>
        <div className="flex items-center gap-2">
          {state.mode === 'builtin' ? (
            <Radio size={14} style={{ color: '#1DB954' }} />
          ) : (
            <Music size={14} style={{ color: '#1DB954' }} />
          )}
          <span className="text-xs font-bold" style={{ color: '#e0e0e0' }}>Music</span>
          {isPlaying && state.mode === 'builtin' && <span className="text-[8px] px-1 py-0.5 rounded" style={{ backgroundColor: '#1DB95415', color: '#1DB954' }}>♪ {SYNTHWAVE_TRACKS[currentTrack].title}</span>}
          {state.mode === 'spotify' && state.url && <span className="text-[8px] px-1 py-0.5 rounded" style={{ backgroundColor: '#1DB95415', color: '#1DB954' }}>SPOTIFY</span>}
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
        state.mode === 'builtin' ? renderBuiltinPlayer() :
        embedUrl ? renderSpotifyPlayer() :
        renderUrlInput()
      )}
    </div>
  );
}
