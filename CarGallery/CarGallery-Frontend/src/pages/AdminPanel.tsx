import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (user?.role !== 'admin') {
    return (
      <div className="access-denied">
        <h1>🚫 Access Denied</h1>
        <p>You must have admin privileges to access this page.</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <nav className="admin-nav">
        <div className="admin-nav-header">
          <h1>🚗 Car Gallery Admin</h1>
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout} className="danger">
              Logout
            </button>
          </div>
        </div>
        <div className="admin-nav-links">
          <Link to="/admin/cars" className="nav-link">
            🚘 Cars
          </Link>
          <Link to="/admin/brands" className="nav-link">
            🏷️ Brands
          </Link>
          <Link to="/admin/users" className="nav-link">
            👥 Users
          </Link>
          <Link to="/" className="nav-link">
            🏠 Home
          </Link>
        </div>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
