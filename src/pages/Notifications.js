import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Badge,
  Alert,
  Grid,
  Paper
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle,
  Error,
  Info,
  Campaign,
  MoreVert,
  ArrowBack,
  DeleteSweep
} from '@mui/icons-material';
import { NotificationContext } from '../context/NotificationContext';

const Notifications = () => {
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    generateFlexOffers
  } = useContext(NotificationContext);
  
  const [generatingOffers, setGeneratingOffers] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Mark notifications as read when viewed
  useEffect(() => {
    if (unreadCount > 0 && !loading) {
      markAllAsRead();
    }
  }, [unreadCount, loading, markAllAsRead]);
  
  const handleGenerateOffers = async () => {
    try {
      setGeneratingOffers(true);
      setError(null);
      const result = await generateFlexOffers();
      
      if (result.success) {
        setSuccess('נוצרו התראות Flex חדשות בהצלחה');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('אירעה שגיאה ביצירת התראות Flex');
      }
    } catch (err) {
      setError('אירעה שגיאה ביצירת התראות Flex');
      console.error('Generate flex offers error:', err);
    } finally {
      setGeneratingOffers(false);
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'flex_offer':
        return <Campaign color="secondary" />;
      case 'payment_reminder':
        return <Info color="primary" />;
      case 'system':
        return <Info color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };
  
  const getNotificationColor = (type) => {
    switch (type) {
      case 'flex_offer':
        return 'secondary.light';
      case 'payment_reminder':
        return 'primary.light';
      case 'system':
        return 'info.light';
      default:
        return 'grey.300';
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBack />} 
            component={RouterLink}
            to="/dashboard"
            sx={{ mr: 2 }}
          >
            חזרה ללוח המחוונים
          </Button>
          <Typography variant="h4" component="h1">
            התראות
          </Typography>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGenerateOffers}
            disabled={generatingOffers}
            startIcon={generatingOffers ? <CircularProgress size={24} /> : <Campaign />}
            sx={{ mr: 2 }}
          >
            {generatingOffers ? 'מייצר התראות...' : 'בדוק אפשרויות Flex'}
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            onClick={markAllAsRead}
            startIcon={<DeleteSweep />}
          >
            נקה הכל
          </Button>
        </Box>
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
      
      {notifications.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              אין התראות
            </Typography>
            <Typography variant="body2" color="text.secondary">
              כל ההתראות שלך יופיעו כאן
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
              {notifications.length} התראות
            </Typography>
          </Grid>
          
          {notifications.map((notification) => {
            const isFlexOffer = notification.type === 'flex_offer';
            
            return (
              <Grid item xs={12} key={notification._id}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    borderRight: isFlexOffer ? '4px solid #ff9e1b' : 'none',
                    opacity: notification.isRead ? 0.8 : 1
                  }}
                >
                  <ListItem 
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton edge="end">
                        <MoreVert />
                      </IconButton>
                    }
                    component={isFlexOffer ? RouterLink : 'div'}
                    to={isFlexOffer ? notification.actionUrl : undefined}
                    sx={{ 
                      cursor: isFlexOffer ? 'pointer' : 'default',
                      '&:hover': {
                        bgcolor: isFlexOffer ? 'rgba(255, 158, 27, 0.1)' : 'transparent'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getNotificationColor(notification.type) }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography
                            variant="subtitle1"
                            component="span"
                            sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.isRead && (
                            <Badge
                              color="secondary"
                              variant="dot"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ display: 'block' }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                          
                          {isFlexOffer && (
                            <Button
                              size="small"
                              color="secondary"
                              sx={{ mt: 1 }}
                              component={RouterLink}
                              to={notification.actionUrl}
                            >
                              פעל עכשיו
                            </Button>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Notifications;