/**
 * api.ts — Centralized API layer for InvestAI Node.js backend (port 5000)
 * This file provides typed fetch helpers for every backend module.
 * All protected routes automatically attach JWT token from localStorage.
 */

const NODE_BACKEND = import.meta.env.VITE_NODE_API || 'http://localhost:5000';
const TOKEN_KEY = 'investai_token';

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Core fetch with auto-auth ─────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${NODE_BACKEND}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> || {}) },
  });

  if (res.status === 401) {
    clearToken();
    localStorage.removeItem('investai_user');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DbUser {
  id: string;
  email: string;
  full_name: string;
  risk_profile: string;
  membership_level: string;
  avatar_url?: string;
  google_id?: string;
  created_at: string;
}

export interface AuthResponse {
  user: DbUser;
  token: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const api = {
  // ─── Auth (Public) ───────────────────────────────────────────────────────

  auth: {
    register: (payload: { email: string; password: string; full_name: string }) =>
      apiFetch<AuthResponse>('/api/auth/register', {
        method: 'POST', body: JSON.stringify(payload),
      }),
    login: (payload: { email: string; password: string }) =>
      apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST', body: JSON.stringify(payload),
      }),
    googleLogin: (token: string) =>
      apiFetch<AuthResponse>('/api/auth/google', {
        method: 'POST', body: JSON.stringify({ token }),
      }),
    me: () => apiFetch<DbUser>('/api/auth/me'),
  },

  // ─── Users (Protected) ────────────────────────────────────────────────────

  users: {
    get: (id: string) => apiFetch<DbUser>(`/api/users/${id}`),
    update: (id: string, payload: Partial<{ full_name: string; risk_profile: string; membership_level: string; avatar_url: string }>) =>
      apiFetch<{ message: string; user: DbUser }>(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  },

  // ─── Portfolio (Protected) ────────────────────────────────────────────────

  portfolio: {
    get: (userId: string) => apiFetch<{
      id: string;
      cash_balance: number;
      holdings: { stock_symbol: string; total_lots: number; average_price: number }[];
    }>(`/api/portfolio/${userId}`),
    buy: (userId: string, payload: { stock_symbol: string; lot_count: number; price_per_share: number }) =>
      apiFetch<{ message: string; total_value: number }>(`/api/portfolio/${userId}/buy`, {
        method: 'POST', body: JSON.stringify(payload),
      }),
    sell: (userId: string, payload: { stock_symbol: string; lot_count: number; price_per_share: number }) =>
      apiFetch<{ message: string; total_value: number }>(`/api/portfolio/${userId}/sell`, {
        method: 'POST', body: JSON.stringify(payload),
      }),
    transactions: (userId: string) => apiFetch<{
      id: string; type: 'BUY' | 'SELL'; stock_symbol: string;
      lot_count: number; price_per_share: number; total_value: number; transaction_date: string;
    }[]>(`/api/portfolio/${userId}/transactions`),
    reset: (userId: string) => apiFetch<{ message: string }>(`/api/portfolio/${userId}/reset`, { method: 'DELETE' }),
  },

  // ─── Mentorship (Protected) ───────────────────────────────────────────────

  mentorship: {
    getSessions: (userId: string) => apiFetch<{
      id: string; title: string; is_active: boolean; created_at: string; updated_at: string;
    }[]>(`/api/mentorship/${userId}/sessions`),
    createSession: (userId: string, title?: string) =>
      apiFetch<{ id: string; title: string; created_at: string }>(`/api/mentorship/${userId}/sessions`, {
        method: 'POST', body: JSON.stringify({ title: title || 'New Session' }),
      }),
    deleteSession: (sessionId: string) =>
      apiFetch<{ message: string }>(`/api/mentorship/sessions/${sessionId}`, { method: 'DELETE' }),
    getMessages: (sessionId: string) => apiFetch<{
      id: string; sender_role: string; content: string; created_at: string;
    }[]>(`/api/mentorship/sessions/${sessionId}/messages`),
    addMessage: (sessionId: string, sender_role: string, content: string) =>
      apiFetch<{ id: string; created_at: string }>(`/api/mentorship/sessions/${sessionId}/messages`, {
        method: 'POST', body: JSON.stringify({ sender_role, content }),
      }),
    updateTitle: (sessionId: string, title: string) =>
      apiFetch<{ message: string }>(`/api/mentorship/sessions/${sessionId}/title`, {
        method: 'PATCH', body: JSON.stringify({ title }),
      }),
  },

  // ─── Academy (Protected) ──────────────────────────────────────────────────

  academy: {
    getCourses: () => apiFetch<{
      id: string; title: string; description: string; difficulty_level: string; is_premium: boolean;
    }[]>('/api/academy/courses'),
    getProgress: (userId: string) => apiFetch<{
      course_id: string; status: string; progress_percentage: number; course_title: string;
    }[]>(`/api/academy/progress/${userId}`),
    enroll: (userId: string, course_id: string) =>
      apiFetch<{ message: string }>(`/api/academy/progress/${userId}/enroll`, {
        method: 'POST', body: JSON.stringify({ course_id }),
      }),
    updateProgress: (userId: string, courseId: string, progress_percentage: number, status: string) =>
      apiFetch<{ message: string }>(`/api/academy/progress/${userId}/${courseId}`, {
        method: 'PATCH', body: JSON.stringify({ progress_percentage, status }),
      }),
    getWatched: (userId: string) => apiFetch<string[]>(`/api/academy/watched/${userId}`),
    markWatched: (userId: string, videoId: string) => apiFetch<{ message: string }>(`/api/academy/watched/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ video_id: videoId }),
    }),
  },
};
