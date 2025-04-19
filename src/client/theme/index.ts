import { createTheme,} from '@mui/material/styles';
// overrides
// your palette
import  {typography} from './colors';
// spacing / breakpoints
import { sizing } from './sizing';
// shape / shadows

import { components, borderRadius, shadows} from './surfaces';

// 1 build palette from colors.ts
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

  // finally component defaults & style overrides
  components,
});

export default theme1;
