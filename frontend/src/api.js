const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  submitTestimonial: (payload) =>
    request('/api/submissions', { method: 'POST', body: JSON.stringify(payload) }),

  listModeration: (status = 'pending') =>
    request(`/api/moderation?status=${status}`),

  approve: (id) => request(`/api/moderation/${id}/approve`, { method: 'PATCH' }),

  reject: (id) => request(`/api/moderation/${id}/reject`, { method: 'PATCH' }),

  getWall: (page = 1, limit = 10) =>
    request(`/api/wall?page=${page}&limit=${limit}`),
};
