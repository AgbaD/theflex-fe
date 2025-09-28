// lib/axios.ts
import axios from "axios";
import { logout } from '../lib/auth';

let isLoggingOut = false;
const baseURL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:5000/api";

const apiBase = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

apiBase.interceptors.response.use(
  (response) => {
    if (response.status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      logout();
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      logout();
    }
    return Promise.reject(error);
  }
);
export default apiBase;
