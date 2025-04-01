import React from 'react';
import { Box, Typography, Container, Grid, Link, Divider } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'primary.main',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Poalim Flex
            </Typography>
            <Typography variant="body2">
              החזרי משכנתא גמישים בהתאמה אישית
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              קישורים מהירים
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              אודות
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              שאלות נפוצות
            </Link>
            <Link href="#" color="inherit" display="block">
              צור קשר
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              מידע משפטי
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              תנאי שימוש
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              פרטיות
            </Link>
            <Link href="#" color="inherit" display="block">
              נגישות
            </Link>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 2 }} />
          <Typography variant="body2" align="center">
            {'Copyright © '}
            {currentYear}
            {' בנק הפועלים בע״מ. כל הזכויות שמורות.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;