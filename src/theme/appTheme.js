import { createTheme } from '@mui/material/styles';

const baseBorderRadius = 4;

const appTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: '#15213b'
    },
    primary: {
      main: '#38bdf8'
    }
  },
  shape: {
    borderRadius: baseBorderRadius
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif"
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          transition: 'transform 120ms ease-out',
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        }
      }
    }
  }
});

export default appTheme;
