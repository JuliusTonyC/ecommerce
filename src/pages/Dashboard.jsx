import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const recentActivity = [
    'You successfully logged in',
    'Account created',
    'Password encrypted & secured',
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.name}</h1>
          <p>Here's what's happening with your account today.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">ACCOUNT STATUS</span>
            <span className="stat-value">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">EMAIL</span>
            <span className="stat-value">{user.email}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">USER ID</span>
            <span className="stat-value">#{user._id}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">MEMBER SINCE</span>
            <span className="stat-value">Today</span>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <h3>Quick Actions</h3>
            <ul className="action-list">
              <li><button className="action-btn">Edit Profile</button></li>
              <li><button className="action-btn">Change Password</button></li>
              <li><button className="action-btn">View Activity</button></li>
              <li>
                <button className="action-btn logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>

          <div className="dashboard-section">
            <h3>Recent Activity</h3>
            <ul className="activity-list">
              {recentActivity.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;