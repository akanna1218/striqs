import { useEffect, useMemo, useState } from 'react'
import {
  Alert, Box, Button, Chip, Container, Dialog, DialogContent, DialogTitle,
  FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import { getCategories, getLayouts, getProducts } from '../services/storeService'
import { useCart } from '../context/useCart'
import { ErrorState } from '../components/Catalog'
import { formatCurrency, isWallComplete } from '../utils/pricing'

export default function WallBuilderPage() {
  const { addItem } = useCart()
  const [layouts, setLayouts] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [layout, setLayout] = useState(null)
  const [selections, setSelections] = useState({})
  const [activeSlot, setActiveSlot] = useState(null)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    Promise.all([getLayouts(), getProducts(), getCategories()])
      .then(([layoutData, productData, categoryData]) => {
        setLayouts(layoutData)
        setProducts(productData)
        setCategories(categoryData)
        setLayout(layoutData[0] || null)
      })
      .catch((requestError) => { console.error('Could not load wall builder data.', requestError); setError('Layouts and posters need the JSON Server. Start it and reload this page.') })
  }, [])

  const filteredProducts = useMemo(() => products.filter((product) => (
    (category === 'all' || product.categoryId === category)
    && product.title.toLowerCase().includes(query.toLowerCase())
  )), [products, category, query])

  const chooseLayout = (nextLayout) => {
    setLayout(nextLayout)
    setSelections({})
    setAdded(false)
  }

  const assignProduct = (product) => {
    setSelections((current) => ({ ...current, [activeSlot]: { id: product.id, title: product.title, image: product.image, categoryId: product.categoryId } }))
    setActiveSlot(null)
  }

  const uploadToSlot = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Choose an image file to use in your wall preview.'); return }
    if (file.size > 8 * 1024 * 1024) { setError('Please use an image smaller than 8 MB.'); return }
    const reader = new FileReader()
    reader.onload = () => {
      setSelections((current) => ({ ...current, [activeSlot]: { id: `upload-${Date.now()}`, title: file.name, image: reader.result, categoryId: 'personal', personal: true } }))
      setActiveSlot(null)
    }
    reader.onerror = () => setError('This image could not be previewed. Try another file.')
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  if (error && !layouts.length) return <Container maxWidth="lg" className="page-wrap"><ErrorState message={error} retry={() => window.location.reload()} /></Container>
  if (!layout) return <Container maxWidth="lg" className="page-wrap"><Typography color="text.secondary">Loading wall layouts…</Typography></Container>
  const complete = isWallComplete(layout, selections)
  const selectedCount = Object.values(selections).filter(Boolean).length
  const selectionLabel = Object.entries(selections).map(([slot, selection]) => `${slot}:${selection.id}`).join('|')
  const addWall = () => {
    if (!complete) return
    const selectionDetails = Object.values(selections).map((selection) => selection.title)
    addItem({
      key: `wall:${layout.id}:${selectionLabel}`,
      id: layout.id,
      type: 'wall',
      title: layout.name,
      image: Object.values(selections)[0]?.image || '',
      price: layout.price,
      originalPrice: layout.originalPrice,
      quantity: 1,
      variant: `${layout.dimensions} · ${layout.slots} prints`,
      details: selectionDetails.join(', '),
      selections: Object.values(selections),
    })
    setAdded(true)
  }

  return <Container maxWidth="lg" className="page-wrap wall-page">
    <Box className="shop-heading"><Typography className="eyebrow">ONE WALL, ALL YOURS</Typography><Typography variant="h1" component="h1">Build your wall.</Typography><Typography color="text.secondary">Choose a layout, then fill each frame with a poster or your own photo.</Typography></Box>
    {error && <Alert severity="warning" onClose={() => setError('')}>{error}</Alert>}
    <Box className="builder-step"><Typography className="step-label">01 / CHOOSE A LAYOUT</Typography><Grid container spacing={1.5} mt={.5}>{layouts.map((item) => <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.id}><button type="button" className={`layout-choice ${layout.id === item.id ? 'selected' : ''}`} onClick={() => chooseLayout(item)}><span>{item.slots} prints</span><b>{item.name}</b><small>{item.dimensions} · {formatCurrency(item.price)}</small></button></Grid>)}</Grid></Box>
    <Grid container spacing={{ xs: 4, md: 6 }} className="builder-workspace">
      <Grid size={{ xs: 12, md: 7 }}><Box className="step-heading"><Box><Typography className="step-label">02 / PICK YOUR ART</Typography><Typography variant="h4" fontWeight={700}>Fill your frames.</Typography></Box><Chip label={`${selectedCount} of ${layout.slots} selected`} color={complete ? 'success' : 'default'} /></Box>
        <Box className="wall-preview-stage"><Box className="wall-preview" aria-label={`${layout.name} poster arrangement`} >{layout.arrangement.map((slot, index) => { const selection = selections[index]; return <button type="button" key={index} onClick={() => setActiveSlot(index)} aria-label={`${selection ? 'Replace' : 'Choose'} poster for frame ${index + 1}`} className={`wall-slot ${selection ? 'filled' : ''}`} style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, height: `${slot.h}%` }}>{selection ? <><img src={selection.image} alt={selection.title} /><span>{selection.title}</span></> : <span className="add-slot">+</span>}</button> })}</Box></Box>
        <Box className="builder-progress"><Box><Box style={{ width: `${selectedCount / layout.slots * 100}%` }} /></Box><Typography variant="caption">{complete ? 'Your wall is ready.' : `${layout.slots - selectedCount} frames left to fill`}</Typography></Box>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}><Box className="wall-summary"><Typography className="step-label">03 / MAKE IT YOURS</Typography><Typography variant="h5" fontWeight={700} mt={1}>{layout.name}</Typography><Typography color="text.secondary">{layout.slots} prints · {layout.dimensions}</Typography><Box className="wall-price"><b>{formatCurrency(layout.price)}</b><del>{formatCurrency(layout.originalPrice)}</del><Chip size="small" label={`Save ${formatCurrency(layout.originalPrice - layout.price)}`} /></Box><Typography variant="body2" color="text.secondary">Pick a poster for every frame to add your finished wall. Your local photo previews stay in this browser.</Typography><Button fullWidth variant="contained" disabled={!complete} onClick={addWall} sx={{ mt: 2 }}>Add wall to bag</Button>{added && <Alert severity="success" sx={{ mt: 1.5 }}>Your custom wall was added to the bag.</Alert>}<Typography variant="caption" display="block" mt={1.5} color="text.secondary">Sample layout pricing is illustrative.</Typography></Box></Grid>
    </Grid>
    <Dialog open={activeSlot !== null} onClose={() => setActiveSlot(null)} fullWidth maxWidth="md">
      <DialogTitle>Choose art for frame {(activeSlot ?? 0) + 1}<IconButton aria-label="Close poster picker" onClick={() => setActiveSlot(null)} sx={{ position: 'absolute', right: 10, top: 10 }}><CloseIcon /></IconButton></DialogTitle>
      <DialogContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mb={2}><TextField label="Search posters" value={query} onChange={(event) => setQuery(event.target.value)} fullWidth size="small" /><FormControl size="small" sx={{ minWidth: 180 }}><InputLabel id="wall-category">Category</InputLabel><Select labelId="wall-category" value={category} label="Category" onChange={(event) => setCategory(event.target.value)}><MenuItem value="all">All categories</MenuItem>{categories.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}</Select></FormControl></Stack>
        <Grid container spacing={1.5} className="picker-grid">{filteredProducts.map((product) => <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id}><button type="button" className="picker-product" onClick={() => assignProduct(product)}><img src={product.image} alt="" /><b>{product.title}</b></button></Grid>)}</Grid>
        {!filteredProducts.length && <Typography color="text.secondary" py={3}>No posters found. Try another search.</Typography>}
        <Box className="upload-wall-image"><Button component="label" startIcon={<AddPhotoAlternateOutlinedIcon />}>Use a photo from your device<input hidden type="file" accept="image/*" onChange={uploadToSlot} /></Button>{activeSlot !== null && selections[activeSlot] && <Button color="error" onClick={() => { setSelections((current) => { const next = { ...current }; delete next[activeSlot]; return next }); setActiveSlot(null) }}>Remove this poster</Button>}</Box>
      </DialogContent>
    </Dialog>
  </Container>
}
