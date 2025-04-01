import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  Slider,
  Button, 
  Grid, 
  Alert,
  CircularProgress,
  Stack,
  TextField,
  Paper
} from '@mui/material';
import { 
  Timeline, 
  TimelineItem, 
  TimelineSeparator, 
  TimelineConnector, 
  TimelineContent, 
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { CheckCircle, ArrowBack, ArrowDownward, ErrorOutline } from '@mui/icons-material';
import api from '../utils/api';
import FlexDistributionChart from '../components/FlexDistributionChart';

const FlexCalculator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [mortgage, setMortgage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reductionAmount, setReductionAmount] = useState(500);
  const [distribution, setDistribution] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchMortgage = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/mortgage/${id}`);
        setMortgage(res.data);
        
        // Set initial reduction amount to 20% of monthly payment
        const initialReduction = Math.min(
          Math.floor(res.data.monthlyPayment * 0.2 / 100) * 100,
          1500
        );
        setReductionAmount(initialReduction);
        
        // Calculate initial distribution
        calculateDistribution(initialReduction);
      } catch (err) {
        console.error('Fetch mortgage error:', err);
        setError('אירעה שגיאה בטעינת נתוני המשכנתא. אנא נסה שוב.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMortgage();
  }, [id]);
  
  const calculateDistribution = async (amount) => {
    try {
      const res = await api.post(`/api/flex/${id}/calculate`, {
        reductionAmount: amount
      });
      setDistribution(res.data);
    } catch (err) {
      console.error('Calculate distribution error:', err);
      setError('אירעה שגיאה בחישוב תוכנית ההחזר. אנא נסה שוב.');
    }
  };
  
  const handleSliderChange = (_, value) => {
    setReductionAmount(value);
    calculateDistribution(value);
  };
  
  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (isNaN(value)) return;
    
    const maxReduction = Math.min(mortgage.monthlyPayment * 0.5, 3000);
    const validValue = Math.max(100, Math.min(value, maxReduction));
    
    setReductionAmount(validValue);
    calculateDistribution(validValue);
  };
  
  const handleApplyFlex = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.post(`/api/flex/${id}/reduce`, {
        reductionAmount
      });
      
      setSuccessMessage('בקשת Flex אושרה בהצלחה! התשלום החודשי הקרוב יופחת.');
      
      // Wait 3 seconds and redirect to mortgage details
      setTimeout(() => {
        navigate(`/mortgage/${id}`);
      }, 3000);
    } catch (err) {
      console.error('Apply flex error:', err);
      setError(
        err.response?.data?.message || 
        'אירעה שגיאה בהגשת בקשת ה-Flex. אנא נסה שוב.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  if (!mortgage) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          המשכנתא לא נמצאה או שאין לך הרשאה לצפות בה.
        </Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          חזרה ללוח המחוונים
        </Button>
      </Container>
    );
  }
  
  // Maximum reduction - 50% of monthly payment or 3000 ILS, whichever is lower
  const maxReduction = Math.min(mortgage.monthlyPayment * 0.5, 3000);
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(`/mortgage/${id}`)}
          sx={{ mr: 2 }}
        >
          חזרה לפרטי המשכנתא
        </Button>
        <Typography variant="h4" component="h1">
          מחשבון Flex
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert 
          icon={<CheckCircle fontSize="inherit" />}
          severity="success" 
          sx={{ mb: 4 }}
        >
          {successMessage}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                פרטי המשכנתא
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    מספר משכנתא
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {mortgage.mortgageId}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    תשלום חודשי נוכחי
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ₪{mortgage.monthlyPayment.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    יתרת חודשים לסיום
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {mortgage.remainingMonths}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    ריבית שנתית
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {(mortgage.interestRate * 100).toFixed(2)}%
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    שימושי Flex בשנה הנוכחית
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {mortgage.flexUsageCount} / {mortgage.maxFlexUsagePerYear}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                בחר סכום להפחתה
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Slider
                      value={reductionAmount}
                      onChange={handleSliderChange}
                      min={100}
                      max={maxReduction}
                      step={100}
                      marks={[
                        { value: 100, label: '₪100' },
                        { value: maxReduction, label: `₪${maxReduction}` }
                      ]}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      value={reductionAmount}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <Typography>₪</Typography>,
                        inputProps: {
                          min: 100,
                          max: maxReduction,
                          style: { textAlign: 'right' }
                        }
                      }}
                      sx={{ width: 100 }}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
                <Typography variant="h5" align="center" gutterBottom>
                  ₪{(mortgage.monthlyPayment - reductionAmount).toLocaleString()}
                </Typography>
                <Typography variant="body2" align="center">
                  התשלום החודשי בחודש הקרוב
                </Typography>
              </Paper>
              
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={handleApplyFlex}
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <ArrowDownward />}
                  sx={{ minWidth: 200 }}
                >
                  {isSubmitting ? 'מגיש בקשה...' : 'הפעל Flex עכשיו'}
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  הפחתת התשלום תחול על ההחזר הקרוב
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {distribution && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  פריסת החזר
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      תשלום מקורי
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ₪{mortgage.monthlyPayment.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      סכום הפחתה
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="secondary.main">
                      ₪{reductionAmount.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      תוספת ריבית כוללת
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color={distribution.totalInterestAdded > 0 ? "error" : "success.main"}>
                      ₪{Math.abs(distribution.totalInterestAdded).toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
                
                <Box sx={{ height: 250, mb: 3 }}>
                  <FlexDistributionChart 
                    distributionPlan={distribution.distributionPlan} 
                    reductionAmount={reductionAmount}
                  />
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  פריסת החזר (6 חודשים הבאים):
                </Typography>
                
                <Timeline position="alternate" sx={{ p: 0 }}>
                  {distribution.distributionPlan.slice(0, 6).map((item, index) => {
                    const month = new Date(item.month).toLocaleString('default', { month: 'long' });
                    const year = new Date(item.month).getFullYear();
                    
                    return (
                      <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary">
                          {month} {year}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color={index === 0 ? "secondary" : "primary"} />
                          {index < 5 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="body2" fontWeight="bold">
                            +₪{item.additionalAmount.toFixed(0)}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    );
                  })}
                </Timeline>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    ההחזרים יתפרסו על פני {distribution.distributionPlan.length} חודשים
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                הערות חשובות
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <ErrorOutline color="warning" sx={{ mr: 1, mt: 0.5 }} />
                  <Typography variant="body2">
                    שימוש ב-Flex עשוי להוסיף ריבית קטנה לסך המשכנתא עקב פריסת התשלום.
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <ErrorOutline color="warning" sx={{ mr: 1, mt: 0.5 }} />
                  <Typography variant="body2">
                    ניתן להשתמש ב-Flex עד {mortgage.maxFlexUsagePerYear} פעמים בשנה.
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <ErrorOutline color="warning" sx={{ mr: 1, mt: 0.5 }} />
                  <Typography variant="body2">
                    לא ניתן להפחית יותר מ-50% מהתשלום החודשי הרגיל.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FlexCalculator;