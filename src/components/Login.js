// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('Secur3P@ssw0rd');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting to authenticate with:', { email, password });
      
      const response = await fetch('http://localhost:8080/api/user/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        // For development only (helps with CORS issues)
        credentials: 'include'
      });
      
      console.log('Authentication response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }
      
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Login successful:', userData);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check for existing user session on component mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (user) {
    return (
      <div className="login-container">
        <div className="user-profile">
          <h2>Welcome, {user.firstName}!</h2>
          <p>Email: {user.email}</p>
          <p>User ID: {user.userId}</p>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <small>Password must contain at least one digit, one lowercase, one uppercase, and one special character (@#$%^&+=)</small>
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;