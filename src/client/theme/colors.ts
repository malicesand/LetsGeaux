import { createTheme } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography'

export const typography: TypographyOptions = {
  fontFamily: 'Lexend Mega',
  htmlFontSize: 16,
  body1: {
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: 600,
    textTransform: 'none',
    ['@media (max-width:600px)']: {
      fontSize: 20,
    },
  },
  button: {
    fontFamily: 'Lexend Mega',
    fontWeight: 800,
    textTransform: 'uppercase',
    fontSize: 14,
    ['@media (max-width:600px)']: {
      fontSize: 16,
    },
  },
  h1: {
    fontFamily: 'Lexend Mega',
    fontSize: 36,
    fontWeight: 900,
    textTransform: 'uppercase',
    ['@media (max-width:600px)']: {
      fontSize: 36,
    },
  },
  h2: {
    fontFamily: 'Lexend Mega',
    fontWeight: 800,
    fontSize: 24,
    textTransform: 'uppercase',
    ['@media (max-width:600px)']: {
      fontSize: 30,
    },
  },
  h3: {
    fontFamily: 'Lexend Mega',
    fontWeight: 700,
    fontSize: 21,
    textTransform: 'none',
    ['@media (max-width:600px)']: {
      fontSize: 26,
    },
  },
  h4: {
    fontFamily: 'Lexend Mega',
    fontWeight: 700,
    fontSize: 18,
    ['@media (max-width:600px)']: {
      fontSize: 22,
    },
  },
  h5: {
    fontFamily: 'Lexend Mega',
    fontWeight: 600,
    fontSize: 16,
    ['@media (max-width:600px)']: {
      fontSize: 20,
    },
  },
  h6: {
    fontFamily: 'Lexend Mega',
    fontWeight: 600,
    fontSize: 14,
    ['@media (max-width:600px)']: {
      fontSize: 18,
    },
  },
  
};
