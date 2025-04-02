import { createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

const poalimTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#DC1E23',     // Poalim Bank Red
      light: '#FF4B55',    // Lighter shade for hover/interactions
      dark: '#A6161D',     // Darker shade for pressed states
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#666666',     // Neutral gray for secondary actions
      light: '#999999',
      dark: '#333333',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F5F5F5',  // Light gray background
      paper: '#FFFFFF'     // White card/paper background
    },
    text: {
      primary: '#333333',  // Dark gray for primary text
      secondary: '#666666' // Lighter gray for secondary text
    },
    error: {
      main: '#DC1E23'      // Using bank red for error states
    }
  },
  typography: {
    fontFamily: [
      'Rubik', // Modern, clean font
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 500
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#DC1E23',
          color: '#FFFFFF'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Removes uppercase transformation
          fontWeight: 600
        },
        containedPrimary: {
          backgroundColor: '#DC1E23',
          '&:hover': {
            backgroundColor: '#A6161D'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#DC1E23'
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#DC1E23'
            }
          }
        }
      }
    }
  }
});

export default poalimTheme;