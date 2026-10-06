import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, saveSession } from '../services/api.js';

export default function Register({ onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { token, user } = await api.register(form);
      saveSession(token, user);
      onAuth(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page narrow">
      <h1>Create an account</h1>
      <p>An account is optional. It lets you see reports you submitted under your name.</p>
      <form onSubmit={submit} className="form">
        <label>Full name
          <input name="name" value={form.name} onChange={change} required />
        </label>
        <label>Email
          <input type="email" name="email" value={form.email} onChange={change} required />
        </label>
        <label>Password (6+ characters)
          <input type="password" name="password" value={form.password} onChange={change} minLength={6} required />
        </label>
        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Creating…' : 'Sign up'}</button>
      </form>
      <p>Already registered? <Link to="/login">Log in</Link></p>
    </div>
  );
}
