import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  Box, Button, Container, FormControl, InputLabel, MenuItem, Select,
  Stack, Typography,
} from '@mui/material'
import { getCategories, getProducts } from '../services/storeService'
import { ErrorState, ProductGrid } from '../components/Catalog'

export default function ShopPage() {
  const { categoryId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const search = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'popular'
  const type = searchParams.get('type') || 'all'

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([getProducts(), getCategories()])
      .then(([productData, categoryData]) => { setProducts(productData); setCategories(categoryData) })
      .catch((requestError) => { console.error('Could not load shop data.', requestError); setError('The catalogue is unavailable. Start the JSON Server and try again.') })
      .finally(() => setLoading(false))
  }
  useEffect(() => {
    let active = true
    Promise.all([getProducts(), getCategories()])
      .then(([productData, categoryData]) => {
        if (active) { setProducts(productData); setCategories(categoryData) }
      })
      .catch((requestError) => {
        if (!active) return
        console.error('Could not load shop data.', requestError)
        setError('The catalogue is unavailable. Start the JSON Server and try again.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = !categoryId || product.categoryId === categoryId
      const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase())
      const matchesType = type === 'all' || (type === 'single' ? product.productType === 'single' : product.productType.startsWith('split'))
      return matchesCategory && matchesSearch && matchesType
    })
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sort === 'newest') result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (sort === 'popular') result.sort((a, b) => b.popularity - a.popularity)
    return result
  }, [products, categoryId, search, sort, type])

  const title = categoryId ? categories.find((category) => category.id === categoryId)?.name || 'Collection' : 'All posters'
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'all' || !value) next.delete(key)
    else next.set(key, value)
    setPage(1)
    setSearchParams(next)
  }

  return <Container maxWidth="lg" className="page-wrap">
    <Box className="shop-heading"><Typography className="eyebrow">A COLLECTION FOR EVERY CORNER</Typography><Typography variant="h1" component="h1">{title}<span className="count-label"> ({filtered.length})</span></Typography><Typography color="text.secondary">Find the art that feels like it already belongs.</Typography></Box>
    {error && <ErrorState message={error} retry={load} />}
    <Stack className="shop-controls" direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5}>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Button component={Link} to="/shop" variant={!categoryId ? 'contained' : 'outlined'} size="small">All</Button>
        {categories.map((category) => <Button key={category.id} component={Link} to={`/collections/${category.id}`} variant={categoryId === category.id ? 'contained' : 'outlined'} size="small">{category.name}</Button>)}
      </Stack>
      <Stack direction="row" spacing={1.2}>
        <FormControl size="small" sx={{ minWidth: 140 }}><InputLabel id="type-label">Print type</InputLabel><Select labelId="type-label" label="Print type" value={type} onChange={(event) => updateParam('type', event.target.value)}><MenuItem value="all">All prints</MenuItem><MenuItem value="single">Single posters</MenuItem><MenuItem value="split">Split sets</MenuItem></Select></FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}><InputLabel id="sort-label">Sort by</InputLabel><Select labelId="sort-label" label="Sort by" value={sort} onChange={(event) => updateParam('sort', event.target.value)}><MenuItem value="popular">Popularity</MenuItem><MenuItem value="newest">Newest</MenuItem><MenuItem value="price-asc">Price: low to high</MenuItem><MenuItem value="price-desc">Price: high to low</MenuItem></Select></FormControl>
      </Stack>
    </Stack>
    <ProductGrid products={filtered.slice(0, page * 8)} loading={loading} />
    {!loading && filtered.length > page * 8 && <Box className="load-more"><Button variant="outlined" onClick={() => setPage((current) => current + 1)}>Load more posters</Button></Box>}
  </Container>
}
