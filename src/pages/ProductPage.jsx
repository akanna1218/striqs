import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Container,
  FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, Stack, Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getCategories, getProduct, getProducts } from '../services/storeService'
import { useCart } from '../context/useCart'
import { discountPercent, formatCurrency } from '../utils/pricing'
import { ErrorState, PriceDisplay, ProductGrid } from '../components/Catalog'

export default function ProductPage() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState('')
  const [error, setError] = useState('')
  const [openToast, setOpenToast] = useState(false)

  useEffect(() => {
    Promise.all([getProduct(slug), getProducts(), getCategories()])
      .then(([item, allProducts, categories]) => {
        if (!item) { setError('This poster could not be found.'); return }
        setProduct(item)
        setSize(item.sizes[0] || '')
        setActiveImage(item.image)
        setRelated(allProducts.filter((entry) => entry.categoryId === item.categoryId && entry.id !== item.id).slice(0, 4))
        setCategoryName(categories.find((category) => category.id === item.categoryId)?.name || 'Posters')
      })
      .catch((requestError) => { console.error('Could not load product details.', requestError); setError('The product details could not be loaded. Start JSON Server and try again.') })
  }, [slug])

  if (error) return <Container maxWidth="lg" className="page-wrap"><ErrorState message={error} retry={() => window.location.reload()} /></Container>
  if (!product) return <Container maxWidth="lg" className="page-wrap"><Typography color="text.secondary">Loading poster details…</Typography></Container>
  const gallery = [product.image, ...(product.gallery || [])]
  const addToCart = () => {
    if (!size || quantity < 1) return
    addItem({ key: `${product.id}:${size}`, id: product.id, type: product.productType === 'single' ? 'single' : 'split', title: product.title, image: product.image, price: product.price, originalPrice: product.originalPrice, quantity, variant: size, details: `${categoryName} · ${size}` })
    setOpenToast(true)
  }

  return <Container maxWidth="lg" className="page-wrap">
    <Box className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to={`/collections/${product.categoryId}`}>{categoryName}</Link><span>/</span>{product.title}</Box>
    <Grid container spacing={{ xs: 3, md: 7 }} className="product-detail">
      <Grid size={{ xs: 12, md: 7 }}><Box className="gallery-main"><img src={activeImage} alt={product.title} onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=80' }} /></Box><Stack direction="row" spacing={1.5} mt={1.5}>{gallery.map((image, index) => <button type="button" className={`gallery-thumb ${activeImage === image ? 'active' : ''}`} onClick={() => setActiveImage(image)} key={image} aria-label={`Show product image ${index + 1}`}><img src={image} alt="" /></button>)}</Stack></Grid>
      <Grid size={{ xs: 12, md: 5 }} className="product-info"><Typography className="eyebrow">{categoryName} · {product.productType === 'single' ? 'ART PRINT' : 'SPLIT PRINT SET'}</Typography><Typography variant="h2" component="h1">{product.title}</Typography><PriceDisplay price={product.price} originalPrice={product.originalPrice} /><Typography color="text.secondary" mt={2}>{product.description}</Typography>
        <Box className="product-picker"><FormControl fullWidth><InputLabel id="size-label">Print size</InputLabel><Select labelId="size-label" label="Print size" value={size} onChange={(event) => setSize(event.target.value)}>{product.sizes.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</Select></FormControl>
          <FormControl fullWidth><InputLabel id="quantity-label">Quantity</InputLabel><Select labelId="quantity-label" label="Quantity" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>{[1, 2, 3, 4, 5].map((amount) => <MenuItem key={amount} value={amount}>{amount}</MenuItem>)}</Select></FormControl>
        </Box>
        <Button variant="contained" color="primary" size="large" fullWidth onClick={addToCart}>Add to bag · {formatCurrency(product.price * quantity)}</Button>
        <Typography variant="caption" color="text.secondary" display="block" mt={1.5}>Sample product and pricing for demo purposes. No real purchase will be processed.</Typography>
        <Box className="product-accordions">
          <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>Product information</Typography></AccordionSummary><AccordionDetails><Typography color="text.secondary">{product.description} Sample print sizes and pricing are illustrative.</Typography></AccordionDetails></Accordion>
          <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={700}>Delivery & returns</Typography></AccordionSummary><AccordionDetails><Typography color="text.secondary">Delivery estimates are illustrative in this demo. No real order is fulfilled and no payment is collected.</Typography></AccordionDetails></Accordion>
        </Box>
        {discountPercent(product.price, product.originalPrice) > 0 && <Typography variant="caption" color="text.secondary">You save {formatCurrency(product.originalPrice - product.price)} on this sample print.</Typography>}
      </Grid>
    </Grid>
    <Box className="page-section"><Typography variant="h3" mb={3}>You might like these, too.</Typography><ProductGrid products={related} /></Box>
    <Snackbar open={openToast} autoHideDuration={3000} onClose={() => setOpenToast(false)}><Alert severity="success" onClose={() => setOpenToast(false)}>Added to your bag.</Alert></Snackbar>
  </Container>
}
