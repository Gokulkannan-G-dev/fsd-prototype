import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

const emptyResource = { type: 'helpline', title: '', description: '', contact: '', link: '' };

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(emptyResource);
  const [error, setError] = useState('');

  const loadAll = async () => {
    try {
      const [s, u, r] = await Promise.all([api.stats(), api.users(), api.resources()]);
      setStats(s); setUsers(u); setResources(r);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { loadAll(); }, []);

  const changeRole = async (id, role) => {
    setError('');
    try { await api.setUserRole(id, role); loadAll(); } catch (e) { setError(e.message); }
  };

  const addResource = async (e) => {
    e.preventDefault();
    setError('');
    try { await api.addResource(form); setForm(emptyResource); loadAll(); } catch (e2) { setError(e2.message); }
  };

  const removeResource = async (id) => {
    setError('');
    try { await api.deleteResource(id); loadAll(); } catch (e) { setError(e.message); }
  };

  return (
    <div className="page">
      <h1>Admin</h1>
      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <section>
          <h2>Overview</h2>
          <div className="stats">
            <div className="stat"><strong>{stats.total}</strong><span>Total reports</span></div>
            <div className="stat"><strong>{stats.highUrgencyOpen}</strong><span>High urgency, still open</span></div>
            <div className="stat"><strong>{stats.byStatus.under_review}</strong><span>Under review</span></div>
            <div className="stat"><strong>{stats.byStatus.resolved}</strong><span>Resolved</span></div>
          </div>
          <h3>By category</h3>
          <ul className="plain">
            {Object.entries(stats.byCategory).map(([k, v]) => <li key={k}>{k}: {v}</li>)}
          </ul>
        </section>
      )}

      <section>
        <h2>Users</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} disabled={u.id === user.id} onChange={(e) => changeRole(u.id, e.target.value)}>
                      <option value="user">user</option>
                      <option value="reviewer">reviewer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Resources</h2>
        <form onSubmit={addResource} className="form">
          <div className="grid-2">
            <label>Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="helpline">Helpline</option>
                <option value="legal">Law or right</option>
                <option value="guide">Guide</option>
              </select>
            </label>
            <label>Title
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
          </div>
          <label>Description
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </label>
          <div className="grid-2">
            <label>Phone number (optional)
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </label>
            <label>Website (optional)
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
            </label>
          </div>
          <button className="btn btn-primary">Add resource</button>
        </form>

        <div className="list">
          {resources.map((r) => (
            <article key={r.id} className="list-item">
              <div><h3>{r.title}</h3><p className="muted">{r.type}</p></div>
              <button className="btn btn-danger" onClick={() => removeResource(r.id)}>Delete</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
