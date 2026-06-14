'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useTheme } from '@/context/ThemeContext';

type Post = {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  likes_count: number;
  comments_count: number;
  is_ai_post: boolean;
  created_at: string;
  author?: { name: string; username: string; avatar_url: string };
};

export default function SocialFeed() {
  const { isLoaded, isSignedIn } = useAuth();
  const { resolvedColors: T } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      showToast('Failed to load feed. Try refreshing.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 10000);
    return () => clearInterval(interval);
  }, [isSignedIn]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const createPost = async () => {
    if (!postContent.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: postContent.trim(), media_urls: [] }),
      });
      if (res.ok) {
        setPostContent('');
        showToast('Post published!', 'success');
        await fetchPosts();
      } else {
        const error = await res.json();
        showToast(error.error || 'Failed to post', 'error');
      }
    } catch {
      showToast('Network error. Try again.', 'error');
    } finally {
      setPosting(false);
    }
  };

  const likePost = async (postId: string) => {
    if (likedPosts.has(postId)) return;
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        setLikedPosts(prev => new Set([...prev, postId]));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
      }
    } catch { /* silently fail */ }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const addComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      if (res.ok) {
        setCommentText(prev => ({ ...prev, [postId]: '' }));
        showToast('Comment posted!', 'success');
        await fetchPosts();
      }
    } catch {
      showToast('Failed to post comment', 'error');
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: T?.bgColor || '#0a0a0f', color: T?.textColor || '#e2e8f0' }}>
        <div className="text-center">
          <div className="text-3xl mb-4 animate-pulse">⏳</div>
          <div className="text-sm font-bold opacity-60">Loading social feed...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: T.bgColor, color: T.textColor }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-5 z-[200] px-5 py-3 text-xs font-bold max-w-xs border-2 rounded"
          style={{
            backgroundColor: toast.type === 'success' ? '#0a2e0a' : toast.type === 'error' ? '#2e0a0a' : '#0a1a2e',
            borderColor: toast.type === 'success' ? T.accentColor : toast.type === 'error' ? '#ff4444' : T.linkColor,
            color: toast.type === 'success' ? T.accentColor : toast.type === 'error' ? '#ff4444' : T.linkColor,
          }}>
          {toast.msg}
        </div>
      )}

      <div ref={feedRef} className="max-w-xl mx-auto px-5 py-5">
        {/* Header */}
        <div className="mb-6 pb-5" style={{ borderBottom: '2px solid ' + T.borderColor }}>
          <h1 className="text-2xl font-black tracking-tight m-0 mb-1" style={{ color: T.headerColor }}>Social Feed</h1>
          <p className="text-xs opacity-70 m-0">Share your AI agent wins and connect with the community</p>
        </div>

        {/* Compose */}
        {isSignedIn && (
          <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
            <textarea
              placeholder="What's your AI agent story?"
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              className="w-full p-3 text-sm rounded outline-none resize-none border"
              style={{ backgroundColor: T.bgColor, borderColor: T.borderColor, color: T.textColor, minHeight: '100px' }}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={createPost}
                disabled={!postContent.trim() || posting}
                className="px-4 py-2 text-xs font-bold rounded transition-all"
                style={{
                  backgroundColor: postContent.trim() && !posting ? T.accentColor : '#333',
                  color: postContent.trim() && !posting ? '#000' : '#666',
                  cursor: postContent.trim() && !posting ? 'pointer' : 'not-allowed',
                }}
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="text-center py-10 opacity-50">
            <div className="text-2xl mb-3">⏳</div>
            <div>Loading posts...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 opacity-50">
            <div className="text-3xl mb-3">📭</div>
            <div className="text-sm font-bold mb-2">No posts yet</div>
            <div className="text-xs">Be the first to share your AI agent story!</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map(post => (
              <div key={post.id} className="p-4 rounded-lg border" style={{ borderColor: T.borderColor, backgroundColor: T.boxBg }}>
                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{post.author?.avatar_url || '👤'}</div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: T.headerColor }}>{post.author?.name || 'Anonymous'}</div>
                    <div className="text-xs opacity-60">@{post.author?.username || 'user'} · {formatTime(post.created_at)}</div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm leading-relaxed my-3 whitespace-pre-wrap" style={{ color: T.textColor }}>{post.content}</p>

                {/* Media */}
                {post.media_urls.length > 0 && (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 mb-3">
                    {post.media_urls.map((url, i) => (
                      <img key={i} src={url} alt="post media" className="rounded max-h-72 object-cover w-full" />
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex gap-4 pt-3 text-xs opacity-70" style={{ borderTop: '1px solid ' + T.borderColor }}>
                  <span>❤️ {post.likes_count}</span>
                  <span>💬 {post.comments_count}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-3 pt-3" style={{ borderTop: '1px solid ' + T.borderColor }}>
                  <button
                    onClick={() => likePost(post.id)}
                    disabled={likedPosts.has(post.id)}
                    className="flex-1 py-1.5 text-xs rounded border transition-all"
                    style={{
                      backgroundColor: likedPosts.has(post.id) ? 'rgba(255,0,0,0.2)' : 'transparent',
                      color: likedPosts.has(post.id) ? '#ff4444' : T.textColor,
                      borderColor: likedPosts.has(post.id) ? '#ff4444' : T.borderColor,
                      cursor: likedPosts.has(post.id) ? 'default' : 'pointer',
                    }}
                  >
                    {likedPosts.has(post.id) ? '❤️ Liked' : '🤍 Like'}
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex-1 py-1.5 text-xs rounded border transition-all"
                    style={{
                      backgroundColor: expandedComments.has(post.id) ? T.accentColor + '20' : 'transparent',
                      color: expandedComments.has(post.id) ? T.accentColor : T.textColor,
                      borderColor: expandedComments.has(post.id) ? T.accentColor : T.borderColor,
                    }}
                  >
                    💬 Comment
                  </button>
                </div>

                {/* Comments */}
                {expandedComments.has(post.id) && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid ' + T.borderColor }}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText[post.id] || ''}
                        onChange={e => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) addComment(post.id); }}
                        className="flex-1 px-3 py-2 text-xs rounded outline-none border"
                        style={{ backgroundColor: T.bgColor, borderColor: T.borderColor, color: T.textColor }}
                      />
                      <button
                        onClick={() => addComment(post.id)}
                        disabled={!commentText[post.id]?.trim()}
                        className="px-3 py-2 text-xs font-bold rounded transition-all"
                        style={{
                          backgroundColor: commentText[post.id]?.trim() ? T.linkColor : '#333',
                          color: commentText[post.id]?.trim() ? '#fff' : '#666',
                          cursor: commentText[post.id]?.trim() ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
