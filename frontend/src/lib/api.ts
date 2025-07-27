// API configuration utility
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function for making authenticated API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("access_token");

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // First, try with JWT token if available
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // Always include cookies for Django session auth
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle token refresh if needed for JWT users
  if (response.status === 401 && token) {
    // Token might be expired, try to refresh
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(
          `${API_BASE_URL}/api/token/refresh/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
          }
        );

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem("access_token", data.access);

          // Retry original request with new token
          config.headers = {
            ...defaultHeaders,
            Authorization: `Bearer ${data.access}`,
            ...options.headers,
          };
          return fetch(`${API_BASE_URL}${endpoint}`, config);
        }
      } catch (error) {
        // Refresh failed, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/auth";
      }
    }
  }

  return response;
};

export default API_BASE_URL;
