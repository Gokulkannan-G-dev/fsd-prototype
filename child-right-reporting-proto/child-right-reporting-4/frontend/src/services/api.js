const BASE = '/api';

export const getToken = () => localStorage.getItem('token');
export const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};
export const saveSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  // auth
  login: (body) => request('/auth/login', { method: 'POST', body }),
  register: (body) => request('/auth/register', { method: 'POST', body }),
  users: () => request('/auth/users'),
  setUserRole: (id, role) => request(`/auth/users/${id}/role`, { method: 'PATCH', body: { role } }),
  // reports
  createReport: (body) => request('/reports', { method: 'POST', body }),
  trackReport: (id) => request(`/reports/track/${encodeURIComponent(id)}`),
  myReports: () => request('/reports/mine'),
  listReports: (query = '') => request(`/reports${query}`),
  updateReport: (id, body) => request(`/reports/${id}`, { method: 'PATCH', body }),
  stats: () => request('/reports/stats'),
  // resources
  resources: () => request('/resources'),
  addResource: (body) => request('/resources', { method: 'POST', body }),
  deleteResource: (id) => request(`/resources/${id}`, { method: 'DELETE' }),
};
