import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Box, Button, Container, Divider, IconButton, Stack, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { getOffers } from '../services/storeService'
import { useCart } from '../context/useCart'
import { eligibleDiscount, formatCurrency } from '../utils/pricing'

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart()
  const [offers, setOffers] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    getOffers().then(setOffers).catch((requestError) => {
      console.error('Could not load cart offer rules.', requestError)
      setError('Offers could not be loaded. You can still check out at the listed item prices.')
    })
  }, [])
  const discount = eligibleDiscount(items, offers)
  const shippingOffer = offers.find((offer) => offer.type === 'free-shipping')
  const shippingEligible = shippingOffer && subtotal >= shippingOffer.minimumSubtotal

  return <Container maxWidth="lg" className="page-wrap">
    <Box className="shop-heading"><Typography className="eyebrow">A GOOD START</Typography><Typography variant="h1" component="h1">Your bag<span className="count-label"> ({items.reduce((count, item) => count + item.quantity, 0)})</span></Typography></Box>
    {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
    {!items.length ? <Box className="empty-cart"><Box className="empty-bag">✳</Box><Typography variant="h4" fontWeight={700}>Your walls are waiting.</Typography><Typography color="text.secondary" mt={1}>There’s nothing in your bag just yet.</Typography><Button component={Link} to="/shop" variant="contained" sx={{ mt: 3 }}>Continue shopping</Button></Box> :
      <Box className="cart-layout"><Box className="cart-lines">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography variant="h6" fontWeight={700}>In your bag</Typography><Button color="inherit" size="small" onClick={clearCart}>Clear bag</Button></Stack>
        {items.map((item) => <Box className="cart-line" key={item.key}>
          <img src={item.image} alt={item.title} onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=320&q=80' }} />
          <Box className="cart-line-content"><Typography fontWeight={700}>{item.title}</Typography><Typography variant="body2" color="text.secondary">{item.variant}</Typography>{item.details && <Typography variant="caption" color="text.secondary" className="cart-details">{item.details}</Typography>}
            <Stack direction="row" alignItems="center" spacing={.5} mt={1}><button type="button" aria-label={`Decrease quantity of ${item.title}`} onClick={() => updateQuantity(item.key, item.quantity - 1)}>−</button><span>{item.quantity}</span><button type="button" aria-label={`Increase quantity of ${item.title}`} onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button><IconButton aria-label={`Remove ${item.title}`} size="small" onClick={() => removeItem(item.key)}><DeleteOutlineIcon fontSize="small" /></IconButton></Stack>
          </Box>
          <Typography fontWeight={700}>{formatCurrency(item.price * item.quantity)}</Typography>
        </Box>)}
        <Button component={Link} to="/shop" className="back-link">← Keep browsing</Button>
      </Box>
      <Box className="cart-summary"><Typography variant="h5" fontWeight={700}>Order summary</Typography><Stack direction="row" justifyContent="space-between" mt={2}><Typography>Subtotal</Typography><Typography>{formatCurrency(subtotal)}</Typography></Stack>
        {discount.offer && <Stack direction="row" justifyContent="space-between" mt={1}><Typography>{discount.offer.name} ({discount.offer.discountPercentage}%)</Typography><Typography>-{formatCurrency(discount.amount)}</Typography></Stack>}
        <Stack direction="row" justifyContent="space-between" mt={1}><Typography>Delivery</Typography><Typography>{shippingEligible ? 'Free' : 'Calculated at checkout'}</Typography></Stack>
        {shippingOffer && <Alert severity="info" sx={{ mt: 2 }}>{shippingEligible ? shippingOffer.description : `Add ${formatCurrency(shippingOffer.minimumSubtotal - subtotal)} for free delivery.`}</Alert>}
        {discount.offer && <Alert severity="success" sx={{ mt: 1.5 }}>{discount.offer.description} · illustrative offer</Alert>}
        <Divider sx={{ my: 2 }} /><Stack direction="row" justifyContent="space-between"><Typography variant="h6" fontWeight={700}>Estimated total</Typography><Typography variant="h6" fontWeight={700}>{formatCurrency(subtotal - discount.amount)}</Typography></Stack>
        <Button component={Link} to="/checkout" variant="contained" fullWidth sx={{ mt: 2 }}>Continue to demo checkout</Button><Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1.5}>No real payment will be collected.</Typography>
      </Box></Box>}
  </Container>
}
