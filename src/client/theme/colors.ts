import { createTheme } from '@mui/material/styles';
import { mainModule } from 'process';


 const theme = createTheme({
  palette: {
  //  background: {
  //   main: '#FDFD96'
  //  },
   primary: {
     main: '#9723C9'
   },
   secondary: {
      main: '#2FFF2F'
   }
  },
  typography: {
    fontFamily: 'Lexend Mega',
    htmlFontSize: 16,
    body1: {
      fontFamily: 'DM Sans',
      fontSize: 14
    },
    button: {
     fontFamily: 'Lexend Mega'
    },
    h1: {
      fontFamily: 'Lexend Mega',
      fontSize: 36,
      fontWeight: 700
    },
    h2:{
      fontFamily:'Lexend Mega'
    },
    h3:{
      fontFamily:'Lexend Mega',
      fontWeight: 500
    },
    h5:{
      fontFamily:'DM Sans',
      fontWeight: 700
    }
  },
});
export default theme 
//TODO Theme MA and Danielle
  //* Pick primary color
  //* Secondary
  //* Corners 
  //* Font
  //* Text Size Hierarchy for Headings, text, subheadings, captions etc (H1 ...) 
  //* Access
  //* NeoBrutalist Vibrant; Saturated and 