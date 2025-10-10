// Simple test to verify Jest setup
describe('Jest Setup', () => {
  test('should work correctly', () => {
    expect(1 + 1).toBe(2)
  })

  test('should have access to jest globals', () => {
    expect(typeof describe).toBe('function')
    expect(typeof test).toBe('function')
    expect(typeof expect).toBe('function')
  })
})