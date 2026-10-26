import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  AppBar, Badge, Box, Button, Container, Drawer, IconButton, InputBase,
  Stack, Toolbar, Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { getCategories } from '../services/storeService'
import { useCart } from '../context/useCart'

function BrandLogo({ onClick }) {
  return <Link to="/" onClick={onClick} className="brand" aria-label="Striqs Collective home">
    <span className="brand-seal">STRIQS</span>
    <span className="brand-collective">COLLECTIVE</span>
  </Link>
}

export function SiteHeader() {
  const { count } = useCart()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => console.error('Could not load header categories.', error))
  }, [])

  const submitSearch = (event) => {
    event.preventDefault()
    navigate(`/shop?q=${encodeURIComponent(search.trim())}`)
    setMenuOpen(false)
  }

  return (
    <>
      <Box className="announcement">We put the internet on walls. <span>Unfortunately, it looks good.</span></Box>
      <AppBar position="sticky" color="inherit" elevation={0} className="site-appbar">
        <Toolbar className="site-toolbar">
          <IconButton className="mobile-menu-button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}>
            <MenuIcon />
          </IconButton>
          <BrandLogo />
          <Box component="nav" className="desktop-nav" aria-label="Main navigation">
            <NavLink to="/shop">Shop all</NavLink>
            {categories.slice(0, 4).map((category) => (
              <NavLink key={category.id} to={`/collections/${category.id}`}>{category.name}</NavLink>
            ))}
            <NavLink to="/build-your-wall">Build your wall</NavLink>
          </Box>
          <Box component="form" className="header-search" onSubmit={submitSearch}>
            <SearchIcon fontSize="small" />
            <InputBase value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find your thing" inputProps={{ 'aria-label': 'Search posters' }} />
          </Box>
          <IconButton aria-label={`Shopping bag with ${count} items`} onClick={() => navigate('/cart')}>
            <Badge badgeContent={count} color="secondary"><ShoppingBagOutlinedIcon /></Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box className="mobile-drawer">
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <BrandLogo onClick={() => setMenuOpen(false)} />
            <IconButton aria-label="Close navigation" onClick={() => setMenuOpen(false)}><CloseIcon /></IconButton>
          </Stack>
          <Box component="form" className="header-search drawer-search" onSubmit={submitSearch}>
            <SearchIcon fontSize="small" />
            <InputBase value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find your thing" inputProps={{ 'aria-label': 'Search posters' }} />
          </Box>
          <Stack className="drawer-links">
            <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop all</NavLink>
            {categories.map((category) => <NavLink key={category.id} to={`/collections/${category.id}`} onClick={() => setMenuOpen(false)}>{category.name}</NavLink>)}
            <NavLink to="/build-your-wall" onClick={() => setMenuOpen(false)}>Build your wall</NavLink>
            <NavLink to="/custom-posters" onClick={() => setMenuOpen(false)}>Custom prints</NavLink>
          </Stack>
        </Box>
      </Drawer>
    </>
  )
}

export function SiteFooter() {
  return (
    <Box component="footer" className="site-footer">
      <Container maxWidth="lg">
        <Box className="footer-grid">
          <Box>
            <BrandLogo />
            <Typography color="inherit" sx={{ opacity: 0.7, maxWidth: 290, mt: 2 }}>We put the internet on walls. Unfortunately, it looks good.</Typography>
          </Box>
          <Box><Typography variant="overline">Explore</Typography><Stack className="footer-links"><Link to="/shop">Shop posters</Link><Link to="/build-your-wall">Build your wall</Link><Link to="/custom-posters">Custom prints</Link></Stack></Box>
          <Box><Typography variant="overline">Help</Typography><Stack className="footer-links"><a href="/#faq">FAQs</a><Link to="/cart">Your cart</Link><Link to="/checkout">Demo checkout</Link></Stack></Box>
          <Box><Typography variant="overline">The fine print</Typography><Stack className="footer-links"><a href="/#why-us">About the prints</a><a href="/#footer">Shipping & returns</a><a href="/#footer">Privacy</a><a href="https://www.instagram.com/striqs.co/" target="_blank" rel="noreferrer">Instagram ↗</a></Stack></Box>
        </Box>
        <Box className="footer-bottom"><Typography variant="caption">© 2026 Striqs. Sample store experience — prices and offers are illustrative.</Typography><Button component={Link} to="/shop" color="secondary" variant="contained" size="small">Explore the shop</Button></Box>
      </Container>
    </Box>
  )
}

export default function SiteLayout() {
  return <><SiteHeader /><Box component="main" sx={{ flex: 1 }}><Outlet /></Box><SiteFooter /></>
}
