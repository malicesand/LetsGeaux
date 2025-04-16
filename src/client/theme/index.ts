import { createTheme } from '@mui/material/styles';
// overrides
// your palette
import { primary, secondary } from './colors';
// spacing / breakpoints
import { sizing } from './sizing';
// shape / shadows
import { components } from './surfaces';

// 1 build palette from colors.ts
// 2 use your sizing.ts for spacing / breakpoints
// 3 use surfaces.ts for shape, shadows, elevations
// 4 pull in component overrides
const theme = createTheme({
  palette: {
    primary:   { main: primary.primary },
    secondary: { main: secondary.secondary },
    background: {
      // default: colors.background,
      // paper:   colors.surface,
    },
    text: {
      // primary: colors.onSurface,
      // secondary: colors.onSurfaceVariant,
    },
  },

  // typography, font sizes etc.
  typography: {
    fontFamily: `'Lexend Mega', sans-serif`,
    h1:     { fontSize: 40, fontWeight: 900 },
    body1:  { fontFamily: `'DM Sans', sans-serif` },
    button: { textTransform: 'none' },
  },

  // spacing scale & breakpoints |pixels, rems|
  spacing: sizing.spacingUnit,   //(factor) => `${factor * 8}px`
  breakpoints: sizing.breakpoints,

  // corner rounding & shadows
  shape: {
    borderRadius: components.borderRadius,
  },
  shadows: components.shadows,

  // finally component defaults & style overrides
  components,
});

export default theme;
