import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip,
  CircularProgress,
  Stack,
  Divider,
  Alert
} from '@mui/material';
import { 
  RequestQuote, 
  TrendingUp, 
  ErrorOutline, 
  AccessTime, 
  CheckCircleOutline 
} from '@mui/icons-material';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import MortgageCard from '../components/MortgageCard';
import FinancialHealthChart from '../components/FinancialHealthChart';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [mortgages, setMortgages] = useState([]);
  const [financialStress, setFinancialStress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch mortgages
        const mortgagesRes = await api.get('/api/mortgage');
        setMortgages(mortgagesRes.data);
        
        // Fetch financial stress prediction
        if (mortgagesRes.data.length > 0) {
          const stressRes = await api.get('/api/analytics/financial-stress');
          setFinancialStress(stressRes.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('אירעה שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  // Calculate total mortgage payments
  const totalMonthlyPayment = mortgages.reduce(
    (sum, mortgage) => sum + mortgage.monthlyPayment, 
    0
  );
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          שלום, {user?.name || 'לקוח יקר'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ברוכים הבאים למערכת Poalim Flex - החזרי משכנתא גמישים בהתאמה אישית
        </Typography>
      </Box>
      
      {mortgages.length === 0 ? (
        <Card sx={{ mb: 4, p: 4, textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              אין לך משכנתאות פעילות
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              כדי להתחיל להשתמש ב-Poalim Flex, אנא פנה לנציג הבנק או בקר בסניף.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={4}>
          {/* Summary Cards */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RequestQuote color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">סך הכל תשלומי משכנתא</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  ₪{totalMonthlyPayment.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  תשלום חודשי כולל לכל המשכנתאות
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">תחזית לחץ פיננסי</Typography>
                </Box>
                
                {financialStress ? (
                  <>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {financialStress.predictions.map((prediction) => (
                        <Chip
                          key={`${prediction.month}-${prediction.year}`}
                          label={`${prediction.month}: ${prediction.stressLevel}`}
                          color={
                            prediction.stressLevel === 'low' ? 'success' :
                            prediction.stressLevel === 'moderate' ? 'info' :
                            prediction.stressLevel === 'high' ? 'warning' : 'error'
                          }
                          icon={
                            prediction.stressLevel === 'low' ? <CheckCircleOutline /> :
                            prediction.stressLevel === 'moderate' ? <AccessTime /> : <ErrorOutline />
                          }
                        />
                      ))}
                    </Box>
                    {financialStress.predictions.some(p => p.likelyFlexCandidate) && (
                      <Typography variant="body2" color="warning.main">
                        בחודשים הקרובים צפוי לחץ פיננסי - שקול שימוש ב-Flex
                      </Typography>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    אין מספיק נתונים להערכת לחץ פיננסי
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Financial Health Chart */}
          {financialStress && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    תחזית בריאות פיננסית - 3 חודשים הקרובים
                  </Typography>
                  <Box sx={{ height: 300, my: 2 }}>
                    <FinancialHealthChart predictions={financialStress.predictions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Mortgages List */}
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
              המשכנתאות שלי
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={3}>
              {mortgages.map((mortgage) => (
                <MortgageCard 
                  key={mortgage._id} 
                  mortgage={mortgage} 
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;