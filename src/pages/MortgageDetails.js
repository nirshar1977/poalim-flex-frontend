import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Tab,
  Tabs,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ArrowBack,
  BarChart,
  History,
  Settings,
  ArrowDropDown,
  ArrowDropUp,
  CalendarMonth
} from '@mui/icons-material';
import api from '../utils/api';

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mortgage-tabpanel-${index}`}
      aria-labelledby={`mortgage-tab-${index}`}
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

const MortgageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [mortgage, setMortgage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    const fetchMortgage = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/mortgage/${id}`);
        setMortgage(res.data);
      } catch (err) {
        console.error('Fetch mortgage error:', err);
        setError('אירעה שגיאה בטעינת נתוני המשכנתא. אנא נסה שוב.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMortgage();
  }, [id]);
  
  const handleToggleFlex = async () => {
    try {
      const res = await api.put(`/api/mortgage/${id}/toggle-flex`);
      
      setMortgage((prev) => ({
        ...prev,
        flexEnabled: res.data.flexEnabled
      }));
      
      setSuccessMessage(
        res.data.flexEnabled
          ? 'Flex הופעל בהצלחה. כעת תוכל להשתמש בו בתשלומים.'
          : 'Flex הושבת בהצלחה.'
      );
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Toggle flex error:', err);
      setError('אירעה שגיאה בהפעלת/כיבוי Flex. אנא נסה שוב.');
    }
  };
  
  const handleUpdateMaxUsage = async (maxUsage) => {
    try {
      const res = await api.put(`/api/mortgage/${id}/max-flex-usage`, {
        maxUsage
      });
      
      setMortgage((prev) => ({
        ...prev,
        maxFlexUsagePerYear: res.data.maxFlexUsagePerYear
      }));
      
      setSuccessMessage('הגדרות Flex עודכנו בהצלחה');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Update max flex usage error:', err);
      setError('אירעה שגיאה בעדכון הגדרות Flex. אנא נסה שוב.');
    }
  };
  
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
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
  
  // Calculate progress percentage
  const originalTerm = Math.ceil((mortgage.endDate - mortgage.startDate) / (1000 * 60 * 60 * 24 * 30.5));
  const elapsedMonths = originalTerm - mortgage.remainingMonths;
  const progressPercentage = (elapsedMonths / originalTerm) * 100;
  
// Format dates
const startDate = new Date(mortgage.startDate).toLocaleDateString();
const endDate = new Date(mortgage.endDate).toLocaleDateString();
const lastPaymentDate = mortgage.lastPaymentDate ? new Date(mortgage.lastPaymentDate).toLocaleDateString() : 'לא זמין';

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
        פרטי משכנתא #{mortgage.mortgageId}
      </Typography>
      <Chip 
        label={mortgage.flexEnabled ? 'Flex פעיל' : 'Flex לא פעיל'} 
        color={mortgage.flexEnabled ? 'secondary' : 'default'}
        size="small"
        sx={{ ml: 2 }}
      />
    </Box>
    
    {error && (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    )}
    
    {successMessage && (
      <Alert severity="success" sx={{ mb: 4 }}>
        {successMessage}
      </Alert>
    )}
    
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              סיכום משכנתא
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  קרן מקורית
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  ₪{mortgage.originalAmount.toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  יתרה נוכחית
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  ₪{mortgage.currentBalance.toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  תשלום חודשי
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="primary.main">
                  ₪{mortgage.monthlyPayment.toLocaleString()}
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
                  תאריך התחלה
                </Typography>
                <Typography variant="body1">
                  {startDate}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  תאריך סיום
                </Typography>
                <Typography variant="body1">
                  {endDate}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  תשלום אחרון
                </Typography>
                <Typography variant="body1">
                  {lastPaymentDate}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              הגדרות Flex
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={mortgage.flexEnabled}
                    onChange={handleToggleFlex}
                    color="secondary"
                  />
                }
                label={mortgage.flexEnabled ? "Flex פעיל" : "Flex לא פעיל"}
              />
              <Typography variant="body2" color="text.secondary">
                הפעל או כבה את תכונת Flex למשכנתא זו
              </Typography>
            </Box>
            
            {mortgage.flexEnabled && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    מספר מקסימלי של שימושים ב-Flex בשנה:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {[3, 4, 5, 6].map((num) => (
                      <Chip
                        key={num}
                        label={num}
                        color={mortgage.maxFlexUsagePerYear === num ? "secondary" : "default"}
                        onClick={() => handleUpdateMaxUsage(num)}
                        clickable
                      />
                    ))}
                  </Stack>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    שימושי Flex בשנה הנוכחית
                  </Typography>
                  <Chip 
                    label={`${mortgage.flexUsageCount} / ${mortgage.maxFlexUsagePerYear}`} 
                    color={mortgage.flexUsageCount >= mortgage.maxFlexUsagePerYear ? "error" : "success"}
                    size="small"
                  />
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  component={RouterLink}
                  to={`/mortgage/${mortgage._id}/flex`}
                  disabled={mortgage.flexUsageCount >= mortgage.maxFlexUsagePerYear}
                  sx={{ mt: 3 }}
                >
                  הפעל Flex עכשיו
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              התקדמות ההלוואה
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  <b>{elapsedMonths}</b> חודשים שחלפו
                </Typography>
                <Typography variant="body2">
                  <b>{mortgage.remainingMonths}</b> חודשים נותרו
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage} 
                sx={{ height: 20, borderRadius: 5 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {startDate}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {endDate}
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab icon={<History />} label="היסטוריית Flex" />
                <Tab icon={<BarChart />} label="נתונים" />
                <Tab icon={<CalendarMonth />} label="לוח תשלומים" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                {mortgage.flexHistory && mortgage.flexHistory.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>תאריך</TableCell>
                          <TableCell>תשלום מקורי</TableCell>
                          <TableCell>סכום הפחתה</TableCell>
                          <TableCell>סטטוס</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mortgage.flexHistory.map((item, index) => {
                          const date = new Date(item.date);
                          const formattedDate = date.toLocaleDateString();
                          
                          return (
                            <TableRow key={index}>
                              <TableCell>{formattedDate}</TableCell>
                              <TableCell>₪{item.originalAmount.toLocaleString()}</TableCell>
                              <TableCell>₪{item.reducedAmount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Chip 
                                  label="הושלם" 
                                  color="success"
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" gutterBottom>
                      אין היסטוריית שימוש ב-Flex
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      כשתשתמש ב-Flex, תוכל לראות כאן את ההיסטוריה
                    </Typography>
                  </Box>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        סך הכל שולם
                      </Typography>
                      <Typography variant="h5" color="primary.main">
                        ₪{(mortgage.originalAmount - mortgage.currentBalance).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {((mortgage.originalAmount - mortgage.currentBalance) / mortgage.originalAmount * 100).toFixed(1)}% מהקרן המקורית
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        סך הכל נותר לתשלום
                      </Typography>
                      <Typography variant="h5" color="error.main">
                        ₪{mortgage.currentBalance.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        כולל קרן + ריבית
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        הערכת ריבית כוללת
                      </Typography>
                      <Typography variant="h5">
                        ₪{((mortgage.monthlyPayment * originalTerm) - mortgage.originalAmount).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(((mortgage.monthlyPayment * originalTerm) / mortgage.originalAmount - 1) * 100).toFixed(1)}% מהקרן המקורית
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        סך תשלומים
                      </Typography>
                      <Typography variant="h5">
                        {originalTerm} תשלומים
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {elapsedMonths} הושלמו, {mortgage.remainingMonths} נותרו
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  לוח תשלומים מראה את 12 התשלומים הבאים במשכנתא
                </Alert>
                
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>תאריך</TableCell>
                        <TableCell>תשלום</TableCell>
                        <TableCell>קרן</TableCell>
                        <TableCell>ריבית</TableCell>
                        <TableCell>יתרה</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...Array(12)].map((_, index) => {
                        // Calculate payment date
                        const paymentDate = new Date();
                        paymentDate.setMonth(paymentDate.getMonth() + index + 1);
                        paymentDate.setDate(10); // Assume payment on 10th of each month
                        
                        // Simple amortization calculation (for demo purposes)
                        const monthlyInterest = mortgage.interestRate / 12;
                        const remainingBalance = mortgage.currentBalance * 
                          Math.pow(1 + monthlyInterest, index) - 
                          mortgage.monthlyPayment * ((Math.pow(1 + monthlyInterest, index) - 1) / monthlyInterest);
                        
                        const interestPayment = remainingBalance * monthlyInterest;
                        const principalPayment = mortgage.monthlyPayment - interestPayment;
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              {paymentDate.toLocaleDateString()}
                            </TableCell>
                            <TableCell>₪{mortgage.monthlyPayment.toLocaleString()}</TableCell>
                            <TableCell>₪{principalPayment.toFixed(2)}</TableCell>
                            <TableCell>₪{interestPayment.toFixed(2)}</TableCell>
                            <TableCell>₪{Math.max(0, remainingBalance).toLocaleString()}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </Box>
          </CardContent>
        </Card>
        
        {mortgage.flexEnabled && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Poalim Flex - החזרי משכנתא גמישים
                </Typography>
                <Chip 
                  label="זמין" 
                  color="secondary"
                  size="small"
                />
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="body1" paragraph>
                    Poalim Flex מאפשר לך להקטין זמנית את החזר המשכנתא החודשי ולהחזיר את ההפרש בפריסה חכמה לאורך יתר תקופת ההלוואה.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    בחודשים עם הוצאות גבוהות, תוכל להפחית עד 50% מהתשלום החודשי שלך.
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      component={RouterLink}
                      to={`/mortgage/${mortgage._id}/flex`}
                      disabled={mortgage.flexUsageCount >= mortgage.maxFlexUsagePerYear}
                      size="large"
                    >
                      הפעל Flex עכשיו
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'secondary.light', 
                      color: 'white',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h5" align="center" gutterBottom>
                      עד ₪{Math.floor(mortgage.monthlyPayment * 0.5).toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle2" align="center">
                      ניתן להפחית בכל חודש
                    </Typography>
                    <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
                    <Typography variant="body2" align="center">
                      נותרו {mortgage.maxFlexUsagePerYear - mortgage.flexUsageCount} שימושים השנה
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  </Container>
);
};

export default MortgageDetails;