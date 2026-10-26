import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import { useCart } from '../context/useCart'
import { formatCurrency } from '../utils/pricing'

const prices = { A5: 249, A4: 399, A3: 599, '13 × 19 in': 799 }
const originalPrices = { A5: 349, A4: 549, A3: 799, '13 × 19 in': 999 }

export default function CustomPostersPage() {
  const { addItem } = useCart()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const previewRef = useRef('')
  const [size, setSize] = useState('A4')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
  }, [])

  const price = useMemo(() => prices[size] * quantity, [size, quantity])
  const handleFile = (event) => {
    const nextFile = event.target.files?.[0]
    if (!nextFile) return
    setError('')
    setAdded(false)
    if (!nextFile.type.startsWith('image/')) { setError('Please select a JPG, PNG, or other image file.'); return }
    if (nextFile.size > 8 * 1024 * 1024) { setError('Choose an image smaller than 8 MB.'); return }
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = URL.createObjectURL(nextFile)
    setPreview(previewRef.current)
    setFile(nextFile)
  }

  const addCustom = () => {
    if (!file || !preview) { setError('Upload an image before adding your custom print.'); return }
    addItem({ key: `custom:${file.name}:${file.size}:${size}`, id: `custom-${file.name}`, type: 'custom', title: `Custom print · ${file.name}`, image: preview, price: prices[size], originalPrice: originalPrices[size], quantity, variant: size, details: 'Personal image preview is stored locally in this browser.' })
    setAdded(true)
    setError('')
  }

  return <Container maxWidth="lg" className="page-wrap custom-page">
    <Box className="shop-heading"><Typography className="eyebrow">YOUR PHOTO, YOUR PRINT</Typography><Typography variant="h1" component="h1">Make it personal.</Typography><Typography color="text.secondary">Bring a favourite moment off your camera roll and onto your wall.</Typography></Box>
    <Grid container spacing={{ xs: 3, md: 6 }} alignItems="stretch">
      <Grid size={{ xs: 12, md: 7 }}><Box className={`custom-preview ${preview ? 'has-image' : ''}`}>{preview ? <img src={preview} alt="Preview of your uploaded custom poster" /> : <Box><AddPhotoAlternateOutlinedIcon sx={{ fontSize: 42 }} /><Typography variant="h6" fontWeight={700}>Your preview will appear here</Typography><Typography color="text.secondary">Choose a photo with a little room to breathe.</Typography></Box>}</Box></Grid>
      <Grid size={{ xs: 12, md: 5 }}><Box className="custom-form"><Typography variant="h4" fontWeight={700}>Create your print</Typography><Typography color="text.secondary" mt={1}>Choose a sharp image for the best result.</Typography>
        <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateOutlinedIcon />} fullWidth sx={{ mt: 3 }}>{file ? 'Choose a different image' : 'Upload an image'}<input hidden type="file" accept="image/*" onChange={handleFile} /></Button>
        {file && <Typography variant="caption" display="block" mt={1}>{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</Typography>}
        <FormControl fullWidth sx={{ mt: 2 }}><InputLabel id="custom-size">Print size</InputLabel><Select labelId="custom-size" label="Print size" value={size} onChange={(event) => { setSize(event.target.value); setAdded(false) }}>{Object.keys(prices).map((option) => <MenuItem key={option} value={option}>{option} · {formatCurrency(prices[option])}</MenuItem>)}</Select></FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}><InputLabel id="custom-quantity">Quantity</InputLabel><Select labelId="custom-quantity" label="Quantity" value={quantity} onChange={(event) => { setQuantity(Number(event.target.value)); setAdded(false) }}>{[1, 2, 3, 4, 5].map((amount) => <MenuItem key={amount} value={amount}>{amount}</MenuItem>)}</Select></FormControl>
        <Stack direction="row" justifyContent="space-between" mt={3}><Typography variant="h6" fontWeight={700}>Total</Typography><Typography variant="h6" fontWeight={700}>{formatCurrency(price)}</Typography></Stack>
        <Button variant="contained" fullWidth sx={{ mt: 2 }} disabled={!file} onClick={addCustom}>Add custom print to bag</Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {added && <Alert severity="success" sx={{ mt: 2 }}>Your custom print was added to the bag.</Alert>}
        <Typography variant="caption" color="text.secondary" display="block" mt={2}>Illustrative mock pricing. Your photo preview is temporary, stays in this browser, and is not uploaded to a server.</Typography>
      </Box></Grid>
    </Grid>
  </Container>
}
