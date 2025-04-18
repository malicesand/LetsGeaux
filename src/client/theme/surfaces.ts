import { Components, Theme } from '@mui/material/styles';

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
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'medium',
      fullWidth: true,
      margin: 'normal',
    },
    styleOverrides: {
      root: {
        marginBottom: 16,
        '& .MuiOutlinedInput-root': {
          border: '4px solid black',
          borderRadius,
        },
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
        backgroundColor: '#9723C9',
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
        backgroundColor: '#fff',
      },
    },
  },
  MuiBox:{
styleOverrides:{
  root:{
    
  }
}
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        border: '4px solid black',
        borderRadius:12,
        padding: '8px 16px',
         textTransform: 'uppercase',
        fontWeight: 700,
        backgroundColor: '#9723C9',
        '&:hover': {
          backgroundColor: '#a388ee',
        },
      },
    },
  },
};

//TODO
  //* Rounded Corners
  //? Papers