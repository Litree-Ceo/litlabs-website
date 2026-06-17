-- ============================================
-- SUPABASE PERFORMANCE OPTIMIZATION
-- Run these SQL commands in your Supabase SQL Editor
-- ============================================

-- ============================================
-- INDEXES FOR FASTER QUERIES
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(id) WHERE id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- Agents indexes
CREATE INDEX IF NOT EXISTS idx_agents_created_by ON public.agents(created_by);
CREATE INDEX IF NOT EXISTS idx_agents_type ON public.agents(type);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON public.agents(created_at DESC);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_agent_id ON public.sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(started_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON public.messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Logs indexes
CREATE INDEX IF NOT EXISTS idx_logs_session_id ON public.logs(session_id);
CREATE INDEX IF NOT EXISTS idx_logs_agent_id ON public.logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_logs_level ON public.logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);

-- Artifacts indexes
CREATE INDEX IF NOT EXISTS idx_artifacts_session_id ON public.artifacts(session_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_agent_id ON public.artifacts(agent_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_created_at ON public.artifacts(created_at DESC);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_agent_id ON public.jobs(agent_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(type);
CREATE INDEX IF NOT EXISTS idx_events_triggered_by ON public.events(triggered_by);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);

-- ============================================
-- COMPOSITE INDEXES FOR COMMON QUERIES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_sessions_user_status ON public.sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_session_created ON public.messages(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON public.jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_logs_session_level ON public.logs(session_id, level);

-- ============================================
-- ANALYZE TABLES FOR QUERY OPTIMIZATION
-- ============================================

ANALYZE public.users;
ANALYZE public.agents;
ANALYZE public.sessions;
ANALYZE public.messages;
ANALYZE public.logs;
ANALYZE public.artifacts;
ANALYZE public.jobs;
ANALYZE public.events;
