import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Alert,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Save,
  Person,
  Notifications as NotificationsIcon,
  Security,
  Visibility,
  VisibilityOff,
  ArrowBack
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: user?.notifications?.email ?? true,
    push: user?.notifications?.push ?? true,
    sms: user?.notifications?.sms ?? false
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setSuccess(null);
    setError(null);
  };
  
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleNotificationChange = (e) => {
    setNotificationPreferences({
      ...notificationPreferences,
      [e.target.name]: e.target.checked
    });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await updateProfile({
        name: profileData.name,
        phone: profileData.phone
      });
      
      if (result.success) {
        setSuccess('הפרופיל עודכן בהצלחה');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'אירעה שגיאה בעדכון הפרופיל');
      }
    } catch (err) {
      setError('אירעה שגיאה בעדכון הפרופיל');
      console.error('Update profile error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await api.put('/api/auth/notifications', notificationPreferences);
      
      setSuccess('העדפות התראות עודכנו בהצלחה');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('אירעה שגיאה בעדכון העדפות התראות');
      console.error('Update notification preferences error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePassword = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('הסיסמאות אינן תואמות');
        setLoading(false);
        return;
      }
      
      if (passwordData.newPassword.length < 8) {
        setError('הסיסמה החדשה חייבת להכיל לפחות 8 תווים');
        setLoading(false);
        return;
      }
      
      // Mock API call for password change (would be implemented in real app)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('הסיסמה עודכנה בהצלחה');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('אירעה שגיאה בעדכון הסיסמה');
      console.error('Update password error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const getInitials = (name) => {
    if (!name) return 'U';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0);
    
    return names[0].charAt(0) + names[names.length - 1].charAt(0);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 2 }}
        >
          חזרה ללוח המחוונים
        </Button>
        <Typography variant="h4" component="h1">
          הפרופיל שלי
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 40,
                  bgcolor: 'primary.main',
                  margin: '0 auto 16px'
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                מספר לקוח: {user?.customerId}
              </Typography>
              
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ mt: 3 }}
              >
                התנתק
              </Button>
            </CardContent>
          </Card>
          
          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              orientation="vertical"
              variant="fullWidth"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab icon={<Person />} label="פרטים אישיים" />
              <Tab icon={<NotificationsIcon />} label="התראות" />
              <Tab icon={<Security />} label="אבטחה" />
            </Tabs>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                  פרטים אישיים
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="שם מלא"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="מספר טלפון"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="דואר אלקטרוני"
                      name="email"
                      value={profileData.email}
                      disabled
                      helperText="לא ניתן לשנות כתובת דואר אלקטרוני"
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={24} /> : <Save />}
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    {loading ? 'שומר שינויים...' : 'שמור שינויים'}
                  </Button>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  העדפות התראות
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    ערוצי התראות
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationPreferences.email}
                        onChange={handleNotificationChange}
                        name="email"
                        color="primary"
                      />
                    }
                    label="התראות בדואר אלקטרוני"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationPreferences.push}
                        onChange={handleNotificationChange}
                        name="push"
                        color="primary"
                      />
                    }
                    label="התראות פוש (באפליקציה)"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationPreferences.sms}
                        onChange={handleNotificationChange}
                        name="sms"
                        color="primary"
                      />
                    }
                    label="התראות SMS"
                  />
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    סוגי התראות
                  </Typography>
                  
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="התראות Flex (המלצות להקטנת תשלום משכנתא)"
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="תזכורות תשלום"
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="שינויים בתנאי המשכנתא"
                  />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="עדכוני מערכת והצעות"
                  />
                </Box>
                
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={24} /> : <Save />}
                    onClick={handleUpdateNotifications}
                    disabled={loading}
                  >
                    {loading ? 'שומר שינויים...' : 'שמור שינויים'}
                  </Button>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  הגדרות אבטחה
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  שינוי סיסמה
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="סיסמה נוכחית"
                      name="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="סיסמה חדשה"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      helperText="לפחות 8 תווים, עם אותיות ומספרים"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="אימות סיסמה חדשה"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={24} /> : <Save />}
                    onClick={handleUpdatePassword}
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {loading ? 'מעדכן סיסמה...' : 'עדכן סיסמה'}
                  </Button>
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  אפשרויות אבטחה נוספות
                </Typography>
                
                <FormControlLabel
                  control={<Switch defaultChecked color="primary" />}
                  label="אימות דו-שלבי"
                />
                
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    אימות דו-שלבי מוסיף שכבת אבטחה נוספת לחשבונך על ידי דרישת קוד אימות בנוסף לסיסמה בעת התחברות.
                  </Typography>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;