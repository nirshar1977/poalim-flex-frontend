import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Chip, 
  Button,
  Grid,
  LinearProgress,
  Stack,
  Divider
} from '@mui/material';
import { 
  Home, 
  Insights, 
  CheckCircle, 
  Cancel
} from '@mui/icons-material';

const MortgageCard = ({ mortgage }) => {
  // Calculate progress percentage
  const originalTerm = Math.ceil((mortgage.endDate - mortgage.startDate) / (1000 * 60 * 60 * 24 * 30.5));
  const elapsedMonths = originalTerm - mortgage.remainingMonths;
  const progressPercentage = (elapsedMonths / originalTerm) * 100;
  
  // Format dates
  const startDate = new Date(mortgage.startDate).toLocaleDateString();
  const endDate = new Date(mortgage.endDate).toLocaleDateString();
  
  return (
    <Card sx={{ border: mortgage.flexEnabled ? '1px solid #ff9e1b' : 'none' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Home color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                משכנתא #{mortgage.mortgageId}
              </Typography>
              <Chip 
                label={mortgage.flexEnabled ? 'Flex פעיל' : 'Flex לא פעיל'} 
                color={mortgage.flexEnabled ? 'secondary' : 'default'}
                icon={mortgage.flexEnabled ? <CheckCircle /> : <Cancel />}
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>
            
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  קרן מקורית
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  ₪{mortgage.originalAmount.toLocaleString()}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  יתרה נוכחית
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  ₪{mortgage.currentBalance.toLocaleString()}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  תשלום חודשי
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="primary.main">
                  ₪{mortgage.monthlyPayment.toLocaleString()}
                </Typography>
              </Box>
            </Stack>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                התקדמות ההלוואה
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage} 
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  תאריך התחלה: {startDate}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  תאריך סיום: {endDate}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Divider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' }}} />
            <Divider sx={{ display: { xs: 'block', md: 'none' }, my: 2 }} />
            
            <Stack spacing={2} alignItems="center" justifyContent="center" height="100%">
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {mortgage.remainingMonths}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  חודשים שנותרו
                </Typography>
              </Box>
              
              {mortgage.flexEnabled && (
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight="bold" color="secondary.main">
                    {mortgage.flexUsageCount} / {mortgage.maxFlexUsagePerYear}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    שימושי Flex השנה
                  </Typography>
                </Box>
              )}
              
              <Button
                variant="contained"
                component={RouterLink}
                to={`/mortgage/${mortgage._id}`}
                startIcon={<Insights />}
                fullWidth
              >
                פרטים מלאים
              </Button>
              
              {mortgage.flexEnabled && (
                <Button
                  variant="outlined"
                  color="secondary"
                  component={RouterLink}
                  to={`/mortgage/${mortgage._id}/flex`}
                  fullWidth
                >
                  הפעל Flex
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MortgageCard;