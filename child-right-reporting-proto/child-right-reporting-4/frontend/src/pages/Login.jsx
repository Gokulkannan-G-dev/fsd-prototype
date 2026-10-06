import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api, saveSession } from '../services/api.js';

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { token, user } = await api.login(form);
      saveSession(token, user);
      onAuth(user);
      const fallback = user.role === 'admin' ? '/admin' : user.role === 'reviewer' ? '/reviewer' : '/';
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page narrow">
      <h1>Log in</h1>
      <form onSubmit={submit} className="form">
        <label>Email
          <input type="email" name="email" value={form.email} onChange={change} required />
        </label>
        <label>Password
          <input type="password" name="password" value={form.password} onChange={change} required />
        </label>
        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p>New here? <Link to="/register">Create an account</Link></p>
      <div className="demo-box">
        <strong>Demo accounts</strong>
        <div>Admin: admin@example.com / admin123</div>
        <div>Reviewer: reviewer@example.com / reviewer123</div>
        <div>User: user@example.com / user123</div>
      </div>
    </div>
  );
}
