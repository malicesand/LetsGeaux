import { createTheme,} from '@mui/material/styles';
import  {typography} from './colors';
import { sizing } from './sizing';
import { components, borderRadius, shadows} from './surfaces';

// 2 use your sizing.ts for spacing / breakpoints
// 3 use surfaces.ts for shape, shadows, elevations
// 4 pull in component overrides
const theme1 = createTheme({
  palette: {
   
    primary:   { main:'#bbf451'  },
    secondary: { main: '#2FFF2F' },
    // background: {
    //   // default: colors.background,
    //   // paper:   colors.surface,
    // },
    // text: {
    //   // primary: colors.onSurface,
    //   // secondary: colors.onSurfaceVariant,
    // },
  },
// this information is in the colors file 
  // typography, font sizes etc.
  typography: typography,

  // spacing scale & breakpoints |pixels, rems|
  // spacing: sizing.spacingUnit,   //(factor) => `${factor * 8}px`
  // breakpoints: sizing.breakpoints,

  // corner rounding & shadows
  shape: {
    borderRadius: borderRadius,
  },
  shadows: shadows,
  spacing: 8,
  components,
});



export default theme1;
