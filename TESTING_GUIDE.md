# Testing Setup for Capstone Wool Store

## Overview
This document outlines how to set up and run automated tests for the application.

## Testing Stack
- **Jest**: JavaScript testing framework
- **React Testing Library**: For component testing
- **Supertest**: For API endpoint testing
- **MongoDB Memory Server**: For database testing

## Installation
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom supertest mongodb-memory-server
```

## Configuration Files
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test setup and global configurations
- `__tests__/` - Test files directory

## Test Categories
1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: API endpoints and database operations
3. **Component Tests**: React component behavior
4. **E2E Tests**: Full user workflows (recommended: Playwright or Cypress)

## Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

## Test Structure
```
__tests__/
├── components/
│   ├── Navbar.test.js
│   ├── ProductCard.test.js
│   └── CartContext.test.js
├── api/
│   ├── auth.test.js
│   ├── products.test.js
│   └── cart.test.js
├── pages/
│   ├── homepage.test.js
│   ├── products.test.js
│   └── checkout.test.js
└── utils/
    └── helpers.test.js
```

## Sample Test Examples
See individual test files for implementation examples.