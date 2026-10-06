import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ user, roles, children }) {
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="page narrow">
        <h1>No access</h1>
        <p>Your account does not have permission to view this page.</p>
      </div>
    );
  }
  return children;
}
