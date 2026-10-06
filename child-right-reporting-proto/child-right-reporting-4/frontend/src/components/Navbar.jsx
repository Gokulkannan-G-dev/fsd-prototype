import { NavLink, Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">SafeVoice</Link>
        <nav className="nav-links">
          <NavLink to="/report">Report</NavLink>
          <NavLink to="/track">Track</NavLink>
          <NavLink to="/awareness">Awareness</NavLink>
          <NavLink to="/resources">Resources</NavLink>
          {user && ['reviewer', 'admin'].includes(user.role) && <NavLink to="/reviewer">Reviews</NavLink>}
          {user && user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-auth">
          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
