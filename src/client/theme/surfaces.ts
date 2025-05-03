import { Components, Theme } from '@mui/material/styles';
import theme1 from './index';

export const borderRadius = 8; 

// Neo-brutalist shadows — mostly off or harsh
export const shadows: Theme['shadows'] = [
  'none',                            // 0
  '0 0 0 1px rgba(0,0,0,1)',         // 1px hard outline
  '0 2px 0 rgba(0,0,0,1)',           // harsh drop
  '0 0 0 2px rgba(0,0,0,1)',         // double outline
  'none',                            // repeat "none" for flatness
  ...Array(21).fill('none'),         
];

export const components: Components<Theme> = {
  MuiContainer: {
    defaultProps: { maxWidth: 'lg' },
    styleOverrides: {
      root: {
        paddingLeft: 16,
        paddingRight: 16,
        '@media (max-width:600px)': {
          paddingLeft: 8,
          paddingRight: 8,
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
      fullWidth: true,
      margin: 'normal',
    },
    styleOverrides: {
      root: {
        marginBottom: 16,
        '@media (max-width:600px)': {
          marginBottom: 12,
        },
        '& .MuiOutlinedInput-root': {
          border: '4px solid black',
          borderRadius,
          width:'100%',
          // backgroundColor: '#A78BFA', 
          padding: '16px',
          '@media (max-width:600px)': {
            padding: '12px',
          },
          '& fieldset': {
            border: 'none',
          },
          '&:hover fieldset': {
            border: 'none',
          },
          '&.Mui-focused fieldset': {
            border: 'none',
          },
        },
      },
    },
  },
  // new overide added customize dropdown/select to match purple style
  MuiSelect: {
    styleOverrides: {
      select: {
        backgroundColor: '#A78BFA',
        border: '4px solid black',
        borderRadius: 8,
        fontWeight: 700,
        '@media (max-width:600px)': {
          fontSize: 16,
          padding: 12,
        },
      },
      icon: {
        color: 'black',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        border: '4px solid black',
        borderRadius,
        boxShadow: 'none',
        padding: 16,
        '@media (max-width:600px)': {
          padding: 12,
        },
        variant:"contained",
        
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        border: '4px solid black',
        borderRadius,
        boxShadow: 'none',
        padding: 24,
        '@media (max-width:600px)': {
          padding: 16,
        },
        // backgroundColor: '#fff',
      },
    },
  },
  
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: ({ theme }) => ({
        border: '4px solid black',
        borderRadius: 12,
        padding: '8px 16px',
        textTransform: 'uppercase',
        fontWeight: 700,
        backgroundColor: theme.palette.primary.main,
        transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
        '@media (max-width:600px)': {
          fontSize: 16,
          padding: '12px 20px',
        },
        
        '&:hover': {
          backgroundColor: theme.palette.secondary.main,
          boxShadow: theme.shadows[2], 
        },
  
        '&:active': {
          boxShadow: theme.shadows[1], 
        },
      }),
    },
  }
}

