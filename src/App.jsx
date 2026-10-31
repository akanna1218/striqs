import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect } from 'react'
import theme from './app/theme'
import { CartProvider } from './context/CartContext'
import SiteLayout from './components/SiteLayout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import WallBuilderPage from './pages/WallBuilderPage'
import CustomPostersPage from './pages/CustomPostersPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import './App.css'

function NotFoundPage() {
  return <div className="not-found"><span className="eyebrow">404 · WRONG WALL</span><h1>This page wandered off.</h1><p>Let’s get you back to the good stuff.</p><a href="/">Back home</a></div>
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''))
      if (element) {
        window.scrollTo({ top: element.offsetTop - 90, behavior: 'smooth' })
        return
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/collections" element={<ShopPage />} />
              <Route path="/collections/:categoryId" element={<ShopPage />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/build-your-wall" element={<WallBuilderPage />} />
              <Route path="/custom-posters" element={<CustomPostersPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders/:id" element={<OrderConfirmationPage />} />
              <Route path="/not-found" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  )
}
