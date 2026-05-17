async function testExport() {
  try {
    // 1. Login to get token
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    console.log('Login successful');

    // 2. Fetch CSV Export with query params
    const exportRes = await fetch('http://localhost:5000/api/v1/leads/export?search=&status=&source=&sort=-createdAt', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Export Status:', exportRes.status);
    console.log('Export Headers:', exportRes.headers);
    const text = await exportRes.text();
    console.log('Export Data (length):', text.length);
    console.log('Export Data (start):', text.slice(0, 100));

  } catch (error) {
    console.error('Error during export:', error);
  }
}

testExport();
