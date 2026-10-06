import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Report from './pages/Report.jsx';
import TrackReport from './pages/TrackReport.jsx';
import Awareness from './pages/Awareness.jsx';
import Resources from './pages/Resources.jsx';
import ReviewerDashboard from './pages/ReviewerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { getStoredUser, clearSession } from './services/api.js';

export default function App() {
  const [user, setUser] = useState(getStoredUser());

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onAuth={setUser} />} />
          <Route path="/register" element={<Register onAuth={setUser} />} />
          <Route path="/report" element={<Report user={user} />} />
          <Route path="/track" element={<TrackReport user={user} />} />
          <Route path="/track/:trackingId" element={<TrackReport user={user} />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/resources" element={<Resources />} />
          <Route
            path="/reviewer"
            element={
              <ProtectedRoute user={user} roles={['reviewer', 'admin']}>
                <ReviewerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} roles={['admin']}>
                <AdminDashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          In immediate danger? Call <strong>112</strong>. For child helpline support, call <strong>1098</strong>.
        </div>
      </footer>
    </>
  );
}
