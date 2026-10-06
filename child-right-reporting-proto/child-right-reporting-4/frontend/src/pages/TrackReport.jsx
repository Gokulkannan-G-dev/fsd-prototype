import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

const STATUS_LABEL = {
  received: 'Received',
  under_review: 'Under review',
  action_taken: 'Action taken',
  resolved: 'Resolved',
  closed: 'Closed',
};

const fmt = (d) => new Date(d).toLocaleString();

export default function TrackReport({ user }) {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(trackingId || '');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [mine, setMine] = useState([]);

  const lookup = async (id) => {
    setError('');
    setReport(null);
    try {
      setReport(await api.trackReport(id));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (trackingId) { setInput(trackingId); lookup(trackingId); }
  }, [trackingId]);

  useEffect(() => {
    if (user) api.myReports().then(setMine).catch(() => {});
  }, [user]);

  const submit = (e) => {
    e.preventDefault();
    if (input.trim()) navigate(`/track/${input.trim().toUpperCase()}`);
  };

  return (
    <div className="page narrow">
      <h1>Track a report</h1>
      <form onSubmit={submit} className="inline-form">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter tracking ID, e.g. CR-DEMO01" />
        <button className="btn btn-primary">Check status</button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {report && (
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="muted">{report.trackingId}</div>
              <h2>{report.category}</h2>
            </div>
            <span className={`badge status-${report.status}`}>{STATUS_LABEL[report.status]}</span>
          </div>
          <ul className="timeline">
            {[...report.updates].reverse().map((u, i) => (
              <li key={i}>
                <div>{u.text}</div>
                <div className="muted">{fmt(u.at)}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {user && mine.length > 0 && (
        <>
          <h2>Your reports</h2>
          <ul className="plain">
            {mine.map((r) => (
              <li key={r.trackingId}>
                <button className="link-btn" onClick={() => navigate(`/track/${r.trackingId}`)}>
                  {r.trackingId}
                </button>{' '}
                – {r.category} ({STATUS_LABEL[r.status]})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
