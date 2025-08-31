import axios from 'axios';
import { getUser } from '../context/AuthContext'; // Adjust import as per your project

// Create Axios instance
const api = axios.create({
  baseURL: '/api',  // Using proxy, no server URL here
});

// Request interceptor to add user ID header if logged in
api.interceptors.request.use(config => {
  const user = getUser();  // Replace with your method to get current user from context/state
  if (user && user._id) {
    config.headers['X-User-Id'] = user._id;
  }
  return config;
}, error => Promise.reject(error));

export default api;
