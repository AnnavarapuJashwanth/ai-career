import axios from 'axios';

// Auto-detect environment and use appropriate API URL
const getApiBaseUrl = () => {
  // Check for environment variable first (set in Netlify)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect based on hostname
  const hostname = window.location.hostname;
  
  // Production Netlify deployment
  if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
    return 'https://ai-career-hect.onrender.com/api';
  }
  
  // Local development
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL in development
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90 seconds for AI operations (resume parsing, roadmap generation)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
