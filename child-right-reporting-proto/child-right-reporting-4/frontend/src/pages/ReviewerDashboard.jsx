import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

const STATUSES = ['received', 'under_review', 'action_taken', 'resolved', 'closed'];
const label = (s) => s.replace('_', ' ');
const fmt = (d) => new Date(d).toLocaleString();

export default function ReviewerDashboard() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ status: '', urgency: '' });
  const [selectedId, setSelectedId] = useState(null);
  const [note, setNote] = useState('');
  const [publicUpdate, setPublicUpdate] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const q = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
    try {
      setReports(await api.listReports(q ? `?${q}` : ''));
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { load(); }, [filters]);

  const selected = reports.find((r) => r.id === selectedId);

  const save = async (body) => {
    setError('');
    try {
      await api.updateReport(selected.id, body);
      setNote('');
      setPublicUpdate('');
      await load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="page">
      <h1>Report reviews</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="row">
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
        <select value={filters.urgency} onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}>
          <option value="">All urgency levels</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <span className="muted">{reports.length} report(s)</span>
      </div>

      <div className="review-layout">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Category</th><th>Urgency</th><th>Status</th><th>Received</th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className={r.id === selectedId ? 'active' : ''} onClick={() => setSelectedId(r.id)}>
                  <td>{r.trackingId}</td>
                  <td>{r.category}</td>
                  <td><span className={`badge urgency-${r.urgency}`}>{r.urgency}</span></td>
                  <td><span className={`badge status-${r.status}`}>{label(r.status)}</span></td>
                  <td>{fmt(r.createdAt)}</td>
                </tr>
              ))}
              {reports.length === 0 && <tr><td colSpan="5" className="muted">No reports match these filters.</td></tr>}
            </tbody>
          </table>
        </div>

        <aside className="panel detail">
          {!selected ? (
            <p className="muted">Select a report to see its details.</p>
          ) : (
            <>
              <h2>{selected.category}</h2>
              <p className="muted">{selected.trackingId}</p>
              <p>{selected.description}</p>
              <dl>
                <dt>Location</dt><dd>{selected.location || 'Not given'}</dd>
                <dt>Child's age</dt><dd>{selected.childAge}</dd>
                <dt>Reporter</dt><dd>{selected.anonymous ? 'Anonymous' : selected.contact || 'No contact given'}</dd>
              </dl>

              <label>Status
                <select value={selected.status} onChange={(e) => save({ status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                </select>
              </label>

              <label>Update for the reporter
                <textarea rows={2} value={publicUpdate} onChange={(e) => setPublicUpdate(e.target.value)} />
              </label>
              <button className="btn btn-outline" disabled={!publicUpdate.trim()} onClick={() => save({ publicUpdate })}>
                Post update
              </button>

              <label>Internal note (reviewers only)
                <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
              </label>
              <button className="btn btn-outline" disabled={!note.trim()} onClick={() => save({ internalNote: note })}>
                Add note
              </button>

              {selected.internalNotes.length > 0 && (
                <ul className="timeline">
                  {selected.internalNotes.map((n, i) => (
                    <li key={i}><div>{n.text}</div><div className="muted">{n.by}, {fmt(n.at)}</div></li>
                  ))}
                </ul>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
