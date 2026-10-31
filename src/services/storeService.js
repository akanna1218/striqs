import apiClient from './apiClient'
import mockData from '../../db.json'

const readLocalStorage = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const writeLocalStorage = (key, value) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore storage quota issues during static hosting
  }
}

const fallbackData = {
  products: mockData.products || [],
  categories: mockData.categories || [],
  wallLayouts: mockData.wallLayouts || [],
  offers: mockData.offers || [],
  faqs: mockData.faqs || [],
}

const fetchWithFallback = async (endpoint, key) => {
  try {
    const { data } = await apiClient.get(endpoint)
    return data ?? fallbackData[key]
  } catch {
    return fallbackData[key]
  }
}

export const getProducts = async () => fetchWithFallback('/products', 'products')

export const getProduct = async (slug) => {
  try {
    const { data } = await apiClient.get('/products', { params: { slug } })
    return data[0] || fallbackData.products.find((product) => product.slug === slug) || null
  } catch {
    return fallbackData.products.find((product) => product.slug === slug) || null
  }
}

export const getCategories = async () => fetchWithFallback('/categories', 'categories')
export const getLayouts = async () => fetchWithFallback('/wallLayouts', 'wallLayouts')
export const getOffers = async () => fetchWithFallback('/offers', 'offers')
export const getFaqs = async () => fetchWithFallback('/faqs', 'faqs')

export const createOrder = async (order) => {
  try {
    const { data } = await apiClient.post('/orders', order)
    return data
  } catch {
    const nextOrder = {
      ...order,
      id: `mock-order-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    const orders = readLocalStorage('striqs-orders', [])
    const updatedOrders = [...orders, nextOrder]
    writeLocalStorage('striqs-orders', updatedOrders)
    return nextOrder
  }
}

export const getOrder = async (id) => {
  try {
    const { data } = await apiClient.get(`/orders/${id}`)
    return data
  } catch {
    const orders = readLocalStorage('striqs-orders', [])
    return orders.find((order) => order.id === id) || null
  }
}
