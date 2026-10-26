export const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(amount || 0)

export const discountPercent = (price, originalPrice) => originalPrice > price
  ? Math.round(((originalPrice - price) / originalPrice) * 100)
  : 0

export const cartSubtotal = (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const eligibleDiscount = (items, offers) => {
  const singles = items.filter((item) => item.type === 'single')
  const eligibleOffer = offers.find((offer) => offer.type === 'quantity-percentage'
    && singles.reduce((count, item) => count + item.quantity, 0) >= offer.minimumQuantity)
  if (!eligibleOffer) return { amount: 0, offer: null }
  const eligibleTotal = singles.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { amount: Math.round(eligibleTotal * eligibleOffer.discountPercentage / 100), offer: eligibleOffer }
}

export const isWallComplete = (layout, selections) => Boolean(layout)
  && layout.slots === Object.values(selections).filter(Boolean).length
