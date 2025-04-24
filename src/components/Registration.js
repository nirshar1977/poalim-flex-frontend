// src/components/Registration.js
import React, { useState } from 'react';
import './Login.css';

function Registration() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Secur3P@ssw0rd',
    confirmPassword: 'Secur3P@ssw0rd',
    phoneNumber: '555-123-4567'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validatePassword = (password) => {
    // Password must contain at least one digit, one lowercase, one uppercase, and one special character
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (!validatePassword(formData.password)) {
      setError('הסיסמה צריכה להכיל לפחות ספרה אחת, אות גדולה, אות קטנה ותו מיוחד');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber
        }),
        credentials: 'include'
      });
      
      if (response.status === 409) {
        throw new Error('דואר אלקטרוני זה כבר קיים במערכת');
      }

      if (!response.ok) {
        throw new Error(`הרשמה נכשלה: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log('הרשמה הצליחה:', userData);
      setSuccess('ההרשמה הושלמה בהצלחה! ניתן להתחבר עם הפרטים שלך.');
      
    } catch (err) {
      console.error('שגיאת הרשמה:', err);
      setError(err.message || 'ההרשמה נכשלה. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>הרשמה למערכת</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="form-group">
          <label htmlFor="firstName">שם פרטי</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="הזן את שמך הפרטי"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">שם משפחה</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="הזן את שם המשפחה שלך"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">דואר אלקטרוני</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="הזן את כתובת הדואר האלקטרוני שלך"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">סיסמה</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="הזן סיסמה"
          />
          <small>הסיסמה צריכה להכיל לפחות ספרה אחת, אות גדולה, אות קטנה ותו מיוחד</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">אישור סיסמה</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="אשר את הסיסמה"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">מספר טלפון</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            placeholder="הזן את מספר הטלפון שלך"
          />
        </div>
        
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'מבצע הרשמה...' : 'הירשם'}
        </button>
      </form>
    </div>
  );
}

export default Registration;