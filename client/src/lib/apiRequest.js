import axios from "axios";
import Cookies from "js-cookie";

const apiRequest = axios.create({
  baseURL: "http://localhost:8800/api", // Your backend URL
  withCredentials: true, // Crucial: Send cookies with requests
});

// Optional: Add a request interceptor to include the JWT in headers (if needed)
apiRequest.interceptors.request.use((config) => {
  // Retrieve the JWT from cookies (example using 'js-cookie' library)
  const token = Cookies.get("Authentication");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 (Unauthorized) errors
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login or handle unauthorized access (e.g., show a message)
      console.error("Unauthorized! Redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiRequest;
