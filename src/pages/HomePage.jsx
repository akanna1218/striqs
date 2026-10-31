import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent,
  Container, Grid, Stack, Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getCategories, getFaqs, getLayouts, getProducts } from '../services/storeService'
import { ErrorState, ProductGrid, SectionHeading } from '../components/Catalog'
import PosterCoverflowCarousel from '../components/PosterCoverflowCarousel'
import { formatCurrency } from '../utils/pricing'
import brandPosterImage from '../assets/striqs-instagram-feature.jpg'
import brandRoomImage from '../assets/striqs-instagram-room.jpg'
import floatingLogo from '../assets/STRIQS Red & White.png'

export default function HomePage() {
  const [data, setData] = useState({ products: [], categories: [], layouts: [], faqs: [] })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([getProducts(), getCategories(), getLayouts(), getFaqs()])
      .then(([products, categories, layouts, faqs]) => setData({ products, categories, layouts, faqs }))
      .catch((requestError) => {
        console.error('Could not load homepage content.', requestError)
        setError('Check that the JSON Server is running at localhost:3001, then try again.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    Promise.all([getProducts(), getCategories(), getLayouts(), getFaqs()])
      .then(([products, categories, layouts, faqs]) => {
        if (active) setData({ products, categories, layouts, faqs })
      })
      .catch((requestError) => {
        if (!active) return
        console.error('Could not load homepage content.', requestError)
        setError('Check that the JSON Server is running at localhost:3001, then try again.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const products = data.products
  const categories = data.categories
  const heroProducts = products.filter((product) => product.available && product.image).slice(0, 8)

  return (
    <>
      <Box className="home-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(12,12,12,.77), rgba(12,12,12,.12)), url("${brandRoomImage}")` }}>
        <Container maxWidth="lg" className="hero-content">
          <Box className="hero-grid">
            <Box className="hero-copy-panel">
              <Typography className="hero-kicker">STRIQS COLLECTIVE · ART FOR YOUR WALLS</Typography>
              <Typography component="h1" variant="h1">We put the<br />internet on walls.</Typography>
              <Box className="hero-collection-panel" aria-label="Browse featured collections">
                <PosterCoverflowCarousel products={heroProducts} categories={categories} />
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mt={3.5} className="hero-actions">
                <Button component={Link} to="/shop" variant="contained" color="secondary">Shop posters <ArrowForwardIcon sx={{ ml: 1 }} /></Button>
                <Button component={Link} to="/build-your-wall" variant="outlined" className="hero-secondary">Build your wall</Button>
              </Stack>
              <Typography className="hero-note">Original drops · made to be lived with</Typography>
            </Box>
          </Box>
        </Container>
        <Box className="hero-float"><span>STRIQS ORIGINAL</span><b>Make your wall<br />say something.</b></Box>
      </Box>

      <Container maxWidth="lg" className="page-section">
        {error && <ErrorState message={error} retry={load} />}
        <Box className="category-row">
          <SectionHeading eyebrow="FIND YOUR FRAME OF MIND" title="A little of everything." link="/shop" />
          <Grid container spacing={1.5} className="category-grid">
            {categories.map((category) => (
              <Grid key={category.id} size={{ xs: 6, sm: 4, md: 3, lg: 3 }}>
                <Link className="category-tile" to={`/collections/${category.id}`}>
                  <span>{category.icon}</span>
                  <b>{category.name}</b>
                </Link>
              </Grid>
            ))}
          </Grid>
          <Box className="category-explorer">
            <Button
              className="floating-filter-trigger"
              variant="contained"
              color="secondary"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-label="Open category filters"
            >
              <img src={floatingLogo} alt="Striqs" className="floating-filter-icon" />
            </Button>
            <Box className={`filter-bubble-panel ${filtersOpen ? 'open' : ''}`}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className="filter-bubble"
                  onClick={() => {
                    setFiltersOpen(false)
                    navigate(`/collections/${category.id}`)
                  }}
                >
                  <span>{category.icon}</span>
                  <small>{category.name}</small>
                </button>
              ))}
            </Box>
          </Box>
        </Box>

        <Box className="page-section">
          <SectionHeading eyebrow="MADE FOR THE MANY" title="Start with a wall pack." body="A considered set of prints, ready to make a room feel finished." link="/build-your-wall" linkText="Build your own" />
          <Grid container spacing={2.5} mt={0.2}>
            {data.layouts.slice(0, 3).map((layout) => <Grid size={{ xs: 12, sm: 4 }} key={layout.id}>
              <Card className="layout-teaser">
                <Box className={`layout-art layout-${layout.id}`} aria-label={`${layout.name} preview`}>
                  {layout.arrangement.slice(0, 6).map((slot, index) => <span key={index} style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, height: `${slot.h}%` }} />)}
                </Box>
                <CardContent><Typography variant="h6" fontWeight={700}>{layout.name}</Typography><Typography color="text.secondary">{layout.slots} prints · {layout.dimensions}</Typography><Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}><b>from {formatCurrency(layout.price)}</b><Button component={Link} to="/build-your-wall" size="small" endIcon={<ArrowForwardIcon />}>Make it yours</Button></Stack></CardContent>
              </Card>
            </Grid>)}
          </Grid>
        </Box>

        <Box className="page-section">
          <SectionHeading eyebrow="THE ONES YOU KEEP COMING BACK TO" title="Good taste, on repeat." link="/shop" />
          <ProductGrid products={products.filter((product) => product.featured).slice(0, 4)} loading={loading} />
        </Box>

        <Box className="mix-banner">
          <Box><Typography className="eyebrow">A LITTLE MORE TO LOVE</Typography><Typography variant="h2">Three posters.<br />One very good wall.</Typography><Typography mt={1} color="text.secondary">Mix your favourites and save 15% on three or more single posters.*</Typography><Button component={Link} to="/shop?type=single" variant="contained" sx={{ mt: 2 }}>Mix & match posters</Button></Box>
          <Box className="mini-poster-stack" aria-hidden="true"><img src={products[1]?.image || brandPosterImage} alt="" /><img src={products[2]?.image || brandRoomImage} alt="" /><img src={products[0]?.image || brandPosterImage} alt="" /></Box>
          <Typography className="illustrative-note">*Illustrative demo offer</Typography>
        </Box>

        <Box className="page-section">
          <SectionHeading eyebrow="MORE THAN A SINGLE FRAME" title="A story in every piece." link="/shop?type=split" linkText="See all sets" />
          <ProductGrid products={products.filter((product) => product.productType.startsWith('split'))} loading={loading} emptyText="Split print collections are on their way." />
        </Box>

        <Box className="custom-banner">
          <Box><Typography className="eyebrow">A MEMORY, MADE MATTE</Typography><Typography variant="h2">Your photo.<br />Your favourite wall.</Typography><Typography mt={1} color="text.secondary">Turn a moment you love into a print that lives with you.</Typography><Button component={Link} to="/custom-posters" variant="contained" sx={{ mt: 2 }}>Create a custom print</Button></Box>
          <Box className="custom-photo" role="img" aria-label="A framed art print from the Striqs Instagram profile" style={{ backgroundImage: `url("${brandPosterImage}")` }} />
        </Box>

        <Box className="page-section why-section" id="why-us">
          <SectionHeading eyebrow="THE STRIQS WAY" title="Thoughtful, from print to place." />
          <Grid container spacing={2.5}>{[['01', 'Art with a point of view', 'A considered mix of colour, culture, and things worth keeping close.'], ['02', 'Made for your space', 'Pick a print, build a wall, or bring a personal moment to life.'], ['03', 'Easy on the eyes', 'A clean, simple shopping experience from first browse to final frame.']].map(([num, title, copy]) => <Grid size={{ xs: 12, md: 4 }} key={num}><Box className="why-card"><span>{num}</span><Typography variant="h5" fontWeight={700} mt={3}>{title}</Typography><Typography color="text.secondary" mt={1}>{copy}</Typography></Box></Grid>)}</Grid>
        </Box>

        <Box className="faq-section" id="faq">
          <SectionHeading eyebrow="GOOD TO KNOW" title="A few quick answers." />
          <Box className="faq-list">{data.faqs.map((faq) => <Accordion key={faq.id}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>{faq.question}</Typography></AccordionSummary><AccordionDetails><Typography color="text.secondary">{faq.answer}</Typography></AccordionDetails></Accordion>)}</Box>
        </Box>
      </Container>

      <Box className="newsletter" id="footer"><Container maxWidth="md"><Typography className="eyebrow">A NOTE FROM STRIQS</Typography><Typography variant="h2">Good things, occasionally.</Typography><Typography color="text.secondary" mt={1}>New drops and ideas for making a space feel like yours.</Typography><NewsletterForm /></Container></Box>
    </>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return <Box component="form" className="newsletter-form" onSubmit={(event) => { event.preventDefault(); setSubscribed(true) }}>
    <input type="email" required aria-label="Email address" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} />
    <Button type="submit" variant="contained">Count me in</Button>
    {subscribed && <Typography className="newsletter-success" role="status">Thanks — this demo has noted your interest.</Typography>}
  </Box>
}
