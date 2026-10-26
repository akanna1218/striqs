import { useEffect, useMemo, useReducer } from 'react'
import { cartSubtotal, eligibleDiscount } from '../utils/pricing'
import CartContext from './CartStateContext'
const storageKey = 'striqs-cart'

const readCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Could not restore cart from local storage.', error)
    return []
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'add': {
      const index = state.findIndex((item) => item.key === action.item.key)
      if (index < 0) return [...state, action.item]
      return state.map((item, itemIndex) => itemIndex === index
        ? { ...item, quantity: item.quantity + action.item.quantity }
        : item)
    }
    case 'quantity':
      return state.map((item) => item.key === action.key
        ? { ...item, quantity: Math.max(1, action.quantity) }
        : item)
    case 'remove':
      return state.filter((item) => item.key !== action.key)
    case 'clear':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, readCart)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items))
    } catch (error) {
      console.error('Could not save cart to local storage.', error)
    }
  }, [items])

  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cartSubtotal(items),
    addItem: (item) => dispatch({ type: 'add', item }),
    updateQuantity: (key, quantity) => dispatch({ type: 'quantity', key, quantity }),
    removeItem: (key) => dispatch({ type: 'remove', key }),
    clearCart: () => dispatch({ type: 'clear' }),
    discount: (offers) => eligibleDiscount(items, offers),
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
