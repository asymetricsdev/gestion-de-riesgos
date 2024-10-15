import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error en el interceptor:", error);
      return Promise.reject(error); 
    }
  },
  (error) => {
    return Promise.reject(error); 
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/refresh-token`, { token: refreshToken });
          const newToken = response.data.token;
          
          localStorage.setItem('token', newToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          
          return axiosInstance(originalRequest); 
        } catch (error) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
