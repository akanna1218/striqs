import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip, Grid,
  Skeleton, Stack, Typography,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { discountPercent, formatCurrency } from '../utils/pricing'

export function SectionHeading({ eyebrow, title, body, link, linkText = 'Explore all' }) {
  return (
    <Box className="section-heading">
      <Box>
        {eyebrow && <Typography className="eyebrow">{eyebrow}</Typography>}
        <Typography variant="h2" component="h2">{title}</Typography>
        {body && <Typography color="text.secondary" sx={{ mt: 1 }}>{body}</Typography>}
      </Box>
      {link && <Button component={Link} to={link} endIcon={<ArrowForwardIcon />}>{linkText}</Button>}
    </Box>
  )
}

export function PriceDisplay({ price, originalPrice }) {
  const discount = discountPercent(price, originalPrice)
  return <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
    <Typography fontWeight={700}>{formatCurrency(price)}</Typography>
    {originalPrice > price && <Typography className="old-price">{formatCurrency(originalPrice)}</Typography>}
    {discount > 0 && <Typography className="discount-text">{discount}% off</Typography>}
  </Stack>
}

export function ProductCard({ product }) {
  const [broken, setBroken] = useState(false)
  const image = broken ? 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=80' : product.image
  return (
    <Card className="product-card">
      <CardActionArea component={Link} to={`/products/${product.slug}`}>
        <Box className="product-image-wrap">
          <CardMedia component="img" image={image} alt={product.title} onError={() => setBroken(true)} />
          {discountPercent(product.price, product.originalPrice) > 0 && <Chip className="sale-chip" label={`${discountPercent(product.price, product.originalPrice)}% off`} size="small" />}
        </Box>
        <CardContent className="product-card-content">
          <Typography variant="subtitle1" fontWeight={700}>{product.title}</Typography>
          <Typography variant="caption" color="text.secondary">{product.productType === 'single' ? 'Art print' : `${product.productType.replace('split-', '')}-piece set`}</Typography>
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} />
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export function ProductGrid({ products, loading = false, emptyText = 'No posters match those filters.' }) {
  if (loading) return <Grid container spacing={2.5}>{Array.from({ length: 8 }, (_, i) => <Grid key={i} size={{ xs: 6, md: 3 }}><Skeleton variant="rounded" height={260} /><Skeleton width="75%" /><Skeleton width="42%" /></Grid>)}</Grid>
  if (!products.length) return <Box className="empty-state"><Typography variant="h5">Nothing on this wall yet.</Typography><Typography color="text.secondary">{emptyText}</Typography></Box>
  return <Grid container spacing={{ xs: 1.5, sm: 2.5 }}>{products.map((product) => <Grid key={product.id} size={{ xs: 6, md: 4, lg: 3 }}><ProductCard product={product} /></Grid>)}</Grid>
}

export function ErrorState({ message, retry }) {
  return <Box className="empty-state error-state"><Typography variant="h5">We couldn’t load this right now.</Typography><Typography color="text.secondary">{message}</Typography>{retry && <Button onClick={retry} variant="outlined">Try again</Button>}</Box>
}

export function LoadingPage() {
  return <Box className="page-wrap"><Skeleton width="45%" height={55} /><Grid container spacing={2}>{[1, 2, 3, 4].map((item) => <Grid key={item} size={{ xs: 6, md: 3 }}><Skeleton variant="rounded" height={300} /></Grid>)}</Grid></Box>
}
