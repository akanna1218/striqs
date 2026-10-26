import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#171717', contrastText: '#ffffff' },
    secondary: { main: '#e51b23', contrastText: '#ffffff' },
    error: { main: '#e51b23' },
    background: { default: '#faf9f8', paper: '#ffffff' },
    text: { primary: '#171717', secondary: '#686565' },
    divider: '#e8e5e3',
  },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h1: { fontFamily: '"DM Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.055em' },
    h2: { fontFamily: '"DM Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.045em' },
    h3: { fontFamily: '"DM Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.04em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 999, paddingInline: 22, minHeight: 44, boxShadow: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12, boxShadow: 'none', border: '1px solid #eeeceb' } } },
    MuiAccordion: { styleOverrides: { root: { boxShadow: 'none', borderBottom: '1px solid #e8e5e3' } } },
  },
})

export default theme
