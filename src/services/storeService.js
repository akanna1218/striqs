import apiClient from './apiClient'

export const getProducts = async () => (await apiClient.get('/products')).data
export const getProduct = async (slug) => {
  const { data } = await apiClient.get('/products', { params: { slug } })
  return data[0] || null
}
export const getCategories = async () => (await apiClient.get('/categories')).data
export const getLayouts = async () => (await apiClient.get('/wallLayouts')).data
export const getOffers = async () => (await apiClient.get('/offers')).data
export const getFaqs = async () => (await apiClient.get('/faqs')).data
export const createOrder = async (order) => (await apiClient.post('/orders', order)).data
export const getOrder = async (id) => (await apiClient.get(`/orders/${id}`)).data
