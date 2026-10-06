import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';

const CATEGORIES = [
  'Physical abuse', 'Emotional abuse', 'Sexual abuse', 'Neglect', 'Child labour',
  'Child marriage', 'Trafficking', 'Denial of education', 'Bullying or online harm', 'Other',
];

const empty = {
  category: '', description: '', location: '', childAge: 'unknown',
  urgency: 'medium', anonymous: true, contact: '',
};

export default function Report({ user }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [trackingId, setTrackingId] = useState(null);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.createReport(form);
      setTrackingId(res.trackingId);
      setForm(empty);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (trackingId) {
    return (
      <div className="page narrow">
        <h1>Thank you. Your report is in.</h1>
        <p>Save this tracking ID. You will need it to check progress.</p>
        <div className="tracking-id">{trackingId}</div>
        <div className="row">
          <button className="btn btn-outline" onClick={() => navigator.clipboard?.writeText(trackingId)}>Copy ID</button>
          <Link className="btn btn-primary" to={`/track/${trackingId}`}>Track this report</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <h1>Report a concern</h1>
      <div className="alert alert-urgent">
        If a child is in immediate danger, call <strong>112</strong> first.
      </div>
      <form onSubmit={submit} className="form">
        <label>What type of concern is this?
          <select name="category" value={form.category} onChange={change} required>
            <option value="">Choose one</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <label>What happened?
          <textarea name="description" rows={6} value={form.description} onChange={change}
            placeholder="Describe what you saw or heard, when it happened, and who was involved." required />
        </label>

        <label>Where did it happen?
          <input name="location" value={form.location} onChange={change} placeholder="Area, street, landmark or school" />
        </label>

        <div className="grid-2">
          <label>Child's approximate age
            <select name="childAge" value={form.childAge} onChange={change}>
              <option value="unknown">Not sure</option>
              <option value="0-5">0 to 5</option>
              <option value="6-9">6 to 9</option>
              <option value="10-12">10 to 12</option>
              <option value="13-15">13 to 15</option>
              <option value="16-17">16 to 17</option>
            </select>
          </label>
          <label>How urgent is it?
            <select name="urgency" value={form.urgency} onChange={change}>
              <option value="low">Can wait</option>
              <option value="medium">Needs attention soon</option>
              <option value="high">Child may be in danger now</option>
            </select>
          </label>
        </div>

        <label className="check">
          <input type="checkbox" name="anonymous" checked={form.anonymous} onChange={change} />
          Keep me anonymous
        </label>

        {!form.anonymous && (
          <label>Phone or email (shared only with reviewers)
            <input name="contact" value={form.contact} onChange={change} />
          </label>
        )}
        {!form.anonymous && !user && (
          <p className="hint">Log in if you want this report to appear in your own account.</p>
        )}

        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Submitting…' : 'Submit report'}</button>
      </form>
    </div>
  );
}
