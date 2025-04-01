import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Grid,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';

const Register = () => {
  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['פרטים אישיים', 'פרטי התחברות', 'אימות'];
  
  const [formData, setFormData] = useState({
    name: '',
    customerId: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!formData.name || !formData.customerId || !formData.phone) {
        setError('נא למלא את כל השדות');
        return;
      }
      // Validate customer ID (Israeli ID)
      if (!/^\d{9}$/.test(formData.customerId)) {
        setError('מספר זהות לא תקין');
        return;
      }
      // Validate phone
      if (!/^05\d{8}$/.test(formData.phone)) {
        setError('מספר טלפון לא תקין');
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('נא למלא את כל השדות');
        return;
      }
      // Validate email
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('כתובת דואר אלקטרוני לא תקינה');
        return;
      }
      // Validate password
      if (formData.password.length < 8) {
        setError('הסיסמה חייבת להכיל לפחות 8 תווים');
        return;
      }
      // Check passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('הסיסמאות אינן תואמות');
        return;
      }
    }
    
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    
    try {
      setIsSubmitting(true);
      // Prepare data for registration (exclude confirmPassword)
      const { confirmPassword, ...registerData } = formData;
      
      const result = await register(registerData);
      
      if (!result.success) {
        setError(result.message);
        setActiveStep(1); // Go back to credentials step if email exists
      }
    } catch (err) {
      setError('שגיאת הרשמה. אנא נסה שוב.');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Logo sx={{ fontSize: 60, mb: 2 }} />
          <Typography component="h1" variant="h4">
            Poalim Flex
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            החזרי משכנתא גמישים בהתאמה אישית
          </Typography>
        </Box>
        
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2
          }}
        >
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            הרשמה
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={(e) => { e.preventDefault(); if (activeStep === 2) handleSubmit(); else handleNext(); }}>
            {activeStep === 0 && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="שם מלא"
                  name="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="customerId"
                  label="מספר זהות"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  label="מספר טלפון נייד"
                  name="phone"
                  placeholder="05X-XXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
              </>
            )}
            
            {activeStep === 1 && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="דואר אלקטרוני"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="סיסמה"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
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
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="אימות סיסמה"
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
              </>
            )}
            
            {activeStep === 2 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  סיכום פרטים
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      שם מלא
                    </Typography>
                    <Typography variant="body1">
                      {formData.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      מספר זהות
                    </Typography>
                    <Typography variant="body1">
                      {formData.customerId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      טלפון נייד
                    </Typography>
                    <Typography variant="body1">
                      {formData.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      דואר אלקטרוני
                    </Typography>
                    <Typography variant="body1">
                      {formData.email}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Alert severity="info" sx={{ mt: 3 }}>
                  אנא ודא שכל הפרטים נכונים לפני השלמת ההרשמה
                </Alert>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || isSubmitting}
              >
                חזרה
              </Button>
              
              <Button
                variant="contained"
                color={activeStep === 2 ? "secondary" : "primary"}
                type="submit"
                disabled={isSubmitting}
                endIcon={activeStep === 2 ? <PersonAdd /> : null}
              >
                {isSubmitting
                  ? 'מעבד...'
                  : activeStep === 2
                  ? 'השלם הרשמה'
                  : 'המשך'}
              </Button>
            </Box>
          </form>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              כבר יש לך חשבון? התחבר
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;