// Test script for user registration
async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    const testUser = {
      name: 'New Test User',
      email: 'newuser@example.com',
      password: 'password123',
      role: 'customer'
    };

    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('User created:', data.user);
    } else {
      console.log('❌ Registration failed:', data.error);
    }
    
    // Test login with the new user
    console.log('\nTesting login with new user...');
    
    const loginResponse = await fetch('http://localhost:3001/api/simple-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
        action: 'login'
      }),
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log('Session created for:', loginData.user);
    } else {
      console.log('❌ Login failed:', loginData.error);
    }
    
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testRegistration();