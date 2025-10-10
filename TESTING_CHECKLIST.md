# Manual Testing Checklist for Capstone Wool Store

## 🏠 Homepage Testing
- [ ] Page loads correctly with proper styling
- [ ] Hero section displays with wool product image
- [ ] "Shop Collection" button navigates to products page
- [ ] Features section (100% Pure Wool, Handcrafted, Sustainable) displays
- [ ] About section loads with image and content
- [ ] "Our Premium Collection" shows 3 products
- [ ] Product cards in collection are clickable
- [ ] Call-to-action section functions properly
- [ ] Footer info displays correctly
## 🔐 Authentication Testing
### Registration
- [ ] Sign up form validates required fields
- [ ] Password confirmation works
- [ ] Duplicate email prevention works
- [ ] Successful registration redirects to account page
- [ ] Error messages display for invalid input

### Login
- [ ] Demo credentials work: admin@woolstore.com / admin123
- [ ] Demo credentials work: test@example.com / password123
- [ ] Invalid credentials show error message
- [ ] Successful login redirects appropriately
- [ ] Remember me functionality (if implemented)

### Logout
- [ ] Logout clears session
- [ ] Redirects to homepage after logout
- [ ] Cart data is preserved/cleared appropriately

## 🛍️ Products & Shopping
### Products Page
- [ ] All products load with images
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] Sorting (name, price, stock) works
- [ ] Product cards display correctly
- [ ] Out of stock indicators work
- [ ] "Add to Cart" buttons function

### Product Detail Pages
- [ ] Individual product pages load via product card clicks
- [ ] Product images display correctly
- [ ] Product information is complete
- [ ] Breadcrumb navigation works
- [ ] Quantity selector functions
- [ ] Add to cart works from detail page
- [ ] Back to products navigation works

### Cart Functionality
- [ ] Items add to cart successfully
- [ ] Cart count updates in navbar
- [ ] Cart page displays items correctly
- [ ] Quantity adjustment works
- [ ] Remove items works
- [ ] Total calculation is accurate
- [ ] Empty cart state displays

### Checkout Process
- [ ] Checkout page loads from cart
- [ ] Order summary displays correctly
- [ ] Customer information form validates
- [ ] Order placement works
- [ ] Order confirmation displays
- [ ] Order appears in customer orders

## 👤 Customer Features
### Account Page
- [ ] Customer account page loads
- [ ] Profile information displays
- [ ] Account settings work (if implemented)

### Orders Page
- [ ] Customer orders page loads
- [ ] Order history displays correctly
- [ ] Order details are accurate
- [ ] Order status is clear

## 🔧 Admin Features
### Admin Dashboard
- [ ] Admin login grants access to dashboard
- [ ] Dashboard displays management cards
- [ ] Navigation to other admin pages works
- [ ] Color scheme matches site design

### User Management
- [ ] User list loads and displays correctly
- [ ] "Add New User" button opens modal
- [ ] New user creation works
- [ ] User roles (customer/admin) can be set
- [ ] User list refreshes after adding
- [ ] Form validation works

### Product Management
- [ ] Product list loads in admin
- [ ] Add new product form works
- [ ] Edit existing products works
- [ ] Delete products works (with confirmation)
- [ ] Image URL validation works
- [ ] Product details update correctly

## 📱 Responsive Design
- [ ] Homepage works on mobile devices
- [ ] Navigation menu works on mobile
- [ ] Product cards stack properly on mobile
- [ ] Forms are usable on mobile
- [ ] Cart page is mobile-friendly
- [ ] Admin pages work on tablets

## 🎨 UI/UX Testing
- [ ] Color scheme is consistent (warm browns)
- [ ] Hover effects work smoothly
- [ ] Loading states display appropriately
- [ ] Error messages are clear and helpful
- [ ] Success feedback is provided
- [ ] Navigation is intuitive

## 🔒 Security Testing
- [ ] Admin pages require admin authentication
- [ ] Users cannot access other users' data
- [ ] Cart data is user-specific
- [ ] Password fields are properly masked
- [ ] Session management works correctly

## ⚡ Performance Testing
- [ ] Pages load within reasonable time
- [ ] Images load and display properly
- [ ] No console errors in browser
- [ ] Database queries complete successfully
- [ ] Large product lists handle well

## 🌐 Cross-Browser Testing
- [ ] Chrome browser compatibility
- [ ] Firefox browser compatibility
- [ ] Safari browser compatibility (if available)
- [ ] Edge browser compatibility

## 📊 Data Testing
- [ ] Seed data loads correctly (run `node seed.js`)
- [ ] Product data displays accurately
- [ ] User data persists correctly
- [ ] Order data is stored properly
- [ ] Database connections are stable

---

## Quick Test Script
1. Run `node seed.js` to populate test data
2. Start server with `npm run dev`
3. Test as admin: admin@woolstore.com / admin123
4. Test as customer: test@example.com / password123
5. Create new user account
6. Add products to cart
7. Complete checkout process
8. Verify admin functionality