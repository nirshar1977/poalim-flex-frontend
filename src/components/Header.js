import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton
} from '@mui/material';
import {
  Notifications,
  AccountCircle,
  Logout,
  Dashboard,
  Menu as MenuIcon,
  Home,
  Settings,
  Close
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import Logo from './Logo';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Logo />
          <Typography
            variant="h6"
            component={RouterLink}
            to={isAuthenticated ? '/dashboard' : '/'}
            sx={{
              mr: 2,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Poalim Flex
          </Typography>
        </Box>
        
        {isAuthenticated ? (
          <>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={() => navigate('/notifications')}
                  sx={{ mr: 2 }}
                >
                  <Badge badgeContent={unreadCount} color="secondary">
                    <Notifications />
                  </Badge>
                </IconButton>
                
                <IconButton
                  color="inherit"
                  onClick={toggleMobileMenu}
                  edge="end"
                >
                  <MenuIcon />
                </IconButton>
                
                <Drawer
                  anchor="right"
                  open={mobileMenuOpen}
                  onClose={toggleMobileMenu}
                >
                  <Box
                    sx={{ width: 250 }}
                    role="presentation"
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                      <Typography variant="h6">תפריט</Typography>
                      <IconButton onClick={toggleMobileMenu}>
                        <Close />
                      </IconButton>
                    </Box>
                    <Divider />
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            toggleMobileMenu();
                            navigate('/dashboard');
                          }}
                        >
                          <ListItemIcon>
                            <Dashboard />
                          </ListItemIcon>
                          <ListItemText primary="לוח בקרה" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            toggleMobileMenu();
                            navigate('/profile');
                          }}
                        >
                          <ListItemIcon>
                            <AccountCircle />
                          </ListItemIcon>
                          <ListItemText primary="פרופיל" />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                      <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                          <ListItemIcon>
                            <Logout />
                          </ListItemIcon>
                          <ListItemText primary="התנתק" />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Box>
                </Drawer>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/dashboard"
                  startIcon={<Dashboard />}
                  sx={{ mx: 1 }}
                >
                  לוח בקרה
                </Button>
                
                <IconButton
                  color="inherit"
                  onClick={() => navigate('/notifications')}
                  sx={{ mx: 1 }}
                >
                  <Badge badgeContent={unreadCount} color="secondary">
                    <Notifications />
                  </Badge>
                </IconButton>
                
                <Box>
                  <IconButton
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ mx: 1 }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate('/profile');
                      }}
                    >
                      <ListItemIcon>
                        <AccountCircle fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>פרופיל</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate('/dashboard');
                      }}
                    >
                      <ListItemIcon>
                        <Dashboard fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>לוח בקרה</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>התנתק</ListItemText>
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            )}
          </>
        ) : (
          <Box>
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              sx={{ mx: 1 }}
            >
              התחבר
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/register"
              sx={{ mx: 1 }}
            >
              הרשם
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;