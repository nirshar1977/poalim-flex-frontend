import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Import the new Poalim theme
import poalimTheme from './theme/poalimTheme';

// Components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MortgageDetails from './pages/MortgageDetails';
import FlexCalculator from './pages/FlexCalculator';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// RTL cache for Hebrew support
const cacheRtl = createCache({
  key: 'poalim-rtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={poalimTheme}>
          <CssBaseline />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            bgcolor: 'primary.main' 
          }}>
            <CircularProgress size={80} sx={{ color: 'white' }} />
          </Box>
        </ThemeProvider>
      </CacheProvider>
    );
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={poalimTheme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <div className="app">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/mortgage/:id" 
                      element={
                        <ProtectedRoute>
                          <MortgageDetails />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/mortgage/:id/flex" 
                      element={
                        <ProtectedRoute>
                          <FlexCalculator />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/notifications" 
                      element={
                        <ProtectedRoute>
                          <Notifications />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;