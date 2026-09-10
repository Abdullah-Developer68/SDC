const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const { app, server } = require('./src/server');
const mongoose = require('mongoose');
const User = require('./src/models/User');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api/auth`;

async function runTests() {
  console.log('\n=============================================');
  console.log('       RUNNING COMPLETE E2E HTTP TESTS       ');
  console.log('=============================================\n');

  // Wait a moment for server and DB connection
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const uniqueSuffix = Date.now();
  const testUser = {
    name: 'Ada Lovelace',
    email: `ada_${uniqueSuffix}@example.com`,
    password: 'SuperSecretPassword123!',
  };

  let authToken = '';

  try {
    // 1. Health check
    console.log('[TEST 1] GET /api/health');
    const healthRes = await fetch(`http://localhost:${PORT}/api/health`);
    const healthData = await healthRes.json();
    console.log(`  -> Status: ${healthRes.status}, Response:`, healthData);
    if (healthRes.status !== 200) throw new Error('Health check failed');
    console.log('  -> PASSED ✓\n');

    // 2. Signup - Missing fields
    console.log('[TEST 2] POST /api/auth/signup (Validation: Missing Password)');
    const missingRes = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: testUser.name, email: testUser.email }),
    });
    const missingData = await missingRes.json();
    console.log(`  -> Status: ${missingRes.status}, Message: "${missingData.message}"`);
    if (missingRes.status !== 400) throw new Error('Expected 400 for missing fields');
    console.log('  -> PASSED ✓\n');

    // 3. Signup - Short password
    console.log('[TEST 3] POST /api/auth/signup (Validation: Short Password < 6 chars)');
    const shortPwdRes = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: testUser.name, email: testUser.email, password: '123' }),
    });
    const shortPwdData = await shortPwdRes.json();
    console.log(`  -> Status: ${shortPwdRes.status}, Message: "${shortPwdData.message}"`);
    if (shortPwdRes.status !== 400) throw new Error('Expected 400 for short password');
    console.log('  -> PASSED ✓\n');

    // 4. Signup - Valid User
    console.log('[TEST 4] POST /api/auth/signup (Valid User Registration)');
    const signupRes = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const signupData = await signupRes.json();
    console.log(`  -> Status: ${signupRes.status}`);
    console.log(`  -> User ID: ${signupData.user?.id}, Name: ${signupData.user?.name}`);
    console.log(`  -> Token received: ${signupData.token?.substring(0, 30)}...`);
    if (signupRes.status !== 201 || !signupData.token) throw new Error('Signup failed');
    authToken = signupData.token;
    console.log('  -> PASSED ✓\n');

    // 5. Signup - Duplicate Email
    console.log('[TEST 5] POST /api/auth/signup (Duplicate Email Rejection)');
    const dupRes = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const dupData = await dupRes.json();
    console.log(`  -> Status: ${dupRes.status}, Message: "${dupData.message}"`);
    if (dupRes.status !== 409) throw new Error('Expected 409 Conflict for duplicate user');
    console.log('  -> PASSED ✓\n');

    // 6. Login - Wrong Password
    console.log('[TEST 6] POST /api/auth/login (Invalid Password)');
    const wrongPwdRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'WrongPassword999' }),
    });
    const wrongPwdData = await wrongPwdRes.json();
    console.log(`  -> Status: ${wrongPwdRes.status}, Message: "${wrongPwdData.message}"`);
    if (wrongPwdRes.status !== 401) throw new Error('Expected 401 for wrong password');
    console.log('  -> PASSED ✓\n');

    // 7. Login - Non-existent user
    console.log('[TEST 7] POST /api/auth/login (Non-existent Email)');
    const nonExistRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ghost_user_does_not_exist@test.com', password: 'password123' }),
    });
    const nonExistData = await nonExistRes.json();
    console.log(`  -> Status: ${nonExistRes.status}, Message: "${nonExistData.message}"`);
    if (nonExistRes.status !== 401) throw new Error('Expected 401 for unknown user');
    console.log('  -> PASSED ✓\n');

    // 8. Login - Success
    console.log('[TEST 8] POST /api/auth/login (Valid Login)');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    const loginData = await loginRes.json();
    console.log(`  -> Status: ${loginRes.status}`);
    console.log(`  -> Logged in as: ${loginData.user?.name} (${loginData.user?.email})`);
    if (loginRes.status !== 200 || !loginData.token) throw new Error('Login failed');
    authToken = loginData.token;
    console.log('  -> PASSED ✓\n');

    // 9. Protected Endpoint GET /api/auth/me with valid Bearer token
    console.log('[TEST 9] GET /api/auth/me (Authenticated with JWT Bearer)');
    const meRes = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    const meData = await meRes.json();
    console.log(`  -> Status: ${meRes.status}`);
    console.log(`  -> Verified user from DB: ${meData.user?.name} (email: ${meData.user?.email})`);
    if (meRes.status !== 200 || meData.user?.email !== testUser.email.toLowerCase()) {
      throw new Error('Protected route verification failed');
    }
    console.log('  -> PASSED ✓\n');

    // 10. Protected Endpoint GET /api/auth/me without token
    console.log('[TEST 10] GET /api/auth/me (Unauthorized request without token)');
    const noTokenRes = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const noTokenData = await noTokenRes.json();
    console.log(`  -> Status: ${noTokenRes.status}, Message: "${noTokenData.message}"`);
    if (noTokenRes.status !== 401) throw new Error('Expected 401 Unauthorized for missing token');
    console.log('  -> PASSED ✓\n');

    // 11. Protected Endpoint GET /api/auth/me with invalid/tampered token
    console.log('[TEST 11] GET /api/auth/me (Unauthorized request with tampered token)');
    const tamperedRes = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}tampered`,
      },
    });
    const tamperedData = await tamperedRes.json();
    console.log(`  -> Status: ${tamperedRes.status}, Message: "${tamperedData.message}"`);
    if (tamperedRes.status !== 401) throw new Error('Expected 401 Unauthorized for tampered token');
    console.log('  -> PASSED ✓\n');

    // Cleanup DB record
    console.log('Cleaning up test user record from MongoDB Atlas...');
    await User.deleteOne({ email: testUser.email.toLowerCase() });
    console.log('Test record cleaned up successfully.\n');

    console.log('=============================================');
    console.log('     ALL 11 E2E TESTS PASSED SUCCESSFULLY!   ');
    console.log('=============================================\n');
  } catch (err) {
    console.error('Test Suite Failed:', err);
  } finally {
    await mongoose.disconnect();
    server.close();
    process.exit(0);
  }
}

runTests();
