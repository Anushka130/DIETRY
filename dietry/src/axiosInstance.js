// src/axiosInstance.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add Authorization Header Automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(sessionStorage.getItem("diet-user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
