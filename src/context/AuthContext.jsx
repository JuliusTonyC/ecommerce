import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

const API_URL = 'http://localhost:5000';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if we still have a valid token
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signup = async (name, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');

    localStorage.setItem('token', data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('token', data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (name, email) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Update failed');

    setUser(data);
    return data;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/user/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Password update failed');
    return data;
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateProfile,
    updatePassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="loading-screen">Loading...</div> : children}
    </AuthContext.Provider>
  );
};