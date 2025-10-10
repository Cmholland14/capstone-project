// Simple utility function tests to demonstrate Jest setup
describe('Utility Functions', () => {
  test('should add two numbers correctly', () => {
    const add = (a, b) => a + b
    expect(add(2, 3)).toBe(5)
  })

  test('should validate email format', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
    
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('admin@woolstore.com')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })

  test('should format currency correctly', () => {
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)
    }
    
    expect(formatCurrency(19.99)).toBe('$19.99')
    expect(formatCurrency(100)).toBe('$100.00')
  })

  test('should calculate cart total correctly', () => {
    const calculateTotal = (items) => {
      return items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    }
    
    const cartItems = [
      { price: 19.99, quantity: 2 },
      { price: 15.50, quantity: 1 },
      { price: 25.00, quantity: 3 }
    ]
    
    expect(calculateTotal(cartItems)).toBe(130.48)
  })

  test('should validate product stock', () => {
    const checkStock = (requestedQuantity, availableStock) => {
      if (availableStock <= 0) return 'out_of_stock'
      if (requestedQuantity > availableStock) return 'insufficient_stock'
      return 'available'
    }
    
    expect(checkStock(2, 10)).toBe('available')
    expect(checkStock(5, 3)).toBe('insufficient_stock')
    expect(checkStock(1, 0)).toBe('out_of_stock')
  })
})