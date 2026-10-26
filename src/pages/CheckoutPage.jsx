import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { createOrder, getOffers } from '../services/storeService'
import { useCart } from '../context/useCart'
import { eligibleDiscount, formatCurrency } from '../utils/pricing'

const initialForm = { name: '', email: '', phone: '', address: '', city: '', postcode: '' }

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [payment, setPayment] = useState('demo')
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [offers, setOffers] = useState([])
  useEffect(() => {
    getOffers().then(setOffers).catch((error) => {
      console.error('Could not load checkout offer rules.', error)
      setRequestError('Offer rules could not be loaded; listed item prices are unchanged.')
    })
  }, [])
  const discount = eligibleDiscount(items, offers)
  const total = subtotal - discount.amount

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const placeOrder = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!/^[+]?[\d\s()-]{10,16}$/.test(form.phone)) nextErrors.phone = 'Enter a valid phone number.'
    if (form.address.trim().length < 6) nextErrors.address = 'Enter your delivery address.'
    if (form.city.trim().length < 2) nextErrors.city = 'Enter your city.'
    if (!/^[\dA-Za-z -]{4,10}$/.test(form.postcode)) nextErrors.postcode = 'Enter a valid postal code.'
    setErrors(nextErrors)
    setRequestError('')
    if (Object.keys(nextErrors).length || !items.length) {
      if (!items.length) setRequestError('Your bag is empty. Add something before checkout.')
      return
    }

    setSubmitting(true)
    try {
      const order = await createOrder({
        customer: form,
        items,
        subtotal,
        discount: discount.amount,
        total,
        paymentMethod: payment,
        status: 'demo-confirmed',
        createdAt: new Date().toISOString(),
      })
      clearCart()
      navigate(`/orders/${order.id}`, { state: { order } })
    } catch (error) {
      console.error('Could not create demo order.', error)
      setRequestError('We could not place this demo order. Check that JSON Server is running, then try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!items.length) return <Container maxWidth="md" className="page-wrap"><Box className="empty-cart"><Typography variant="h4" fontWeight={700}>Your bag is empty.</Typography><Button component={Link} to="/shop" variant="contained" sx={{ mt: 2 }}>Shop posters</Button></Box></Container>

  return <Container maxWidth="lg" className="page-wrap checkout-page">
    <Box className="shop-heading"><Typography className="eyebrow">DEMO CHECKOUT</Typography><Typography variant="h1" component="h1">Almost yours.</Typography><Alert severity="info" sx={{ mt: 2 }}>This is a demo checkout only. No real payment is processed and no order will be fulfilled.</Alert></Box>
    <Box className="checkout-layout"><Box component="form" onSubmit={placeOrder} className="checkout-form" noValidate>
      <Typography variant="h5" fontWeight={700} mb={2}>Delivery details</Typography>
      <Stack spacing={2}>
        <TextField label="Full name" name="name" autoComplete="name" value={form.name} onChange={updateField} error={Boolean(errors.name)} helperText={errors.name} required />
        <TextField label="Email address" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} error={Boolean(errors.email)} helperText={errors.email} required />
        <TextField label="Phone number" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={updateField} error={Boolean(errors.phone)} helperText={errors.phone} required />
        <TextField label="Delivery address" name="address" autoComplete="street-address" value={form.address} onChange={updateField} error={Boolean(errors.address)} helperText={errors.address} required multiline minRows={2} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><TextField label="City" name="city" autoComplete="address-level2" value={form.city} onChange={updateField} error={Boolean(errors.city)} helperText={errors.city} required fullWidth /><TextField label="Postal code" name="postcode" autoComplete="postal-code" value={form.postcode} onChange={updateField} error={Boolean(errors.postcode)} helperText={errors.postcode} required fullWidth /></Stack>
      </Stack>
      <FormControl className="payment-method"><FormLabel>Payment method</FormLabel><RadioGroup value={payment} onChange={(event) => setPayment(event.target.value)}><FormControlLabel value="demo" control={<Radio />} label="Demo payment (no payment collected)" /></RadioGroup></FormControl>
      {requestError && <Alert severity="error" sx={{ mb: 2 }}>{requestError}</Alert>}
      <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>{submitting ? 'Placing demo order…' : `Place demo order · ${formatCurrency(total)}`}</Button>
    </Box>
    <Box className="checkout-summary"><Typography variant="h5" fontWeight={700}>Your order</Typography>{items.map((item) => <Box className="checkout-line" key={item.key}><img src={item.image} alt="" /><Box><Typography fontWeight={700}>{item.title}</Typography><Typography variant="caption" color="text.secondary">{item.variant} · Qty {item.quantity}</Typography></Box><Typography>{formatCurrency(item.price * item.quantity)}</Typography></Box>)}<Box className="checkout-total"><span>Subtotal</span><b>{formatCurrency(subtotal)}</b></Box><Box className="checkout-total"><span>Delivery</span><span>Calculated for demo</span></Box><Box className="checkout-total final-total"><b>Total</b><b>{formatCurrency(total)}</b></Box></Box></Box>
  </Container>
}
