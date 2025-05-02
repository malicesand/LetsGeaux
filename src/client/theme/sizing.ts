export const sizing = {
  // theme.spacing(1) === 8px
  spacing: 8,   
  shape: {
    borderRadius: 12,
  },
//   typography: {
//     fontFamily:    'Lexend Mega, sans-serif',
//     htmlFontSize:   16,
//     h1:            { fontSize: '2.5rem', fontWeight: 900 },
//     h2:            { fontSize: '2rem',   fontWeight: 700 },
//     body1:         { fontFamily: 'DM Sans, sans-serif' },
//     button:        { textTransform: 'none', fontWeight: 700 },
//   },
};

export default sizing;

/* Hybrid Shadow (still has border) what MA used on chatbot
sx={{
  border: '2px solid black',
  boxShadow: '4px 4px 0px black',
  borderRadius: '20px',
  overflow: 'hidden',
  backgroundColor: '#a684ff',
}}
** reduce offset for tighter look with 2px 2px 0
*/

/* Dramatic Shadow
  boxShadow: '6px 6px 0px black',
  borderRadius: '20px',
  overflow: 'hidden',
*/

/* Dual Drop Shadow (adds even more depth)
sx={{
  boxShadow: `
    2px 2px 0 black,
    4px 4px 0 rgba(0, 0, 0, 0.2)`
}}
*/