const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/auth';

/**
 * Register a new user
 * @param {Object} credentials - { name, email, password }
 */
export async function signupApi({ name, email, password }) {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to sign up');
  }

  return data;
}

/**
 * Log in an existing user
 * @param {Object} credentials - { email, password }
 */
export async function loginApi({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to log in');
  }

  return data;
}

/**
 * Fetch authenticated user details using JWT
 * @param {string} token - Bearer JWT token
 */
export async function getMeApi(token) {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to verify session');
  }

  return data;
}

