import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Settings = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const navigate = useNavigate();

  // Profile states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await updateProfile(name, email);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setPasswordMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <h2>Settings</h2>

      {/* Profile Form */}
      {message && (
        <p style={{ color: 'green', marginBottom: 12, textAlign: 'center' }}>
          {message}
        </p>
      )}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleProfileSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <hr style={{ margin: '30px 0', border: '1px solid #e2e8f0' }} />

      {/* Password Form */}
      <h3 style={{ marginBottom: 20, textAlign: 'center', color: '#2c3e50' }}>
        Change Password
      </h3>

      {passwordMessage && (
        <p style={{ color: 'green', marginBottom: 12, textAlign: 'center' }}>
          {passwordMessage}
        </p>
      )}
      {passwordError && <p className="error-message">{passwordError}</p>}

      <form onSubmit={handlePasswordSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter current password"
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Re-enter new password"
          />
        </div>
        <button type="submit" className="auth-btn" disabled={passwordLoading}>
          {passwordLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <hr style={{ margin: '30px 0', border: '1px solid #e2e8f0' }} />

      {/* Logout Button */}
      <button
        className="auth-btn"
        onClick={handleLogout}
        style={{ backgroundColor: '#dc2626' }}
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;