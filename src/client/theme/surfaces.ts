import { Components } from '@mui/material/styles';

export const components: Components = {
  MuiContainer: {
    defaultProps: { maxWidth: 'lg' },
    styleOverrides: {
      root: { paddingLeft:  16, paddingRight: 16 },
    },
  },
  MuiTextField: {
    defaultProps: { variant: 'outlined', size: 'medium', fullWidth: true, margin: 'normal' },
    styleOverrides: {
      root: { marginBottom: 16 },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding:      theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        boxShadow:    theme.shadows[4],
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        padding:      theme.spacing(3),
        borderRadius: theme.shape.borderRadius,
      }),
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        padding:      theme.spacing(1, 2),
      }),
    },
  },
};

export default components;
//TODO
  //* Rounded Corners
  //? Paper