// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api/v1",
// });

// // Add token to all requests if exists
// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("pharmacy_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

// export default api;
// app/lib/axios.ts
// app/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('pharma_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - DON'T auto-redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Response Error:", error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      console.log("🔐 API: 401 Unauthorized - Token may be invalid/expired");
      
      // Only clear tokens, don't redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('pharma_token');
      localStorage.removeItem('pharma_user');
      
      delete axios.defaults.headers.common['Authorization'];
      
      console.log("⚠️ API: Tokens cleared. Auth context will handle redirect.");
    }
    
    return Promise.reject(error);
  }
);

export default api;