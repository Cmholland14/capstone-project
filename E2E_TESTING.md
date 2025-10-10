# End-to-End Testing with Playwright

## Installation
```bash
npm install --save-dev @playwright/test
npx playwright install
```

## Configuration
Create `playwright.config.js`:

```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
```

## Sample E2E Tests

### Complete User Journey Test
```javascript
import { test, expect } from '@playwright/test'

test('complete shopping flow', async ({ page }) => {
  // 1. Visit homepage
  await page.goto('/')
  await expect(page.getByText('Premium New Zealand Wool Products')).toBeVisible()

  // 2. Navigate to products
  await page.click('text=Shop Collection')
  await expect(page.getByText('Our Premium Wool Collection')).toBeVisible()

  // 3. Click on a product
  await page.click('.product-card').first()
  await expect(page.getByText('Add to Cart')).toBeVisible()

  // 4. Sign in first
  await page.click('text=Sign In')
  await page.fill('input[type="email"]', 'test@example.com')
  await page.fill('input[type="password"]', 'password123')
  await page.click('button[type="submit"]')

  // 5. Add product to cart
  await page.goto('/products')
  await page.click('.product-card').first()
  await page.click('text=Add to Cart')

  // 6. Go to cart
  await page.click('text=🛒 Cart')
  await expect(page.getByText('Your Cart')).toBeVisible()

  // 7. Proceed to checkout
  await page.click('text=Checkout')
  await expect(page.getByText('Checkout')).toBeVisible()

  // 8. Complete order
  await page.click('text=Place Order')
  await expect(page.getByText('Order Confirmation')).toBeVisible()
})

test('admin functionality', async ({ page }) => {
  // 1. Login as admin
  await page.goto('/auth/signin')
  await page.fill('input[type="email"]', 'admin@woolstore.com')
  await page.fill('input[type="password"]', 'admin123')
  await page.click('button[type="submit"]')

  // 2. Access admin dashboard
  await page.click('text=Admin')
  await expect(page.getByText('Admin Dashboard')).toBeVisible()

  // 3. Test user management
  await page.click('text=User Management')
  await page.click('text=Add New User')
  await page.fill('input[id="userName"]', 'Test User')
  await page.fill('input[id="userEmail"]', 'newuser@test.com')
  await page.fill('input[id="userPassword"]', 'password123')
  await page.click('button[type="submit"]')

  // 4. Test product management
  await page.click('text=Product Management')
  await expect(page.getByText('Product Management')).toBeVisible()
})
```

## Running E2E Tests
```bash
# Run all E2E tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run specific test
npx playwright test complete-shopping-flow

# Generate test report
npx playwright show-report
```