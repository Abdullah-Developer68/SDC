import { handleResponse, setToken, setUser } from "./utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Register a new user
 * @param {Object} credentials - { username, email, password }
 */
export async function signupUser({ username, email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await handleResponse(response);

  if (data.token) {
    setToken(data.token);
  }
  if (data.user) {
    setUser(data.user);
  }

  return data;
}

/**
 * Login an existing user
 * @param {Object} credentials - { email, password }
 */
export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);

  if (data.token) {
    setToken(data.token);
  }
  if (data.user) {
    setUser(data.user);
  }

  return data;
}

// Re-export utility functions so consumers can access them from api or utils/auth
export {
  getToken,
  setToken,
  getUser,
  setUser,
  isAuthenticated,
  logoutUser,
  getAuthHeaders,
} from "./utils/auth";
