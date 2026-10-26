import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Box, Button, Container, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { getOrder } from '../services/storeService'
import { formatCurrency } from '../utils/pricing'
import { ErrorState } from '../components/Catalog'

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [error, setError] = useState('')
  useEffect(() => {
    if (order) return
    getOrder(id).then(setOrder).catch((requestError) => {
      console.error('Could not load order confirmation.', requestError)
      setError('This confirmation is not available. Try opening it from the checkout success page.')
    })
  }, [id, order])

  if (error) return <Container maxWidth="md" className="page-wrap"><ErrorState message={error} /></Container>
  if (!order) return <Container maxWidth="md" className="page-wrap"><Typography color="text.secondary">Loading confirmation…</Typography></Container>
  return <Container maxWidth="md" className="page-wrap"><Box className="confirmation-card"><CheckCircleOutlineIcon sx={{ fontSize: 58, color: 'success.main' }} /><Typography className="eyebrow" mt={2}>DEMO ORDER CONFIRMED</Typography><Typography variant="h2" component="h1">That’s a wrap.</Typography><Typography color="text.secondary" mt={1}>Your sample order is saved in the local JSON Server. No payment was collected.</Typography><Box className="confirmation-details"><span>Demo order ID</span><b>#{order.id}</b><span>Order total</span><b>{formatCurrency(order.total)}</b></Box><Button component={Link} to="/shop" variant="contained">Back to the collection</Button></Box></Container>
}
